import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTradingStore } from '../store/tradingStore';
import {
  loadTradingViewWidget,
  mapIntervalToResolution,
  resolveTradingSymbol
} from '../services/tradingViewService';

const TradingChart = () => {
  const containerId = useMemo(
    () => `tv_chart_${Math.random().toString(36).slice(2, 11)}`,
    []
  );

  const widgetRef = useRef(null);
  const chartReadyRef = useRef(false);
  const keyLevelEntitiesRef = useRef([]);
  const signalEntitiesRef = useRef([]);

  const {
    symbol,
    interval,
    keyLevels,
    currentSignal,
    candlestickData
  } = useTradingStore();

  const [isLoading, setIsLoading] = useState(true);
  const [chartError, setChartError] = useState(null);

  const cleanupEntities = useCallback((entitiesRef) => {
    if (!chartReadyRef.current || !widgetRef.current) return;

    try {
      const chart = widgetRef.current.activeChart();
      entitiesRef.current.forEach((entityId) => {
        try {
          chart.removeEntity(entityId);
        } catch (err) {
          // Ignore entity removal failures (entity might already be gone)
        }
      });
    } catch (err) {
      console.warn('Unable to cleanup TradingView entities', err);
    }

    entitiesRef.current = [];
  }, []);

  const applyKeyLevels = useCallback(() => {
    if (!chartReadyRef.current || !widgetRef.current) return;

    cleanupEntities(keyLevelEntitiesRef);

    if (!Array.isArray(keyLevels) || keyLevels.length === 0) {
      return;
    }

    try {
      const chart = widgetRef.current.activeChart();

      keyLevels.forEach((level) => {
        if (!level || typeof level.price !== 'number') return;

        const color =
          level.type === 'POC'
            ? '#ffeb3b'
            : level.type === 'HVN'
            ? '#4caf50'
            : level.type === 'LVN'
            ? '#f44336'
            : '#9e9e9e';

        const entityId = chart.createShape({ price: level.price }, {
          shape: 'horizontal_line',
          lock: true,
          disableSelection: true,
          text: `${level.type || 'LEVEL'} ${level.price.toFixed(2)}`,
          color,
          linewidth: 2
        });

        if (entityId) {
          keyLevelEntitiesRef.current.push(entityId);
        }
      });
    } catch (err) {
      console.warn('Unable to plot key levels on TradingView chart', err);
    }
  }, [cleanupEntities, keyLevels]);

  const applySignalAnnotations = useCallback(() => {
    if (!chartReadyRef.current || !widgetRef.current) return;

    cleanupEntities(signalEntitiesRef);

    if (!currentSignal || currentSignal.type === 'FLAT') {
      return;
    }

    try {
      const chart = widgetRef.current.activeChart();

      const addHorizontalLine = (price, title, color) => {
        if (typeof price !== 'number') return;

        const entityId = chart.createShape({ price }, {
          shape: 'horizontal_line',
          lock: false,
          disableSelection: false,
          text: `${title}: ${price.toFixed(2)}`,
          color,
          linewidth: 2
        });

        if (entityId) {
          signalEntitiesRef.current.push(entityId);
        }
      };

      const sentimentColor =
        currentSignal.type === 'LONG' ? '#26a69a' : '#ef5350';

      const labelText = `Signal: ${currentSignal.type}${
        currentSignal.confidence ? ` (${currentSignal.confidence}%)` : ''
      }`;

      const labelPrice = [
        currentSignal.entry,
        currentSignal.target,
        currentSignal.stopLoss
      ].find((price) => typeof price === 'number');

      if (typeof labelPrice === 'number') {
        const labelEntity = chart.createShape(
          { price: labelPrice },
          {
            shape: 'text',
            lock: true,
            disableSelection: true,
            color: sentimentColor,
            text: labelText
          }
        );

        if (labelEntity) {
          signalEntitiesRef.current.push(labelEntity);
        }
      }

      addHorizontalLine(currentSignal.entry, 'Entry', '#2196f3');
      addHorizontalLine(currentSignal.stopLoss, 'Stop', '#f44336');
      addHorizontalLine(currentSignal.target, 'Target', '#4caf50');

      if (Array.isArray(candlestickData) && candlestickData.length > 0) {
        const lastCandle = candlestickData[candlestickData.length - 1];
        if (lastCandle && typeof lastCandle.close === 'number') {
          const markerEntity = chart.createShape(
            { price: lastCandle.close },
            {
              shape: currentSignal.type === 'LONG' ? 'arrow_up' : 'arrow_down',
              color: sentimentColor,
              lock: true,
              disableSelection: true,
              text: `${currentSignal.type} @ ${lastCandle.close.toFixed(2)}`
            }
          );

          if (markerEntity) {
            signalEntitiesRef.current.push(markerEntity);
          }
        }
      }
    } catch (err) {
      console.warn('Unable to plot AI signal on TradingView chart', err);
    }
  }, [candlestickData, cleanupEntities, currentSignal]);

  useEffect(() => {
    let cancelled = false;

    const initChart = async () => {
      setIsLoading(true);
      setChartError(null);

      try {
        const TradingView = await loadTradingViewWidget();
        if (cancelled || !TradingView) return;

        const tvSymbol = resolveTradingSymbol(symbol);
        const resolution = mapIntervalToResolution(interval);

        widgetRef.current = new TradingView.widget({
          symbol: tvSymbol,
          interval: resolution,
          container_id: containerId,
          autosize: true,
          theme: 'dark',
          style: '1',
          timezone: 'Etc/UTC',
          locale: 'en',
          enable_publishing: false,
          allow_symbol_change: false,
          hide_side_toolbar: false,
          withdateranges: true,
          overrides: {
            'paneProperties.background': '#1e222d',
            'paneProperties.vertGridProperties.color': '#2a2e39',
            'paneProperties.horzGridProperties.color': '#2a2e39',
            'scalesProperties.textColor': '#d1d4dc'
          },
          loading_screen: { backgroundColor: '#1e222d', foregroundColor: '#2962ff' }
        });

        widgetRef.current.onChartReady(() => {
          if (cancelled) return;

          chartReadyRef.current = true;
          setIsLoading(false);

          try {
            const chart = widgetRef.current.activeChart();
            // Configure a couple of default indicators for a richer out-of-the-box chart
            chart.createStudy('Moving Average', false, false, [50]);
            chart.createStudy('Moving Average', false, false, [200]);
            chart.createStudy('Volume', false, true);
          } catch (err) {
            console.warn('Unable to configure default TradingView studies', err);
          }

          applyKeyLevels();
          applySignalAnnotations();
        });
      } catch (err) {
        console.error('Failed to initialise TradingView widget', err);
        if (!cancelled) {
          setChartError(
            'Unable to load TradingView charting library. Please ensure you have an active internet connection and the TradingView assets are available.'
          );
          setIsLoading(false);
        }
      }
    };

    initChart();

    return () => {
      cancelled = true;
      chartReadyRef.current = false;
      cleanupEntities(keyLevelEntitiesRef);
      cleanupEntities(signalEntitiesRef);
      if (widgetRef.current && typeof widgetRef.current.remove === 'function') {
        widgetRef.current.remove();
      }
      widgetRef.current = null;
    };
  }, [applyKeyLevels, applySignalAnnotations, cleanupEntities, containerId]);

  useEffect(() => {
    if (!chartReadyRef.current || !widgetRef.current) return;

    try {
      const tvSymbol = resolveTradingSymbol(symbol);
      widgetRef.current.activeChart().setSymbol(tvSymbol, () => {
        applyKeyLevels();
        applySignalAnnotations();
      });
    } catch (err) {
      console.warn('Failed to update TradingView symbol', err);
    }
  }, [applyKeyLevels, applySignalAnnotations, symbol]);

  useEffect(() => {
    if (!chartReadyRef.current || !widgetRef.current) return;

    try {
      const resolution = mapIntervalToResolution(interval);
      widgetRef.current.activeChart().setResolution(resolution, () => {
        applyKeyLevels();
        applySignalAnnotations();
      });
    } catch (err) {
      console.warn('Failed to update TradingView resolution', err);
    }
  }, [applyKeyLevels, applySignalAnnotations, interval]);

  useEffect(() => {
    applyKeyLevels();
  }, [applyKeyLevels]);

  useEffect(() => {
    applySignalAnnotations();
  }, [applySignalAnnotations]);

  return (
    <div className="relative bg-gray-800 rounded-lg">
      {isLoading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gray-900/80 rounded-lg">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          <p className="mt-4 text-sm text-gray-300">Loading TradingView chart...</p>
        </div>
      )}

      {chartError && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center rounded-lg bg-red-900/80 px-6 text-center">
          <p className="text-sm font-semibold text-red-100">{chartError}</p>
          <p className="mt-2 text-xs text-red-200">
            Download the official TradingView Charting Library and place it inside <code>public/charting_library</code>, or fall back to the CDN by updating <code>tradingViewService</code>.
          </p>
        </div>
      )}

      <div id={containerId} style={{ height: '600px' }} />
    </div>
  );
};

export default TradingChart;

