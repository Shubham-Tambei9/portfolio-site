import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PROFILE } from '../src/data/profile.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetPath = path.join(__dirname, '../src/assets/monkeytype-activity.json');

async function main() {
  console.log("Fetching latest test activity from Monkeytype...");
  const apeKey = process.env.MONKEYTYPE_APE_KEY;
  const username = PROFILE.monkeytype || PROFILE.github || 'Shubham-Tambei9';

  try {
    let activityData = null;

    if (apeKey) {
      console.log("Using ApeKey authentication...");
      const res = await fetch('https://api.monkeytype.com/users/currentTestActivity', {
        headers: {
          'Authorization': `ApeKey ${apeKey}`,
          'Accept': 'application/json',
        },
      });

      console.log(`Response status: ${res.status} ${res.statusText}`);
      if (res.ok) {
        const json = await res.json();
        if (json && json.data) {
          activityData = json.data;
        }
      }
    }

    if (!activityData) {
      console.log(`Fetching public profile for @${username}...`);
      const res = await fetch(`https://api.monkeytype.com/users/${username}/profile`);
      console.log(`Response status: ${res.status} ${res.statusText}`);

      if (!res.ok) {
        const body = await res.text();
        console.error(`HTTP error! Status: ${res.status}`);
        console.error(`Response body: ${body}`);
        process.exit(1);
      }

      const json = await res.json();
      if (json && json.data && json.data.testActivity) {
        activityData = json.data.testActivity;
      }
    }

    if (activityData) {
      fs.writeFileSync(targetPath, JSON.stringify(activityData, null, 2), 'utf8');
      console.log(`Successfully updated ${targetPath}`);
    } else {
      console.error("Error: Response data format is invalid.");
      process.exit(1);
    }
  } catch (err) {
    console.error("Error fetching Monkeytype activity:", err.message || err);
    process.exit(1);
  }
}

main();

