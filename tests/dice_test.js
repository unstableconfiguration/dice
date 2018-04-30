


describe('Dice Roller Tests', function(){
    let assert = chai.assert;
    let dice;
    beforeEach(function(){ dice = new DiceRoller().operations['Dice']; })

    describe('Basic functions', function() {
        describe('Searching', function() {
            let dice_searching_tests = [
                { input : '1d4', output : '1d4', note : 'should match 1d4' },
                { input : 'd4', output : 'd4', note : 'should match d4' },
                { input : 'abc2d6cba', output : '2d6', note : 'should match 2d6 when surrounded by other characters' },
                { input : 'abcd8cba', output : 'd8', note : 'should match d8 when surrounded by other characters' },
                { input : 'xyz12345d54321', output : '12345d54321', note : `should match multi digit numbers`},
                { input : '1d', output : null, note : `should not match 1d, no facets operand`},
                { input : '1a2b3c4', output : null, note : 'should not match 1a2b3c4, no dice operator' },
                { input : '2d6+4d8', output : '2d6', note : `should match 2d6 from 2d6+4d8, only returns first match` }
            ]
            dice_searching_tests.forEach((test)=>{
                it(test.note, function(){ 
                    assert.isTrue(test.output == dice._search(test.input));
                })
            })
        })
        // uses the default parser, might want fuller tests for just that 
        describe('Parsing', function() {
            let dice_parsing_tests = [
                { input : '3d6', output : ['3', '6' ,'d'], note : 'should split 3d6 into [3, 6, d]'},
                { input : 'd6', output : ['', '6', 'd'], note : `should split d6 into ['', 6, d]`},
                { input : '200d10', output : ['200', '10', 'd'], note : 'should split 200d10 into [200, 10, d]'},
            ];
            dice_parsing_tests.forEach((test =>{
                it(test.note, ()=>{
                    assert.isTrue(JSON.stringify(test.output) === JSON.stringify(dice._parse(test.input)));
                })
            }))
        })

        describe('Solving', function() {
            let dice_roller_tests = [
                { input : 'd4', output : '4', note : `replaced d4 with the result of rand(4)` },
                { input : '3d6', output : '18', note : 'replaced 3d6 with rand(6) + rand(6) + rand(6)' },
                { input : 'd5+4d6', output : '5+24', note : 'replaced d5+4d6 with rand(5) + rand(6)+rand(6)+rand(6)+rand(6)'}
            ];
            dice_roller_tests.forEach((test => {
                it(test.note, ()=>{
                    dice.rand = (r)=>+r;
                    assert.isTrue(test.output == dice.call(test.input));
                })
            }))
        })
    })
});