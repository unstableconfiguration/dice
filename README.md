## Dice
I like revisiting the concept of an equation-based dice roller each year as I get better. 
This version uses the same basic pattern I did two years ago, but I'm trying to clean up 
the syntax and add tests to make it more stable and updatable. 

The basic pattern is I have a collection of operations that each act on an input string. 
Each operation has the same basic functions as the rest:
* It evaluates the input string to see if it contains appropriate operators/operands
* It parses them out into parameters 
* It passes those parameters to a function that then updates the original string

As an example. If you have the input string 'abc1+2+3'  
* The addition/subtraction operator will identify '1+2' in the input 
* It will parse it into parameters ['1', '2', '+'] 
* It will evaluate those to 3 and replace them in the string yielding abc3+3
* It will then repeat the process giving abc6

### Dice Roller 
At the heart of the thing is the ability to roll dice, and this is the only pre-packaged 
operation it contains. The dice operation looks for the pattern '#d#' with two numbers 
(1, -1, .1) on either side of a lowercase d. The number to the left is the number of rolls, 
the number to the right is the facets of the dice.  
So if you provide the input '3d6', it will evaluate to random(1, 6) + random(1, 6) + random(1, 6)
and give you a result from 3 to 18 

### Math 
The math module adds very basic PEMDAS functionality. It isn't intended to be a particularly 
robust calculator, but adding and subtracting is very useful, and the others are largely added 
as an exercise to test the robustness of the program.  
As part of integration testing between the modules, it successfully evaluates input such as 
(1d4+3)*4/2^2 to confirm that the rolling, addition, multiplication, and division all work 
together and that the order of operations is standard except when parentheses override it.  

### D&D 5e  
The place I actually use this tool is when playing dungeons and dragons, where I frequently need 
to do rolls like 1d8+5+1d6, which is covered by the basic dice rolling + math module. The 5e 
module adds an additional 'Advantage' extension where if given input like '2xd20+5+1d6' it will 
convert 2xd20 into an array of two 1d20 (rand 1-20) rolls, and then evaluate the rest of the 
statement normally giving you output like: [19, 14]+7 so that you can pick which of the two 
d20 rolls is most appropriate.  