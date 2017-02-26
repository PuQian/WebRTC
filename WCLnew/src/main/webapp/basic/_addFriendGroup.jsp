<!DOCTYPE html>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="java.util.*"%>
<%@ taglib prefix="s" uri="/struts-tags"%>

<html>
<head>
<title>添加群组</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
</head>
<body>
		<table class="formtable">
			<tr>
		     	<td>群组名称<span class="redletter">*</span></td>
		     	<td><input id="groupInputId" type="text" value="" class="editline" onblur="checkGroupIdFn('groupInputId','groupIdTip')" /><span id="groupIdTip" class="redletter"></span></td>
		    </tr><tr>
		     	<td></td><td>(显示的群组名称，用于与其他群组做区分)</td>
		    </tr>
		</table>
	
		<div class="rightalign">
		    <input type="button" class="button" value="确定" onclick="checkBeforeAddGroupFn()"/>
			<input type="button" class="button" value="取消" onclick="cancelFaceboxFn()"/>
	   	</div>
</body>
</html>
