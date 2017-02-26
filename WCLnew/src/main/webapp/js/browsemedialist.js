
var tempsource={};


function gotSources(sourceInfos) {
	for (var i = 0; i != sourceInfos.length; ++i) {
		var sourceInfo = sourceInfos[i];
		tempsource[i]=sourceInfos[i];
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
	console.log('This browser does not support MediaStreamTrack.\n\nTry Chrome Canary.');
} else {
//	MediaStreamTrack.enabled=true;
	MediaStreamTrack.getSources(gotSources);
}

function arr_length(o){
    var t = typeof o;
    if(t == 'string'){
        return o.length;
    }else if(t == 'object'){
        var n = 0;
        for(var i in o){n++;}
        return n;
    }
    return false;
}