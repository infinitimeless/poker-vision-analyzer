// poker_status_from_screenshot.js
import fs from 'fs/promises';
import readline from 'readline';
import { parseArgs } from 'node:util'; // For Node.js v16.17.0 and later

// Create interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function analyzePokerScreenshot(imagePath, modelName) {
  try {
    // Check if file exists
    try {
      await fs.access(imagePath);
    } catch (error) {
      console.error(`Error: File ${imagePath} not found or inaccessible`);
      return;
    }
    
    // Read the image file
    const imageBuffer = await fs.readFile(imagePath);
    const base64Image = imageBuffer.toString('base64');
    
    // Prepare the API request
    const apiUrl = 'http://localhost:1234/v1/chat/completions';
    const payload = {
      model: modelName, // Use the provided model name
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Analyze this poker table screenshot. Tell me the current game state including: number of players, my cards, community cards, current pot size, and any other relevant information you can see.' },
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
          ]
        }
      ],
      max_tokens: 1024
    };

    // Make API request using fetch
    console.log(`Sending request to model ${modelName}...`);
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${await response.text()}`);
    }

    const data = await response.json();
    const analysis = data.choices[0].message.content;
    
    console.log('Response received:');
    console.log(analysis);
    return analysis;
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
}

// Main function
async function main() {
  // Parse command line arguments
  const { values } = parseArgs({
    options: {
      model: {
        type: 'string',
        short: 'm',
        default: 'google_gemma-3-27b-it',
        description: 'LMStudio model to use (must be vision-capable)'
      },
      help: {
        type: 'boolean',
        short: 'h',
        description: 'Display help information'
      }
    }
  });

  // Show help if requested
  if (values.help) {
    console.log(`
Poker Vision Analyzer - Analyze poker table screenshots

Usage: node poker_status_from_screenshot.js [options]

Options:
  -m, --model <name>   Specify the LMStudio model to use (must be vision-capable)
                       Default: google_gemma-3-27b-it
  -h, --help           Display this help information
    `);
    process.exit(0);
  }

  // Display the selected model
  console.log(`Using LMStudio model: ${values.model}`);

  // If no model was provided via command line, offer interactive selection
  if (values.model === 'google_gemma-3-27b-it' && !process.argv.some(arg => arg === '-m' || arg === '--model')) {
    await new Promise(resolve => {
      console.log('\nAvailable vision-capable models (examples):');
      console.log('1. google_gemma-3-27b-it (default)');
      console.log('2. llava-1.6-34b');
      console.log('3. qwen2-vl-2b-instruct');
      console.log('4. Other model (specify name)');
      
      rl.question('\nSelect a model (enter number or full name, press Enter for default): ', answer => {
        // Map numeric choices to model names
        const modelMap = {
          '': 'google_gemma-3-27b-it', // Default for empty input
          '1': 'google_gemma-3-27b-it',
          '2': 'llava-1.6-34b',
          '3': 'qwen2-vl-2b-instruct'
        };
        
        if (answer === '4') {
          rl.question('Enter the model name: ', modelName => {
            values.model = modelName.trim();
            console.log(`Using model: ${values.model}`);
            resolve();
          });
        } else {
          values.model = modelMap[answer] || answer;
          console.log(`Using model: ${values.model}`);
          resolve();
        }
      });
    });
  }

  // Ask for screenshot path
  rl.question('Please enter the full path to the screenshot file: ', async (imagePath) => {
    // Remove quotes if present
    imagePath = imagePath.replace(/["']/g, '');
    
    console.log(`Analyzing poker screenshot: ${imagePath}`);
    
    try {
      const analysis = await analyzePokerScreenshot(imagePath, values.model);
      console.log('\nAnalysis complete!');
    } catch (error) {
      console.error('Failed to analyze screenshot:', error.message);
    } finally {
      rl.close();
    }
  });
}

main();