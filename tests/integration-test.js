import { DiceRoller } from '../src/dice.js'
import { MathModule } from '../src/modules/math-module.js'
import { DnDModule } from '../src/modules/dnd-module.js'
let assert = chai.assert;

export let IntegrationTests = ()=>{
    describe('Integration Tests', function() { 
        describe('Dice and Math', function() {
            let roller = new DiceRoller({ modules : [MathModule] });
            let dice = roller.operations.find(op => op.name == 'dice');
            // Simplify our tests by removing randomization; that gets tested in the dice unit tests.
            dice.roll = (facets)=>+facets;

            let tests = [
                { input : '', output : '', note : `successfully does nothing with no input` },
                { input : '123', output : '123', note : `successfully ignores input with no operators` },
                { input : '1d4', output : '4', note : `successfully rolls dice` },
                { input : '1d6+5', output : '11', note : `successfully rolls dice and adds` },
                { input : '1d6+4/2', output : '8', note : `successfully follows order of operations (1d6+4/2 = 1d6+2)` },
                { input : '1d6+4/2*2', output : '10', note : `1d6+4/2*2 = 1d6+((4/2)*2)` },
                { input : '(6+4)/2', output : '5', note : `successfully overrides order of operations when using parenthese (6+4)/2 = 5` },
                { input : '(2+2)^2', output : '16', note : `successfully applies exponents to parentheses` },
            ];
            tests.forEach(test => {
                it(test.note, function() {
                    assert(test.output == roller.solve(test.input));
                })
            });

        });

        describe('Dice, Math, and DnD', function() {
            let roller = new DiceRoller({ modules : [MathModule, DnDModule] });
            let dice = roller.operations.find(op => op.name == 'dice');
            dice.roll = (facets) => +facets;
            
            it('Should evaluate DnD advantage, die, and addition', function() { 
                assert(roller.solve('2xd20+1d6+5') == '[20,20]+11')
            });
        });

    });
}