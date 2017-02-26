function show1(){
	if($("#freeshare_brief").hasClass("hidden")){
		$("#freeshare_brief").removeClass("hidden");
	}
	$("#appcloud_brief").addClass("hidden");
	$("#webrtc_brief").addClass("hidden");
	if($("#app_free").hasClass("hidden")){
		$("#app_free").removeClass("hidden");
	}
	$("#appdefault").addClass("hidden");
	$("#app_cloud").addClass("hidden");
	$("#app_webrtc").addClass("hidden");
}

function show2(){
	if($("#appcloud_brief").hasClass("hidden")){
		$("#appcloud_brief").removeClass("hidden");
	}
	
	$("#freeshare_brief").addClass("hidden");
	$("#webrtc_brief").addClass("hidden");
	if($("#app_cloud").hasClass("hidden")){
		$("#app_cloud").removeClass("hidden");
	}
	$("#appdefault").addClass("hidden");
	$("#app_free").addClass("hidden");
	$("#app_webrtc").addClass("hidden");
}

function show3(){
	if($("#webrtc_brief").hasClass("hidden")){
		$("#webrtc_brief").removeClass("hidden");
	}
	
	$("#freeshare_brief").addClass("hidden");
	$("#appcloud_brief").addClass("hidden");
	if($("#app_webrtc").hasClass("hidden")){
		$("#app_webrtc").removeClass("hidden");
	}
	$("#appdefault").addClass("hidden");
	$("#app_cloud").addClass("hidden");
	$("#app_free").addClass("hidden");
}