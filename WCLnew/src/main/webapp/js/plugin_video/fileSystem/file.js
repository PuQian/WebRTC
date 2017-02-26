if(typeof com == "undefined"){
    com = {};
}

if(typeof com.webrtc == "undefined"){
    com.webrtc = {};
}

com.webrtc.file = {
    fileInfoList : {},
    fileInfoMap:{},
    fileOriginID :{},
    fileFlag:{},
    fileIndex : {},
    blockMaps : {},
    remoteAvailabilityMaps: {},
    // resend_interval : 1000,
    chunkRead : 0,
    //fileNum表示上次发送文件之后共有的文件数
   // fileNum : 0,
    //表示即将要发送文件的集合
    fileNameList : new Array(),
    //biaozhiwei
    signalfile : true,

    handleFiles : function(files,RemoteUserToFile){
        var thi$ = this;
        var sliceId = 0;
        var blob, swarmID;
        var sliceSize = Math.min(1024000000,com.webrtc.config.CACHE_SIZE,100000000);
        this.chunkRead = 0;
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var hash = new hashMe(file,function Output(msg){console.log(msg);});
                     
            setTimeout(function(){
                swarmID = hash.getHash();
                console.log("swarmID");
                console.log(swarmID);
                var blockSize = Math.min(1024000000,com.webrtc.config.CACHE_SIZE,file.size);
                thi$.fileInfoList[file.name] = new com.webrtc.protocol.FileInfo(hash.getHash(), file.size, null, blockSize, 'webrtc', file.name, file.lastModifiedDate, file.type);
                thi$.fileNameList.push(file.name);
                thi$.fileInfoMap[swarmID]=file.name;
                thi$.fileFlag[swarmID] =-1;
                console.log(file);
                var fileName = file.name;
                var fileSize = file.size;
                var reader = new FileReader();

                reader.onloadstart = function (evt) {
                    if (typeof thi$.blockMaps[swarmID] == "undefined") {
                    thi$.blockMaps[swarmID] = new com.webrtc.BlockMap(swarmID, fileSize, sliceSize);
                    thi$.remoteAvailabilityMaps[swarmID] = {};

                    // if(com.webrtc.config.USE_FS) {
                    if (!thi$.blockMaps[swarmID].fs) {
                        console.log("begin to use filesystem");
                        com.webrtc.FSio.requestQuota(fileSize,function(succ,freeSpace){
                            if(succ){ //success to create filesystem
                                com.webrtc.FSio.isExist(swarmID,function(succ){
                                    if(succ){ //file exists
                                        console.log("Resource " + swarmID + " exists already in the filesystem.");
                                        thi$.blockMaps[swarmID].fs = true;
                                    }else{ //file doesn't exist
                                        console.log("Resource " + swarmID + " doesn't exist in the filesystem.");
                                        if(freeSpace > fileSize){ //we have enough space let's create the resource
                                            com.webrtc.FSio.createResource(swarmID,function(succ){
                                                if(succ){
                                                    thi$.blockMaps[swarmID].fs = true;
                                                }else{
                                                    thi$.blockMaps[swarmID].fs = false;
                                                }

                                                console.log(thi$.blockMaps[swarmID]);
                                        
                                            });
                                        }else{ //we don't have enough space, try #1
                                            com.webrtc.FSio.removeRootDir(function(){
                                                com.webrtc.FSio.queryQuota(function(succ,usage,quota){
                                                    if(quota - usage > fileSize){ //we have enough space let's create the resource
                                                        com.webrtc.FSio.createResource(swarmID,function(succ){
                                                            if(succ){
                                                                thi$.blockMaps[swarmID].fs = true;
                                                            }else{
                                                                thi$.blockMaps[swarmID].fs = false;
                                                            }
                                                        });
                                                    }else{ //we don't have enough space, try #2
                                                        com.webrtc.FSio.requestQuota(fileSize + usage,function(succ,freeSpace){
                                                            if(succ){
                                                                if(freeSpace > fileSize){ //we have enough space let's create the resource
                                                                    com.webrtc.FSio.createResource(swarmID,function(succ){
                                                                        if(succ){
                                                                            thi$.blockMaps[swarmID].fs = true;
                                                                        }else{
                                                                           thi$.blockMaps[swarmID].fs = false;
                                                                        }
                                                                    });
                                                                }else{ //we don't have enough space, try #3
                                                                    console.log("We don't have enough space for the file");
                                                                    com.webrtc.config.USE_FS = false;
                                                                
                                                                //TODO: fallback to no filesystem
                                                                }
                                                            }
                                                        });
                                                    }
                                                })  
                                            });
                                        }
                                    }                            
                                })
                            }else{ //failed to create filesystem
                                console.log("failed to create the filesystem");
                                com.webrtc.config.USE_FS = false;
                            }
                        });
                    }
                }

            }

                reader.onloadend = function (evt) {
                    if (evt.target.readyState == FileReader.DONE) { // DONE == 2
                        thi$.addChunks(file, evt.target.result);
                        sliceId++;
                        console.log("sliceId  " + sliceId);
                        if ((sliceId + 1) * sliceSize < file.size) {
                            blob = file.slice(sliceId * sliceSize, (sliceId + 1) * sliceSize);
                            reader.readAsArrayBuffer(blob);
                        } else if (sliceId * sliceSize < file.size) {
                            blob = file.slice(sliceId * sliceSize, file.size);
                            reader.readAsArrayBuffer(blob);
                        } else {
                            thi$.finishedLoadingFile(file,RemoteUserToFile);
                        }
                    }
                }
                
                blob = file.slice(sliceId * sliceSize, (sliceId + 1) * sliceSize);
                reader.readAsArrayBuffer(blob);
            },1000);
        
        //this.fileNum++;
        }
    },
    //清空文件
    deleteFiles :function(){
    	console.log("deleteFiles");
     this.fileInfoList ={},
        this.fileIndex = {},
        this.fileOriginID={},
            this.fileInfoMap={},
        this.fileFlag={},
     this.blockMaps = {},
        this.remoteAvailabilityMaps={},
     // resend_interval : 1000,
        this.chunkRead = 0,
    //fileNum表示上次发送文件之后共有的文件数
   // fileNum : 0,
    //表示即将要发送文件的集合
     this.fileNameList = new Array(),
    //biaozhiwei
        this.signalfile = true;

    //$("#messages").html("<p>Status Messages</p>");
    },

    addFile : function(file){
        var thi$ = this;
        

        
    },

    addChunks : function(file, binarySlice){
        var fileName = file.name;
        var fileSize = file.size;
        var swarmID = this.fileInfoList[fileName].swarmID;
        
        var blockMap = this.blockMaps[swarmID];
        var chunkSize = com.webrtc.config.CHUNK_SIZE;
        var numOfChunksInSlice = Math.ceil(binarySlice.byteLength / chunkSize);
        console.log("numOfChunksInSlice " + numOfChunksInSlice);
        //this.chunkRead = 0;
        for (var i = 0; i < numOfChunksInSlice; i++) {
            var start = i * chunkSize;
            var newChunk = new Uint8Array(binarySlice.slice(start, Math.min(start + chunkSize, binarySlice.byteLength)));
            //blockMap.setChunk(this.chunkRead, newChunk);
            blockMap.setChunk2(this.chunkRead, newChunk);
            this.chunkRead++;
        }
        // if (this.chunkRead == this.numOfChunksInFile) {
        //     this.hasEntireFile = true;
        // }
    },

     
    //文件缓存结束
    finishedLoadingFile : function(file,RemoteUserToFile){
        console.log("finish");
        SendFileRequestBefore(RemoteUserToFile);
    },

    // uuid : function(){
    //     var ar = new Array('0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','g');
    //     var uid = "", count = 0;
    //     while(1){
    //         for(i=1;i<=6;i++)
    //             uid += ar[parseInt(Math.random()*20)];
    //         if(typeof this.fileIndex[uid] === "undefined"){
    //             console.log("create uid " + uid);
    //             return uid;
    //         }
    //         if(count++ == 100){
    //             console.log("create uid failed!");
    //             return false;
    //         }
    //     }
    // },

    sendFiles : function(remoteID,SessionID) {
        while(this.fileNameList.length > 0) {
            var name = this.fileNameList.shift();
            var fileInfo = com.webrtc.protocol.BinaryProtocol.encode([this.fileInfoList[name]]);
            //获取remoteID，并依次发送fileinfo消息
            //var remoteUserIDs = document.getElementById("calleeid").value.split(",");
            //for (var i = 0; i < remoteUserIDs.length; i++) {
                    var remoteID = remoteID;
                    var swarmID = this.fileInfoList[name].swarmID;
                   this.fileOriginID[swarmID]= remoteID;
                //    com.webrtc.send(remoteID, fileInfo);
                 com.webrtc.app.usersessionlist[SessionID].Send(remoteID,SessionID,fileInfo);
            //}
        }
    },

    sendChunk : function(swarmID, chunkIDs, iter, originID,allchunkIDslength,pre,SessionID) {
        var thi$ = this;
        var blockMap = this.blockMaps[swarmID];
        var chunkID = chunkIDs[iter];
        iter++;

        var data = blockMap.getChunk(chunkID);
    
        var message = new com.webrtc.protocol.Data(swarmID, chunkID, data);
        // console.log("send chunk " + chunkID);
        //console.log(message);
        var dataMessage = com.webrtc.protocol.BinaryProtocol.encode([message]);
        //com.webrtc.send(originID, dataMessage);
        
        if(this.fileFlag[swarmID] == allchunkIDslength){

            com.webrtc.sendingfile(com.webrtc.file.fileInfoMap[swarmID],pre,iter,allchunkIDslength,
                    originID,
                    SessionID);
        }
        com.webrtc.app.usersessionlist[SessionID].Send(originID,SessionID, dataMessage);
        if (iter < chunkIDs.length) {
            setTimeout(function (swarmID, chunkIDs, iter, originID) {
                thi$.sendChunk(swarmID, chunkIDs, iter, originID,allchunkIDslength,pre,SessionID);
            },com.webrtc.config.PC_RESEND_INTERVAL, swarmID, chunkIDs, iter, originID);
        }
    },

    receiveDataMessage : function(dataMessage, originID,SessionID) {
        var thi$ = this;
        var swarmID = dataMessage.swarmID;
        var chunkID = dataMessage.chunkID;
        var data = dataMessage.payload;

        var blockMap = this.blockMaps[swarmID];
         
        if (!blockMap.hasChunk(chunkID)) {
            console.log(originID+SessionID);
            blockMap.setChunk(chunkID, data,originID,SessionID);            
        /*    
            if (blockMap.isFull()) {
                console.log("is full!!!!!!");
                setTimeout(function(){
                    blockMap.saveLocally();
                },100);
            }
            */
        } else {
            console.log('I already got chunk: ' + chunkID);
        }

    },

    judgeFull : function(swarmID,originID,SessionID){
        var thi$ = this;
        
        setTimeout(function(swarmID){   
            if(thi$.blockMaps[swarmID].isFull())
            {
                console.log("get full  file!");
            }
            else
            {       
                if( com.webrtc.FSio.writeQueue.isEmpty() ){  
                    var availabilityMap = thi$.blockMaps[swarmID].availabilityMap;
                    var chunkIDs = availabilityMap.getChunkIDs();
                    console.log("chunkIDs " + chunkIDs + "swarmID " + swarmID);
                    var seeder = availabilityMap.seeder;
                    if (!seeder) {
                        var requestMessage = new com.webrtc.protocol.Request(swarmID, chunkIDs);
                        var encodedMsg2 = com.webrtc.protocol.BinaryProtocol.encode([requestMessage]);
                        //com.webrtc.send(originID, encodedMsg2);
                         com.webrtc.app.usersessionlist[SessionID].Send(originID, SessionID,encodedMsg2);
                        console.log("send new requestMessage");
                    }
                }   
                thi$.judgeFull(swarmID,originID,SessionID);
            }
        },com.webrtc.config.NEW_REQUEST,swarmID,originID);
    },

    receiveFileInfoMessage : function(dataMessage, originID,SessionID) {
        var swarmID = dataMessage.swarmID;
        var fileSize = dataMessage.size;
        var blockSize = dataMessage.blockSize;
        var hashes = dataMessage.hashes;
        var origin = dataMessage.origin;
        var name = dataMessage.name;
        var lastModified = dataMessage.lastModified;
        var type = dataMessage.type;

        var this$$=this;


        var content = "同意接收文件:" + name + fileSize;
        $.tipModal('confirm', 'warning', content, 
            function(result) {
                console.log('warning callback: ' + result);
                if(result == false){
                        //this$$.refuse();
                	 	var thi$ = this$$;
                        
                        thi$.fileInfoList[name] = new com.webrtc.protocol.FileInfo(swarmID, fileSize, hashes, blockSize, origin, name, lastModified, type);
                        thi$.fileInfoMap[swarmID] = name;
                        thi$.fileFlag[swarmID] =-1;
                        thi$.fileOriginID[swarmID] = originID;
                        thi$.blockMaps[swarmID] = new com.webrtc.BlockMap(swarmID, fileSize, blockSize);
                        // var haveMessage = new com.webrtc.protocol.Have(swarmID, false, false, null);
                        // var encodedMsg = com.webrtc.protocol.BinaryProtocol.encode([haveMessage]);
                        // com.webrtc.send(encodedMsg);
                        thi$.blockMaps[swarmID].addMetadata({name:name});
                        var chunkIDs = thi$.blockMaps[swarmID].availabilityMap.getChunkIDs();
                        var requestMessage = new com.webrtc.protocol.Cancel(swarmID, chunkIDs);
                        var encodedMsg2 = com.webrtc.protocol.BinaryProtocol.encode([requestMessage]);
                        
                        //com.webrtc.send(originID, encodedMsg2);
                         com.webrtc.app.usersessionlist[SessionID].Send(originID, SessionID,encodedMsg2);
                        
                        
                        
                }
                else{

            if (!com.webrtc.config.USE_FS) {
                for (var key in this.fileInfoList) {
                    if (key == name) {
                        if (this.fileInfoList[name].swarmID == swarmID) {
                            console.log("file " + name + " exists already");
                            var blockMap = this.blockMaps[swarmID];
                            var seeder = blockMap.availabilityMap.seeder;
                            if (seeder) {
                                var haveMessage = new com.webrtc.protocol.Have(swarmID, seeder);
                                var encodedMsg = com.webrtc.protocol.BinaryProtocol.encode([haveMessage]);
                                //com.webrtc.send(originID, encodedMsg);
                                com.webrtc.app.usersessionlist[SessionID].Send(originID,SessionID,encodedMsg);
                            } else {
                                var availabilityMap = blockMap.availabilityMap;
                                var chunkIDs = availabilityMap.getChunkIDs();
                                var haveMessage = new com.webrtc.protocol.Have(swarmID, seeder, availabilityMap, chunkIDs);
                                var encodedMsg = com.webrtc.protocol.BinaryProtocol.encode([haveMessage]);
                               // com.webrtc.send(originID, encodedMsg);
                                com.webrtc.app.usersessionlist[SessionID].Send(originID,SessionID,encodedMsg);
                            
                                var requestMessage = new com.webrtc.protocol.Request(swarmID, chunkIDs);
                                var encodedMsg2 = com.webrtc.protocol.BinaryProtocol.encode([requestMessage]);
                                //com.webrtc.send(originID, encodedMsg2);
                                com.webrtc.app.usersessionlist[SessionID].Send(originID,SessionID,encodedMsg2);
                            
                            }
                            return;
                        }
                        else {
                        //to be motified
                            name = name.split('.')[0] + '(2)' + name.split('.')[1];
                            // this.fileInfoList[name] = new com.webrtc.protocol.FileInfo(swarmID, fileSize, hashes, blockSize, origin, name, lastModified, type);
                            // this.blockMaps[swarmID] = new com.webrtc.BlockMap(swarmID, fileSize, blockSize);
                            // this.blockMaps[swarmID].addMetadata({name:name});
                            // console.log(this.blockMaps[swarmID]);
                        }
                    }
                }


                this.fileInfoList[name] = new com.webrtc.protocol.FileInfo(swarmID, fileSize, hashes, blockSize, origin, name, lastModified, type);
                this.fileInfoMap[swarmID] = name;
                this.fileFlag[swarmID] =-1;
                this.fileOriginID[swarmID] = originID;
                this.blockMaps[swarmID] = new com.webrtc.BlockMap(swarmID, fileSize, blockSize);
                // var haveMessage = new com.webrtc.protocol.Have(swarmID, false, false, null);
                // var encodedMsg = com.webrtc.protocol.BinaryProtocol.encode([haveMessage]);
                // com.webrtc.send(encodedMsg);
                this.blockMaps[swarmID].addMetadata({name:name});
                var chunkIDs = this.blockMaps[swarmID].availabilityMap.getChunkIDs();
                var requestMessage = new com.webrtc.protocol.Request(swarmID, chunkIDs);
                var encodedMsg2 = com.webrtc.protocol.BinaryProtocol.encode([requestMessage]);
                
                //com.webrtc.send(originID, encodedMsg2);
                 com.webrtc.app.usersessionlist[SessionID].Send(originID, SessionID,encodedMsg2);
            }

            else {
                var thi$ = this$$;
                com.webrtc.FSio.requestQuota(fileSize,function(succ,freeSpace){
                    if(succ){ //success to create filesystem
                        com.webrtc.FSio.isExist(swarmID,function(succ){
                            if(succ){ //file exists
                                console.log("Resource " + swarmID + " exists already in the filesystem.");
                                //前端提示用户(已经接收过该文件)
                        		contents = "已接收过该文件!";
                        		$.fillTipBox({type:'danger', icon:'glyphicon-alert', content:contents});
                        		
                                thi$.blockMaps[swarmID].fs = true;
                                var availabilityMap = thi$.blockMaps[swarmID].availabilityMap;
                                var chunkIDs = availabilityMap.getChunkIDs();
                                console.log(chunkIDs);
                                var seeder = availabilityMap.seeder;
                                var haveMessage = new com.webrtc.protocol.Have(swarmID, seeder, availabilityMap, chunkIDs);
                                console.log(haveMessage);
                                var encodedMsg = com.webrtc.protocol.BinaryProtocol.encode([haveMessage]);
                                //com.webrtc.send(originID, encodedMsg);
                                 com.webrtc.app.usersessionlist[SessionID].Send(originID, SessionID,encodedMsg);
                                if (!seeder) {
                                    var requestMessage = new com.webrtc.protocol.Request(swarmID, chunkIDs);
                                    var encodedMsg2 = com.webrtc.protocol.BinaryProtocol.encode([requestMessage]);
                                    //com.webrtc.send(originID, encodedMsg2);
                                     com.webrtc.app.usersessionlist[SessionID].Send(originID, SessionID,encodedMsg2);
                                }

                                return;

                            }else{ //file doesn't exist
                                console.log("Resource " + swarmID + " doesn't exist in the filesystem.");
                                if(freeSpace > fileSize){ //we have enough space let's create the resource
                                    com.webrtc.FSio.createResource(swarmID,function(succ){
                                        thi$.fileInfoList[name] = new com.webrtc.protocol.FileInfo(swarmID, fileSize, hashes, blockSize, origin, name, lastModified, type);
                                        thi$.fileInfoMap[swarmID] = name;
                                        thi$.fileOriginID[swarmID] = originID;
                                        thi$.fileFlag[swarmID] = -1;
                                        thi$.blockMaps[swarmID] = new com.webrtc.BlockMap(swarmID, fileSize, blockSize);
                                        thi$.blockMaps[swarmID].addMetadata({name:name});
                                    
                                        if(succ){
                                            thi$.blockMaps[swarmID].fs = true;
                                        }else{
                                            thi$.blockMaps[swarmID].fs = false;
                                        }

                                        console.log(thi$.blockMaps[swarmID]);
                                        // var haveMessage = new com.webrtc.protocol.Have(swarmID, false, false, null);
                                        // var encodedMsg = com.webrtc.protocol.BinaryProtocol.encode([haveMessage]);
                                        // com.webrtc.send(encodedMsg);
                                        var chunkIDs = thi$.blockMaps[swarmID].availabilityMap.getChunkIDs();
                                        var requestMessage = new com.webrtc.protocol.Request(swarmID, chunkIDs);
                                        var encodedMsg2 = com.webrtc.protocol.BinaryProtocol.encode([requestMessage]);
                                        //com.webrtc.send(originID, encodedMsg2);

                                         com.webrtc.app.usersessionlist[SessionID].Send(originID,SessionID, encodedMsg2);
                                         thi$.judgeFull(swarmID,originID,SessionID);
                                    });
                                }else{ //we don't have enough space, try #1
                                    com.webrtc.FSio.removeRootDir(function(){
                                        com.webrtc.FSio.queryQuota(function(succ,usage,quota){
                                            if(quota - usage > fileSize){ //we have enough space let's create the resource
                                                com.webrtc.FSio.createResource(swarmID,function(succ){
                                                    if(succ){
                                                        thi$.blockMaps[swarmID].fs = true;
                                                    }else{
                                                        thi$.blockMaps[swarmID].fs = false;
                                                    }
                                                });
                                            }else{ //we don't have enough space, try #2
                                                com.webrtc.FSio.requestQuota(fileSize + usage,function(succ,freeSpace){
                                                    if(succ){
                                                        if(freeSpace > fileSize){ //we have enough space let's create the resource
                                                            com.webrtc.FSio.createResource(swarmID,function(succ){
                                                                if(succ){
                                                                    thi$.fs = true;
                                                                }else{
                                                                    thi$.fs = false;
                                                                }
                                                            });
                                                        }else{ //we don't have enough space, try #3
                                                            console.log("We don't have enough space for the file");
                                                            com.webrtc.config.USE_FS = false;
                                                        
                                                        //TODO: fallback to no filesystem
                                                        }
                                                    }
                                                });
                                            }
                                        })
                                    });
                                }

                            }
                            
                        })
                    }else{ //failed to create filesystem
                        console.log("failed to create the filesystem");
                        com.webrtc.config.USE_FS = false;
                    }
                });
            }

                }
            }
        );


      //   if (!confirm("同意接收文件:" + name + fileSize)) {
      // //  if(!true){
      //      // this.refuse();
      //   } else {
           
      //       if (!com.webrtc.config.USE_FS) {
      //           for (var key in this.fileInfoList) {
      //               if (key == name) {
      //                   if (this.fileInfoList[name].swarmID == swarmID) {
      //                       console.log("file " + name + " exists already");
      //                       var blockMap = this.blockMaps[swarmID];
      //                       var seeder = blockMap.availabilityMap.seeder;
      //                       if (seeder) {
      //                           var haveMessage = new com.webrtc.protocol.Have(swarmID, seeder);
      //                           var encodedMsg = com.webrtc.protocol.BinaryProtocol.encode([haveMessage]);
      //                           //com.webrtc.send(originID, encodedMsg);
      //                           com.webrtc.app.usersessionlist[SessionID].Send(originID,SessionID,encodedMsg);
      //                       } else {
      //                           var availabilityMap = blockMap.availabilityMap;
      //                           var chunkIDs = availabilityMap.getChunkIDs();
      //                           var haveMessage = new com.webrtc.protocol.Have(swarmID, seeder, availabilityMap, chunkIDs);
      //                           var encodedMsg = com.webrtc.protocol.BinaryProtocol.encode([haveMessage]);
      //                          // com.webrtc.send(originID, encodedMsg);
      //                           com.webrtc.app.usersessionlist[SessionID].Send(originID,SessionID,encodedMsg);
                            
      //                           var requestMessage = new com.webrtc.protocol.Request(swarmID, chunkIDs);
      //                           var encodedMsg2 = com.webrtc.protocol.BinaryProtocol.encode([requestMessage]);
      //                           //com.webrtc.send(originID, encodedMsg2);
      //                           com.webrtc.app.usersessionlist[SessionID].Send(originID,SessionID,encodedMsg2);
                            
      //                       }
      //                       return;
      //                   }
      //                   else {
      //                   //to be motified
      //                       name = name.split('.')[0] + '(2)' + name.split('.')[1];
      //                       // this.fileInfoList[name] = new com.webrtc.protocol.FileInfo(swarmID, fileSize, hashes, blockSize, origin, name, lastModified, type);
      //                       // this.blockMaps[swarmID] = new com.webrtc.BlockMap(swarmID, fileSize, blockSize);
      //                       // this.blockMaps[swarmID].addMetadata({name:name});
      //                       // console.log(this.blockMaps[swarmID]);
      //                   }
      //               }
      //           }


      //           this.fileInfoList[name] = new com.webrtc.protocol.FileInfo(swarmID, fileSize, hashes, blockSize, origin, name, lastModified, type);
      //           this.fileInfoMap[swarmID] = name;
      //           this.fileFlag[swarmID] =-1;
      //           this.fileOriginID[swarmID] = originID;
      //           this.blockMaps[swarmID] = new com.webrtc.BlockMap(swarmID, fileSize, blockSize);
      //           // var haveMessage = new com.webrtc.protocol.Have(swarmID, false, false, null);
      //           // var encodedMsg = com.webrtc.protocol.BinaryProtocol.encode([haveMessage]);
      //           // com.webrtc.send(encodedMsg);
      //           this.blockMaps[swarmID].addMetadata({name:name});
      //           var chunkIDs = this.blockMaps[swarmID].availabilityMap.getChunkIDs();
      //           var requestMessage = new com.webrtc.protocol.Request(swarmID, chunkIDs);
      //           var encodedMsg2 = com.webrtc.protocol.BinaryProtocol.encode([requestMessage]);
                
      //           //com.webrtc.send(originID, encodedMsg2);
      //            com.webrtc.app.usersessionlist[SessionID].Send(originID, SessionID,encodedMsg2);
      //       }

      //       else {
      //           var thi$ = this;
      //           com.webrtc.FSio.requestQuota(fileSize,function(succ,freeSpace){
      //               if(succ){ //success to create filesystem
      //                   com.webrtc.FSio.isExist(swarmID,function(succ){
      //                       if(succ){ //file exists
      //                           console.log("Resource " + swarmID + " exists already in the filesystem.");
      //                           thi$.blockMaps[swarmID].fs = true;
      //                           var availabilityMap = thi$.blockMaps[swarmID].availabilityMap;
      //                           var chunkIDs = availabilityMap.getChunkIDs();
      //                           console.log(chunkIDs);
      //                           var seeder = availabilityMap.seeder;
      //                           var haveMessage = new com.webrtc.protocol.Have(swarmID, seeder, availabilityMap, chunkIDs);
      //                           console.log(haveMessage);
      //                           var encodedMsg = com.webrtc.protocol.BinaryProtocol.encode([haveMessage]);
      //                           //com.webrtc.send(originID, encodedMsg);
      //                            com.webrtc.app.usersessionlist[SessionID].Send(originID, SessionID,encodedMsg);
      //                           if (!seeder) {
      //                               var requestMessage = new com.webrtc.protocol.Request(swarmID, chunkIDs);
      //                               var encodedMsg2 = com.webrtc.protocol.BinaryProtocol.encode([requestMessage]);
      //                               //com.webrtc.send(originID, encodedMsg2);
      //                                com.webrtc.app.usersessionlist[SessionID].Send(originID, SessionID,encodedMsg2);
      //                           }

      //                           return;

      //                       }else{ //file doesn't exist
      //                           console.log("Resource " + swarmID + " doesn't exist in the filesystem.");
      //                           if(freeSpace > fileSize){ //we have enough space let's create the resource
      //                               com.webrtc.FSio.createResource(swarmID,function(succ){
      //                                   thi$.fileInfoList[name] = new com.webrtc.protocol.FileInfo(swarmID, fileSize, hashes, blockSize, origin, name, lastModified, type);
      //                                   thi$.fileInfoMap[swarmID] = name;
      //                                   thi$.fileOriginID[swarmID] = originID;
      //                                   thi$.fileFlag[swarmID] = -1;
      //                                   thi$.blockMaps[swarmID] = new com.webrtc.BlockMap(swarmID, fileSize, blockSize);
      //                                   thi$.blockMaps[swarmID].addMetadata({name:name});
                                    
      //                                   if(succ){
      //                                       thi$.blockMaps[swarmID].fs = true;
      //                                   }else{
      //                                       thi$.blockMaps[swarmID].fs = false;
      //                                   }

      //                                   console.log(thi$.blockMaps[swarmID]);
      //                                   // var haveMessage = new com.webrtc.protocol.Have(swarmID, false, false, null);
      //                                   // var encodedMsg = com.webrtc.protocol.BinaryProtocol.encode([haveMessage]);
      //                                   // com.webrtc.send(encodedMsg);
      //                                   var chunkIDs = thi$.blockMaps[swarmID].availabilityMap.getChunkIDs();
      //                                   var requestMessage = new com.webrtc.protocol.Request(swarmID, chunkIDs);
      //                                   var encodedMsg2 = com.webrtc.protocol.BinaryProtocol.encode([requestMessage]);
      //                                   //com.webrtc.send(originID, encodedMsg2);

      //                                    com.webrtc.app.usersessionlist[SessionID].Send(originID,SessionID, encodedMsg2);
      //                                    thi$.judgeFull(swarmID,originID,SessionID);
      //                               });
      //                           }else{ //we don't have enough space, try #1
      //                               com.webrtc.FSio.removeRootDir(function(){
      //                                   com.webrtc.FSio.queryQuota(function(succ,usage,quota){
      //                                       if(quota - usage > fileSize){ //we have enough space let's create the resource
      //                                           com.webrtc.FSio.createResource(swarmID,function(succ){
      //                                               if(succ){
      //                                                   thi$.blockMaps[swarmID].fs = true;
      //                                               }else{
      //                                                   thi$.blockMaps[swarmID].fs = false;
      //                                               }
      //                                           });
      //                                       }else{ //we don't have enough space, try #2
      //                                           com.webrtc.FSio.requestQuota(fileSize + usage,function(succ,freeSpace){
      //                                               if(succ){
      //                                                   if(freeSpace > fileSize){ //we have enough space let's create the resource
      //                                                       com.webrtc.FSio.createResource(swarmID,function(succ){
      //                                                           if(succ){
      //                                                               thi$.fs = true;
      //                                                           }else{
      //                                                               thi$.fs = false;
      //                                                           }
      //                                                       });
      //                                                   }else{ //we don't have enough space, try #3
      //                                                       console.log("We don't have enough space for the file");
      //                                                       com.webrtc.config.USE_FS = false;
                                                        
      //                                                   //TODO: fallback to no filesystem
      //                                                   }
      //                                               }
      //                                           });
      //                                       }
      //                                   })
      //                               });
      //                           }

      //                       }
                            
      //                   })
      //               }else{ //failed to create filesystem
      //                   console.log("failed to create the filesystem");
      //                   com.webrtc.config.USE_FS = false;
      //               }
      //           });
      //       }

        // }



        this.signalfile = true;

      //  this.judgeFull(swarmID);
    },

    receiveHaveMessage:function (haveMessage, originID,SessionID) {
            //ToDo: do we want to initialize RAMaps[swarmID] for every new havemessage?
        var swarmID = haveMessage.swarmID;
        var name = this.fileInfoMap[swarmID];
        console.log(haveMessage);
        //前端提示用户(对端已经接收过该文件)
		contents = "对端已接收该文件!不要重复发送";
		$.fillTipBox({type:'danger', icon:'glyphicon-alert', content:contents});
		//删除该文件
		removeFile (name,originID);
		
        if (typeof this.remoteAvailabilityMaps[swarmID][originID] == "undefined") {
            var blockMap = this.blockMaps[swarmID];
            this.remoteAvailabilityMaps[swarmID][originID] = new com.webrtc.AvailabilityMap(blockMap.getNumOfChunks());
        }
        if (haveMessage.availabilityMap)
            this.remoteAvailabilityMaps[swarmID][originID].Copy(haveMessage.availabilityMap);
        else if (haveMessage.seeder)
            this.remoteAvailabilityMaps[swarmID][originID].setSeeder();
        else {
            this.remoteAvailabilityMaps[swarmID][originID].Update(haveMessage.chunkIDs);
        }
    },

    receiveRequestMessage:function (requestMessage, originID,SessionID) {
        var swarmID = requestMessage.swarmID;
        var chunkIDs = requestMessage.chunkIDs;
        console.log(requestMessage);
        var thi$ = this;
        var pre = 0;

        if(this.fileFlag[swarmID] == -1){
            this.fileFlag[swarmID] = chunkIDs.length;
        }
        this.handleChunk(swarmID,chunkIDs,originID,pre,SessionID);       
    },
    
    //收到对端拒绝接收文件
    receiveCancelMessage:function (cancelMessage, originID,SessionID) {
        
    	//have problem ?
    	var swarmID = cancelMessage.swarmID;
        var chunkID = cancelMessage.chunkID;
        var name = this.fileInfoMap[swarmID];
        
        //调用init.js的拒绝接受文件代码
        com.webrtc.cancelsending(name,originID,SessionID);
           
    },
    
    receiveFinishMessage:function(finishMessage,originID,SessionID){
          console.log(finishMessage);

        //发送方接收到 接受方 的 finish 消息，表明接收方已经接受完毕。
        var swarmID = finishMessage.swarmID;
        var name = this.fileInfoMap[swarmID];
        com.webrtc.sendfilefinish(name,originID,SessionID);

        
    },
    
    
    

    handleChunk : function (swarmID,chunkIDs,originID, pre,SessionID){
        var thi$ = this;
        var newchunkids = [];
        newchunkids = chunkIDs.slice(pre, pre+com.webrtc.config.MAX_PENDING_CHUNKS);
     //   console.log("chunkIDs  "+chunkIDs + "newchunkids " + newchunkids);
        this.sendChunk(swarmID,newchunkids,0,originID,chunkIDs.length,pre,SessionID);
        if (pre + com.webrtc.config.MAX_PENDING_CHUNKS - 1 < chunkIDs.length)
        {           
            setTimeout(function (swarmID, chunkIDs, originID, pre) {
                console.log("set time out " + pre);
                thi$.handleChunk(swarmID,chunkIDs,originID,pre,SessionID);
            },com.webrtc.config.PC_RESEND_INTERVAL*200,swarmID,chunkIDs,originID,pre+com.webrtc.config.MAX_PENDING_CHUNKS);
        }
    },

    handleMessage : function(message, originID,SessionID) {
        var unpackedMessage = com.webrtc.protocol.BinaryProtocol.decode(message);


        for (var i = 0; i < unpackedMessage.length; ++i) {
            switch (unpackedMessage[i].tag) {
                case com.webrtc.protocol.FILE_INFO:
         //           console.log(i + "receiveFileInfoMessage " + originID);
                    this.receiveFileInfoMessage(unpackedMessage[i], originID,SessionID);
                    break;
                case com.webrtc.protocol.P2P_HAVE:
         //           console.log("receiveHaveMessage " + originID);
                    this.receiveHaveMessage(unpackedMessage[i], originID,SessionID);  
                    break;
                case com.webrtc.protocol.P2P_REQUEST:
         //           console.log("receiveRequestMessage " + originID);
                    this.receiveRequestMessage(unpackedMessage[i], originID,SessionID);
                    break;
                case com.webrtc.protocol.P2P_DATA:
                    console.log("receiveDataMessage " + originID+SessionID);
                    this.receiveDataMessage(unpackedMessage[i], originID,SessionID);
                    break;
                case com.webrtc.protocol.P2P_CANCEL:
                	console.log("receiveCancelMessage "+originID+SessionID);
                	this.receiveCancelMessage(unpackedMessage[i], originID,SessionID);
                    break;
                case com.webrtc.protocol.FILE_FINISH:
                    console.log("receiveFinishMessage "+originID);
                    this.receiveFinishMessage(unpackedMessage[i],originID,SessionID);
                    break;
            }
        }
    },

    readFromLocal : function() {
        var storage = window.localStorage;
        for (var i=0, len = storage.length; i < len; i++){
            var key = storage.key(i);
            var value = storage.getItem(key);
            var BlockMap = JSON.parse(value);
            var swarmID = BlockMap.resourceId;
            var fileSize = BlockMap.fileSize;
            var sliceSize = BlockMap.blockSize;
            this.blockMaps[swarmID] = new com.webrtc.BlockMap(swarmID, fileSize, sliceSize);
            this.blockMaps[swarmID].availabilityMap = BlockMap.availabilityMap;
            this.blockMaps[swarmID].fs = BlockMap.fs;
            this.blockMaps[swarmID].metadata = BlockMap.metadata;
            this.blockMaps[swarmID].numOfVerifiedChunks = BlockMap.numOfVerifiedChunks;
            this.blockMaps[swarmID].privateBlockMap = BlockMap.privateBlockMap;
            
            console.log(this.blockMaps[swarmID]);
        }

    }
}

function fileInfo(file, uuid){
    var fi = {};
    fi.name = file.name;
    fi.size = file.size;
    fi.id = uuid;
    fi.state = '2';//0:上传完成空闲, 1:正在发送, 2:正在上传
    // fi.upLoad = new taskBlock(filename.size);
    fi.expire = (new Date()).getTime();
    if(uuid != false)
        return fi;
    else
        return false;
}

