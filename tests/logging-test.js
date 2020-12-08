import { LoggingModule } from '../modules/logging.js'
import { DiceRoller } from '../dice.js'


export let LoggingTests = () => {
    let assert = chai.assert;

    describe('Logging Tests', function() { 
        describe('initialization', function() { 
            it('should initialize logging when added as module');
        });

        describe('logging', function() { 
            it('should record results in a .log array');
            it('should record the input in each log');
            it('should record the output in each log');
            it('should record rolls in a .log[n].rolls array')
            it('should record the roll expression and output array')
        });

    });
}