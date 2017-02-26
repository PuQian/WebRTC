<!DOCTYPE html>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="java.util.*"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<%@ page import="com.free4lab.account.common.Constants"%>

<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<base href="/" />
<title>FreeAccount用户注册</title>
<link rel="stylesheet" href="<%=Constants.CSS_JS_SERVER%>css/public.css" type="text/css" media="screen, projection" />
</head>
<body>
 <% 
	String clientId =session.getAttribute(Constants.SESSION_CLIENT_ID).toString();
	if(clientId.equalsIgnoreCase("userinfo")){
		clientId = "Free账号";
	}else if(clientId.equalsIgnoreCase("freeshare")){
		clientId = "Free分享";
	}else if(clientId.equalsIgnoreCase("appcloud")){
		clientId = "云海（Paas）平台";
	}else if(clientId.equalsIgnoreCase("iaas")){
		clientId = "云海（Iaas）平台";
	}else if(clientId.equalsIgnoreCase("webrtc")){
		clientId = "WebRTC";
	}else if(clientId.equalsIgnoreCase("freeshareadmin")){
		clientId = "Free分享企业管理员门户";
	}else{
		;
	}
	
%> 
<div id="container">
    <div class="banner">
        <div class="content">
            <div class="listtitle topmargin_0"  ><!-- bg="images/FreeLogo.png" -->
				<img class="title"  src='images/FreeLogo.png' height="37px" alt='Free分享Logo'/> 
				<span class="blackletter toppadding_5">来自"<%=clientId %>"的用户注册成功</span>
	            <div class="clear"></div>
            </div>
		</div>
	</div>
	<div id="inner" class="content">
        <div class="listtitle">
            <!-- <img class="title" src="images/UserLogo1.png"> -->
           <!--  <h1 class="bigbigsize darkblueletter">注册FREE账号</h1> -->
            <div class="reg_state toppadding_10">
				<span class="midsize greyletter"><span class="impor">1</span>帐号信息</span>
				<span class="midsize greyletter"><span class="impor">2</span>邮箱验证</span>
				<span class="midsize current"><span class="impor">3</span>完成注册</span>
            </div>
            <div class="clear"></div>
		</div>
		<div class="dottedline" id="dot_line"></div>
		<div>
		<!-- <div id="freeshare_brief" class="sidebar hidden">
            <p class="strong greatsize">Free分享为您提供:</p>
			<ul>
				<li class="leftalign midsize toppadding_5"><a href="#" class="greyletter">多媒体内容</a></li>
				<li class="leftalign midsize"><a href="#" class="greyletter">知识列表</a></li>
				<li class="leftalign midsize"><a href="#" class="greyletter">群组控制</a></li>
				<li class="leftalign midsize"><a href="#" class="greyletter">知识商店</a></li>
			</ul>
		</div> -->
		<!-- <div id="appcloud_brief" class="hidden sidebar">
            <p class="strong greatsize">云海为您提供:</p>
            <ul>
                <li class="leftalign midsize toppadding_5"><a href="#" class="greyletter">Java Web托管</a></li>
                <li class="leftalign midsize"><a href="#" class="greyletter">虚拟主机托管</a></li>
                <li class="leftalign midsize"><a href="#" class="greyletter">能力组件服务</a></li>
                <li class="leftalign midsize"><a href="#" class="greyletter">在线能力商店</a></li>
            </ul>
        </div> -->
        <!-- <div id="webrtc_brief" class="hidden sidebar">
            <p class="strong greatsize">webRTC为您提供:</p>
            <ul>
                <li class="leftalign midsize toppadding_5"><a href="#" class="greyletter">多媒体通信</a></li>
                <li class="leftalign midsize"><a href="#" class="greyletter">整合通讯录</a></li>
                <li class="leftalign midsize"><a href="#" class="greyletter">纯网页应用</a></li>
                <li class="leftalign midsize"><a href="#" class="greyletter">新技术优体验</a></li>
            </ul>
        </div> -->
       <%--  <div class="padding715 toppadding_60">
            <span class="greyletter greatsize strong">欢迎您注册<span class="blackletter">Free</span>账号，点击进入应用</span>
            <a id="appdefault" class="button" href="oauth2/logincheck?email=<s:property value="email"/>&pwdSalt=<s:property value="passwordMd5"/>"><%=session.getAttribute(Constants.SESSION_CLIENT_ID)%></a>
            <a id="app_free" class="button hidden" href="oauth2/logincheck?client_id=freeshare&redirect_uri=http://freeshare.free4lab.com/&email=<s:property value="email"/>&pwdSalt=<s:property value="passwordMd5"/>">freeshare</a>
            <a id="app_cloud" class="button hidden" href="oauth2/logincheck?client_id=appcloud&redirect_uri=http://appcloud.free4lab.com/front/&email=<s:property value="email"/>&pwdSalt=<s:property value="passwordMd5"/>">appcloud</a>
            <a id="app_webrtc" class="button hidden" href="oauth2/logincheck?client_id=webrtc&redirect_uri=http://webrtc.free4lab.com/webrtc/&email=<s:property value="email"/>&pwdSalt=<s:property value="passwordMd5"/>">webRTC</a>
        </div> --%>
        </div>
        <div class="clear"></div>
        <div class="padding715 topmargin_20 centeralign"> 
        	<img src="images/registerSuccess.png"><br />
        	<p class="bigsize">您申请的Free账号为：<s:property value="email"/></p><br /><br /><br />
        	<a id="appdefault"  href="api/oauth2/authorize?client_id=<s:property value="client_id"/>&redirect_uri=<s:property value="redirect_uri"/>"><img src="images/goLogin.png"></a>
        	
            <%-- <span class="greyletter greatsize strong">您可以使用<span class="blackletter">Free</span>账号登录以下应用</span><br />
            <a onclick="show1()" class="padding20"><img src="images/freeshare/logo_inner.png" class="topmargin_10"/></a>
            <a onclick="show2()" class="padding20"><img src="images/appcloud/logo_inner.png" class="topmargin_10"/></a>
            <a onclick="show3()" class="padding20"><img src="images/webrtc/logo_inner.png" class="topmargin_10"/></a> --%>
        </div>      
        </div>
	    <s:include value="/template/_footer.jsp"/>
    </div>
<script type="text/javascript" src="<%=Constants.CSS_JS_SERVER%>js/public.js"></script>
<%-- <script type="text/javascript" src="js/regsuccess.js"></script> --%>
</body> 
</html>
