<!DOCTYPE html>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="java.util.*"%>
<%@ taglib prefix="s" uri="/struts-tags"%>

<html>
<head>
<title>添加好友</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
</head>
<body>
		<table class="">
			<tr>
		     	<td>IP电话<span class="redletter">*</span></td>
		     	<td><input id="friendInputId" type="text" value="" class="editline" placeholder="好友注册IMS上号码"/>
		    	<input id="IMSVideoCall" type="button" class="sgraybutton"  value="视频">
                <input id="IMSAudioCall" type="button" class="sgraybutton"  value="语音"></td>
		    </tr>
		  
		</table>
<script>
$(document).ready(function(){

	$('#IMSVideoCall').click(function(){
		
		if($('#friendInputId').val()=="")
			{
			alert("IP不能为空！");
			$('#friendInputId').val("");
			return;
			}
		
		var IMSId = $('#friendInputId').val();

	$(document).trigger('close.facebox');
	
	var IMSIdSignal=IMSId;

	
	
	console.log("in addIMS.jsp IMSId="+IMSId);
	// obj中 id 为显示需要   name 为信令需要 id 和 name一样
	
	
	var obj={"id" : IMSId,"avatar" : undefined,"name" : IMSIdSignal};
	 createIMSDialogDiv(obj,true);
	 
	 //beginIMSVideo 中 第一个参数是信令需要，第二个参数为显示需要
	 beginIMSVideo(IMSIdSignal,IMSId);//beginVideo里包含视频中图标变换功能
	

	})
	
	$('#IMSAudioCall').click(function(){
		
		if($('#friendInputId').val()=="")
		{
		alert("IP不能为空！");
		$('#friendInputId').val("");
		return;
		}
	
		
		$(document).trigger('close.facebox');
		var IMSId = $('#friendInputId').val();
		
		$(document).trigger('close.facebox');
		var IMSIdSignal=IMSId;
	
		
	var obj={"id" : IMSId,"avatar" : undefined,"name" : IMSIdSignal};
	createIMSDialogDiv(obj,true);
	beginIMSAudio(IMSIdSignal,IMSId);


	})
	
	});
</script>
</body>
</html>
