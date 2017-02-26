<!DOCTYPE html>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="java.util.*"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<%@ page import="com.free4lab.account.common.Constants"%>

<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<base href="/" />
<meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>WebRTC用户注册</title>
  <link rel="stylesheet" href="bootstrap-3.3.2/css/bootstrap.min.css">
  <link rel="stylesheet" href="bootstrap-3.3.2/css/front.css">
  <link href="bootstrap-3.3.2/css/base.css" rel="stylesheet" type="text/css" />
  <link href="bootstrap-3.3.2/css/common.css" rel="stylesheet" type="text/css" />
  <link href="bootstrap-3.3.2/css/login.css" rel="stylesheet" type="text/css" />
  <%-- <s:include value="/template/_head.jsp" /> --%>
</head>
<body>
   <div class="front-inner">
	  <s:include value="/template/_head.jsp"/>
	  <div class="container">
	    <div class="row" id="signupForm">
	      <div class="col-md-offset-4 col-md-4">
	        <div class="form-group">
	            <input type="text" name="email" class="form-control input-lg" onblur="email_isValid()" placeholder="邮箱"/>
	        </div>
	        <div class="form-group">
	          <input type="password" name="epsw" onblur="epsw_isValid()" class="form-control input-lg" placeholder="密码" />
	        </div>
	        <div class="form-group">
	          <input type="password" name="cepsw" class="form-control input-lg" onblur="cepsw_isValid()" placeholder="确认密码" />
	        </div>
	        <div class="form-group">
	           <button type="button" onclick="return regCheck();" class="btn btn-info btn-block btn-lg">注册</button>
	        </div>
	        <span class="redletter" id="error"></span>
	        <h5 class="text-center" style="color: #ccc">点击注册后，请到邮箱激活</h5>
	        <div class="front-login-hr"></div>
	        <div class="form-group">
	          <input type="button" class="btn btn-default btn-block btn-lg" style="border: 1px solid #5bc0de;color: #5bc0de"
			  			value="已有账号？马上登录" onclick="window.location.href='/account/webrtclogin'">
	        </div>
	      </div>
	    </div>
	  </div>
	  <div class="front-push"></div>
  </div>
  <s:include value="/template/_global.jsp"/>
  <script type="text/javascript" src="js/login.js"></script>
  <script type="text/javascript" src="js/md5.js"></script>
  <s:include value="/template/_footer.jsp"/>
</body>
</html>

