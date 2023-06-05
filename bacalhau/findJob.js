function findJob(input) {
    //TODO: find the jobs from the input and return job_id 
    const jobIdRegex = /bacalhau describe (\w+-\w+-\w+-\w+-\w+)/;
    const match = input.toString().match(jobIdRegex);

    if (match) {
        const jobId = match[1];
        return jobId;
    }

}

module.exports = { findJob }