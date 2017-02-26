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
	<title>WebRTC密码找回</title>
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
		<!-- <div class="dottedline" id="dot_line"></div> -->
		<div class="clear"></div>
		
		
		 <div class="row" id="signupForm">
	      <div class="col-md-offset-4 col-md-4">
					<div class="form-group">
						<div class="pwdretrieve_div">
							<img class="pwdretrieve_img" src="images/new_retrieve.png">
						</div>
					</div>
					<div class="form-group">
						<div class="reg_state toppadding_10">
							<span class="stdfont">发送密码重置邮件</span>
							<span class="stdfont">&nbsp;>&nbsp;</span>
							<span class="stdfont">验证邮箱</span>
							<span class="stdfont">&nbsp;>&nbsp;</span>
							<span class="stdfont stdfont_current">重置密码</span>
						</div>
					</div>
	        <div class="form-group">
	            <input type="text" name="email" class="form-control input-lg" onblur="email_isValid()" disabled="disabled" placeholder="邮箱" value="<s:property value="email"/>" />
	        </div>
	        <div class="form-group">
	          <input type="password" name="epsw" onblur="epsw_isValid()" class="form-control input-lg" placeholder="新密码" />
	        </div>
	        <div class="form-group">
	          <input type="password" name="cepsw" class="form-control input-lg" onblur="cepsw_isValid()" placeholder="重复密码" />
	        </div>
	         <div class="form-group">
	         </div>
	        <div class="form-group">
	           <button type="button" onclick="check();" class="btn btn-info btn-block btn-lg">确定</button>
	        </div>
	        <span class="redletter" id="error"></span>
	        <div class="front-login-hr"></div>
	        <div class="form-group">
	          <input type="button" class="btn btn-default btn-block btn-lg" style="border: 1px solid #5bc0de;color: #5bc0de"
			  			value="想起来了，去登录" onclick="window.location.href='/api/oauth2/authorize?client_id=<%=session.getAttribute(Constants.SESSION_CLIENT_ID)%>&redirect_uri=<%=session.getAttribute(Constants.SESSION_REDIRECT_URI)%>'">
	        </div>
	      </div>
	    </div>
		
		
		<!-- 
        <div class="padding715 topmargin_20"> 
        <div class="FreeInputLogo1" id="FreeInputLogo1">
        	<table cellpadding="5px" align="center" style="width:400px" >
        		<tr>
        			<td class="blackletter greatsize rightalign">邮箱</td>
        			<td colspan="2"><input type="text" name="ename" class="squareinput bigsize black1border" value="<s:property value="email"/>" /></td>
        		</tr>
				<tr>
			        <td class="blackletter greatsize rightalign">验证码</td>
			        <td><input type="text" name="epsw" class="squareinputlt bigsize black1border"  value="" /></td>
			        <td>
        				 --><!-- <input type="text" id="checkCode" class="captchas" readonly/>
        				<a href="javascript:void(0)" onclick="createCode()" class="captchastext blackletter">看不清,换一张</a> -->
        				<!--<img src="account/SecurityCodeImage" id="Verify"  style="cursor:hand;" alt="看不清,换一张"/>
                        <a href="javascript:void(0)" class="captchastext blackletter" onclick="createSercuityCode()">看不清,换一张</a>
        			</td>
        		</tr>
        		<tr>
        			<td></td>
        			<td colspan="3"><span id="error" class="redletter"><s:property value="message"/></span></td>
        			</tr>
        		<tr>
        			<td></td>
        			<td  colspan="2">
        				<table cellpadding="2px">
        					<tr>
        						<td style="width:80px" rowspan="2">
        							--><!-- <a class="" onclick="check()"><img alt="login" src="images/confirm.png" /></a> -->
        							<!-- <input type="button" class="button" value="确定"  onclick="check()"/>
        						</td>
        						<td>
        							<a href="api/oauth2/authorize?client_id=<%=session.getAttribute(Constants.SESSION_CLIENT_ID)%>&redirect_uri=<%=session.getAttribute(Constants.SESSION_REDIRECT_URI)%>" class="captchastext blackletter leftmargin_10">想起来了，去登录</a>
        						</td>
        					</tr>
        				</table>
      				</td>
        		</tr>
        	</table>
        </div>
        </div>
        
        
        
        -->
	   </div>
      <div class="front-push"></div>
   </div>
    <input id="email" type="hidden" value="<s:property value="email"/>" />
    <input id="uuid" type="hidden" value="<s:property value="uuid"/>" />
	<s:include value="/template/_global.jsp"/>
	<script type="text/javascript" src="js/md5.js"></script>
	<script type="text/javascript" src="js/login.js"></script>
	<script type="text/javascript" src="js/pwdretrievenewpwd.js"></script>
	<script>
	</script>
	<s:include value="/template/_footer.jsp"/>
</body>
</html>
