/**
*  This is a compatible library to support the chrome and firefox

*  @Filename: usermedia.js
*  @Version : 3.0
*  @Author  : Zhao Guoshuai
*  @Date    : 2012-12-24
*/

var getUserMedia = null;
var attachMediaStream = null;
var clearMediaStream = null;
var RTCPeerConnection = null;



/*
 * return the browser type
 */
var getBrowserType = function(){
	if(navigator.webkitGetUserMedia){
		return "chrome";
	} 
	else if(navigator.mozGetUserMedia){
		return "firefox";
	} else {
		return "other";
	}
}

if(getBrowserType() == "chrome"){

	/*
	 * if is the chrome, set getUserMedia, attachMediaStream, clearMediaStream, RTCPeerConnection API to webkit API
	 */
	console.log("chrome detected!");
	
	getUserMedia = navigator.webkitGetUserMedia.bind(navigator);
	
	attachMediaStream = function(elemLabel, stream){
		document.getElementById(elemLabel).src = webkitURL.createObjectURL(stream);
	}
	
	clearMediaStream = function(elemLabel){
		if(elemLabel != null && document.getElementById(elemLabel) != null){
			document.getElementById(elemLabel).src = "";			
		}	
	}

	RTCPeerConnection = webkitRTCPeerConnection;
	if (!webkitMediaStream.prototype.getVideoTracks) {
		webkitMediaStream.prototype.getVideoTracks = function() {
    	return this.videoTracks;
 		};
    webkitMediaStream.prototype.getAudioTracks = function() {
   		return this.audioTracks;
 		};
	}
 	if (!webkitRTCPeerConnection.prototype.getLocalStreams) {
  	webkitRTCPeerConnection.prototype.getLocalStreams = function() {
    	return this.localStreams;
    };
    webkitRTCPeerConnection.prototype.getRemoteStreams = function() {
    	return this.remoteStreams;
    };
  }
  
	var PeerConnectionConstraints = function(mediaType){

		var audio = false;
		var video = false;
		if (mediaType == "screen") {
			audio = false;
			video = true;

		} else if (mediaType == "audio") {
			audio = true;
			video = false;
		} else if (mediaType == "video") {
			audio = true;
			video = true;
		} else if (mediaType == "file") {
			audio = false;
			video = false;
		}
		else if (mediaType == "audiomeeting") {
			audio = true;
			video = false;
		}
		else if (mediaType == "videomeeting") {
			audio = true;
			video = true;
		}
                else if (mediaType == "imsaudio") {
			audio = true;
			video = false;
		}
		else if (mediaType == "imsvideo") {
			audio = true;
			video = true;
		}


		return {
			'mandatory': {
				'OfferToReceiveAudio': audio,
				'OfferToReceiveVideo': video
			}
		};
	}
	
	
} else if(getBrowserType() == "firefox"){

	/*
	 * if is the firefox, set getUserMedia, attachMediaStream, clearMediaStream, RTCPeerConnection API to moz API
	 */
	console.log("firefox detected!");
	RTCPeerConnection = mozRTCPeerConnection;
	RTCSessionDescription = mozRTCSessionDescription;
	RTCIceCandidate = mozRTCIceCandidate;
	getUserMedia = navigator.mozGetUserMedia.bind(navigator);
	
	attachMediaStream = function(elemLabel, stream){
		document.getElementById(elemLabel).mozSrcObject = stream;
		document.getElementById(elemLabel).play();	
	}
	
	clearMediaStream = function(elemLabel){
		if(elemLabel != null && document.getElementById(elemLabel) != null){
			document.getElementById(elemLabel).mozSrcObject = null;
		}
	}
	
	MediaStream.prototype.getVideoTracks = function() {
		return [];
 	};

	MediaStream.prototype.getAudioTracks = function() {
		return [];
	};

	var PeerConnectionConstraints = function(mediaType) {
		var audioflag = false;
		var videoflag = false;
		if (mediaType == "screen") {
			audioflag = false;
			videoflag = true;

		} else if (mediaType == "audio") {
			audioflag = true;
			videoflag = false;
		} else if (mediaType == "video") {
			audioflag = true;
			videoflag = true;
		} else if (mediaType == "file") {
			audioflag = false;
			videoflag = false;
		}
		else if (mediaType == "audiomeeting") {
			audioflag = true;
			videoflag = false;
		}
		else if (mediaType == "videomeeting") {
			audioflag = true;
			videoflag = true;
		}
		return {
			'mandatory': {
				'OfferToReceiveAudio': audioflag,
				'OfferToReceiveVideo': videoflag
					//	,
					//	'MozDontOfferDataChannel' : true
			}
	}
	}
	
} else{
	console.log("Browser doesn't support getUserMedia API!");
}

/*
 *  Func   : define the media constraints class
 */
var MediaStreamConstraints = function(mediaType) {
	if (mediaType == "screen") {
		return {
			audio: false,
			video: {
				mandatory: {
					chromeMediaSource: 'screen'
						//  	,
						//  	maxWidth: 1280,
						//  	maxHeight: 720
				}
			}
		}
	} else if (mediaType == "audio") {
		return {
			"audio": true,
			"video": false
		}
	} else if (mediaType == "video") {
		return {
			"audio": true,
			"video": true
		}
	}
	else if(mediaType == "videomeeting"){
		return {
			"audio": true,
			"video": true
		}
	}
	else if(mediaType == "audiomeeting"){
		return {
			"audio": true,
			"video": false
		}

	} 
	else if(mediaType == "imsvideo"){
		return {
			"audio": true,
			"video": true
		}
	}
	else if(mediaType == "imsaudio"){
		return {
			"audio": true,
			"video": false
		}
	}else {

		console.log("mediaType is error mediaType=" + mediaType + "\n");
		return;
	}
}