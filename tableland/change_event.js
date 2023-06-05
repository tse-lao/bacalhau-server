const ethers = require('ethers');
async function changeEvent(requestID, jobID){
    
    //change the event in tableland
    
    //connect to tableland and find the right this to add. 
    let provider = new ethers.JsonRpcProvider(process.env.URL)
    let wallet = new ethers.Wallet(process.env.WALLET, provider)
    let contract = new Contract(process.env.JOBS_CONTRACT, JobsAbi, wallet);
    
    //use the following function
    const tx = await contract.ExecutionStarted(
        requestID,
        jobID
      )

      console.log(tx);
      
      const result = await tx.wait();
      return result;
    //get the job id from the event.
      
    
}

module.exports = { changeEvent }