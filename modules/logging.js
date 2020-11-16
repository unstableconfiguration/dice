import { DiceRoller } from '../dice.js'
// to log things. 

export let LoggingRoller = function(){
    DiceRoller.call(this);
    let roller = this;

    roller.solutions = [];
    roller.onSolved = function(equation, solution) {
        roller.solutions.push({
            equation : equation,
            solution : solution,
            operations : roller.operationOutcomes //.splice(0)
        });
    }
 
    roller.operationOutcomes = [];

    let setOperationLog = function() {
        roller.operations.forEach(operation => { 
            operation.onEvaluated = function(equation, expression) {
                roller.operationOutcomes.push({
                    name : this.name,
                    equation : this.equation,
                    expression : this.expression,
                });
            }
        });
    }

    // missing: logging individual rolls.

    setOperationLog();
    let applyModules = roller.applyModules;
    roller.applyModules = function(modules) {
        applyModules(modules);
        setOperationLog();
    }

}





