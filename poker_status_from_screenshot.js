// poker_status_from_screenshot.js
import fs from 'fs/promises';
import readline from 'readline';

// Create interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function analyzePokerScreenshot(imagePath) {
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
      model: 'google_gemma-3-27b-it', 
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
    console.log('Sending request to model...');
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
  rl.question('Please enter the full path to the screenshot file: ', async (imagePath) => {
    // Remove quotes if present
    imagePath = imagePath.replace(/["']/g, '');
    
    console.log(`Analyzing poker screenshot: ${imagePath}`);
    
    try {
      const analysis = await analyzePokerScreenshot(imagePath);
      console.log('\nAnalysis complete!');
    } catch (error) {
      console.error('Failed to analyze screenshot:', error.message);
    } finally {
      rl.close();
    }
  });
}

main();