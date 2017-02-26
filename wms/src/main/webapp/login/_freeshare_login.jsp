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
	<!-- 加上下面的_head.jsp会影响freeshare登录页面的字体样式 -->
	<%-- <s:include value="/template/_head.jsp" /> --%>
</head>
<body>
 <div class="front-inner">
	<s:include value="/template/_head.jsp"/>
	 <div class="container">
		<div class="row">
			<form action="oauth2/logincheck?client_id=<s:property value="client_id" />&redirect_uri=<s:property value="redirect_uri" />&random=<s:property value="random" />" 
				  method="post" onsubmit="return loginCheck();">
			<div class="col-md-offset-4 col-md-4" id="account">
				<div class="form-group">
				    <input type="email" name="email"  id="txemail" class="form-control input-lg" value="" placeholder="邮箱"/>
				</div>
		  	<div class="form-group">
		    	<input type="password" name="epsw" id="txpwd" class="form-control input-lg" value=""  placeholder="密码"/>
        		    <input type="hidden" name="passwordmd5" id="txpasswordMd5" value="" />
        		    <input type="hidden" id="state" name="state" value="<s:property value="#session.state" />" />
		  	</div>
		  	<div class="form-group">
		  		<button type="submit" class="btn btn-info btn-block btn-lg">登录</button>
			  	<span class="redletter" id="error"><s:property value="message" /></span>
		  	</div>
		  	<div class="form-group clearfix text-center">
				<div class="checkbox front-remfield">
					<label><input type="checkbox" id="rmbUser">记住此用户名</label>
				</div>
			</div>
		  	<div class="front-login-hr"></div>
		  	<div class="form-group">
		  		<input type="button" class="btn btn-default btn-block btn-lg free_reg" style="border: 1px solid #5bc0de;color: #5bc0de"
		  			value="还没有账号？免费注册" >
		  	</div>
		  	<div class="form-group">
		  		<input type="button" class="btn btn-default btn-block btn-lg" style="color: #ccc"
		  			value="忘记密码？找回" onclick="window.location.href='/retrieve/pwdretrieve.jsp'">
		  	</div>
			</div>
			</form>
		  </div>
	   </div>
      <div class="front-push"></div>
   </div>
	<input type="hidden" id="hiddenUrl" value="<s:property value="#session.url" />" />
	<input type="hidden" id="hiddenClient" value="<s:property value="client_id" />" />
	<input type="hidden" id="hiddenResult" value="<s:property value="result" />" />
	<input type="hidden" id="random" value="<s:property value="random" />" />
	<s:include value="/template/_global.jsp"/>
	<script type="text/javascript" src="js/login.js"></script>
	<script type="text/javascript" src="js/md5.js"></script>
	<script>
	</script>
	<s:include value="/template/_footer.jsp"/>
</body>
</html>
