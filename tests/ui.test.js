/**
 * Tests for SentimentUI
 */
const SentimentUI = require('../src/ui.js');

describe('SentimentUI', () => {
  let ui;
  let configMock;

  beforeEach(() => {
    // Mock DOM elements
    document.body.innerHTML = '<div id="app"></div>';
    
    // Mock localStorage
    const storageStore = {};
    global.localStorage = {
      getItem: jest.fn((key) => storageStore[key] || null),
      setItem: jest.fn((key, value) => { storageStore[key] = value; }),
      removeItem: jest.fn((key) => { delete storageStore[key]; })
    };

    // Mock window.alert and window.confirm
    global.window.alert = jest.fn();
    global.window.confirm = jest.fn(() => true);

    configMock = {
      get: jest.fn((key, defaultValue) => defaultValue),
      update: jest.fn(),
      reset: jest.fn(),
      set: jest.fn(),
      settings: {
        highlightThreshold: 0.3,
        colorScheme: 'default',
        focusTopics: [],
        customKeywords: {},
        hidePositive: false,
        enableTopicWeighting: true
      }
    };

    ui = new SentimentUI();
  });

  afterEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';
  });

  describe('init', () => {
    test('should create panel and toggle button', () => {
      ui.init(configMock);
      
      expect(document.getElementById('bias-visualizer-panel')).not.toBeNull();
      expect(document.getElementById('bias-visualizer-toggle')).not.toBeNull();
    });

    test('should set panel to hidden initially', () => {
      ui.init(configMock);
      
      const panel = document.getElementById('bias-visualizer-panel');
      expect(panel.style.display).toBe('none');
    });
  });

  describe('togglePanel', () => {
    test('should toggle panel visibility', () => {
      ui.init(configMock);
      
      let panel = document.getElementById('bias-visualizer-panel');
      expect(panel.style.display).toBe('none');
      
      ui.togglePanel();
      expect(panel.style.display).toBe('flex');
      
      ui.togglePanel();
      expect(panel.style.display).toBe('none');
    });
  });

  describe('saveSettings', () => {
    test('should call config.update with correct settings', () => {
      ui.init(configMock);
      
      // Modify the existing form elements created during init
      const thresholdSlider = document.getElementById('threshold-slider');
      expect(thresholdSlider).not.toBeNull();
      thresholdSlider.value = '0.5';
      
      const colorSchemeSelect = document.getElementById('color-scheme');
      expect(colorSchemeSelect).not.toBeNull();
      colorSchemeSelect.value = 'high-contrast';
      
      const hidePositiveCheckbox = document.getElementById('hide-positive');
      expect(hidePositiveCheckbox).not.toBeNull();
      hidePositiveCheckbox.checked = true;
      
      const enableTopicWeightingCheckbox = document.getElementById('enable-topic-weighting');
      expect(enableTopicWeightingCheckbox).not.toBeNull();
      enableTopicWeightingCheckbox.checked = false;
      
      // Check topic checkboxes
      const topicCheckboxes = document.querySelectorAll('.topic-checkbox');
      topicCheckboxes.forEach(cb => {
        cb.checked = cb.value === 'immigration';
      });
      
      ui.saveSettings();
      
      expect(configMock.update).toHaveBeenCalledWith(
        expect.objectContaining({
          highlightThreshold: 0.5,
          colorScheme: 'high-contrast',
          hidePositive: true,
          enableTopicWeighting: false
        })
      );
    });
  });

  describe('parseCustomKeywords', () => {
    test('should parse custom keywords from textarea', () => {
      const result = ui.parseCustomKeywords('word1:-0.7\nword2:0.5');
      
      expect(result).toEqual({
        'word1': -0.7,
        'word2': 0.5
      });
    });

    test('should handle empty textarea', () => {
      const result = ui.parseCustomKeywords('');
      expect(result).toEqual({});
    });

    test('should handle invalid lines gracefully', () => {
      const result = ui.parseCustomKeywords('invalid-line\nword:-0.5');
      expect(result).toEqual({ 'word': -0.5 });
    });
  });

  describe('resetSettings', () => {
    test('should call config.reset', () => {
      ui.init(configMock);
      ui.resetSettings();
      
      expect(configMock.reset).toHaveBeenCalled();
    });
  });
});