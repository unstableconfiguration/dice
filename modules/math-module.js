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
            evaluate : function(x) { return this.parent.solve(x); } 
        })
        , new DiceOperation({
            name : 'Exponents',
            search : /-?(\d*\.)?\d+\^-?(\d*\.)?\d+/,
            evaluate : (x,y) => Math.pow(x, y)
        })
        /* Needs to happen simultaneously, so a single function */
        , new DiceOperation({
            name : 'MultiplyAndDivide',
            search : /-?(\d*\.)?\d+[*\/]-?(\d*\.)?\d+/,
            parse : function(searchResult) {
                let firstOperand = /^-?(\d*\.)?\d+/.exec(searchResult)[0];
                let secondOperand = /-?(\d*\.)?\d+$/.exec(searchResult)[0];
                let operator = /[\*\/]/.exec(searchResult)[0];
                return [firstOperand, secondOperand, operator];
            }
            , evaluate : (x, y, op) => op == '*' ? x * y : x / y
        })
        , new DiceOperation({
            name : 'Add',
            search : /-?(\d*\.)?\d+[+]-?(\d*\.)?\d+/, 
            evaluate : (x,y) => +x + +y  
        })
        , new DiceOperation({
            name : 'Subtract',
            search : /-?(\d*\.)?\d+[\-]-?(\d*\.)?\d+/, 
            parse : function(searchResult) { 
                let firstOperand = /^-?(\d*\.)?\d+/.exec(searchResult)[0];
                let secondOperand = /(--)?(\d*\.)?\d+$/.exec(searchResult)[0];
                if(secondOperand.substr(0, 2) == '--') { secondOperand = secondOperand.substr(1); }
                return [firstOperand, secondOperand];
            },
            evaluate : (x,y) => +x - +y  
        })
    ]
};
