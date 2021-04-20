# Dice Rolling
Random number generation simulating dice rolls.

## initialization
The relevant modules are specified when initializing the dice roller. With no modules specified, it will only handle the 'd' operator. 

```javascript
import { DiceRoller, MathModule, DnDModule, LoggingModule } from '../scripts/dice.js'
// Can handle PEMDAS and 'xd' operations
let dice = new DiceRoller({ modules : [MathModule, DnDModule]});
```

## .solve(equation)
Once initialized, the .solve() function can be called. It expects a string input equation, and will output a string result. 

```javascript
import { DiceRoller, MathModule } from '../scripts/dice.js'

let dice = new DiceRoller({ modules : [MathModule]});
let result = dice.solve('4+5'); // expect: 9
```

## d operator
Dice roll operator. The **facets** of the die are specified by an integer to the right of the 'd' operator. The **number of rolls** can be specified by an integer to the left of the 'd' operator.

```javascript 
let dice = new DiceRoller();

dice.solve('d4');   // expect: 1-4
dice.solve('d100'); // expect: 1-100
dice.solve('2d4');  // expect: 2-8
dice.solve('10d1'); // expect: 10
```

# Math Operations
PEMDAS operations, evaluated in order.

```javascript
let dice = new DiceRoller({ modules : [MathModule]})
```

## () parentheses
Parentheses can be used to force order of operations. 
```javascript 
dice.solve('2+4*2');    // expect: 10
dice.solve('(2+4)*2');  // expect: 12
```

## ^ exponents
The ^ operator can be used to get the nth power of x (x^n).
```javascript
dice.solve('2^2');  // expect: 4
dice.solve('3^4');  // expect: 81
```

## */ multiplication/division
Multiplication and division are evaluated simultaneously. n*x to multiply n by x. n/x to divide n by x;
```javascript
dice.solve('2*3');  // expect: 6
dice.solve('-3*4'); // expect: -12
dice.solve('3/2');  // expect: 1.5
dice.solve('6/2*2');// expect: 6
```

## +- addition/subtraction
Addition and subtraction are evaluated simultaneously. n+x to add n to x. n-x to subtract x from n;
```javascript
dice.solve('1+1');  // expect: 2
dice.solve('2-1');  // expect: 1
dice.solve('2-1+1');// expect: 2
```

# D&D Module  
Utilities for Dungeons and Dragons tabletop roleplaying

```javascript
let dice = new DiceRoller({ modules : [DnDModule] });
```

## xd operator  
nxdy rolls a y-sided die n times, but keeps the rolls separated in an array sorted in descending order. This is used by the 'advantage/disadvantage' rules in D&D where the player rolls twice and picks the higher/lower of the results.
```javascript
// expect an array of two numbers 1-20;
dice.solve('2xd20');    // example: [18, 11]
// expect an array of four numbers 1-4
dice.solve('4xd4');     // example: [4, 3, 3, 1]
```

# Logging Module