import { DiceOperation } from '../dice-operation.js'

let rand = (r)=>Math.floor((Math.random()*r)+1);

export let BaseModule = {
    apply : function(roller) { 
        roller.operations.unshift(this.operations[0]);
    },
    operations : [
        new DiceOperation({
            name : 'dice',
            search : /\d*d\d+/,
            getOperands : function(searchInput) {
                return searchInput.split(/\D+/);
            },
            evaluate : function(rolls, facets) {
                let value = 0;
                for(let i = 0; i < (rolls||1); i++) {
                    value += rand(facets);
                }
                return value;
            }
        })
    ]
}






