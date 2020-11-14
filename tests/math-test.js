
// 3*(6+3^2) is returning 35 for some reason. 

describe('Math suite tests', function() {
    let assert = chai.assert;
    let math = math_functions;
    
    describe('Addition and subtraction', function() {
        let addsub = math_functions.find(x=>x.name=='AddSubtract');
        describe('Searching', function(){
            let search_tests = [
                { input : '1+2', output : '1+2', note : `should match 1+2` },
                { input : '1+', output : null, note : `should not match '1+'` },
                { input : '+2', output : null, note : `should not match +2` },
                { input : '1-2', output : '1-2', note : `should match 1-2` },
                { input : '1-', output : null, note : `should not match 1-` },
                { input : '-2', output : null, note : `should not match -2` },
                { input : '-2-3', output : '-2-3', note : `should match -2-3` },
                { input : '-3+4', output : '-3+4', note : `should match -3+4` },
                { input : '5*4', output : null, note : `should not match 5*4` },
                { input : '3d4', output : null, note : `should not match 3d4` },
                { input : '9-8+7+6', output : '9-8', note : `should match the first set` },
                //{ input : '', output : '', note : `` },

            ];
            search_tests.forEach(test=>{
                it(test.note, function(){
                    assert.isTrue(test.output == addsub.search(test.input));
                })
            })
        });
        describe('Parsing', function() {
            let parse_tests = [
                { input : '1+2', output : ['1', '2', '+'], note : `parses 1+2 into  [1, 2, +]` },
                { input : '2-3', output : ['2', '-3', '+'], note : `parses 2-3 into [2, -3, +]` },
                { input : '-3+4', output : ['-3', '4', '+'], note : `parses -3+4 into [-3, 4, +]` },
                //{ input : '', output : '', note : `` },
            ];
            parse_tests.forEach(test=>{
                it(test.note, function(){
                    assert.isTrue(JSON.stringify(test.output) == JSON.stringify(addsub.parse(test.input)));
                })
            })
        });
        describe('Solving', function(){
            let solve_tests = [
                { input : '1+2', output : '3', note : `added 1 and 2` },
                { input : '2-3', output : '-1', note : `subtracted 3 from 2` },
                { input : '-4-4', output : '-8', note : `subtacted 4 from -4` },
                { input : '-5+6', output : '1', note : `added 6 to -5` },
                { input : '6+7-8', output : '5', note : `added 6+7 then subtacted 8` },
                //{ input : '', output : '', note : `` },
            ]
            solve_tests.forEach(test=>{
                it(test.note, function(){
                    assert.isTrue(test.output == addsub.call(test.input));
                })
            })
        });
    });

    describe('Multiplication and Division', function() {
        let md = math_functions.find(x=>x.name=='MultiplyDivide');
        describe('Searching', function(){
            let search_tests = [
                { input : '1*2', output : '1*2', note : `should match 1*2` },
                { input : '1*', output : null, note : `should not match '1*'` },
                { input : '*2', output : null, note : `should not match *2` },
                { input : '1/2', output : '1/2', note : `should match 1/2` },
                { input : '1/', output : null, note : `should not match 1/` },
                { input : '/2', output : null, note : `should not match /2` },
                { input : '-2/-3', output : '-2/-3', note : `should match -2/-3` },
                { input : '-3*4', output : '-3*4', note : `should match -3*4` },
                { input : '5+4', output : null, note : `should not match 5+4` },
                { input : '3d4', output : null, note : `should not match 3d4` },
                { input : '9*8/7+6', output : '9*8', note : `should match the first set` },
                //{ input : '', output : '', note : `` },
            ];
            search_tests.forEach(test=>{
                it(test.note, function(){
                    //console.log(test.input, test.output, md.search(test.input));
                    assert.isTrue(test.output == md.search(test.input));
                })
            })
        });
        describe('Parsing', function() {
            let parse_tests = [
                { input : '1*2', output : ['1', '2', '*'], note : `parses 1*2 into  [1, 2, *]` },
                { input : '2/3', output : ['2', '3', '/'], note : `parses 2-3 into [2, 3, /]` },
                { input : '-3*4', output : ['-3', '4', '*'], note : `parses -3*4 into [-3, 4, *]` },
                //{ input : '', output : '', note : `` },
            ];
            parse_tests.forEach(test=>{
                it(test.note, function(){
                    //console.log(test.input, test.output, md.parse(test.input));
                    assert.isTrue(JSON.stringify(test.output) == JSON.stringify(md.parse(test.input)));
                })
            })
        });
        describe('Solving', function(){
            let solve_tests = [
                { input : '1*2', output : '2', note : `multiplied 1 and 2` },
                { input : '4/2', output : '2', note : `divided 4 by 2` },
                { input : '-4*4', output : '-16', note : `multiplied 4 and -4` },
                { input : '5*6/5', output : '6', note : `multiplied 5 and 6 then divided by 5` },
                { input : '1/2*3', output : '1.5', note : `divided 1 by 2 then multiplied by 3` },
                //{ input : '', output : '', note : `` },
            ]
            solve_tests.forEach(test=>{
                it(test.note, function(){
                    //console.log(test.input, test.output, md.call(test.input));
                    assert.isTrue(test.output == md.call(test.input));
                })
            })
        });
    });
    
    describe('Exponents', function() {
        let exp = math_functions.find(x=>x.name=='Exponents');
        describe('Searching', function(){
            let search_tests = [
                { input : '1^2', output : '1^2', note : `should match 1^2` },
                { input : '2^', output : null, note : `should not match '2^'` },
                { input : '^3', output : null, note : `should not match ^3` },
                { input : '-2^-3', output : '-2^-3', note : `should match -2^-3` },
                { input : '-3^4', output : '-3^4', note : `should match -3^4` },
                { input : '5+4', output : null, note : `should not match 5+4` },
                { input : '3d4', output : null, note : `should not match 3d4` },
                { input : '9*4^2-3^2', output : '4^2', note : `should match the first set` },
                //{ input : '', output : '', note : `` },
            ];
            search_tests.forEach(test=>{
                it(test.note, function(){
                    //console.log(test.input, test.output, md.search(test.input));
                    assert.isTrue(test.output == exp.search(test.input));
                })
            })
        });
        describe('Parsing', function() {
            let parse_tests = [
                { input : '1^2', output : ['1', '2', '^'], note : `parses 1^2 into  [1, 2, ^]` },
                { input : '-3^4', output : ['-3', '4', '^'], note : `parses -3*4 into [-3, 4, ^]` },
                //{ input : '', output : '', note : `` },
            ];
            parse_tests.forEach(test=>{
                it(test.note, function(){
                    //console.log(test.input, test.output, md.parse(test.input));
                    assert.isTrue(JSON.stringify(test.output) == JSON.stringify(exp.parse(test.input)));
                })
            })
        });
        describe('Solving', function(){
            let solve_tests = [
                { input : '1^2', output : '1', note : `squared 1` },
                { input : '2^3', output : '8', note : `cubed 2` },
                { input : '4^1', output : '4', note : `4^1` },
                { input : '-2^3', output : '-8', note : `cubed -2` },
                { input : '2^2^2', output : '16', note : `squared 2-squared` },
                //{ input : '', output : '', note : `` },
            ]
            solve_tests.forEach(test=>{
                it(test.note, function(){
                    //console.log(test.input, test.output, md.call(test.input));
                    assert.isTrue(test.output == exp.call(test.input));
                })
            })
        });
    });

    describe('Parentheses', function() {
        let parens = math_functions.find(x=>x.name=='Parentheses');
        describe('Searching', function(){
            let search_tests = [
                { input : '(1)', output : '(1)', note : `should match (1)` },
                { input : '(', output : null, note : `should not match (` },
                { input : ')', output : null, note : `should not match )` },
                { input : '()', output : null, note : `should not match ()` },
                { input : '(9+4)*(3-2)', output : '(9+4)', note : `should match the first set` },
                //{ input : '', output : '', note : `` },
            ];
            search_tests.forEach(test=>{
                it(test.note, function(){
                    //console.log(test.input, test.output, parens.search(test.input));
                    assert.isTrue(test.output == parens.search(test.input));
                })
            })
        });
        describe('Parsing', function() {
            let parse_tests = [
                { input : '(1+2)', output : ['1+2'], note : `parses (1+2) into  [1+2]` },
                { input : '(-3/4)', output : ['-3/4'], note : `parses (-3/4) into [-3/4]` },
                //{ input : '', output : '', note : `` },
            ];
            parse_tests.forEach(test=>{
                it(test.note, function(){
                    //console.log(test.input, test.output, parens.parse(test.input));
                    assert.isTrue(JSON.stringify(test.output) == JSON.stringify(parens.parse(test.input)));
                })
            })
        });
    });
});
