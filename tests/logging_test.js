
describe('Logging tests', function(){
    let assert = chai.assert;
    let roller = new LoggingRoller();

    describe('Logger unit tests', function(){
        let roller;
        beforeEach(function(){
            roller = new LoggingRoller();
        });
        it('attaches a logger to roller.rand and logs individual rolls', function(){
            roller.rand(6);
            assert.isTrue(roller.log._rolls.length === 1);
        });
        it('attaches a logger to the dice operation callback and logs compound rolls', function(){
            roller._wrap_operations();
            roller.operations.Dice._call(3, 6);
            assert.isTrue(roller.log._dice.length === 1);
            assert.isTrue(roller.log._dice[0].rolls.length === 3);
        });
        it('attaches a logger to the dice operation .call function and logs all rolls', function(){
            roller._wrap_operations();
            roller.operations.Dice.call('4d6');
            assert.isTrue(roller.log._operations.length === 1);
            assert.isTrue(roller.log._operations[0].dice.length === 1);
        })
        it('attaches a logger to the solve operation and logs results', function(){
            roller.solve('2d4');
            assert.isTrue(roller.log.solutions.length === 1);
        });
        it('clears state of individual rolls when compound roll is completed', function(){
            roller._wrap_operations();
            roller.operations.Dice._call(6, 6);
            assert.isTrue(roller.log._rolls.length === 0);
        });
        it('clears the state of grouped rolls when the Dice operation is finished', function(){
            roller._wrap_operations();
            roller.operations.Dice.call('8d2');
            assert.isTrue(roller.log._dice.length === 0);
        });
        it('clears the state of operations when a solution is finished', function(){
            roller.solve('1d2');
            assert.isTrue(roller.log._operations.length === 0);
        })
    });
    describe('Logger metrics and output functions', function(){
        window.roller = roller;
        /*it('should get the nth solution steps on request', function(){
            roller.solve('1d1');
            roller.solve('1d2');
            roller.solve('1d3');
            assert.isTrue(roller.log.get_solution_stack(1)[0]==='1d2')
        });
        it('should get the last solution steps on request', function(){
            roller.solve('1d1');
            roller.solve('1d2');
            roller.solve('1d3');
            assert.isTrue(roller.log.get_last_solution()[0]==='1d3');
        })*/

    });


});