pragma solidity ^0.4.15;

contract LndrVND {
    uint constant decimals = 0;

    function allowTransaction(address, address, uint256) public  returns (bool) {
        return true;
    }
}
