
'use strict';
let DiceRoller = function(config){
    let roller = this;
    roller.config = config || {};

    roller.solve = function(input){
        let roller = this;
        roller.operations.order.forEach((opname)=>{
            let op = roller.operations[opname];
            input = op.call(input);
        });
        return input;
    }

    roller.operations = { order : [] };
    roller.operations.add = function(operations) {
        if(!Array.isArray(operations)) operations = [operations];
        operations.forEach((operation)=>{
            roller.operations.insert(roller.operations.order.length-1, operation);
        })
    }
    roller.operations.insert = function(index, operation){
        operation.parent = roller;
        roller.operations.order.splice(index, 0, operation.name);
        roller.operations[operation.name] = operation;
    }

    let dice_search = /\d*[d]\d+/;
    let dice_eval = function(rolls, facets) {
        rolls = rolls || 1;
        let value = 0;
        for(let i = 0; i < rolls; i++)
            value += this.rand(facets);
        return value;
    }
    let dice_roll = new roller.Operation('Dice', dice_search, dice_eval);
    dice_roll.rand = (r)=>Math.floor((Math.random()*r)+1);
    roller.operations.add(dice_roll);
}


/* Named operation that searches for matches, parses them into parameters, and executes a function
    search : regex or matching function that returns a matched substring from input
    parse : parses the results of search into a parameter array for consumption by fn 
    fn : function to update the original input from the parsed parameters
*/
DiceRoller.prototype.Operation = function(name, search, fn, parse) {
    let op = this;
    op.name = name;
     // returns substring of input that matches search
    op._search = function(input) {
        if(typeof(search)==='function') return search(input);
        if(['string', 'number'].includes(typeof(search)))
            search = new RegExp(''+search);
        if(search.exec) return (new RegExp(search).exec(input)||[null])[0];
        throw`could not parse search into function or regular expression for operation`+`name`
    }
    // parses return value of search into operators and operands for 
    // consumption by .call()
    op._parse = function(match){
        parse = parse || op.default_parse;
        return parse(match);
    }
    // while search returns matches, the matches are parsed 
    // and replaced with the results of fn  
    op.call = function(input){
        let get = null;
        while((get = op._search(input)) !== null){
            let params = op._parse(get);
            let result = fn.apply(op, params);
            input = input.replace(get, result); 
        }
        return input;
    }
}

// Default parse behavior expects two numbers separated by one or more non-number characters
// It returns them in reverse-polish notation style, i.e. '1+2' returns ['1', '2', '+']
DiceRoller.prototype.Operation.prototype.default_parse = function(match) {
    let ops = [];
    ops.push((/^-?(\d*\.)?\d+/.exec(match)||[''])[0]);
    match = match.substr(ops[0].length);
    ops.push((/-?(\d*\.)?\d+$/.exec(match)||[''])[0]);
    match = match.substr(0, match.length-(ops[1].length));
    ops.push(match||'+'); // in the case of '1-2' we would have ['1', '-2', ''], 
    return ops;
}




