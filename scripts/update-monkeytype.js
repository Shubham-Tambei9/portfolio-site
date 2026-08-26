import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apeKey = process.env.MONKEYTYPE_APE_KEY;
if (!apeKey) {
  console.error("Error: MONKEYTYPE_APE_KEY environment variable is not set.");
  process.exit(1);
}

const targetPath = path.join(__dirname, '../src/assets/monkeytype-activity.json');

console.log("Fetching latest test activity from Monkeytype...");
fetch('https://api.monkeytype.com/users/currentTestActivity', {
  headers: {
    'Authorization': `ApeKey ${apeKey}`
  }
})
  .then(res => {
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    return res.json();
  })
  .then(json => {
    if (json && json.data) {
      fs.writeFileSync(targetPath, JSON.stringify(json.data, null, 2), 'utf8');
      console.log(`Successfully updated ${targetPath}`);
    } else {
      console.error("Error: Response data format is invalid:", json);
      process.exit(1);
    }
  })
  .catch(err => {
    console.error("Error fetching Monkeytype activity:", err);
    process.exit(1);
  });
