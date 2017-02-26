
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
	} else if(navigator.mozGetUserMedia){
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
	
} else if(getBrowserType() == "firefox"){

	/*
	 * if is the firefox, set getUserMedia, attachMediaStream, clearMediaStream, RTCPeerConnection API to moz API
	 */
	console.log("firefox detected!");
	
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
	
	RTCPeerConnection = mozRTCPeerConnection;
} else{
	console.log("Browser doesn't support getUserMedia API!");
}

/*
*  Func   : define the media constraints class
*/
var MediaStreamConstraints = function(audio, video){
	return {
		"audio" : audio,
		"video" : video
	}
}

/*
*  Func   : define the peerconnection constraints class
*/
var PeerConnectionConstraints = function(audio, video){
	return {
		'mandatory': {
             'OfferToReceiveAudio':audio, 
             'OfferToReceiveVideo':video }
	}
}
