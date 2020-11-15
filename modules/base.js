import { DiceOperation } from '../dice-operation.js'

let search = /\d*[d]\d+/;

let rand = (r)=>Math.floor((Math.random()*r)+1);

let eval = function(rolls, facets) {
    let value = 0;
    for(let i = 0; i < (rolls||1); i++)
        value += roller.rand(facets);
    return value;
}

let diceRoll = new DiceOperation('Dice', {
    search : search,
    call : eval
});

export let base = [
    diceRoll
]

