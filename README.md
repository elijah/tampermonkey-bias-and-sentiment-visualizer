# TamperMonkey Bias and Sentiment Visualizer

A TamperMonkey extension that helps identify highly biased positions via sentiment analysis in social media posts, with a focus on detecting emotionally manipulative language in political discourse.

## Features

- **TamperMonkey & ViolentMonkey Compatible**: Works in both userscript managers with `@compatible` directives
- **Sentiment-Based Text Highlighting**: Automatically analyzes text content and highlights words based on their sentiment scores
- **Customizable Color Coding**: 
  - Red for extremely concerning words (high negative sentiment/trigger words)
  - Yellow for less concerning words
  - Gradient between red/yellow based on sentiment intensity
- **User Tuning Interface**: 
  - Select different areas of concern/topics to monitor
  - Adjust sensitivity thresholds for highlighting
  - Customize color schemes and display preferences
- **Default Sensitivity**: Lower threshold (0.15) for broader detection of emotionally manipulative language

## Installation

### One-Click Install

[![Install with TamperMonkey](https://img.shields.io/badge/Install%20with%20TamperMonkey-800000.svg?style=for-the-badge&logo=tampermonkey)](https://raw.githubusercontent.com/elijah/tampermonkey-bias-and-sentiment-visualizer/master/src/index.js)

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

## Adjusting Sensitivity

If the extension is not sensitive enough:

1. Click the "Bias Detector" button (top-left corner of any Facebook page)
2. In the settings panel, lower the "Detection Sensitivity" slider (e.g., from 0.30 to 0.15)
3. Enable additional topics under "Focus Areas" (Immigration, Economy, Elections, etc.)
4. Enable "Topic-Specific Boosting" to amplify political keyword scores

### Suggested Settings for Political Content Detection
- **Threshold**: 0.10–0.15
- **Topics**: Enable all 5 topics
- **Focus**: Immigration, Elections, Security
- **Color Scheme**: High Contrast

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

### Unit Tests
Tests are located in the `tests/` directory and can be run with `npm test`.

### Manual Testing
A test page with sample posts of varying bias levels is available at `test/test-page.html`. Open it in a browser to verify highlighting behavior before deploying.

### Suggested Test Environments
- [Local test HTML](test/test-page.html) — best for verifying highlighting without Facebook
- Facebook groups (e.g., "MAGA", "Stop the Steal", local political groups) — real-world sentiment validation

## License

MIT