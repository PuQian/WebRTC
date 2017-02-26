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
	     	<td><input type="text" id="editGroupName" class="editline"/></td>
	    </tr><tr>
	     	<td></td><td><span class="redletter" id="groupNameTip"></span></td>
	    </tr>
	</table>

	<div class="rightalign">
	    <input type="button" class="button" value="确定" onclick="editGroupInfoFn()"/>
   	 	<input type="button" class="button" value="取消" onclick="cancelFaceboxFn()"/>
   	</div>
	<script>
		$(document).ready(function(){
			//获得要编辑的群组
			var editGroupId=readFromMark();
			$("#editGroupName").val(editGroupId);
		})		
	</script>
</body>
</html>
