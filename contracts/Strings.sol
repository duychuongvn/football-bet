pragma solidity ^0.4.21;
pragma experimental ABIEncoderV2;


contract Strings {


//    function copyBytes(bytes dest, bytes source, uint posdes, uint posSource, uint length) public {
//
//        for (uint i = posSource; i < posSource + length; i++) {
//            dest[posdes++] = source[i];
//        }
//    }
//
//    function join(string[] data, string delimiter) public returns (string) {
//
//        bytes memory delimiterBytes = bytes(delimiter);
//        uint length = delimiterBytes.length * (data.length - 1);
//        uint i;
//        for (i = 0; i < data.length; i++) {
//            length += (bytes(data[i])).length;
//        }
//
//        string memory tmp = new string(length);
//        bytes memory joinstr = bytes(tmp);
//        uint j;
//        uint k;
//        uint joinIndex = 0;
//        bytes memory itemt = bytes(data[0]);
//        copyBytes(joinstr, itemt, 0, 0, itemt.length);
//        joinIndex += itemt.length;
//
//
//        for (j = 1; j < data.length; j++) {
//            copyBytes(joinstr, delimiterBytes, joinIndex, 0, delimiterBytes.length);
//            joinIndex += delimiterBytes.length;
//            bytes memory dataItem = bytes(data[j]);
//            copyBytes(joinstr, dataItem, joinIndex, 0, dataItem.length);
//            joinIndex += dataItem.length;
//        }
//
//
//        return string(joinstr);
//    }

}
