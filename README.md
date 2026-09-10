# TamperMonkey Bias and Sentiment Visualizer

A TamperMonkey extension that helps identify highly biased positions via sentiment analysis in social media posts, with a focus on detecting emotionally manipulative language in political discourse.

## Features

- **Sentiment-Based Text Highlighting**: Automatically analyzes text content and highlights words based on their sentiment scores
- **Customizable Color Coding**: 
  - Red for extremely concerning words (high negative sentiment/trigger words)
  - Yellow for less concerning words
  - Gradient between red/yellow based on sentiment intensity
- **User Tuning Interface**: 
  - Select different areas of concern/topics to monitor
  - Adjust sensitivity thresholds for highlighting
  - Customize color schemes and display preferences
- **Targeted Analysis**: Specifically designed for monitoring Republican-leaning posts in local politics

## Installation

### One-Click Install

[![Install with TamperMonkey](https://img.shields.io/badge/Install%20with%20TamperMonkey-800000.svg?style=for-the-badge&logo=tampermonkey)](https://github.com/elijah/tampermonkey-bias-and-sentiment-visualizer/raw/master/src/index.js)

Click the button above to install the extension directly in TamperMonkey. TamperMonkey will prompt you to confirm the installation.

### Manual Installation

1. Install [TamperMonkey](https://www.tampermonkey.net/) browser extension
2. Open the userscript file: [src/index.js](https://github.com/elijah/tampermonkey-bias-and-sentiment-visualizer/blob/master/src/index.js)
3. Click the "Install" button in TamperMonkey

## Development Setup

```bash
# Install dependencies
npm install

# Run tests
npm test

# Lint code
npm run lint

# Build for production
npm run build
```

## Project Structure

```
├── src/                 # Source code
│   ├── index.js         # Main TamperMonkey script
│   ├── sentiment.js     # Sentiment analysis engine
│   ├── ui.js            # User interface components
│   └── config.js        # Configuration settings
├── tests/               # Test files
├── package.json         # Project metadata and dependencies
├── README.md            # This file
└── INITIAL_PROMPT.md    # Original project requirements
```

## How It Works

1. The extension loads on social media pages (primarily Facebook)
2. It analyzes text content using sentiment analysis techniques
3. Words with high negative sentiment scores (indicating potential bias/manipulation) are highlighted in red
4. Moderately concerning words are highlighted in yellow
5. Users can customize which topics to focus on and adjust sensitivity levels

## Testing

Tests are located in the `tests/` directory and can be run with `npm test`.

## License

MIT