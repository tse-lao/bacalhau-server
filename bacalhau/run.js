const util = require('util');
const exec = util.promisify(require('child_process').exec);


async function runBacalhau(command) {
    console.log(command);

    try {
        const { stdout, stderr } = await exec(command);
        console.log(stdout);
        return { message: stdout };
    } catch (error) {
        console.error(`exec error: ${error}`);
        return { error: 'Failed to execute script' };
    }
}


module.exports = { runBacalhau }