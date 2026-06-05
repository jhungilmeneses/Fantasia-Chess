const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
let depth = 0;
let lastLines = [];
let lineNum = 1;
for (let i = 0; i < content.length; i++) {
   if (content[i] === '\n') lineNum++;
   if (content[i] === '{') depth++;
   if (content[i] === '}') {
       depth--;
       if (depth < 0) {
           console.log("Unbalanced } at line " + lineNum + " around: " + content.substring(i-30, i+30));
           break;
       }
   }
}
console.log("Final depth: " + depth);
