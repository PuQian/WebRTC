com.webrtc.config = {
    LOG_LEVEL:2,
    MAX_PENDING_CHUNKS:60, //max number of chunks pending per peer
    MOZ_MAX_PENDING_CHUNKS:8, //max number of chunks pending per peer for mozilla
    CHUNK_SIZE:20000,
    BLOCK_SIZE:1024000,
    CHUNK_EXPIRATION_TIMEOUT:1500,
    REPORT_INTERVAL:10000,
    STAT_CALC_INTERVAL:1000,
    MONITOR_INTERVAL:1000,
    STUN_SERVERS:['stun.l.google.com:19302'],
    TURN_SERVERS:[],
    TURN_CREDENTIALS:[],
    P2P_PREFETCH_THRESHOLD:100,
    PC_FAIL_TIMEOUT:15000,
    PC_RESEND_INTERVAL:6,
    NEW_REQUEST:20000,
    SOCKET_RECONNECTION_INTERVAL:2000,

    ALLOWED_FILE_SIZE:250*1024*1024, //in bytes 250MB
    USE_FS:true,
    CACHE_SIZE:50000000, //in bytes
    FS_ROOT_DIR:'webrtc/',
    FS_SIZE: 4294967296//in bytes

};


com.webrtc.sigSessionConfig = {
   serverhost:null,
   username:null,
   token:null,
   gSeq:1,
   gMoreComing : false,     //是否允许发送pranswer
   msgSize:null, 
   msgContent:null
};


com.webrtc.UserSession = {
    TYPE :{
        P2P:"P2P",
        IMS:"IMS",
        MEETING:"MEETING"
    },

    MODULE_TYPE : {
        VIDEO                 : "video",  
        AUDIO                 : "audio",
        FILE                  : "file",
        IMSVIDEO              : "imsvideo",  
        IMSAUDIO              : "imsaudio",  
        VIDEOMEETING          : "videomeeting",
        AUDIOMEETING          : "audiomeeting"
    }

};

com.webrtc.TYPE ={
    VIDEO:"video",
    AUDIO:"audio"
};

com.webrtc.DOMAIN ={
    P2P:"@WebRTC",
    IMSGZDX:"@gd.ctcims.com",
    IMSBUPT:"@open-ims.com"
};




com.webrtc.events = {
    RecvSig : "RecvSig",
    SendSig : "SendSig",
    RecvUserSession : "RecvUserSession",
    SendUserSession : "SendUserSession"
};

com.webrtc.SigSessionEvents = {
    LoginSuccess : "LoginSuccess",
    LoginFail:"LoginFail",
    LogoutFinish:"LogoutFinish"
};

com.webrtc.AppEvents = {
    Notify : "Notify"
};



    
com.webrtc.Label = {
    VIDEO: "video",
    AUDIO:"audio"
};

com.webrtc.Session = {
    SESSION_STATUS : {
        "new"                 : 1,  
        "have-local-offer"    : 2,  
        "received-offer"      : 3,
        "have-remote-pranswer": 4,  
        "have-local-pranswer" : 5,  
        "active"              : 6,  
        "closed"              : 7
    },
    SESSION_ERROR : {
        "refused"             : 1,
        "offline"             : 2,
        "timeout"             : 3,
        "conflict"            : 4,
        "local-stream-failed" : 5,
        "remote-stream-failed": 6,
        "other"               : 7
    }
};

function Conf(sessiontype,moduletype,caller,booldtls,iceservers,booldatechannel){
    this.sessiontype =sessiontype;
    this.moduletype = moduletype;
    this.caller = caller;
    this.con = { 'optional': [{'DtlsSrtpKeyAgreement': booldtls}] };
    this.ice = { "iceServers": [iceservers] };
    this.booldatachannel = booldatechannel;
};


var gLog = true;

com.webrtc.Util = {
    debug : function(info){
        if(gLog == true){
            console.log(info);
        }
    },
    getUniqId : function(prefix){
        var uuid = null;
        uuid = new Date().getTime().toString(16);
        uuid += com.webrtc.gLocalUserID;
        uuid += Math.random();
        var ret = (prefix || "") + $.md5(uuid);
        return ret.substr(0, 32);
    }
}

//return true :test is {}
function isObjectNull(test) {
    if (typeof test === "object" && !(test instanceof Array)) {
        var hasProp = false;
        for (var prop in test) {
            hasProp = true;
            break;
        }
        if (hasProp) {
            return false;
        } else {
            return true;
        }
    }
    return false;

}
