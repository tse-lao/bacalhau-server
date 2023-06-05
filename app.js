const express = require('express');
const { exec, spawn } = require('child_process');
const app = express();
const cors = require('cors');
const port = 5001;
const ethers = require('ethers');
const { Contract } = require('ethers');
const JobsAbi = require('./contracts/abi/Jobs.abi.json');
require("dotenv").config();
const { runBacalhau } = require('./bacalhau/run.js');
const { findJob } = require('./bacalhau/findJob');
const { changeEvent } = require('./tableland/change_event.js');

app.use(cors());  // Enable CORS

app.get('/bacalhau-run', (req, res) => {
    let userInput = req.query.command;
    userInput = userInput.replace(/ /g, ' ');
    let args = userInput.split(' ');


    const cmd = spawn('command', args);

    cmd.stdout.on('data', (data) => {
        res.write(data);
        //TODO: check if line says: bacalhau describe ..... red the last value from it. 
        if (data.toString().includes("bacalhau describe")) {
            let job_id = data.toString().split(" ")[8]
            console.info(job_id)
            console.log("job_id: " + job_id);
            //call a function to update the contract. 

        }// Send chunks of data as they are received
    });

    cmd.stderr.on('data', (data) => {
        res.write(data);  // Send error data if any            
    });

    cmd.on('close', (code) => {
        if (code !== 0) {
            res.status(500).end(`Failed to execute script with exit code ${code}`);
        } else {

            res.end();
        }
    });

    cmd.on('error', (error) => {
        console.error(`spawn error: ${error}`);
        res.status(500).end('Failed to execute script');
    });
});

app.get('/startJob', async (req, res) => {
    //TODO: background running job.... 
    let provider = new ethers.JsonRpcProvider(process.env.URL)

    let contract = new Contract(process.env.JOBS_CONTRACT, JobsAbi, provider)

    const eventListener = async (blockNumber) => {
        // This line of code listens to the block mining and every time a block is mined, it will return blocknumber.
        const transferEvent = await contract.queryFilter(
            //Simply used the queryfilter to listen to the transfer event everytime a block is mined.
            "newJobRequest",
            blockNumber - 1,
            blockNumber
        );
        console.log(transferEvent);

        if (transferEvent.length > 0) {
            // If a "newJobRequest" event has been emitted in the last block, resolve the promise and remove the listener.
            provider.off('block', eventListener);
            // Call your function here when an event has been emitted

            const values = transferEvent[0]

            console.log(values.args[1])
            console.log(values.args[2])

            const result = await runBacalhau(`bacalhau docker run ${values.args[1]} ${values.args[2]}`);
            console.log(result.message);
            const jobId = findJob(result.message);

            await changeEvent(values.args[0], jobId);
            return res.json(jobId);


        }
    };

    provider.on('block', eventListener);

})
//person put int he contract. 


app.get('/bacalhau', async (req, res) => {
    //user can input his job-id and the computation. 
    //testing to see if the bacalhau job is running and returning a jobId. 
    
    const result = await runBacalhau(`bacalhau docker run ubuntu echo Hello World`);
    const jobId = findJob(result.message);
    return res.json(jobId);
})


app.get('/describe-script', (req, res) => {
    //TODO: checking iwe can call this upon request and put it in tablelan.d 
    exec(`bacalhau describe 86cdfeda-353d-4624-af97-98af3d864d1a`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).json({ error: 'Failed to execute script' });
        }
        return res.json({ message: stdout });
    });

});

app.get('/get-job', (req, res) => {
    exec(`bacalhau get 2aba5b53-60fa-4d73-8539-3b4478059baa`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).json({ error: 'Failed to execute script' });
        }
        return res.json({ message: stdout });
    });
});


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});