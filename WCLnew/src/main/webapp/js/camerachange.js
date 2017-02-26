var videoSelect = document.getElementById("videoSource");

var tempUserName2 = null;

var tempConstraints=null;

var tempsource={};


function gotSources(sourceInfos) {
	for (var i = 0; i != sourceInfos.length; ++i) {
		var sourceInfo = sourceInfos[i];
		tempsource[i]=sourceInfos[i];
		
		console.log(sourceInfos);
		
		var option = document.createElement("option");
		option.value = sourceInfo.id;

		if (sourceInfo.kind === 'audio') {

		} else if (sourceInfo.kind === 'video') {
			

			
			option.text = sourceInfo.label || 'camera '
					+ (videoSelect.length + 1);
			videoSelect.appendChild(option);
			
		//	console.log("i="+i+"camera="+option.text);
			
		} else {
			console.log('Some other kind of source: ', sourceInfo);
		}
	}
}


//test
/*
function gotSources(sourceInfos) {
	for (var i = 0; i != sourceInfos.length; ++i) {
		var sourceInfo = sourceInfos[i];
		console.log(sourceInfo);
		
	}
}
*/

if (typeof MediaStreamTrack === 'undefined') {
	alert('This browser does not support MediaStreamTrack.\n\nTry Chrome Canary.');
} else {
//	MediaStreamTrack.enabled=true;
	MediaStreamTrack.getSources(gotSources);
}

function start() {
	
	var videoSource = videoSelect.value;
	
	console.log("viedoSource="+videoSelect.value);
	
	
	var constraints = {
		audio : true ,
		video : { optional : [ {sourceId : videoSource} ] }
	};
	
	tempConstraints=constraints;
	console.log("tempConstraints="+tempConstraints);
		 

	if (typeof tempUserName2 != "undefined" && tempUserName2 != null) {
				
		 phoneHangup(tempUserName2);		 
		 phoneCall(tempUserName2);	
		
	} else {

		console.log("tempUserName2 is error" + tempUserName2);
	}

	console.log("啦啦啦");
}

videoSelect.onchange = start;

function cameraChange(remoteUserNameOriginal) {

	tempUserName2 = remoteUserNameOriginal;
}