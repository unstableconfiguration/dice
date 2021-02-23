

const fs = require('fs');

// Copy build files to gh-pages branch folder
fs.copyFile('dist/dice.js', 'gh-pages/scripts/dice.js', (err) => {
  if (err) throw err;
  console.log('dist/dice.js copied to gh-pages/scripts/dice.js');
});

fs.copyFile('dist/tests.js', 'gh-pages/scripts/tests.js', (err) => { 
    if (err) throw err;
    console.log('dist/tests.js copied to gh-pages/scripts/tests.js');
});

// Need to copy dist/dice.js and dist/tests.js 
// to gh-pages/scripts/


//var ghpages = require('gh-pages');
//ghpages.publish('dist', function(err) {});