pragma solidity ^0.4.23;

import "ownable.sol";

contract Mortal is Ownable {
    function kill() {
        if (msg.sender == owner)
            selfdestruct(owner);
    }
}
