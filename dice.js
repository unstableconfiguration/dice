import { DiceOperation } from './dice-operation.js';
import { DiceOperations } from './dice-operations.js';

export let DiceRoller = function(config) {
    let roller = this;
    //roller.config = config || {};

    roller.solve = function(input) {
        roller.operations.order.forEach((opname)=>{
            let op = roller.operations[opname];
            input = op.call(input);
        });
        return input;
    }

    roller.operations = new DiceOperations(roller);

    roller.rand = (r)=>Math.floor((Math.random()*r)+1);
    
    let dice_search = /\d*[d]\d+/;
    let dice_eval = function(rolls, facets) {
        let value = 0;
        for(let i = 0; i < (rolls||1); i++)
            value += roller.rand(facets);
        return value;
    }
    let dice_roll = new DiceOperation('Dice', {
        search : dice_search,
        call : dice_eval
    });
    roller.operations.add(dice_roll);

}


DiceRoller.prototype.Operation = DiceOperation


