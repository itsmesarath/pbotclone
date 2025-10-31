import React, { useEffect, useState } from 'react';
import { useTradingStore } from '../store/tradingStore';

const AISentimentMeter = () => {
  const { marketState, orderFlowData, currentSignal, isAnalyzing } = useTradingStore();
  const [sentiment, setSentiment] = useState(0); // -100 (bearish) to +100 (bullish)
  const [smoothedSentiment, setSmoothedSentiment] = useState(0);

  // Calculate sentiment score based on AI analysis
  useEffect(() => {
    if (!marketState || !orderFlowData) {
      setSentiment(0);
      return;
    }

    let score = 0;

    // Market trend contribution (±40 points)
    if (marketState.trend === 'UP') {
      score += 40 * (marketState.confidence / 100);
    } else if (marketState.trend === 'DOWN') {
      score -= 40 * (marketState.confidence / 100);
    }

    // Order flow aggression (±30 points)
    if (orderFlowData.aggression === 'BULL') {
      score += 30;
    } else if (orderFlowData.aggression === 'BEAR') {
      score -= 30;
    }

    // CVD contribution (±20 points)
    const cvdNormalized = Math.max(-1, Math.min(1, orderFlowData.cvd / 1000));
    score += cvdNormalized * 20;

    // Signal type contribution (±10 points)
    if (currentSignal) {
      if (currentSignal.type === 'LONG') {
        score += 10 * (currentSignal.confidence / 100);
      } else if (currentSignal.type === 'SHORT') {
        score -= 10 * (currentSignal.confidence / 100);
      }
    }

    // Clamp between -100 and 100
    setSentiment(Math.max(-100, Math.min(100, score)));
  }, [marketState, orderFlowData, currentSignal]);

  // Smooth the sentiment changes for visual appeal
  useEffect(() => {
    const interval = setInterval(() => {
      setSmoothedSentiment(prev => {
        const diff = sentiment - prev;
        return prev + diff * 0.1; // Smooth transition
      });
    }, 50);

    return () => clearInterval(interval);
  }, [sentiment]);

  // Calculate needle rotation (-90deg to +90deg)
  const needleRotation = (smoothedSentiment / 100) * 90;

  // Get color based on sentiment
  const getColor = () => {
    if (smoothedSentiment > 20) return '#22c55e'; // Green
    if (smoothedSentiment < -20) return '#ef4444'; // Red
    return '#fbbf24'; // Yellow/Neutral
  };

  // Get sentiment label
  const getSentimentLabel = () => {
    if (smoothedSentiment > 60) return 'Strong Bull';
    if (smoothedSentiment > 20) return 'Bullish';
    if (smoothedSentiment > -20) return 'Neutral';
    if (smoothedSentiment > -60) return 'Bearish';
    return 'Strong Bear';
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 shadow-xl border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="text-2xl">🎯</span>
          AI Sentiment
        </h2>
        {isAnalyzing && (
          <div className="flex items-center gap-2 bg-blue-500 bg-opacity-20 px-2.5 py-1 rounded-full">
            <div className="animate-spin h-2.5 w-2.5 border-2 border-blue-400 border-t-transparent rounded-full"></div>
            <span className="text-blue-400 text-[10px] font-semibold uppercase tracking-wide">Live</span>
          </div>
        )}
      </div>

      {/* Enhanced Gauge Container */}
      <div className="relative w-full h-44 flex items-center justify-center mb-4">
        {/* Glow effect behind gauge */}
        <div 
          className="absolute w-full h-full rounded-full opacity-30 blur-2xl transition-colors duration-1000"
          style={{ backgroundColor: getColor() }}
        />
        
        {/* SVG Gauge */}
        <svg className="relative w-full h-full drop-shadow-2xl" viewBox="0 0 200 120">
          {/* Red zone (Bearish) - Enhanced with gradient */}
          <defs>
            <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#7f1d1d', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#ef4444', stopOpacity: 1 }} />
            </linearGradient>
            <linearGradient id="yellowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#f59e0b', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#fbbf24', stopOpacity: 1 }} />
            </linearGradient>
            <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#22c55e', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#15803d', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          
          {/* Red zone (Bearish) */}
          <path
            d="M 30 100 A 70 70 0 0 1 60 40"
            fill="none"
            stroke="url(#redGradient)"
            strokeWidth="24"
            strokeLinecap="round"
          />
          {/* Yellow zone (Neutral) */}
          <path
            d="M 60 40 A 70 70 0 0 1 140 40"
            fill="none"
            stroke="url(#yellowGradient)"
            strokeWidth="24"
            strokeLinecap="round"
          />
          {/* Green zone (Bullish) */}
          <path
            d="M 140 40 A 70 70 0 0 1 170 100"
            fill="none"
            stroke="url(#greenGradient)"
            strokeWidth="24"
            strokeLinecap="round"
          />

          {/* Tick marks - Enhanced */}
          {[-90, -60, -30, 0, 30, 60, 90].map((angle) => {
            const isMajor = angle === -90 || angle === 0 || angle === 90;
            return (
              <g key={angle}>
                <line
                  x1={100 + (isMajor ? 52 : 55) * Math.cos((angle - 90) * Math.PI / 180)}
                  y1={100 + (isMajor ? 52 : 55) * Math.sin((angle - 90) * Math.PI / 180)}
                  x2={100 + (isMajor ? 68 : 65) * Math.cos((angle - 90) * Math.PI / 180)}
                  y2={100 + (isMajor ? 68 : 65) * Math.sin((angle - 90) * Math.PI / 180)}
                  stroke="#e5e7eb"
                  strokeWidth={isMajor ? 3 : 2}
                  opacity={isMajor ? 1 : 0.6}
                />
              </g>
            );
          })}

          {/* Enhanced Needle with shadow */}
          <defs>
            <filter id="needleShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
              <feOffset dx="0" dy="2" result="offsetblur"/>
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.5"/>
              </feComponentTransfer>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <g transform={`rotate(${needleRotation} 100 100)`} filter="url(#needleShadow)">
            {/* Needle glow */}
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="32"
              stroke={getColor()}
              strokeWidth="8"
              strokeLinecap="round"
              opacity="0.3"
            />
            {/* Main needle */}
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="32"
              stroke={getColor()}
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Needle tip */}
            <circle
              cx="100"
              cy="32"
              r="3"
              fill={getColor()}
            />
            {/* Center hub - larger and more prominent */}
            <circle
              cx="100"
              cy="100"
              r="8"
              fill={getColor()}
              opacity="0.9"
            />
          </g>

          {/* Center dot */}
          <circle
            cx="100"
            cy="100"
            r="4"
            fill="#1f2937"
          />
        </svg>
      </div>

      {/* Sentiment Value Display - Enhanced */}
      <div className="text-center mt-4">
        <div
          className="text-2xl font-bold mb-1 transition-all duration-500 drop-shadow"
          style={{ color: getColor() }}
        >
          {getSentimentLabel()}
        </div>
        <div className="flex items-center justify-center gap-3 text-xs">
          <div className="bg-gray-700 bg-opacity-50 px-3 py-1.5 rounded-lg">
            <span className="text-gray-400">Score:</span>
            <span className="ml-2 font-semibold" style={{ color: getColor() }}>
              {smoothedSentiment.toFixed(1)}
            </span>
          </div>
          <div className="bg-gray-700 bg-opacity-50 px-3 py-1.5 rounded-lg">
            <span className="text-gray-400">Range:</span>
            <span className="ml-2 text-white font-medium">-100 to +100</span>
          </div>
        </div>
      </div>

      {/* Breakdown - Enhanced with better styling */}
      <div className="mt-4 space-y-2.5">
        <div className="flex items-center justify-between bg-gray-700 bg-opacity-30 p-2.5 rounded-lg hover:bg-opacity-50 transition-all">
          <span className="text-gray-400 text-xs font-medium">📊 Market Trend:</span>
          <span className={`font-medium ${
            marketState?.trend === 'UP' ? 'text-green-400' :
            marketState?.trend === 'DOWN' ? 'text-red-400' :
            'text-gray-400'
          }`}>
            {marketState?.trend || 'N/A'}
          </span>
        </div>
        <div className="flex items-center justify-between bg-gray-700 bg-opacity-30 p-2.5 rounded-lg hover:bg-opacity-50 transition-all">
          <span className="text-gray-400 text-xs font-medium">💹 Order Flow:</span>
          <span className={`font-medium ${
            orderFlowData?.aggression === 'BULL' ? 'text-green-400' :
            orderFlowData?.aggression === 'BEAR' ? 'text-red-400' :
            'text-gray-400'
          }`}>
            {orderFlowData?.aggression || 'N/A'}
          </span>
        </div>
        <div className="flex items-center justify-between bg-gray-700 bg-opacity-30 p-2.5 rounded-lg hover:bg-opacity-50 transition-all">
          <span className="text-gray-400 text-xs font-medium">🎯 Signal:</span>
          <span className={`font-medium ${
            currentSignal?.type === 'LONG' ? 'text-green-400' :
            currentSignal?.type === 'SHORT' ? 'text-red-400' :
            'text-gray-400'
          }`}>
            {currentSignal?.type || 'FLAT'}
          </span>
        </div>
        {currentSignal && currentSignal.type !== 'FLAT' && (
          <div className="flex items-center justify-between bg-gray-700 bg-opacity-30 p-2.5 rounded-lg hover:bg-opacity-50 transition-all">
            <span className="text-gray-400 text-xs font-medium">✨ Confidence:</span>
            <span className="text-white text-sm font-medium">
              {currentSignal.confidence}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AISentimentMeter;
