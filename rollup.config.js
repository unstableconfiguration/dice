import del from 'rollup-plugin-delete';
import babel from '@rollup/plugin-babel';

export default [{
        input: 'index.js',
        output : [
            { 
                file : 'dist/dice.js',
                format : 'es'
            }
        ],
        plugins : [
            del({ targets: 'dist/*' }),
            babel({ babelHelpers: 'bundled' })
        ]
    }
];