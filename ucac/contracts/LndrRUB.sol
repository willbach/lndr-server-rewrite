pragma solidity ^0.4.15;

contract LndrRUB {
    uint constant decimals = 2;

    function allowTransaction(address, address, uint256) public  returns (bool) {
        return true;
    }
}
