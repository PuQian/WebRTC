(function(){
    com.webrtc.WUserSessionBase = Object.subClass({
        /** @Public Methods*/
        ctor : function() {

            this.SessionID = guid();
            this.appConnected = $(com.webrtc.app);

        },

        HandleMessage : function(message){
            this.handleMessage(message);          
        },

        SendMessage : function(message){
            this.appConnected.trigger(com.webrtc.events.RecvUserSession,message);
        },
        setSessionID:function(sessionID){
            this.SessionID=sessionID;
        }
    })

})();



function S4() {
   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
};

function guid() {
   return (S4()+S4()+S4()+S4()+S4()+S4()+S4()+S4());
};