import { DiceOperation } from './dice-operation.js';
import { base } from './modules/base.js'
/* 
    So what is the interfacce of the DiceRoller 

    .solve(input string)

    .operations [DiceOperation]

*/


export let DiceRoller = function() {
    let roller = this;
    roller.operations = [];

    roller.solve = function(input) {
        roller.operations.forEach((op)=>{
            input = op.call(input);
        });
        return input;
    }

    // Seed with dice roll operation
    roller.operations.push(base[0])
}


DiceRoller.prototype.Operation = DiceOperation


