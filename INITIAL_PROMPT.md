# Initial Prompt - TamperMonkey Bias and Sentiment Visualizer

## Project Goal
Build a TamperMonkey extension to help identify highly biased positions via sentiment analysis in social media posts (specifically Facebook posts targeting Republican-leaning content in local politics).

## Key Requirements:
1. Color-code text based on sentiment analysis:
   - Red for extremely concerning words (high negative sentiment/trigger words)
   - Yellow for less concerning words
   - Gradient between red/yellow based on sentiment intensity
   - Less color density for neutral/positive words

2. User Interface for tuning:
   - Allow users to select different areas of concern/topics
   - Adjust sensitivity/thresholds for highlighting
   - Customize color schemes/display preferences

3. Technical Requirements:
   - Git initialized repository
   - Testing frameworks integrated
   - Maintainable and extensible code structure
   - Consumable for future development

4. Target Focus:
   - Republican-leaning posts in local politics
   - Detection of words/phrases designed to trigger emotional responses (pathos)
   - Identification of disingenuous positions masked as factual statements

## Implementation Plan:
- Create TamperMonkey metadata header
- Implement sentiment analysis engine (likely using a pre-trained model or lexicon-based approach)
- DOM manipulation to highlight text in Facebook posts
- Settings panel UI for user customization
- Testing framework setup (likely Jest or similar)
- Documentation and version control

## Future Considerations:
- Performance optimization for large pages
- Compatibility with other social media platforms
- Machine learning model updates
- False positive/negative reduction mechanisms
- User feedback collection