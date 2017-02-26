<!DOCTYPE html>
<%@page import="com.free4lab.account.common.Constants"%>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"
	import="java.util.*"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<html>
<head>
<base href="/" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<!-- <meta charset="utf-8"> -->
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>WebRTC密码找回</title>
<link rel="stylesheet" href="bootstrap-3.3.2/css/bootstrap.min.css">
<link rel="stylesheet" href="bootstrap-3.3.2/css/front.css">
<link rel="stylesheet" href="css/register.css">
<link href="bootstrap-3.3.2/css/base.css" rel="stylesheet" type="text/css" />
  <link href="bootstrap-3.3.2/css/common.css" rel="stylesheet" type="text/css" />
  <link href="bootstrap-3.3.2/css/login.css" rel="stylesheet" type="text/css" />
  <style>a:hover{TEXT-DECORATION:none}</style>
<!-- 加上下面的_head.jsp会影响freeshare登录页面的字体样式 -->
<%-- <s:include value="/template/_head.jsp" /> --%>
</head>
<body>
	 <s:include value="/template/_head.jsp"/>
		<div class="container">
			<div class="clear"></div>
			<div class="row" id="signupForm">
				<div class="col-md-offset-4 col-md-4 " id="FreeInputLogo1">
					<div class="form-group">
						<div class="pwdretrieve_div">
							<img class="pwdretrieve_img" src="images/new_retrieve.png">
						</div>
					</div>
					<div class="form-group">
						<div class="reg_state toppadding_10">
							<span class="stdfont stdfont_current">发送密码重置邮件</span>
							<span class="stdfont">&nbsp;>&nbsp;</span>
							<span class="stdfont">验证邮箱</span>
							<span class="stdfont">&nbsp;>&nbsp;</span>
							<span class="stdfont">重置密码</span>
						</div>
					</div>
					<div class="form-group">
						<input type="text" name="ename" class="form-control input-lg"
							onblur="ename_isValid()" placeholder="邮箱" value="<s:property value="email"/>"/>
					</div>
					<div class="input-lg padding-0">
						<div class="col-md-6 col-sm-6 col-xs-6 padding-0 input-lg">
							<input type="text" name="epsw" class="form-control input-lg"
								placeholder="验证码" />
						</div>
						<div
							class="col-md-4 col-sm-4 col-xs-4 input-lg padding-top-bottom-5">
							<img class="pwdretrieve_img" src="account/SecurityCodeImage"
								id="Verify" style="cursor: hand;" alt="看不清,换一张" />
						</div>
						<div class="col-md-2 col-sm-2 col-xs-2 padding-top-bottom-10">
							<a href="javascript:void(0)"
								class="captchastext blackletter font_change"
								onclick="createSercuityCode()">换一张</a>
						</div>
					</div>
					<div class="form-group"></div>
					<div class="form-group">
						<button type="button" onclick="check();"
							class="btn btn-info btn-block btn-lg">确定</button>
					</div>
					<span class="redletter" id="error"></span>
					<div class="front-login-hr"></div>
					<div class="form-group">
						<input type="button" class="btn btn-default btn-block btn-lg"
							style="border: 1px solid #5bc0de; color: #5bc0de"
							value="想起来了，去登录"
							onclick="window.location.href='/api/oauth2/authorize?client_id=<%=session.getAttribute(Constants.SESSION_CLIENT_ID)%>&redirect_uri=<%=session.getAttribute(Constants.SESSION_REDIRECT_URI)%>'">
					</div>
				</div>
			</div>
		</div>
		<div class="front-push"></div>
	</div>
	<s:include value="/template/_global.jsp" />
	<script type="text/javascript" src="js/login.js"></script>
	<script type="text/javascript" src="js/md5.js"></script>
	<script type="text/javascript" src="js/pwdretrieve.js"></script>
	<script>
		
	</script>
	<s:include value="/template/_footer.jsp"/>
</body>
</html>
