

/* 
    options = {
        modules : [modules]
    }
*/
export let DiceRoller = function(options) {
    let roller = this;
    roller.operations = [];

    roller.onSolve = function(equation) {}
    roller.onSolved = function(equation, solution) {}
    roller.solve = function(equation) {
        roller.onSolve(equation);
        let solution = equation;
        
        roller.operations.forEach((op)=>{
            solution = op.evaluate(solution);
        });

        roller.onSolved(equation, solution);
        return solution;
    }

    roller.applyModules = function(modules) {
        if(!Array.isArray(modules)) { modules = [modules]; }
        modules.forEach(module => {
            module.apply(roller);
        });
    }

    // Seed with dice roll operation
    BaseModule.apply(roller);
    if(options && options.modules) {
        roller.applyModules(options.modules);
    }
}
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
    for(let k in options) { op[k] = options[k]; }
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

          
export let BaseModule = {
    apply : function(roller) { 
        roller.operations.unshift(this.operations[0]);
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


export let DnDModule = {
	apply : function(roller) { 
		let advantage = this.operations[0];
		advantage.parent = roller;
		roller.operations.unshift(advantage);
	},
	operations : [
		/* The game frequently asks the player to roll a twenty-sided die twice and pick the higher 
			or lower of the two rolls. 
			using the syntax 2xd20 it will roll the die twice and separate the results into an array. 
		*/ 
		new DiceOperation({
				name : 'Advantage',
				search : /\d+xd\d+/,
				evaluate : function(repetitions, facets){
					let operation = this;
					// 2xd20 becomes [d20, d20]. We then let the roller solve each d20 
					let results = Array(+repetitions).fill('d' + facets)
						.map(x => +operation.parent.solve(x));
					// high-to-low sorting
					results.sort((x,y) => +x < +y);
					return JSON.stringify(results);
				},
				parse : (match) => match.split(/\D+/) 
			}
		)
	]
}


/*  Explanation of this pattern: 
    -?(\d*\.)?\d+
        -? : optional - sign for negative numbers 
        (\d*\.)? : optional set of 0 or more numbers and one . for decimals 
        \d+ : one or more digits.  

    Matches 
        1
        1.1
        .1
        -1
        -1.1
        -.1
*/

export let MathModule = {
    apply : function(roller) {
        this.operations.forEach(op => {
            // Parentheses needs a reference to the roller for recursion 
            op.parent = roller;
            roller.operations.push(op);
        });
    },
    operations : [
        new DiceOperation({
            name : 'Parentheses',
            search: /\([^()]+\)/,
            parse : (match)=>[match.replace(/[()]/g,'')],
            evaluate : function(x) { return this.parent.solve(x); } 
        })
        , new DiceOperation({
            name : 'Exponents',
            search : /-?(\d*\.)?\d+\^-?(\d*\.)?\d+/,
            evaluate : (x,y) => Math.pow(x, y)
        })
        /* Needs to happen simultaneously, so a single function */
        , new DiceOperation({
            name : 'MultiplyAndDivide',
            search : /-?(\d*\.)?\d+[*\/]-?(\d*\.)?\d+/,
            parse : function(searchResult) {
                let firstOperand = /^-?(\d*\.)?\d+/.exec(searchResult)[0];
                let secondOperand = /-?(\d*\.)?\d+$/.exec(searchResult)[0];
                let operator = /[\*\/]/.exec(searchResult)[0];
                return [firstOperand, secondOperand, operator];
            }
            , evaluate : (x, y, op) => op == '*' ? x * y : x / y
        })
        , new DiceOperation({
            name : 'Add',
            search : /-?(\d*\.)?\d+[+]-?(\d*\.)?\d+/, 
            evaluate : (x,y) => +x + +y  
        })
        , new DiceOperation({
            name : 'Subtract',
            search : /-?(\d*\.)?\d+[\-]-?(\d*\.)?\d+/, 
            parse : function(searchResult) { 
                let firstOperand = /^-?(\d*\.)?\d+/.exec(searchResult)[0];
                let secondOperand = /(--)?(\d*\.)?\d+$/.exec(searchResult)[0];
                if(secondOperand.substr(0, 2) == '--') { secondOperand = secondOperand.substr(1); }
                return [firstOperand, secondOperand];
            },
            evaluate : (x,y) => +x - +y  
        })
    ]
};
