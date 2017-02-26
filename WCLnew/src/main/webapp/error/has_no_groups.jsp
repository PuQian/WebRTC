<!DOCTYPE html>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"
	import="java.util.*"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<%@page import="com.free4lab.webrtc.common.APIConstants"%>
<html>
<head>
<base
	href="<%=request.getScheme() + "://" + request.getServerName()
					+ ":" + request.getServerPort() + request.getContextPath()%>/" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>用户指南--Free分享</title>
<s:include value="/template/_head.jsp" />
</head>

<body>
	<div id="container">
		<s:include value="/template/_pub_banner.jsp" />
		<s:include value="/template/_banner.jsp" />
		<div id="inner" class="content">
			<div class="sidebar">
				<span class="strong midsize">群组推荐</span> <br />
				<div class="dottedline"></div>
				<table id="re_group">
				</table>
			</div>
			<div class="main leftmargin_0">
				<h1>亲，你还没有群组。你可以有如下选择：<br/><br/>
				1：创建一个群组，邀请好友加入该群组系相互分享资源。<br/><br/>
				2：在右侧推荐群组中选择某个群组加入。<br/><br/>
				否则你将无法正常浏览free分享上的资源。</h1>
				<a href = "group/creategroup.jsp">点此创建群组</a>
			</div>
			<div class="clear"></div>
		</div>
		<!--#inner-->
		<s:include value="/template/_footer.jsp" />
	</div>
<script	type='text/javascript' src="<%=APIConstants.APIPrefix_FreeFront%>js/public.js"></script> 
		<script>
		$(document).ready(function() {
			/*
			 * 获取推荐群组 
			 */
			$(document).ready(function() {
				$.getJSON('getregroups','',	function(data) {
					$.each(data.rgList,function(i,value) {
						var desc = value.info.desc;
						if (desc.length > 35) {
							desc = desc.substring(0,35) + "...";
						}
						$('#re_group').append(
								"<div class= \"topmargin_10\"><a  class = \"blackletter midsize\" href=\"group/getgroupid?uuid="
								+ value.uuid
								+ "\">"
								+ value.info.name
								+ "</a>"
								+ "<br/>"
								+ desc + "</div>");
					})
				});
			})
		})
		</script>
</body>
</html>
