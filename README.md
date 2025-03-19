# poker-vision-analyzer

A tool that uses local LLMs with LMStudio to analyze poker table screenshots and extract game state information.

## Features
- Analyzes poker screenshots to identify cards, pot size, and game state
- Works with LMStudio's local server using vision-capable models
- Uses standard OpenAI-compatible API
- Customizable model selection for different LMStudio vision models

## Requirements
- Node.js (v22.0+)
- LMStudio with a vision-capable model (e.g., google_gemma-3-27b-it)

## Setup
1. Clone this repository
2. Run `npm install`
3. Start LMStudio server with a vision-capable model

## Usage

### Basic Usage
```bash
node poker_status_from_screenshot.js
```

You'll be prompted to select a model and enter the path to your screenshot.

### Command Line Options
```bash
# Use default model
node poker_status_from_screenshot.js

# Specify a different model
node poker_status_from_screenshot.js --model llava-1.6-34b
# OR
node poker_status_from_screenshot.js -m llava-1.6-34b

# Show help
node poker_status_from_screenshot.js --help
# OR
node poker_status_from_screenshot.js -h
```

### Available Options
- `--model` or `-m`: Specify the LMStudio model to use (must be vision-capable)
  - Default: `google_gemma-3-27b-it`
- `--help` or `-h`: Display help information

### Using npm Scripts
```bash
# Use default model
npm run analyze

# Show help
npm run analyze:help

# Specify a custom model (appends your model after the command)
npm run analyze:model your-custom-model-name
```

## Recommended Models
Any vision-capable model in LMStudio will work with this tool, such as:
- google_gemma-3-27b-it
- llava-1.6-34b
- qwen2-vl-2b-instruct
- phi3-vision-128k-instruct

Make sure your selected model is loaded in LMStudio before using this tool.