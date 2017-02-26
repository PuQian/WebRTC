<!DOCTYPE html>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"
	import="java.util.*"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<%@page import="com.free4lab.webrtc.common.APIConstants"%>
<%

    String plateformfrontURL="";
    if(request.getScheme()=="https")
    {
    	plateformfrontURL=APIConstants.APIPrefix_FreeFront;
    }
    else
    {
    	plateformfrontURL=APIConstants.APIPrefix_HTTP_FreeFront;
    }
    
    System.out.println("plateformfrontURL="+plateformfrontURL);

%>


<html>
<head>
<base
	href="<%=request.getScheme() + "://" + request.getServerName()
					+ ":" + request.getServerPort() + request.getContextPath()%>/" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>WebRTC</title>
<link rel="shortcut icon" href="images/favicon.ico" />
<link rel="stylesheet" href="<%=plateformfrontURL%>css/public.css" />
	<link rel="stylesheet" type="text/css" href="css/webim.css" />
	<link rel="stylesheet" type="text/css" href="css/bootstrap.css" />

</head>
<body>
	<div id="container">
		<div id="tipboxWrapper"></div>
		<s:if test="0 != banner">
			<s:include value="/template/_pub_banner.jsp" />
			<s:include value="/template/_banner.jsp"></s:include>
		</s:if>
		<div id="inner" class="content" onselectstart="return false"
			onselect="document.selection.empty()">
					<s:include value="/template/_im.jsp"></s:include>
			<div class="clear"></div>
			<input type="text" class="hidden" id="changedShortCut" /> 
			<input type="text" class="hidden" id="hiddenDivId" /> 
			<input type="text" class="hidden" id="CurrentRemoteUserNameID" />  <!--CurrentRemoteUserNameID is originID!!!  -->
			
				
			<input type="text" class="hidden" id="browersupport" value="true" /> 
			<input type="text" class="hidden" id="socketconnected" value="true" />
			<a class="hidden" href="basic/_videoResponse.jsp" rel="facebox"
				id="videoresponsehref" size="s" title="收到视频会话请求"></a>
				
					<a class="hidden" href="basic/_audioResponse.jsp" rel="facebox"
				id="audioresponsehref" size="s" title="收到音频会话请求"></a>
				
			<a class="hidden" href="basic/_multiVideoResponse.jsp" rel="facebox"
				id="multivideoresponsehref" size="s" title="收到群视频会话请求"></a>
				
			<a class="hidden" href="basic/_fileTransferResponse.jsp" rel="facebox"
				id="filetranseferresponsehref" size="s" title="收到文件传输请求"></a> 
				
			<a class="hidden" href="basic/_screenResponse.jsp" rel="facebox"
				id="screenresponsehref" size="s" title="收到屏幕共享请求"></a> 
		 
		    <a class="hidden" href="basic/_MeetingvideoResponse.jsp" rel="facebox"
				id="Meetingvideoresponsehref" size="s" title="收到视频会议请求"></a>
				
				    <a class="hidden" href="basic/_MeetingaudioResponse.jsp" rel="facebox"
				id="Meetingaudioresponsehref" size="s" title="收到音频会议请求"></a>
				
				    <a class="hidden" href="basic/_MeetingvideooraudioResponse.jsp" rel="facebox"
				id="Meetingvideooraudioresponsehref" size="s" title="收到会议请求"></a>	
				
			<input type="text" class="hidden" id="applyFriendId" value="" /> 
			<a class="hidden" href="basic/_applyFriend.jsp" rel="facebox"
			id="applyfriendhref" size="s" title="好友申请">好友申请</a>
			
			
			<audio controls="controls" id="myaudio" class="hidden">
			<source src="images/newMsg.ogg" type="audio/ogg">
			</audio>
		</div>
		<!--#inner-->
		<s:include value="/template/_footer.jsp" />
	</div>
		
	<script type="text/javascript" src="js/plugin_webim/jquery-1.11.1.js"></script>
	<script type="text/javascript" src="js/plugin_webim/strophe-custom-2.0.0.js"></script>
	<script type="text/javascript" src="js/plugin_webim/json2.js"></script>
	<script type="text/javascript" src="js/plugin_webim/easemob.im-1.0.5.js"></script>
	
	<script src="<%=plateformfrontURL%>js/public.js"></script>
		
	<script type="text/javascript" src="js/plugin_video/org/cometd.js"></script>
	<script type="text/javascript" src="js/plugin_video/org/cometd/AckExtension.js"></script>
	<script type="text/javascript"
		src="js/plugin_video/org/cometd/ReloadExtension.js"></script>
	
	<script type="text/javascript"
		src="js/plugin_video/jquery/jquery.md5.js"></script>
	<script type="text/javascript"
		src="js/plugin_video/jquery/jquery.cometd.js"></script>
	<script type="text/javascript"
		src="js/plugin_video/jquery/jquery.cometd-reload.js"></script>
	
	<script type="text/javascript" src="js/plugin_video/libcometd.js"></script>
	<script type="text/javascript" src="js/plugin_video/libwebrtc.js"></script>
	<script type="text/javascript" src="js/plugin_video/webrtc_media.js"></script>
	<script type="text/javascript" src="js/plugin_video/rtcprotocol.js"></script>
	<script type="text/javascript" src="js/plugin_video/configs.js"></script>
	<script type="text/javascript" src="js/plugin_video/md5.js"></script>
	<script type="text/javascript" src="js/plugin_video/hashme.js"></script>
 	
  <script type="text/javascript" src="js/plugin_video/fileSystem/lang_ext.js"></script> 	
  <script type="text/javascript" src="js/plugin_video/fileSystem/protocolMessage.js"></script>  
  <script type="text/javascript" src="js/plugin_video/fileSystem/base64.js"></script>
  <script type="text/javascript" src="js/plugin_video/fileSystem/file.js"></script>
  <script type="text/javascript" src="js/plugin_video/fileSystem/queue.js"></script>
  <script type="text/javascript" src="js/plugin_video/fileSystem/FSio.js"></script>
  <script type="text/javascript" src="js/plugin_video/fileSystem/Block.js"></script>  
  <script type="text/javascript" src="js/plugin_video/fileSystem/BlockMap.js"></script>
  <script type="text/javascript" src="js/plugin_video/fileSystem/BlockCache.js"></script>
  <script type="text/javascript" src="js/plugin_video/fileSystem/AvailabilityMap.js"></script>
  <script type="text/javascript" src="js/plugin_video/fileSystem/binaryProtocol.js"></script>			

  <script type="text/javascript" src="js/plugin_video/PeerConnection.js"></script>		
  
	<script type='text/javascript' src='js/initAll.js'></script>
	
	<script type='text/javascript' src='js/jquery_cookie.js'></script>
	<script type='text/javascript' src="js/myfriend.js"></script>
	<script type='text/javascript' src='js/friendGroupOperation.js'></script>
	<script type='text/javascript' src="js/contactGroupOperation.js"></script>
	<script type='text/javascript' src='js/roomOperation.js'></script>
	<script type='text/javascript' src="js/mycontact.js"></script>
	<script type='text/javascript' src="js/shortcut.js"></script>
	<script type='text/javascript' src="js/browsemedialist.js"></script>
	<script type='text/javascript' src="js/platformlogout.js"></script>
	
	<script type='text/javascript' src='js/begin.js'></script>
	<script type='text/javascript' src='js/startwebrtcPc.js'></script>
	<script type='text/javascript' src='js/impc.js'></script>
	<script type='text/javascript' src="js/pclogout.js"></script>
	<script type="text/javascript" src="js/plugin_webim/bootstrap.js"></script>
	
	
</body>
</html>