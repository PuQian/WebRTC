<!DOCTYPE html>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<html>
<head>
<base
	href="<%=request.getScheme() + "://" + request.getServerName()
		 + ":" + request.getServerPort() + request.getContextPath()%>/" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>WebRTC 企业管理</title>

<link rel="stylesheet" type="text/css" href="bootstrap/css/bootstrap.min.css">
<link rel="stylesheet" type="text/css" href="bootstrap/css/front.css">
<link rel="stylesheet" type="text/css" href="css/pc/front.css">
<link rel="stylesheet" type="text/css" href="css/pc/rtc_list.css">
<link rel="stylesheet" type="text/css" href="css/pc/bottom_operation.css">
<link rel="stylesheet" type="text/css" href="css/pc/edit_data.css">
<link rel="stylesheet" type="text/css" href="css/pc/switchboard.css">
</head>

<body>

	<div class="pub_banner" sys="webrtc"
		ThirdPartyToken="<s:property value='#session.tpaccToken'/>"
		thirdpartyuser="<s:property value='#session.tpUser'/>"
		user="<s:property value='#session.email'/>"
		acctoken="<s:property value='#session.accessToken.substring(8, 24)'/>"
		userid="<s:property value='#session.userId'/>"
		oauthToken="<s:property value='#session.oauthToken'/>"
		style="display: none"></div>
	
	<!-- 企业用户、客服、管理员权限需要的信息 -->
	<input id="eid" type="hidden" value="<s:property value='enteruser.eid'/>"/>
	<input id="ename" type="hidden" value="<s:property value='enterprise.name'/>"/>
	
	<input id="maxcalltime" type="hidden" value="<s:property value='enteruser.maxcalltime'/>"/>	
	<input id="isadmin" type="hidden" value="<s:property value='enteruser.isadmin'/>"/>
	<input id="isarti" type="hidden" value="<s:property value='enteruser.isarti'/>"/>
	<input id="maxservingnum" type="hidden" value="<s:property value='enteruser.maxservingnum'/>"/>
	<input id="priority" type="hidden" value="<s:property value='enteruser.priority'/>"/>
	<input id="isbindtimer" type="hidden" value="<s:property value='enteruser.isbindtimer'/>"/>
	<input id="loginTime" type="hidden" value="<s:property value='enteruser.loginTime'/>"/>	
	<input id="logoutTime" type="hidden" value="<s:property value='enteruser.logoutTime'/>"/>	
	
	<!-- 常量，增强可读性 -->
	<s:set name="isarti" value="1"/>
	<s:set name="isadmin" value="1"/>
	
<!--头部 菜单-->
<div class="rtc_head_box">
  <div class="rtc_head"> 
    <!------用户信息------->
    <div class="user_info">
      <div class="portrait"><img src="css/pc/images/img/portrait65_1.jpg" width="65" height="65" /></div>
      <h1 class="user_name"><s:property value='#session.email' /></h1>
      <s:if test="enteruser.isadmin == #isadmin"><i class="user_role">管理员</i></s:if>
      <div class="head_tips">
        <ul>
          <li num = "0"><a href="javascript:void(0)"><img src="css/pc/images/rtc_head_tips22.png" width="32" height="32" /><i class="num" style="display:none;"></i></a></li>
          <li num = "0"><a href="javascript:void(0)"><img src="css/pc/images/rtc_head_tips23.png" width="32" height="32" /><i class="num" style="display:none;"></i></a></li>
          <s:if test="enteruser.isarti == #isarti">
         	 <li num = "0"><a href="javascript:void(0)"><img src="css/pc/images/rtc_head_tips21.png" width="32" height="32" /><i class="num" style="display:none;"></i></a></li>
          	 <li style="display:none;"><a id="artiloginlogout" href="javascript:void(0)" onclick="artiLoginLogout(this)"><img src="css/pc/images/rtc_head_artioff.png" width="32" height="32" /></a></li>
          </s:if>
        </ul>
      </div>
    </div>
    <!------用户信息-end------> 
    <!------右侧操作------->
    <div class="rtc_head_right">
      <ul>
        <li class="head_business"><a href="main">业务主页</a></li>
        <li class="head_help"><a href="#">帮助</a></li>
        <li class="head_exit"><a href="#">退出</a></li>
      </ul>
    </div>
    <!------右侧操作 end-------> </div>
</div>
<!--头部 菜单 end--> 

<!--主体-->
<div class="rtc_box"> 
  <!--左-->
  <div class="rtc_box_left"> 
    <!--左 菜单-->
    <div class="rtc_menu">
      <ul>        
     	<li onclick="Home(this);"><i><img src="css/pc/images/rtc_menu_icon0.png" width="50" height="50" /></i><a href="javascript:void(0)">首页</a></li>
        <li onclick="UnderCheck(this);"><i><img src="css/pc/images/rtc_menu_icon21.png" width="50" height="50" /></i><a href="javascript:void(0)">待审核</a></li>
        <li onclick="EnContacts(this);"><i><img src="css/pc/images/rtc_menu_icon22.png" width="50" height="50" /></i><a href="javascript:void(0)">企业通讯录</a></li>
        <li onclick="EnterUser(this);"><i><img src="css/pc/images/rtc_menu_icon23.png" width="50" height="50" /></i><a href="javascript:void(0)">企业用户</a></li>
        <s:if test="enteruser.isarti == #isarti">
        <li onclick="ArtiUser(this);"><i><img src="css/pc/images/rtc_menu_icon24.png" width="50" height="50" /></i><a href="javascript:void(0)">访问用户</a></li>
        </s:if>
      </ul>
    </div>
    <!--左 菜单 end--> 
	<div class="recent_calls">
		<ul id="ActiveList"></ul>
	</div>
  </div>
  <!--左 end--> 
  
  <!--中-->
  <div id="web" class="rtc_box_center2"> 
  	<div id="home">
    <!--中 欢迎与提示-->
    <div class="rtc_index_welcome">
      <h2>嗨，<s:property value='#session.email' />，欢迎回来~~</h2>
     <!--  <p><a href="#">待审核（<strong>1</strong>）</a><a href="#">企业用户（<strong>9</strong>）</a><a href="#">访问用户（99+）</a></p> -->
    </div>
    <!--中 欢迎与提示 end--> 
    
    <!--中 功能介绍-->
    <div class="rtc_index_function rtc_index_function2">
      <ul>
        <li>
          <div class="li_img"><img src="css/pc/images/rtc_index_function21.png" width="75" height="75" /></div>
          <div class="li_text">
            <h3>待审核</h3>
            <p>免费通话<br />
              无需插件，一键发起</p>
          </div>
        </li>
        <li>
          <div class="li_img"><img src="css/pc/images/rtc_index_function22.png" width="75" height="75" /></div>
          <div class="li_text">
            <h3>企业通讯录</h3>
            <p>即时会议，预约会议</p>
          </div>
        </li>
        <li>
          <div class="li_img"><img src="css/pc/images/rtc_index_function23.png" width="75" height="75" /></div>
          <div class="li_text">
            <h3>企业用户</h3>
            <p>通过二维码<br />
              进行视频链接分享</p>
          </div>
        </li>
        <li>
          <div class="li_img"><img src="css/pc/images/rtc_index_function24.png" width="75" height="75" /></div>
          <div class="li_text">
            <h3>访问用户</h3>
            <p>电话、会议、视频记录<br />
              所有记录快捷回顾</p>
          </div>
        </li>
      </ul>
    </div>
    <!--中 功能介绍 end--> 
  </div>
  <!--中 end--> 
  </div>
  
  <!--右--> 
  <div class='rtc_box_right' style='display:none;'></div>
  <!--右 end--> 
</div>
<!--主体 end--> 

<!--底部-->
<div class="rtc_foot_box">
  <div class="foot">
    <p>值电信业务经营许可证A2.B1.B2-20040001 [京网文[2011]0814-291号] | 京ICP备09031924号 </p>
    <p>Copyright © 中国电信集团 版权所有</p>
  </div>
</div>
<!--底部 end-->
	<!-- 企业管理部分需要用到的模态框 -->
	<s:include value="/template/_enteradminModal.jsp"></s:include>
	
	<script type="text/javascript" src="js/plugin_webim/jquery-1.11.1.js"></script>
	<script type="text/javascript" src="js/plugin_webim/strophe-custom-2.0.0.js"></script>
	<script type="text/javascript" src="js/plugin_webim/json2.js"></script>
	<script type="text/javascript" src="js/plugin_webim/easemob.im-1.0.5.js"></script>


	<script type="text/javascript" src="bootstrap/js/bootstrap-modal.min.js"></script>
	<script type="text/javascript" src="bootstrap/js/bootstrap-modalmanager.min.js"></script>
	<script type="text/javascript" src="bootstrap/js/front.js"></script>
	<script type="text/javascript" src="js/plugin_video/org/cometd.js"></script>


	<script type="text/javascript" src="js/plugin_video/jquery/jquery.md5.js"></script>

	<script type="text/javascript" src="js/plugin_video/jquery/jquery.cookie.js"></script>
	<script type="text/javascript" src="js/plugin_video/jquery/jquery.cometd.js"></script>


	<script type="text/javascript" src="js/plugin_video/libcometd.js"></script>
	<script type="text/javascript" src="js/plugin_video/libwebrtc.js"></script>

	<script type="text/javascript" src="js/plugin_video/md5.js"></script>
	<script type="text/javascript" src="js/plugin_video/hashme.js"></script>

	<script type='text/javascript' src='js/plugin_video/init.js'></script>
	<script type="text/javascript" src="js/plugin_video/rtcprotocol.js"></script>
	<script type="text/javascript" src="js/plugin_video/configs.js"></script>


	<script type="text/javascript" src="js/plugin_video/fileSystem/lang_ext.js"></script>
	<script type="text/javascript" src="js/plugin_video/fileSystem/protocolMessage.js"></script>
	<script type="text/javascript" src="js/plugin_video/fileSystem/base64.js"></script>
	<script type="text/javascript" src="js/plugin_video/fileSystem/file.js"></script>
	<script type="text/javascript" src="js/plugin_video/fileSystem/queue.js"></script>
	<script type="text/javascript" src="js/plugin_video/fileSystem/FSio.js"></script>
	<script type="text/javascript" src="js/plugin_video/fileSystem/Block.js"></script>
	<script type="text/javascript" src="js/plugin_video/fileSystem/BlockMap.js"></script>
	<script type="text/javascript" src="js/plugin_video/fileSystem/BlockCache.js"></script>
	<script type="text/javascript" src="js/plugin_video/fileSystem/AvailabilityMap.js"></script>
	<script type="text/javascript" src="js/plugin_video/fileSystem/binaryProtocol.js"></script>


	<script type="text/javascript" src="js/plugin_video/app.js"></script>
	<script type="text/javascript" src="js/plugin_video/SigSession.js"></script>
	<script type="text/javascript" src="js/plugin_video/WConnection.js"></script>
	<script type="text/javascript" src="js/plugin_video/WUserSessionBase.js"></script>
	<script type="text/javascript" src="js/plugin_video/AudioModule.js"></script>
	<script type="text/javascript" src="js/plugin_video/VideoModule.js"></script>
	<script type="text/javascript" src="js/plugin_video/FileModule.js"></script>
	<script type="text/javascript" src="js/plugin_video/IMSAudioModule.js"></script>
	<script type="text/javascript" src="js/plugin_video/IMSVideoModule.js"></script>
	<script type='text/javascript' src="js/plugin_video/MeetingVideoModule.js"></script>
	<script type='text/javascript' src="js/plugin_video/MeetingAudioModule.js"></script>
	<script type="text/javascript" src="js/plugin_video/WOTTSession.js"></script>
	<script type="text/javascript" src="js/plugin_video/WIMSSession.js"></script>
	<script type='text/javascript' src="js/plugin_video/WMeetingSession.js"></script>
	<script type='text/javascript' src="js/plugin_video/udpclient.js"></script>
	<script type="text/javascript" src="js/plugin_video/ArtiUserSession.js"></script>

	<script type='text/javascript' src='js/jquery_cookie.js'></script>

	<script type='text/javascript' src='js/begin.js'></script>
	<script type='text/javascript' src="js/pc/webrtc_admin/startwebrtcPc.js"></script>
<%-- 	<script type='text/javascript' src='js/impc.js'></script> --%>
	<script type='text/javascript' src="js/pc/webrtc_admin/impc.js"></script>
	<script type='text/javascript' src="js/pclogout.js"></script>
	<script type='text/javascript' src="js/pc/webrtc_admin/initAll.js"></script>
<%-- 	<script type='text/javascript' src='js/initAll.js'></script> --%>


	<script type="text/javascript" src="bootstrap/js/bootstrap.min.js"></script>


	<!-- 按企业管理页面布局引入 -->
	<script type='text/javascript' src="js/pc/webrtc_pc/RtcFileArea.js"></script>
	<script type='text/javascript' src="js/pc/webrtc_admin/FunctionArea.js"></script>
	<script type='text/javascript' src="js/pc/webrtc_pc/FunctionArea.js"></script>
	<script type='text/javascript' src="js/pc/webrtc_admin/RtcHead.js"></script>
	<script type='text/javascript' src="js/pc/webrtc_pc/RtcHead.js"></script>
	<script type='text/javascript' src="js/pc/webrtc_pc/RightSide.js"></script>
	<script type='text/javascript' src="js/pc/webrtc_admin/RightSide.js"></script>
	<script type='text/javascript' src="js/pc/webrtc_admin/ActiveList.js"></script>
	<script type='text/javascript' src="js/pc/webrtc_pc/RtcChat.js"></script>
	<script type='text/javascript' src="js/pc/webrtc_admin/RtcCenter.js"></script>
	<script type='text/javascript' src="js/pc/webrtc_pc/RtcVideoAudio.js"></script>
	<script type='text/javascript' src="js/pc/webrtc_pc/local_store.js"></script>
	<script>

		$(document).ready(function(){
			$('.rtc_menu ul li').eq(0).trigger("click"); //初始进入，自动选中首页项
		});
	</script>
</body>
</html>
