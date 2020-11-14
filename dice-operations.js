
export let DiceOperations = function(parent){
    let ops = this;
    ops.order = [];
    ops.insert = function(index, operation){
        operation.parent = parent
        ops.order.splice(index, 0, operation.name);
        ops[operation.name] = operation;
    }
    ops.add = function(operations){
        if(!Array.isArray(operations)) operations = [operations];
        operations.forEach(operation=>ops.insert(ops.order.length, operation));
    }
}