if (typeof com == 'undefined') {
	var com = new Object();
}
var webim_url;
var wcs_url;
var wms_url;
var nginx_url;
var netty_url;
var ofs_url;
console.log("begin to request some url address");
$.ajax({
	url : "/WCLnew/serverAdd",
	type : "post",
	async : false,
	data : {},
	dataType : "json",
	success : function(data) {
		console.log(data);
		webim_url = data.webim_add;
		console.log("webim_url:" + webim_url);
		wcs_url = data.wcs_add;
		console.log("wcs_url:" + wcs_url);
		wms_url = data.wms_add;
		console.log("wms_url:" + wms_url);
		nginx_url = data.nginx_add;
		console.log("nginx_url:" + nginx_url);
		netty_url = data.netty_add;
		console.log("netty_url:" + netty_url);
		ofs_url = data.ofs_add;
		console.log("ofs_url:" + ofs_url);
	}
})

com.servers = new Array("webrtc");
com.urls = new Array(webim_url);
com.websockets = new Array(wcs_url);
com.wmsservers = new Array(wms_url);
com.nginxservers = new Array(nginx_url);
com.nettyservers = new Array(netty_url);