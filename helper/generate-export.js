/*
 * @Autor: theajack
 * @Date: 2021-04-17 12:43:26
 * @LastEditors: theajack
 * @LastEditTime: 2021-04-17 16:17:46
 * @Description: Coding something
 */

const fs = require('fs');
const path = require('path');

const cwd = process.cwd();
const root = `${cwd}/src/lib`;

const files = fs.readdirSync(root);

const config = {
    'tcUtil': {
        'file': 'cross-window-message.min',
        'path': 'src/index.ts'
    }
};
    
for (let i = 0; i < files.length; i++) {
    const name = files[i];
    const nameNoTail = name.substr(0, name.indexOf('.ts'));
    const filePathName = `${root}/${name}`;
    const data = fs.statSync(path.join(filePathName));
    if (data.isFile()) {
        config[`tc${upperCaseFirst(nameNoTail)}`] = {
            file: nameNoTail,
            path: `src/lib/__export__/__${nameNoTail}__.ts`
        };
        fs.writeFileSync(`${root}/__export__/__${nameNoTail}__.ts`, `import * as _ from '../${nameNoTail}';
export * from '../${nameNoTail}';
export default _;`, 'utf8');

        fs.writeFileSync(`${cwd}/src/type/${nameNoTail}.d.ts`, `import * as _ from './${nameNoTail}.base';
export * from './${nameNoTail}.base';
export default _;`, 'utf8');
    }
}

fs.writeFileSync(`${cwd}/webpack-config/_build_config.json`, JSON.stringify(config, null, 4), 'utf8');

function upperCaseFirst (str) {
    return str[0].toUpperCase() + str.substr(1);
}