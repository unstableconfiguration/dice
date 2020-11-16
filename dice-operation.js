
let optionDefaults = {
    /* Human readable name for the operation. */
    name : 'Unnamed',

    /* A regularexpression that finds a meaningful target string for this operation.
        Example: /\d*d\d+/ - finds strings like 'd6' or '1d6' for the dice roller
    */
    search : /RegExp/g,
    /* Alternatively, search can be a function that returns the expression */
    search : function(equation) { throw('No search function provided for operation ' + name) },
    
    /* Accepts the results of the search and splits them up into an operand array.
        Example: would accept '1+2' and return an [1, 2] for an addition operation.    
        Default: Returns all numbers of one or more digits including negatives and decimals
    */
    parse : function(searchResult) { 
        // -?  optional minus sign for negative numbers 
        // (\d*\.)? optional 0 or more numbers followed by a . for decimals
        // \d+  required at least one number of one or more digits
        let number = /-?(\d*\.)?\d+/g
        let get = null, operands = [];
        while(get = number.exec(searchResult)){
            operands.push(get[0]);
        }
        return operands;
    },

    /* Accepts the operands from parse and returns a single string value
        Example: if the operands are [1, 2] and it is an addition operation, this would return "3"
    */
    evaluate : function(operands) { }
}


export let DiceOperation = function(options = {}) {
    let op = this;
    op.name = options.name || optionDefaults.name;

    let search = options.search;
    if(search instanceof RegExp) {
        search = function(input) {
            return (new RegExp(options.search).exec(input)||[null])[0];
        }
    }

    op.onSearched = function(equation, searchResults) {}
    op.search = function(equation) { 
        let searchResults = search(equation);

        op.onSearched(equation, searchResults);
        return searchResults;
    } 
    
    let parse = options.parse || optionDefaults.parse;
    op.onParsed = function(searchResult, operands) {}
    op.parse = function(searchResult) { 
        let operands = parse(searchResult);

        op.onParsed(searchResult, operands);
        return operands;
    } 
    
    op.onEvaluate = function(equation) {}
    op.onEvaluated = function(equation, expression) { }
    op.evaluate = function(equation) { 
        op.onEvaluate(equation)
        let get;
        let expression = equation;
        while((get = op.search(expression)) !== null) { 
            let operands = op.parse(get);
            let result = options.evaluate.apply(op, operands);
            expression = expression.replace(get, result);
        }
        op.onEvaluated(equation, expression);
        return expression
    }
}
