// Script to resize symbol images from 1024x1024 to 512x512
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths
const symbolsDir = path.join(__dirname, '..', 'public', 'symbols');
const resizedDir = path.join(__dirname, '..', 'public', 'symbols_resized');

// Function to check if a file is an image
function isImageFile(filename) {
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif'];
  const ext = path.extname(filename).toLowerCase();
  return imageExtensions.includes(ext);
}

// Main function to resize all symbol images
async function resizeSymbols() {
  try {
    console.log('Starting symbol image resizing...');

    // Create resized directory if it doesn't exist
    try {
      await fs.mkdir(resizedDir, { recursive: true });
      console.log(`Created directory: ${resizedDir}`);
    } catch (err) {
      if (err.code !== 'EEXIST') {
        console.error(`Failed to create directory ${resizedDir}:`, err);
        throw err;
      }
    }

    // Get all files in the symbols directory
    const files = await fs.readdir(symbolsDir);
    console.log(`Found ${files.length} files in symbols directory`);

    // Track statistics
    let resizedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    let totalSizeBefore = 0;
    let totalSizeAfter = 0;

    // Process each file
    for (const file of files) {
      if (!isImageFile(file)) {
        console.log(`Skipping non-image file: ${file}`);
        skippedCount++;
        continue;
      }

      const inputPath = path.join(symbolsDir, file);
      const outputPath = path.join(resizedDir, file);
      
      try {
        // Get file size before resizing
        const stats = await fs.stat(inputPath);
        totalSizeBefore += stats.size;

        // Resize the image using ffmpeg
        console.log(`Resizing: ${file}`);
        const command = `ffmpeg -y -i "${inputPath}" -vf "scale=512:512" "${outputPath}"`;
        execSync(command, { stdio: 'inherit' });
        
        // Get file size after resizing
        const resizedStats = await fs.stat(outputPath);
        totalSizeAfter += resizedStats.size;
        
        resizedCount++;
        console.log(`Successfully resized: ${file} (${Math.round(stats.size / 1024)}KB → ${Math.round(resizedStats.size / 1024)}KB)`);
      } catch (error) {
        console.error(`Error processing ${file}:`, error);
        errorCount++;
      }
    }

    // Display summary
    console.log('\n===== Resize Summary =====');
    console.log(`Total images processed: ${resizedCount + errorCount}`);
    console.log(`Successfully resized: ${resizedCount}`);
    console.log(`Errors: ${errorCount}`);
    console.log(`Skipped (non-image files): ${skippedCount}`);
    
    const sizeBefore = Math.round(totalSizeBefore / (1024 * 1024) * 100) / 100;
    const sizeAfter = Math.round(totalSizeAfter / (1024 * 1024) * 100) / 100;
    const savings = Math.round((1 - totalSizeAfter / totalSizeBefore) * 100);
    
    console.log(`\nTotal size before: ${sizeBefore} MB`);
    console.log(`Total size after: ${sizeAfter} MB`);
    console.log(`Space savings: ${savings}% (${sizeBefore - sizeAfter} MB)`);
    
    console.log('\nNext steps:');
    console.log('1. Review the resized images in public/symbols_resized/');
    console.log('2. If satisfied with the quality, replace the original files:');
    console.log('   mv public/symbols public/symbols_original');
    console.log('   mv public/symbols_resized public/symbols');
    
  } catch (error) {
    console.error('Error during image resizing:', error);
    process.exit(1);
  }
}

// Run the main function
resizeSymbols();