(function (exports) {
    var BinaryProtocol = {};
    var protocol = com.webrtc.protocol;

    // to help node compatibility
    //TODO: change node buffer instead of browsers' Uint8Array
    if (typeof Uint8Array == 'function' && Uint8Array.prototype.subarray)
        Uint8Array.prototype.slice = Uint8Array.prototype.subarray;

    var base64 = com.webrtc.base64;

    //TLV: tag 1 byte length 4 bytes value X bytes
    var TAG_SIZE = 1;
    var LENGTH_SIZE = 4;

    //taken from http://stackoverflow.com/questions/6965107/converting-between-strings-and-arraybuffers
    function ab2str(uint8) {
        //use node.js native buffer manipulation if possible
        if (typeof(Buffer)=="function" && Buffer.isBuffer(uint8)) return uint8.toString('ucs2');
        return String.fromCharCode.apply(null, new Uint16Array(uint8.buffer.slice(uint8.byteOffset))).trim();
//        return String.fromCharCode.apply(null, uint8).trim();
    }

    function str2ab(str) {
        //use node.js native buffer manipulation if possible
        if (typeof(Buffer)=="function") return new Buffer(str,'ucs2');
        var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
        var bufView = new Uint16Array(buf);
        for (var i=0, strLen=str.length; i<strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
//        return buf;
        return new Uint8Array(buf);
    }

    var ab2ascii = function (buf) {
        return String.fromCharCode.apply(null, buf).trim();
    };

    var ascii2ab = function (str, padding) {
        var buf = new Uint8Array(str.length);
        for (var i = 0; i < str.length; i++) {
            buf[i] = str.charCodeAt(i);
        }

        if (padding) {
            for (var j = str.length; j < padding; j++) {
                buf[j] = ' ';
            }
        }
        return buf; // was return buf
    };

    var UInt8ArrayToInt32 = function (array, index) {
        if (!index) index = 0;
        var n = 0;
        n += array[index++] << 24;
        n += array[index++] << 16;
        n += array[index++] << 8;
        n += array[index];
        return n;
    };

    var UInt32ToUInt8Array = function (integers) {
        var index = 0;
        if (typeof(integers.length) != "number") {
            integers = Array.prototype.slice.call(arguments);
        }
        var array = new Uint8Array(integers.length * 4);
        for (var i = 0; i < integers.length; i++) {
            var n = integers[i];
            array[index++] = (n & 0xFF000000) >> 24;
            array[index++] = (n & 0x00FF0000) >> 16;
            array[index++] = (n & 0x0000FF00) >> 8;
            array[index++] = (n & 0x000000FF);
        }
        return array;
    }

    var BoolToUInt8Array = function (b) {
        return (b) ? new Uint8Array([1]) : new Uint8Array([0]);
    };

    var UInt8ArrayToBool = function (array, index) {
        return (array[index] != 0);
    };

    var p2p_data_encode = function (message) {
        var swarmID = ascii2ab(BinaryProtocol.packSwarmID(message.swarmID));
        var chunkID = UInt32ToUInt8Array(message.chunkID);
        return BinaryProtocol.concat([swarmID, chunkID, message.payload]);
    };

    var p2p_request_encode = function (message) {
        var buffers = [];
        var swarmID = ascii2ab(BinaryProtocol.packSwarmID(message.swarmID));
        buffers.push(swarmID);
        var encodedChunkID = UInt32ToUInt8Array(message.chunkIDs);
        buffers.push(encodedChunkID);
        return BinaryProtocol.concat(buffers);
    };


    var p2p_cancel_encode = function (message) {
    	
    	console.log(message);
        var buffers = [];
        var swarmID = ascii2ab(BinaryProtocol.packSwarmID(message.swarmID));
        buffers.push(swarmID);
        var encodedChunkIDs = UInt32ToUInt8Array(message.chunkIDs);
        buffers.push(encodedChunkIDs);
        return BinaryProtocol.concat(buffers);
    };

    var p2p_have_encode = function (message) {
        var buffers = [];
        var swarmID = ascii2ab(BinaryProtocol.packSwarmID(message.swarmID));
        buffers.push(swarmID);
        var seeder = BoolToUInt8Array(message.seeder);
        buffers.push(seeder);
        // var complete = BoolToUInt8Array(message.complete);
        // buffers.push(complete);
        if (message.availabilityMap) {
            buffers.push(message.availabilityMap);
        } else if (message.chunkIDs != null){
            var chunkIDsEncoded = UInt32ToUInt8Array(message.chunkIDs);
            buffers.push(chunkIDsEncoded);
        }

        return BinaryProtocol.concat(buffers);
    };

    var p2p_data_decode = function (buffer, index, length) {
        var swarmID = ab2ascii(buffer.slice(index, index + BinaryProtocol.transferedSwarmIDSize));
        index += BinaryProtocol.transferedSwarmIDSize;
        var chunkID = UInt8ArrayToInt32(buffer, index);
        index += 4;
        var payload = buffer.slice(index, index + length);
        return new protocol.Data(swarmID, chunkID, payload);
    };

    var p2p_request_decode = function (buffer, index, length) {
        var swarmID = ab2ascii(buffer.slice(index, index + BinaryProtocol.transferedSwarmIDSize));
        index += BinaryProtocol.transferedSwarmIDSize;
        length -= BinaryProtocol.transferedSwarmIDSize;
        var chunkIDs = [];
        while (length > 0) {
            chunkIDs.push(UInt8ArrayToInt32(buffer, index));
            length -= 4;
            index += 4;
        }

        return new protocol.Request(swarmID, chunkIDs);
    };

    var p2p_cancel_decode = function (buffer, index, length) {
        var swarmID = ab2ascii(buffer.slice(index, index + BinaryProtocol.transferedSwarmIDSize));
        index += BinaryProtocol.transferedSwarmIDSize;
        length -= BinaryProtocol.transferedSwarmIDSize;
        var chunkIDs = [];
        while (length > 0) {
            chunkIDs.push(UInt8ArrayToInt32(buffer, index));
            length -= 4;
            index += 4;
        }

        return new protocol.Cancel(swarmID, chunkIDs);
    };

    var p2p_have_decode = function (buffer, index, length) {
        var chunkIDs;
        var availabilityMap;
        var swarmID = ab2ascii(buffer.slice(index, index + BinaryProtocol.transferedSwarmIDSize));
        index += BinaryProtocol.transferedSwarmIDSize;
        length -= BinaryProtocol.transferedSwarmIDSize;

        var seeder = UInt8ArrayToBool(buffer, index);
        index++;
        length--;

        if (!seeder) {
            // var complete = UInt8ArrayToBool(buffer, index);
            // index++;
            // length--;
            // if (complete) {
                availabilityMap = buffer.slice(index, index + length);
            // } else { //update
                chunkIDs = [];
                while (length > 0) {
                    chunkIDs.push(UInt8ArrayToInt32(buffer, index));
                    index += 4;
                    length -= 4;
                }
            // }
        }
        return new protocol.Have(swarmID, seeder, availabilityMap, chunkIDs);
    };

    var json_encode = function (message) {
        var json = JSON.stringify(message);
        return ascii2ab(json);
    };

    var json_decode = function (buffer, index, length) {
        try {
            var json = ab2ascii(buffer.slice(index, index + length));
            return JSON.parse(json);
        }catch(e){
            peer5.error(e);
            peer5.error('printing out the buggy json');
            peer5.error(json);
        }
    };

    var json_encode16 = function (message) {
        var json = JSON.stringify(message);
        return str2ab(json);
    };

    var json_decode16 = function (buffer, index, length) {
        var json = ab2str(buffer.slice(index, index + length));
        return JSON.parse(json);

    };

    //simple binary serializer using json
    var json_decoder = { encode:json_encode, decode:json_decode };
    var json_decoder16 = { encode:json_encode16, decode:json_decode16 };

    var dict = {};

    dict[protocol.FILE_INFO] = json_decoder16;
    dict[protocol.FILE_FINISH] = json_decoder16;
    dict[protocol.P2P_DATA] = { encode:p2p_data_encode, decode:p2p_data_decode };
    dict[protocol.P2P_REQUEST] = { encode:p2p_request_encode, decode:p2p_request_decode };
    dict[protocol.P2P_CANCEL] = { encode:p2p_cancel_encode, decode:p2p_cancel_decode };
    dict[protocol.P2P_HAVE] = { encode:p2p_have_encode, decode:p2p_have_decode };
    dict[protocol.REPORT] = json_decoder;
    dict[protocol.MATCH] = json_decoder;
    dict[protocol.SDP] = json_decoder;
    dict[protocol.SWARM_HEALTH] = json_decoder;
    dict[protocol.SWARM_ERROR] = json_decoder;
    dict[protocol.JOIN] = json_decoder;

    var put_tlv = function (index, tag, plainValue, encode) {
        var value = plainValue;
        if (encode && tag in dict && dict[tag].encode) {
            value = dict[tag].encode(plainValue);
        }
        var array = new Uint8Array(5 + value.length); //tag1 + length4 + value.length
        var length = value.length;
        array[index++] = tag;
        array.set(UInt32ToUInt8Array(length), index);
        index += LENGTH_SIZE;

        array.set(value, index);
        return array;
    };

    var get_tlv = function (array, index) {
        //get tag
        var tag = array[index++];
        var length = UInt8ArrayToInt32(array, index);
        index += LENGTH_SIZE;

        var data = array.slice(index, index + length);
        return [tag, data];
    };

    BinaryProtocol.concat = function (arrays) {
        var length = 0;
        arrays.map(function (arr) {
            if (arr != null)
                length += arr.length;
        });

        var result = new Uint8Array(length);
        var index = 0;
        arrays.map(function (arr) {
            if (arr != null) {
                result.set(arr, index);
                index += arr.length;
            }
        });
        return result;
    };

    BinaryProtocol.encode = function (messages) {
        var buffers = [];
        messages.forEach(function (message) {
            if (message && message.tag) {
                var encoded = dict[message.tag].encode(message); //value
                buffers.push(put_tlv(0, message.tag, encoded));
            }
        });
        return BinaryProtocol.concat(buffers);

    };

    BinaryProtocol.decode = function (buffer) {
        // iterate TLV messages inside the buffer
        var index = 0;
        var result = [];
        while (index < buffer.length) {
            var curr_tlv = get_tlv(buffer, index);
            var tag = curr_tlv[0];
            var v = curr_tlv[1];
            index += TAG_SIZE + LENGTH_SIZE;

            var tag_translation = dict[tag];
            if (tag_translation && tag_translation.decode) {
                result.push(tag_translation.decode(buffer, index, v.length));
            } else {
                return null;
            }
            index += v.length;

        }
        return result;
    };

    BinaryProtocol.transferedSwarmIDSize = 32;
    BinaryProtocol.packSwarmID = function (swarmID) {
        if (swarmID.length > BinaryProtocol.transferedSwarmIDSize) {
            console.log('trimming swarmID to be at size of ' + BinaryProtocol.transferedSwarmIDSize);
            swarmID = swarmID.substr(0, BinaryProtocol.transferedSwarmIDSize);
        }
        return (new Array(BinaryProtocol.transferedSwarmIDSize - swarmID.length + 1)).join(" ").concat(swarmID);
    };

    exports.packSwarmID = BinaryProtocol.packSwarmID;
    exports.concat = BinaryProtocol.concat;
    exports.decode = BinaryProtocol.decode;
    exports.encode = BinaryProtocol.encode;

})(typeof exports === 'undefined' ? com.webrtc.protocol.BinaryProtocol = {} : exports);
