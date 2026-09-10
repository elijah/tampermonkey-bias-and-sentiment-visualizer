/**
 * SentimentAnalyzer - Core engine for detecting biased language through sentiment analysis
 */
class SentimentAnalyzer {
  constructor() {
    this.negativeWords = new Set();
    this.positiveWords = new Set();
    this.topicKeywords = new Map();
    this.config = null;
  }

  /**
   * Initialize the analyzer with configuration
   * @param {Config} config - Configuration object
   */
  async init(config) {
    this.config = config;
    await this.loadDefaultLexicons();
    await this.loadTopicKeywords();
  }

  /**
   * Load default sentiment lexicons
   */
  async loadDefaultLexicons() {
    const negativeWordList = [
      'hate', 'destroy', 'eliminate', 'dangerous', 'threat', 'criminal', 'illegal',
      'invasion', 'flood', 'crisis', 'emergency', 'disaster', 'catastrophe',
      'radical', 'extremist', 'fanatic', 'terrorist', 'invader', 'alien',
      'disgusting', 'appalling', 'shocking', 'horrifying', 'outrageous',
      'lie', 'liar', 'fake', 'fraud', 'corrupt', 'crooked', 'evil',
      'terrible', 'awful', 'horrible', 'dreadful', 'wretched', 'atrocious',
      'toxic', 'poisonous', 'harmful', 'destructive', 'ruinous',
      'nuclear', 'war', 'kill', 'murder', 'death', 'die', 'dying',
      'stupid', 'idiot', 'fool', 'crazy', 'insane', 'mad',
      'socialist', 'communist', 'marxist', 'liberal', 'progressive',
      'fascist', 'dictator', 'tyrant', 'authoritarian', 'totalitarian'
    ];

    const positiveWordList = [
      'good', 'great', 'excellent', 'wonderful', 'fantastic', 'amazing',
      'brilliant', 'superb', 'outstanding', 'remarkable', 'exceptional',
      'beautiful', 'happy', 'joy', 'love', 'peace', 'harmony', 'unity',
      'fair', 'just', 'equal', 'free', 'liberty', 'rights', 'democracy',
      'trust', 'honest', 'true', 'real', 'authentic', 'genuine',
      'strong', 'powerful', 'proud', 'patriot', 'patriotic',
      'conservative', 'republican', 'traditional', 'stable', 'secure',
      'prosperous', 'wealthy', 'thriving', 'flourishing', 'successful'
    ];

    negativeWordList.forEach(word => this.negativeWords.add(word.toLowerCase()));
    positiveWordList.forEach(word => this.positiveWords.add(word.toLowerCase()));
  }

  /**
   * Load topic-specific keywords
   */
  async loadTopicKeywords() {
    const topics = {
      immigration: [
        'border', 'wall', 'amnesty', 'deport', 'illegal immigrant', 'anchor baby',
        'chain migration', 'visa lottery', 'sanctuary city', 'catch and release',
        'build the wall', 'mass deportation', 'open borders'
      ],
      economy: [
        'socialist', 'communist', 'marxist', 'redistribution', 'wealth tax',
        'job killer', 'destroy the economy', 'bankrupt', 'financial crisis',
        'socialism', 'redistribute', 'tax and spend', 'welfare'
      ],
      security: [
        'terrorist', 'jihad', 'sharia law', 'refugee crisis', 'muslim ban',
        'extreme vetting', 'national security threat', 'radical islam',
        'infiltrate', 'sleeper cell', 'importing terror'
      ],
      elections: [
        'rigged', 'stolen election', 'voter fraud', 'ballot stuffing',
        'dead people voting', 'illegal voting', 'election interference',
        'rigged election', 'fake election', 'coup'
      ],
      health: [
        'microchip', 'tracking device', 'plandemic', 'hoax', 'fake pandemic',
        'vaccine passport', 'mark of the beast', 'fake vaccine',
        'experimental jab', 'clandestine'
      ]
    };

    Object.keys(topics).forEach(topic => {
      const lowerCaseWords = topics[topic].map(word => word.toLowerCase());
      this.topicKeywords.set(topic, new Set(lowerCaseWords));
    });
  }

  /**
   * Analyze text and return sentiment scores for each word
   * @param {string} text - Text to analyze
   * @returns {Array<Object>} Array of word objects with sentiment scores
   */
  analyzeText(text) {
    if (!text || typeof text !== 'string') return [];

    const words = text.match(/\b[\w'-]+\b/g) || [];
    
    return words.map(word => {
      const lowerWord = word.toLowerCase();
      let sentimentScore = 0;
      let isTopicRelated = false;
      let matchedTopic = null;

      if (this.negativeWords.has(lowerWord)) {
        sentimentScore = -0.8;
      } else if (this.positiveWords.has(lowerWord)) {
        sentimentScore = 0.6;
      }

      if (sentimentScore <= 0.2) {
        for (const [topic, keywords] of this.topicKeywords.entries()) {
          if (keywords.has(lowerWord)) {
            isTopicRelated = true;
            matchedTopic = topic;
            if (sentimentScore >= 0) {
              sentimentScore = -0.5;
            } else if (sentimentScore > -0.8) {
              sentimentScore = -0.9;
            }
            break;
          }
        }
      }

      return {
        original: word,
        lowercase: lowerWord,
        sentimentScore: sentimentScore,
        isTopicRelated: isTopicRelated,
        topic: matchedTopic,
        shouldHighlight: this.shouldHighlightWord(sentimentScore)
      };
    });
  }

  /**
   * Determine if a word should be highlighted based on sentiment score
   * @param {number} score - Sentiment score (-1 to 1)
   * @returns {boolean} Whether the word should be highlighted
   */
  shouldHighlightWord(score) {
    if (!this.config) return false;
    
    const threshold = this.config.getHighlightThreshold();
    return Math.abs(score) >= threshold;
  }

  /**
   * Get color for a word based on sentiment score
   * @param {number} score - Sentiment score (-1 to 1)
   * @returns {string} CSS color value
   */
  getColorForScore(score) {
    if (!this.config) return '#ff0000';
    
    if (score >= 0) {
      return 'rgba(0, 255, 0, 0.1)';
    }
    
    const intensity = Math.abs(score);
    if (intensity >= 0.8) {
      return 'rgba(255, 0, 0, 0.8)';
    } else if (intensity >= 0.5) {
      return 'rgba(255, 165, 0, 0.7)';
    } else {
      return 'rgba(255, 255, 0, 0.6)';
    }
  }

  /**
   * Highlight words in DOM elements
   * @param {HTMLElement} element - Element to process
   */
  highlightElement(element) {
    if (!element || !element.textContent) return;

    const skipTags = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'CANVAS']);
    if (skipTags.has(element.tagName)) return;

    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    let node;
    while ((node = walker.nextNode())) {
      this.processTextNode(node);
    }
  }

  /**
   * Process a text node and highlight words
   * @param {Text} textNode - Text node to process
   */
  processTextNode(textNode) {
    const text = textNode.textContent;
    const analyzed = this.analyzeText(text);
    
    const needsHighlight = analyzed.some(word => word.shouldHighlight);
    if (!needsHighlight) return;

    const wrapper = document.createElement('span');
    
    let currentPos = 0;
    analyzed.forEach(wordInfo => {
      const wordIndex = text.toLowerCase().indexOf(wordInfo.lowercase, currentPos);
      if (wordIndex === -1) return;
      
      if (wordIndex > currentPos) {
        wrapper.appendChild(document.createTextNode(text.substring(currentPos, wordIndex)));
      }
      
      const wordSpan = document.createElement('span');
      wordSpan.textContent = text.substring(wordIndex, wordIndex + wordInfo.original.length);
      
      if (wordInfo.shouldHighlight) {
        wordSpan.style.backgroundColor = this.getColorForScore(wordInfo.sentimentScore);
        wordSpan.style.borderRadius = '2px';
        wordSpan.style.padding = '0 1px';
        wordSpan.title = `Sentiment: ${wordInfo.sentimentScore.toFixed(2)}` +
                         (wordInfo.topicRelated ? ` | Topic: ${wordInfo.topic}` : '');
      }
      
      wrapper.appendChild(wordSpan);
      currentPos = wordIndex + wordInfo.original.length;
    });
    
    if (currentPos < text.length) {
      wrapper.appendChild(document.createTextNode(text.substring(currentPos)));
    }
    
    textNode.parentNode.replaceChild(wrapper, textNode);
  }

  /**
   * Observe DOM changes for dynamic content
   */
  observeDOM() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            this.highlightElement(node);
          } else if (node.nodeType === 3) {
            this.processTextNode(node);
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });

    this.observer = observer;
  }

  /**
   * Cleanup resources
   */
  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SentimentAnalyzer;
}