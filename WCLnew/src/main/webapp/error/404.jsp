<!DOCTYPE html>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="java.util.*"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<%@page import="com.free4lab.webrtc.common.APIConstants"%>
<html>
<head>
<base href="<%= request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath() %>/" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>自邮之翼--Free分享</title>
<s:include value="/template/_head.jsp" />  
</head>
<body>
	<div id="container">
	    <s:include value="/template/_pub_banner.jsp"/>
		<s:include value="/template/_banner.jsp"></s:include>
		<div id="inner" class="content">
			<div class="errorbanner">
		      <br />
		      <br />
		      <br />
		      <h1 style="font-size: xx-large">404 ⊙﹏⊙! 真找不到相关资源哦！</h1>
		      <br />
		      <br />
		      <br />      
		      <p>返回应用，请点击<a class="greyletter" href="">这里</a></p>
		    </div>
		</div>
		<!--#inner-->
		<s:include value="/template/_footer.jsp" />
	</div>
	<!--#container-->
<script	type='text/javascript' src="<%=APIConstants.APIPrefix_FreeFront%>js/public.js"></script> 
</body>
</html>
