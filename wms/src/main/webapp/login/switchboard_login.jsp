<!DOCTYPE html>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="java.util.*"%>
<%
	//获取返回客户端的地址参数
	String client_id = (String)request.getAttribute("client_id");
	String redirect_uri = java.net.URLEncoder.encode((String)request.getAttribute("redirect_uri"),"utf-8");
	String random = (String)request.getAttribute("random");

	//重定向请求获取临时账号
	response.sendRedirect(request.getContextPath() + "/oauth2/logincheck?client_id="+client_id+"&redirect_uri="+redirect_uri+"&random="+random);
%>