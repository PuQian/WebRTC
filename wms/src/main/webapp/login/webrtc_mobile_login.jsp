<!DOCTYPE html>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"
	import="java.util.*"%>

<%@ taglib prefix="s" uri="/struts-tags"%>
<html>
<head>
<base href="/" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta name="viewport" content="width=device-width,  initial-scale=1">
<script type="text/javascript" src="js/mobile/frame/jquery.js"></script>
<script type="text/javascript"
	src="js/mobile/frame/jquery.mobile-1.4.5.js"></script>
<link rel="stylesheet" type="text/css"
	href="css/mobile/frame/jquery.mobile-1.4.5.css">
<link rel="stylesheet" href="css/mobile/frame/pro.css">
<link rel="stylesheet" href="css/mobile/frame/ionicons.css">
<link rel="stylesheet" href="css/mobile/frame/prettify.css">
<link rel="stylesheet" href="css/mobile/frame/doc.css">

<script type="text/javascript" src="js/mobile/frame/fingerblast.js"></script>
<script type="text/javascript" src="js/mobile/frame/prettify.js"></script>
<script type="text/javascript" src="js/mobile/frame/require.js"></script>
<link rel="stylesheet" href="css/mobile/webrtc/webrtc.css">
</head>
<body>
<body class="ui-app">
	<div data-role="page" id="loginpage">
		<div data-role="content">
			<h1 class="mylogintitle">RTC</h1>
			<div >
				<form
					action="oauth2/logincheck?client_id=<s:property value="client_id" />&redirect_uri=<s:property value="redirect_uri" />&random=<s:property value="random" />"
					method="post" id="loginform" data-ajax="false"
					onsubmit="return loginCheck();">
 					<div class="LoginCheckAccount">
						<input type="text" name="email" id="txemail" class="myinput" placeholder="请输入您的账号" data-corners="false" /> 
					</div>
					<div class="LoginCheckPassword">
						<input type="password" name="epsw" id="txpwd" class="myinput" data-corners="false" placeholder="*******" /> 
					</div>
					<input type="hidden" name="passwordmd5" id="txpasswordMd5" value=""></input>
					<input type="hidden" id="state" name="state" value="<s:property value="state" />" /> 
					<input type="hidden" id="random" value="<s:property value="random" />" />
					
					<div class="loginbutton">
						<!-- <a data-role="button" href="#msghome" id="loginbutton"
							class="loginbluebutton">登录</a>
							-->
						<input type="submit"  value= "登录"/>
						<div id = "account">
							<span class="redletter" id="error"><s:property value="message" /></span>
						</div>
					</div>
					<div class="floatleft">
						<!--  <input type="checkbox" name="checkbox-agree" id="rmbUser"
							class="myloginimgleft" /> -->
						<img id="rmbUser" class="myloginimgleft" src="images/check_off.jpg" onclick="changeImg()" align="top"> 
						<span class="mylogininputtextleft">记住用户名</span>
					</div>
					<div class="floatright">
		
						<img class="myloginimgright" src="images/check_off.jpg" align="top"> 
						<div class="mylogininputtextright">自动登录</div>
					</div>
				</form>
			</div>

			<br>
			<div>
				<h4 class="myloginfootertitle">还没账号？免费注册</h4>
				<p class="myloginfooterp">当前版本RTCv1.1.3 &nbsp;建议您使用UC浏览器</p>
			</div>
		</div>
	</div>
	<s:include value="/template/_global.jsp"/>
	<script type="text/javascript" src="js/login.js"></script>
	<script type="text/javascript" src="js/md5.js"></script>
	<script>
	
	$('#txemail').bind('input propertychange', function() {
		if($("#txemail").val()==""){
			$("#txpwd").val("");
		}
	});
	</script>
</body>
</html>