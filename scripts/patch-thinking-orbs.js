import fs from 'fs';
import path from 'path';

const targetFiles = [
  'node_modules/thinking-orbs/dist/index-B8WsUNf5.js',
  'node_modules/thinking-orbs/dist/index-Rl6_4MTr.cjs'
];

targetFiles.forEach((relPath) => {
  const fullPath = path.resolve(relPath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    if (content.includes('const preset = PRESETS[mode][size];')) {
      content = content.replace(
        'const preset = PRESETS[mode][size];',
        'const preset = PRESETS[mode][size] || PRESETS[mode][64];'
      );
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`[patch-thinking-orbs] Patched ${relPath}`);
    }
  }
});
