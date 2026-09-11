/**
 * Tests for Config
 */
const Config = require('../src/config.js');

describe('Config', () => {
  let config;

  beforeEach(() => {
    // Create a fresh mock for each test
    const mockGetItem = jest.fn();
    const mockSetItem = jest.fn();
    const mockRemoveItem = jest.fn();

    // Define localStorage on global with mock functions
    Object.defineProperty(global, 'localStorage', {
      value: {
        getItem: mockGetItem,
        setItem: mockSetItem,
        removeItem: mockRemoveItem
      },
      writable: true,
      configurable: true
    });

    config = new Config();
  });

  describe('load', () => {
    test('should load default settings when no stored settings', async () => {
      global.localStorage.getItem.mockReturnValue(null);
      const settings = await config.load();
      
      expect(settings.highlightThreshold).toBe(0.15);
      expect(settings.colorScheme).toBe('default');
    });

    test('should load stored settings when available', async () => {
      const storedSettings = { highlightThreshold: 0.5, colorScheme: 'high-contrast' };
      global.localStorage.getItem.mockReturnValue(JSON.stringify(storedSettings));
      
      const settings = await config.load();
      
      expect(settings.highlightThreshold).toBe(0.5);
      expect(settings.colorScheme).toBe('high-contrast');
    });

    test('should handle invalid JSON gracefully', async () => {
      global.localStorage.getItem.mockReturnValue('invalid-json');
      
      const settings = await config.load();
      
      expect(settings.highlightThreshold).toBe(0.15);
    });
  });

  describe('save', () => {
    test('should save settings to localStorage', async () => {
      config.settings.highlightThreshold = 0.7;
      await config.save();
      
      expect(global.localStorage.setItem).toHaveBeenCalledWith(
        'bias-visualizer-settings',
        expect.stringContaining('"highlightThreshold":0.7')
      );
    });
  });

  describe('get/set', () => {
    test('should get existing setting', () => {
      config.settings.highlightThreshold = 0.5;
      expect(config.get('highlightThreshold')).toBe(0.5);
    });

    test('should return default value for unknown setting', () => {
      expect(config.get('unknownSetting', 'default')).toBe('default');
    });

    test('should set and save setting', async () => {
      config.set('highlightThreshold', 0.6);
      
      expect(config.settings.highlightThreshold).toBe(0.6);
      expect(global.localStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('reset', () => {
    test('should reset all settings to defaults', () => {
      config.settings.highlightThreshold = 0.9;
      config.settings.colorScheme = 'subtle';
      
      config.reset();
      
      expect(config.settings.highlightThreshold).toBe(0.3);
      expect(config.settings.colorScheme).toBe('default');
      expect(config.settings.focusTopics).toEqual([]);
    });
  });

  describe('validateThreshold', () => {
    test('should validate valid thresholds', () => {
      expect(config.validateThreshold(0)).toBe(true);
      expect(config.validateThreshold(0.5)).toBe(true);
      expect(config.validateThreshold(1)).toBe(true);
    });

    test('should reject invalid thresholds', () => {
      expect(config.validateThreshold(-0.1)).toBe(false);
      expect(config.validateThreshold(1.5)).toBe(false);
      expect(config.validateThreshold('string')).toBe(false);
    });
  });
});