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
<title>WebRTC错误</title>
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
						<br /> <br />
						<div class="pwdretrieve_div">
							<img class="pwdretrieve_img" src="images/new_error.png">
						</div>
						<br /> <br /> <br /> <br /> <br /> <br />
						<div class="form-group">
							<button type="button"
								onclick="window.location.href='/api/oauth2/authorize?client_id=<%=session.getAttribute(Constants.SESSION_CLIENT_ID)%>&redirect_uri=<%=session.getAttribute(Constants.SESSION_REDIRECT_URI)%>'"
								class="btn btn-info btn-block btn-lg">立即登录</button>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="front-push"></div>
	</div>
	<s:include value="/template/_global.jsp" />
	 <s:include value="/template/_footer.jsp"/>
</body>
</html>
