<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="java.util.*"%>
<%@ taglib prefix="s" uri="/struts-tags"%>

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <base href="/" />
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>云海IaaS-一站式虚拟资源平台</title>
  <s:include value="/template/_head.jsp"/>
</head>
<body>
<div class="indexbg">
<div id="inner">
    <div class="logo">
    <img src="images/appcloud/logo_index_iaas.png" border="0" />
    </div><!--logo-->
    <div class="indexbanner">
      <div class="content">
          <div class="slider">
              <div id="lofslidecontent45" class="lof-slidecontent">
                  <div class="preload"><div></div></div>
                  <!-- MAIN CONTENT --> 
                  <div class="lof-main-outer">
                      <ul class="lof-main-wapper">
                          <li><img src="images/appcloud/iaas01.png"/></li> 
                         <li><img src="images/appcloud/iaas02.png"/></li> 
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
        <img src="images/appcloud/2.png" border="0" class="rightmargin_10"/>灵活的主机配置
        <ul class="indexul">
            <li>提供多种云主机硬件配置套餐，轻轻松松一键选硬件</li>
            <li>支持云主机硬件配置自定义，CPU、内存、硬盘、带宽随心配</li>
        </ul>
        <a href='<%=com.free4lab.account.common.Constants.IAAS_LOGIN_URL %>' class="orangebutton rightfloat normalsize topmargin_10">了解详情</a>
        </div>
        <div class="introbox">
        <img src="images/appcloud/3.png" border="0" class="rightmargin_10"/>丰富的模板选择
        <ul class="indexul">
            <li>提供云主机模板，一键即可使用，无需再为装机发愁</li>
            <li>支持空白模板和自主装机，自己的机器自己装</li>
        </ul>
        <a href='<%=com.free4lab.account.common.Constants.IAAS_LOGIN_URL %>' class="orangebutton rightfloat normalsize topmargin_10">了解详情</a>
        </div>
        <div class="introbox">
        <img src="images/appcloud/3iaas.png" border="0" class="rightmargin_10"/>可靠的数据存储
        <ul class="indexul">
            <li>独立于云主机的云硬盘服务，不论主机如何变换，数据永远跟随</li>
            <li>支持多种存储技术（磁阵、分布式文件系统），数据永远可用</li>
        </ul>
        </div>
        <div class="introbox">
        <img src="images/appcloud/4.png" border="0" class="rightmargin_10"/>全面的管理功能
        <ul class="indexul">
            <li>不但直接提供各种常用操作，而且支持VNC远程桌面，让操作高效</li>
            <li>支持按需计时、包月、包年等多种灵活的计费策略，帮您省钱</li>
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
