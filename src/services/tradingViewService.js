let tradingViewLoaderPromise = null;

const CDN_SCRIPT_URL = 'https://s3.tradingview.com/tv.js';

export const loadTradingViewWidget = () => {
  if (typeof window === 'undefined') {
    return Promise.resolve(null);
  }

  if (window.TradingView && typeof window.TradingView.widget === 'function') {
    return Promise.resolve(window.TradingView);
  }

  if (!tradingViewLoaderPromise) {
    tradingViewLoaderPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.id = 'tradingview-widget-script';
      script.type = 'text/javascript';
      script.async = true;
      script.src = CDN_SCRIPT_URL;

      script.onload = () => {
        if (window.TradingView && typeof window.TradingView.widget === 'function') {
          resolve(window.TradingView);
        } else {
          reject(new Error('TradingView widget failed to initialise'));
        }
      };

      script.onerror = (err) => {
        reject(err || new Error('Failed to load TradingView widget script'));
      };

      document.head.appendChild(script);
    });
  }

  return tradingViewLoaderPromise;
};

export const resolveTradingSymbol = (symbol) => {
  if (!symbol) return 'BINANCE:BTCUSDT';
  if (symbol.includes(':')) return symbol;
  return `BINANCE:${symbol.toUpperCase()}`;
};

const INTERVAL_MAPPING = {
  '1m': '1',
  '3m': '3',
  '5m': '5',
  '15m': '15',
  '30m': '30',
  '1h': '60',
  '2h': '120',
  '4h': '240',
  '6h': '360',
  '8h': '480',
  '12h': '720',
  '1d': '1D',
  '3d': '3D',
  '1w': '1W'
};

export const mapIntervalToResolution = (interval) => {
  if (!interval) return '5';
  return INTERVAL_MAPPING[interval] || interval;
};

