/**
 * Config - Manages user configuration and preferences for the bias/sentiment visualizer
 */
class Config {
  constructor() {
    this.settings = {
      highlightThreshold: 0.3, // Minimum sentiment score magnitude to highlight
      colorScheme: 'default', // 'default', 'high-contrast', 'subtle'
      focusTopics: [], // Array of topic names to focus on (empty = all)
      customKeywords: {}, // User-defined custom keywords with sentiment weights
      hidePositive: false, // Hide/neutralize positively-sentiment words
      excludeNegativeCount: false, // Don't count negative words in total
      enableTopicWeighting: true, // Apply topic-specific keyword boosting
    };
    this.storageKey = 'bias-visualizer-settings';
  }

  /**
   * Load settings from storage, merge with defaults
   */
  async load() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.settings = { ...this.settings, ...parsed };
      }
    } catch (e) {
      console.warn('Failed to load settings from localStorage', e);
    }
    return this.settings;
  }

  /**
   * Save current settings to storage
   */
  async save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.settings));
    } catch (e) {
      console.warn('Failed to save settings to localStorage', e);
    }
  }

  /**
   * Get a specific setting value
   * @param {string} key - Setting key
   * @param {any} defaultValue - Default value if key doesn't exist
   * @returns {any} Setting value
   */
  get(key, defaultValue) {
    return this.settings[key] !== undefined ? this.settings[key] : defaultValue;
  }

  /**
   * Set a specific setting value and save
   * @param {string} key - Setting key
   * @param {any} value - Setting value
   */
  set(key, value) {
    this.settings[key] = value;
    this.save().catch(() => {});
  }

  /**
   * Update multiple settings at once
   * @param {Object} settings - Partial settings object to merge
   */
  update(settings) {
    this.settings = { ...this.settings, ...settings };
    this.save().catch(() => {});
  }

  /**
   * Reset all settings to defaults
   */
  reset() {
    this.settings = {
      highlightThreshold: 0.3,
      colorScheme: 'default',
      focusTopics: [],
      customKeywords: {},
      hidePositive: false,
      excludeNegativeCount: false,
      enableTopicWeighting: true,
    };
    this.save();
  }

  /**
   * Validate a highlight threshold value
   * @param {number} value - Threshold value to validate
   * @returns {boolean} Whether the value is valid
   */
  validateThreshold(value) {
    return typeof value === 'number' && value >= 0 && value <= 1;
  }
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Config;
}