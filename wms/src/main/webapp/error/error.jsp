<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="java.util.*"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<base href="<%= request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath() %>/" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>WebRTCERROR页面</title>
</head>
<body>

<div class="indexbg">
  <div id="inner">
    <div class="errorbanner">
      <br />
      <br />
      <br />
      <h1>发生错误╮(╯_╰)╭</h1>
      <br />
      <br />
      <br />      
      <p>返回应用，请点击<a href="">这里</a></p>
      <div>${exceptionStack}</div>
    </div>    
  </div>
  <!--#inner-->
</div>

</body>
</html>
