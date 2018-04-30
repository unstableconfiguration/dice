
let dnd_functions = [
    // Matches pattern like 2xd20 where the x differentiates it from a normal roll. 
    // Rolls n times but keeps the rolls separated rather than adding them together. 
    new DiceRoller.prototype.Operation(
        'Advantage', {
			search : /\d+xd\d+/,
			call : function(repetitions, facets){
				let operation = this;
				let results = Array(+repetitions).fill('d'+facets)
					.map(x=>+operation.parent.solve(x));
				return JSON.stringify(results.sort((x,y)=>+x<+y));
			},
			parse : (match)=>[/^\d+/.exec(match)[0], /\d+$/.exec(match)[0]]
		}
    )
]

