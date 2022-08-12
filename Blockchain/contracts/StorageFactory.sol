// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SimpleStorage.sol";

contract StorageFactory { // to create simple storage contracts using multiple files
    SimpleStorage[] public simpleStorageArray; // it will hold objects/addresses of the simple storage objects

    function createSimpleStorageContract() public {
        SimpleStorage simpleStorage = new SimpleStorage(); // create new simple storage object
        simpleStorageArray.push(simpleStorage); // push object to the array
    }

    function sfStore(uint256 _simpleStorageIndex, uint256 _simpleStorageNumber) public { // storage factory store
        // to interact with a contract, we need: address and ABI(Application Binary Interface)
        SimpleStorage simpleStorage = simpleStorageArray[_simpleStorageIndex]; // simpleStorage will have the object from the array using the index
        simpleStorage.store(_simpleStorageNumber);
    }

    function sfGet(uint256 _simpleStorageIndex) public view returns(uint256) {
        SimpleStorage simpleStorage = simpleStorageArray[_simpleStorageIndex];
        return simpleStorage.retrieve();
    }
}