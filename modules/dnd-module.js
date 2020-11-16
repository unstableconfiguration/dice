import { DiceOperation } from '../dice-operation.js'

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
				getOperands : (match)=>[/^\d+/.exec(match)[0], /\d+$/.exec(match)[0]]
			}
		)
	]
}


