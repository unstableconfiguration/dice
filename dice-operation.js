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
    parse : function(expression) { 
        // -?  optional minus sign for negative numbers 
        // (\d*\.)? optional 0 or more numbers followed by a . for decimals
        // \d+  required at least one number of one or more digits
        let number = /-?(\d*\.)?\d+/g
        let get = null, operands = [];
        while(get = number.exec(expression)){
            operands.push(get[0]);
        }
        return operands;
    },

    /* Accepts the operands from parse and returns a single string value
        Example: if the operands are [1, 2] and it is an addition operation, this would return "3"
    */
    resolve : function(operands) { }
}


export let DiceOperation = function(options = {}) {
    let op = this;
    for(let k in options) { op[k] = options[k]; }
    op.name = options.name || optionDefaults.name;

    let search = options.search;
    if(search instanceof RegExp) {
        search = function(input) {
            return (new RegExp(options.search).exec(input)||[null])[0];
        }
    }

    op.onSearch = function(equation) { }
    op.onSearched = function(equation, expression) { }
    op.search = function(equation) { 
        op.onSearch(equation);
        let expression = search(equation);

        op.onSearched(equation, expression);
        return expression;
    } 
    
    let parse = options.parse || optionDefaults.parse;
    op.onParse = function(expression) { }
    op.onParsed = function(expression, operands) { }
    op.parse = function(expression) { 
        op.onParse(expression);
        let operands = parse(expression);

        op.onParsed(expression, operands);
        return operands;
    } 

    let resolve = options.resolve;
    op.onResolve = function(operands) { }
    op.onResolved = function(operands, result) { }
    op.resolve = function(operands) { 
        op.onResolve(operands);
        let result = resolve.apply(op, operands);
        
        op.onResolved(operands, result);
        return result;
    }
    
    op.onEvaluate = function(equation) { }
    op.onEvaluated = function(equation, expression) { }
    op.evaluate = function(equation) { 
        op.onEvaluate(equation);
        let input = equation;
        let expression;

        while((expression = op.search(equation)) !== null) { 
            let operands = op.parse(expression);
            let result = op.resolve(operands);
            equation = equation.replace(expression, result);
        }
        op.onEvaluated(input, equation);
        return equation
    }
}
