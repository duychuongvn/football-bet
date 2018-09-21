pragma solidity ^0.4.8;

import "btherDB.sol";
import "safeMath.sol";
import "sharedLibrary.sol";

library UserLibrary {

    //    status:
    //    1: active, 2: blocked

    function getUserCount(address db) internal returns(uint) {
        return BetherDB(db).getUIntValue(sha3("user/count"));
    }

    function userExists(address db, address userId) internal returns(bool) {
        return getStatus(db, userId) > 0;
    }

    function getAllUsers(address db) internal returns(address[]) {
        return SharedLibrary.getAddressArray(db, "user/ids", "user/count");
    }

    function setUser(
        address db,
        address userId,
        string name,
        string email,
        bytes32 gravatar
    )
        internal
    {
        require(country != 0);

        if (!userExists(db, userId)) {
            BetherDB(db).setUIntValue(sha3("user/created-on", userId), now);
            BetherDB(db).setUInt8Value(sha3("user/status", userId), 1);
            SharedLibrary.addArrayItem(db, "user/ids", "user/count", userId);
        }

        BetherDB(db).setStringValue(sha3("user/name", userId), name);
        BetherDB(db).setStringValue(sha3("user/email", userId), email);
        BetherDB(db).setBytes32Value(sha3("user/gravatar", userId), gravatar);
    }



    function setStatus(address db, address userId, uint8 status) internal {
        BetherDB(db).setUInt8Value(sha3("user/status", userId), status);
    }


    function addReceivedMessage(address db, address userId, uint messageId) internal {
        SharedLibrary.addIdArrayItem(db, userId, "user/received-messages", "user/received-messages-count", messageId);
    }

    function addSentMessage(address db, address userId, uint messageId) internal {
        SharedLibrary.addIdArrayItem(db, userId, "user/sent-messages", "user/sent-messages-count", messageId);
    }

    function isActiveEmployer(address db, address userId) internal returns(bool) {
        return BetherDB(db).getBooleanValue(sha3("user/employer?", userId)) &&
               hasStatus(db, userId, 1);
    }

    function isActiveFreelancer(address db, address userId) internal returns(bool) {
        return BetherDB(db).getBooleanValue(sha3("user/freelancer?", userId)) &&
               hasStatus(db, userId, 1);
    }

    function hasStatus(address db, address userId, uint8 status) internal returns(bool) {
        return status == BetherDB(db).getUInt8Value(sha3("user/status", userId));
    }

    function getStatus(address db, address userId) internal returns(uint8) {
        return BetherDB(db).getUInt8Value(sha3("user/status", userId));
    }


    function addToAvgRating(address db, address userId, string countKey, string key, uint8 rating) internal {
        var ratingsCount = BetherDB(db).getUIntValue(sha3(countKey, userId));
        var currentAvgRating = BetherDB(db).getUInt8Value(sha3(key, userId));
        var newRatingsCount = SafeMath.safeAdd(ratingsCount, 1);
        uint newAvgRating;
        if (ratingsCount == 0) {
            newAvgRating = rating;
        } else {
            var newTotalRating = SafeMath.safeAdd(SafeMath.safeMul(currentAvgRating, ratingsCount), rating);
            newAvgRating = newTotalRating / newRatingsCount;
        }
        BetherDB(db).setUIntValue(sha3(countKey, userId), newRatingsCount);
        BetherDB(db).setUInt8Value(sha3(key, userId), uint8(newAvgRating));
    }


    function hasMinRating(address db, address userId, uint8 minAvgRating) internal returns(bool) {
        if (minAvgRating == 0) {
            return true;
        }
        return minAvgRating <= BetherDB(db).getUInt8Value(sha3("freelancer/avg-rating", userId));
    }
}

