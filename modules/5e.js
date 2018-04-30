
'use strict';
let dnd_functions = [
    // Matches pattern like 2xd20 where the x differentiates it from a normal roll. 
    // Rolls n times but keeps the rolls separated rather than adding them together. 
    new DiceRoller.prototype.Operation(
        'Advantage',
        /\d+xd\d+/,
        function(repetitions, facets){
            let operation = this;
            let results = Array(+repetitions).fill('d'+facets)
                .map(x=>+operation.parent.solve(x));
            return JSON.stringify(results.sort((x,y)=>+x<+y));
        },
        (match)=>[/^\d+/.exec(match)[0], /\d+$/.exec(match)[0]] 
    )
]






/* D&D 5e module 
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

	})()*/