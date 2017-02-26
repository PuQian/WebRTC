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
  <title>webRTC 注册</title>
  <link rel="stylesheet" href="bootstrap-3.3.2/css/bootstrap.min.css">
  <link rel="stylesheet" href="bootstrap-3.3.2/css/front.css">
  <link rel="stylesheet" href="/css/register.css">
  <link href="bootstrap-3.3.2/css/base.css" rel="stylesheet" type="text/css" />
  <link href="bootstrap-3.3.2/css/common.css" rel="stylesheet" type="text/css" />
  <link href="bootstrap-3.3.2/css/login.css" rel="stylesheet" type="text/css" />
  <style>a:hover{TEXT-DECORATION:none}</style>
</head>
<body>
	 <s:include value="/template/_head.jsp"/>

<!--注册-->
<div class="register_box" >
  <div class="register_title">
    <h2>欢迎您注册WebRTC</h2>
  </div>
  <div class="register_form" id="signupForm">
  <table id="FreeInputLogo1">
  <tr>
    <td width="180" align="right" ><strong class="fred">*</strong>邮箱：</td>
    <td ><input type="text" name="email" class="input_txt w250 form-control input-lg" onblur="email_isValid()" /></td>
  </tr>
  <tr>
    <td align="right" ><strong class="fred">*</strong>密码：</td>
    <td ><input type="password" name="epsw" class="input_txt w250 form-control input-lg" onblur="epsw_isValid()" /></td>
  </tr>
  <tr>
    <td align="right" ><strong class="fred">*</strong>确认密码：</td>
    <td ><input type="password" name="cepsw" onblur="cepsw_isValid()" class="input_txt w250 form-control input-lg"  /></td>
  </tr>
  <tr>
    <td align="right" ><strong class="fred">*</strong>图形验证码：</td>
    <td>
    <div class=" col-sm-6 col-xs-6 padding-0 input-lg" style="width:60%;padding:2px 2px;">
    <input type="text" class="input_txt  form-control input-lg" name="code" style="width:150px;" />
    </div>
    <div class="col-md-4 col-sm-4 col-xs-4 input-lg padding-top-bottom-5" style="padding:4px 20px;">
  <img class="pwdretrieve_img" src="account/SecurityCodeImage" id="Verify" style="cursor: hand;" alt="看不清,换一张" >
   </div>
   </td>
  </tr>
  <tr>
    <td align="right" ><input name="" type="checkbox" value="" /></td>
    <td class="pt20 pb20"><p class="f999 f16">我已阅读并同意《服务协议》</p></td>
  </tr>
  <tr>
    <td>&nbsp;</td>
    <td> <button type="button" onclick="return regCheck();" class="input_btn" value="提交">同意条款并注册</button>
    </td>
  </tr> 
  <tr>
    <td>&nbsp;</td>
    <td> <span class="redletter" id="error"></span>
    </td>
  </tr> 
</table>
  
  </div>
  <div class="register_text">
    <h3>已有账号？</h3>
    <a href="account/webrtclogin" class="btn_login">登录</a>
    <p>若<a href="/retrieve/pwdretrieve.jsp" class="fBlue">忘记密码？</a>可通过邮箱 或手机找回</p>
  </div>
</div>

<!--注册 end--> 
  <s:include value="/template/_global.jsp"/> 
  <script type="text/javascript" src="js/login.js"></script>
  <script type="text/javascript" src="js/md5.js"></script>
  <script type="text/javascript" src="js/pwdretrieve.js"></script>
  <s:include value="/template/_footer.jsp"/>
</body>
</html>

