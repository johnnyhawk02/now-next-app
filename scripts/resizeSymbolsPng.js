// Script to resize 1024x1024 symbol images to 512x512
// Only processes files that are exactly 1024x1024 pixels
// Renames original files to filename_original.png

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { createCanvas, loadImage } from 'canvas';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths
const symbolsDir = path.join(__dirname, '..', 'public', 'symbols');

// Function to check image dimensions
async function getImageDimensions(filePath) {
  try {
    const img = await loadImage(filePath);
    return {
      width: img.width,
      height: img.height
    };
  } catch (error) {
    console.error(`Error reading image dimensions for ${filePath}:`, error);
    return null;
  }
}

// Main function to resize symbol images
async function resizeSymbols() {
  try {
    console.log('Starting symbol image resizing process...');
    console.log(`Looking for 1024x1024 PNG files in: ${symbolsDir}`);

    // Get all files in the symbols directory
    const files = await fs.readdir(symbolsDir);
    console.log(`Found ${files.length} total files in symbols directory`);

    // Track statistics
    let resizedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    let notSquareCount = 0;
    let notRightSizeCount = 0;
    let alreadyProcessedCount = 0;

    // Process each file
    for (const file of files) {
      // Skip non-PNG files
      if (!file.toLowerCase().endsWith('.png')) {
        console.log(`Skipping non-PNG file: ${file}`);
        skippedCount++;
        continue;
      }

      // Skip files with _original in the name
      if (file.includes('_original')) {
        console.log(`Skipping already processed original file: ${file}`);
        alreadyProcessedCount++;
        continue;
      }

      const filePath = path.join(symbolsDir, file);
      
      try {
        // Check image dimensions
        const dimensions = await getImageDimensions(filePath);
        
        if (!dimensions) {
          errorCount++;
          continue;
        }
        
        // Skip if not a square
        if (dimensions.width !== dimensions.height) {
          console.log(`Skipping non-square image: ${file} (${dimensions.width}x${dimensions.height})`);
          notSquareCount++;
          continue;
        }
        
        // Skip if not 1024x1024
        if (dimensions.width !== 1024) {
          console.log(`Skipping image with wrong dimensions: ${file} (${dimensions.width}x${dimensions.height})`);
          notRightSizeCount++;
          continue;
        }
        
        console.log(`Processing: ${file} (${dimensions.width}x${dimensions.height})`);
        
        // Rename original file
        const originalName = file.replace('.png', '_original.png');
        const originalPath = path.join(symbolsDir, originalName);
        
        // Create a backup of the original file
        await fs.copyFile(filePath, originalPath);
        console.log(`Created backup: ${originalName}`);
        
        // Resize the image using ffmpeg
        const command = `ffmpeg -y -i "${filePath}" -vf "scale=512:512" "${filePath}.temp.png"`;
        execSync(command, { stdio: 'inherit' });
        
        // Replace the original with the resized version
        await fs.rename(`${filePath}.temp.png`, filePath);
        
        // Get original and new file sizes
        const originalStats = await fs.stat(originalPath);
        const newStats = await fs.stat(filePath);
        const originalKB = Math.round(originalStats.size / 1024);
        const newKB = Math.round(newStats.size / 1024);
        const savingsPercent = Math.round((1 - (newStats.size / originalStats.size)) * 100);
        
        console.log(`Successfully resized: ${file} (${originalKB}KB → ${newKB}KB, ${savingsPercent}% smaller)`);
        resizedCount++;
      } catch (error) {
        console.error(`Error processing ${file}:`, error);
        errorCount++;
      }
    }

    // Display summary
    console.log('\n===== Resize Summary =====');
    console.log(`Total PNG files: ${files.filter(f => f.toLowerCase().endsWith('.png')).length}`);
    console.log(`Successfully resized: ${resizedCount}`);
    console.log(`Errors: ${errorCount}`);
    console.log(`Skipped (non-PNG files): ${skippedCount}`);
    console.log(`Skipped (already processed/has '_original'): ${alreadyProcessedCount}`);
    console.log(`Skipped (not square): ${notSquareCount}`);
    console.log(`Skipped (not 1024x1024): ${notRightSizeCount}`);
    
    console.log('\nDone! All eligible 1024x1024 images have been resized to 512x512.');
    console.log('Original files were preserved with the "_original" suffix.');
    
  } catch (error) {
    console.error('Error during image resizing process:', error);
    process.exit(1);
  }
}

// Run the main function
resizeSymbols();