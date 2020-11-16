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

    roller.solve = function(input) {
        roller.operations.forEach((op)=>{
            input = op.evaluate(input);
        });
        return input;
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


