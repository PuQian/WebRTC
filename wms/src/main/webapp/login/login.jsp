<!DOCTYPE html>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="java.util.*"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<html>
<head>
<base href="/" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link href="bootstrap-3.3.2/css/base.css" rel="stylesheet" type="text/css" />
  <link href="bootstrap-3.3.2/css/common.css" rel="stylesheet" type="text/css" />
  <link href="bootstrap-3.3.2/css/login.css" rel="stylesheet" type="text/css" />
<title>欢迎使用Free账号</title>
<s:include value="/template/_head.jsp" />
</head>
<body>
<div class="indexbg">
    <div id="inner">
    <div class="logo" style="height:73px;">
        <img src="images/logo_index.png" border="0" alt="Free账号"/>
    </div><!--logo-->
        <div class="indexbanner">
          <div class="content">
              <div class="slider">
                  <div id="lofslidecontent45" class="lof-slidecontent" style="width:625px; height:242px;">
                      <div class="preload"><div></div></div>
                      <!-- MAIN CONTENT --> 
                      <div class="lof-main-outer">
                          <ul class="lof-main-wapper">
                             <li><img src="images/01.png"/></li> 
                             <li><img src="images/02.png"/></li> 
                             <li><img src="images/03.png"/></li> 
                          </ul>     
                      </div>
                      <div class="lof-navigator-wapper">
                          <div class="lof-navigator-outer">
                              <ul class="lof-navigator">
                                 <li><span>1</span></li>
                                 <li><span>2</span></li>
                                 <li><span>3</span></li>             
                              </ul>
                          </div>
                      </div> 
                   </div> 
              </div><!--slider-->  
           <s:include value="/login/_login.jsp" /> 
          </div><!--content-->
        </div><!--indexbanner-->
        <div class="content">
            <img src="images/freeshare/provideyou.png" border="0" />
            <div class="clear"></div>
            <div class="introbox">
             <img src="images/1.png" border="0" class="rightmargin_10"/>统一认证
            <ul class="indexul">
                <li>一个账号包打四方 ，用一个账号登录各种应用</li>
            </ul>
       
            </div>
            <div class="introbox">
            <img src="images/2.png" border="0" class="rightmargin_10"/>单点登录
            <ul class="indexul">
                <li>一次登录，应用间无缝漫游，一通百通</li>
            </ul>
            </div>
            <div class="introbox">
                 <img src="images/3.png" border="0" class="rightmargin_10"/>信息整合
            <ul class="indexul">
                <li>一处管理个人信息，一次填写，处处使用</li>
            </ul>
            </div>
            <div class="introbox">
            <img src="images/4.png" border="0" class="rightmargin_10"/>安全保障
            <ul class="indexul">
                <li>用户密码、信息加密保存，授权使用，杜绝滥用</li>
            </ul>
            </div>
            <div class="clear"></div>
        </div>
    </div><!--#inner-->
    <s:include value="/template/_footer.jsp"/>
</div><!--indexbg-->
<s:include value="/template/_global.jsp"/>
<script type="text/javascript" src="js/login.js"></script>
<script type="text/javascript" src="js/md5.js"></script>
<script type="text/javascript">
$(function(){
	if(getQueryString("reg") == "1"){
		gotoRegister();
	}
})
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]); return null;
}
</script>
</body>
</html>