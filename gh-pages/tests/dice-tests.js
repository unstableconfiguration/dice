var optionDefaults = {
  /* Human readable name for the operation. */
  name: 'Unnamed',

  /* A regularexpression that finds a meaningful target string for this operation.
      Example: /\d*d\d+/ - finds strings like 'd6' or '1d6' for the dice roller
  */
  search: /RegExp/g,

  /* Alternatively, search can be a function that returns the expression */
  search: function search(equation) {
    throw 'No search function provided for operation ' + name;
  },

  /* Accepts the results of the search and splits them up into an operand array.
      Example: would accept '1+2' and return an [1, 2] for an addition operation.    
      Default: Returns all numbers of one or more digits including negatives and decimals
  */
  parse: function parse(expression) {
    // -?  optional minus sign for negative numbers 
    // (\d*\.)? optional 0 or more numbers followed by a . for decimals
    // \d+  required at least one number of one or more digits
    var number = /-?(\d*\.)?\d+/g;
    var get = null,
        operands = [];

    while (get = number.exec(expression)) {
      operands.push(get[0]);
    }

    return operands;
  },

  /* Accepts the operands from parse and returns a single string value
      Example: if the operands are [1, 2] and it is an addition operation, this would return "3"
  */
  resolve: function resolve(operands) {}
};
var DiceOperation = function DiceOperation() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var op = this;

  for (var k in options) {
    op[k] = options[k];
  }

  op.name = options.name || optionDefaults.name;
  var search = options.search;

  if (search instanceof RegExp) {
    search = function search(input) {
      return (new RegExp(options.search).exec(input) || [null])[0];
    };
  }

  op.onSearch = function (equation) {};

  op.onSearched = function (equation, expression) {};

  op.search = function (equation) {
    op.onSearch(equation);
    var expression = search(equation);
    op.onSearched(equation, expression);
    return expression;
  };

  var parse = options.parse || optionDefaults.parse;

  op.onParse = function (expression) {};

  op.onParsed = function (expression, operands) {};

  op.parse = function (expression) {
    op.onParse(expression);
    var operands = parse(expression);
    op.onParsed(expression, operands);
    return operands;
  };

  var resolve = options.resolve;

  op.onResolve = function (operands) {};

  op.onResolved = function (operands, result) {};

  op.resolve = function (operands) {
    op.onResolve(operands);
    var result = resolve.apply(op, operands);
    op.onResolved(operands, result);
    return result;
  };

  op.onEvaluate = function (equation) {};

  op.onEvaluated = function (equation, expression) {};

  op.evaluate = function (equation) {
    op.onEvaluate(equation);
    var input = equation;
    var expression;

    while ((expression = op.search(equation)) !== null) {
      var operands = op.parse(expression);
      var result = op.resolve(operands);
      equation = equation.replace(expression, result);
    }

    op.onEvaluated(input, equation);
    return equation;
  };
};

var BaseModule = function BaseModule() {
  this.apply = function (roller) {
    roller.operations.unshift(this.operations[0]);
  };

  this.operations = [new DiceOperation({
    name: 'dice',
    search: /\d*d\d+/,
    parse: function parse(expression) {
      return expression.split(/\D+/);
    },
    roll: function roll(facets) {
      return Math.floor(Math.random() * facets + 1);
    },
    resolve: function resolve(rolls, facets) {
      var value = 0;

      for (var i = 0; i < (rolls || 1); i++) {
        value += this.roll(facets);
      }

      return value;
    }
  })];
};

/* 
    options = {
        modules : [modules]
    }
*/

var DiceRoller = function DiceRoller(options) {
  var roller = this;
  roller.operations = [];

  roller.onSolve = function (equation) {};

  roller.onSolved = function (equation, solution) {};

  roller.solve = function (equation) {
    var input = equation;
    roller.onSolve(equation);
    roller.operations.forEach(op => {
      equation = op.evaluate(equation);
    });
    roller.onSolved(input, equation);
    return equation;
  };

  roller.applyModules = function (modules) {
    if (!Array.isArray(modules)) {
      modules = [modules];
    }

    modules.forEach(module => {
      new module().apply(roller);
    });
  }; // Seed with dice roll operation


  roller.applyModules(BaseModule);

  if (options && options.modules) {
    roller.applyModules(options.modules);
  }
};

var assert = chai.assert;
var BaseTests = function BaseTests() {
  describe('Base Functionality', function () {
    describe('Hooks', function () {
      it('should call .onSolved when .solve() is called', function (done) {
        var roller = new DiceRoller();

        roller.onSolved = function (input, output) {
          assert(input === '3d4');
          done();
        };

        roller.solve('3d4');
      });
      it('should call .onSearched when an operation searches the input', function (done) {
        var roller = new DiceRoller();

        roller.operations[0].onSearched = function (input, found) {
          assert(input == '2d8' && found == '2d8');
          done();
        };

        roller.solve('2d8');
      });
      it('should call .onParsed when an operation parses the input', function (done) {
        var roller = new DiceRoller();

        roller.operations[0].onParsed = function (expression, operands) {
          assert(expression == '5d12' && operands[0] == 5);
          done();
        };

        roller.solve('5d12');
      });
      it('should call .onEvaluated when an operation evaluates the input', function (done) {
        var roller = new DiceRoller();

        roller.operations[0].onEvaluated = function (input, solution) {
          assert(input == '1d20', !isNaN(solution));
          done();
        };

        roller.solve('1d20');
      });
    });
  });
};

var assert$1 = chai.assert;
var DiceTests = () => {
  describe('Dice Roller Tests', function () {
    describe('Search Tests', function () {
      var diceOperation = new BaseModule().operations[0];
      var searchTests = [{
        input: '1d4',
        output: '1d4',
        note: 'should match 1d4'
      }, {
        input: 'd4',
        output: 'd4',
        note: 'should match d4'
      }, {
        input: 'abc2d6cba',
        output: '2d6',
        note: 'should match 2d6 when surrounded by other characters'
      }, {
        input: 'abcd8cba',
        output: 'd8',
        note: 'should match d8 when surrounded by other characters'
      }, {
        input: 'xyz12345d54321',
        output: '12345d54321',
        note: "should match multi digit numbers"
      }, {
        input: '1d',
        output: null,
        note: "should not match 1d, no facets operand"
      }, {
        input: '1a2b3c4',
        output: null,
        note: 'should not match 1a2b3c4, no dice operator'
      }, {
        input: '2d6+4d8',
        output: '2d6',
        note: "should match 2d6 from 2d6+4d8, only returns first match"
      }];
      searchTests.forEach(test => {
        it(test.note, function () {
          assert$1.isTrue(test.output == diceOperation.search(test.input));
        });
      });
    });
    describe('Parse Tests', function () {
      var diceOperation = new BaseModule().operations[0];
      var parseTests = [{
        input: '3d6',
        output: ['3', '6'],
        note: 'should split 3d6 into [3, 6]'
      }, {
        input: 'd6',
        output: ['', '6'],
        note: "should split d6 into ['', 6]"
      }, {
        input: '200d10',
        output: ['200', '10'],
        note: 'should split 200d10 into [200, 10]'
      }];
      parseTests.forEach(test => {
        it(test.note, function () {
          assert$1.isTrue(JSON.stringify(test.output) == JSON.stringify(diceOperation.parse(test.input)));
        });
      });
    });
    describe('Evaluation Tests', function () {
      var diceOperation = new BaseModule().operations[0];
      it('should replace "d4" with a number 1-4', function () {
        var output = diceOperation.evaluate('d4');
        assert$1(+output <= 4 && +output >= 1);
      });
      it('should replace 3d6 with a number 3-18', function () {
        var output = diceOperation.evaluate('3d6');
        assert$1(+output <= 18 && +output >= 3);
      });
      it('should replace only the 4d8 in 4d8+5 with no math module loaded', function () {
        var output = diceOperation.evaluate('4d8+5');
        assert$1(/^\d+\+5$/.test(output));
      });
      it('should replace both die rolls in abc*2d4/def+d6-4', function () {
        var output = diceOperation.evaluate('abc*2d4/def+d6-4');
        assert$1(/^(abc\*)\d(\/def\+)\d-4$/.test(output));
      });
    });
    describe('Randomizer', function () {
      var diceOperation = new BaseModule().operations[0];
      var min = 12,
          max = 0;

      for (var i = 0; i < 1000; i++) {
        var output = diceOperation.evaluate('2d6');

        if (output < min) {
          min = output;
        }

        if (output > max) {
          max = output;
        }
      }

      it('Should always (1000 rolls) roll between 2 and 12 for 2d6', function () {
        assert$1(min >= 2 && max <= 12);
      });
    });
  });
};

var DnDModule = function DnDModule() {
  this.apply = function (roller) {
    var advantage = this.operations[0];
    advantage.parent = roller;
    roller.operations.unshift(advantage);
  };

  this.operations = [
  /* The game frequently asks the player to roll a twenty-sided die twice and pick the higher 
  	or lower of the two rolls. 
  	using the syntax 2xd20 it will roll the die twice and separate the results into an array. 
  */
  new DiceOperation({
    name: 'Advantage',
    search: /\d+xd\d+/,
    resolve: function resolve(repetitions, facets) {
      var operation = this; // 2xd20 becomes [d20, d20]. We then let the roller solve each d20 

      var results = Array(+repetitions).fill('d' + facets).map(x => +operation.parent.solve(x)); // high-to-low sorting

      results.sort((x, y) => +x < +y);
      return JSON.stringify(results);
    },
    parse: match => match.split(/\D+/)
  })];
};

var assert$2 = chai.assert;
var DnDTests = () => {
  describe('5e dice extensions', function () {
    var roller = new DiceRoller({
      modules: [DnDModule]
    });
    describe('Advantage/Disadvantage', function () {
      var advantage = new DnDModule().operations[0];
      describe('Searching', function () {
        var searchTests = [{
          input: '2xd20',
          output: '2xd20',
          note: "matches 2xd20"
        }, {
          input: 'xd10',
          output: null,
          note: "does not match xd10"
        }, {
          input: '3xd',
          output: null,
          note: "does not match 3xd"
        }, {
          input: '5+4xd6+3xd8',
          output: '4xd6',
          note: "matches first found"
        }];
        searchTests.forEach(test => {
          it(test.note, function () {
            assert$2.isTrue(test.output == advantage.search(test.input));
          });
        });
      });
      describe('Parsing', function () {
        var parseTests = [{
          input: '2xd20',
          output: ['2', '20'],
          note: "parses 2xd20 into [2, 20]"
        }, {
          input: '8xd6',
          output: ['8', '6'],
          note: "parses 8xd6 into [8, 6]"
        }];
        parseTests.forEach(test => {
          it(test.note, function () {
            assert$2.isTrue(JSON.stringify(test.output) == JSON.stringify(advantage.parse(test.input)));
          });
        });
      });
      describe('Evaluation', function () {
        it('should convert 2xd20 to an array of two numbers 1-20', function () {
          var solution = roller.solve('2xd20');
          assert$2(/\[\d{1,2}\,\d{1,2}]/.test(solution));
        });
        it('should sort the result array in descending order', function () {
          var solution = JSON.parse(roller.solve('20xd20'));
          var copy = solution.slice();
          copy.sort((x, y) => x < y);
          assert$2(JSON.stringify(solution) == JSON.stringify(copy));
        });
      });
    });
  });
};

/* RegExp fragment. 
    -? : optional - sign for negative numbers 
    (\d*\.)? : optional set of 0 or more numbers and one . for decimals 
    \d+ : one or more digits.  

    matches: 1, 1.1, .1, -1, -1.1, -.1
*/

var rgxNumber = '-?(\\d*\\.)?\\d+';
var MathModule = function MathModule() {
  this.apply = function (roller) {
    this.operations.forEach(op => {
      // Parentheses needs a reference to the roller for recursion 
      op.parent = roller;
      roller.operations.push(op);
    });
  };

  this.operations = [new DiceOperation({
    name: 'Parentheses',
    search: /\([^()]+\)/,
    parse: match => [match.replace(/[()]/g, '')],
    resolve: function resolve(x) {
      return this.parent.solve(x);
    }
  }), new DiceOperation({
    name: 'Exponents',
    search: new RegExp(rgxNumber + '\\^' + rgxNumber),
    resolve: (x, y) => Math.pow(x, y)
  })
  /* Needs to happen simultaneously, so a single function */
  , new DiceOperation({
    name: 'MultiplyDivide',
    search: new RegExp(rgxNumber + '[*\\/]' + rgxNumber),
    parse: function parse(expression) {
      var firstOperand = new RegExp('^' + rgxNumber).exec(expression)[0];
      var secondOperand = new RegExp(rgxNumber + '$').exec(expression)[0];
      var operator = /[*\/]/.exec(expression)[0];
      return [firstOperand, secondOperand, operator];
    },
    resolve: (x, y, op) => op == '*' ? x * y : x / y
  }), new DiceOperation({
    name: 'AddSubtract',
    search: new RegExp(rgxNumber + '[+-]' + rgxNumber),
    parse: function parse(expression) {
      var firstOperand = new RegExp('^' + rgxNumber).exec(expression)[0];
      var secondOperand = new RegExp(rgxNumber + '$').exec(expression)[0];
      var operator = expression.substr(firstOperand.length, 1); // Make secondOperand positive if we are subtracting a positive.

      if (operator == '-' && !/--/.test(expression)) {
        secondOperand = secondOperand.substr(1);
      }

      return [firstOperand, secondOperand, operator];
    },
    resolve: (x, y, op) => op == '+' ? +x + +y : +x - +y
  })];
};

var assert$3 = chai.assert;
var IntegrationTests = () => {
  describe('Integration Tests', function () {
    describe('Dice and Math', function () {
      var roller = new DiceRoller({
        modules: [MathModule]
      });
      var dice = roller.operations.find(op => op.name == 'dice'); // Simplify our tests by removing randomization; that gets tested in the dice unit tests.

      dice.roll = facets => +facets;

      var tests = [{
        input: '',
        output: '',
        note: "successfully does nothing with no input"
      }, {
        input: '123',
        output: '123',
        note: "successfully ignores input with no operators"
      }, {
        input: '1d4',
        output: '4',
        note: "successfully rolls dice"
      }, {
        input: '1d6+5',
        output: '11',
        note: "successfully rolls dice and adds"
      }, {
        input: '1d6+4/2',
        output: '8',
        note: "successfully follows order of operations (1d6+4/2 = 1d6+2)"
      }, {
        input: '1d6+4/2*2',
        output: '10',
        note: "1d6+4/2*2 = 1d6+((4/2)*2)"
      }, {
        input: '(6+4)/2',
        output: '5',
        note: "successfully overrides order of operations when using parenthese (6+4)/2 = 5"
      }, {
        input: '(2+2)^2',
        output: '16',
        note: "successfully applies exponents to parentheses"
      }];
      tests.forEach(test => {
        it(test.note, function () {
          assert$3(test.output == roller.solve(test.input));
        });
      });
    });
    describe('Dice, Math, and DnD', function () {
      var roller = new DiceRoller({
        modules: [MathModule, DnDModule]
      });
      var dice = roller.operations.find(op => op.name == 'dice');

      dice.roll = facets => +facets;

      it('Should evaluate DnD advantage, die, and addition', function () {
        assert$3(roller.solve('2xd20+1d6+5') == '[20,20]+11');
      });
    });
  });
};

/*  Log structure :
    roller.log : [
        {
            equation : '',
            solution : '',
            operations : [
                { 
                    name : '',
                    expression : '',
                    search : [ { equation : '', expression : '' } ],
                    parse : [ { expression : '', operands : [] } ],
                    resolve : [ { operands : [], result : '' } ],
                    evaluate : { input : '', equation : ''  }
                }
            ]
        }
    ];
*/
var getCurrentOp = function getCurrentOp(roller) {
  return roller.log.slice(-1)[0].operations.slice(-1)[0];
};

var LoggingModule = function LoggingModule() {
  this.apply = function (roller) {
    roller.log = [];
    this.onSolve(roller);
    this.onSolved(roller);
    this.onEvaluate(roller);
    this.onEvaluated(roller);
    this.onSearched(roller);
    this.onParsed(roller);
    this.onResolved(roller);
    this.onDiceResolve(roller);
    this.onDiceRoll(roller);
    this.onDiceResolved(roller);
  };

  this.onSolve = function (roller) {
    var onSolve = roller.onSolve;

    roller.onSolve = function (equation) {
      roller.log.push({
        equation: equation,
        solution: '',
        operations: []
      });
      return onSolve(equation);
    };
  };

  this.onSolved = function (roller) {
    var onSolved = roller.onSolved;

    roller.onSolved = function (equation, solution) {
      roller.log.slice(-1)[0].solution = solution;
      return onSolved(equation, solution);
    };
  };

  this.onEvaluate = function (roller) {
    roller.operations.forEach(op => {
      var onEvaluate = op.onEvaluate;

      op.onEvaluate = function (equation) {
        roller.log.slice(-1)[0].operations.push({
          name: op.name,
          search: [],
          parse: [],
          resolve: []
        });
        return onEvaluate(equation);
      };
    });
  };

  this.onEvaluated = function (roller) {
    roller.operations.forEach(op => {
      var onEvaluated = op.onEvaluated;

      op.onEvaluated = function (input, equation) {
        getCurrentOp(roller).evaluate = {
          input: input,
          equation: equation
        };
        return onEvaluated(input, equation);
      };
    });
  };

  this.onSearched = function (roller) {
    roller.operations.forEach(op => {
      var onSearched = op.onSearched;

      op.onSearched = function (equation, expression) {
        getCurrentOp(roller).search.push({
          equation: equation,
          expression: expression
        });
        return onSearched(equation, expression);
      };
    });
  };

  this.onParsed = function (roller) {
    roller.operations.forEach(op => {
      var onParsed = op.onParsed;

      op.onParsed = function (expression, operands) {
        getCurrentOp(roller).parse.push({
          expression: expression,
          operands: operands
        });
        return onParsed(expression, operands);
      };
    });
  };

  this.onResolved = function (roller) {
    roller.operations.forEach(op => {
      var onResolved = op.onResolved;

      op.onResolved = function (operands, result) {
        getCurrentOp(roller).resolve.push({
          operands: operands,
          result: result
        });
        return onResolved(operands, result);
      };
    });
  };
  /* Before rolling, add empty operation.rolls array */


  this.onDiceResolve = function (roller) {
    var diceOp = roller.operations.find(op => op.name === 'dice');
    var onResolve = diceOp.onResolve;

    diceOp.onResolve = function (operands) {
      getCurrentOp(roller).rolls = [];
      return onResolve(operands);
    };
  };
  /* For each roll, add roll result to operation.rolls array */


  this.onDiceRoll = function (roller) {
    var diceOp = roller.operations.find(op => op.name === 'dice');
    var roll = diceOp.roll;

    diceOp.roll = function (facets) {
      var rollResult = roll(facets);
      getCurrentOp(roller).rolls.push(rollResult);
      return rollResult;
    };
  };
  /* After rolling, move operation.rolls to operation.resolve.rolls */


  this.onDiceResolved = function (roller) {
    var diceOp = roller.operations.find(op => op.name === 'dice');
    var onResolved = diceOp.onResolved;

    diceOp.onResolved = function (operands, result) {
      var resolved = onResolved(operands, result);
      var diceLog = getCurrentOp(roller);
      diceLog.resolve.slice(-1)[0].rolls = diceLog.rolls;
      delete diceLog.rolls;
      return resolved;
    };
  };
};

var LoggingTests = () => {
  var assert = chai.assert;
  describe('Logging Tests', function () {
    describe('initialization', function () {
      it('should add a .log array to the dice roller on initialization', function () {
        var roller = new DiceRoller({
          modules: [LoggingModule]
        });
        assert(Array.isArray(roller.log));
      });
    });
    describe('general logging', function () {
      it('should record results in a .log array', function () {
        var roller = new DiceRoller({
          modules: [LoggingModule]
        });
        roller.solve('3d6');
        roller.solve('1d4');
        assert(roller.log.length === 2);
      });
      it('should record the input in each log', function () {
        var roller = new DiceRoller({
          modules: [LoggingModule]
        });
        roller.solve('1d4');
        assert(roller.log.slice(-1)[0].equation === '1d4');
      });
      it('should record the output in each log', function () {
        var roller = new DiceRoller({
          modules: [LoggingModule]
        });
        roller.solve('4d1');
        assert(roller.log.slice(-1)[0].solution === '4');
      });
      it('should record the onSearch event', function () {
        var roller = new DiceRoller({
          modules: [LoggingModule]
        });
        roller.solve('10d10');
        var logged = roller.log[0].operations[0].search[0];
        assert(logged.equation == '10d10' && logged.expression == '10d10');
      });
      it('should record the onParsed event', function () {
        var roller = new DiceRoller({
          modules: [LoggingModule]
        });
        roller.solve('2d6');
        var logged = roller.log[0].operations[0].parse[0];
        assert(logged.expression == '2d6' && logged.operands[0] == '2');
      });
      it('should record the onResolve event', function () {
        var roller = new DiceRoller({
          modules: [LoggingModule]
        });
        roller.solve('d1');
        var logged = roller.log[0].operations[0].resolve[0];
        assert(logged.operands.length == 2 && logged.result == '1');
      });
      it('should record the onEvaluated event', function () {
        var roller = new DiceRoller({
          modules: [LoggingModule]
        });
        roller.solve('6d1');
        var logged = roller.log[0].operations[0].evaluate;
        assert(logged.input == "6d1" && logged.equation == "6");
      });
    });
    describe('dice logging', function () {
      it('should record rolls in a .log[n].rolls array', function () {
        var roller = new DiceRoller({
          modules: [LoggingModule]
        });
        roller.solve('3d8+2d4');
        var logged = roller.log.slice(-1)[0].operations.slice(-1)[0];
        assert(logged.resolve[0].rolls.length == 3 && logged.resolve[1].rolls.length == 2);
      });
    });
  });
};

var assert$4 = chai.assert;
var MathTests = () => {
  describe('Math Module Unit Tests', function () {
    describe('Addition and Subtraction Tests', function () {
      var addSubtract = new MathModule().operations.find(op => op.name == 'AddSubtract');
      describe('Search Tests', function () {
        var searchTests = [{
          input: '1+2',
          output: '1+2',
          note: "should match 1+2"
        }, {
          input: '1+',
          output: null,
          note: "should not match '1+'"
        }, {
          input: '+2',
          output: null,
          note: "should not match +2"
        }, {
          input: '1-2',
          output: '1-2',
          note: "should match 1-2"
        }, {
          input: '1-',
          output: null,
          note: "should not match '1-'"
        }, {
          input: '-2',
          output: null,
          note: "should not match -2"
        }];
        searchTests.forEach(test => {
          it(test.note, function () {
            assert$4(addSubtract.search(test.input) == test.output);
          });
        });
      });
      describe('Parse Tests', function () {
        var parseTests = [{
          input: '1+2',
          output: ['1', '2', '+'],
          note: 'should parse 1+2 to [1, 2, +]'
        }, {
          input: '-3+4',
          output: ['-3', '4', '+'],
          note: 'should parse -3+4 to [-3, 4, +]'
        }, {
          input: '55+66',
          output: ['55', '66', '+'],
          note: 'should parse 55+66 to [55, 66, +]'
        }, {
          input: '1-2',
          output: ['1', '2', '-'],
          note: 'should parse 1-2 to [1, 2, -]'
        }, {
          input: '-3-4',
          output: ['-3', '4', '-'],
          note: 'should parse -3-4 to [-3, 4, -]'
        }, {
          input: '55--66',
          output: ['55', '-66', '-'],
          note: 'should parse 55-66 to [55, -66, -]'
        }];
        parseTests.forEach(test => {
          it(test.note, function () {
            assert$4(JSON.stringify(addSubtract.parse(test.input)) == JSON.stringify(test.output));
          });
        });
      });
      describe('Evaluation Tests', function () {
        it('should evaluate 1+2 to 3', function () {
          assert$4(addSubtract.evaluate('1+2') === '3');
        });
        it('should evaluate 1-2 to -1', function () {
          assert$4(addSubtract.evaluate('1-2') === '-1');
        });
        it('should evaluate 2-1+1 to 2', function () {
          assert$4(addSubtract.evaluate('2-1+1') === '2');
        });
      });
    });
    describe('Multiplication and Division Tests', function () {
      var multDivOperation = new MathModule().operations.find(op => op.name == 'MultiplyDivide');
      describe('Search Tests', function () {
        var searchTests = [{
          input: '1*2',
          output: '1*2',
          note: 'matches 1*2'
        }, {
          input: '1*x',
          output: null,
          note: 'does not match 1*x'
        }, {
          input: 'y*2',
          output: null,
          note: 'does not match y*2'
        }, {
          input: 'abc33*44xyz',
          output: '33*44',
          note: 'matches 33*44 in abc33*44xyz'
        }, {
          input: '1/2',
          output: '1/2',
          note: 'matches 1/2'
        }, {
          input: '1/x',
          output: null,
          note: 'does not match 1/x'
        }, {
          input: 'y/2',
          output: null,
          note: 'does not match y/2'
        }, {
          input: 'abc33/44xyz',
          output: '33/44',
          note: 'matches 33/44 in abc33/44xyz'
        }];
        searchTests.forEach(test => {
          it(test.note, function () {
            assert$4(multDivOperation.search(test.input) == test.output);
          });
        });
      });
      describe('Parse Tests', function () {
        var parseTests = [{
          input: '1*2',
          output: ['1', '2', '*'],
          note: 'extracts [1, 2] from 1*2'
        }, {
          input: '-10*-100',
          output: ['-10', '-100', '*'],
          note: 'extracts [-10, -100] from -10*-100'
        }, {
          input: '1/2',
          output: ['1', '2', '/'],
          note: 'extracts [1, 2] from 1/2'
        }, {
          input: '-10/-100',
          output: ['-10', '-100', '/'],
          note: 'extracts [-10, -100] from -10/-100'
        }];
        parseTests.forEach(test => {
          it(test.note, function () {
            assert$4(JSON.stringify(multDivOperation.parse(test.input)) == JSON.stringify(test.output));
          });
        });
      });
      describe('Evaluation Tests', function () {
        it('should evaluate 2*4 as 8', function () {
          assert$4(multDivOperation.evaluate('2*4') == '8');
        });
        it('should evaluate 4+2*8 as 4+16', function () {
          assert$4(multDivOperation.evaluate('4+2*8') == '4+16');
        });
        it('should evaluate 4/2 as 2', function () {
          assert$4(multDivOperation.evaluate('4/2') == '2');
        });
        it('should evaluate 4+2/8 as 4+.25', function () {
          assert$4(multDivOperation.evaluate('4+8/2') == '4+4');
        });
      });
    });
    describe('Exponents Tests', function () {
      var exponentOperation = new MathModule().operations.find(op => op.name == 'Exponents');
      describe('Search Tests', function () {
        var searchTests = [{
          input: '2^2',
          output: '2^2',
          note: 'matches 2^2'
        }, {
          input: '2^x',
          output: null,
          note: 'does not match 2^x'
        }, {
          input: 'y^2',
          output: null,
          note: 'does not match y^2'
        }, {
          input: 'abc22^22xyz',
          output: '22^22',
          note: 'matches 22^22 in abc22^22xyz'
        }];
        searchTests.forEach(test => {
          it(test.note, function () {
            assert$4(exponentOperation.search(test.input) == test.output);
          });
        });
      });
      describe('Parse Tests', function () {
        var parseTests = [{
          input: '2^2',
          output: ['2', '2'],
          note: 'parses [2, 2] from 2^2'
        }, {
          input: '-10^-2',
          output: ['-10', '-2'],
          note: 'parses [-10, -2] from -10^-2'
        }];
        parseTests.forEach(test => {
          it(test.note, function () {
            assert$4(JSON.stringify(exponentOperation.parse(test.input)) == JSON.stringify(test.output));
          });
        });
      });
      describe('Evaluation Tets', function () {
        it('should evaluate 2^3 as 8', function () {
          assert$4(exponentOperation.evaluate('2^3') == '8');
        });
        it('should evaluate 2^-3 as .125', function () {
          assert$4(exponentOperation.evaluate('2^-3') == .125);
        });
      });
    });
    describe('Parentheses Tests', function () {
      var parenthesesOperation = new MathModule().operations.find(op => op.name == 'Parentheses');
      describe('Search Tests', function () {
        var searchTests = [{
          input: '(1+2)',
          output: '(1+2)',
          note: 'should match (1+2)'
        }, {
          input: '(1+2',
          output: null,
          note: 'should not match (1+2'
        }, {
          input: '1+2)',
          output: null,
          note: 'should not match 1+2)'
        }, {
          input: 'abc(xyz)123',
          output: '(xyz)',
          note: 'should match (xyz) in abc(xyz)123'
        }];
        searchTests.forEach(test => {
          it(test.note, function () {
            assert$4(parenthesesOperation.search(test.input) == test.output);
          });
        });
      });
      describe('Parse Tests', function () {
        var parseTests = [{
          input: '(1+2)',
          output: ['1+2'],
          note: 'should extract inner equation'
        }];
        parseTests.forEach(test => {
          it(test.note, function () {
            assert$4(JSON.stringify(parenthesesOperation.parse(test.input)) == JSON.stringify(test.output));
          });
        });
      }); // Evaluation tests only make sense in the context of the full math module
    });
    describe('Math Integration Tests', function () {
      var roller = new DiceRoller({
        modules: [MathModule]
      });
      it('should evaluate 3*(6+3^2) as 45', function () {
        assert$4(roller.solve('3*(6+3^2)') == '45');
      });
    });
  });
};

export { BaseTests, DiceTests, DnDTests, IntegrationTests, LoggingTests, MathTests };
