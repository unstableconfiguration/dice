import del from 'rollup-plugin-delete';
import { babel } from '@rollup/plugin-babel';

export default [{
        input: 'src/index.js',
        output: {
            file: 'dist/dice.js',
            format: 'es'
        },
        plugins : [
            del({ targets: 'dist/*' }),
            babel({ babelHelpers: 'bundled' })
        ]
    },
    {
        input: 'tests/tests.js',
        output : {
            file : 'dist/tests.js',        
            format : 'es'
        },
        plugins : [
            babel({ babelHelpers: 'bundled' })
        ]
    }
];