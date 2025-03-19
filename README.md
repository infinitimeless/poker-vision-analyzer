# poker-vision-analyzer

A tool that uses local LLMs with LMStudio to analyze poker table screenshots and extract game state information.

## Features
- Analyzes poker screenshots to identify cards, pot size, and game state
- Works with LMStudio's local server using vision-capable models
- Uses standard OpenAI-compatible API

## Requirements
- Node.js (v22.0+)
- LMStudio with a vision-capable model (e.g., google_gemma-3-27b-it)

## Setup
1. Clone this repository
2. Run `npm install`
3. Start LMStudio server with a vision-capable model

## Usage
```bash
node poker_status_from_screenshot.js
```
When prompted, enter the full path to your poker screenshot.