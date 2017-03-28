	
    
    (()=>{
		// Seeks patterns like 2xd20 where 2x specifies roll the d20 twice and put 
		// the results into an array [] rather than add them together.
		let repeater = new lovesyou_DiceRoller.Operation(/[\d]{1,}[x][\d]{0,}[d][\d]{1,}/g);
		// Gets the repeat count (nx) and the dice pattern to repeat
		repeater.getTerms = (match) => {
			let terms = match.split('x');
			terms[0] = parseInt(terms[0]);
			return terms;
		}
		// Fills an array with the results of separate dice rolls. 
		repeater.expression = (repeatcount,diceexpression) => {
			let arr = [];
			for(let i = 0; i < repeatcount; i++){
				let resolve = lovesyou_DiceRoller.solve(diceexpression);
				arr.push(parseInt(resolve));
			}
			arr = arr.sort((x,y)=>x<y);
			return '['+arr+']';
		}
		// Add before dice...
		lovesyou_DiceRoller.Operations['Repeat'] = repeater;
		lovesyou_DiceRoller.Operations.order.unshift('Repeat');
	})();
