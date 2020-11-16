
let optionDefaults = {
    /* Human readable name for the operation. */
    name : 'Unnamed',
    /* Searches input equation for a substring that this operation can work on. 
        If found, it returns that substring
        Example: if the input string is "abc1+2def" and this is an addition operation
        Then it will return "1+2"
        */
    search : function(equation) { throw('No search function provided for operation ' + name) },
    /* Alternative to a search function.
        A regular expression that will find the substring
        A primitive addition one might look like /\d+\d/
    */
    searchExpression : /RegExp/g,
    /* A function that accepts the result of the search, 
        and extracts operands returned as an array. 
        Example: would accept "1+2" and return [1, 2]
        Default behavior: Returns all numbers of one or more digits
    */
    getOperands : function(searchResult) { 
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
    /* Accepts the operands from getOperands and returns a single string value
        Example: if the operands are [1, 2] and it is an addition operation, this would return "3"
    */
    evaluate : function(operands) { }
}


export let DiceOperation = function(options = {}) {
    let op = this;
    op.name = options.name || optionDefaults.name;

    let getSearchFunction = function(search) { 
        if(typeof(search) === 'function') {
            return search;
        }
        if(search instanceof RegExp) {
            return function(input) {
                return (new RegExp(search).exec(input)||[null])[0];
            }
        }

    }

    op.search = getSearchFunction(options.search);

    op.getOperands = options.getOperands || optionDefaults.getOperands
    
    op.evaluate = function(expression) { 
        let get;
        while((get = op.search(expression)) !== null) { 
            let operands = op.getOperands(get);
            let result = options.evaluate.apply(op, operands);
            // if we do 1d4+1d4, would this make them always roll the same?
            expression = expression.replace(get, result);
        }
        return expression
    }
}
