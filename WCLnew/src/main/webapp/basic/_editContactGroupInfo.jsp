<!DOCTYPE html>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="java.util.*"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<html>
<head>
<title>编辑好友信息</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
</head>
<body>

	<table class="formtable">
		<tr>
	     	<td>群组名称<span class="redletter">*</span></td>
	     	<td><input id="oldGroupName" type="text" name="oldGroupName" class="hidden"></input>
	     	<input id="editGroupName" type="text" name="groupName" class="editline" onblur="checkContactGroupIdFn('editGroupName','groupNameTip')" /> <span class="redletter" id="groupNameTip"></span></td>
	    </tr><tr>
	     	<td></td><td></td>
	    </tr>
	</table>

	<div class="rightalign">
	    <input type="button" class="button" value="修改" onclick="editContactGroupInfoFn()" />
 	 	<input type="button" class="button" value="取消" onclick="cancelFaceboxFn()"/>
   	</div>

	<script>
	
		$(document).ready(function(){
			//获得要编辑的群组，获得旧groupname
			var oldGroupName=readFromMark();
			//alert("旧的groupName="+oldGroupName);
			$("#oldGroupName").val(oldGroupName);
			$("#editGroupName").val(oldGroupName);//显示旧的名字
		})	
	
	</script>
</body>
</html>
