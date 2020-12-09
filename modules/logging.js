import { DiceRoller } from '../dice.js'

export let LoggingModule = function() {
    this.apply = function(roller) { 
        roller.log = [];
        
        this.applyOnSolve(roller);
        this.applyOnSolved(roller);
        
        this.applyEvaluate(roller);

        // on roll 
            // collect expression 
            // collect rolls array
    }
    this.applyOnSolve = function(roller) { 
        let onSolve = roller.onSolve;
        roller.onSolve = function(equation) { 
            roller.log.push({ input : equation, solution : '', rolls : [] });
            return onSolve(equation);
        }
    },
    this.applyOnSolved = function(roller) { 
        let onSolved = roller.onSolved;
        roller.onSolved = function(equation, solution) { 
            roller.log.slice(-1)[0].solution = solution;
            return onSolved(equation, solution);
        }
    }, 
    this.applyEvaluate = function(roller) { 
        let diceOp = roller.operations.find(op => op.name == 'dice');
        let evaluate = diceOp.evaluate;
        diceOp.evaluate = function(expression) {
            roller.log.slice(-1)[0].rolls.push({ expression : expression });
            return evaluate(expression);
        }
    }
}


export let LoggingRoller = function(options){
    DiceRoller.call(this, options);
    let roller = this;

    roller.solutions = [];
    let operationResults = [];

    let rolls = [];
    let setOperationLog = function() {
        roller.operations.forEach(operation => { 
            operation.onEvaluated = function(equation, expression) {
                operationResults.push({
                    name : this.name,
                    equation : equation,
                    expression : expression,
                });
            }

            if(operation.name === 'dice') {
                let roll = operation.roll;
                operation.roll = function(facets) { 
                    let result = roll(facets);
                    rolls.push(result);
                    return result;
                }
                operation.onEvaluated = function(equation, expression) {
                    operationResults.push({
                        name : 'dice',
                        equation : equation,
                        expression : expression,
                        rolls : rolls
                    });
                    rolls = [];
                }
            }


        });
    }

    setOperationLog();
    let applyModules = roller.applyModules;
    roller.applyModules = function(modules) {
        applyModules(modules);
        setOperationLog();
    }
    
}
