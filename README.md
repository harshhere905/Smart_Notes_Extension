
# Smart_Notes_Extension
=======
# Smart Notes Chrome Extension

A Chrome extension that allows users to quickly jot down bullet-point notes while watching videos or reading, and then use an AI-powered tool to transform those rough notes into clear, well-organized, and comprehensive study notes.

## Features

- Clean, responsive UI in the extension popup
- Save notes using Chrome's local storage
- Download notes as a text file
- Improve notes using AI to transform bullet points into comprehensive study notes

## Installation

### Local Development

1. Clone or download this repository to your local machine
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" by toggling the switch in the top right corner
4. Click "Load unpacked" and select the directory containing the extension files
5. The extension should now be installed and visible in your Chrome toolbar

### Configuration

Before using the AI improvement feature, you need to set up a proxy server to handle API calls to the AI service (e.g., OpenAI's GPT API). Update the `AI_ENDPOINT` constant in `popup.js` to point to your proxy server:

```javascript
const AI_ENDPOINT = 'https://your-proxy-server.com/ai-improve'; // Replace with your actual endpoint
```

For testing purposes, you can use the mock implementation provided in the commented section of `popup.js`.

## Usage

1. Click on the Smart Notes icon in your Chrome toolbar to open the popup
2. Enter your bullet-point notes in the text area
3. Use the buttons at the bottom to:
   - Save your notes (automatically saved to Chrome's local storage)
   - Download your notes as a text file
   - Improve your notes using AI

## Security Considerations

This extension does not include any API keys directly in the code. You should implement a secure server-side proxy to handle API calls to AI services.

## License

MIT
>>>>>>> 718e848 (Initial commit)
