import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3005;

app.use(express.json());

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Health endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Endpoint: Live Vehicle Pricing, RTO & Subsidy Lookup
app.post("/api/vehicle-price", async (req, res) => {
  const { modelName, cityRegion = "Delhi NCR", fuelType = "ev", currency = "INR" } = req.body;
  const ai = getGeminiClient();

  const fallbackData = {
    modelName: modelName || "Target Car Model",
    cityRegion,
    exShowroomPrice: currency === "INR" ? (fuelType === "ev" ? 1450000 : 1150000) : 22000,
    rtoRoadTaxCost: currency === "INR" ? (fuelType === "ev" ? 15000 : 120000) : 1800, // EVs have 0-1% RTO tax in many Indian states
    estimatedInsurance: currency === "INR" ? 35000 : 1200,
    stateEVSubsidy: currency === "INR" ? (fuelType === "ev" ? 50000 : 0) : 0,
    bassChassisPrice: currency === "INR" ? 999000 : 15000,
    totalOnRoadPrice: currency === "INR" ? (fuelType === "ev" ? 1450000 : 1235000) : 23000,
    notes: "Estimated pricing (Local fallback data)."
  };

  if (!ai) {
    return res.json({ success: true, data: fallbackData, source: "default" });
  }

  try {
    const prompt = `Search for current ex-showroom price, state road tax (RTO), insurance cost, and state EV subsidies for car model: "${modelName}" in city/region: "${cityRegion}". Currency: ${currency}.
Respond strictly in JSON:
{
  "exShowroomPrice": number,
  "rtoRoadTaxCost": number,
  "estimatedInsurance": number,
  "stateEVSubsidy": number,
  "bassChassisPrice": number,
  "totalOnRoadPrice": number,
  "notes": string
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            exShowroomPrice: { type: Type.NUMBER },
            rtoRoadTaxCost: { type: Type.NUMBER },
            estimatedInsurance: { type: Type.NUMBER },
            stateEVSubsidy: { type: Type.NUMBER },
            bassChassisPrice: { type: Type.NUMBER },
            totalOnRoadPrice: { type: Type.NUMBER },
            notes: { type: Type.STRING }
          },
          required: ["exShowroomPrice", "rtoRoadTaxCost", "estimatedInsurance", "stateEVSubsidy", "totalOnRoadPrice", "notes"]
        }
      }
    });

    let parsed: any = {};
    try {
      parsed = JSON.parse(response.text?.trim() || "{}");
    } catch {
      parsed = {};
    }

    return res.json({
      success: true,
      data: {
        modelName,
        cityRegion,
        exShowroomPrice: Number(parsed.exShowroomPrice) || fallbackData.exShowroomPrice,
        rtoRoadTaxCost: Number(parsed.rtoRoadTaxCost) || fallbackData.rtoRoadTaxCost,
        estimatedInsurance: Number(parsed.estimatedInsurance) || fallbackData.estimatedInsurance,
        stateEVSubsidy: Number(parsed.stateEVSubsidy) || fallbackData.stateEVSubsidy,
        bassChassisPrice: Number(parsed.bassChassisPrice) || fallbackData.bassChassisPrice,
        totalOnRoadPrice: Number(parsed.totalOnRoadPrice) || fallbackData.totalOnRoadPrice,
        notes: parsed.notes || "Live search on-road price estimates."
      },
      source: "gemini_live"
    });
  } catch (err: any) {
    console.log("Vehicle price lookup using local benchmark fallback.");
    return res.json({ success: true, data: fallbackData, source: "fallback_handled" });
  }
});

// Endpoint: Live DISCOM Electricity Slab & Tariff Lookup
app.post("/api/eb-slabs", async (req, res) => {
  const { cityRegion = "Bengaluru", currency = "INR" } = req.body;
  const ai = getGeminiClient();

  const fallbackData = {
    cityRegion,
    discomName: cityRegion.toLowerCase().includes("bengaluru") ? "BESCOM" : cityRegion.toLowerCase().includes("delhi") ? "BSES Delhi" : "State DISCOM",
    baseRatePerKWh: currency === "INR" ? 7.20 : 0.16,
    slab1Rate: currency === "INR" ? 4.50 : 0.10, // 0-100 units
    slab2Rate: currency === "INR" ? 7.00 : 0.15, // 101-300 units
    slab3Rate: currency === "INR" ? 8.50 : 0.22, // 300+ units
    offPeakRatePerKWh: currency === "INR" ? 5.00 : 0.11,
    fixedMonthlyCharges: currency === "INR" ? 110 : 15,
    notes: "Default state tariff slabs."
  };

  if (!ai) {
    return res.json({ success: true, data: fallbackData, source: "default" });
  }

  try {
    const prompt = `Search for current residential electricity tariff slab rates (DISCOM) for location: "${cityRegion}". Currency: ${currency}.
Respond strictly in JSON:
{
  "discomName": string,
  "baseRatePerKWh": number,
  "slab1Rate": number,
  "slab2Rate": number,
  "slab3Rate": number,
  "offPeakRatePerKWh": number,
  "fixedMonthlyCharges": number,
  "notes": string
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            discomName: { type: Type.STRING },
            baseRatePerKWh: { type: Type.NUMBER },
            slab1Rate: { type: Type.NUMBER },
            slab2Rate: { type: Type.NUMBER },
            slab3Rate: { type: Type.NUMBER },
            offPeakRatePerKWh: { type: Type.NUMBER },
            fixedMonthlyCharges: { type: Type.NUMBER },
            notes: { type: Type.STRING }
          },
          required: ["discomName", "baseRatePerKWh", "offPeakRatePerKWh", "notes"]
        }
      }
    });

    let parsed: any = {};
    try {
      parsed = JSON.parse(response.text?.trim() || "{}");
    } catch {
      parsed = {};
    }

    return res.json({
      success: true,
      data: {
        cityRegion,
        discomName: parsed.discomName || fallbackData.discomName,
        baseRatePerKWh: Number(parsed.baseRatePerKWh) || fallbackData.baseRatePerKWh,
        slab1Rate: Number(parsed.slab1Rate) || fallbackData.slab1Rate,
        slab2Rate: Number(parsed.slab2Rate) || fallbackData.slab2Rate,
        slab3Rate: Number(parsed.slab3Rate) || fallbackData.slab3Rate,
        offPeakRatePerKWh: Number(parsed.offPeakRatePerKWh) || fallbackData.offPeakRatePerKWh,
        fixedMonthlyCharges: Number(parsed.fixedMonthlyCharges) || fallbackData.fixedMonthlyCharges,
        notes: parsed.notes || "Live DISCOM tariff search."
      },
      source: "gemini_live"
    });
  } catch (err: any) {
    console.log("EB slabs lookup using local benchmark fallback.");
    return res.json({ success: true, data: fallbackData, source: "fallback_handled" });
  }
});

// Endpoint: Real-time Fuel & Energy Price Monitoring by Region
app.post("/api/rates", async (req, res) => {
  const { locationCityRegion, currency = "USD" } = req.body;
  const ai = getGeminiClient();

  const fallbackRates: Record<string, any> = {
    cityRegion: locationCityRegion || "Global Average",
    currency: currency,
    currencySymbol: currency === "INR" ? "₹" : currency === "EUR" ? "€" : currency === "GBP" ? "£" : "$",
    petrolPricePerLiter: currency === "INR" ? 102.50 : currency === "EUR" ? 1.85 : currency === "GBP" ? 1.45 : 1.15,
    electricityRatePerKWh: currency === "INR" ? 7.50 : currency === "EUR" ? 0.32 : currency === "GBP" ? 0.28 : 0.16,
    publicChargerRatePerKWh: currency === "INR" ? 18.00 : currency === "EUR" ? 0.55 : currency === "GBP" ? 0.50 : 0.35,
    gridCarbonIntensity: 450,
    lastUpdated: new Date().toISOString().split("T")[0],
    notes: "Benchmark regional tariff estimate."
  };

  if (!ai) {
    return res.json({ success: true, data: fallbackRates, source: "default" });
  }

  try {
    const prompt = `Provide current typical real-world petrol (gasoline) price per liter, home electricity tariff rate per kWh, and public EV fast charging rate per kWh for the location: "${locationCityRegion || "California, USA"}". Use currency ${currency}.
Respond strictly in JSON with format:
{
  "petrolPricePerLiter": number,
  "electricityRatePerKWh": number,
  "publicChargerRatePerKWh": number,
  "gridCarbonIntensity": number (g CO2/kWh),
  "notes": string (short 1-sentence context)
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            petrolPricePerLiter: { type: Type.NUMBER },
            electricityRatePerKWh: { type: Type.NUMBER },
            publicChargerRatePerKWh: { type: Type.NUMBER },
            gridCarbonIntensity: { type: Type.NUMBER },
            notes: { type: Type.STRING }
          },
          required: ["petrolPricePerLiter", "electricityRatePerKWh", "publicChargerRatePerKWh", "gridCarbonIntensity", "notes"]
        }
      }
    });

    let parsed: any = {};
    try {
      parsed = JSON.parse(response.text?.trim() || "{}");
    } catch {
      parsed = {};
    }

    return res.json({
      success: true,
      data: {
        cityRegion: locationCityRegion,
        currency,
        currencySymbol: currency === "INR" ? "₹" : currency === "EUR" ? "€" : currency === "GBP" ? "£" : "$",
        petrolPricePerLiter: Number(parsed.petrolPricePerLiter) || fallbackRates.petrolPricePerLiter,
        electricityRatePerKWh: Number(parsed.electricityRatePerKWh) || fallbackRates.electricityRatePerKWh,
        publicChargerRatePerKWh: Number(parsed.publicChargerRatePerKWh) || fallbackRates.publicChargerRatePerKWh,
        gridCarbonIntensity: Number(parsed.gridCarbonIntensity) || fallbackRates.gridCarbonIntensity,
        lastUpdated: new Date().toISOString().split("T")[0],
        notes: parsed.notes || "Live search powered estimates."
      },
      source: "gemini_live"
    });
  } catch (err: any) {
    console.log("Live rates lookup using regional benchmark fallback.");
    return res.json({ success: true, data: fallbackRates, source: "fallback_handled" });
  }
});

// Endpoint: AI Recommendation & Purchase Advisor
app.post("/api/recommendation", async (req, res) => {
  const { settings, petrolInput, evInput, financialSummary } = req.body;
  const ai = getGeminiClient();

  const generateFallbackRecommendation = () => {
    const winner: "bass_ev" | "standard_ev" | "petrol" = 
      financialSummary?.bassEVTotalTCO < financialSummary?.standardEVTotalTCO && financialSummary?.bassEVTotalTCO < financialSummary?.petrolTotalTCO
        ? "bass_ev"
        : financialSummary?.standardEVTotalTCO < financialSummary?.petrolTotalTCO
        ? "standard_ev"
        : "petrol";

    const winnerTitle = winner === "bass_ev" 
      ? "Battery as a Service (BASS) EV Option Wins"
      : winner === "standard_ev"
      ? "Standard Upfront EV Option Wins"
      : "Petrol Vehicle Retains Lower Initial TCO";

    const currencySymbol = settings?.currencySymbol || "₹";
    const annualKm = settings?.annualKm ? settings.annualKm.toLocaleString() : "15,000";
    const distanceUnit = settings?.distanceUnit || "km";
    const years = settings?.ownershipYears || 5;

    return {
      winner,
      winnerTitle,
      executiveSummary: `Based on an annual commute of ${annualKm} ${distanceUnit} over ${years} years, ${winnerTitle.toLowerCase()} with total estimated 5-year net savings of ${currencySymbol}${Math.abs((financialSummary?.petrolTotalTCO || 0) - Math.min(financialSummary?.standardEVTotalTCO || 0, financialSummary?.bassEVTotalTCO || 0)).toLocaleString()}.`,
      paybackPeriodMonths: financialSummary?.bassEVBreakevenMonth ? `${financialSummary.bassEVBreakevenMonth} months` : "N/A",
      keyFinancialBenefits: [
        `Cost per km is significantly lower for electric energy (${currencySymbol}${financialSummary?.costPerKm?.evWeightedEnergyCPK?.toFixed(2) || "0.85"}/km vs ${currencySymbol}${financialSummary?.costPerKm?.petrolFuelCPK?.toFixed(2) || "6.80"}/km for Petrol).`,
        `BASS reduces upfront vehicle acquisition cost down by approx 35-40%, shielding you from battery degradation risks.`,
        `Home charging EB impact adds about ${currencySymbol}${Math.round(financialSummary?.homeEBImpact?.monthlyEVEBCostDifference || 1200)} to your monthly electricity bill.`
      ],
      batteryStrategyAnalysis: "BASS eliminates battery aging depreciation risk because battery replacement, degradation, and cell upgrades are managed entirely by the battery provider under the monthly subscription.",
      riskAssessment: [
        "Check local BASS battery swapping station availability along your frequent routes.",
        "Ensure home electrical sanctioned load supports 3.3kW to 7.2kW AC charging without tripping baseline EB tariffs."
      ],
      actionPlanChecklist: [
        "Request a home electrical audit for EV wallbox installation.",
        "Compare BASS subscription mileage slabs against your monthly commute (target 1,000-1,500 km/mo).",
        "Inquire about government EV subsidies and road tax exemptions in your state."
      ]
    };
  };

  if (!ai) {
    return res.json({
      success: true,
      data: generateFallbackRecommendation(),
      source: "default"
    });
  }

  try {
    const prompt = `Analyze this vehicle purchasing comparison and provide a detailed recommendation report:

Context:
- Annual Driving Distance: ${settings?.annualKm} ${settings?.distanceUnit}/year
- Ownership Duration: ${settings?.ownershipYears} years
- Currency: ${settings?.currency} (${settings?.currencySymbol})
- Location: ${settings?.locationCityRegion}

Vehicles Compared:
1. Petrol Vehicle: ${petrolInput?.modelName} (Price: ${settings?.currencySymbol}${petrolInput?.purchasePrice}, Fuel Price: ${settings?.currencySymbol}${petrolInput?.petrolPricePerLiter}/L) -> 5-Yr TCO: ${settings?.currencySymbol}${financialSummary?.petrolTotalTCO}
2. Standard EV: ${evInput?.modelName} (Price: ${settings?.currencySymbol}${evInput?.standardPurchasePrice}, Home EB Rate: ${settings?.currencySymbol}${evInput?.electricityTariff?.baseRatePerKWh}/kWh) -> 5-Yr TCO: ${settings?.currencySymbol}${financialSummary?.standardEVTotalTCO}
3. BASS EV (Battery as a Service): ${evInput?.modelName} BASS (Chassis Upfront Price: ${settings?.currencySymbol}${evInput?.bassChassisPrice}, Monthly Battery Subscription: ${settings?.currencySymbol}${evInput?.bassMonthlyRental}/mo) -> 5-Yr TCO: ${settings?.currencySymbol}${financialSummary?.bassEVTotalTCO}

Financial Highlights:
- Cost per km Fuel: Petrol=${settings?.currencySymbol}${financialSummary?.costPerKm?.petrolFuelCPK?.toFixed(2)}, EV EB Charging=${settings?.currencySymbol}${financialSummary?.costPerKm?.evWeightedEnergyCPK?.toFixed(2)}
- EV Breakeven vs Petrol: Standard EV=${financialSummary?.standardEVBreakevenMonth ? financialSummary.standardEVBreakevenMonth + " months" : "Never"}, BASS EV=${financialSummary?.bassEVBreakevenMonth ? financialSummary.bassEVBreakevenMonth + " months" : "Never"}
- CO2 Saved: ${financialSummary?.co2SavedBassTonnes?.toFixed(1) || 0} tonnes

Generate an executive decision recommendation report. Respond strictly in JSON format.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            winner: { type: Type.STRING },
            winnerTitle: { type: Type.STRING },
            executiveSummary: { type: Type.STRING },
            paybackPeriodMonths: { type: Type.STRING },
            keyFinancialBenefits: { type: Type.ARRAY, items: { type: Type.STRING } },
            batteryStrategyAnalysis: { type: Type.STRING },
            riskAssessment: { type: Type.ARRAY, items: { type: Type.STRING } },
            actionPlanChecklist: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["winner", "winnerTitle", "executiveSummary", "paybackPeriodMonths", "keyFinancialBenefits", "batteryStrategyAnalysis", "riskAssessment", "actionPlanChecklist"]
        }
      }
    });

    let parsed: any = {};
    try {
      parsed = JSON.parse(response.text?.trim() || "{}");
    } catch {
      parsed = {};
    }

    const fallback = generateFallbackRecommendation();
    const finalData = {
      winner: parsed.winner || fallback.winner,
      winnerTitle: parsed.winnerTitle || fallback.winnerTitle,
      executiveSummary: parsed.executiveSummary || fallback.executiveSummary,
      paybackPeriodMonths: parsed.paybackPeriodMonths || fallback.paybackPeriodMonths,
      keyFinancialBenefits: Array.isArray(parsed.keyFinancialBenefits) && parsed.keyFinancialBenefits.length > 0 ? parsed.keyFinancialBenefits : fallback.keyFinancialBenefits,
      batteryStrategyAnalysis: parsed.batteryStrategyAnalysis || fallback.batteryStrategyAnalysis,
      riskAssessment: Array.isArray(parsed.riskAssessment) && parsed.riskAssessment.length > 0 ? parsed.riskAssessment : fallback.riskAssessment,
      actionPlanChecklist: Array.isArray(parsed.actionPlanChecklist) && parsed.actionPlanChecklist.length > 0 ? parsed.actionPlanChecklist : fallback.actionPlanChecklist
    };

    return res.json({ success: true, data: finalData, source: "gemini_live" });
  } catch (err: any) {
    console.log("AI Recommendation using intelligent heuristic fallback.");
    return res.json({ success: true, data: generateFallbackRecommendation(), source: "fallback_rate_limit" });
  }
});

// Vite Development / Production Setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
