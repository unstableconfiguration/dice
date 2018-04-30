

describe('Integration Tests', function(){
    let assert = chai.assert;
    let roller = new DiceRoller();
    roller.operations.add(math_functions);
    roller.operations.insert(0, dnd_functions[0]);
    roller.rand = (r)=>+r;
    describe('Dice and Math', function(){
        let integration_tests = [
            { input : '', output : '', note : `successfully does nothing with no input` },
            { input : '123', output : '123', note : `successfully ignores input with no operators` },
            { input : '1d4', output : '4', note : `successfully rolls dice` },
            { input : '1d6+5', output : '11', note : `successfully rolls dice and adds` },
            { input : '1d6+4/2', output : '8', note : `successfully follows order of operations (1d6+4/2 = 8 not 5)` },
            { input : '1d6+4/2*2', output : '10', note : `1d6+4/2*2 = rand(6)+((4/2)*2)` },
            { input : '(6+4)/2', output : '5', note : `successfully overrides order of operations when using parenthese (6+4)/2 = 5` },
            { input : '(2+2)^2', output : '16', note : `successfully applies exponents to parentheses` },
        ];
        integration_tests.forEach(test=>{
            it(test.note, function(){
                //console.log(test.input, test.output, roller.solve(test.input));
                assert.isTrue(test.output == roller.solve(test.input));
            })
        })    
    });
    describe('Dice, Math, and 5e', function(){
        window.roller = roller;
        let integration_tests = [
            { input : '2xd20+1d6+5', output : '[20,20]+11', note : `Rolls advantage and solves the rest of the equation independently.`},
            { input : '10+1d6', output : '16', note : `Dice rolls precede math functions`},
        ];
        integration_tests.forEach(test=>{
            it(test.note, function(){
                //console.log(test.input, test.output, roller.solve(test.input));
                assert.isTrue(test.output == roller.solve(test.input));
            })
        })
    })
});