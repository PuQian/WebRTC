<!DOCTYPE html>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="java.util.*"%>

<%@ taglib prefix="s" uri="/struts-tags"%>
<html>
<head>
<title>添加联系人</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
</head>
<body>
 

	<table class="">
			<tr>
		     	<td>名字<span class="redletter">*</span></td>
				<td><input id="nameInput" type="text" name="nickname" value="" class="editline" onblur="checkNullIllegal('nameInput','nameTip')" /><span id="nameTip" class="redletter"></span> </td>
				</tr>
		    <tr>
				<td>电子邮件<span class="redletter"></span></td>
				<td><input id="emailInput" type="text" name="email" value="" class="editline" onblur="checkEmailFn('emailInput','emailTip')" /> <span id="emailTip" class="redletter"></span></td>
				</tr>
		    <tr>
				<td>qq号码<span class="redletter"></span></td>
				<td><input id="qqInput" type="text" name="qq" value="" class="editline" onblur="checkQqFn('qqInput','qqTip')" /><span id="qqTip" class="redletter"></span> </td>
				</tr>
				<!-- 
		    <tr>
				<td>webrtc通讯<span class="redletter"></span></td>
				<td><input id="webrtcInput" type="text" name="webrtc" value="" class="editline" onblur="checkWebrtcFn('webrtcInput','webrtcTip')" /><span id="webrtcTip" class="redletter"></span> </td>
				</tr>
				 -->
		    <tr>
				<td>电话号码<span class="redletter"></span></td>
				<td><input id="phoneInput" type="text" name="phone" value="" class="editline" onblur="checkPhoneFn('phoneInput','phoneTip')" /><span id="phoneTip" class="redletter"></span> </td>
				</tr>
		    <tr>
				<td>选择群组：<span class="redletter"></span></td>
				<td><select id="groupListId" class="selectboxsmall"  name="groupName">
		
					</select>
		
				<a class="leftmargin_5 blueletter" href="javascript:void(0)" onclick="addContactGroupFn()">新建群组</a></td>
		</tr><tr>
			<td></td><td>
				<div id="addContactGroupDiv" class="hidden">
					<span class="padding5">
		    			<span class="blackletter strong">
		    			请输入群组名称：&nbsp;&nbsp;<span class="redletter" id="groupNameTip"></span>
		    			</span>
		    			<br/>
		    			<input type="text"  name="groupName" id="groupNameId" class="editline"/>
		    			<a class="greybutton" href="javascript:void(0)" onclick="checkBeforeAddContactGroupFn()">确定</a>
		    			<a class="blueletter" href="javascript:void(0)" onclick="cancelAddContactGroupFn()">取消</a>
		    		</span>
		</div>
		<br/>
		</td>
		</tr>
	</table>
	<div class="rightalign">
		<input type="button" class="button" value="添加" onclick="CheckBeforeAddContactFn()"/>
		<!-- <input type="submit" value="确认"></input>  -->
		<input type="button" class="button" value="取消" onclick="cancelFaceboxFn()"/>
	</div>

	 <!-- 加载页面时获取grouplist -->  	  	
	   	<script>
	   	
	   	$(document).ready(function(){
			findAllContactGroup();//获取群组列表
			
		});	
	   		

	   	</script>
	   	
	   	
	   	
	   	
</body>
</html>
