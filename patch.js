const fs = require('fs');

function fixConflicts(file, replacePattern) {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;
  if (replacePattern === 'main') {
    newContent = newContent.replace(/<<<<<<< HEAD[\s\S]*?=======\n([\s\S]*?)>>>>>>> main/g, '$1');
  } else if (replacePattern === 'HEAD') {
    newContent = newContent.replace(/<<<<<<< HEAD\n([\s\S]*?)=======\n[\s\S]*?>>>>>>> main/g, '$1');
  }
  fs.writeFileSync(file, newContent);
}

fixConflicts('test-results/.last-run.json', 'main');
fixConflicts('tsconfig.tsbuildinfo', 'main');
