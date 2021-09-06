
## Dice Roller
Equation-based dice roller for use in dice-based games. With no modules loaded, it is simply a random number generator that mimics dice rolls.

Base usage:  
'''
let dice = new Dice();
let solution = dice.solve('3d6');
// Expect: solution is a number 3-18
'''

The dice roller looks for patterns like 'd6' or '1d6' where the 'd' signifies a roll, the number to the left is the number of rolls (default 1 if no number) and the number to the right is the facets of the die.

Example inputs: 
* d6  - a number 1-6 
* 2d8 - a number 2-16

#### Math Module
The math module adds basic math functionality, converting it into a basic equation-based calculator. 
The supported operations are: 
* Parentheses ()
* Exponents ^ 
* Multiplication * 
* Division / 
* Addition + 
* Subtraction -  
The operations evaluate in order.

Base usage:  
'''
let dice = new Dice();
dice.operations.add(math_functions);
let solution = dice.solve('2+3x4');
// Espect: solution is 14
'''

Example inputs: 
* 2+3-1 - 4
* 5*4/2 - 10
* 5*(2^2) - 20
* 1d4+4 - a number 5-8

#### D&D Module
The D&D module only needs minor additional functionality to the base dice rolling and math functions. It adds the ability to roll a dice multiple times, but to keep the rolls separate. This is for when the game expects the player to roll twice and pick the higher or lower of the two numbers. 

Base usage:  
'''
let dice = new Dice({ modules : [MathModule, DnDModule]});
// dice.applyModules([MathModule, DnDModule]);
let solution = dice.solve('2xd20+5');
'''  

The dnd module's function needs to execute before anything else, so it gets inserted at the front of the operatinos queue. 

Example inputs: 
* 2xd20+1d4+5 - expected outcome is the results of the two d20 rolls in square brackets, followed by the results of 1d4+5
