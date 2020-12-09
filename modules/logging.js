import { DiceRoller } from '../dice.js'

/*  Log structure :
    roller.log : [
        {
            equation : '',
            solution : '',
            operations : [
                { 
                    name : '',
                    expression : '',
                    search : [ { equation : '', expression : '' } ],
                    parse : [ { expression : '', operands : [] } ],
                    resolve : [ { operands : [], result : '' } ],
                    evaluate : { input : '', equation : ''  }
                }
            ]
        }
    ];
*/
let getCurrentOp = function(roller) { 
    return roller.log.slice(-1)[0].operations.slice(-1)[0];
}

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

        this.onDiceResolve(roller);
        this.onDiceRoll(roller);
        this.onDiceResolved(roller);
    }
    /* On solve, push log object to .log array and capture input equation */
    this.onSolve = function(roller) { 
        let onSolve = roller.onSolve;
        roller.onSolve = function(equation) { 
            roller.log.push({ 
                equation : equation, 
                solution : '', 
                operations : [],
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
                getCurrentOp(roller)
                    .evaluate = { input : input, equation : equation };
                
                return onEvaluated(input, equation);
            }
        });
    }
    this.onSearched = function(roller) { 
        roller.operations.forEach(op => {
            let onSearched = op.onSearched;
            op.onSearched = function(equation, expression) { 
                getCurrentOp(roller).search
                    .push({ equation : equation, expression : expression });
        
                return onSearched(equation, expression);
            }  
        });
    }
    this.onParsed = function(roller) { 
        roller.operations.forEach(op => {
            let onParsed = op.onParsed;
            op.onParsed = function(expression, operands) {
                getCurrentOp(roller).parse
                    .push({ expression : expression, operands : operands });

                return onParsed(expression, operands);
            }
        });
    }
    this.onResolved = function(roller) {
        roller.operations.forEach(op => {
            let onResolved = op.onResolved;
            op.onResolved = function(operands, result) {
                getCurrentOp(roller).resolve
                    .push({ operands : operands, result : result });

                return onResolved(operands, result);
            }
        });
    }

    /* onResolve : add a rolls array to contain our dice roll results */
    this.onDiceResolve = function(roller) { 
        let diceOp = roller.operations.find(op => op.name === 'dice');
        
        let onResolve = diceOp.onResolve;
        diceOp.onResolve = function(operands) {
            getCurrentOp(roller).rolls = [];

            return onResolve(operands);
        } 
    }
    this.onDiceRoll = function(roller) { 
        let diceOp = roller.operations.find(op => op.name === 'dice');
        let roll = diceOp.roll;
        diceOp.roll = function(facets) {
            let rollResult = roll(facets);

            getCurrentOp(roller).rolls.push(rollResult);
            return rollResult;
        }
    }
    this.onDiceResolved = function(roller) { 
        let diceOp = roller.operations.find(op => op.name === 'dice');
        
        let onResolved = diceOp.onResolved;
        diceOp.onResolved = function(operands, result) {
            let resolved = onResolved(operands, result);
            
            let diceLog = getCurrentOp(roller);
            diceLog.resolve.slice(-1)[0].rolls = diceLog.rolls;
            delete diceLog.rolls;

            return resolved;
        }
    }
}
