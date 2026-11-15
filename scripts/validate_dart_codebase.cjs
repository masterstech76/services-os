const fs = require('fs');
const path = require('path');

function listDartFiles(dir) {
  let files = [];
  fs.readdirSync(dir, { withFileTypes: true }).forEach(ent => {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      files = files.concat(listDartFiles(full));
    } else if (ent.name.endsWith('.dart')) {
      files.push(full);
    }
  });
  return files;
}

const dartFiles = listDartFiles(path.join(__dirname, '..', 'serviceos', 'lib'));
console.log(`Found ${dartFiles.length} Dart files in serviceos/lib.`);

function listKotlinFiles(dir) {
  let files = [];
  if (!fs.existsSync(dir)) return files;
  fs.readdirSync(dir, { withFileTypes: true }).forEach(ent => {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      files = files.concat(listKotlinFiles(full));
    } else if (ent.name.endsWith('.kt')) {
      files.push(full);
    }
  });
  return files;
}

const kotlinFiles = listKotlinFiles(path.join(__dirname, '..', 'serviceos_android'));
console.log(`Found ${kotlinFiles.length} Kotlin files in serviceos_android.`);

let errors = 0;
[...dartFiles, ...kotlinFiles].forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  let openBrace = 0;
  let openParen = 0;
  let inString = false;
  let stringChar = '';
  
  for (let i = 0; i < content.length; i++) {
    const ch = content[i];
    const next = content[i+1];
    
    // Line comment
    if (!inString && ch === '/' && next === '/') {
      while (i < content.length && content[i] !== '\n') i++;
      continue;
    }
    // Block comment
    if (!inString && ch === '/' && next === '*') {
      i += 2;
      while (i < content.length && !(content[i] === '*' && content[i+1] === '/')) i++;
      i += 1;
      continue;
    }
    
    if (ch === '\'' || ch === '"') {
      if (inString && ch === stringChar) {
        if (content[i-1] !== '\\') inString = false;
      } else if (!inString) {
        inString = true;
        stringChar = ch;
      }
      continue;
    }
    
    if (inString) continue;
    
    if (ch === '{') openBrace++;
    if (ch === '}') openBrace--;
    if (ch === '(') openParen++;
    if (ch === ')') openParen--;
  }
  
  if (openBrace !== 0 || openParen !== 0 || inString) {
    console.error(`SYNTAX ERROR in ${path.relative(__dirname, file)}: Braces=${openBrace}, Parens=${openParen}, inString=${inString}`);
    errors++;
  }
});

if (errors === 0) {
  console.log(`SUCCESS: All ${dartFiles.length} Dart source files and ${kotlinFiles.length} Kotlin source files passed structural and syntax checks!`);
} else {
  console.error(`FAILED: Found ${errors} syntax errors in mobile codebase.`);
  process.exit(1);
}
