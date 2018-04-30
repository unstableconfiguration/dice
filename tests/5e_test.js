
describe('5e dice extensions', function(){
    let roller = new DiceRoller();
    let assert = chai.assert;
    //roller.operations.add(math_functions);
    roller.operations.insert(0, dnd_functions.find(x=>x.name='Advantage'))
    window.roller = roller;

    describe('Advantage/Disadvantage', function() {
        let advantage = roller.operations['Advantage'];
        describe('Searching', function(){
            let search_tests = [
                { input : '2xd20', output : '2xd20', note : `matches 2xd20` },
                { input : 'xd10', output : null, note : `does not match xd10` },
                { input : '3xd', output : null, note : `does not match 3xd` },
                { input : '5+4xd6+3xd8', output : '4xd6', note : `matches first found` },
                //{ input : '', output : '', note : `` },
            ];
            search_tests.forEach(test=>{
                it(test.note, function(){
                    assert.isTrue(test.output == advantage._search(test.input));
                })
            });
        });
        describe('Parsing', function(){
            let parse_tests = [
                { input : '2xd20', output : ['2', '20'], note : `parses 2xd20 into [2, 20]` },
                { input : '8xd6', output : ['8','6'], note : `parses 8xd6 into [8, 6]` },
                //{ input : '', output : '', note : `` },
            ];
            parse_tests.forEach(test=>{
                it(test.note, function(){
                    //console.log(test.input, JSON.stringify(test.output), JSON.stringify(advantage._parse(test.input)));
                    assert.isTrue(JSON.stringify(test.output) == JSON.stringify(advantage._parse(test.input)));
                })
            })
        });
        describe('Solving', function(){
            roller.operations['Dice'].rand = (r)=>+r;
            let solve_tests = [
                { input : '2xd20', output : [20, 20], note : `2xd20 successfully created array of 20 rolled twice` },
                { input : '3xd4', output : [4,4,4], note : `3xd4 successfully created array of 4 rolled thrice` },
                //{ input : '', output : '', note : `` },  
            ];
            solve_tests.forEach(test=>{
                it(test.note, function(){
                    //console.log(test.input, test.output, advantage.call(test.input));
                    assert.isTrue(JSON.stringify(test.output) == advantage.call(test.input));
                })
            })
        });
    });
});