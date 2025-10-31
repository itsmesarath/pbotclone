import React, { useState } from 'react';
import TradingChart from './components/TradingChart';
import ControlPanel from './components/ControlPanel';
import Dashboard from './components/Dashboard';
import SignalPanel from './components/SignalPanel';
import AISentimentMeter from './components/AISentimentMeter';
import { useTradingBot } from './hooks/useTradingBot';
import { useTradingStore } from './store/tradingStore';

function App() {
  // Initialize trading bot
  useTradingBot();

  const { showSentimentMeter } = useTradingStore();
  const [isControlPanelCollapsed, setIsControlPanelCollapsed] = useState(false);
  const [isChartMaximized, setIsChartMaximized] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Fabio Trading Bot</h1>
            <p className="text-gray-400 mt-1">
              AI-powered trading based on Fabio Playbook methodology
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-400">Live</span>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Sidebar - Controls */}
        {!isChartMaximized && (
          <div
            className={`${
              isControlPanelCollapsed ? 'lg:col-span-1' : 'lg:col-span-3'
            } space-y-4`}
          >
            <ControlPanel
              collapsed={isControlPanelCollapsed}
              onToggleCollapse={() =>
                setIsControlPanelCollapsed((prev) => !prev)
              }
            />
          </div>
        )}

        {/* Center - Chart */}
        <div
          className={`${
            isChartMaximized ? 'lg:col-span-12' : 'lg:col-span-6'
          }`}
        >
          <TradingChart
            isMaximized={isChartMaximized}
            onToggleMaximize={() => setIsChartMaximized((prev) => !prev)}
            onCollapseControls={() => setIsControlPanelCollapsed(true)}
            areControlsCollapsed={isControlPanelCollapsed}
            restoreControls={() => setIsControlPanelCollapsed(false)}
          />
        </div>

        {/* Right Sidebar - AI Sentiment & Signals & Dashboard */}
        {!isChartMaximized && (
          <div className="lg:col-span-3 space-y-4">
            {showSentimentMeter && <AISentimentMeter />}
            <SignalPanel />
            <Dashboard />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-6 text-center text-sm text-gray-500">
        <p>
          Built with React, TradingView Lightweight Charts, Binance API & OpenRouter AI
        </p>
        <p className="mt-1">
          ⚠️ Educational purposes only. Not financial advice.
        </p>
      </footer>
    </div>
  );
}

export default App;
