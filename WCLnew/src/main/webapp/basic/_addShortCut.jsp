<!DOCTYPE html>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="java.util.*"%>
<%@ taglib prefix="s" uri="/struts-tags"%>

<html>
<head>
<title>添加快捷方式</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
</head>
<body>
		<div class="lheight">
			<table class="datatable" id="shortCutFriendList">
				<tr><td></td><td>好友账号</td></tr>
				<tr><td><input type="radio" name="addShortCut" /></td><td></td></tr>
			</table>
		</div>
			
		<div class="rightalign">
		    <input type="button" class="button" value="添加快捷方式" onclick="checkBeforeAddShortCutFn()"/>
   	 		<input type="button" class="button" value="取消" onclick="cancelFaceboxFn()"/>
	   	</div>
	   	<script>
	   		$(document).ready(function(){	   		
	   			var friendList = com.xmpp.getRoster();
	   			if(friendList && friendList != null && friendList.length > 0){
	   				var showListHtml = "<tr><td></td><td>好友账号</td></tr>";
	   				for(var i=0; i<friendList.length;i++){
	   					showListHtml += "<tr onclick=\"makeItSelectedFn('shortCut"+ friendList[i].name +"','addShortCut')\"><td><input onclick=\"stopBubble(event)\" id=\"shortCut"+ friendList[i].name +"\" type=\"radio\" name=\"addShortCut\" value=\""+friendList[i].email_id+"\"/></td><td>"+friendList[i].email_id+"</td></tr>";
		   			}
	   				$("#shortCutFriendList").html(showListHtml);
	   			}else{
	   				var showListHtml = "<tr><td><div class=\"middleveralign centeralign\">暂时还没有好友，请先去添加吧</div></td></tr>";
	   				$("#shortCutFriendList").html(showListHtml);
	   			}	   			
	   			getStyle();
	   		});	   		
	   	</script>
</body>
</html>
