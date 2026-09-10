/**
 * Tests for SentimentAnalyzer
 */
const SentimentAnalyzer = require('../src/sentiment.js');

describe('SentimentAnalyzer', () => {
  let analyzer;

  beforeEach(async () => {
    analyzer = new SentimentAnalyzer();
    // Mock config for testing
    analyzer.config = {
      getHighlightThreshold: () => 0.3,
      get: (key, defaultValue) => defaultValue,
      settings: {
        enableTopicWeighting: true,
        focusTopics: []
      }
    };
    // Load lexicons
    await analyzer.loadDefaultLexicons();
    await analyzer.loadTopicKeywords();
  });

  describe('analyzeText', () => {
    test('should detect negative words', () => {
      const text = 'This is a terrible situation';
      const result = analyzer.analyzeText(text);
      
      const terribleWord = result.find(w => w.lowercase === 'terrible');
      expect(terribleWord).toBeDefined();
      expect(terribleWord.sentimentScore).toBeLessThan(0);
    });

    test('should detect positive words', () => {
      const text = 'This is a wonderful day';
      const result = analyzer.analyzeText(text);
      
      const wonderfulWord = result.find(w => w.lowercase === 'wonderful');
      expect(wonderfulWord).toBeDefined();
      expect(wonderfulWord.sentimentScore).toBeGreaterThan(0);
    });

    test('should handle empty text', () => {
      const result = analyzer.analyzeText('');
      expect(result).toEqual([]);
    });

    test('should handle non-string input', () => {
      const result = analyzer.analyzeText(null);
      expect(result).toEqual([]);
    });

    test('should be case-insensitive', () => {
      const text1 = 'HATE';
      const text2 = 'hate';
      const text3 = 'Hate';
      
      const result1 = analyzer.analyzeText(text1);
      const result2 = analyzer.analyzeText(text2);
      const result3 = analyzer.analyzeText(text3);
      
      expect(result1[0].lowercase).toBe('hate');
      expect(result2[0].lowercase).toBe('hate');
      expect(result3[0].lowercase).toBe('hate');
    });
  });

  describe('shouldHighlightWord', () => {
    test('should highlight words above threshold', () => {
      expect(analyzer.shouldHighlightWord(-0.8)).toBe(true);
      expect(analyzer.shouldHighlightWord(0.8)).toBe(true);
    });

    test('should not highlight words below threshold', () => {
      expect(analyzer.shouldHighlightWord(-0.2)).toBe(false);
      expect(analyzer.shouldHighlightWord(0.2)).toBe(false);
    });

    test('should handle edge cases', () => {
      expect(analyzer.shouldHighlightWord(0)).toBe(false);
      expect(analyzer.shouldHighlightWord(1)).toBe(true);
      expect(analyzer.shouldHighlightWord(-1)).toBe(true);
    });
  });

  describe('getColorForScore', () => {
    test('should return red for strong negative scores', () => {
      const color = analyzer.getColorForScore(-0.9);
      expect(color).toContain('255, 0, 0');
    });

    test('should return orange for moderate negative scores', () => {
      const color = analyzer.getColorForScore(-0.6);
      expect(color).toContain('255, 165, 0');
    });

    test('should return yellow for weak negative scores', () => {
      const color = analyzer.getColorForScore(-0.4);
      expect(color).toContain('255, 255, 0');
    });

    test('should return light green for positive scores', () => {
      const color = analyzer.getColorForScore(0.5);
      expect(color).toContain('0, 255, 0');
    });
  });

  describe('loadDefaultLexicons', () => {
    test('should load negative words', async () => {
      await analyzer.loadDefaultLexicons();
      expect(analyzer.negativeWords.has('hate')).toBe(true);
      expect(analyzer.negativeWords.has('destroy')).toBe(true);
    });

    test('should load positive words', async () => {
      await analyzer.loadDefaultLexicons();
      expect(analyzer.positiveWords.has('good')).toBe(true);
      expect(analyzer.positiveWords.has('wonderful')).toBe(true);
    });
  });

  describe('loadTopicKeywords', () => {
    test('should load topic keywords', async () => {
      await analyzer.loadTopicKeywords();
      expect(analyzer.topicKeywords.has('immigration')).toBe(true);
      expect(analyzer.topicKeywords.has('economy')).toBe(true);
      expect(analyzer.topicKeywords.has('security')).toBe(true);
      expect(analyzer.topicKeywords.has('elections')).toBe(true);
      expect(analyzer.topicKeywords.has('health')).toBe(true);
    });

    test('should have correct keywords for immigration', async () => {
      await analyzer.loadTopicKeywords();
      const keywords = analyzer.topicKeywords.get('immigration');
      expect(keywords.has('border')).toBe(true);
      expect(keywords.has('wall')).toBe(true);
      expect(keywords.has('amnesty')).toBe(true);
    });
  });
});