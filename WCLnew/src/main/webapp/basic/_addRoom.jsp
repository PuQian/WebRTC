<!DOCTYPE html>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="java.util.*"%>
<%@ taglib prefix="s" uri="/struts-tags"%>

<html>
<head>
<title>添加聊天室</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
</head>
<body>
		<table class="">
			<tr>
		     	<td>聊天室名称<span class="redletter">*</span></td>
		     	<td><input id="roomInputId" type="text" value="" class="editline" placeholder="已经创建的聊天室名称" onKeyDown="enterToSend(event)"/>
		    	<input id="searchRoom" type="button" class="sgraybutton" onClick="searchRoomFn('roomInputId')" value="搜索"></td>
		    </tr>
		  
		    <tr><td colspan="2">
		    	<div id="noSearchResult" class="lheight grey1border greybg">
		    		<div id="noSearchResultTip" class="centeralign middleveralign lightgreyletter ">请输入聊天室名称并点击申请添加</div>
		    	</div>
		    	<div id="showSearchResult" class="hidden">
		    		<table class="datatable" id="searchResultTable">		    			
		    		</table>
		    	</div>
		    </td></tr>
		</table>
	
		<div>
			<div class="leftfloat">
				<span id="addRoomTip" class="redletter"></span>
			</div>			
			<div class="rightfloat">
				 <input type="button" class="button" value="申请添加" onClick="joinRoomFn()"/>
		   	 	 <input type="button" class="button" value="取消" onclick="cancelFaceboxFn()"/>
			</div>
			<div class="clear"></div>		   
	   	</div>
		<script>
	   		
	   		function enterToSend(event){
	   			var currKey = 0,e = event || window.event; //为了兼容，ie用event，而标准用e
	   			currKey = e.keyCode||e.which||e.charCode;

	   			if(currKey == 13 && !e.shiftKey){ //13为enter键，同时要求没有按下shift键
	   			 	e.returnValue=false;
	   			 	$("#searchRoom").click();
	   			 	return false;
	   			}
	   		}
	   	</script>  
	   	 	
</body>
</html>
