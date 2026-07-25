import React from 'react';
import {
  LayoutDashboard,
  GitCompare,
  Car,
  Table,
  Settings,
  Sparkles,
  Zap,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Download,
  RotateCcw,
  Wifi,
  WifiOff
} from 'lucide-react';
import { CurrencyCode } from '../types';

export type NavTab = 'dashboard' | 'compare' | 'catalog' | 'cashflow' | 'settings';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  currencySymbol: string;
  currency: CurrencyCode;
  isOffline: boolean;
  onOpenWizard: () => void;
  onExportCSV: () => void;
  onReset: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  darkMode,
  setDarkMode,
  currencySymbol,
  currency,
  isOffline,
  onOpenWizard,
  onExportCSV,
  onReset
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'compare', label: 'Compare & Inputs', icon: GitCompare },
    { id: 'catalog', label: 'Vehicle Catalog', icon: Car, badge: '40 Cars' },
    { id: 'cashflow', label: 'Cash Flow & Export', icon: Table },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 bg-zinc-900 border-r border-zinc-800 text-zinc-100 flex flex-col justify-between transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div>
        <div className={`h-16 border-b border-zinc-800 flex items-center ${collapsed ? 'justify-center px-2' : 'justify-between px-4'}`}>
          {!collapsed ? (
            <>
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0">
                  <Zap className="w-5 h-5 fill-emerald-400/20" />
                </div>
                <div className="flex flex-col truncate">
                  <span className="text-sm font-black tracking-wider uppercase text-zinc-100 flex items-center gap-1.5">
                    PROJECT PEV
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      v2.0
                    </span>
                  </span>
                  <span className="text-[10px] text-zinc-400 font-medium">EV vs Petrol TCO</span>
                </div>
              </div>
              <button
                onClick={() => setCollapsed(true)}
                className="hidden md:flex p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
                title="Collapse Sidebar"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setCollapsed(false)}
              className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-all flex items-center justify-center relative group"
              title="Expand Sidebar"
            >
              <Zap className="w-5 h-5 fill-emerald-400/20" />
              <div className="absolute -right-2 -top-1 bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-full p-0.5 shadow-md">
                <ChevronRight className="w-3 h-3" />
              </div>
            </button>
          )}
        </div>

        {/* Currency & Connection Status Strip */}
        {!collapsed ? (
          <div className="px-4 py-2.5 bg-zinc-950/60 border-b border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-zinc-800 text-emerald-400 border border-zinc-700">
                {currencySymbol} {currency}
              </span>
              <span className="text-[11px] text-zinc-400 font-medium">India Market</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-semibold">
              {isOffline ? (
                <span className="text-rose-400 flex items-center gap-1">
                  <WifiOff className="w-3 h-3" /> Offline
                </span>
              ) : (
                <span className="text-emerald-400 flex items-center gap-1">
                  <Wifi className="w-3 h-3" /> Online
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="py-2.5 bg-zinc-950/60 border-b border-zinc-800/80 flex items-center justify-center">
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-zinc-800 text-emerald-400 border border-zinc-700">
              {currencySymbol}
            </span>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="p-2 space-y-1.5 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center rounded-xl font-semibold text-xs transition-all cursor-pointer ${
                  collapsed
                    ? 'h-11 justify-center'
                    : 'px-3.5 py-2.5 gap-3'
                } ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 border border-transparent'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-emerald-400' : 'text-zinc-400'}`} />
                {!collapsed && (
                  <div className="flex items-center justify-between w-full">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-zinc-800 text-cyan-400 border border-zinc-700">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer & Quick Actions */}
      <div className="p-2 border-t border-zinc-800 bg-zinc-950/40 space-y-2">
        {/* Guided Wizard Trigger */}
        <button
          onClick={onOpenWizard}
          className={`w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-emerald-500/20 cursor-pointer flex items-center justify-center gap-2 ${
            collapsed ? 'h-10' : 'py-2.5 px-3'
          }`}
          title="Start Guided Commute Flow"
        >
          <Sparkles className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Guided Flow</span>}
        </button>

        {/* Action Controls */}
        {!collapsed ? (
          <div className="grid grid-cols-3 gap-1.5 pt-1">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 text-xs flex items-center justify-center transition-colors"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>
            <button
              onClick={onExportCSV}
              className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-emerald-400 border border-zinc-700 text-xs flex items-center justify-center transition-colors"
              title="Export CSV Report"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onReset}
              className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-rose-400 border border-zinc-700 text-xs flex items-center justify-center transition-colors"
              title="Reset Parameters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5 items-center pt-1">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
