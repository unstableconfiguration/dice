
	let LYDiceRoller_Config = {
		dev : true
	}


	let LYDiceRoller = function(config){
		let roller = this;
		roller.config = config || { dev:true };
		let dev = roller.config.dev || false;// Development mode for debugging and testing
		let log = (x) => { if(dev){ console.log(x); } };
		
		roller.Controls = {}
		// Initialization of UI controls if present.
		roller.onDOMContentLoaded = roller.init;
		roller.init = function(){
			roller.Controls.Input = document.getElementById('DiceRoller_Input')/*text type input*/
			roller.Controls.Button = document.getElementById('DiceRoller_Button')/*button type input*/
			roller.Controls.Output = document.getElementById('DiceRoller_Output')/*text area*/


			log('Initializing DiceRoller Controls.');
			let control_load_message = '';

			if(!roller.Controls.Input || !roller.Controls.Output || !roller.Controls.Button){
				log('Could not identify controls needed for UI');
			}
			else {
				let handleInput = ()=>{
					let input = roller.Controls.Input.value.toLowerCase();
					let output = roller.resolve(input);
					roller.Controls.Output.value = output + roller.Controls.Output.value;
				}

				roller.Controls.Input.value = '--help--'; 
				roller.Controls.Input.onkeydown = function(e){ if((e.keyCode||e.which)===13){ handleInput(); } }
				roller.Controls.Button.onclick = function(){ handleInput(); } 
				roller.Controls.Output.value = ''; 
			}	
		}

		// TODO: we may need something smarter than just returning a value and concatenating it in. 
		// There may need to be a return function possibility.

		// Loops over the roller's commands and applies them to input equation
		roller.resolve = function(equation){
			let result = '';
			for(let c=0; c< roller.Commands.order.length; c++){
				let order = roller.Commands.order[c];
				let command = roller.Commands[order];
				if(!command || !command.search){ continue; }
				if(command.search(equation)){
					let r = command.evaluate(equation);
					result += r.value;
					if(r.break) { break; }
				}
			}
			return result;
		}

		/*	A pair of functions to test input and perform a task
			search: a string to search for or a search function to evaluate against the input string
			evaluate: a function(input) that performs a task and returns a message.
			description: description text for the generated 'help' message */
		roller.Command = function(search, evaluate, description){
			let com = this;
			
			com.search = (typeof(search)==='function') ? search :
				(i) => { return i.includes(search); };
			
			com.evaluate = function(input){
				let value = evaluate(input);

				// this feels hacky, lets think clearly about how we want to be returning values.
				if(typeof(value)!== 'object') { value = { 'value' : value, 'break' : true }; }
				return value;	
			}	

			com.description = description||'';
		}

		// Commands are stored by name and their order of operations is preserved via array
		roller.Commands = {order : []};
		/*	Name: a key for the command to be stored under 
			Command: a roller.Command object */
		roller.Commands.Add = function(name, command){
			roller.Commands.order.unshift(name);
			roller.Commands[name] = command;
		}

		/* Default command: solve
			Silently invoked command that calls roller.solve(i) that processes dice input.
		*/ 
		roller.Commands.Add('solve',new roller.Command(()=>{return true;}, (input)=>{
			let solved = '';
			solved = roller.solve(input);
			return { 'value':solved+'\n', 'break':false };
		}));


		roller.saved = [];

		/* 
			The core of the dice-roller.  Loops through all Operations in order 
			Each operation tests the input to see if it is applicable and then modifies it if so.
			equation: the input to evaluate.
			returns: the modified input after all operations have been performed
		*/
		roller.solve = function(equation) {
			log('Solving for: ' + equation);
			// an object to store the state and steps of the input as it is procesed
			let eq = { 
					input: equation, // unmodified input 
					working: equation, // input as it is modified step-by-step 
					outputfuncs : [],
					getoutput : null,
					output : null
			};
			eq.getoutput = ()=>{
				for(let i = 0; i < eq.outputfuncs.length; i++){
					eq.outputfuncs[i]();
				}
				eq.output = eq.working;
			}

			// equation object 
			// stores initial input 
			// can store each iteration and response. 

			for(let i = 0; i < roller.Operations.order.length; i++){
				let o = roller.Operations.order[i];
				eq = roller.Operations[o].resolve(eq);
			}
			eq.getoutput();
			log('Returning result: ' + eq.output); 
			return eq.output;
		}

		let helpfunc =()=>{
			let helpMessage = 'Commands:\n';
			for(let c in roller.Commands){
				let command = roller.Commands[c];
				if(c==='solve' || !command.evaluate){continue;}
				helpMessage += c + ': ' + (command.description||'')+'\n';
			}
			return helpMessage;
		}
		let help = new roller.Command('help', helpfunc, 'Displays this message');
		roller.Commands.Add('help', help);
	

		// TODO: better tracking and record keeping. 
		roller.rolls = { }
		
		/*  Mathematical operation.  Searches for operator and operands and 
			executes function if they are found.
			usage: let op = new operation(...); roller.Operations.Add(op);
			pattern: regex pattern or search function to find operators and operands
			expression: delegate function to perform on found values 
		*/
		roller.Operation = function(search, expression){
			let op = this;	
			
			/* search the input for a pattern
				return first occurance if found, else return null */
			op.search = function(input){
				if(typeof(search)==='function'){ return search(input); }

				let rgx = search;
				if(['string','number'].includes(typeof(search))){ rgx = new RegExp(''+search); }
				if(rgx.exec){ 
					let val = rgx.exec(input);// exec returns null or an array
					return val;
					//return val ? val[0] : val;// so return 0 index of array or null
				}

				return null;// we did not get a string, a regex object, or a function
			}

			/* 	attempts to extract parameters for .evaluate from the matched string
				default behavior: it is looking for one or two integers 
				and one non-integer symbol 
				returns: a 3-item array [int||null, int, symbol] */
			op.getTerms = function(match){
				let digits = [], symbol, get = null;
				let d = /(-?\d+)/g; // 0-1 minus symbols and one or more digits

				while((get = d.exec(match)) !== null){
					digits.push(+get[0]);
				}
				// if we have only one digit (d4 is valid input to represent 1d4)
				// we fill the 0 index with a null
				if(digits.length===1){ digits.unshift(null) }; 

				let nd = /[^-\d]/; // find the non-digit, non minus sign symbol
				get = nd.exec(match);
				// if we are subtracting i.e. 3-4 this converts it to 3+-4
				symbol = get ? get[0] : '+';

				return digits.concat(symbol);
			}

			// no default code for expression, it accepts the parameters from getTerms
			op.expression = expression || (()=>{ log('no function found in operation'); })

			/*	calls op.search to find matches in the input string
				calls op.getTerms to retrieve the operator and operands
				calls op.expression to perform the operation and return a value */
			op.resolve = function(eq){
				let get = null;
				while((get = op.search(eq.working)) !== null){// search for pattern match
					log('Found match, beginning operation on input string.')

					let terms = op.getTerms(get);
					log('Retrieved terms: ' + terms);
					let x = terms[0],
						y = terms[1],
						z = terms[2];// destructure/unpack into parameters
					
					let value = op.expression(x,y,z);
					log('Evaluated for: ' + value);

					eq.working = eq.working.replace(get,value);
					log('updating input: '+eq.working);

				}
				return eq;
			}
		}

		roller.Operations = { order : [] };

		/*	name: key to store the operation under
			operation(required): Operation() object */
		roller.Operations.Add = function(name, operation){
			let ops = roller.Operations;
			// Operations are executed as a stack (first in last out)
			// The exception to this is the base dice-roll which is preserved as first to execute
			if(name==='Dice') { roller.Operations.order.push(name); }
			else { roller.Operations.order.splice(1,0,name); }
			roller.Operations[name] = operation;
		}

		/*	Default dice-roll operation
			matches patterns d# (i.e. d4, d6) or #d# (1d6, 3d4) */
		let dice_roll = new roller.Operation(/[\d]{0,}[d][\d]{1,}/g);
		dice_roll.expression = (rolls, facets) => {
			if(!rolls){ rolls=1; } // e.g. translate d4 to 1d4 
			let value = 0;
			if(!roller.rolls[facets]){roller.rolls[facets] = []; }
			for(let i = 0; i < rolls ; i++){
				let roll = Math.floor((Math.random()*facets)+1);
				roller.rolls[facets].push(roll);
				value += roll;
			}
			return value;
		}
		roller.Operations.Add('Dice', dice_roll);
		return roller;

	}

	let DiceRoller = new LYDiceRoller(LYDiceRoller_Config);

	/* Math module: extends roller with basic PEMDAS operations */
	(()=>{
		DiceRoller.Operations.Add('AddSubtract', new DiceRoller.Operation(
			/-?\d+[+-]\d+/g, 
			(x,y)=>x+y 
		));

		DiceRoller.Operations.Add('MultiplyDivide', new DiceRoller.Operation(
			/-?\d+[*//]-?\d+/g,
			(x,y,z)=>{ return z==='*' ? x*y : (x/y).toFixed(2); }
		));

		DiceRoller.Operations.Add('Exponents', new DiceRoller.Operation(
			/-?\d+\^-?\d+/g,
			(x,y)=>Math.pow(x,y)
		));

		let parens = new DiceRoller.Operation(
			/\([^()]+\)/g,
			(x)=>{ return DiceRoller.solve(x); }
		);
		parens.getTerms = (match)=>{
			match = match[0].replace(/[()]/g, '');
			return [match];
		}
		DiceRoller.Operations.Add('Parentheses', parens);
	})();



	/* D&D 5e module */
	(()=>{

		// Advantage/Disadvantage rolls follow the rules 'roll a d20 twice and pick the highest/lowest result'
		// designate this with the nx prefix before a dx dice roll.  i.e. 2xd20
		// we roll the dice separately and return the results in an array sorted high-to-low
		let advantage = new DiceRoller.Operation(
			/\d+xd\d+/g, // matches nxdn pattern i.e. 2xd20 or 5xd6
			(x,y)=>{ let arr = []; for(let i = 0; i < x; i++){ arr.push(+DiceRoller.solve(y)); } return arr.sort((x,y)=>x<y) }
		);
		advantage.getTerms = (match) => {
			let repeat = /\d+/.exec(match)[0];
			let dice = /d\d+/.exec(match)[0];
			return [repeat,dice,];
		}
		// this precedes dice rolling, so we bypass the normal .Add() function
		DiceRoller.Operations.order.unshift('Advantage');
		DiceRoller.Operations['Advantage'] = advantage;

		// crit: 
		// crit is really an extension of the dice roller.
		// what we want is, if the result of a d20 is a 20 or a 1 
		// the difficulty is how to designate it while maintaining normal functionality.

		// this kind of also goes back to using advantage,
		// when we return the array, we kind of want to have the end result be an array 
		// added to all other values.  

		// so the solving is all just editing the equation in-place. 
		// we could handle the array concept by letting advantage integrate the array in
		// then running a secondary operation that seeds the array back into the equation 
		// that's going to be really arcane and complex though
		
		// if we had an intermediate object that the operations modify instead of just the string
		// we would have a lot more control, 
		// but we would have to make sure we could meaningfully modify it, while the rest of the 
		// program is agnostic to those modifications.

	})()

	/*
	(()=>{
		let examples_func = ()=>{
			let returnValue = 'Valid die rolls: \n1d6 : roll one six-sided die\n'+
			'd6 : roll one six-sided die\nd10 : ten sided die\n'+
			'2d4 : roll two dice\nd20+4: add to roll\n2d6-2: subtract from roll\n'+
			'd20+2d6: add die rolls\n2xd20: roll twice, keep rolls separate\n';
			return returnValue;
		}
		let examples = new lovesyou_DiceRoller.Command('examples', examples_func, 'Displays sample dice input');
		lovesyou_DiceRoller.Commands.Add('examples', examples);
	})();

	// averages can be put into a 'util' module along with anything else we might want to add.
	(()=>{
		let averages_func = ()=>{
			let returnValue = ''
			for(let facet in lovesyou_DiceRoller.rolls){
				let sum = 0;
				let arr = lovesyou_DiceRoller.rolls[facet];
				for(let i = 0; i <arr.length;i++){sum+=arr[i];}
				let avg = (arr.length>0) ? sum/arr.length : 0;
				avg = Math.floor(avg*100)/100;
				if(avg > 0){
					returnValue += 'Average roll for d' + facet + 
					' is ' + avg + ' across ' + arr.length + ' rolls.\n'; }
			}
			return returnValue;	
					
		}
		let averages = new lovesyou_DiceRoller.Command('averages', averages_func, 'Shows averages rolls by die');
		lovesyou_DiceRoller.Commands.Add('averages', averages);
	})();

	*/

/*

	lovesyou_DiceRoller.prototype.toString = function(){
		return JSON.stringify(this);
	}*/