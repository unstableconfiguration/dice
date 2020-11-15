import { DiceOperation } from './dice-operation.js';

/* 
    So what is the interfacce of the DiceRoller 

    .solve(input string)

    .operations [DiceOperation]
    or .operations DiceOperations

*/


export let DiceRoller = function(config) {
    let roller = this;
    roller.operations = [];

    //roller.config = config || {};

    roller.solve = function(input) {
        roller.operations.forEach((op)=>{
            input = op.call(input);
        });
        return input;
    }

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
    roller.operations.push(dice_roll);

}


DiceRoller.prototype.Operation = DiceOperation


