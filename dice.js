import { BaseModule } from './modules/base-module.js'

/* 
    options = {
        modules : [modules]
    }
*/
export let DiceRoller = function(options) {
    let roller = this;
    roller.operations = [];

    roller.onSolve = function(equation, solution) { }
    roller.onSolved = function(equation, solution) { }
    roller.solve = function(equation) {
        let solution = equation;
        roller.onSolve(equation);

        roller.operations.forEach((op)=>{
            solution = op.evaluate(solution);
        });

        roller.onSolved(equation, solution);
        return solution;
    }

    roller.applyModules = function(modules) {
        if(!Array.isArray(modules)) { modules = [modules]; }
        modules.forEach(module => {
            new module().apply(roller);
        });
    }

    // Seed with dice roll operation
    roller.applyModules(BaseModule);
    if(options && options.modules) {
        roller.applyModules(options.modules);
    }
}