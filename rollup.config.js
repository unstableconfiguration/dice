import del from 'rollup-plugin-delete';
import babel from '@rollup/plugin-babel';
import copy from 'rollup-plugin-copy'

export default [{
        input: 'src/index.js',
        output: {
            file: 'dist/dice.js',
            format: 'es'
        },
        plugins : [
            del({ targets: 'dist/*' }),
            babel({ babelHelpers: 'bundled' }),
            copy({
                targets : [
                    { src : 'dist/dice.js', dest: 'gh-pages/scripts' }
                ]
            })
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