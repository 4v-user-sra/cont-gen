const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf-8');
const lines = content.split('\n');
lines.forEach((l, i) => {
    if (l.includes('\\\\')) {
        console.log(`${i+1}: ${l}`);
    }
});
