(function(){
    com.webrtc.FSio = Object.subClass({
        ctor:function () {
            this.writeQueue = new Queue();
            this.registerEvents();
            this.pendingObjectUrlCb = {};
            this.finishWriteCbs = [];
//            this.removeAll(function(){window.webkitRequestFileSystem(window.TEMPORARY, peer5.config.FS_SIZE, this.onInitFs, this.errorHandler);});
//            window.webkitRequestFileSystem(window.TEMPORARY, peer5.config.FS_SIZE, this.onInitFs, this.errorHandler);
        },

        createResource:function(resourceId,cb,single){ //single:true - single file, :false a directory
            console.log("Adding resource " + resourceId + " to the filesystem.");
            var thi$ = this;
            this.fs.root.getFile(com.webrtc.config.FS_ROOT_DIR + resourceId,{create:true},function(fileEntry){
                if(cb) cb(true);
            },function(e){thi$.errorHandler(e);if(cb) cb(false);});
        },

        removeResource:function(resourceId,cb){ //implementation supports single file only
            console.log("Removing resource " + resourceId + " from the filesystem.");
            var thi$ = this;
            this.fs.root.getFile(com.webrtc.config.FS_ROOT_DIR + resourceId,{create:false},function(fileEntry){
                fileEntry.remove(function(){
                    if(cb) cb(true);
                },function(e){thi$.errorHandler(e);if(cb) cb(false);})
            },function(e){thi$.errorHandler(e);if(cb) cb(false);})
        },

        renameResource:function(oldResourceId,newResourceId,cb){
            console.log("changing resource name from " + oldResourceId + " to " + newResourceId);
            var thi$ = this;
            this.fs.root.getDirectory(com.webrtc.config.FS_ROOT_DIR,{create:false},function(dirEntry){
                dirEntry.getFile(oldResourceId,{create:false},function(fileEntry){
                    fileEntry.moveTo(dirEntry,newResourceId,function(succ){
                        if(succ) console.log("succesfully renamed");
                        if(cb) cb(succ);
                    },function(e){thi$.errorHandler(e);if(cb) cb(false);});
                },function(e){thi$.errorHandler(e);if(cb) cb(false);});
            },function(e){thi$.errorHandler(e);if(cb) cb(false);});
        },

        write:function(resourceId,data,position, cb){    //implementation supports single file only
            // console.log("Writing to resource " + resourceId);
            if(this._writeAvailable()){
                this._write(resourceId,data,position,cb);
            }
            this._addWriteCommand(resourceId,data,position,cb);
        },

        //supports only a TBD:max size, (reading more than 100MB at a time crashes the browser)
        //cb(success,data), data is Uint8Array
        read:function(resourceId,startPosition,endPosition,cb){
            var thi$ = this;
            this.fs.root.getFile(com.webrtc.config.FS_ROOT_DIR + resourceId, {}, function(fileEntry) {

                // Get a File object representing the file,
                // then use FileReader to read its contents.
                fileEntry.file(function(file) {
                    var reader = new FileReader();

                    reader.onloadend = function(evt) {
                        if (evt.target.readyState == FileReader.DONE) { // DONE == 2
                            if(cb) cb(true,new Uint8Array(evt.target.result));
                        };
                    }

                    var blob = file.slice(startPosition,endPosition);
                    reader.readAsArrayBuffer(blob);

                }, function(e){thi$.errorHandler(e);if(cb) cb(false);});
            }, function(e){thi$.errorHandler(e);if(cb) cb(false);});
        },

        //cb(succ,details)
        //details = {size:#}
        getResourceDetails:function(resourceId,cb){
            var thi$ = this;
            this.fs.root.getFile(com.webrtc.config.FS_ROOT_DIR + resourceId, {}, function(fileEntry) {
                // Get a File object representing the file,
                fileEntry.file(function(file) {
                    cb(true,{size:file.size});
                }, function(e){thi$.errorHandler(e);if(cb) cb(false);});
            }, function(e){thi$.errorHandler(e);if(cb) cb(false);});
        },

        //cb(success,objectUrl)
        createObjectURL:function(resourceId,cb){
            var thi$ = this;
            if(this.writeQueue.isEmpty() < 0)
            {
                this.pendingObjectUrlCb[resourceId] = cb;
            }
            else{
                this.fs.root.getFile(com.webrtc.config.FS_ROOT_DIR + resourceId, {}, function(fileEntry) {
                    console.log("queue size: " + thi$.writeQueue.getLength());
                    if(cb) cb(true,fileEntry.toURL());
                }, function(e){thi$.errorHandler(e);if(cb) cb(false);});
            }
        },

        notifyFinishWrite:function(cb){
            if(this.writeQueue.getLength() <= 0)
                cb();
            this.finishWriteCbs.push(cb);
        },

        isExist:function(resourceId,cb){
            console.log("Checking if resource " + resourceId + " exists in the filesystem.");
            var thi$ = this;
            this.fs.root.getFile(com.webrtc.config.FS_ROOT_DIR + resourceId,{create:false},function(fileEntry){
                if(cb) cb(true);
            },function(e){thi$.errorHandler(e);if(cb) cb(false);});
        },

        listFiles:function(cb){
            var thi$ = this;
            var dirReader = this.fs.root.createReader();
            dirReader.readEntries(function(entries) {
                if (!entries.length) {
                    console.log("Filesystem is empty")
                } else {
                    console.log("Filesystem files: " + entries);
                }
                cb(true,entries);
            }, function(e){thi$.errorHandler(e);if(cb) cb(false);});
        },

        removeAll:function(cb){
            console.log("removing all files in filesystem");
            var thi$ = this;
            var dirReader = this.fs.root.createReader();
            dirReader.readEntries(function(entries) {
                for (var i = 0, entry; entry = entries[i]; ++i) {
                    if (entry.isDirectory) {
                        entry.removeRecursively(function() {if(cb) cb(true);}, function(e){thi$.errorHandler(e);if(cb) cb(false);});
                    } else {
                        entry.remove(function() {if(cb) cb(true);}, function(e){thi$.errorHandler(e);if(cb) cb(false);});
                    }
                }
                console.log('Directory emptied.');
            },function(e){thi$.errorHandler(e);if(cb) cb(false);} );
        },

        removeRootDir:function(cb){
            console.log("removing all files in filesystem under " + com.webrtc.config.FS_ROOT_DIR);
            var thi$ = this;
            var dirReader = this.fs.root.createReader();
            dirReader.readEntries(function(entries) {
                for (var i = 0, entry; entry = entries[i]; ++i) {
                    if (entry.isDirectory && entry.name + '/' == com.webrtc.config.FS_ROOT_DIR) {
                        entry.removeRecursively(function() {
                            thi$.fs.root.getDirectory(com.webrtc.config.FS_ROOT_DIR,{create:true},function(dirEntry){
                                cb(true);
                            },thi$.errorHandler)
                        }, function(e){thi$.errorHandler(e);if(cb) cb(false);});
                    }
                }
                console.log('Directory emptied.');
            },function(e){thi$.errorHandler(e);if(cb) cb(false);} );
        },

        //cb(succ,freespace)
        requestQuota:function(size,cb){
            console.log("requesting quota size = " + size);
            var thi$ = this;
            var requestSize = 1.1*size; //taking 10% overhead
           //临时存储
           window.webkitRequestFileSystem(window.TEMPORARY, requestSize, function(fs){
                thi$.onInitFs(fs);
                thi$.queryQuota(function(succ,usage,quota){
                        cb(true,quota-usage);
                })
            },function(e){thi$.errorHandler(e);if(cb) cb(false);});
        
          //持久存储
        //     navigator.webkitPersistentStorage.requestQuota (
        //         requestSize,
                
        //         function(grantedBytes) {  
        //             window.webkitRequestFileSystem(
        //                 PERSISTENT, 
        //                 grantedBytes, 
        //                 function(fs){
        //                     thi$.onInitFs(fs);
        //                     thi$.queryQuota(
        //                         function(succ,usage,quota){
        //                             cb(true,quota-usage);
        //                         }
        //                     );
        //                 }, 
        //                 function(e){
        //                     thi$.errorHandler(e);if(cb) cb(false);
        //                 }
        //             );
        //         },
        //         function(e) 
        //         { 
        //             console.log('Error', e); 
        //         }
        //     );
        },

        //cb(succ,usage,quota)
        queryQuota:function(cb){
              //临时存储需要  
            navigator.webkitTemporaryStorage.queryUsageAndQuota(function(usage, quota) {
                console.log('Using: ' + (usage / quota) * 100 + '% of temporary storage');
                if(cb)
                    cb(true,usage,quota);
            }, function(e) {
                console.log('Error', e);
                if(cb)
                    cb(false);
            });

            //持久存储需要
            // navigator.webkitPersistentStorage.queryUsageAndQuota(function(usage, quota) {
            //     console.log('Using: ' + (usage / quota) * 100 + '% of temporary storage');
            //     if(cb)
            //         cb(true,usage,quota);
            // }, function(e) {
            //     console.log('Error', e);
            //     if(cb)
            //         cb(false);
            // });

        },

        _writeAvailable:function(){
            return (this.writeQueue.isEmpty())
        },

        _write:function(resourceId,data,position,cb){
            var thi$ = this;
            this.fs.root.getFile(com.webrtc.config.FS_ROOT_DIR + resourceId,{create:false},function(fileEntry){
                fileEntry.createWriter(function (fileWriter) {
                    if(position > fileWriter.length){
                        console.log("truncating: filewriter length = " + fileWriter.length + " position = " + position)
                        fileWriter.truncate(position);
                        thi$._write(resourceId,data,position,cb); //after truncate a new fileWriter need to be created
                    }else{
                        fileWriter.onwriteend = function (evt) {
                            if(evt.currentTarget.error)
                                thi$.errorHandler(evt.currentTarget.error);
                            thi$.writeQueue.dequeue(); //dequeue the finished command
                            // console.log("onwriteend: writeQueue length = " + thi$.writeQueue.getLength());
                            if(cb) cb(true);
                            if(!thi$.writeQueue.isEmpty()){
                                var writeCommand = thi$.writeQueue.getHead(); //getting the next command
                                thi$._write(writeCommand.resourceId,writeCommand.data,writeCommand.position,writeCommand.cb);
                            }else{                                
                                console.log("finished writing all the commands in command queue");
                                // var storage = window.localStorage;
                                // if(!storage.getItem(resourceId))
                                //     storage.setItem(resourceId, JSON.stringify(com.webrtc.file.blockMaps[resourceId]));
                                
                                // console.log("writeQueue is empty, pendingObjectUrlCb = " + thi$.pendingObjectUrlCb[resourceId]);
                                // if(thi$.pendingObjectUrlCb[resourceId]){
                                //     thi$.createObjectURL(resourceId,thi$.pendingObjectUrlCb[resourceId]);
                                //     delete thi$.pendingObjectUrlCb[resourceId];
                                // }
                                // for(var i=0;i<thi$.finishWriteCbs.length;++i){
                                //     thi$.finishWriteCbs[i](resourceId);
                                // }
                                // thi$.finishWriteCbs = [];
                            }
                        };

                        fileWriter.onerror = function (evt){
                            console.log("write error " + evt);
                        };
                        // console.log("data size = " + data.size + " fileWriter.length = " + fileWriter.length + " position = " + position);
                        fileWriter.seek(position);
                        fileWriter.write(data); //assuming data is of type blob
                    }
                },function(e){thi$.errorHandler(e);if(cb) cb(false);});
            },function(e){thi$.errorHandler(e);if(cb) cb(false);});
        },

        _addWriteCommand:function(resourceId,data,position,cb){
            var writeCommand = {resourceId:resourceId,data:data,position:position,cb:cb};
            this.writeQueue.enqueue(writeCommand);
        },

        registerEvents:function(){
            var thi$ = this;
            this.onInitFs = function(fs){
                thi$.fs = fs;
                fs.root.getDirectory(com.webrtc.config.FS_ROOT_DIR,{create:true},function(dirEntry){
                    console.log("initiated filesystem");
                },thi$.errorHandler)
            };

            this.errorHandler = function (e) {
                var msg = '';
                switch (e.name) {
                    case FileError.QUOTA_EXCEEDED_ERR:
                        msg = 'QUOTA_EXCEEDED_ERR';
                        break;
                    case FileError.NOT_FOUND_ERR:
                        msg = 'NOT_FOUND_ERR';
                        break;
                    case FileError.SECURITY_ERR:
                        msg = 'SECURITY_ERR';
                        break;
                    case FileError.INVALID_MODIFICATION_ERR:
                        msg = 'INVALID_MODIFICATION_ERR';
                        break;
                    case FileError.INVALID_STATE_ERR:
                        msg = 'INVALID_STATE_ERR';
                        break;
                    default:
                        msg = 'Unknown Error';
                        break;
                };
                console.log('File system error: ' + msg);
            };
        }, 

        readFromDisk:function(){
            var thi$ = this;
            this.fs.root.getFile(com.webrtc.config.FS_ROOT_DIR + resourceId,{create:true, exclusive:true},function(fileEntry){
                fileEntry.createWriter(function (fileWriter) {
                    if(position > fileWriter.length){
                        console.log("truncating: filewriter length = " + fileWriter.length + " position = " + position)
                        fileWriter.truncate(position);
                        thi$._write(resourceId,data,position,cb); //after truncate a new fileWriter need to be created
                    }else{
                        fileWriter.onwriteend = function (evt) {
                            if(evt.currentTarget.error)
                                thi$.errorHandler(evt.currentTarget.error);
                            thi$.writeQueue.dequeue(); //dequeue the finished command
                            // console.log("onwriteend: writeQueue length = " + thi$.writeQueue.getLength());
                            if(cb) cb(true);
                            if(!thi$.writeQueue.isEmpty()){
                                var writeCommand = thi$.writeQueue.getHead(); //getting the next command
                                thi$._write(writeCommand.resourceId,writeCommand.data,writeCommand.position,writeCommand.cb);
                            }else{
                                console.log("finished writing all the commands in command queue");

                                // console.log("writeQueue is empty, pendingObjectUrlCb = " + thi$.pendingObjectUrlCb[resourceId]);
                                // if(thi$.pendingObjectUrlCb[resourceId]){
                                //     thi$.createObjectURL(resourceId,thi$.pendingObjectUrlCb[resourceId]);
                                //     delete thi$.pendingObjectUrlCb[resourceId];
                                // }
                                // for(var i=0;i<thi$.finishWriteCbs.length;++i){
                                //     thi$.finishWriteCbs[i](resourceId);
                                // }
                                // thi$.finishWriteCbs = [];
                            }
                        };

                        fileWriter.onerror = function (evt){
                            console.log("write error " + evt);
                        };
                        // console.log("data size = " + data.size + " fileWriter.length = " + fileWriter.length + " position = " + position);
                        fileWriter.seek(position);
                        fileWriter.write(data); //assuming data is of type blob
                    }
                },function(e){thi$.errorHandler(e);if(cb) cb(false);});
            },function(e){thi$.errorHandler(e);if(cb) cb(false);});
        }
    });

    com.webrtc.FSio = new com.webrtc.FSio();
})();
