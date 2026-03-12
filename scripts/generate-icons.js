const sharp = require('sharp');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const sourcePath = path.join(__dirname, '../public/icon.svg');
const iconsDir = path.join(__dirname, '../public/icons');

async function generateIcons() {
  try {
    for (const size of sizes) {
      const outputPath = path.join(iconsDir, `icon-${size}x${size}.png`);
      await sharp(sourcePath)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      console.log(`Generated ${outputPath}`);
    }
    console.log('All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons();
