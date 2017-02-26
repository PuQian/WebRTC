(function(){
    com.webrtc.WAppBase = Object.subClass({

        ctor : function() {
            
            this.sigConnected = null;
            this.usersessionlist={};
            this.BindEvent();
            this.OnNotify = null;
           
        },

        init : function(notify){
            this.sigConnected = $(com.webrtc.sigSession);
            this.OnNotify = notify;
        }, 
        
        AddSession : function (UserSession) {
            console.log("add UserSession UserSession.SessionID="+UserSession.SessionID);
            this.usersessionlist[UserSession.SessionID]=UserSession;
            console.log("add UserSession Successfully");
             
        },

        RemoveSession : function(SessionID) {
            var result = false ;
          
            if(typeof this.usersessionlist[SessionID]!= "undefined"
                &&
                    this.usersessionlist[SessionID] !=null)
                {
                    this.usersessionlist[SessionID] =null;
                    result = true;
                }
            return result;
        },

        isExistSession : function(SessionID){
            var result=false;
            if(typeof this.usersessionlist[SessionID]!= "undefined"
                &&
                    this.usersessionlist[SessionID] !=null)
            {
                
                    result = true;
            }
            return result;
        },


        BindEvent : function()
        {
            var thi$ = this;
            var $this = $(this);
            $this.bind(com.webrtc.events.RecvSig,function(event,message){

                thi$.OnRecvSig(message);
            });

            $this.bind(com.webrtc.events.RecvUserSession,function(event,message){

                thi$.OnRecvUserSession(message);
            });

        },

        OnRecvSig : function(message)
        {
            console.log("app receive message from sigSession :");
            console.log(message);
            var msg = JSON.parse(message.data);

            var SessionID = msg.sessionID;
            var RemoteID = msg.from;
           
			//来自总机
			if(RemoteID == "ARTI")
			{
				com.webrtc.app.usersessionlist[SessionID].HandleMessage(message);
				return;
			}
            
            if(msg.roap.type === com.webrtc.protocol.RTCRoapType['authreturn'])
            {
                if(msg.roap.msgContent == "success"){
                    com.webrtc.sigSession.Onsuccess();
                }
                return;
            }
          
            var $this=$(this);
            if(false == this.isExistSession(SessionID))
            {
                console.log("this Session is not exist");
                this.OnNotify(message);
            }
            else{
                console.log("this Session is exist");
                com.webrtc.app.usersessionlist[SessionID].HandleMessage(message);
            }           
        },

        OnRecvUserSession : function(message)
        {   
            console.log("app receive this message from UserSession,and send it to sigSession:");
            this.sigConnected.trigger(com.webrtc.events.SendSig,message);
        }

    });
})();