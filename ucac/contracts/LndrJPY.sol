pragma solidity ^0.4.15;

contract LndrJPY {
    function allowTransaction(address, address, uint256) public  returns (bool) {
        return true;
    }
}
