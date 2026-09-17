const fs = require('fs');
const filePath = 'app/(dashboard)/profile/_sections/ChildrenProfileSection.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// Replace all occurrences of literal \n and fix the file
content = content.replace(/"use client";\\nimport Link from "next\\/link";/, '"use client";\nimport Link from "next/link";\n');
content = content.replace(/\\n/g, '\n');

// Also remove duplicate "use client" or "import Link" if any
let lines = content.split('\n');
let hasUseClient = false;
let hasLink = false;
let cleanedLines = [];

for (let line of lines) {
  if (line.includes('use client') || line.includes("'use client'")) {
    if (!hasUseClient) {
      hasUseClient = true;
      cleanedLines.push('"use client";');
    }
  } else if (line.trim() === 'import Link from "next/link";') {
    if (!hasLink) {
      hasLink = true;
      cleanedLines.push(line);
    }
  } else {
    cleanedLines.push(line);
  }
}

// Make sure "use client" is at the very top
const useClientIndex = cleanedLines.findIndex(l => l.includes('use client'));
if (useClientIndex > 0) {
  cleanedLines.splice(useClientIndex, 1);
  cleanedLines.unshift('"use client";');
}

fs.writeFileSync(filePath, cleanedLines.join('\n'));
console.log("Properly fixed use client positioning");
