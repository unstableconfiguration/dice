import { DiceRoller } from '../dice.js'

export let LoggingRoller = function(options){
    DiceRoller.call(this, options);
    let roller = this;

    roller.solutions = [];
    let operationResults = [];

    roller.onSolve = function(equation) {
        operationResults = []
    }
    roller.onSolved = function(equation, solution) {
        roller.solutions.push({
            equation : equation,
            solution : solution,
            operations : operationResults 
        });
    }
 
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





