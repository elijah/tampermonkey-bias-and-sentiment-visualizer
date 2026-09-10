/**
 * SentimentUI - User interface for configuring and interacting with the sentiment analyzer
 */
class SentimentUI {
  constructor() {
    this.config = null;
    this.panel = null;
    this.isVisible = false;
    this.analyzer = null;
  }

  /**
   * Initialize UI with configuration reference
   * @param {Config} config - Configuration object
   * @param {SentimentAnalyzer} analyzer - Analyzer instance (optional)
   */
  init(config, analyzer = null) {
    this.config = config;
    this.analyzer = analyzer;
    this.createPanel();
    this.loadSettings();
    this.addToggleButton();
  }

  /**
   * Create the settings panel
   */
  createPanel() {
    // Create main panel
    this.panel = document.createElement('div');
    this.panel.id = 'bias-visualizer-panel';
    this.panel.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      width: 300px;
      max-height: 80vh;
      background: rgba(255, 255, 255, 0.95);
      border: 2px solid #333;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 9999;
      font-family: Arial, sans-serif;
      display: none;
      flex-direction: column;
      overflow-y: auto;
    `;

    // Create header
    const header = document.createElement('div');
    header.style.cssText = `
      background: #2c3e50;
      color: white;
      padding: 12px;
      border-radius: 6px 6px 0 0;
      font-weight: bold;
      text-align: center;
    `;
    header.textContent = 'Bias Detector Settings';
    this.panel.appendChild(header);

    // Create body
    const body = document.createElement('div');
    body.style.cssText = `
      padding: 15px;
      overflow-y: auto;
      flex-grow: 1;
    `;
    body.innerHTML = this.getSettingsHTML();
    this.panel.appendChild(body);

    // Create footer with buttons
    const footer = document.createElement('div');
    footer.style.cssText = `
      display: flex;
      justify-content: space-around;
      padding: 10px;
      border-top: 1px solid #eee;
    `;
    
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.style.cssText = this.getButtonStyle('#27ae60');
    saveBtn.addEventListener('click', () => this.saveSettings());
    
    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Reset';
    resetBtn.style.cssText = this.getButtonStyle('#e74c3c');
    resetBtn.addEventListener('click', () => this.resetSettings());
    
    footer.appendChild(saveBtn);
    footer.appendChild(resetBtn);
    this.panel.appendChild(footer);

    // Add panel to document
    document.body.appendChild(this.panel);

    // Add event listeners for form elements
    this.panel.addEventListener('change', (e) => this.handleSettingChange(e));
    this.panel.addEventListener('input', (e) => this.handleSettingChange(e));
  }

  /**
   * Get CSS for buttons
   * @param {string} color - Button color
   * @returns {string} CSS string
   */
  getButtonStyle(color) {
    return `
      background: ${color};
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
      transition: background 0.2s;
    `;
  }

  /**
   * Get the HTML for the settings form
   * @returns {string} HTML string
   */
  getSettingsHTML() {
    return `
      <div class="setting-group">
        <label for="threshold-slider">Detection Sensitivity:</label>
        <div style="display: flex; align-items: center; margin: 8px 0;">
          <input type="range" id="threshold-slider" min="0" max="1" step="0.05">
          <span id="threshold-value">0.30</span>
        </div>
        <small>Higher values = fewer highlights (more selective)</small>
      </div>
      
      <div class="setting-group">
        <label>Focus Areas:</label>
        <div style="margin: 8px 0;">
          ${this.getTopicCheckboxes()}
        </div>
      </div>
      
      <div class="setting-group">
        <label for="color-scheme">Color Scheme:</label>
        <select id="color-scheme">
          <option value="default">Default (Red/Yellow)</option>
          <option value="high-contrast">High Contrast</option>
          <option value="subtle">Subtle</option>
        </select>
      </div>
      
      <div class="setting-group">
        <label>
          <input type="checkbox" id="hide-positive">
          Hide/Mute Positive Sentiment Words
        </label>
      </div>
      
      <div class="setting-group">
        <label>
          <input type="checkbox" id="enable-topic-weighting">
          Enable Topic-Specific Boosting
        </label>
      </div>
      
      <div class="setting-group">
        <label for="custom-words">Custom Keywords (one per line, format: word:weight):</label>
        <textarea id="custom-words" rows="3" placeholder="e.g.\\nliberal:-0.7\\nconservative:0.5"></textarea>
      </div>
    `;
  }

  /**
   * Get HTML for topic checkboxes
   * @returns {string} HTML string
   */
  getTopicCheckboxes() {
    const topics = [
      { id: 'immigration', name: 'Immigration' },
      { id: 'economy', name: 'Economy/Jobs' },
      { id: 'security', name: 'National Security' },
      { id: 'elections', name: 'Election Integrity' },
      { id: 'health', name: 'Health/Pandemic' }
    ];
    
    return topics.map(topic => `
      <label style="display: block; margin: 4px 0;">
        <input type="checkbox" class="topic-checkbox" value="${topic.id}">
        ${topic.name}
      </label>
    `).join('');
  }

  /**
   * Add toggle button to show/hide panel
   */
  addToggleButton() {
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'bias-visualizer-toggle';
    toggleBtn.textContent = 'Bias Detector';
    toggleBtn.style.cssText = `
      position: fixed;
      top: 20px;
      left: 20px;
      background: #3498db;
      color: white;
      border: none;
      padding: 10px 15px;
      border-radius: 4px;
      cursor: pointer;
      z-index: 9999;
      font-weight: bold;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    `;
    
    toggleBtn.addEventListener('click', () => this.togglePanel());
    document.body.appendChild(toggleBtn);
  }

  /**
   * Toggle panel visibility
   */
  togglePanel() {
    this.isVisible = !this.isVisible;
    this.panel.style.display = this.isVisible ? 'flex' : 'none';
  }

  /**
   * Handle setting changes from UI
   * @param {Event} event - Change/input event
   */
  handleSettingChange(event) {
    const target = event.target;
    const id = target.id;
    const value = target.type === 'checkbox' ? target.checked : target.value;

    switch (id) {
      case 'threshold-slider':
        document.getElementById('threshold-value').textContent = 
          parseFloat(value).toFixed(2);
        break;
      case 'color-scheme':
        this.applyColorScheme(value);
        break;
      // Other settings will be handled on save
    }
  }

  /**
   * Apply color scheme immediately
   * @param {string} scheme - Color scheme name
   */
  applyColorScheme(scheme) {
    // This would modify the analyzer's color generation
    // For now, we'll store it and apply on next save
    this.config.set('colorScheme', scheme);
  }

  /**
   * Save all settings from UI
   */
  saveSettings() {
    const thresholdSlider = document.getElementById('threshold-slider');
    const colorSchemeSelect = document.getElementById('color-scheme');
    const hidePositiveCheckbox = document.getElementById('hide-positive');
    const topicCheckboxes = document.querySelectorAll('.topic-checkbox');
    const customWordsTextarea = document.getElementById('custom-words');
    const enableTopicWeightingCheckbox = document.getElementById('enable-topic-weighting');

    const settings = {
      highlightThreshold: parseFloat(thresholdSlider.value),
      colorScheme: colorSchemeSelect.value,
      hidePositive: hidePositiveCheckbox.checked,
      enableTopicWeighting: enableTopicWeightingCheckbox.checked,
      focusTopics: Array.from(topicCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value),
      customKeywords: this.parseCustomKeywords(customWordsTextarea.value)
    };

    this.config.update(settings);
    this.isVisible = false;
    this.panel.style.display = 'none';
    
    // Notify analyzer of changes if needed
    if (this.analyzer) {
      // In a real implementation, we might trigger a re-analysis
    }
    
    if (typeof window !== 'undefined' && window.alert) {
      window.alert('Settings saved!');
    }
  }

  /**
   * Parse custom keywords from textarea
   * @param {string} text - Text from textarea
   * @returns {Object} Parsed keywords object
   */
  parseCustomKeywords(text) {
    const result = {};
    const lines = text.trim().split('\n');
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;
      
      const parts = trimmed.split(':');
      if (parts.length === 2) {
        const word = parts[0].trim().toLowerCase();
        const weight = parseFloat(parts[1].trim());
        
        if (!isNaN(weight) && word) {
          result[word] = weight;
        }
      }
    });
    
    return result;
  }

  /**
   * Load settings into UI controls
   */
  loadSettings() {
    // This would be called after config is loaded
    // For now, we'll set defaults
    const thresholdSlider = document.getElementById('threshold-slider');
    if (thresholdSlider) {
      thresholdSlider.value = this.config.get('highlightThreshold', 0.3);
      document.getElementById('threshold-value').textContent = 
        this.config.get('highlightThreshold', 0.3).toFixed(2);
    }
    
    const colorSchemeSelect = document.getElementById('color-scheme');
    if (colorSchemeSelect) {
      colorSchemeSelect.value = this.config.get('colorScheme', 'default');
    }
    
    const hidePositiveCheckbox = document.getElementById('hide-positive');
    if (hidePositiveCheckbox) {
      hidePositiveCheckbox.checked = this.config.get('hidePositive', false);
    }
    
    const enableTopicWeightingCheckbox = document.getElementById('enable-topic-weighting');
    if (enableTopicWeightingCheckbox) {
      enableTopicWeightingCheckbox.checked = this.config.get('enableTopicWeighting', true);
    }
    
    // Set topic checkboxes
    const focusTopics = this.config.get('focusTopics', []);
    const topicCheckboxes = document.querySelectorAll('.topic-checkbox');
    topicCheckboxes.forEach(cb => {
      cb.checked = focusTopics.includes(cb.value);
    });
    
    // Set custom keywords textarea
    const customWordsTextarea = document.getElementById('custom-words');
    if (customWordsTextarea) {
      const customKeywords = this.config.get('customKeywords', {});
      const lines = Object.entries(customKeywords)
        .map(([word, weight]) => `${word}:${weight}`)
        .join('\n');
      customWordsTextarea.value = lines;
    }
  }

  /**
   * Reset settings to defaults
   */
  resetSettings() {
    if (typeof window !== 'undefined' && window.confirm) {
      if (window.confirm('Reset all settings to defaults?')) {
        this.config.reset();
        this.loadSettings();
        this.applyColorScheme(this.config.get('colorScheme', 'default'));
        window.alert('Settings reset to defaults');
      }
    } else {
      this.config.reset();
      this.loadSettings();
      this.applyColorScheme(this.config.get('colorScheme', 'default'));
    }
  }

  /**
   * Cleanup resources
   */
  disconnect() {
    // Remove panel and toggle button
    if (this.panel && this.panel.parentNode) {
      this.panel.parentNode.removeChild(this.panel);
    }
    const toggleBtn = document.getElementById('bias-visualizer-toggle');
    if (toggleBtn && toggleBtn.parentNode) {
      toggleBtn.parentNode.removeChild(toggleBtn);
    }
  }
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SentimentUI;
}