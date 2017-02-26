(function (exports) {

    com.webrtc.AvailabilityMap = Object.subClass({
        ctor:function (numOfChunks, seeder) {
            
            this.seeder = seeder;
            this.length = numOfChunks; 
            this.chunkmap = [];
            this.verifiedChunks = 0;
            if (seeder) {
                for(var i=0;i<this.length;++i)
                    this.chunkMap[i] = true;
            }
            else {
                for (var i =0; i<this.length; i++) 
                    this.chunkmap[i] = false; 
            }
        },

        /** @Public Methods*/
        //query whether id is on
        has:function (id) {
            if(this.isFull()) return true;
            return this.chunkmap[id];
        },

        set:function (id) {
            if (!this.has(id)) {
                this.chunkmap[id] = true;
                this.verifiedChunks++;
                if (this.verifiedChunks == this.length)
                    this.seeder = true;
            }
        },

        getChunkIDs:function () {
            var chunkIDs = [];
            for (var i = 0; i < this.length; i++) {
                if (this.chunkmap[i] == false)
                    chunkIDs.push(i);
            }
            return chunkIDs;
        },

        setSeeder:function (id) {
            this.verifiedChunks = this.length;
        },

        isFull:function () {
            return this.verifiedChunks == this.length;
        },

        Copy:function (chunkmap) {
            this.chunkmap = chunkmap;
            var verifiedChunks = 0;
            for(var i=0; i < chunkmap.length; ++i){
                if(this.has(i)){
                    verifiedChunks++;
                }
            }
            this.verifiedChunks = verifiedChunks;
        },

        Update:function (chunkIDs) {
            for (var i = 0; i < chunkIDs; ++i) {
                this.set(chunkIDs);
            }
            this.verifiedChunks += chunkIDs.length;
        }
    });
})();

