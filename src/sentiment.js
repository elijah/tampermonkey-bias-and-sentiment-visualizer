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
      'fascist', 'dictator', 'tyrant', 'authoritarian', 'totalitarian',
      'woke', 'cancel culture', 'politically correct', 'snowflake', 'triggered',
      'deep state', 'globalist', 'elite', 'establishment', 'swamp',
      'fake news', 'mainstream media', 'lamestream', 'propaganda',
      'brainwashed', 'sheeple', 'cult', 'cultist',
      'treason', 'traitor', 'communist', 'marxist', 'bolshevik',
      'nazi', 'fascist', 'hitler', 'holocaust denier',
      'racist', 'white supremacist', 'nazi', 'kkk',
      'anti-american', 'unamerican', 'traitorous',
      'communist china', 'china virus', 'kung flu',
      'open borders', 'amnesty', 'anchor baby', 'chain migration',
      'defund police', 'acab', 'all cops are bastards',
      'black lives matter', 'blm', 'antifa', 'fascist',
      'election fraud', 'stolen election', 'rigged election',
      'voter fraud', 'illegal voting', 'dead people voting',
      'plandemic', 'hoax', 'scamdemic', 'fake pandemic',
      'microchip', 'tracking device', 'vaccine passport',
      'mark of the beast', '666', 'antichrist',
      'abortion', 'baby killer', 'pro-life', 'pro-choice',
      'gun control', 'gun grabber', '2nd amendment',
      'climate change hoax', 'global warming scam',
      'transgender', 'trans agenda', 'groomer', 'pedophile',
      'critical race theory', 'crt', 'systemic racism',
      'white privilege', 'reverse racism',
      'me too', 'times up', 'sexual harassment',
      'rape culture', 'toxic masculinity',
      'israel', 'palestine', 'zionist', 'anti-semite',
      'muslim ban', 'sharia law', 'jihad',
      'build the wall', 'mexico pays for it',
      'caravan', 'invaders', 'illegals', 'wetback',
      'anchor baby', 'birthright citizenship',
      'chain migration', 'visa lottery',
      'sanctuary city', 'catch and release',
      'asylum seekers', 'refugee crisis',
      'border surge', 'human trafficking',
      'drug cartel', 'narco state',
      'china virus', 'wuhan lab', 'gain of function',
      ' fauci', 'bill gates', 'microchip vaccine',
      'vaccine mandate', 'vaccine passport',
      'medical tyranny', 'health passport',
      'lockdown', 'social distancing', 'mask mandate',
      'vaxxed', 'anti-vaxxer', 'vaxxhole',
      'herd immunity', 'natural immunity'
    ];

    const positiveWordList = [
      'good', 'great', 'excellent', 'wonderful', 'fantastic', 'amazing',
      'brilliant', 'superb', 'outstanding', 'remarkable', 'exceptional',
      'beautiful', 'happy', 'joy', 'love', 'peace', 'harmony', 'unity',
      'fair', 'just', 'equal', 'free', 'liberty', 'rights', 'democracy',
      'trust', 'honest', 'true', 'real', 'authentic', 'genuine',
      'strong', 'powerful', 'proud', 'patriot', 'patriotic',
      'conservative', 'republican', 'traditional', 'stable', 'secure',
      'prosperous', 'wealthy', 'thriving', 'flourishing', 'successful',
      'liberty', 'freedom', 'independence', 'constitution', 'bill of rights',
      'founding fathers', 'american dream', 'hard work', 'meritocracy',
      'rule of law', 'equal justice', 'due process',
      'free speech', 'religious freedom', 'second amendment',
      'pro life', 'sanctity of life', 'adoption',
      'pro choice', 'bodily autonomy', 'reproductive rights',
      'law and order', 'police support', 'thin blue line',
      'strong borders', 'legal immigration', 'merit based',
      'america first', 'patriotism', 'national pride',
      'economic growth', 'job creation', 'low unemployment',
      'tax cuts', 'deregulation', 'free market',
      'energy independence', 'american energy',
      'veterans support', 'military strong',
      'law enforcement', 'first responders',
      'faith', 'god', 'christian', 'judeo christian',
      'family values', 'traditional marriage',
      'school choice', 'education reform',
      'infrastructure', 'roads and bridges',
      'second amendment', 'right to bear arms',
      'constitutional sheriff', 'posse comitatus',
      'nullification', 'states rights',
      'tenth amendment', 'federalism',
      'electoral college', 'republic not democracy',
      'limited government', 'small government',
      'fiscal responsibility', 'balanced budget',
      'national debt reduction',
      'american exceptionalism', 'shining city on hill',
      'manifest destiny', ' frontier spirit',
      'rugged individualism', 'self reliance',
      'pull yourself up by bootstraps',
      ' american ingenuity', 'innovation',
      ' silicon valley', 'tech sector',
      'wall street', 'financial sector',
      'main street', 'small business',
      'entrepreneur', 'self employed',
      'hard work ethic', 'protestant work ethic',
      ' self made man', 'rags to riches',
      ' horatio alger', 'bootstrap theory',
      ' trickle down economics', ' supply side',
      ' laffer curve', ' voodoo economics',
      ' trickle up poverty', ' voodoo economics',
      ' socialism lite', ' democratic socialism',
      ' marxism lite', ' cultural marxism',
      ' frankfurt school', ' political correctness',
      ' social justice warrior', ' sjw',
      ' virtue signaling', ' wokeism',
      ' cancel culture', ' callout culture',
      ' outrage industrial complex',
      ' grievance industry', ' victimhood culture',
      ' participation trophy', ' everyone gets a trophy',
      ' safe space', ' trigger warning',
      ' microaggression', ' implicit bias',
      ' diversity training', ' unconscious bias',
      ' affirmative action', ' racial quotas',
      ' disparate impact', ' equal opportunity',
      ' merit based', ' colorblind society',
      ' blind justice', ' lady justice',
      ' judicial restraint', ' originalism',
      ' textualism', ' living constitution',
      ' activist judge', ' legislating from bench',
      ' supreme court', ' scotus',
      ' federalist society', ' aclu',
      ' naacp', ' adl', ' splc',
      ' heritage foundation', ' cato institute',
      ' brookings institution', ' pew research',
      ' gallup poll', ' rasmussen reports',
      ' fox news', ' cnn', ' msnbc',
      ' breitbart', ' infowars', ' daily caller',
      ' new york times', ' washington post',
      ' wall street journal', ' financial times',
      ' economist', ' bloomberg',
      ' reuters', ' associated press',
      ' national review', ' weekly standard',
      ' mother jones', ' salon',
      ' slate', ' politico',
      ' the hill', ' buzzfeed',
      ' huffington post', ' daily kos',
      ' moveon.org', ' mediamatters',
      ' fox news', ' cnn', ' msnbc',
      ' breitbart', ' infowars', ' daily caller',
      ' new york times', ' washington post',
      ' wall street journal', ' financial times'
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