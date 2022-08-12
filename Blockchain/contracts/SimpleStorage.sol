// NOTE: Every time we change something on-chain,
// including making a new contract or even updating it,
// it happens in a transaction, which means it includes fees and everything

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8; // solidity version 0.8.8 and above

// address of SimpleStorage smart contract after deploying:-
// 0xd9145CCE52D386f254917e481eB44e9943F39138
contract SimpleStorage {
    // similar to class in JS/CPP

    // basic data types - boolean, uint(uint8(8 bits),..,uint256), int, address(20byte), bytes, string
    bool hasFavouriteNumber = false;
    uint256 favouriteNumber1 = 123; // uint256(default), int256(default)
    int256 favouriteNumber2 = -23;
    string favouriteWord = "five";
    address myAddress = 0x02843296B05F6a6E01E8315ff3F5f32EfDf46bA5;
    bytes32 myBytes = "cat"; // cat gets converted to bytes

    // uint favouriteNumber; -> automatically initialized to 0
    uint256 public favouriteNumber;

    // visibility
    // |_ public - visible externally & internally (implicitly get assigned a function that returns its value)
    // |_ private
    // |_ external - only visible externally(outside contract)(only for functions), can only be called via this.function
    // |_ internal  (default)
    // function <name>() <visibility> returns (bool) {}

    // running this function will spend gas
    function store(uint256 _favouriteNumber) public {
        favouriteNumber = _favouriteNumber;
    }

    // view(allows reading, disallow modification of state)  and pure functions (disallows both reading and modification)
    // , when called alone, don't spend gas
    function retrieve() public view returns (uint256) {
        return favouriteNumber;
    }

    function add() public pure returns (uint256) {
        return (1 + 2);
    }

    // struct
    struct People {
        uint256 favouriteNumber;
        string name;
    }
    People public person = People({favouriteNumber: 6, name: "Aniket"});
    People[] public people; // dynamic array(since size not given inside []) of objects of the struct

    // EVM(Ethereum Virtual Machine) can access and store information in 6 places:
    // 1. stack
    // 2. memory
    // 3. storage
    // 4. calldata
    // 5. code
    // 6. logs

    // mapping
    // all strings are mapped to 0 by default here
    mapping(string => uint256) public nameToFavouriteNumber;

    // calldata, memory => variable will exist temporarily
    // storage => variable exists even outside the function executing (eg. favouriteWord, etc..)
    function addPerson(string memory _name, uint256 _favouriteNumber) public {
        // _name will exist temporarily only when this function is called in the transaction
        // uint256 automatically goes into memory
        // we need to specify only for array (including string), struct, mapping types
        // we can modify _name="cat" if we use memory but can't modify if we use calldata

        // people.push(People(_favouriteNumber, _name));
        People memory newPerson = People(_favouriteNumber, _name);
        people.push(newPerson);

        // adding to map as well
        nameToFavouriteNumber[_name] = _favouriteNumber;
    }
}
