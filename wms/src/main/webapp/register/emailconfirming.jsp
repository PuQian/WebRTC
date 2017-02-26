<!DOCTYPE html>
<%@page import="com.free4lab.account.common.Constants"%>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="java.util.*"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<html>
<head>
	<base href="/" />
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<!-- <meta charset="utf-8"> -->
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>WebRTC注册</title>
	<link rel="stylesheet" href="bootstrap-3.3.2/css/bootstrap.min.css">
	<link rel="stylesheet" href="bootstrap-3.3.2/css/front.css">
	<link rel="stylesheet" href="css/register.css">
	<link href="bootstrap-3.3.2/css/base.css" rel="stylesheet" type="text/css" />
  <link href="bootstrap-3.3.2/css/common.css" rel="stylesheet" type="text/css" />
  <link href="bootstrap-3.3.2/css/login.css" rel="stylesheet" type="text/css" />
	<!-- 加上下面的_head.jsp会影响freeshare登录页面的字体样式 -->
	<%-- <s:include value="/template/_head.jsp" /> --%>
</head>
<body>
 <div class="front-inner">
<s:include value="/template/_head.jsp"/>
	 <div class="container">
	 <div class="row" id="signupForm">
	      <div class="col-md-offset-4 col-md-4">
	        	        <div class="form-group">
				<div class="pwdretrieve_div">
					<img class="pwdretrieve_img" src="images/new_register.png">
				</div>
			</div>
			<div class="form-group">
				<div class="reg_state toppadding_10">
					<span class="stdfont">填写注册信息</span>
					<span class="stdfont">&nbsp;>&nbsp;</span>
					<span class="stdfont stdfont_current">验证邮箱</span>
					<span class="stdfont">&nbsp;>&nbsp;</span>
					<span class="stdfont">完成注册</span>
				</div>
			</div>
					<div class="form-group">
						<div style="max-width: 360px; margin: 0 auto">
							<p class="bigsize" style="line-height: 30px; text-indent: 2em;">一封邮箱激活邮件已经发送至您的邮箱，点击邮件中的链接，将打开密码重置页面，您可以使用此页面完成密码重置！</p>
							<p class="bigsize" style="line-height: 30px; text-indent: 2em;">
								如果您半个小时内仍未收到邮件，请点击"
                <a class="blackletter" href="javascript:void(0);" onclick="sendmore();">再次发送</a>
                "
							</p>
						</div>
					</div>
					<div class="front-login-hr"></div>
					<div class="form-group">
						<input type="button" class="btn btn-default btn-block btn-lg"
							style="border: 1px solid #5bc0de; color: #5bc0de"
							value="已有账号，马上登录"
							onclick="window.location.href='/api/oauth2/authorize?client_id=<%=session.getAttribute(Constants.SESSION_CLIENT_ID)%>&redirect_uri=<%=session.getAttribute(Constants.SESSION_REDIRECT_URI)%>'">
					</div>
	        </div>
	      </div>
	     </div>
	   </div>
      <div class="front-push"></div>
	<s:include value="/template/_global.jsp"/>
	<script type="text/javascript" src="js/login.js"></script>
	<s:include value="/template/_footer.jsp"/>
</body>
</html>
