<!DOCTYPE html>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="java.util.*"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<html>
<head>
<title>文件传输中</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<style>
 .progressBar{width:380px;height:8px;border:1px solid #98AFB7;border-radius:5px;margin-top:10px;}
 #bar{width:0px;height:8px;border-radius:5px;background:#5EC4EA;}
 #filetransflag {
  text-align: left;
  background:  #fff#65a5e0;
  padding: 7px;
  color: #65a5e0;
  font-weight: bold;
}
</style>
</head>
<body>
	 <div class="progressBar">
	 <div id="bar">
	 </div>
	 <div id="filetransflag"></div>
	 </div>
	 
  

  
  
 <script>
  //页面加载时初始化的数据	
$(document).ready(function(){
	$("#filetransflag").html("传输中");
	$("#bar").css("width","0%");
	
	 //点击发送后关闭窗口
  	$('#file_share').click(function(){
    
	 	//$(document).trigger('close.facebox');
	})
	
});
</script>


</body>
</html>
