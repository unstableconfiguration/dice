import { BaseModule } from '../modules/base-module.js';
let assert = chai.assert;


export let DiceTests = () => {
    describe('Dice Roller Tests', function() {
        describe('Search Tests', function() {
            let diceOperation = BaseModule.operations[0];
            let searchTests = [
                { input : '1d4', output : '1d4', note : 'should match 1d4' },
                { input : 'd4', output : 'd4', note : 'should match d4' },
                { input : 'abc2d6cba', output : '2d6', note : 'should match 2d6 when surrounded by other characters' },
                { input : 'abcd8cba', output : 'd8', note : 'should match d8 when surrounded by other characters' },
                { input : 'xyz12345d54321', output : '12345d54321', note : `should match multi digit numbers`},
                { input : '1d', output : null, note : `should not match 1d, no facets operand`},
                { input : '1a2b3c4', output : null, note : 'should not match 1a2b3c4, no dice operator' },
                { input : '2d6+4d8', output : '2d6', note : `should match 2d6 from 2d6+4d8, only returns first match` }
            ]
            searchTests.forEach(test => {
                it(test.note,  function() {
                    assert.isTrue(test.output == diceOperation.search(test.input));
                });
            });
        });

        describe('Parse Tests', function() { 
            let diceOperation = BaseModule.operations[0];
            let parseTests = [
                { input : '3d6', output : ['3', '6'], note : 'should split 3d6 into [3, 6]'},
                { input : 'd6', output : ['', '6'], note : `should split d6 into ['', 6]`},
                { input : '200d10', output : ['200', '10'], note : 'should split 200d10 into [200, 10]'},
            ];
            parseTests.forEach(test => {
                it(test.note, function() {
                    assert.isTrue(JSON.stringify(test.output) == JSON.stringify(diceOperation.parse(test.input)));
                });
            });
        });

        describe('Evaluation Tests', function() { 
            let diceOperation = BaseModule.operations[0];
            it('should replace "d4" with a number 1-4', function() { 
                let output = diceOperation.evaluate('d4');
                assert(+output <= 4 && +output >= 1 )
            }); 
            it('should replace 3d6 with a number 3-18', function() { 
                let output = diceOperation.evaluate('3d6');
                assert(+output <= 18 && +output >= 3);
            });
            it('should replace only the 4d8 in 4d8+5 with no math module loaded', function() {
                let output = diceOperation.evaluate('4d8+5');
                assert(/^\d+\+5$/.test(output));
            });
            it('should replace both die rolls in abc*2d4/def+d6-4', function() { 
                let output = diceOperation.evaluate('abc*2d4/def+d6-4');
                assert(/^(abc\*)\d(\/def\+)\d-4$/.test(output))
            });

        });

        describe('Randomizer', function() { 
            let diceOperation = BaseModule.operations[0];
            let min = 12, max = 0;
            for(let i = 0; i < 1000; i++) {
                let output = diceOperation.evaluate('2d6');
                if(output < min) { min = output; }
                if(output > max) { max = output; }
            }
            it('Should always (1000 rolls) roll between 2 and 12 for 2d6', function() {
                assert(min >= 2 && max <= 12)
            });
        });

    });
}