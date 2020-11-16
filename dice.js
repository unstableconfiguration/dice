import { DiceOperation } from './dice-operation.js';
import { BaseModule } from './modules/base-module.js'


/* 
    options = {
        modules : [modules]
    }
*/
export let DiceRoller = function(options) {
    let roller = this;
    roller.operations = [];

    op.onSolve = function(equation) {}
    op.onSolved = function(equation, solution) {}
    roller.solve = function(equation) {
        op.onSolve(equation);
        let solution = equation;
        
        roller.operations.forEach((op)=>{
            solution = op.evaluate(solution);
        });

        op.onSolved(equation, solution);
        return solution;
    }

    roller.applyModules = function(modules) {
        if(!Array.isArray(modules)) { modules = [modules]; }
        modules.forEach(module => {
            module.apply(roller);
        });
    }

    // Seed with dice roll operation
    BaseModule.apply(roller);
    if(options.modules) {
        roller.applyModules(options.modules);
    }
}

DiceRoller.prototype.Operation = DiceOperation


