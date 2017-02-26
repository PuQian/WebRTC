<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN"  "http://www.w3.org/TR/html4/strict.dtd">
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="java.util.*"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<html>
<head>
	<base href="/" />
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1" charset="UTF-8" />
	<link rel="stylesheet" href="css/freeshare_mobile_login.css" />

	<title>freeshare手机版-登录成功</title>
</head>

<body>

   
  <div id="sub">  
      <center>
      <div id="subheader">  
         <h1>freeshare手机版</h1>  
      </div>  
	  </center>
   
      <h1 style="color:#000; margin:2em;">登录成功！</h1>
     
      <center>
      <div id="subfooter">  
        <h1>Copyright ©1996-2014 自邮之翼, All Rights Reserved</h1>
      </div>  
	  </center>
      
  </div>
  <input type="hidden" name="hiddencode" id="hiddencode" value="<%=request.getParameter("code") %>" />
<script>
var id = document.getElementById('hiddencode');
window.mobile.setCode(id.value);
</script>
</body>
</html>