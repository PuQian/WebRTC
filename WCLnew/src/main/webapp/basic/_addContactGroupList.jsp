<!DOCTYPE html>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="java.util.*"%>

<%@ taglib prefix="s" uri="/struts-tags"%>
<html>
<head>
<title>添加群组</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
</head>
<body>
<!-- 添加联系人群组
<div>
	<form action="platform/addGroup" method="post">
		群组名称<span class="redletter">*</span>
 		<input type="text" name="groupName" class="editline"></input><br/>
 		<input type="submit" value="确认"></input>
		<input type="button" class="button" value="取消" onclick="cancelFaceboxFn()"/>
	</form>
</div>
	 -->
	 <table class="formtable">
			<tr>
		     	<td>群组名称<span class="redletter">*</span></td>
		     	<td><input id="groupInputId" type="text" name="groupName" value="" class="editline" onblur="checkContactGroupIdFn('groupInputId','groupIdTip')" /><span id="groupIdTip" class="redletter"></span></td>
		    </tr><tr>
		     	<td></td><td>(显示的群组名称，用于与其他群组做区分)</td>
		    </tr>
		</table>
	
		<div class="rightalign">
		    <input type="button" class="button" value="确定" onclick="checkBeforeAddContactGroupFn()"/>
			<input type="button" class="button" value="取消" onclick="cancelFaceboxFn()"/>
	   	</div>	
</body>
</html>
