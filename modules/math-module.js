import { DiceOperation } from '../dice-operation.js'

/*  Explanation of this pattern: 
    -?(\d*\.)?\d+
        -? : optional - sign for negative numbers 
        (\d*\.)? : optional set of 0 or more numbers and one . for decimals 
        \d+ : one or more digits.  

    Matches 
        1
        1.1
        .1
        -1
        -1.1
        -.1
*/

export let MathModule = {
    apply : function(roller) {
        this.operations.forEach(op => {
            // Parentheses needs a reference to the roller for recursion 
            op.parent = roller;
            roller.operations.push(op);
        });
    },
    operations : [
        new DiceOperation({
            name : 'Parentheses',
            search: /\([^()]+\)/,
            parse : (match)=>[match.replace(/[()]/g,'')],
            evaluate : function(x) { return this.parent.solve(x); } 
        })
        , new DiceOperation({
            name : 'Exponents',
            // -?(\d*\.)?\d+ matches [1, -1, .1, 0.1, -.1, -0.1]
            search : /-?(\d*\.)?\d+\^-?(\d*\.)?\d+/,
            evaluate : (x,y) => Math.pow(x, y)
        })
        , new DiceOperation({
            name : 'Multiply', 
            search : /-?(\d*\.)?\d+[*]-?(\d*\.)?\d+/,
            evaluate : (x,y) => x * y
        })
        , new DiceOperation({
            name : 'Divide',
            search : /-?(\d*\.)?\d+[\/]-?(\d*\.)?\d+/,
            evaluate : (x,y) => x / y
        })
        , new DiceOperation({
            name : 'Add',
            search : /-?(\d*\.)?\d+[+]-?(\d*\.)?\d+/, 
            evaluate : (x,y) => +x + +y  
        })
        , new DiceOperation({
            name : 'Subtract',
            // Exclude the optional subtraction sign on the second digit
            search : /-?(\d*\.)?\d+[\-](\d*\.)?\d+/, 
            // The default parse behavior returns positive or negative numbers. 
            // So if we have 1-4, x and y will be 1 and -4. 
            // Rather than fight this, we can just treat 1-4 as 1+-4 and add them
            evaluate : (x,y) => +x + +y  
        })
    ]
};



