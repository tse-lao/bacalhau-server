const ethers = require('ethers');
const JobsAbi = require('../contracts/abi/Jobs.abi.json');

async function changeEvent(requestID, jobID){
    
    //change the event in tableland
    
    //connect to tableland and find the right this to add. 
    let provider = new ethers.JsonRpcProvider(process.env.URL)
    let wallet = new ethers.Wallet(process.env.WALLET, provider)
    let contract = new ethers.Contract(process.env.JOBS_CONTRACT, JobsAbi, wallet);
    
    //use the following function
    
    try {
      const result = await contract.ExecutionStarted(
        requestID,
        jobID
      )
      
      console.log(result);
      return true;
    }catch(e){
      console.log(e)
    }
    
      
    
}

module.exports = { changeEvent }