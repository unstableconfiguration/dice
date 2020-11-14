import { DiceOperation } from '../dice-operation.js'

export let math = [
    new DiceOperation(
        'Parentheses', {
            search: /\([^()]+\)/,
            parse : (match)=>[match.replace(/[()]/g,'')],
            call : function(x){ return this.parent.solve(x); } // function required for 'this' to be passed through
        }
    )
    , new DiceOperation(
        'Exponents', {
            // -?(\d*\.)?\d+ matches [1, -1, .1, 0.1, -.1, -0.1]
            search : /-?(\d*\.)?\d+\^-?(\d*\.)?\d+/,
            call : (x,y)=>Math.pow(x,y)
        }
    )
    , new DiceOperation(
        'MultiplyDivide', { 
            search : /-?(\d*\.)?\d+[//*]-?(\d*\.)?\d/,
            call : (x,y,z)=> z==='*' ? x*y : (x/y)
        }
    )
    , new DiceOperation(
        'AddSubtract', {
            search : /-?(\d*\.)?\d+[+-](\d*\.)?\d+/, 
            call : (x,y)=>+x + +y // adds operands, subtraction is factored out so that 3-2 turns into 3+-2
        }
    )
];



