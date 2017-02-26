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
<title>欢迎进入自邮之翼--WebRTC</title>
<s:include value="/template/_head.jsp" />
</head>
<body>
<div class="indexbg">
	<div id="inner">
	 <div class="logo" style="height:73px;">
        <img src="images/webrtc/logo_index.png" border="0" alt="WebRTCLogo"/>
     </div><!--logo-->
	    <div class="indexbanner">
	      <div class="content">
	          <div class="slider">
	              <div id="lofslidecontent45" class="lof-slidecontent" style="width:625px; height:242px;">
	                  <div class="preload"><div></div></div>
	                  <!-- MAIN CONTENT --> 
	                  <div class="lof-main-outer">
	                      <ul class="lof-main-wapper">
	                          <li><img src="images/webrtc/01.png"/></li> 
	                        <!--  <li><img src="images/02.png"/></li> 
	                         <li><img src="images/03.png"/></li> --> 
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
	            <s:include value="_login.jsp" /> 
	      </div><!--content-->
	    </div><!--indexbanner-->
	    <div class="content">
	        <img src="images/webrtc/provideyou.png" border="0" />
	        <div class="clear"></div>
	        <div class="introbox">
	         <img src="images/webrtc/3.png" border="0" class="rightmargin_10"/>多媒体通信
	        <ul class="indexul">
	            <li>整合语音视频通话，千里之外，音容笑貌亦如咫尺</li>
				<li>集成呈现服务，好友状态实时更新，沟通更顺畅</li>
	        </ul>
	   
	        </div>
	        <div class="introbox">
	        <img src="images/webrtc/2.png" border="0" class="rightmargin_10"/>整合通讯录
	        <ul class="indexul">
	            <li>联系人快速分组，即时搜索，使用便捷</li>
				<li>无缝整合 webRTC 、QQ、E-Mail多种通信方式</li>
	        </ul>
	        </div>
	        <div class="introbox">
	             <img src="images/webrtc/1.png" border="0" class="rightmargin_10"/>纯网页应用
	        <ul class="indexul">
	            <li>无需客户端，无需插件，浏览器搞定一切</li>
				<li>用户个性云端存储，配置数据安全稳固</li>
	        </ul>
	        </div>
	        <div class="introbox">
	        <img src="images/webrtc/4.png" border="0" class="rightmargin_10"/>新技术优体验
	        <ul class="indexul">
	            <li>HTML5+WebSocket，多媒体通信更加流畅</li>
				<li>浏览器与服务器双向通信，应用响应更加迅捷</li>
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
</body>
</html>