// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract BMS {

  // Medical Staffs/Patient will have to register themselves somehow on the contract
	function registerUser(address _user) {

		// registers user

	}

//2. Medical Staffs can upload or edit the medical data.
  function addMedicalData(string memory _name) public returns (bool) {
		// 1. Create a new Patient data and put in array
    // 2. Increment the ID by one
    // 3. Emit the appropriate event
    // 4. return true
	}

//3. Medical Staffs/Patient have to identify themselves in order to securely access to the medical data.
  function medicalData(uint sku) public {
  // 1. Add modifiers to check:
  //    - the person calling this function is the Staffs/Patient. 
	// 2. call the event associated with this function!
	// 3. Present the data to user if user is Staff
	// 4. Present the data to user if payment has been completed
	}

//4. Patient can authorize 3rd party access to securely access to the medical data.
function signMedicalData(){
  // 1. it should Create a SHA3 hash of the message
  // 2. Verify that the message's signer is the owner of the medical data
	// 3. Signs the messageHash with the Hospital account
  // 4. set the state to Signed. 
}

//5. Verify the authenticity of the medical record using digital signature that uniquely identifies the issuer of the record.
function verify() {
  // 1. it should recover signer address from a message by using their signature
  // 2. Recover signer from signature and hash
  // 3. Compare recovered signer to claimed signer
}

//6. Medical bills payment can be issued by the Medical Staffs and paid in cryptocurrency by the Patient.
  function Payment(uint sku) public payable {
  // 1. it should be payable in order to receive refunds
  // 2. this should transfer money to the Hospital, 
  // 3. set the payer as the person who called this transaction, 
  // 4. set the state to Paid. 
  // 5. this function should use 3 modifiers to check 
  //    - if the Bill is pending payment, 
  //    - if the payer paid enough, 
  //    - check the value after the function is called to make 
  //      sure the buyer is refunded any excess ether sent. 
  // 6. call the event associated with this function!
	}
}