(function(){
    com.webrtc.WConnection = Object.subClass({
        ctor : function(Config) {

            this.label ="webrtc";
            this.Confs = Config;

            this.ice = this.Confs.ice;
            this.con = this.Confs.con;
            this.usedatachannel = this.Confs.booldatachannel;
            
            this.peerConnection =null;

            this.sendMessageToModule = null;
            this.sendICEToModule = null;
            this.getRemoteStream = null;
            

            this.RemoteCandidates = new Array();

            this.dataChannel = null;
            this.dataChannelConstraints = null;

            this.sendDataChannelStateChangeToModule = null;
            this.sendDataToModule = null;

			this.initiatePeerConnection();

        },

        initiatePeerConnection : function() {
            this.initiatePeerConnectionCallbacks();
            this.createPeerConnection();
            this.initiateDataChannelCallbacks();
            if(this.usedatachannel)
            {
                
               
                this.createDataChanel();
                this.setDataChannelEvents();
            }
        },

        setDataChannelEvents : function(){
            this.dataChannel.onmessage = this.onMessageCallback;
            this.dataChannel.onopen = this.onDataChannelReadyStateChange;
            this.dataChannel.onclose = this.onDataChannelClose;
            this.dataChannel.onerror = this.onDataChannelError;

        },

        createDataChanel :function(){
            this.dataChannelConstraints ={ reliable:true };
            this.dataChannel = this.peerConnection.createDataChannel(this.label, this.dataChannelConstraints);
        },

        initiateDataChannelCallbacks : function(){
            var thi$ = this;
            this.onMessageCallback = function(event){
           //     console.log("receive data from datachannel in Connection");
                var message = com.webrtc.base64.decode(event.data);
                thi$.sendDataToModule(message);
                
            };

            this.onDataChannelReadyStateChange = function(event){
                console.log(event.target.readyState);
                thi$.sendDataChannelStateChangeToModule(event);

            };

            this.onDataChannelClose = function(event){
                thi$.disConnectDataChannel();
            };

            this.onDataChannelError = function(event){
                console.log(event);
            };
        },

        createPeerConnection : function () {
			this.peerConnection = new RTCPeerConnection(this.ice,this.con);
            this.peerConnection.onicecandidate = this.iceCallBack;
            this.peerConnection.onaddstream = this.onAddRemoteStream;
            this.peerConnection.onremovestream = this.onRemoveRemoteStream;
            this.peerConnection.ondatachannel = this.onCreateDataChannel;
        },

        initiatePeerConnectionCallbacks : function() {
            var thi$ = this;
            this.setLocalSDPAndSendMessage = function(sessionDescription) {
                console.log(sessionDescription);
                LSDP = sessionDescription;

                //thi$.peerConnection.setLocalDescription(sessionDescription); 
                thi$.sendMessageToModule(sessionDescription);
            },

            this.errorCallBack = function(event){
                console.log(event);
            },

            this.iceCallBack = function(event){             
                thi$.sendICEToModule(event);
            };

            this.onAddRemoteStream = function(event){
  
                thi$.getRemoteStream(event.stream);
            };

            this.onRemoveRemoteStream = function(event){

                console.log("onRemoveRemoteStream");
            }; 
            this.onCreateDataChannel = function(event){
                console.log("onCreateDataChannel");
                if (thi$.dataChannel != null && thi$.dataChannel.readyState != 'closed') {
                    console.log('Received DataChannel, but we already have one.');
                    return;
                }
                thi$.dataChannel = event.channel;
                thi$.setDataChannelEvents();
            };
        },

        AddStream : function(stream){
        	this.peerConnection.addStream(stream);
        },
        
        CreateOffer: function(type){
        	var constraints = new PeerConnectionConstraints(type);
			this.peerConnection.createOffer(this.setLocalSDPAndSendMessage, this.errorCallBack, constraints);

        },
        CreateAnswer: function(type){
            var constraints = new PeerConnectionConstraints(type);
            this.peerConnection.createAnswer(this.setLocalSDPAndSendMessage, this.errorCallBack, constraints);

        },
        SendDataToDataChannel :function(data)
        {
        //    console.log("send data to datachannel in Connection");
            this.dataChannel.send(data);

        },

        SetLocalDescription : function(description)
        {
            this.peerConnection.setLocalDescription(description);
        },

        SetRemoteDescription : function(description)
        {
            this.peerConnection.setRemoteDescription(description);
        },
        AddIceCandidateAgain :function()
        {

            try{
                for(var i = 0; i< this.RemoteCandidates.length; ++i){
                    this.peerConnection.addIceCandidate(this.RemoteCandidates[i]);
                } 
            } catch(e){
                console.log("Can't send a answer, maybe the peerconnection is disconnected!");
            }
           
        },
        AddIceCandidate :function(candidate)
        {
            this.peerConnection.addIceCandidate(candidate);
        },

        disConnectPeerConnection : function() {
            if(this.peerConnection.signalingState != "closed"){
                console.log("handling peer disconnection: closing the peerconnection");
                this.peerConnection.close();
            }
        },
        disConnectDataChannel :function(){
            if(this.dataChannel.readyState != "closed"){
                console.log("handling peer disconnection: closing the datachannel");
                this.dataChannel.close();
            }
            this.disConnectPeerConnection();
        }



    })



})();


