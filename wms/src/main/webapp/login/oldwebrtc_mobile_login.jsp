<!DOCTYPE html>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="java.util.*"%>

<%@ taglib prefix="s" uri="/struts-tags"%>
<html>
<head>
<base href="/" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="viewport"  content="width=device-width,  initial-scale=1" charset="UTF-8">  
<link rel="stylesheet" href="css/jquery.mobile-1.2.1.min.css" />
</head>
<body>
<body>  

 <div data-role="page" id="sub">  
  
    <div data-role="header" id="subheader" data-position="fixed" data-tap-toggle="false" data-theme="b">  
        <h1>好消息</h1>  
    </div>  
 
    <div data-role="content" id="account">  
    
    <p style="backg"><font color="#2EB1E8" >使用FREE账号登录</font></p>
        <form action="oauth2/logincheck?client_id=<s:property value="client_id" />&redirect_uri=<s:property value="redirect_uri" />&random=<s:property value="random" />" method="post" id="loginform" data-ajax="false" onsubmit="return loginCheck();">
            <input type="text" name="email" id="txemail" value="" placeholder="用户名"/>
            
            <input type="password" name="epsw" id="txpwd" value="" placeholder="密码"/>
            <input type="hidden" name="passwordmd5" id="txpasswordMd5" value=""></input>
            <input type="hidden" id="state" name="state" value="<s:property value="state" />" />
            <input type="hidden" id="random" value="<s:property value="random" />" />
                    <fieldset data-role="controlgroup" >
                        <input type="checkbox" name="checkbox-agree" id="rmbUser" class="custom" />
                        <label for="rmbUser">记住用户名</label>
                    </fieldset>
            <button type="submit" class="button" data-theme="b">登录</button>
        
            <a href="#re">注册账号</a>
        </form>
    <div style="color:red;font-size:0.8em" id="error"><br /></div>
    </div>  
    
   
  
    <div data-role="footer" id="subfooter" data-theme="b" data-position="fixed" data-id="footernav" data-position="fixed" data-tap-toggle="false">  
        <h1>@2014 Copyright Bupt</h1>
    </div>  
    <input type=hidden id=random value="<s:property value="random" />" />
</div> 

<div data-role="page" id="re">  
  
    <div data-role="header" id="reheader" data-position="fixed" data-tap-toggle="false" data-theme="b">  
        <h1>好消息</h1>  
    </div>  
 <div data-role="content" id="reg">  
    
    <p style="backg"><font color="#2EB1E8" >注册Free账号</font></p>
        <form id="signupForm">
            <input type="text" name="email"  value="" onblur="email_isValid_mobile()" placeholder="邮箱名"/>
            
            <input type="password" name="epsw" value="" onblur="epsw_isValid_mobile()" placeholder="密码"/>
            <input type="password" name="cepsw" value="" onblur="cepsw_isValid_mobile()" placeholder="确认密码"/>
         <span class="redletter" id="reerror"><s:property value="message" /><br /></span>
            <button onclick="return regCheckmobile();" type="submit" class="button" data-theme="b">注册</button>
             
                    <a href="#sub">返回登录页面</a>
                    <a id="emailresult"style="display:none" href="#emailsuccess">注册结果</a>
        </form>
   
    </div>  
     <div data-role="footer" id="refooter" data-theme="b" data-position="fixed" data-id="footernav" data-position="fixed" data-tap-toggle="false">  
        <h1>@2014 Copyright Bupt</h1>
    </div>  
   
    </div>
 <div data-role="page" id="emailsuccess">  
  
    <div data-role="header" id="esheader" data-position="fixed" data-tap-toggle="false" data-theme="b">  
        <h1>好消息</h1>  
    </div>  
 <div data-role="content" id="es">  
    
    <p style="backg"><font color="#2EB1E8" >发送Email</font></p>
            <div name="esemail" id="esemail"/></div>
            <div name="redoemail" id="redoemail"/></div>
            <div name="eremail" id="eremail"/></div>
          
                    <a href="#sub">返回登录页面</a>
   
    </div>  
     <div data-role="footer" id="esfooter" data-theme="b" data-position="fixed" data-id="footernav" data-position="fixed" data-tap-toggle="false">  
        <h1>@2014 Copyright Bupt</h1>
    </div>  
   
    </div>   


<s:include value="/template/_global.jsp"/>
<script type="text/javascript" src="js/jquery.mobile-1.2.1.min.js"></script> 
<script type="text/javascript" src="js/login.js"></script>
<script type="text/javascript" src="js/md5.js"></script>
</body>
</html>