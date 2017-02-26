(function(){
    com.webrtc.BlockMap = Object.subClass({
        ctor:function (resourceId, fileSize, blockSize) {
            this.resourceId = resourceId;
            this.metadata = null;
            this.privateBlockMap = {};
            this.blockSize = blockSize;
            this.numOfChunksInBlock = Math.ceil(this.blockSize / com.webrtc.config.CHUNK_SIZE);
            this.fileSize = fileSize;
            this.numOfBlocks = Math.ceil(this.fileSize / this.blockSize);
            this.numOfChunks = Math.ceil(this.fileSize / com.webrtc.config.CHUNK_SIZE);
            this.numOfVerifiedChunks = 0;
            this.firstMissingBlock = 0;
            this.fs = false;
            this.sizeOfLastChunk = this.fileSize % com.webrtc.config.CHUNK_SIZE;
            this.sizeOfLastBlock = (this.fileSize % this.blockSize) ? this.fileSize % this.blockSize : this.blockSize;
            this.availabilityMap = new com.webrtc.AvailabilityMap(this.numOfChunks);
        },


        getSerializedMap:function () {
            return this.availabilityMap.serialize();
        },

        isFull:function () {
            return (this.numOfChunks == this.numOfVerifiedChunks);
        },

        has:function (blockId) {
            return (this.privateBlockMap[blockId] && this.privateBlockMap[blockId].verified);
        },

        hasChunk:function (chunkId) {
            var indices = this.calcBlockIdChunkOffset(chunkId);
            if (this.availabilityMap) {       
                return this.availabilityMap.has(chunkId);
            }
            else
                return false;
        },

        getNumOfBlocks:function () {
            return this.numOfBlocks;
        },

        getNumOfChunks:function() {
            return this.numOfChunks;
        },

        //TODO: change to work with filesystem (asynch)
        getBlock:function (blockId) {
            if (this.privateBlockMap[blockId])
                return this.privateBlockMap[blockId].getBlock();
            else
                return false;
        },

//        getBlockChunks:function (blockId) {
//            if (this.privateBlockMap[blockId].verified)
//                return  this.privateBlockMap[blockId].getBlockChunks(blockId);
//            else
//                return false;
//        },

        getChunkIdsOfBlock:function (blockId) {
            if (blockId >= this.numOfBlocks)
                return [];
            var numOfChunksInThisBlock = (blockId == this.numOfBlocks - 1) ? Math.ceil(this.sizeOfLastBlock / peer5.config.CHUNK_SIZE) : this.numOfChunksInBlock;
            var chunkIds = [];
            var firstChunk = blockId * this.numOfChunksInBlock;
            for (var i = firstChunk; i < firstChunk + numOfChunksInThisBlock; ++i) {
                chunkIds.push(i);
            }
            return chunkIds;
        },

        getBlockIdOfChunk:function(chunkId){
            if(chunkId >= this.numOfChunks)
                return -1;
            var indices = this.calcBlockIdChunkOffset(chunkId);
            return indices.block;
        },

        //cb(data)
        getChunk:function (chunkID) {
            var thi$ = this;
            var indices = this.calcBlockIdChunkOffset(chunkID);
            if (this.privateBlockMap[indices.block]){
                var retval = this.privateBlockMap[indices.block].getChunk(indices.chunk);

                if(this.fs){
                    if(!retval) return false; //not verified
                    if(retval == true){
                        //read from fs
                        var blockOffset = indices.block*com.webrtc.config.CHUNK_SIZE;
                        com.webrtc.FSio.read(this.resourceId,blockOffset,blockOffset+com.webrtc.config.CHUNK_SIZE
                            ,function(succ,data){
                                if(succ){
                                    retval = data;
                                }
                            });
                    }
                }
            return retval;
            }
        },

        setChunk:function (chunkID, chunkData,originID,SessionID) {
            console.log(originID+SessionID);
            var thi$ = this;

            thi$.tempOriginID = originID;
            thi$.tempSessionID = SessionID;
            var indices = this.calcBlockIdChunkOffset(chunkID);
            if(!this.availabilityMap.has(chunkID))
            {
                if(this.fs) {
                    com.webrtc.FSio.write(this.resourceId,new Blob([chunkData]),chunkID*com.webrtc.config.CHUNK_SIZE,function(succ){
                        if(succ){
                            //console.log("successfully wrote chunk " + chunkID + " to filesystem ");
                            thi$.availabilityMap.set(chunkID);
                            thi$.numOfVerifiedChunks++;
                            com.webrtc.receivingfile(com.webrtc.file.fileInfoMap[thi$.resourceId],thi$.numOfVerifiedChunks,thi$.numOfChunks,thi$.tempOriginID,thi$.tempSessionID);
                            if (thi$.isFull()) {
                                console.log("is full!!!!!!");  
                                //com.webrtc.receivingfile(com.webrtc.file.fileInfoMap[thi$.resourceId]);
                                
                                 var FinishMessage = new com.webrtc.protocol.FileFinish(thi$.resourceId);
                                var encodedMsg = com.webrtc.protocol.BinaryProtocol.encode([FinishMessage]);
                                //com.webrtc.send(originID, encodedMsg);
                                var originID = com.webrtc.file.fileOriginID[thi$.resourceId];
                                com.webrtc.app.usersessionlist[SessionID].Send(originID,SessionID,encodedMsg);
                                console.log("send finish message");
                                var name = com.webrtc.file.fileInfoMap[thi$.resourceId];
                                com.webrtc.receivefilefinish(name,thi$.tempOriginID,thi$.tempSessionID);
                                thi$.saveLocally();
                            }
                            
                        }else{
                            console.log("couldn't write chunk " + chunkID + " to filesystem");                        }
                        });
                } else {
                    if (!this.privateBlockMap[indices.block]) {
                        var blockSize = (indices.block == this.numOfBlocks - 1) ? this.sizeOfLastBlock : this.blockSize;
                        this.privateBlockMap[indices.block] = new com.webrtc.Block(blockSize);
                    }
                    console.log(this.resourceId);         
                    this.privateBlockMap[indices.block].setChunk(indices.chunk, chunkData,SessionID);
                    if (this.privateBlockMap[indices.block].chunkMap[indices.chunk]) {
                        this.availabilityMap.set(chunkID);
                    }
                   this.numOfVerifiedChunks++; 
                }
                //this.numOfVerifiedChunks++;
                //console.log("num of verified chunks " + this.numOfVerifiedChunks);
            }
        },

        setChunk2:function (chunkID, chunkData) {
            var thi$ = this;
            var indices = this.calcBlockIdChunkOffset(chunkID);
            if(!this.availabilityMap.has(chunkID))
            {
                if(this.fs) {
                    com.webrtc.FSio.write(this.resourceId,new Blob([chunkData]),chunkID*com.webrtc.config.CHUNK_SIZE,function(succ){
                        if(succ){
                            // console.log("successfully wrote chunk " + chunkID + " to filesystem ");
                            thi$.availabilityMap.set(chunkID);
                            thi$.numOfVerifiedChunks++;
                            // //com.webrtc.receivingfile(com.webrtc.file.fileInfoMap[thi$.resourceId],thi$.numOfVerifiedChunks,thi$.numOfChunks);
                            // if (thi$.isFull()) {
                            //     console.log("is full!!!!!!");  
                            //     com.webrtc.receivingfile(com.webrtc.file.fileInfoMap[thi$.resourceId]);
                            //     thi$.saveLocally();
                            // }
                            
                        }else{
                            console.log("couldn't write chunk " + chunkID + " to filesystem");                        }
                        });
                } else {
                    if (!this.privateBlockMap[indices.block]) {
                        var blockSize = (indices.block == this.numOfBlocks - 1) ? this.sizeOfLastBlock : this.blockSize;
                        this.privateBlockMap[indices.block] = new com.webrtc.Block(blockSize);
                    }
                    console.log(this.resourceId);         
                    this.privateBlockMap[indices.block].setChunk(indices.chunk, chunkData);
                    if (this.privateBlockMap[indices.block].chunkMap[indices.chunk]) {
                        this.availabilityMap.set(chunkID);
                    }
                   this.numOfVerifiedChunks++; 
                }
                //this.numOfVerifiedChunks++;
                //console.log("num of verified chunks " + this.numOfVerifiedChunks);
            }
        },

        isEmpty:function (blockId) {
            return (!this.privateBlockMap[blockId]);
        },

        getBlockIndex:function(index) {
            return Math.ceil(index/peer5.config.BLOCK_SIZE);
        },

        getBlockIds:function () {
            return Object.keys(this.privateBlockMap);
        },

        getFirstMissingBlock:function() {
            return this.firstMissingBlock;
        },

        getRandomMissingBlock:function() {
            for (var i=0;i<1000;i++) { //1000 tries to find a missing block
                var size = this.numOfBlocks - this.firstMissingBlock;
                var guess = this.firstMissingBlock + Math.floor(Math.random() * size);
                if (!(guess in this.privateBlockMap)) {
                    return guess; //found an empty space!
                }
            }

            return this.firstMissingBlock; //last resort
        },

        getConsecutiveBuffer:function(startBlock) {
            var firstMissingBlock = startBlock;
            while (this.has(firstMissingBlock)) {
                firstMissingBlock++;
            }

            var numOfBlocks = (firstMissingBlock - startBlock);
            var array = new Uint8Array(peer5.config.BLOCK_SIZE*numOfBlocks);
            for (var i = 0; i < numOfBlocks; ++i) {
                array.set(this.getBlock(i), i * peer5.config.BLOCK_SIZE);
            }
            return array;
        },

        verifyBlock:function (blockId) {
            if (this.privateBlockMap[blockId]) {
                if(this.privateBlockMap[blockId].verifyBlock() == 1){
                    this.numOfVerifiedBlocks++;
                    //find the first missing block again
                    while (this.has(this.firstMissingBlock)) {
                        this.firstMissingBlock++;
                    }
                    if(this.metadata) //ToDo: broadcast only the metadata
                        radio('blockReceivedEvent').broadcast(blockId,this,this.metadata);
                    //writing to Filesystem:
                    var thi$ = this;
                    if (peer5.config.USE_FS && this.fs) {
                        peer5.core.data.FSio.write(thi$.resourceId,new Blob([thi$.getBlock(blockId)]),blockId*peer5.config.BLOCK_SIZE,function(succ){
                            if(succ){
                                //adding the block to the lruMap
                                thi$.lruMap.set(blockId,thi$.privateBlockMap[blockId]);
                                peer5.debug("successfully wrote block " + blockId + " to filesystem ");
                            }else{
                                peer5.warn("couldn't write block " + blockId + " to filesystem");
                            }
                        });
                    }
                    if(this.isFull()) radio('transferFinishedEvent').broadcast(this); //only call when a new block is completed
                }
                if (this.privateBlockMap[blockId].verified) {
                    this.availabilityMap.set(blockId);
                    return true;
                }
            }
            return false;
        },

        addMetadata:function(metadata){
            this.metadata = metadata;
        },

        getMetadata:function(){
            return this.metadata;
        },

        initiateFromLocalData:function(cb,blockId,endBlockId){
            var thi$ = this;
            if(!endBlockId && endBlockId != 0) {
                peer5.core.data.FSio.getResourceDetails(this.resourceId,function(succ,details){
                   var endBlockId = Math.floor(details.size/peer5.config.BLOCK_SIZE);
                   thi$.initiateFromLocalData(cb,blockId,endBlockId);
                });
            }else{
                peer5.core.data.FSio.read(thi$.resourceId,blockId*peer5.config.BLOCK_SIZE,(blockId+1)*peer5.config.BLOCK_SIZE,function(succ,data){
                    if(succ){ //the block is read now we need to verify it against corruptions
                        if(thi$.initiateBlockFromLocalData(blockId,data)){
                            peer5.log("successfully initiated block " + blockId + " from filesystem " + Date.now());
                        }else{
                            peer5.log("couldnt verify block " + blockId + " from filesystem " + Date.now());
                        }
                        if(blockId < endBlockId)
                        {
                            blockId++
                            thi$.initiateFromLocalData(cb,blockId,endBlockId);
                        }else{
                            peer5.info("finished initiating from filesystem");
                            cb(true);
                        }
                    }else{
                        peer5.warn("couldn't initiate block " + blockId + " from filesystem");
                    }
                });
            }

        },

        initiateBlockFromLocalData:function(blockId,data){
            var blockSize = (blockId == this.numOfBlocks - 1) ? this.sizeOfLastBlock : (peer5.config.BLOCK_SIZE);
            this.privateBlockMap[blockId] = new peer5.core.Block(blockSize);
            for(var i=0; i<Math.ceil(data.length/peer5.config.CHUNK_SIZE);++i)
                this.privateBlockMap[blockId].setChunkOn(i);
            if(this.privateBlockMap[blockId].verifyBlock(data)){
                this.numOfVerifiedBlocks++;
                //find the first missing block again
                while (this.has(this.firstMissingBlock)) {
                    this.firstMissingBlock++;
                }
                for(var i=0; i<Math.ceil(data.length/peer5.config.CHUNK_SIZE);++i)
                    radio('peer5_received_fs_chunk').broadcast(blockId*this.numOfChunksInBlock+i,this.resourceId);
                if(this.isFull()) radio('transferFinishedEvent').broadcast(this); //only call when a new block is completed
                this.availabilityMap.set(blockId);
                return true;
            }else{
                delete this.privateBlockMap[blockId];
                return false;
            }
        },

        saveLocally:function(){
            //if we have file system api we should save the file using it instead of saving it again on the memory
            //this helps us to achieve higher file size.
            //the right way in the future will be to use file system to save to blocks from the beginning
            if (com.webrtc.config.USE_FS) {
                console.log('saving file via file system api ');
                this._saveLocallyUsingFSio();
            } else {
                console.log('saving file without file system api ');
                this._saveLocally();
            }
        },

        changeResourceId:function(newResourceId,cb){
            var thi$ = this;
            peer5.core.data.FSio.renameResource(this.resourceId,newResourceId,function(succ){
                if(succ){
                    thi$.resourceId = newResourceId;
                }
                cb(succ);
            });
        },
        /** @private functions*/
        _registerEvents:function(){
            var thi$ = this;
            this._lruRemoveCb = function(blockId,block){
                thi$._removeBlockData(blockId);
            };
        },

        _removeBlockData:function(blockId){
            if(this.privateBlockMap[blockId])
                this.privateBlockMap[blockId].removeBlockData();
        },

        _saveLocallyUsingFSio:function(){
            console.log("saveLocally called");
            var thi$ = this;
            com.webrtc.FSio.createObjectURL(this.resourceId,function(succ,url){
                if(!succ) return;
                var a = document.createElement('a');
                a.setAttribute('download', thi$.metadata.name);
                a.setAttribute('href', url);
                document.body.appendChild(a);
                a.click();
                //removing the resource disrupts the saving of the file
                //peer5.core.data.FSio.removeResource(name);
            })
        },

        _saveLocally:function(){
            var array = [];
            console.log(this.getNumOfChunks());
            for (var i = 0; i < this.getNumOfChunks(); ++i) {
                array.push(this.getChunk(i));
            }
            console.log(array);
//            var blob = new Blob([array], {type: "application/octet-binary"});
            var blob = new Blob(array, {type:"application/octet-binary"});
            if (!window.URL && window.webkitURL)
                window.URL = window.webkitURL;
            var a = document.createElement('a');
            a.setAttribute('download', this.metadata.name);
            a.setAttribute('href', window.URL.createObjectURL(blob));
            document.body.appendChild(a);
            a.click();
        },

        calcBlockIdChunkOffset:function (chunkID) {
            var blockID = Math.floor(chunkID / this.numOfChunksInBlock);
            var chunkOffset = chunkID % this.numOfChunksInBlock;
            return {block:blockID, chunk:chunkOffset};
        }
    });
})();
