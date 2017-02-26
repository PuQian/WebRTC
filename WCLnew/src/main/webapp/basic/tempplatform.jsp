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
<base
	href="<%=request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
					+ request.getContextPath()%>/" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>WebRTC</title>
<link rel="shortcut icon" href="images/favicon.ico" />
<link rel="stylesheet" href="<%=plateformfrontURL%>css/public.css" />
</head>
<body>
	<div>
		<!--  <form id="formid" method='post'
			action='templogin'>-->
		<table>
			<tr>
				<td><input id="Temptype" type="radio" name="type" value="video"
					checked="checked" />视频 <input type="radio" name="type"
					value="meeting" />会议</td>
			</tr>
			<tr>
				<td class="rightfloat"><input type="button" value="创建URL"
					class="button" onclick="createUrl()"> <!-- <td class="rightfloat"><input type="submit" value="创建URL"
						class="button"> --> <a class="blueletter">取消</a></td>
			</tr>
			<!-- <a href="templogin" class="blueletter" rel="facebox">创建URL</a>  -->
		</table>
		</form>
	</div>
		<script type="text/javascript" src="js/plugin_webim/jquery-1.11.1.js"></script>
	<script type="text/javascript">
		function createUrl() {
			var type = $('input:radio:checked').val();

			//	showLoading();
			$.ajax({
				type : "post",
				url : "templogin",
				data : {
					type : type,
				},
				success : function(data) {
					//count++;
					console.log("******************creat Video count******************="+count);
//					console.log(contact);
					var SessionID = sessionid;

					//jxk143@163.com -->  jxk143-163.com
					var contact1=formatToEase(contact);

					//jxk143-163.com -->  jxk143-163.com@WebRTC
					var gRemoteUserID = EaseToWCS(contact1);
					console.log("gRemoteUserID="+gRemoteUserID);

					var gLocalUserID = com.webrtc.sigSessionConfig.username;
					var sessionType = com.webrtc.UserSession.TYPE.P2P;
					var moduleType = com.webrtc.UserSession.MODULE_TYPE.VIDEO;
					
				    var Div = CallVideoPrefix + contact;
				    
				    resetPosition()
					if(t < 0){t = 30;}
					if(l < 0){l = 60;}

				    
					var newContent = document.createElement("div");
					newContent.setAttribute("id", Div);
					document.body.appendChild(newContent);
					
					$(newContent).attr('class', 'pop_chat_voice dialogbox');
					$(newContent).css({'position':'absolute', 'top':t-100+'px', 'left':l-200+'px'});
					$(newContent).attr('onselectstart', 'return false');//禁止复制
					$(newContent).attr('onselect', 'document.selection.empty()');//不让选择文本内容
					$(newContent).css({'z-index':count++});
					$(newContent).show();
					$(newContent).click(function(){      			//当用鼠标点击该对话框时，该对话框到最上面
						count++;
						console.log("++++++++++++++++creat Video count end +++++++++++++++++="+count);
						$(this).css({'z-index':count});
					});
					
					

					//加载标题栏
					var titleHeight=60,titleWidth=365,titleTableHeight=40,titleTableWidth=365;
					var titleDiv=document.createElement('div');		//标题Div
					$(newContent).append(titleDiv);
					$(titleDiv).css({'width':titleWidth+'px', 'height':titleHeight+'px'});
					
					var titleTable=document.createElement("table");
					titleDiv.appendChild(titleTable);
					$(titleTable).css({'width':titleTableWidth+'px', 'height':titleTableHeight+'px', 'margin':'-4px 0px'});
					
					var titleTr=document.createElement("tr");
					titleTable.appendChild(titleTr);
					
					var titleTd1=document.createElement("td");
					titleTr.appendChild(titleTd1);
					$(titleTd1).css({'width':'335px','height':'40px','background-color':'#4196ca'});
					
					var titleTd2=document.createElement("td");
					titleTr.appendChild(titleTd2);
					$(titleTd2).css({'width':'30px','height':'40px','background-color':'#4196ca'});
					
					var FriendTitle = $("<p class='title' onclick=\"\('"
							+ contact+ "'\);\">" + contact + "</p><p>正在通话中...</p>");
					$(titleTd1).append(FriendTitle);
					var CloseVideo =$("<div class='close_pop' onclick=\"HangUpvideo\('"
							+ gRemoteUserID + "','" + SessionID + "'\)\">关闭</div>");
					 $(titleTd2).append(CloseVideo);
					

					var titleClass=contact.replace(".","a");
					var titleClass1=titleClass.replace("@","b");
					var dragClass='Video'+titleClass1;				//设置窗口可拖拽
					$(titleTd1).attr('class', dragClass);
					dragWindow(dragClass, newContent);

				    var tempurl = $("<div class='call_video' id=\"tempurl\"></div>");
				    $(newContent).append(tempurl);
	
				    tempurl.append(data.temp_url);

					console.log("createVideoPage finish!");
				$(function() {
						var $toggleBtn = $('td.rightfloat > a');
						$toggleBtn.click(function() {
							$(document).trigger('close.facebox');
							return false;
						})
			
					})
				}})}
</script>
</body>
</html>