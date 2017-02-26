<!DOCTYPE html>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="java.util.*"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<html>
<head>
<title>创建聊天室</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
</head>
<body>
		<table class="">
			<tr>
		     	<td>聊天室号<span class="redletter">*</span></td>
		     	<td><input id="roomname" type="text" value="" class="editline" placeholder="请输入您要创建的聊天室号码" />	       
		       
		       </td>
		    </tr>
		    <tr>
		     	<td>选择聊天室类型<span class="redletter"></span></td>
		     	<td><select id="roomselectioin" class="selectboxsmall">
		     		  <option value ="reserverdroom" >普通聊天室</option>
                     <option value ="memberOnlyroom">会员聊天室</option>
		     	</select>		     		
		     	</td>
		    </tr><tr>
		     	<td></td> 	
		    </tr>

		</table>
	
		<div>
			<div class="leftfloat">
				<span id="createRoomTip" class="redletter"></span>
			</div>			
			<div class="rightfloat">
				 <input type="button" class="button" value="申请创建" onclick="createReservedRoomFn()"/>
		   	 	 <input type="button" class="button" value="取消" onclick="cancelFaceboxFn()"/>
			</div>
			<div class="clear"></div>		   
	   	</div>
</body>
</html>
