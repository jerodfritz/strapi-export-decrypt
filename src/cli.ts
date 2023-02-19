const fs = require('fs');
const { createReadStream, createWriteStream } = require('fs');
const { scryptSync, createDecipheriv } = require('crypto');
const path = require('path');

const args = process.argv.slice(2);

if (args.length < 3) {
  console.error('Usage: strapi-export-decrypt <input-file> <output-file> <key>');
  process.exit(1);
}

const [inputFile, outputFile, key] = args;

const outputDir = path.dirname(outputFile);
fs.mkdirSync(outputDir, { recursive: true });

const readStream = createReadStream(inputFile);
const hashedKey = scryptSync(key, '', 16);
const initVector = null;
const decipher = createDecipheriv('aes-128-ecb', hashedKey, initVector);

const writeStream = createWriteStream(outputFile, { flags: 'w' });
readStream.pipe(decipher).pipe(writeStream);

writeStream.on('finish', () => {
  console.log(`File decrypted and saved to ${outputFile}`);
});
