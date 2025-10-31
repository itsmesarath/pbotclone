import React, { useState } from 'react';
import { useTradingStore } from '../store/tradingStore';

const AI_MODELS = [
  // OpenAI (OpenRouter) - Paid
  { id: 'openai/gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI', api: 'openrouter', tier: 'paid' },
  { id: 'openai/gpt-oss-20b', name: 'GPT OSS 20B (Low Latency)', provider: 'OpenAI', api: 'openrouter', tier: 'paid' },
  { id: 'openai/gpt-5-image-mini', name: 'GPT-5 Image Mini', provider: 'OpenAI', api: 'openrouter', tier: 'paid' },
  
  // OpenAI (OpenRouter) - Free
  { id: 'openai/gpt-oss-20b:free', name: 'GPT OSS 20B (Free)', provider: 'OpenAI', api: 'openrouter', tier: 'free' },
  
  // Anthropic (OpenRouter) - Paid
  { id: 'anthropic/claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic', api: 'openrouter', tier: 'paid' },
  { id: 'anthropic/claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'Anthropic', api: 'openrouter', tier: 'paid' },
  { id: 'anthropic/claude-3.7-sonnet', name: 'Claude 3.7 Sonnet', provider: 'Anthropic', api: 'openrouter', tier: 'paid' },
  { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku', provider: 'Anthropic', api: 'openrouter', tier: 'paid' },
  
  // Mistral AI (OpenRouter) - Paid
  { id: 'mistralai/mixtral-8x7b-instruct', name: 'Mixtral 8x7B', provider: 'Mistral', api: 'openrouter', tier: 'paid' },
  { id: 'mistralai/mistral-small-24b-instruct-2501', name: 'Mistral Small 24B', provider: 'Mistral', api: 'openrouter', tier: 'paid' },
  
  // Mistral AI (OpenRouter) - Free
  { id: 'mistralai/mistral-small-24b-instruct-2501:free', name: 'Mistral Small 24B (Free)', provider: 'Mistral', api: 'openrouter', tier: 'free' },
  
  // Google (OpenRouter) - Paid
  { id: 'google/gemini-pro', name: 'Gemini Pro', provider: 'Google', api: 'openrouter', tier: 'paid' },
  { id: 'google/gemini-2.5-flash', name: 'Gemini 2.5 Flash', provider: 'Google', api: 'openrouter', tier: 'paid' },
  { id: 'google/gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash Lite', provider: 'Google', api: 'openrouter', tier: 'paid' },
  
  // Meta Llama (OpenRouter) - Paid
  { id: 'meta-llama/llama-3.3-70b-instruct', name: 'Llama 3.3 70B', provider: 'Meta', api: 'openrouter', tier: 'paid' },
  { id: 'meta-llama/llama-3.1-8b-instruct', name: 'Llama 3.1 8B', provider: 'Meta', api: 'openrouter', tier: 'paid' },
  { id: 'meta-llama/llama-3.1-70b-instruct', name: 'Llama 3.1 70B', provider: 'Meta', api: 'openrouter', tier: 'paid' },
  
  // xAI (OpenRouter) - Paid
  { id: 'x-ai/grok-4-fast', name: 'Grok 4 Fast', provider: 'xAI', api: 'openrouter', tier: 'paid' },
  
  // NVIDIA (OpenRouter) - Paid
  { id: 'nvidia/llama-3.1-nemotron-70b-instruct', name: 'Nemotron 70B', provider: 'NVIDIA', api: 'openrouter', tier: 'paid' },
  
  // NVIDIA (OpenRouter) - Free
  { id: 'nvidia/llama-3.1-nemotron-70b-instruct:free', name: 'Nemotron 70B (Free)', provider: 'NVIDIA', api: 'openrouter', tier: 'free' },
  { id: 'nvidia/nemotron-nano-9b-v2:free', name: 'Nemotron Nano 9B (Free)', provider: 'NVIDIA', api: 'openrouter', tier: 'free' },
  
  // DeepSeek (OpenRouter) - Paid
  { id: 'deepseek/deepseek-chat', name: 'DeepSeek Chat (V3)', provider: 'DeepSeek', api: 'openrouter', tier: 'paid' },
  { id: 'deepseek/deepseek-r1-distill-llama-70b', name: 'DeepSeek R1 70B', provider: 'DeepSeek', api: 'openrouter', tier: 'paid' },
  { id: 'deepseek/deepseek-chat-v3-0324', name: 'DeepSeek Chat V3 0324', provider: 'DeepSeek', api: 'openrouter', tier: 'paid' },
  
  // DeepSeek (OpenRouter) - Free
  { id: 'deepseek/deepseek-chat-v3.1:free', name: 'DeepSeek Chat V3.1 (Free)', provider: 'DeepSeek', api: 'openrouter', tier: 'free' },
  
  // Qwen (OpenRouter) - Paid
  { id: 'qwen/qwen-2.5-coder-32b-instruct', name: 'Qwen 2.5 Coder 32B', provider: 'Qwen', api: 'openrouter', tier: 'paid' },
  { id: 'qwen/qwen2.5-coder-7b-instruct', name: 'Qwen 2.5 Coder 7B (Low Latency)', provider: 'Qwen', api: 'openrouter', tier: 'paid' },
  { id: 'qwen/qwen3-235b-a22b-2507', name: 'Qwen3 235B A22B', provider: 'Qwen', api: 'openrouter', tier: 'paid' },
  
  // Qwen (OpenRouter) - Free
  { id: 'qwen/qwen-2.5-coder-32b-instruct:free', name: 'Qwen 2.5 Coder 32B (Free)', provider: 'Qwen', api: 'openrouter', tier: 'free' },
  
  // Zhipu AI (OpenRouter) - Free
  { id: 'z-ai/glm-4.5-air:free', name: 'GLM 4.5 Air (Free)', provider: 'Zhipu AI', api: 'openrouter', tier: 'free' },
  
  // Moonshot AI (OpenRouter) - Free
  { id: 'moonshotai/kimi-k2:free', name: 'Kimi K2 (Free)', provider: 'Moonshot AI', api: 'openrouter', tier: 'free' },
  
  // Nous Research (OpenRouter) - Paid
  { id: 'nousresearch/hermes-3-llama-3.1-70b', name: 'Hermes 3 Llama 70B', provider: 'Nous Research', api: 'openrouter', tier: 'paid' },
  
  // Groq Models - All Free
  { id: 'groq/openai/gpt-oss-20b', name: 'GPT OSS 20B (Groq)', provider: 'OpenAI', api: 'groq', tier: 'free' },
  { id: 'groq/openai/gpt-oss-120b', name: 'GPT OSS 120B (Groq)', provider: 'OpenAI', api: 'groq', tier: 'free' },
  { id: 'groq/llama-3.3-70b-versatile', name: 'Llama 3.3 70B Versatile (Groq)', provider: 'Meta', api: 'groq', tier: 'free' }
];

const INTERVALS = [
  { value: '1m', label: '1 Minute' },
  { value: '5m', label: '5 Minutes' },
  { value: '15m', label: '15 Minutes' },
  { value: '1h', label: '1 Hour' },
  { value: '4h', label: '4 Hours' },
  { value: '1d', label: '1 Day' }
];

const SYMBOLS = [
  'BTCUSDT',
  'ETHUSDT',
  'BNBUSDT',
  'ADAUSDT',
  'SOLUSDT',
  'DOTUSDT'
];

const ControlPanel = ({ collapsed = false, onToggleCollapse = () => {} }) => {
  const {
    symbol,
    interval,
    aiEnabled,
    selectedModel,
    isAnalyzing,
    openRouterApiKey,
    groqApiKey,
    showSentimentMeter,
    analysisInterval,
    setSymbol,
    setInterval,
    setAiEnabled,
    setSelectedModel,
    setOpenRouterApiKey,
    setGroqApiKey,
    setShowSentimentMeter,
    setAnalysisInterval
  } = useTradingStore();

  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [showGroqKeyInput, setShowGroqKeyInput] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');
  const [tempGroqKey, setTempGroqKey] = useState('');

  const handleSaveApiKey = () => {
    setOpenRouterApiKey(tempApiKey);
    setShowApiKeyInput(false);
    setTempApiKey('');
  };

  const handleSaveGroqKey = () => {
    setGroqApiKey(tempGroqKey);
    setShowGroqKeyInput(false);
    setTempGroqKey('');
  };

  // Check if selected model requires specific API key
  const selectedModelInfo = AI_MODELS.find(m => m.id === selectedModel);
  const requiresOpenRouter = selectedModelInfo?.api === 'openrouter';
  const requiresGroq = selectedModelInfo?.api === 'groq';
  const hasRequiredKey = requiresGroq ? groqApiKey : openRouterApiKey;

  if (collapsed) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 space-y-4 border border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Control Panel</h2>
          <button
            onClick={onToggleCollapse}
            className="text-xs uppercase tracking-wide text-blue-300 hover:text-blue-200"
          >
            Expand
          </button>
        </div>
        <div className="space-y-1 text-sm text-gray-300">
          <p className="flex justify-between"><span>Pair</span><span>{symbol}</span></p>
          <p className="flex justify-between"><span>Timeframe</span><span>{interval}</span></p>
          <p className="flex justify-between"><span>AI</span><span>{aiEnabled ? 'Enabled' : 'Off'}</span></p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-6 border border-gray-700">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Control Panel</h2>
        <button
          onClick={onToggleCollapse}
          className="text-xs uppercase tracking-wide text-gray-300 hover:text-gray-100"
        >
          Collapse
        </button>
      </div>

      {/* Symbol Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Trading Pair
        </label>
        <select
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {SYMBOLS.map(sym => (
            <option key={sym} value={sym}>{sym}</option>
          ))}
        </select>
      </div>

      {/* Interval Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Timeframe
        </label>
        <select
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
          className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {INTERVALS.map(int => (
            <option key={int.value} value={int.value}>{int.label}</option>
          ))}
        </select>
      </div>

      {/* OpenRouter API Key Management */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          OpenRouter API Key
        </label>
        {!openRouterApiKey ? (
          <div className="space-y-2">
            {!showApiKeyInput ? (
              <button
                onClick={() => setShowApiKeyInput(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition"
              >
                Set OpenRouter API Key
              </button>
            ) : (
              <div className="space-y-2">
                <input
                  type="password"
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  placeholder="Enter OpenRouter API key"
                  className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveApiKey}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setShowApiKeyInput(false);
                      setTempApiKey('');
                    }}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="flex-1 text-green-400 text-sm">✓ API Key Set</span>
            <button
              onClick={() => {
                setOpenRouterApiKey('');
                setShowApiKeyInput(true);
              }}
              className="text-red-400 hover:text-red-300 text-sm"
            >
              Change
            </button>
          </div>
        )}
      </div>

      {/* Groq API Key Management */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Groq API Key
        </label>
        {!groqApiKey ? (
          <div className="space-y-2">
            {!showGroqKeyInput ? (
              <button
                onClick={() => setShowGroqKeyInput(true)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition"
              >
                Set Groq API Key
              </button>
            ) : (
              <div className="space-y-2">
                <input
                  type="password"
                  value={tempGroqKey}
                  onChange={(e) => setTempGroqKey(e.target.value)}
                  placeholder="Enter Groq API key"
                  className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveGroqKey}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setShowGroqKeyInput(false);
                      setTempGroqKey('');
                    }}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="flex-1 text-green-400 text-sm">✓ API Key Set</span>
            <button
              onClick={() => {
                setGroqApiKey('');
                setShowGroqKeyInput(true);
              }}
              className="text-red-400 hover:text-red-300 text-sm"
            >
              Change
            </button>
          </div>
        )}
      </div>

      {/* AI Model Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          AI Model {selectedModelInfo && `(${selectedModelInfo.api === 'groq' ? 'Groq' : 'OpenRouter'})`}
        </label>
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          disabled={!hasRequiredKey}
          className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <optgroup label="🆓 Free Models (OpenRouter)">
            {AI_MODELS.filter(m => m.api === 'openrouter' && m.tier === 'free').map(model => (
              <option key={model.id} value={model.id}>
                {model.name} ({model.provider})
              </option>
            ))}
          </optgroup>
          <optgroup label="💎 Paid Models (OpenRouter)">
            {AI_MODELS.filter(m => m.api === 'openrouter' && m.tier === 'paid').map(model => (
              <option key={model.id} value={model.id}>
                {model.name} ({model.provider})
              </option>
            ))}
          </optgroup>
          <optgroup label="⚡ Groq Models (Free)">
            {AI_MODELS.filter(m => m.api === 'groq').map(model => (
              <option key={model.id} value={model.id}>
                {model.name} ({model.provider})
              </option>
            ))}
          </optgroup>
        </select>
        {!hasRequiredKey && (
          <p className="mt-2 text-xs text-yellow-400">
            ⚠️ {requiresGroq ? 'Groq' : 'OpenRouter'} API key required for this model
          </p>
        )}
      </div>

      {/* AI Toggle */}
      <div>
        <label className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-300">
            AI Analysis
          </span>
          <button
            onClick={() => setAiEnabled(!aiEnabled)}
            disabled={!hasRequiredKey}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed ${
              aiEnabled ? 'bg-blue-600' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                aiEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </label>
        {aiEnabled && isAnalyzing && (
          <div className="mt-2 flex items-center gap-2 text-sm text-blue-400">
            <div className="animate-spin h-4 w-4 border-2 border-blue-400 border-t-transparent rounded-full"></div>
            Analyzing market...
          </div>
        )}
      </div>

      {/* Sentiment Meter Toggle */}
      <div>
        <label className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-300">
            Show Sentiment Meter
          </span>
          <button
            onClick={() => setShowSentimentMeter(!showSentimentMeter)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
              showSentimentMeter ? 'bg-green-600' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                showSentimentMeter ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </label>
      </div>

      {/* AI Analysis Interval */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          AI Analysis Interval: {analysisInterval}s
        </label>
        <div className="space-y-2">
          <input
            type="range"
            min="1"
            max="30"
            value={analysisInterval}
            onChange={(e) => setAnalysisInterval(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>1s (Fast)</span>
            <span>15s</span>
            <span>30s (Slow)</span>
          </div>
          <p className="text-xs text-gray-400">
            {analysisInterval <= 5 && '⚡ Ultra-fast updates - Best for scalping with Groq'}
            {analysisInterval > 5 && analysisInterval <= 15 && '⚡ Balanced - Good for most trading'}
            {analysisInterval > 15 && '🐢 Conservative - Lower API usage'}
          </p>
        </div>
      </div>

      {/* Status Info */}
      <div className="pt-4 border-t border-gray-700">
        <div className="text-xs text-gray-400 space-y-1">
          <p>• AI enabled: {aiEnabled ? 'Yes' : 'No'}</p>
          <p>• Model: {AI_MODELS.find(m => m.id === selectedModel)?.name}</p>
          <p>• API: {selectedModelInfo?.api === 'groq' ? 'Groq' : 'OpenRouter'}</p>
          <p>• Analysis Interval: {analysisInterval}s</p>
          <p>• Symbol: {symbol}</p>
          <p>• Timeframe: {INTERVALS.find(i => i.value === interval)?.label}</p>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
