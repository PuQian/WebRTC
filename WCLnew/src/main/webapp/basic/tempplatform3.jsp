<!DOCTYPE html>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"
	import="java.util.*"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<%@page import="com.free4lab.webrtc.common.APIConstants"%>
<%
	String plateformfrontURL = "";
	if (request.getScheme() == "https") {
		plateformfrontURL = APIConstants.APIPrefix_FreeFront;
	} else {
		plateformfrontURL = APIConstants.APIPrefix_HTTP_FreeFront;
	}

	System.out.println("%%%%$$plateformfrontURL=" + plateformfrontURL);
%>
<html>
<head>
<base
	href="<%=request.getScheme() + "://" + request.getServerName()
					+ ":" + request.getServerPort() + request.getContextPath()%>/" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>WebRTC</title>
<!-- <link rel="stylesheet" href="<%=plateformfrontURL%>css/public.css" />-->
<!-- 	<link rel="stylesheet" type="text/css" href="css/webim.css" />-->
<!-- 	<link rel="stylesheet" type="text/css" href="css/bootstrap.css" /> -->
<link rel="stylesheet" type="text/css" href="bootstrap/css/bootstrap.min.css">
<link rel="stylesheet" type="text/css" href="bootstrap/css/front.css">
<link rel="stylesheet" type="text/css" href="css/pc/front.css">

<link rel="stylesheet" type="text/css" href="css/pc/rtc_list.css">
<link rel="stylesheet" type="text/css" href="css/pc/bottom_operation.css">

</head>
<body>
	<div class="pub_banner" sys="webrtc"
		ThirdPartyToken="<s:property value='#session.tpaccToken'/>"
		thirdpartyuser="<s:property value='#session.tpUser'/>"
		user="<s:property value='#session.email'/>"
		acctoken="<s:property value='#session.accessToken.substring(8, 24)'/>"
		userid="<s:property value='#session.userId'/>"
		oauthToken="<s:property value='#session.oauthToken'/>"
		style="display: none"></div>
	<input type="hidden" id="hide" value="">
	<input type="hidden" id="webrtcMobileFlag" value="">
	<input type="hidden" id="tempvalue" value="">
	<!--导航栏start-->
	<div class="rtc_head_box">
		<div class="rtc_head">

			<!--用户信息start-->
			<div class="user_info">
				<div class="portrait">
					<img src="css/pc/images/img/portrait65_3.jpg" width="65"
						height="65" />
				</div>
				<h1 class="inviter_name">
					<s:property value='#session.email' />
				</h1>
			</div>
			</div>
			</div>
			<!--用户信息end-->
	<div id="container">
		<div id="tipboxWrapper"></div>
	<!--  	<s:if test="0 != banner">
		<s:include value="/template/temp_pub_banner.jsp" />
			<s:include value="/template/_banner.jsp"></s:include>
		</s:if>-->
		<div id="inner" class="content" onselectstart="return false"
			onselect="document.selection.empty()">
			
			<input type="text" class="hidden" id="hiddenDivId" /> 
			<input type="text" class="hidden" id="CurrentRemoteUserNameID" />
			<a class="hidden" href="basic/_videoResponse.jsp" rel="facebox"
				id="videoresponsehref" size="s" title="收到视频会话请求"></a>
				
			<a class="hidden" href="basic/_audioResponse.jsp" rel="facebox"
				id="audioresponsehref" size="s" title="收到音频会话请求"></a>
		</div>
		temp_name=${temp_name} <br />
			temp_access_token=${temp_access_token} <br />
			temp_type=${temp_type2} <br /> inviter_email=${inviter_email} <br />
		<div>
			<table>
				<tr>
					<td>
						类型：
					</td>
					<td>${temp_type2}</td>
				</tr>
				<tr>
					<td>
					邀请人：
					</td>
					<td>
					${inviter_email}
					</td>
				</tr>
			</table> 
		</div>
			<input type="button" value="视频" onclick="createCallVideoPageBefore('${inviter_email}')">
		
		</div>

		<!-- <a href="javascript:void(0)" class="blueletter"
							onclick="beginVideo(${inviter_email},${inviter_email})">视频</a>-->
		<s:include value="/template/_footer.jsp" />
	</div>
	<!--#container-->
	<script>
	//发起会话
	
function startTempFriendDialog(id,avatar,name){
	var obj={};
	console.log(id);
	if(!avatar || avatar == "" || avatar == "undefined"){
		obj = {"id" : id,"avatar" : undefined,"name" : name};
	}else{
		obj = {"id" : id,"avatar" : avatar,"name" : name};
	}	
	if(obj.name == undefined){
         
		fillTipBox('error','抱歉，此好友不是webrtc用户，无法发起会话！');
		
	}else{
		//$("#myfriendgb").click();//跳到好友列表
		//$('#'+id).dblclick();		
		createCallVideoPageBefore(obj, true);
	}
}
	
	</script>
	<s:include value="/template/_im.jsp"></s:include>
	<s:include value="/template/_contacts.jsp"></s:include>
	<s:include value="/template/_meetingModal.jsp"></s:include>

	<script type="text/javascript" src="js/plugin_webim/jquery-1.11.1.js"></script>
	<script type="text/javascript"
		src="js/plugin_webim/strophe-custom-2.0.0.js"></script>
	<script type="text/javascript" src="js/plugin_webim/json2.js"></script>
	<script type="text/javascript"
		src="js/plugin_webim/easemob.im-1.0.5.js"></script>


	<script type="text/javascript"
		src="bootstrap/js/bootstrap-modal.min.js"></script>
	<script type="text/javascript"
		src="bootstrap/js/bootstrap-modalmanager.min.js"></script>
	<script type="text/javascript" src="bootstrap/js/front.js"></script>
	<script type="text/javascript" src="js/plugin_video/org/cometd.js"></script>


	<script type="text/javascript"
		src="js/plugin_video/jquery/jquery.md5.js"></script>

	<script type="text/javascript"
		src="js/plugin_video/jquery/jquery.cookie.js"></script>
	<script type="text/javascript"
		src="js/plugin_video/jquery/jquery.cometd.js"></script>


	<script type="text/javascript" src="js/plugin_video/libcometd.js"></script>
	<script type="text/javascript" src="js/plugin_video/libwebrtc.js"></script>

	<script type="text/javascript" src="js/plugin_video/md5.js"></script>
	<script type="text/javascript" src="js/plugin_video/hashme.js"></script>

	<script type='text/javascript' src='js/plugin_video/init.js'></script>
	<script type="text/javascript" src="js/plugin_video/rtcprotocol.js"></script>
	<script type="text/javascript" src="js/plugin_video/configs.js"></script>


	<script type="text/javascript"
		src="js/plugin_video/fileSystem/lang_ext.js"></script>
	<script type="text/javascript"
		src="js/plugin_video/fileSystem/protocolMessage.js"></script>
	<script type="text/javascript"
		src="js/plugin_video/fileSystem/base64.js"></script>
	<script type="text/javascript" src="js/plugin_video/fileSystem/file.js"></script>
	<script type="text/javascript"
		src="js/plugin_video/fileSystem/queue.js"></script>
	<script type="text/javascript" src="js/plugin_video/fileSystem/FSio.js"></script>
	<script type="text/javascript"
		src="js/plugin_video/fileSystem/Block.js"></script>
	<script type="text/javascript"
		src="js/plugin_video/fileSystem/BlockMap.js"></script>
	<script type="text/javascript"
		src="js/plugin_video/fileSystem/BlockCache.js"></script>
	<script type="text/javascript"
		src="js/plugin_video/fileSystem/AvailabilityMap.js"></script>
	<script type="text/javascript"
		src="js/plugin_video/fileSystem/binaryProtocol.js"></script>


	<script type="text/javascript" src="js/plugin_video/app.js"></script>
	<script type="text/javascript" src="js/plugin_video/SigSession.js"></script>
	<script type="text/javascript" src="js/plugin_video/WConnection.js"></script>
	<script type="text/javascript"
		src="js/plugin_video/WUserSessionBase.js"></script>
	<script type="text/javascript" src="js/plugin_video/AudioModule.js"></script>
	<script type="text/javascript" src="js/plugin_video/VideoModule.js"></script>
	<script type="text/javascript" src="js/plugin_video/FileModule.js"></script>
	<script type="text/javascript" src="js/plugin_video/IMSAudioModule.js"></script>
	<script type="text/javascript" src="js/plugin_video/IMSVideoModule.js"></script>
	<script type='text/javascript'
		src="js/plugin_video/MeetingVideoModule.js"></script>
	<script type='text/javascript'
		src="js/plugin_video/MeetingAudioModule.js"></script>
	<script type="text/javascript" src="js/plugin_video/WOTTSession.js"></script>
	<script type="text/javascript" src="js/plugin_video/WIMSSession.js"></script>
	<script type='text/javascript' src="js/plugin_video/WMeetingSession.js"></script>
	<script type='text/javascript' src="js/plugin_video/udpclient.js"></script>

	<script type='text/javascript' src='js/jquery_cookie.js'></script>

	<script type='text/javascript' src='js/begin.js'></script>
	<script type='text/javascript' src="js/startwebrtcPc.js"></script>
	<script type='text/javascript' src='js/impc.js'></script>
	<script type='text/javascript' src="js/pclogout.js"></script>
	<script type='text/javascript' src='js/initAll.js'></script>


	<script type="text/javascript" src="bootstrap/js/bootstrap.min.js"></script>


	<script type='text/javascript' src="js/pc/webrtc_pc/FunctionArea.js"></script>
	<script type='text/javascript' src="js/pc/webrtc_pc/RightSide.js"></script>
	<script type='text/javascript' src="js/pc/webrtc_pc/ActiveList.js"></script>
	<script type='text/javascript' src="js/pc/webrtc_pc/Contacts.js"></script>
	<script type='text/javascript' src="js/pc/webrtc_pc/RtcChat.js"></script>
	<script type='text/javascript' src="js/pc/webrtc_pc/RtcMeetingArea.js"></script>
	<script type='text/javascript' src="js/pc/webrtc_pc/RtcVideoAudio.js"></script>
	<script type='text/javascript' src="js/pc/webrtc_pc/RtcHistoryCallArea.js"></script>
	<script type='text/javascript' src="js/pc/webrtc_pc/RtcFileArea.js"></script>	
	<script type='text/javascript' src="js/pc/webrtc_pc/store.min.js"></script>
	<script type='text/javascript' src="js/pc/webrtc_pc/local_store.js"></script>


	
	
	
	
<!--  	 <div class="progressBar"><div id="bar"></div></div> -->
<script>
$("#friendlist").remove();
$("#myfriend").remove();
</script>
</body>
</html>