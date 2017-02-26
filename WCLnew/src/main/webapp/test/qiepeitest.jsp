<!DOCTYPE html>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"
	import="java.util.*"%>
<%@ taglib prefix="s" uri="/struts-tags"%>

<html>
<head>
<base href="<%=request.getScheme() + "://" + request.getServerName()
					+ ":" + request.getServerPort() + request.getContextPath()%>/" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>webRtc</title>  
<s:include value="/template/_head.jsp" />
</head>
<body>
	<div id="container">
		<div id="tipboxWrapper"></div>
		<s:if test="0 != banner">
			<s:include value="/template/_pub_banner.jsp" />
			<s:include value="/template/_banner.jsp"></s:include>
		</s:if>	
		<div id="inner" class="content">
			<div class="black1border">
				<h1>好友类</h1>
				<input type="button" value="显示好友列表" onclick="showFriends()"/>
				加好友=好友email：
				<input type="text" id="friendEmail"/>
				加好友=群组name：
				<input type="text" id="groupName"/>
				
				<input type="button" value="加好友-无群组" onclick="addFriend()"/>
				<input type="button" value="加好友-有群组" onclick="addFriend('1')"/>
				<br/>
				删好友信息 = 好友email：
				<input type="text" id="delfriendEmail"/>
				<input type="button" value="删好友" onclick="deleteFriend()"/>
				<br/>			
				改好友信息 = 好友email：
				<input type="text" id="editfriendEmail"/>
				改好友信息 = 新群组name：
				<input type="text" id="editgroupNewName"/>
				<input type="button" value="改好友信息" onclick="editFriend()"/>
				<br/>
				获取某一个好友信息=好友email：
				<input type="text" id="getfriendEmail"/>
				<input type="button" value="获取某一个好友信息" onclick="getItemInfoFriend()"/>
				<br/>
				搜索：
				<input type="text" id="searchKey"/>
				<input type="button" value="搜索好友" onclick="searchFriend()"/>
				<br/>
				<div id="friendList"></div>
			</div>
			<div class="black1border">
				<h1>分组类</h1>
				旧群组名：
				<input type="text" id="totalGroupOldName"/>
				新群组名：
				<input type="text" id="totalGroupNewName"/>
				<input type="button" value="重命名子组" onclick="renameGroup()"/>
				<br/>
				删除组：
				<input type="text" id="totalGroupDelName"/>
				<input type="button" value="删除子组" onclick="deleteGroup()"/>
				<br/>
				<input type="button" value="显示分组列表" onclick="showGroups()"/>
				<br/>
			</div>	
			<div class="black1border">
				<h1>发消息类</h1>
				<textarea id="sendMessage"></textarea>
				<input type="button" value="发送" onclick="sendMessage()"/>
				<div id="receivedMessage"></div>
			</div>	
			<div class="black1border">
				<h1>公共信息类</h1>
				<div id="publicResult"></div>
			</div>	
			<div class="black1border">
				<h1>视频类</h1>
				<table border="0">
				    <tr>
				      <td>Local  Video</td>
				      <td>Remote Video</td>
				    </tr>
				    <tr>
				      <td><video width="320" height="240" id="local_media"
				          autoplay="autoplay"></video></td>
				      <td><video width="320" height="240" id="remote_media"
				          autoplay="autoplay"></video></td>
				      <td><canvas id="frame_buffer" style="visibility:hidden"></canvas></td>
				    </tr>
				</table>
				对方id：
				<input type="text" id="webrtcFriendEmail"/> 
				
				<input type="button" value="连接视频" onclick="contectToFriend()"/>
				<input type="button" id="hangupBtn" disabled="disabled" value="挂断视频" onclick="hangup()"/>
			</div>		
		</div>
		<!--#inner-->
		<s:include value="/template/_footer.jsp" />
	</div>
	<!--#container-->
	<!--#container-->
	<script	src="http://front.free4lab.com/js/public.js"></script>
  	<script type='text/javascript' src='js/plugin_im/flXHR.js'></script>
	<script type='text/javascript' src='js/plugin_im/jquery.flXHRproxy.js'></script>
	<script type='text/javascript' src='js/plugin_im/strophe_webrtc.js'></script>
	<script type='text/javascript' src='js/plugin_im/strophe.flxhr.js'></script>
	<script type='text/javascript' src='js/plugin_im/webrtc_xmpp-1.4.js'></script>
	<script type="text/javascript" src="js/plugin_video/jquery.md5.js"></script>
	<script type="text/javascript" src="js/plugin_video/webrtc_media.js"></script>
  	<script type="text/javascript" src="js/plugin_video/rtcprotocol.js"></script>
  	<script type="text/javascript" src="js/plugin_video/usermedia.js"></script>
  	<script type="text/javascript" src="js/plugin_video/peerconnection.js"></script>
  	<script type="text/javascript" src="js/plugin_video/websocket.js"></script>
	<script	src="js/qiepeitest.js"></script>
	
</body>
</html>