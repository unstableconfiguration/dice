'use strict';

let DiceRoller = function(config){
    let roller = this;
    //roller.config = config || {};

    roller.solve = function(input){
        roller.operations.order.forEach((opname)=>{
            let op = roller.operations[opname];
            input = op.call(input);
        });
        return input;
    }

    let Operations = function(parent){
        let ops = this;
        ops.order = [];
        ops.insert = function(index, operation){
            operation.parent = parent
            ops.order.splice(index, 0, operation.name);
            ops[operation.name] = operation;
        }
        ops.add = function(operations){
            if(!Array.isArray(operations)) operations = [operations];
            operations.forEach(operation=>ops.insert(ops.order.length, operation));
        }
    }
    roller.operations = new Operations(roller);

    roller.rand = (r)=>Math.floor((Math.random()*r)+1);
    
    
    let dice_search = /\d*[d]\d+/;
    let dice_eval = function(rolls, facets) {
        let value = 0;
        for(let i = 0; i < (rolls||1); i++)
            value += roller.rand(facets);
        return value;
    }
    let dice_roll = new DiceRoller.prototype.Operation('Dice', {
        search : dice_search,
        call : dice_eval
    });
    roller.operations.add(dice_roll);

}


DiceRoller.prototype.Operation = function(name, options = {}) {
    let op = this;
    op.name = name;

    op._search = options.search || '';
    op.search = function(input){
        if(typeof(op._search)==='function') return op._search(input);
        if(~['string', 'number'].indexOf(typeof(op._search)))
            op._search = new RegExp(''+op._search);
        if(op._search.exec) return(new RegExp(op._search).exec(input)||[null])[0];
    }

    op._parse = options.parse || function(match){ 
        return [
            (/^-?(\d*\.)?\d+/.exec(match)||[''])[0], // first number/operand 
            (/-?(\d*\.)?\d+$/.exec(match)||[''])[0], // second number/operand
            (/[^\d-\.]+/.exec(match)||['+'])[0] // non-numeric character set
        ];
    }
    op.parse = function(match) {
        return op._parse(match);
    } 

    op._call = options.call || '';
    op.call = function(input) {
        let get = null;
        while((get = op.search(input)) !== null){
            let params = op.parse(get);
            let result = op._call.apply(op, params);
            input = input.replace(get, result);
        }
        return input;
    }
}



