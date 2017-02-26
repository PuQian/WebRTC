var SHORTCUTBOX_NUM = 5;

//生成Webrtc用户会话页面，包括即时消息和视频
function createCallJSP(name) {
	
	if (name && name != "null") {
		
		
		
		console.log("begin to createCallJSP name="+name);

			var localname = $('.pub_banner').attr("user");

			var pageAll = $("<div data-role='page' id='" + "CallPage" + name+ "' data-url='"+"CallPage"+name+"'></div>");
			var pageTitle = $("<div data-role='header'  id='"+ "header"+ name+ "' data-position=\"fixed\" data-tap-toggle=\"false\" data-theme=\"b\"></div>");

			var back = $(" <a data-role=\"button\" href=\"#e1\" class=\"ui-btn-left\">返回</a>");
			var h1show = $("<h1><div align=\"center\">与" + name + "会话</div></h1>");

			var pageContent = $("<div data-role=\"content\" id='" + 'contentmessage'+ name + "' ></div>");

			var pageContent2 = $("<div data-role=\"content\" id='"+ 'contentvideo' + name+ "' style=\"display:none\" ></div>");

			var videolocal = $("<video class=\"front-video\" id='"+ 'localmedia' + name + "' autoplay=\"autoplay\"></video>");

			var videoremote = $("<video class=\"front-video\" id='"+ 'remotemedia' + name + "' autoplay=\"autoplay\"></video>");

			var pageFoot = $("<div data-theme=\"b\" id='" + 'footer' + name+ "' data-role=\"footer\" data-position=\"fixed\"></div>");

			
			var inputcontent= $("<input  name=\"\" id='"+'inputtxt'+name+"' value=\"\" type=\"text\" >");
		
			var pageFoot1 = $("<div style=\"float:right;\"> </div>");
			var msgSendbutton = $(" <a data-role=\"button\" href=\"\" data-inline=\"true\" id='"+ 'msgSend'+ name+ "'  onclick=\"phonesendingMsg('"+ name+ "')\">发消息</a>");
			
	
			var pageFoot2 = $("<div style=\"float:left\"> </div>");
			var callbutton = $(" <a data-role=\"button\" href=\"\" data-inline=\"true\" id='"+ 'call'+ name+ "' class=\"\" onclick=\"phoneCall('"+ name + "')\">CALL</a>");
			
			var pageFoot3 = $("<div style=\"float:left\"> </div>");
			var camerabutton=$(" <a data-role=\"button\" href=\"#selectchange\" data-rel=\"dialog\" class=\"\" id='"+ 'camerachange'+ name+ "' onclick=\"cameraChange('"+ name + "')\">切换摄像头</a>");
			
			var pageFoot4 = $("<div style=\"float:left\"> </div>");
			var toggleVideoAndMessage = $(" <a data-role=\"button\" href=\"\" data-inline=\"true\" id='"+ 'toggle'+ name+ "' class=\"\" onclick=\"phoneToggle('"+ name + "')\">视频/消息界面切换</a>");
			   	
			pageTitle.append(back);
			pageTitle.append(h1show);

			pageContent2.append(videolocal);
			pageContent2.append(videoremote);

			pageFoot1.append(msgSendbutton);

	
			pageFoot2.append(callbutton);
			pageFoot3.append(camerabutton);
		    pageFoot4.append(toggleVideoAndMessage);
		
			pageFoot.append(inputcontent);
			pageFoot.append(pageFoot1);
	
			pageFoot.append(pageFoot2);
			pageFoot.append(pageFoot3);
			pageFoot.append(pageFoot4);
			
			pageAll.append(pageTitle);
			pageAll.append(pageContent);

			pageAll.append(pageContent2);
			pageAll.append(pageFoot);

			var bodyHTML = $("body");
			bodyHTML.append(pageAll);
		}
	else
		{
		   console.log("name is null or other error!!!!");
		}
	
	
//    var createChat=document.getElementById("CallPage"+name);
//    var $createChat=$(createChat);
//    $createChat.page();
//    
//    $('#aa').listview('refresh');  
	
}

//生成IMS会话页面，只包括视频
function createIMSCallJSP(name) {
	console.log("name="+name);	
	
	
		if (name && name != "null") {
			
			
			console.log("begin to createCallJSP name="+name);

				var localname = $('.pub_banner').attr("user");

				var pageAll = $("<div data-role='page' id='" + "CallPage" + name+ "' data-url='"+"CallPage"+name+"'></div>");
				var pageTitle = $("<div data-role='header'  id='"+ "header"+ name+ "' data-position=\"fixed\" data-tap-toggle=\"false\" data-theme=\"b\"></div>");

				var back = $(" <a data-role=\"button\" href=\"#imshtml\" class=\"ui-btn-left\">返回</a>");
				var h1show = $("<h1><div align=\"center\">与" + name + "会话中</div></h1>");

				var pageContent = $("<div data-role=\"content\" id='" + 'content'+ name + "' ></div>");

				var pageContent2 = $("<div data-role=\"content\" id='"+ 'contentvideo' + name+ "' style=\"display:none\" ></div>");

				var videolocal = $("<video class=\"front-video\" id='"+ 'localmedia' + name + "' autoplay=\"autoplay\"></video>");

				var videoremote = $("<video class=\"front-video\" id='"+ 'remotemedia' + name + "' autoplay=\"autoplay\"></video>");

				var pageFoot = $("<div data-theme=\"b\" id='" + 'footer' + name+ "' data-role=\"footer\" data-position=\"fixed\"></div>");

				var pageFootRight = $("<div style=\"float:right\"> </div>");
				
				
				var camerabutton=$(" <a data-role=\"button\" href=\"#selectchange\" data-rel=\"dialog\" class=\"ui-btn-left\" id='"+ 'camerachange'+ name+ "' onclick=\"cameraChange('"+ name + "')\">切换摄像头</a>");
				var callbutton = $(" <a data-role=\"button\" href=\"\" data-inline=\"true\" id='"+ 'call'+ name+ "' class=\"\" onclick=\"imsCall('"+ name + "')\">CALL</a></div>");

				pageTitle.append(back);
				pageTitle.append(h1show);

				pageContent2.append(videolocal);
				pageContent2.append(videoremote);

				
				pageFootRight.append(callbutton);
				
			//	pageFoot.append(camerabutton);
				pageFoot.append(pageFootRight);

				pageAll.append(pageTitle);
				pageAll.append(pageContent);

				pageAll.append(pageContent2);
				pageAll.append(pageFoot);

				var bodyHTML = $("body");
				bodyHTML.append(pageAll);
			}
		else
			{
			   console.log("name is null or other error!!!!");
			}
		
		
//	    var createChat=document.getElementById("CallPage"+name);
//	    var $createChat=$(createChat);
//	    $createChat.page();
	//    
//	    $('#aa').listview('refresh');  
	
}

//生成会议会话页面，只包括视频 以后可以添加新的功能
function createMeetingCallJSP(name) {
	console.log("name="+name);	
	
	
		if (name && name != "null") {
			
			
			console.log("begin to createCallJSP name="+name);

				var localname = $('.pub_banner').attr("user");

				var pageAll = $("<div data-role='page' id='" + "CallPage" + name+ "' data-url='"+"CallPage"+name+"'></div>");
				var pageTitle = $("<div data-role='header'  id='"+ "header"+ name+ "' data-position=\"fixed\" data-tap-toggle=\"false\" data-theme=\"b\"></div>");

				var back = $(" <a data-role=\"button\" href=\"#meetinghtml\" class=\"ui-btn-left\">返回</a>");
				var h1show = $("<h1><div align=\"center\">与" + name + "会话中</div></h1>");

				var pageContent = $("<div data-role=\"content\" id='" + 'content'+ name + "' ></div>");

				var pageContent2 = $("<div data-role=\"content\" id='"+ 'contentvideo' + name+ "' style=\"display:none\" ></div>");

				//var videolocal = $("<video class=\"front-video\" id='"+ 'localmedia' + name + "' autoplay=\"autoplay\"></video>");

				var videoremote = $("<video class=\"front-video\" id='"+ 'remotemedia' + name + "' autoplay=\"autoplay\"></video>");

				var pageFoot = $("<div data-theme=\"b\" id='" + 'footer' + name+ "' data-role=\"footer\" data-position=\"fixed\"></div>");

				var pageFootRight = $("<div style=\"float:right\"> </div>");
				
				
				var camerabutton=$(" <a data-role=\"button\" href=\"#selectchange\" data-rel=\"dialog\" class=\"ui-btn-left\" id='"+ 'camerachange'+ name+ "' onclick=\"cameraChange('"+ name + "')\">切换摄像头</a>");
				var callbutton = $(" <a data-role=\"button\" href=\"\" data-inline=\"true\" id='"+ 'call'+ name+ "' class=\"\" onclick=\"imsmeetingCall('"+ name + "')\">CALL</a></div>");

				pageTitle.append(back);
				pageTitle.append(h1show);

		//		pageContent2.append(videolocal);
				pageContent2.append(videoremote);

				
				pageFootRight.append(callbutton);
				
		//		pageFoot.append(camerabutton);
				pageFoot.append(pageFootRight);

				pageAll.append(pageTitle);
				pageAll.append(pageContent);

				pageAll.append(pageContent2);
				pageAll.append(pageFoot);

				var bodyHTML = $("body");
				bodyHTML.append(pageAll);
			}
		else
			{
			   console.log("name is null or other error!!!!");
			}
		
		
//	    var createChat=document.getElementById("CallPage"+name);
//	    var $createChat=$(createChat);
//	    $createChat.page();
	//    
//	    $('#aa').listview('refresh');  
	
}


function deleteIMSCallJSP(name)
{
	if (name && name != "null") {
		
	   var 	$DELETE=document.getElementById("CallPage"+name);
		    $DELETE.remove();
		
	}

}

//判断一个会话页面是否存在
function judgeIMSCallJSPExist(name)
{
		
		var $JUDGE=document.getElementById("CallPage"+name);
		
		if(typeof $JUDGE== "undefined" || $JUDGE == null)
			{
			return false;
			}
		else
			{
			return true;
			}
}


//显示会议临时列表  会议和IMS都是临时账号，存储在cookie中,这里是会议临时列表
function showTempFriendListOfMeeting() {

	var TempList = getTempFromCookieForMeeting();
	
	$("#meetinghtmllist li").remove();

	if (TempList) {

		console.log("have cookie!!!");
		var TempLists = TempList.split(",");
		for (var i = 0; i < SHORTCUTBOX_NUM; i++) {
			
			if (TempLists[i]!=null)
				{
				fillTempListOfMeeting(TempLists[i], i);
				
				if(judgeIMSCallJSPExist(TempLists[i]))
					{
					
					}
				else
					{
					
					createMeetingCallJSP(TempLists[i]);
					}
			
				}
		}

	} else {

		console.log("no cookie!!!");
	}
	
	var $meetinghtmlIMSId=$("#meetinghtmlIMSId");
	$meetinghtmlIMSId.attr('placeholder','请输入要拨打的会议号码');
	$meetinghtmlIMSId.val("");
}

//显示IMS临时列表  会议和IMS都是临时账号，存储在cookie中,这里是IMS临时列表
function showTempFriendListOfIMS() {

	var TempList = getTempFromCookie();
	
	$("#imshtmllist li").remove();

	if (TempList) {

		console.log("have cookie!!!");
		var TempLists = TempList.split(",");
		for (var i = 0; i < SHORTCUTBOX_NUM; i++) {
			
			if (TempLists[i]!=null)
				{
				fillTempListOfIMS(TempLists[i], i);
				
				if(judgeIMSCallJSPExist(TempLists[i]))
					{
					
					}
				else
					{
					
					createIMSCallJSP(TempLists[i]);
					}
			
				}
		}

	} else {

		console.log("no cookie!!!");
	}
	
	var $imshtmlIMSId=$("#imshtmlIMSId");
	$imshtmlIMSId.attr('placeholder','请输入要拨打的IP号码');
	$imshtmlIMSId.val("");


}


//取cookie值    eg: userid=742
function getTempFromCookie() {
	var userName = $('.pub_banner').attr("userid");
	console.log("userName=" + userName);
	return $.cookie(userName);
}

function getTempFromCookieForMeeting() {
	var userName = $('.pub_banner').attr("userid");
	console.log("userName=" + userName);
	return $.cookie(userName+"meeting");
}


//填充临时列表 会议
function fillTempListOfMeeting(email) {
	if (email && email != "null") {

		var li_temp = "<li onclick=\"getname('" + email + "')\"><a id='"+ email + "' href='" + '#CallPage' + email + "'>" + email+ "</a></li>";

		$("#meetinghtmllist").append(li_temp);
		
		
	} else {
//		var li_temp = "<li onclick=\"getname('" + "empty"+index+ "')\"><a id='"+"empty"+index+"' href=\"#\">" + "空" + "</a></li>";
//
//		$("#aa").append(li_temp);
	}
	
	$('#meetinghtml').page();
	
	$('#meetinghtmllist').listview('refresh');  

}

//填充临时列表 IMS
function fillTempListOfIMS(email) {
	if (email && email != "null") {

		var li_temp = "<li onclick=\"getname('" + email + "')\"><a id='"+ email + "' href='" + '#CallPage' + email + "'>" + email+ "</a></li>";

		$("#imshtmllist").append(li_temp);
		
		
	} else {
//		var li_temp = "<li onclick=\"getname('" + "empty"+index+ "')\"><a id='"+"empty"+index+"' href=\"#\">" + "空" + "</a></li>";
//
//		$("#aa").append(li_temp);
	}
	
	$('#imshtml').page();
	
	$('#imshtmllist').listview('refresh');  

}


function deleteAllCookie()
{
	
	var userName = $('.pub_banner').attr("userid");

	$.cookie(userName,null, {
		// expires : 100000,
		path : "/"
	});
}

function deleteAllCookieForMeeting()
{
	
	var userName = $('.pub_banner').attr("userid");

	$.cookie(userName+"meeting",null, {
		// expires : 100000,
		path : "/"
	});
}

function showAllCookie()
{
	var userName = $('.pub_banner').attr("userid");
	console.log("userName=" + userName);
	console.log($.cookie(userName));
}

function showAllCookieForMeeting()
{
	var userName = $('.pub_banner').attr("userid");
	console.log("userName=" + userName);
	console.log($.cookie(userName+"meeting"));
}


//写入cookie
function recordTempListCookie(emailId) {

	var userName = $('.pub_banner').attr("userid");
	var shortCuts = $.cookie(userName);

	// 该用户还没有写入过cookie
	if (!shortCuts || shortCuts == "") {
		
		shortCuts=emailId;
		
		$.cookie(userName, shortCuts, {
			// expires : 100000,
			path : "/"
		});
		
	} else {
		var shortCutList = shortCuts.split(",");
		
		for(var i=0;i<shortCutList.length;i++ )
		{
		if(shortCutList[i] == emailId)
			{
			return;
			}
		
		
		}
	
		
		if(shortCutList.length >= SHORTCUTBOX_NUM)
			{
			shortCutList[0]=emailId;
			shortCuts = shortCutList.join(",");
			}
		else
			{
			shortCuts = shortCutList.join(",")+","+emailId;
			}
	

	// expires是过期时间，在这里是以 天 为单位的
	$.cookie(userName, shortCuts, {
		// expires : 100000,
		path : "/"
	});
	}
}

function recordTempListCookieForMeeting(emailId) {

	var userName = $('.pub_banner').attr("userid");
	var shortCuts = $.cookie(userName+"meeting");

	// 该用户还没有写入过cookie
	if (!shortCuts || shortCuts == "") {
		
		shortCuts=emailId;
		
		$.cookie(userName+"meeting", shortCuts, {
			// expires : 100000,
			path : "/"
		});
		
	} else {
		var shortCutList = shortCuts.split(",");
		
		for(var i=0;i<shortCutList.length;i++ )
		{
		if(shortCutList[i] == emailId)
			{
			return;
			}
		
		
		}
	
		
		if(shortCutList.length >= SHORTCUTBOX_NUM)
			{
			shortCutList[0]=emailId;
			shortCuts = shortCutList.join(",");
			}
		else
			{
			shortCuts = shortCutList.join(",")+","+emailId;
			}
	

	// expires是过期时间，在这里是以 天 为单位的
	$.cookie(userName+"meeting", shortCuts, {
		// expires : 100000,
		path : "/"
	});
	}
}

function recordTempListCookie(emailId) {

	var userName = $('.pub_banner').attr("userid");
	var shortCuts = $.cookie(userName);

	// 该用户还没有写入过cookie
	if (!shortCuts || shortCuts == "") {
		
		shortCuts=emailId;
		
		$.cookie(userName, shortCuts, {
			// expires : 100000,
			path : "/"
		});
		
	} else {
		var shortCutList = shortCuts.split(",");
		
		for(var i=0;i<shortCutList.length;i++ )
		{
		if(shortCutList[i] == emailId)
			{
			return;
			}
		
		
		}
	
		
		if(shortCutList.length >= SHORTCUTBOX_NUM)
			{
			shortCutList[0]=emailId;
			shortCuts = shortCutList.join(",");
			}
		else
			{
			shortCuts = shortCutList.join(",")+","+emailId;
			}
	

	// expires是过期时间，在这里是以 天 为单位的
	$.cookie(userName, shortCuts, {
		// expires : 100000,
		path : "/"
	});
	}
}


$(document).ready(function() {

	showTempFriendListOfIMS();
	showTempFriendListOfMeeting();
})

