import { DiceRoller } from '../dice.js';
let assert = chai.assert;

export let BaseTests = function() { 
    
    describe('Base Functionality', function() { 
        describe('Hooks', function() { 
            it('should call .onSolved when .solve() is called');
            it('should call .onSearched when an operation searches the input');
            it('should call .onParsed when an operation parses the input');
            it('should call .onEvaluated when an operation evaluates the input');
            
        });
    });
}