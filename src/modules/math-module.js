import { DiceOperation } from '../dice-operation.js'

/* RegExp fragment. 
    -? : optional - sign for negative numbers 
    (\d*\.)? : optional set of 0 or more numbers and one . for decimals 
    \d+ : one or more digits.  

    matches: 1, 1.1, .1, -1, -1.1, -.1
*/
const rgxNumber = '-?(\\d*\\.)?\\d+';


export let MathModule = function() {
    this.apply = function(roller) {
        this.operations.forEach(op => {
            // Parentheses needs a reference to the roller for recursion 
            op.parent = roller;
            roller.operations.push(op);
        });
    }
    this.operations = [
        new DiceOperation({
            name : 'Parentheses',
            search: /\([^()]+\)/,
            parse : (match)=>[match.replace(/[()]/g,'')],
            resolve : function(x) { return this.parent.solve(x); } 
        })
        , new DiceOperation({
            name : 'Exponents',
            search : new RegExp(rgxNumber + '\\^' + rgxNumber),
            resolve : (x,y) => Math.pow(x, y)
        })
        /* Needs to happen simultaneously, so a single function */
        , new DiceOperation({
            name : 'MultiplyDivide',
            search : new RegExp(rgxNumber + '[*\\/]' + rgxNumber),
            parse : function(expression) {
                let firstOperand = new RegExp('^' + rgxNumber).exec(expression)[0];
                let secondOperand = new RegExp(rgxNumber + '$').exec(expression)[0];
                let operator = /[*\/]/.exec(expression)[0];
                return [firstOperand, secondOperand, operator];
            }
            , resolve : (x, y, op) => op == '*' ? x * y : x / y
        })
        , new DiceOperation({
            name : 'AddSubtract',
            search : new RegExp(rgxNumber + '[+-]' + rgxNumber),
            parse : function(expression) { 
                let firstOperand = new RegExp('^' + rgxNumber).exec(expression)[0];
                let secondOperand = new RegExp(rgxNumber + '$').exec(expression)[0];
                
                let operator = expression.substr(firstOperand.length, 1);
                // Make secondOperand positive if we are subtracting a positive.
                if(operator == '-' && !/--/.test(expression)) {
                    secondOperand = secondOperand.substr(1);
                }

                return [firstOperand, secondOperand, operator];
            },
            resolve : (x, y, op) => op == '+' ? +x + +y : +x - +y 
        })
    ]
};
