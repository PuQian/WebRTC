<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="java.util.*"%>
<%@ taglib prefix="s" uri="/struts-tags"%>

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <base href="/" /> 
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>云海PaaS-开放式应用托管平台</title>
  <s:include value="/template/_head.jsp"/>
</head>
<body>
<div class="indexbg">
<div id="inner">
    <div class="logo">
    <img src="images/appcloud/logo_index_paas.png" border="0" />
    </div><!--logo-->
    <div class="indexbanner">
      <div class="content">
          <div class="slider">
              <div id="lofslidecontent45" class="lof-slidecontent">
                  <div class="preload"><div></div></div>
                  <!-- MAIN CONTENT --> 
                  <div class="lof-main-outer">
                      <ul class="lof-main-wapper">
                          <li><img src="images/appcloud/paas01.png"/></li> 
                         <li><img src="images/appcloud/paas02.png"/></li> 
                      </ul>     
                  </div>
                  <div class="lof-navigator-wapper">
                      <div class="lof-navigator-outer">
                          <ul class="lof-navigator">
                             <li><span>1</span></li>
                             <li><span>2</span></li>
                          </ul>
                      </div>
                  </div> 
               </div> 
          </div><!--slider-->
          <!-- 正常的登录图片 -->
          <s:include value="_login.jsp" /> 
      </div><!--content-->
    </div><!--indexbanner-->
    <div class="content">
        <img src="images/appcloud/provideyou.png" border="0" />
        <div class="clear"></div>
        <div class="introbox">
        <img src="images/appcloud/1.png" border="0" class="rightmargin_10"/>便捷的应用托管
        <ul class="indexul">
            <li>Java Web开发者只需上载War包，一次点击，即可发布</li>
            <li>支持将云主机上的服务发布为应用，用自己的云主机发布自己的应用</li>
        </ul>
        </div>
        <div class="introbox">
        <img src="images/appcloud/2paas.png" border="0" class="rightmargin_10"/>强大的应用管理
        <ul class="indexul">
            <li>一个应用支持发布多个版本，每个版本具有独立的访问链接</li>
            <li>支持在一个应用的多个版本间分发流量，自定义流量分发比例，有效支持A/B测试</li>
        </ul>
        </div>
        <div class="introbox">
        <img src="images/appcloud/3.png" border="0" class="rightmargin_10"/>弹性的应用调度
        <ul class="indexul">
            <li>“单应用多副本”技术自动为应用创建多副本，实现应用多副本间的负荷分担</li>
            <li>实时监控应用负载，“动态扩容”技术助力应用处理能力平滑扩展</li>
        </ul>
        </div>
        <div class="introbox">
        <img src="images/appcloud/4.png" border="0" class="rightmargin_10"/>丰富的开放API
        <ul class="indexul">
            <li>提供丰富的开放API，如：统一认证、单点登录、文件存储、数据库...</li>
            <li>轻松调用开放API，简化应用开发，从此不再重复造轮子 </li>
        </ul>
        </div>
        <div class="clear"></div>
    </div>
</div><!--#inner-->
<s:include value="/template/_footer.jsp"/>
</div>
<s:include value="/template/_global.jsp"/>
<script type="text/javascript" src="js/login.js"></script>
<script type="text/javascript" src="js/md5.js"></script>
</body>
</html>
