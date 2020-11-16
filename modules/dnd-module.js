import { DiceOperation } from '../dice-operation.js'

export let DnDModule = {
	apply : function(roller) { 
		let advantage = this.operations[0];
		advantage.parent = roller;
		roller.operations.unshift(advantage);
	},
	operations : [
		// Matches pattern like 2xd20 where the x differentiates it from a normal roll. 
		// Rolls n times but keeps the rolls separated rather than adding them together. 
		new DiceOperation({
				name : 'Advantage',
				search : /\d+xd\d+/,
				evaluate : function(repetitions, facets){
					let operation = this;
					let results = Array(+repetitions).fill('d'+facets)
						.map(x=>+operation.parent.solve(x));
					return JSON.stringify(results.sort((x,y)=>+x<+y));
				},
				getOperands : (match)=>[/^\d+/.exec(match)[0], /\d+$/.exec(match)[0]]
			}
		)
	]
}


