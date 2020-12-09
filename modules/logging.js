import { DiceRoller } from '../dice.js'

/*  Log structure :
    roller.log : [
        {
            equation : '',
            solution : '',
            operations : [
                { 
                    name : '',
                    search : [ { equation : '', expression : '' } ],
                    parse : [ { expression : '', operands : [] } ],
                    resolve : [ { operands : [], result : '' } ],
                    evaluate : { input : '', equation : ''  }
                }
            ]
        }
    ];

*/

export let LoggingModule = function() {
    this.apply = function(roller) { 
        roller.log = [];
        
        this.onSolve(roller);
        this.onSolved(roller);
        
        this.onEvaluate(roller);
        this.onEvaluated(roller);

        this.onSearched(roller);
        this.onParsed(roller);
        this.onResolved(roller);

        //this.onRoll(roller);

    }
    /* On solve, push log object to .log array and capture input equation */
    this.onSolve = function(roller) { 
        let onSolve = roller.onSolve;
        roller.onSolve = function(equation) { 
            roller.log.push({ 
                equation : equation, 
                solution : '', 
                operations : [],
                rolls : [] 
            });
            return onSolve(equation);
        }
    }
    /* On solved, log solution in log object */
    this.onSolved = function(roller) { 
        let onSolved = roller.onSolved;
        roller.onSolved = function(equation, solution) { 
            roller.log.slice(-1)[0].solution = solution;
            return onSolved(equation, solution);
        }
    }
    /* on evaluate, add operation to operations array */
    this.onEvaluate = function(roller) {
        roller.operations.forEach(op => {
            let onEvaluate = op.onEvaluate;
            op.onEvaluate = function(equation) {
                roller.log.slice(-1)[0].operations.push({
                    name : op.name,
                    search : [],
                    parse : [], 
                    resolve : []
                });
                return onEvaluate(equation);
            }
        });
    }
    /* on evaluated, log input and modified equation */
    this.onEvaluated = function(roller) { 
        roller.operations.forEach(op => {
            let onEvaluated = op.onEvaluated;
            op.onEvaluated = function(input, equation) { 
                roller.log.slice(-1)[0].operations.slice(-1)[0]
                    .evaluate = { input : input, equation : equation };
                
                return onEvaluated(input, equation);
            }
        });
    }
    this.onSearched = function(roller) { 
        roller.operations.forEach(op => {
            let onSearched = op.onSearched;
            op.onSearched = function(equation, expression) { 
                roller.log.slice(-1)[0].operations.slice(-1)[0]
                    .search.push({ equation : equation, expression : expression });
        
                return onSearched(equation, expression);
            }  
        });
    }
    this.onParsed = function(roller) { 
        roller.operations.forEach(op => {
            let onParsed = op.onParsed;
            op.onParsed = function(expression, operands) {
                roller.log.slice(-1)[0].operations.slice(-1)[0]
                    .parse.push({ expression : expression, operands : operands });

                return onParsed(expression, operands);
            }
        });
    }
    this.onResolved = function(roller) {
        roller.operations.forEach(op => {
            let onResolved = op.onResolved;
            op.onResolved = function(operands, result) {
                roller.log.slice(-1)[0].operations.slice(-1)[0]
                    .resolve.push({ operands : operands, result : result });

                return onResolved(operands, result);
            }
        });
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
