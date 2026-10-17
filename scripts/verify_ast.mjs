import fs from 'fs';
import path from 'path';

const dir = './src/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx') || f.endsWith('.tsx'));

for (const f of files) {
  const content = fs.readFileSync(path.join(dir, f), 'utf-8');
  
  // Collect all words imported from lucide-react or other packages
  const importedWords = new Set();
  const importBlocks = content.match(/import\s+(?:{[^}]+}|\w+|\*\s+as\s+\w+)\s+from\s+['"][^'"]+['"]/gs) || [];
  for (const block of importBlocks) {
    const words = block.match(/\b[A-Za-z0-9_]+\b/g) || [];
    words.forEach(w => importedWords.add(w));
  }

  // Find all JSX components like <Component
  const tagMatches = [...content.matchAll(/<([A-Z][a-zA-Z0-9_]*)/g)].map(m => m[1]);
  const uniqueTags = [...new Set(tagMatches)];

  for (const tag of uniqueTags) {
    if (tag === 'React' || tag === 'Fragment') continue;

    // Check if tag is imported or declared
    const isImported = importedWords.has(tag);
    const isDeclared = 
      new RegExp(`\\b(const|let|var|function|class)\\s+${tag}\\b`).test(content) ||
      new RegExp(`\\b${tag}\\s*=\\s*`).test(content);

    if (!isImported && !isDeclared) {
      console.error(`[UNDEFINED JSX TAG] File: ${f}, Tag: <${tag}>`);
    }
  }
}
console.log("AST verification complete.");
