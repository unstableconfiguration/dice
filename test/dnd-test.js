import { DiceRoller } from '../src/dice.js'
import { DnDModule } from '../src/modules/dnd-module.js'
import { strict as assert } from 'assert';

describe('5e dice extensions', function(){
    let roller = new DiceRoller({ modules : [DnDModule]});

    describe('Advantage/Disadvantage', function() {
        let advantage = new DnDModule().operations[0];
        describe('Searching', function(){
            let searchTests = [
                { input : '2xd20', output : '2xd20', note : `matches 2xd20` },
                { input : 'xd10', output : null, note : `does not match xd10` },
                { input : '3xd', output : null, note : `does not match 3xd` },
                { input : '5+4xd6+3xd8', output : '4xd6', note : `matches first found` },
            ];
            searchTests.forEach(test=>{
                it(test.note, function(){
                    assert(test.output == advantage.search(test.input));
                })
            });
        });
        describe('Parsing', function(){
            let parseTests = [
                { input : '2xd20', output : ['2', '20'], note : `parses 2xd20 into [2, 20]` },
                { input : '8xd6', output : ['8','6'], note : `parses 8xd6 into [8, 6]` },
            ];
            parseTests.forEach(test=>{
                it(test.note, function() {     
                    assert(JSON.stringify(test.output) == JSON.stringify(advantage.parse(test.input)));
                })
            })
        });
        describe('Evaluation', function(){
            it('should convert 2xd20 to an array of two numbers 1-20', function() { 
                let solution = roller.solve('2xd20');
                assert(/\[\d{1,2}\,\d{1,2}]/.test(solution));
            });
            it('should sort the result array in descending order', function() { 
                let solution = JSON.parse(roller.solve('20xd20'));
                let copy = solution.slice();
                copy.sort((x, y) => x < y);
                assert(JSON.stringify(solution) == JSON.stringify(copy));
            });
            
        });
    });
});
