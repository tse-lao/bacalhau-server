###All different functions and inputs in the jobs contract. 

Events
ExecutionPaid(address, uint256)
RoleAdminChanged(role: bytes32, previousAdminRole: bytes32, newAdminRole: bytes32);
RoleGranted(role:bytes32, account:address, sender: address)


##functions
createJOB ("name": string, "description": string, dataFormat: string, startCommand: string, endCommand: string, numbersOfInput: uint256)
executeJOB(jobID: uint256, inputs: string[])
getRoleAdim(role: bytes32) => bytes32 
grantRole(role: byte32, account:address) => []
hasRole(role: bytes32, account:address) => bool
jobExecuted(string) => boolean
jobExist(uint256) => bool
renounceOwnership([]) => []
renounceRole(role: bytes32, account:address) => 
