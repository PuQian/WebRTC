<!DOCTYPE html>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="java.util.*"%>

<%@ taglib prefix="s" uri="/struts-tags"%>
<html>
<head>
<title>好友申请</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
</head>
<body>
		<table class="">
			<tr>
		     	<td colspan="2">账号&nbsp;&nbsp; <span id="showApply" class="strong blueletter "></span>&nbsp;&nbsp; 向您发出了好友申请</td>
		    </tr>
		    <tr><td></td></tr>
		    <tr>
		     	<td>选择群组<span class="redletter"></span></td>
		     	<td><select id="groupListId" class="selectboxsmall">
		     		
		     	</select>		     		
		     	<a class="leftmargin_5 blueletter" href="javascript:void(0)" onclick="addGroupFn()">新建群组</a></td>
		    </tr><tr>
		     	<td></td><td>
		     		<div id="addGroupDiv" class="hidden">
               			<span class="padding5">
	               			<span class="blackletter strong">
	               				请输入群组名称&nbsp;&nbsp;<span class="redletter" id="groupNameTip"></span>
	               			</span>
	               			<br/>
	               			<input type="text" name="groupName" id="groupName" class="editline"/>
	               			<a class="greybutton" href="javascript:void(0)" onclick="checkBeforeAddGroupFn()">确定</a>
	               			<a class="blueletter " href="javascript:void(0)" onclick="cancelAddGroupFn()">取消</a>
               			</span>
               		</div>
               		<br/>
		     	</td>		     	
		    </tr>
		</table>
	
		<div class="rightalign">
		    <input type="button" class="button" value="接受" onclick="acceptApplyFriendFn()"/>
		    <a href="javascript:void(0)" onclick="refuseApplyFriendFn()" >拒绝</a>
	   	</div>
	   	<script>
	   		$(document).ready(function(){	 
	   			var groupList = com.xmpp.getGroupList();
	   			for(var i=0; i<groupList.length;i++){
	   				$("#groupListId").append("<option value='"+groupList[i]+"'>"+groupList[i]+"</option>");
	   			}
	   			var applyFriendRemain = $("#applyFriendId").val();
	   			var applyFriendList = applyFriendRemain.split(",");
	   			var applyFriend;
	   			for(var i=0;i<applyFriendList.length;i++){
	   				if(applyFriendList[i] != ""){
	   					applyFriend = applyFriendList[i];	
	   					$("#showApply").html(applyFriend);
	   					break;
	   				}
	   			}
	   		});
	   	</script>
</body>
</html>
