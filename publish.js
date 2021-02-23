const fs = require('fs');
const ghpages = require('gh-pages');

// Copy build files to gh-pages branch folder
fs.copyFile('dist/dice.js', 'gh-pages/scripts/dice.js', (err) => {
  if (err) throw err;
  console.log('dist/dice.js copied to gh-pages/scripts/dice.js');
});

fs.copyFile('dist/tests.js', 'gh-pages/scripts/tests.js', (err) => { 
    if (err) throw err;
    console.log('dist/tests.js copied to gh-pages/scripts/tests.js');
});

// Publish /gh-pages/* to gh-pages branch and push to remote
ghpages.publish('gh-pages', function(err) {});