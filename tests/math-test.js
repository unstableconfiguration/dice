import { MathModule } from '../modules/math-module.js'
import { DiceRoller } from '../dice.js';
let assert = chai.assert

export let MathTests = () => { 
    describe('Math Module Unit Tests', function() {

        describe('Addition', function() { 
            let addOperation = new MathModule().operations.find(mod => mod.name == 'Add');
            describe('Search Tests', function() { 
                let addSearchTests = [
                    { input : '1+2', output : '1+2', note : `should match 1+2` },
                    { input : '1+', output : null, note : `should not match '1+'` },
                    { input : '+2', output : null, note : `should not match +2` },
                    { input : '1-2', output : null, note : 'should not match 1-2' }
                ]
                addSearchTests.forEach(test => { 
                    it(test.note, function() {
                        assert(addOperation.search(test.input) == test.output);
                    });
                });
            });

            describe('Parse Tests', function() {
                let addParseTests = [
                    { input : '1+2', output : ['1', '2'], note : 'should parse 1+2 to [1, 2]' },
                    { input : '-3+4', output : ['-3', '4'], note : 'should parse -3+4 to [-3, 4]'},
                    { input : '55+66', output : ['55', '66'], note : 'should parse 55+66 to [55, 66]'}
                ];
                addParseTests.forEach(test => {
                    it(test.note, function() {
                        assert(JSON.stringify(addOperation.parse(test.input)) == JSON.stringify(test.output));
                    });
                });
            });

            describe('Evaluation Tests', function() { 
                it('should evaluate 1+2 to 3', function() { 
                    assert(addOperation.evaluate('1+2') === '3');
                });
                it('should evaluate -1+3-2 to 2-2 (addition operation only)', function() { 
                    assert(addOperation.evaluate('-1+3-2') == '2-2');
                });
            });
        });

        
        describe('Subtraction', function() { 
            let subtractOperation = new MathModule().operations.find(mod => mod.name == 'Subtract');
            describe('Search Tests', function() { 
                let addSearchTests = [
                    { input : '1-2', output : '1-2', note : `should match 1-2` },
                    { input : '1-', output : null, note : `should not match '1-'` },
                    { input : '-2', output : null, note : `should not match -2` },
                    { input : '1+2', output : null, note : 'should not match 1+2' }
                ]
                addSearchTests.forEach(test => { 
                    it(test.note, function() {
                        assert(subtractOperation.search(test.input) == test.output);
                    });
                });
            });

            describe('Parse Tests', function() {
                let addParseTests = [
                    { input : '1-2', output : ['1', '2'], note : 'should parse 1-2 to [1, 2]' },
                    { input : '-3-4', output : ['-3', '4'], note : 'should parse -3-4 to [-3, 4]'},
                    { input : '55--66', output : ['55', '-66'], note : 'should parse 55-66 to [55, 66]'}
                ];
                addParseTests.forEach(test => {
                    it(test.note, function() {
                        assert(JSON.stringify(subtractOperation.parse(test.input)) == JSON.stringify(test.output));
                    });
                });
            });

            describe('Evaluation Tests', function() { 
                it('should evaluate 1-2 to -1', function() { 
                    assert(subtractOperation.evaluate('1-2') === '-1');
                });
                it('should evaluate -1+3-2 to -1+1 (addition operation only)', function() { 
                    assert(subtractOperation.evaluate('-1+3-2') == '-1+1');
                });
            });
        });

        describe('Multiplication and Division Tests', function() { 
            let multDivOperation = new MathModule().operations.find(op => op.name == 'MultiplyAndDivide');
            describe('Search Tests', function() { 
                let searchTests = [
                    { input : '1*2', output : '1*2', note : 'matches 1*2' },
                    { input : '1*x', output : null, note : 'does not match 1*x' },
                    { input : 'y*2', output : null, note : 'does not match y*2' },
                    { input : 'abc33*44xyz', output : '33*44', note : 'matches 33*44 in abc33*44xyz' },

                    { input : '1/2', output : '1/2', note : 'matches 1/2' },
                    { input : '1/x', output : null, note : 'does not match 1/x' },
                    { input : 'y/2', output : null, note : 'does not match y/2' },
                    { input : 'abc33/44xyz', output : '33/44', note : 'matches 33/44 in abc33/44xyz' }
                ];
                searchTests.forEach(test => {
                    it(test.note, function() { 
                        assert(multDivOperation.search(test.input) == test.output);     
                    });
                });
            });

            describe('Parse Tests', function() { 
                let parseTests = [
                    { input : '1*2', output : ['1', '2', '*'], note : 'extracts [1, 2] from 1*2' },
                    { input : '-10*-100', output : ['-10', '-100', '*'], note : 'extracts [-10, -100] from -10*-100' },
                
                    { input : '1/2', output : ['1', '2', '/'], note : 'extracts [1, 2] from 1/2' },
                    { input : '-10/-100', output : ['-10', '-100', '/'], note : 'extracts [-10, -100] from -10/-100' },
                ]
                parseTests.forEach(test => {
                    it(test.note, function() { 
                        assert(JSON.stringify(multDivOperation.parse(test.input)) == JSON.stringify(test.output));
                    })
                });
            });

            describe('Evaluation Tests', function() { 
                it('should evaluate 2*4 as 8', function() { 
                    assert(multDivOperation.evaluate('2*4') == '8');
                });
                it('should evaluate 4+2*8 as 4+16', function() {
                    assert(multDivOperation.evaluate('4+2*8') == '4+16')
                });
                
                it('should evaluate 4/2 as 2', function() { 
                    assert(multDivOperation.evaluate('4/2') == '2');
                });
                it('should evaluate 4+2/8 as 4+.25', function() {
                    assert(multDivOperation.evaluate('4+8/2') == '4+4')
                });
            
            });
        });

        describe('Exponents Tests', function() { 
            let exponentOperation = new MathModule().operations.find(op => op.name == 'Exponents');
            describe('Search Tests', function() { 
                let searchTests = [
                    { input : '2^2', output : '2^2', note : 'matches 2^2' },
                    { input : '2^x', output : null, note : 'does not match 2^x' },
                    { input : 'y^2', output : null, note : 'does not match y^2' },
                    { input : 'abc22^22xyz', output : '22^22', note : 'matches 22^22 in abc22^22xyz' }
                ];
                searchTests.forEach(test => { 
                    it(test.note, function() { 
                        assert(exponentOperation.search(test.input) == test.output);
                    });
                });
            });

            describe('Parse Tests', function() { 
                let parseTests = [
                    { input : '2^2', output : ['2', '2'], note : 'parses [2, 2] from 2^2' },
                    { input : '-10^-2', output : ['-10', '-2'], note : 'parses [-10, -2] from -10^-2' }
                ];
                parseTests.forEach(test => {
                    it(test.note, function() { 
                        assert(JSON.stringify(exponentOperation.parse(test.input)) == JSON.stringify(test.output));
                    })
                });

            });

            describe('Evaluation Tets', function() { 
                it('should evaluate 2^3 as 8', function() { 
                    assert(exponentOperation.evaluate('2^3') == '8');
                });
                it('should evaluate 2^-3 as .125', function() { 
                    assert(exponentOperation.evaluate('2^-3') == .125);
                });
            });
        });

        describe('Parentheses Tests', function() { 
            let parenthesesOperation = new MathModule().operations.find(op => op.name == 'Parentheses');
            describe('Search Tests', function() {
                let searchTests = [
                    { input : '(1+2)', output : '(1+2)', note : 'should match (1+2)'},
                    { input : '(1+2', output : null, note : 'should not match (1+2' },
                    { input : '1+2)', output : null, note : 'should not match 1+2)' },
                    { input : 'abc(xyz)123', output : '(xyz)', note : 'should match (xyz) in abc(xyz)123' }
                ];
                searchTests.forEach(test => {
                    it(test.note, function() { 
                        assert(parenthesesOperation.search(test.input) == test.output);
                    });
                });
            });

            describe('Parse Tests', function() { 
                let parseTests = [
                    { input : '(1+2)', output : ['1+2'], note : 'should extract inner equation'}
                ];
                parseTests.forEach(test => { 
                    it(test.note, function() { 
                        assert(JSON.stringify(parenthesesOperation.parse(test.input)) == JSON.stringify(test.output));
                    })
                });
            });

            // Evaluation tests only make sense in the context of the full math module
        });

        describe('Math Integration Tests', function() { 
            let roller = new DiceRoller({ modules : [MathModule] });
            it('should evaluate 3*(6+3^2) as 45', function() {
                assert(roller.solve('3*(6+3^2)') == '45')
            }); 
        });
    });
}
