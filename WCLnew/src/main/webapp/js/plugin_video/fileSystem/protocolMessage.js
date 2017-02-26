(function (exports) {
	exports.P2P_DATA = 0x11;
    exports.P2P_REQUEST = 0x12;
    exports.P2P_CANCEL = 0x13;
    exports.P2P_HAVE = 0x14;

    exports.REPORT = 0x21;
    exports.FILE_INFO = 0x22;
    exports.FILE_FINISH = 0x24;
    exports.COMPLETED_DOWNLOAD = 0x23;

//    attributes (ordered)
//    swarmID - 4bytes - only the intial 4 bytes will be encoded. We have a slight chance for collision, but even if there is, the pollution detection will prevent serious problems.
//        chunkID - 4bytes (UInt32) means that we have a limitation of 2^32 chunks per swarm -> ~4TB for each file.
//        payload data - chunk
//    length: chunk size + swarmId length under 1200 bytes constraint
//    constraints:
//        peer will send only hash varified chunks
    function Data(swarmID, chunkID, payload) {
        this.tag = exports.P2P_DATA;
        this.swarmID = swarmID;
        this.chunkID = chunkID;
        this.payload = payload;
    }

//    swarmId (4bytes)
//    chunkIds - optional - array of ids each 4bytes
//    Example of 2 chunks encoding: 0x010203040A0B0C0D. 0x01-0x04 are the first encoded chunk, 0x0A-0x0D are the second encoded chunk)
    function Request(swarmID, chunkIDs) {
        this.tag = exports.P2P_REQUEST;
        this.swarmID = swarmID;
        if (!chunkIDs) chunkIDs = [];
        this.chunkIDs = chunkIDs;
    }

//Cancel (0x13)
//attributes (ordered)
//swarmId (4 bytes)
//chunkIds/all (optional) if empty (not included) then all chunks are to be canceled. If included, chunks are encoded in 4bytes-per-chunk - for example  0x010203040A0B0C0D
    function Cancel(swarmID, chunkIDs) {
        this.tag = exports.P2P_CANCEL;
        this.swarmID = swarmID;
        if (!chunkIDs)
        	chunkIDs = [];
        this.all = (chunkIDs.length == 0)
        this.chunkIDs = chunkIDs;
    }

    /**
     *
     * @param swarmID
     * @param seeder true if seeder
     * @param complete true if availabilityMap, false if update
     * @param chunkIDs in list of chunks, or availabilityMap
     * @constructor
     */
    function Have(swarmID, seeder, availabilityMap, chunkIDs) {
        this.tag = exports.P2P_HAVE;
        this.swarmID = swarmID;
        this.seeder = seeder;
        this.chunkIDs = [];
        if (!seeder) {
            if (availabilityMap) {
                // this.complete = true;
                this.availabilityMap = availabilityMap;
                this.chunkIDs = chunkIDs;
            }
            else {
                // this.complete = false;
                this.chunkIDs = chunkIDs;
            }
        }
    }

//    swarmId full (20bytes)
//    last requested blockId (not random) (uint)
//    transport statistics (for P2P total, HTTP)
//    total bytes dl/up
//    dl/up speed (max,min,avg)
//    rejected connections (NAT problems, etc.)
//    num of connections (byte)
//    connections (special parsing)
//    info gathered on those connections?
//#bytes recv, sent, dl/up speed (max,min,avg)
//    chunk drop % (expiration)
//#blocks failed hash verification
//    latency MS (best so far)
//    browser - user agent
//    vendor (byte)
//    major (byte)
//        ?minor (byte)
//        availability block map (variable length)
    function Report(swarmId, last_requested_block_id, total_bytes_up_P2P, total_bytes_down_P2P, total_bytes_down_HTTP,total_waste_P2P,total_waste_HTTP, speed_up, speed_down, connections, ua, availabilityMap,numOfBlocksHave,fileSize,completedDownload) {
        this.tag = exports.REPORT;
        this.swarmId = swarmId;
        this.lastRequestedBlockId = last_requested_block_id;
        this.totalBytesUpP2P = total_bytes_up_P2P;
        this.totalBytesDownP2P = total_bytes_down_P2P;
        this.totalBytesDownHTTP = total_bytes_down_HTTP;
        this.totalWasteP2P = total_waste_P2P;
        this.totalWasteHTTP = total_waste_HTTP;
        this.speedUp = speed_up;
        this.speedDown = speed_down
        this.connections = connections;
        this.ua = ua;
        this.availabilityMap = availabilityMap;
        this.numOfBlocksHave = numOfBlocksHave;
        this.fileSize = fileSize;
        this.completedDownload = completedDownload;
    }

    /**
     * Represents metadata needed to manage the swarm
     * @param swarmId uniqueId or null if needs to create new
     * @param size the size of the swarm in bytes
     * @param hashes list of digests for each block
     * @param blockSize size of a single block in bytes
     * @param origin optional identification of the swarm creator (i.e. customerId, name of uploader, company)
     * @constructor
     */
    function FileInfo(swarmID, size, hashes, blockSize, origin, name, lastModified, type) {
        this.tag = exports.FILE_INFO;
        this.swarmID = swarmID;
        this.size = size;
        this.hashes = hashes;
        this.blockSize = blockSize;
        this.origin = origin;
        this.name = name;
        this.lastModified = lastModified;
        this.type = type;
    }

    function FileFinish(swarmID) {
        this.tag = exports.FILE_FINISH;
        this.swarmID = swarmID;
    }
    

    exports.Have = Have;
    exports.Cancel = Cancel;
    exports.Request = Request;
    exports.Data = Data;
    exports.Report = Report;
    exports.FileInfo = FileInfo;
    exports.FileFinish = FileFinish;
    
})(typeof exports === 'undefined' ? com.webrtc.protocol: exports);