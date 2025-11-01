# Fabio Trading Bot

A real-time trading bot with AI-powered signal generation based on the **Fabio Playbook** methodology. This application uses Binance market data, TradingView Lightweight Charts for visualization, and OpenRouter AI for intelligent trade analysis.

## 🚀 Features

### Core Functionality
- **Real-time Market Data**: Live candlestick data from Binance API
- **Advanced Charting**: TradingView Lightweight Charts with volume analysis
- **AI-Powered Analysis**: Toggle-based AI signal generation using multiple models
- **Multi-Model Support**: Choose from GPT-4, Claude, Mixtral, and more
- **Fabio Playbook Logic**:
  - Trend Continuation (Out of Balance → New Balance)
  - Mean Reversion (Failed Breakout → Back Into Balance)

### Trading Analysis
The bot implements three-pillar analysis:
1. **Market State Determination**: Identifies balanced vs. imbalanced markets
2. **Key Location Detection**: Uses Volume Profile (POC, HVN, LVN)
3. **Aggression Confirmation**: Analyzes order flow and volume pressure

### Risk Management
- **Stop Loss**: Automatically calculated beyond aggressive prints
- **Risk Control**: 0.25%-0.5% per trade
- **Target Setting**: Previous balance POC or trailing on trends
- **Position Sizing**: Risk-based calculation

### Dashboard Features
- Live trade history
- Real-time P&L tracking
- Signal log with timestamps
- Win rate statistics
- Account balance monitoring

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenRouter API key (get one at https://openrouter.ai/)

## 🛠️ Installation

1. **Clone the repository**:
   ```bash
   cd fabio
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:3000`

## 📦 Exporting to a New Repository

Use the helper script to snapshot the current project into a brand-new git repository (useful when you want to publish or share your personalized build). You can let the script choose a timestamped export directory for you:

```bash
scripts/save-to-new-repo.sh
```

Or provide a custom destination (parent directories will be created automatically):

```bash
scripts/save-to-new-repo.sh ../fabio-new
```

Need to wire the export straight to a remote repository (e.g., GitHub)? Pass the URL as the second argument and the script will add it as `origin`:

```bash
scripts/save-to-new-repo.sh ../fabio-new https://github.com/itsmesarath/sentimentai2.git
```

Prefer npm scripts? Run:

```bash
npm run export:new-repo -- ../fabio-new
```

The script will:

- Create the destination directory if it does not exist yet (or a timestamped one in `../exports/` when none is provided).
- Copy the current `HEAD` sources into that directory using `git archive`.
- Initialize a new git repository, create a `main` branch, and perform the initial commit for you.
- Optionally add a remote named `origin` when you supply a repository URL as the second argument.

After it finishes you can `cd` into the new directory and push the freshly created repository (if you provided a remote the script prints the exact `git push` command to run).

## 🔑 Configuration

### Setting up OpenRouter API Key

1. Get your API key from [OpenRouter](https://openrouter.ai/)
2. In the app, click "Set API Key" in the Control Panel
3. Enter your API key and save

### Customization

You can modify the following in the app:
- **Trading Pair**: Select from popular crypto pairs (BTC, ETH, BNB, etc.)
- **Timeframe**: Choose from 1m, 5m, 15m, 1h, 4h, 1d
- **AI Model**: Select your preferred model (GPT-4, Claude, Mixtral, etc.)
- **Risk Per Trade**: Default is 0.5%, adjustable in store

## 📊 How It Works

### 1. Market Data Collection
- Connects to Binance WebSocket for real-time price updates
- Fetches historical candlestick data (500 candles)
- Calculates volume profile for key level identification

### 2. AI Analysis (when enabled)
The AI analyzes market conditions every 30-60 seconds:

```
Market State Assessment
        ↓
Volume Profile Analysis (POC, HVN, LVN)
        ↓
Order Flow Evaluation (CVD, Imbalances)
        ↓
Signal Generation (LONG/SHORT/FLAT)
```

### 3. Signal Generation Rules

A signal is ONLY generated when **all three conditions align**:

✅ **Market State**: Clear trend or balance identified  
✅ **Key Location**: POC, HVN, or LVN level confirmed  
✅ **Aggression**: Strong CVD pressure or footprint imbalance

### 4. Trade Execution (Manual)
The bot generates signals but doesn't execute trades automatically. You can:
- View signal details (entry, stop loss, target)
- Read AI reasoning for each signal
- Manually decide whether to take the trade

## 🧠 AI Models Available

| Model | Provider | Best For |
|-------|----------|----------|
| GPT-4 Turbo | OpenAI | Detailed analysis, complex reasoning |
| Claude 3 Opus | Anthropic | High accuracy, nuanced understanding |
| Claude 3 Sonnet | Anthropic | Balanced speed and quality |
| Mixtral 8x7B | Mistral | Fast analysis, cost-effective |
| Gemini Pro | Google | Multi-modal analysis |

## 📈 Understanding the Fabio Playbook

### Two Main Models

**1. Trend Continuation (Out of Balance → New Balance)**
- Market breaks from consolidation (balance)
- Creates imbalance with LVNs
- AI looks for new balance formation
- Entry on pullback to key level

**2. Mean Reversion (Failed Breakout → Back Into Balance)**
- Breakout attempt fails (rejection at LVN)
- Price returns to previous balance
- Volume confirms lack of aggression
- Entry on return to POC/HVN

### Volume Profile Terms

- **POC** (Point of Control): Highest volume price level - most accepted price
- **HVN** (High Volume Node): Areas of acceptance/consolidation
- **LVN** (Low Volume Node): Areas of rejection/imbalance

### Order Flow Indicators

- **CVD** (Cumulative Volume Delta): Net buying/selling pressure over time
- **Footprint Imbalances**: Aggressive buying/selling at specific price levels
- **Volume Spikes**: Indicates institutional participation

## 🎯 Usage Tips

1. **Start with Paper Trading**: Use the dashboard to track hypothetical trades
2. **Review AI Reasoning**: Always read the signal reasoning before acting
3. **Respect Risk Management**: Never exceed 0.5% risk per trade
4. **Wait for All Conditions**: Don't force trades when signal is FLAT
5. **Use Higher Timeframes**: 5m+ recommended for better signal quality

## ⚠️ Disclaimer

This software is for **educational purposes only**. It is **NOT financial advice**.

- Trading cryptocurrencies involves substantial risk
- Past performance does not guarantee future results
- Always do your own research (DYOR)
- Never trade with money you can't afford to lose
- The developers are not responsible for any trading losses

## 🔧 Troubleshooting

### WebSocket Connection Issues
If you see connection errors:
- Check your internet connection
- Binance API might be temporarily down
- Try refreshing the page

### AI Analysis Not Running
Make sure:
- OpenRouter API key is set correctly
- AI toggle is enabled
- You have sufficient API credits

### Chart Not Updating
- Check browser console for errors
- Ensure WebSocket connection is established
- Try changing the trading pair or timeframe

## 🛣️ Roadmap

Future enhancements planned:
- [ ] Backtesting mode with historical data
- [ ] Alert system for key level breaks
- [ ] Advanced order flow visualization
- [ ] Multi-timeframe analysis
- [ ] Custom risk profiles
- [ ] Trade journal export
- [ ] Performance analytics

## 📝 License

MIT License - feel free to modify and use for your own projects.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For questions or issues, please open an issue on GitHub.

---

**Built with ❤️ using React, TradingView Charts, Binance API & OpenRouter AI**
