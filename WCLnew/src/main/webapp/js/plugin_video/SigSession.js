(function(){
    com.webrtc.WSigSessionBase = Object.subClass({
        /** @Public Methods*/
        ctor : function() {

            this.appConnected = null;
            this.serverHost= null;
            this.userName = null;
            this.token =   null;
            this.SigConnection = null;
            this.BindEvent();
            this.initiateCallbacks();
        },
        
        Login : function() {

            this.appConnected = $(com.webrtc.app);
            this.serverHost=com.webrtc.sigSessionConfig.serverhost;
            this.userName = com.webrtc.sigSessionConfig.username;
            this.token =    com.webrtc.sigSessionConfig.token;
            
            if(this.SigConnection  == null){
                this.SigConnection = new CometdConnection(this.serverHost, this.userName);
            }
            else{
                this.SigConnection.setHostAddress(this.serverHost);
                this.SigConnection.setUserName(this.userName);
            }

            this.SigConnection.onHandleMessage = this.HandleMessage;
            this.SigConnection.onConnectionOpened = this.OnConnectOpened;
            this.SigConnection.onLoginSuccess = this.Onsuccess;
            this.SigConnection.onConnectionError = this.OnFail ;
            this.SigConnection.onLogoutFinish = this.OnLogoutFinish; 
            this.SigConnection.connect();
        },

        Logout : function() {
            
            this.SigConnection.onLogoutFinish = this.OnLogoutFinish; 

            this.SigConnection.close();
            this.SigConnection.onHandleMessage = null;
            this.SigConnection.onConnectionOpened =  null;
            this.SigConnection.onLoginSuccess =  null;
            this.SigConnection.onConnectionError =  null;

        },


        BindEvent : function()
        {
            var thi$ = this;
            var $this = $(this);
            $this.bind(com.webrtc.events.SendSig,function(event,message){

                thi$.OnSendSig(message);
            });
        },

        OnSendSig : function(message)
        {   
            console.log("sigSession receive this message ,and send it to wcs :");
            console.log(message);
            this.SigConnection.sendMessage(message);
        },

        initiateCallbacks : function() {
            var thi$ = this;
            var $this = $(this);

            this.HandleMessage = function(message){   
                thi$.appConnected.trigger(com.webrtc.events.RecvSig,message);
            },

            this.OnConnectOpened = function(){

                console.log("onConnectionOpened!");
                setTimeout(function(){
                    var rtcMsg = new com.webrtc.protocol.RTCMessage(com.webrtc.protocol.RTCMsgType["register"], com.webrtc.protocol.RTCRoapType["auth"], null, null,null,"wcs");
                    console.log("send auth message: " + JSON.stringify(rtcMsg));
                    thi$.OnSendSig(rtcMsg);
                    },1000);
            },

            this.OnLogoutFinish = function(){
                  console.log("logout finish");
                  $this.trigger(com.webrtc.SigSessionEvents.LogoutFinish);

            },
            this.Onsuccess =function(){
                  console.log("login success!");
                    $this.trigger(com.webrtc.SigSessionEvents.LoginSuccess);
            },
            this.OnFail = function(){
                    console.log("login fail!");
                    $this.trigger(com.webrtc.SigSessionEvents.LoginFail);
            }

        }

        
    })
})();