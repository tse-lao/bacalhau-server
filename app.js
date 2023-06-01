const express = require('express');
const { exec, spawn } = require('child_process');
const app = express();
const cors = require('cors');
const port = 5001;
app.use(cors());  // Enable CORS

app.get('/bacalhau-run', (req, res) => {

        //execture the string programmatically. 
        //line to run: 
       // let test = "bacalhau docker run ubuntu echo Hello World"
        
        let userInput = req.query.command;
       userInput = userInput.replace(/ /g, ' ');
        let args = userInput.split(' ');    
       
       
        
        const cmd = spawn('command', args);

        cmd.stdout.on('data', (data) => {
            res.write(data);  // Send chunks of data as they are received
        });
    
        cmd.stderr.on('data', (data) => {
            res.write(data);  // Send error data if any
        });
    
        cmd.on('close', (code) => {
            if (code !== 0) {
                res.status(500).end(`Failed to execute script with exit code ${code}`);
            } else {
                res.end();  // End the response when the command is complete
            }
        });
    
        cmd.on('error', (error) => {
            console.error(`spawn error: ${error}`);
            res.status(500).end('Failed to execute script');
        });

});

app.get('/describe-script', (req, res) => {
    //TODO:check the job id from the res body.
    
    exec(`bacalhau describe 86cdfeda-353d-4624-af97-98af3d864d1a`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).json({ error: 'Failed to execute script' });
        }
        return res.json({ message: stdout });
    });
    
    //TODO: check fi ther esutls is finished and copy the ipfs:// link towards the tableland. 
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