:: Combine all the es6 modules into a single file 
powershell -Command "& {cat ../dice.js, ../dice-operation.js, ../modules/base-module.js, ../modules/dnd-module.js, ../modules/math-module.js | sc dice.js}"
:: Remove unnecessary import statements
powershell -Command "(gc dice.js) -replace 'import.*', '' | Out-File -encoding ASCII dice.js"