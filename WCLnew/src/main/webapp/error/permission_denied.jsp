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
	      	<br />
	      	<br />
	      	<br />
	      	<h1>亲，你权限不够哦！</h1>
	      	<!--
	      		<s:property value = "#parameters.id"/>
	      		TODO 当权限不够的时候显示出该资源所在的群组以提供申请加入
	      	-->
	      	<p>请返回。点击<a class="greyletter"  href="?needauth&redirectUrl=<s:property value="redirectUrl" />">这里</a></p>
	      	<br />
	      	<br />
	      	<br />
		</div>
		<!--#inner-->
		<s:include value="/template/_footer.jsp" />
	</div>
	<!--#container-->
	<script	src="<%=APIConstants.APIPrefix_FreeFront%>js/public.js"></script>	
</body>
</html>