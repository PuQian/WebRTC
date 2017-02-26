<!DOCTYPE html>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"
	import="java.util.*"%>
<head>
<title>aaa</title>
<meta content="aaa" name="keywords" />
<meta content="aaa" name="description" />
 <!--  <script type='text/javascript'
	src='../js/plugin_video/jquery/jquery-1.8.2.js'></script> -->
<style> 
.black_overlay {
	display: none;
	position: absolute;
	top: 0%;
	left: 0%;
	width: 100%;
	height: 100%;
	background-color: black;
	z-index: 1001;
	-moz-opacity: 0.8;
	opacity: .80;
	filter: alpha(opacity = 80);
}

.white_content {
	display: none;
	position: absolute;
	top: 10%;
	left: 10%;
	width: 50%;
	height: 20%;
	border: 16px solid lightblue;
	background-color: white;
	z-index: 1002;
	overflow: auto;
}

.white_content_small {
	display: none;
	position: absolute;
	top: 20%;
	left: 30%;
	width: 40%;
	height: 50%;
	border: 16px solid lightblue;
	background-color: white;
	z-index: 1002;
	overflow: auto;
}

 .progressBar{width:90%;height:8px;border:1px solid #98AFB7;border-radius:5px;margin-top:10px;}
 #bar{width:0px;height:8px;border-radius:5px;background:#5EC4EA;}
 #filetransflag {
  text-align: left;
  background:  #fff#65a5e0;
  padding: 7px;
  color: #65a5e0;
  font-weight: bold;
}
</style>
<script type="text/javascript">
	//å¼¹åºéèå±
	function ShowDiv(show_div) {
		document.getElementById(show_div).style.display = 'block';	
		$("#filetransflag").html("传输中");
		$("#bar").css("width","0%");
	};
	//å³é­å¼¹åºå±
	function CloseDiv(show_div) {
		document.getElementById(show_div).style.display = 'none';
		
	};
</script>
</head>
<body>
	<input id="Button1" type="button" value="aaa" style="display:none" onclick="ShowDiv('MyDiv')" />

	<div id="MyDiv" class="white_content">
	
		<div style="text-align: right; cursor: default; height: 40px;">
			<span style="font-size: 16px;" onclick="CloseDiv('MyDiv')">关闭</span>
		</div>
		
		 <div class="progressBar">
	 <div id="bar">
	 </div>
	 <div id="filetransflag"></div>
	 </div>
	</div>
</body>
</html>