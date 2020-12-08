import { LoggingModule } from '../modules/logging.js'
import { DiceRoller } from '../dice.js'


export let LoggingTests = () => {
    let assert = chai.assert;

    describe('Logging Tests', function() { 
        describe('initialization', function() { 
            it('should add a .log array to the dice roller on initialization', function() { 
                let roller = new DiceRoller({ modules : [LoggingModule]});
                assert(Array.isArray(roller.log));
            });
        });

        describe('logging', function() { 
            it('should record results in a .log array', function() { 
                let roller = new DiceRoller({ modules : [LoggingModule]});
                roller.solve('3d6');
                roller.solve('1d4');
                assert(roller.log.length === 2);
            });
            it('should record the input in each log', function() { 
                let roller = new DiceRoller({ modules : [LoggingModule]});
                roller.solve('1d4');
                assert(roller.log.slice(-1)[0].input === '1d4');
            });
            it('should record the output in each log', function() { 
                let roller = new DiceRoller({ modules : [LoggingModule]});
                roller.solve('4d1');
                assert(roller.log.slice(-1)[0].solution === '4');
            });
            it('should record rolls in a .log[n].rolls array', function() { 
                let roller = new DiceRoller({ modules : [LoggingModule]});
                roller.solve('3d8+2d4');
                assert(roller.log.slice(-1)[0].rolls.length === 2);
            });
            it('should record the roll expression and output array', function() { 
                let roller = new DiceRoller({ modules : [LoggingModule]});
                roller.solve('2d10');
                assert(roller.log.slice(-1)[0].rolls[0].expression === '2d10');
                assert(roller.log.slice(-1)[0].rolls[0].results.length === 2);
            });
        });

    });
}