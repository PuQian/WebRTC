<!DOCTYPE html>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="java.util.*"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<html>
<head>
	<base href="/" />
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<!-- <meta charset="utf-8"> -->
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>登录</title>
	<link rel="stylesheet" href="bootstrap-3.3.2/css/bootstrap.min.css">
	<link rel="stylesheet" href="bootstrap-3.3.2/css/front.css">
	<link href="bootstrap-3.3.2/css/base.css" rel="stylesheet" type="text/css" />
    <link href="bootstrap-3.3.2/css/common.css" rel="stylesheet" type="text/css" />
    <link href="bootstrap-3.3.2/css/login.css" rel="stylesheet" type="text/css" />
    <style>a:hover{TEXT-DECORATION:none}</style>
</head>
<body>
	<s:include value="/template/_head.jsp"/>
	 <!--登录-->
<div class="login_box">
  <div class="login_banner"><img src="images/login_bg.jpg" width="640" height="390" /></div>
  <form action="oauth2/logincheck?client_id=<s:property value="client_id" />&redirect_uri=<s:property value="redirect_uri" />&random=<s:property value="random" />"  
				  method="post" onsubmit="return loginCheck();">
  <div class="login_form" id="account">
    <h2>欢迎登录webRTC</h2>
    <div class="form-group" style="padding-left: 55px;">
				    <input type="email" name="email" style="width:80%" id="txemail" class="form-control input-lg" value="" placeholder="请输入您的用户名">
				</div>
    	<div class="form-group" style="padding-left: 55px;">
		    	<input type="password" name="epsw" style="width:80%" id="txpwd" class="form-control input-lg" value=""  placeholder="请输入密码"/>
        		    <input type="hidden" name="passwordmd5" id="txpasswordMd5" value="" />
        		    <input type="hidden" id="state" name="state" value="<s:property value="#session.state" />" />
		  	</div>
    <p class="p_text">
      <input name="" type="checkbox" value="" /> 记住帐号 <a href="/retrieve/pwdretrieve.jsp" class="miss_pw">忘记密码？</a></p>
    <div class="form-group" style="padding-left: 55px;">
		  		<button type="submit"style="width:80%" class="btn btn-info btn-block btn-lg">登录</button>
			  	<span class="redletter" id="error"><s:property value="message" /></span>
		  	</div>
    <p class="tc pt20">还没有账号？<a href="register/webrtc_reg.jsp" class="fBlue">立即注册</a></p>
  </div>
  </form>
</div>
<!--登录 end--> 
	<s:include value="/template/_global.jsp"/>
	<input type="hidden" id="hiddenUrl" value="<s:property value="#session.url" />" />
	<input type="hidden" id="hiddenClient" value="<s:property value="client_id" />" />
	<input type="hidden" id="hiddenResult" value="<s:property value="result" />" />
	<input type="hidden" id="random" value="<s:property value="random" />" />
    
    <script type="text/javascript" src="js/login.js"></script>
	<script type="text/javascript" src="js/md5.js"></script>
	<script>
	</script>
<s:include value="/template/_footer.jsp"/>
</body>
</html>
