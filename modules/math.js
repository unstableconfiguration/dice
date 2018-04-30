
let math_functions = [
    new DiceRoller.prototype.Operation(
        'Parentheses',
        /\([^()]+\)/,
        function(x){ return this.parent.solve(x); }, // function required for 'this' to be passed through
        (match)=>[match.replace(/[()]/g,'')]
    )
    , new DiceRoller.prototype.Operation(
        'Exponents',
        // -?(\d*\.)?\d+ matches [1, -1, .1, 0.1, -.1, -0.1]
        /-?(\d*\.)?\d+\^-?(\d*\.)?\d+/,
        (x,y)=>Math.pow(x,y)
        // uses default parser
    )
    , new DiceRoller.prototype.Operation(
        'MultiplyDivide', 
        /-?(\d*\.)?\d+[//*]-?(\d*\.)?\d/,
        (x,y,z)=> z==='*' ? x*y : (x/y)
        // uses default parser
    )
    , new DiceRoller.prototype.Operation(
        'AddSubtract',
        /-?(\d*\.)?\d+[+-](\d*\.)?\d+/, 
        (x,y)=>+x + +y // adds operands, subtraction is factored out so that 3-2 turns into 3+-2
        // uses default parser
        ) 
];





