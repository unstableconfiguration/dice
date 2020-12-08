import { DiceOperation } from '../dice-operation.js'
          
export let BaseModule = {
    apply : function(roller) { 
        let diceOp = {...this.operations[0]};
        roller.operations.unshift(diceOp);
    },
    operations : [
        new DiceOperation({
            name : 'dice',
            search : /\d*d\d+/,
            parse : function(searchInput) {
                return searchInput.split(/\D+/);
            },
            roll : function(facets) {
                return Math.floor((Math.random() * facets) + 1);
            },
            evaluate : function(rolls, facets) {
                let value = 0;
                for(let i = 0; i < (rolls||1); i++) {
                    value += this.roll(facets);
                }
                return value;
            }
        })
    ]
}