import { Dice } from '../app/dice.js';
import { strict as assert } from 'assert';

describe('Base Functionality', function() { 
    describe('Hooks', function() { 
        it('should call .onSolved when .solve() is called', function(done) { 
            let roller = new Dice();
            roller.onSolved = function(input, output) {
                assert(input === '3d4');
                done();
            }
            roller.solve('3d4');
        });
        it('should call .onSearched when an operation searches the input', function(done) { 
            let roller = new Dice();
            roller.operations[0].onSearched = function(input, found) {
                assert(input == '2d8' && found == '2d8');
                done();
            }
            roller.solve('2d8');
        });
        it('should call .onParsed when an operation parses the input', function(done) { 
            let roller = new Dice();
            roller.operations[0].onParsed = function(expression, operands) { 
                assert(expression == '5d12' && operands[0] == 5);
                done();
            }
            roller.solve('5d12');
        });
        it('should call .onEvaluated when an operation evaluates the input', function(done) {
            let roller = new Dice();
            roller.operations[0].onEvaluated = function(input, solution) { 
                assert(input == '1d20', !isNaN(solution));
                done();
            }
            roller.solve('1d20');
        });        
    });
});
