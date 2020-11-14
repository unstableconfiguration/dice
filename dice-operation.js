
export let DiceOperation = function(name, options = {}) {
    let op = this;
    op.name = name;

    op._search = options.search || '';
    op.search = function(input){
        if(typeof(op._search)==='function') return op._search(input);
        if(~['string', 'number'].indexOf(typeof(op._search)))
            op._search = new RegExp(''+op._search);
        if(op._search.exec) return(new RegExp(op._search).exec(input)||[null])[0];
    }

    op._parse = options.parse || function(match){ 
        return [
            (/^-?(\d*\.)?\d+/.exec(match)||[''])[0], // first number/operand 
            (/-?(\d*\.)?\d+$/.exec(match)||[''])[0], // second number/operand
            (/[^\d-\.]+/.exec(match)||['+'])[0] // non-numeric character set
        ];
    }
    op.parse = function(match) {
        return op._parse(match);
    } 

    op._call = options.call || '';
    op.call = function(input) {
        let get = null;
        while((get = op.search(input)) !== null){
            let params = op.parse(get);
            let result = op._call.apply(op, params);
            input = input.replace(get, result);
        }
        return input;
    }
}
