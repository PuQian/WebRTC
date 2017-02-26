

/*
var Message = {
	"type" : "register/session-initiate/session-refuse/session-bye/ack/heartbeat",
	"from" : "alice@gmail.com",
	"to"   : "bob@gmail.com",
	"roap" : {
		"type"           : "offer/answer/ok/candidate/shutdown/error",
		"offerSessionId" : 1,
		"answerSessionId": 2,
		"seq"            : 1,
		"sdp"			 : {},
		"media"          : "audio/video"
		"label"          : {},
		"error"          : "",
		"moreComingFlag" : true,
		"tiebreaker"     : "123456"
	}
}
*/

com.webrtc.protocol = {
	/*
	* Func: define the sdp type
	*/
	RTCSdpType : {
		"offer"    : 1,
		"pranswer" : 2,
		"answer"   : 3
	},

	/*
	* Func: define the roap type
	*/
	RTCRoapType : {
		"offer"    : 1,
		"answer"   : 2,
		"ok"       : 3,
		"candidate": 4,
		"shutdown" : 5,
		"error"    : 6
	},
	
	RTCRoapErrorType : {
		"offline" : 1,
		"timeout" : 2,
		"nomatch" : 3,
		"refused" : 4,
		"conflict" : 5,
		"doubleconflict" : 6,
		"mediafailed" : 7,
		"failed" : 8
	},

	/*
	* Func: define the roap constructor
	*/
	Roap : function(roapType, offerSessionId, answerSessionId, seq, sdp, media, label, error, moreComingFlag){
		if(typeof roapType == "undefined"){
			com.webrtc.Util.debug("Unknown roap type : " + roapType);
			return;
		}
		return {
			"type"            : roapType,
			"offerSessionId"  : offerSessionId,
			"answerSessionId" : answerSessionId,
			"seq"             : seq,
			"sdp"             : sdp,
			"media"           : media,
			"label"           : label,
			"error"           : error,
			"moreComingFlag"  : moreComingFlag,
			"tiebreaker"      : null
		}
	},

	/*
	* Func: define the rtc message type
	*/
	RTCMsgType : {
		"register"         : 1,
		"session-initiate" : 2,
		"session-refuse"   : 3,
		"session-bye"      : 4,
		"session-ack"      : 5,
		"heartbeat"        : 6
	},

	/*
	* Func: define the rtc constructor
	*/
	RTCProtocol : function(rtcType, from, to, roap){
		if(typeof rtcType == "undefined"){
			com.webrtc.Util.debug("Unknown rtc type : " + rtcType);
			return;
		}
		return {
			"type" : rtcType,
			"from" : from,
			"to"   : to,
			"roap" : roap
		}	
	},

	/*
	* Func: define the rtc message constructor
	*/
	RTCMessage : function(rtcType, roapType, description){
		//construct the roap message body
		var roap = null;
		//the "register" rtc message doesn't need roap field
		if(description != null){
			if(typeof description.sdpMLineIndex != "undefined"){
				//the "candidate" roap message body doesn't have label field
				roap = new com.webrtc.protocol.Roap(roapType, com.webrtc.gOfferSessionId, com.webrtc.gAnswerSessionId, com.webrtc.gSeq, description.candidate, null, description.sdpMLineIndex, null, com.webrtc.gMoreComing);
			}else{
				//the offer or answer message
				var mediaType = arguments[3];
				roap = new com.webrtc.protocol.Roap(roapType, com.webrtc.gOfferSessionId, com.webrtc.gAnswerSessionId, com.webrtc.gSeq, description, mediaType, null, null, com.webrtc.gMoreComing);
			}
		}else{
			//the register, error message
			var errorType = arguments[3];
			roap = new com.webrtc.protocol.Roap(roapType, com.webrtc.gOfferSessionId, com.webrtc.gAnswerSessionId, com.webrtc.gSeq, null, null, null, errorType, null);
		}
		//construct the rtc message
		var rtcMsg = new com.webrtc.protocol.RTCProtocol(rtcType, com.webrtc.gLocalUserID, com.webrtc.gRemoteUserID, roap);
		return rtcMsg;
	}
}