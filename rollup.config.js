import del from 'rollup-plugin-delete';
import babel from '@rollup/plugin-babel';

export default [{
        input: 'src/index.js',
        output : [
            { 
                file : 'dist/dice.js',
                format : 'es'
            },
            { 
                file : 'gh-pages/scripts/dice.js',
                format : 'es'
            }
        ],
        plugins : [
            del({ targets: 'dist/*' }),
            babel({ babelHelpers: 'bundled' })
        ]
    },
    {
        input: 'tests/tests.js',
        output : {
            file : 'gh-pages/tests/dice-tests.js',        
            format : 'es'
        },
        plugins : [
            babel({ babelHelpers: 'bundled' })
        ]
    }
];