pragma solidity ^0.4.8;

import "betherDB.sol";
import "sharedLibrary.sol";
import "userLibrary.sol";

library MessageLibrary {

    function addMessage(
        address db,
        address senderId,
        address receiverId,
        string text
    )
        internal returns (uint messageId)
    {
        require(senderId != receiverId);
        require(receiverId != 0x0);
        require(senderId != 0x0);

        messageId = SharedLibrary.createNext(db, "message/count");

        BetherDB(db).setStringValue(sha3("message/text", messageId), text);
        BetherDB(db).setUIntValue(sha3("message/created-on", messageId), now);
        BetherDB(db).setAddressValue(sha3("message/receiver", messageId), receiverId);
        BetherDB(db).setAddressValue(sha3("message/sender", messageId), senderId);
        UserLibrary.addReceivedMessage(db, receiverId, messageId);
        UserLibrary.addSentMessage(db, senderId, messageId);

        return messageId;
    }
}
