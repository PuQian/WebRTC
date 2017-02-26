<!DOCTYPE html>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="java.util.*"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<html>
<head>
	<base href="/" />
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<!-- <meta charset="utf-8"> -->
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>WebRTC 首页</title>
	
	<link rel="stylesheet" href="bootstrap-3.3.2/css/bootstrap.min.css">
	<link rel="stylesheet" href="bootstrap-3.3.2/css/front.css">
	<link rel="stylesheet" href="bootstrap-3.3.2/css/base.css" type="text/css" />
	<link rel="stylesheet" href="bootstrap-3.3.2/css/common.css" type="text/css" />
	<link rel="stylesheet" href="bootstrap-3.3.2/css/index.css" type="text/css" />
	<style>a:hover{TEXT-DECORATION:none}</style>
</head>
<body>
<s:include value="/template/_head.jsp"/>

	<div class="container col-md-8 padding0">
        <div class="row margin0">
            
            <div class="col-md-12 as-carousel padding0">
                <div id="carousel-example-generic" class="carousel slide" data-ride="carousel">
                    <!-- Indicators -->
                    <ol class="carousel-indicators">
                        <li data-target="#carousel-example-generic" data-slide-to="0" class="active"></li>
                        <li data-target="#carousel-example-generic" data-slide-to="1" ></li>
                        <li data-target="#carousel-example-generic" data-slide-to="2" ></li>
                    </ol>
                    <!-- Wrapper for slides -->
                    <div class="carousel-inner" role="listbox">
                        <div class="item active">
                           <img src="images/banner1.jpg" class="img-responsive" alt="Slide1" >
                        </div>
                        <div class="item">
                            <img src="images/banner2.jpg" class="img-responsive" alt="Slide2">
                        </div>
                        <div class="item">
                            <img src="images/banner3.jpg" class="img-responsive" alt="Slide3">
                        </div>
                    </div>
                    <!-- Controls -->
                    <a class="left carousel-control" href="#carousel-example-generic" 

role="button" data-slide="prev">
                        <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
                        <span class="sr-only">Previous</span>
                    </a>
                    <a class="model " href="account/webrtclogin" role="button" >&nbsp;</a>
                    <a class="right carousel-control" href="#carousel-example-generic" 

role="button" data-slide="next">
                        <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
                        <span class="sr-only">Next</span>
                    </a>
                </div>
            </div>
		</div>
	</div>
	
	<!--功能介绍-->
<div class="box">

  <div class="index_function_list">
    
<ul>
        <li><div class="h2_img"><img src="images/index_function_icon1.png" /></div>
      <h2>音视频通话</h2>
      <p>基于Web的高质量音视频通话<br />
无需插件，一键发起</p>
        <p><a href="#" class="li_more">了解更多&gt;&gt;</a></p></li>
        
        <li><div class="h2_img"><img src="images/index_function_icon2.png"  /></div>
      <h2>即时通讯+</h2>
      <p>支持单聊、群聊和文件传输<br />
即时消息，快速送达</p>
        <p><a href="#" class="li_more">了解更多&gt;&gt;</a></p></li>
        
        <li><div class="h2_img"><img src="images/index_function_icon3.png"  /></div>
      <h2>视频会议</h2>
      <p>网络视频会议<br />
支持即时会议和预约会议</p>
        <p><a href="#" class="li_more">了解更多&gt;&gt;</a></p></li>
        
        <li><div class="h2_img"><img src="images/share_4.png"  /></div>
      <h2>企业总机</h2>
      <p>基于即时消息的总机服务<br />
支持查号，直接呼叫企业人员</p>
        <p><a href="#" class="li_more">了解更多&gt;&gt;</a></p></li>
      </ul>
  </div>
</div>
<!--功能介绍 end-->
    <script type="text/javascript" src="js/jquery.min.js"></script>
	<script type="text/javascript" src="bootstrap-3.3.2/js/bootstrap.min.js"></script>
 <s:include value="/template/_global.jsp"/>
	<script type="text/javascript" src="js/login.js"></script>
	<s:include value="/template/_footer.jsp"/>
</body>
</html>
