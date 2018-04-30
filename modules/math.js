let math_functions = [
    new DiceRoller.prototype.Operation(
        'Parentheses', {
            search: /\([^()]+\)/,
            parse : (match)=>[match.replace(/[()]/g,'')],
            call : function(x){ return this.parent.solve(x); } // function required for 'this' to be passed through
        }
    )
    , new DiceRoller.prototype.Operation(
        'Exponents', {
            // -?(\d*\.)?\d+ matches [1, -1, .1, 0.1, -.1, -0.1]
            search : /-?(\d*\.)?\d+\^-?(\d*\.)?\d+/,
            call : (x,y)=>Math.pow(x,y)
        }
    )
    , new DiceRoller.prototype.Operation(
        'MultiplyDivide', { 
            search : /-?(\d*\.)?\d+[//*]-?(\d*\.)?\d/,
            call : (x,y,z)=> z==='*' ? x*y : (x/y)
        }
    )
    , new DiceRoller.prototype.Operation(
        'AddSubtract', {
            search : /-?(\d*\.)?\d+[+-](\d*\.)?\d+/, 
            call : (x,y)=>+x + +y // adds operands, subtraction is factored out so that 3-2 turns into 3+-2
        }
    )
];



