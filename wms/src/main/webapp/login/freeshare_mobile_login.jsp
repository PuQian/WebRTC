<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN"  "http://www.w3.org/TR/html4/strict.dtd">
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="java.util.*"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<html>
<head>
	<base href="/" />
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1" charset="UTF-8" />
	<link rel="stylesheet" href="css/freeshare_mobile_login.css" />
	<script type="text/javascript" src="js/md5.js"></script>
	<title>freeshare手机版-登录</title>
</head>
<body>

   
  <div id="sub">  
      <center>

	  
     <div id="account">  
             <img src="images/freeshare_mobile_logo.png">
             <form action="oauth2/logincheck?client_id=<s:property value="client_id"/>&" method="post" id="loginform" onSubmit="return loginCheck();">
                 <table>
				 <tr style="margin:30em;">
				    <td>
				      <input type="text" name="email" id="txemail" value="" placeholder=" 用户名"/>
					</td>
				 </tr>
				 <tr>
				    <td>
                      <input type="password" name="epsw" id="txpwd" value="" placeholder=" 密码"/>
					</td>
				 </tr>
				 <tr>
				    <td>
                       <input type="hidden" name="passwordmd5" id="txpasswordMd5" value=""></input>
                       <input type="hidden" id="random" name="random" value="<s:property value="random" />" />
					</td>
				 </tr>
				 <tr>
				    <td>
                       <button type="submit" class="button" value="submit">登 录</button>
					</td>
				 </tr>
			    </table>
             </form>
      
          <div style="color:red;font-size:0.8em;margin-left:1em; margin-top:1em;" id="error"><s:property value="message" /><br /></div>
      </div>  

      <div id="subfooter">  
        <p>Copyright ©1996-2014 自邮之翼, All Rights Reserved</p>
      </div>  

	  </center>
      
  </div>
  <input type="hidden" id="hiddenUrl" value="<s:property value="#session.url" />" />
  <input type="hidden" id="hiddenResult" value="<s:property value="result" />" />
  
 <script>
( function(){
		var result = document.getElementById('hiddenResult').value;
		//alert(result);
		if(result == "wrong"){
			//alert($('#hiddenUrl').val())
			//$('#error').text('');
			var url = document.getElementById('hiddenUrl').value;
			
			if(url.indexOf("&message=") != -1){
				url = url.substring(0,url.indexOf("&message="));
				document.getElementById('hiddenUrl').value = url ;
			}
			//alert(url)
			location.href = url + "&message=" + document.getElementById('error').innerText;
		}
		
	})()
//判断是否是email
 function isEmail(str){
     var reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
     return reg.test(str);
 }
 
 function loginCheck(){
		var str=document.getElementById('txemail').value;
		var str1 = document.getElementById('txpwd').value;
		var random = document.getElementById('random').value;
			if(str == ""){
				document.getElementById('error').innerHTML = "请输入邮箱名称！";
				return false;st
			}else if(!isEmail(str)){
				document.getElementById('error').innerHTML = "输入的邮箱有误！";
				return false;
			}else{
				document.getElementById('error').innerHTML = "<br/>";
			}
			if(str1 == ""){
				document.getElementById('error').innerHTML = "请输入密码！";
				return false;
			}else{
				document.getElementById('error').innerHTML = "<br/>";
			}
		document.getElementById('txpasswordMd5').value = hex_md5(random+hex_md5(hex_md5(str1)+str));
		//alert(document.getElementById('txpasswordMd5').value);
		return true;
 }
 
 </script>
</body>
</html>
<%-- <!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN"  "http://www.w3.org/TR/html4/strict.dtd">
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="java.util.*"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<html>
<head>
	<base href="/" />
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1" charset="UTF-8" />
	<link rel="stylesheet" href="css/freeshare_mobile_login.css" />
  	<script type="text/javascript" src="js/md5.js"></script>
  	<!-- <script src="http://code.jquery.com/mobile/1.2.1/jquery.mobile-1.2.1.min.js"></script>  -->
	<title>freeshare手机版-登录</title>
</head>

<body>

   
  <div id="sub">  
      <center>
      <div id="subheader">  
         <h1>freeshare手机版</h1>  
      </div>  
	  </center>
 
     <div id="account">  
	   <p>使用FREE账号登录</p>
		 <center>
             <form action="oauth2/logincheck" method="post" id="loginform" onSubmit="return loginCheck();">
                 <table>
				 <tr>
				    <td>
				      <input type="text" name="email" id="txemail" value="" placeholder="用户名"/>
					</td>
				 </tr>
				 <tr>
				    <td>
                      <input type="password" name="epsw" id="txpwd" value="" placeholder="密码"/>
					</td>
				 </tr>
				 <tr>
				    <td>
                       <input type="hidden" name="passwordmd5" id="txpasswordMd5" value=""></input>
					</td>
				 </tr>
				 <tr>
				    <td>
                       <button type="submit" class="button" value="submit">登 录</button>
					</td>
				 </tr>
			    </table>
             </form>
        </center>
          <div style="color:red;font-size:0.8em;margin-left:1em; margin-top:1em;" id="error"><s:property value="message" /><br /></div>
      </div>  
      <center>
      <div id="subfooter">  
        <h1>@2014 Copyright Bupt</h1>
      </div>  
	  </center>
      
  </div>
  <input type="hidden" id="random" value="<s:property value="random" />" />
  <input type="hidden" id="hiddenUrl" value="<s:property value="#session.url" />" />
  <input type="hidden" id="hiddenResult" value="<s:property value="result" />" />
  
 <script>
( function(){
		var result = document.getElementById('hiddenResult').value;
		//alert(result);
		if(result == "wrong"){
			//alert($('#hiddenUrl').val())
			//$('#error').text('');
			var url = document.getElementById('hiddenUrl').value;
			
			if(url.indexOf("&message=") != -1){
				url = url.substring(0,url.indexOf("&message="));
				document.getElementById('hiddenUrl').value = url ;
			}
			//alert(url)
			location.href = url + "&message=" + document.getElementById('error').innerText;
		}
		
	})()
//判断是否是email
 function isEmail(str){
     var reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
     return reg.test(str);
 }
 
 function loginCheck(){
		var str=document.getElementById('txemail').value;
		var str1 = document.getElementById('txpwd').value;
		var random = document.getElementById('random').value;
			if(str == ""){
				document.getElementById('error').innerHTML = "请输入邮箱名称！";
				return false;st
			}else if(!isEmail(str)){
				document.getElementById('error').innerHTML = "输入的邮箱有误！";
				return false;
			}else{
				document.getElementById('error').innerHTML = "<br/>";
			}
			if(str1 == ""){
				document.getElementById('error').innerHTML = "请输入密码！";
				return false;
			}else{
				document.getElementById('error').innerHTML = "<br/>";
			}
		document.getElementById('txpasswordMd5').value = hex_md5(random+hex_md5(hex_md5(str1)+str));
		return true;
 }
 
 </script>
</body>
</html>
 --%>