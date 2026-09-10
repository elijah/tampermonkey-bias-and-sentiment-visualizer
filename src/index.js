// ==UserScript==
// @name         TamperMonkey Bias & Sentiment Visualizer
// @namespace    http://your-namespace.com/bias-visualizer
// @version      1.0.0
// @description  Identifies highly biased positions via sentiment analysis in social media posts
// @author       You
// @match        https://www.facebook.com/*
// @match        https://*.facebook.com/*
// @grant        none
// @icon         data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAOAOw==
// ==/UserScript==

(function() {
  'use strict';

  // Initialize sentiment analyzer
  const analyzer = new SentimentAnalyzer();
  // Initialize user interface
  const ui = new SentimentUI();
  // Load configuration
  const config = new Config();

  // Main entry point
  function init() {
    config.load().then(() => {
      analyzer.init(config);
      ui.init(config);
      analyzer.observeDOM();
    });
  }

  // Start when DOM is ready
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();