pragma solidity ^0.4.15;

contract LndrKRW {
    function allowTransaction(address, address, uint256) public  returns (bool) {
        return true;
    }
}
