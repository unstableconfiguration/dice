
// to log things. 

let LoggingRoller = function(){
    DiceRoller.call(this);
    let roller = this;

    let solve = roller.solve;
    roller.solve = function(input){
        roller._wrap_operations();
        let output = solve(input);
        roller.log.log_solution(input, output);
        return output;
    }

    let rand = roller.rand;
    roller.rand = function(input){
        let output = rand(input);
        roller.log.log_roll(input, output);
        return output;
    }

    roller.log = new LoggingRoller.prototype.Log(roller);

    let wrappable_operations = function(){
        return roller.operations.order.map(opname=>{
            return roller.operations[opname];
        }).filter(op=>{ 
            return op.call && !op.wrapped; 
        });
    }

    roller._wrap_operations = function(){
        wrappable_operations().forEach(op=>{
            let call = op.call;
            op.call = function(input){
                let output = call(input);
                roller.log.log_operation(op, input, output);
                return output;
            }
            if(op.name == 'Dice') wrap_dice_roll(op);
            op.wrapped = true;
        });
    }
    let wrap_dice_roll = function(op){
        let _call = op._call;
        op._call = function(rolls, facets){
            let output = _call(rolls, facets);
            roller.log.log_dice(rolls+'d'+facets, output);
            return output;
        }
    }
    // we also need to wrap the _call of the op when it is dice 

}




LoggingRoller.prototype.Log =  function(){
    let log = this;
    log.solutions = [];
    // Logs the outcome of .solve
    // Logs each operation that modified the input
    log.log_solution = function(input, output){
        log.solutions.push({
            input : input,
            output : output,
            operations : log._operations.splice(0)
                .filter(op=>op.input !== op.output)
        })
    }
    // Logs the outcome of each operation.
    // If dice were rolled, their rolls are logged.
    log._operations = [];
    log.log_operation = function(operation, input, output){
        log._operations.push({
            name : operation.name,
            input : input,
            output : output,
            dice : log._dice.splice(0)
        });
        if(log._operations.slice(-1)[0].dice.length===0)delete log._operations.slice(-1)[0].dice;
    }
    // Logs the outcome of a set of dice rolls (i.e. 3d6)
    // Includes all the individual die rolls
    log._dice = [];
    log.log_dice = function(input, output){
        log._dice.push({ 
            input : input, 
            output : output,
            rolls : log._rolls.splice(0)
        })
    }
    // Logs the outcome of each die roll 
    log._rolls = [];
    log.log_roll = function(facets, outcome){
        log._rolls.push({ facets : facets, output : outcome });
    }    
}




