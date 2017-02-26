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
	<title>登录首页</title>
	<link rel="stylesheet" href="bootstrap-3.3.2/css/bootstrap.min.css">
	<link rel="stylesheet" href="bootstrap-3.3.2/css/front.css">
</head>
<body>
	<nav class="navbar navbar-default" style="border-radius: 0">
		<div class="container">
			<div class="row">
				<div class="navbar-header" style="margin-left: 4%">
					<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
			        <span class="sr-only">Toggle navigation</span>
			        <span class="icon-bar"></span>
			        <span class="icon-bar"></span>
			        <span class="icon-bar"></span>
			      </button>
			       <a class="navbar-brand front-brand"><div class="front-brand-img"></div></a>
				</div>
				<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1" style="padding-right:0">
			      <ul class="nav navbar-nav navbar-right" style="margin-right:4%">
			        <li><a  href="javascript:void(0)" class="free_reg" style="text-decoration:underline">免费注册</a></li>
			        <li><a href="account/freesharelogin" style="text-decoration:underline;padding-right:0">登录</a></li>
			      </ul>
			    </div>
			</div>
		</div>
	</nav>
	<div class="hero jumbotron">
	  <div class="container">
	  	<div class="row">
	  		<div style="margin-left:4%"><h1 style="color: white">面向群组的<div>在线知识管理应用</div></h1></div>
	  	</div>
	  	<div class="row top_margin30">
	  		<div style="margin-left:4%">
	  			<a class="btn btn-info btn-lg login-page-btn free_reg">免费注册</a>&nbsp;
	  			<a class="btn btn-info btn-lg login-page-btn" href="account/freesharelogin">立即登录</a>
	  		</div>
	  	</div>
	  </div>
	</div>
	
	<div class="container" style="margin-top: -40px">
		<div class="row text-center" style="margin-bottom: 40px">
			<img src="images/freeshare/free_provider.png" alt="">
		</div>
		<div class="row">
			<div class="col-xs-6 col-md-3 text-center feature">
				<div>
					<div>
						<img src="images/freeshare/share_1.png" width="50%" alt="">
					</div>
					<h4>丰富的分享类型</h4>
					<div>
						<p>文档、话题、视频，应有尽有</p>
					</div>
				</div>
			</div>
			<div class="col-xs-6 col-md-3 text-center feature">
				<div>
					<div>
						<img src="images/freeshare/share_2.png" width="50%" alt="">
					</div>
					<h4>强大的全局搜索</h4>
					<div>
						<p>找到需要的资源很容易</p>
					</div>
				</div>
			</div>
			<div class="clearfix visible-xs-block"></div>
			<div class="col-xs-6 col-md-3 text-center feature">
				<div>
					<div>
						<img src="images/freeshare/share_3.png" width="50%" alt="">
					</div>
					<h4>创新的资源列表</h4>
					<div>
						<p>将资源高效有序的组织在一起</p>
					</div>
				</div>
			</div>
			<div class="col-xs-6 col-md-3 text-center feature">
				<div>
					<div>
						<img src="images/freeshare/share_4.png" width="50%" alt="">
					</div>
					<h4>完备的群组权限</h4>
					<div>
						<p>让知识在群组内可控流转</p>
					</div>
				</div>
			</div>
			<div class="clearfix visible-xs-block"></div>
			<div class="col-xs-6 col-md-3 text-center feature">
				<div>
					<img src="images/freeshare/share_5.png" width="50%" alt="">
				</div>
				<h4>全面的群组管理</h4>
				<div>
					<p>让群组那些事儿井井有条</p>
				</div>
			</div>
			<div class="col-xs-6 col-md-3 text-center feature">
				<div>
					<img src="images/freeshare/share_6.png" width="50%" alt="">
				</div>
				<h4>整合的通信方式</h4>
				<div>
					<p>用邮件、QQ、微博@便捷交流</p>
				</div>
			</div>
			<div class="clearfix visible-xs-block"></div>
			<div class="col-xs-6 col-md-3 text-center feature">
				<div>
					<img src="images/freeshare/share_7.png" width="50%" alt="">
				</div>
				<h4>集成的网页消息</h4>
				<div>
					<p>用多媒体通信实时互动</p>
				</div>
			</div>
			<div class="col-xs-6 col-md-3 text-center feature">
				<div>
					<img src="images/freeshare/share_8.png" width="50%" alt="">
				</div>
				<h4>多样的开放接口</h4>
				<div>
					<p>用分享我的能力让你强大</p>
				</div>
			</div>
		</div>
	</div>
	<script type="text/javascript" src="js/jquery.min.js"></script>
	<script type="text/javascript" src="bootstrap-3.3.2/js/bootstrap.min.js"></script>
	<s:include value="/template/_global.jsp"/>
	<script type="text/javascript" src="js/login.js"></script>
	<footer class="footer text-center">
		<p>
			<img src="images/freeshare/share_logo.png" alt="">
		</p>
		<p class="footer-copyright">
			Copyright © 1996-2015 自邮之翼, All Rights Reserved
		</p>
	</footer>
	<%-- <s:include value="/template/_global.jsp"/>
	<script type="text/javascript" src="js/jquery.min.js"></script>
	<script type="text/javascript" src="bootstrap-3.3.2/js/bootstrap.min.js"></script> --%>
</body>
</html>
