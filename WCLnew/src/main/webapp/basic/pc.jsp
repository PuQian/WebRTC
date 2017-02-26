<!DOCTYPE html>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"
	import="java.util.*"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<%@page import="com.free4lab.webrtc.common.APIConstants"%>
<%
	String plateformfrontURL = "";
	if (request.getScheme() == "https") {
		plateformfrontURL = APIConstants.APIPrefix_FreeFront;
	} else {
		plateformfrontURL = APIConstants.APIPrefix_HTTP_FreeFront;
	}

	System.out.println("%%%%$$plateformfrontURL=" + plateformfrontURL);
%>
<html>
<head>
<base
	href="<%=request.getScheme() + "://" + request.getServerName()
					+ ":" + request.getServerPort() + request.getContextPath()%>/" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>WebRTC</title>
<!-- <link rel="stylesheet" href="<%=plateformfrontURL%>css/public.css" />-->
<!-- 	<link rel="stylesheet" type="text/css" href="css/webim.css" />-->
<!-- 	<link rel="stylesheet" type="text/css" href="css/bootstrap.css" /> -->
<link rel="stylesheet" type="text/css" href="bootstrap/css/bootstrap.min.css">
<link rel="stylesheet" type="text/css" href="bootstrap/css/front.css">

<link rel="stylesheet" type="text/css" href="css/plugin/datetimepicker.css">

<link rel="stylesheet" type="text/css" href="css/pc/front.css">

<link rel="stylesheet" type="text/css" href="css/pc/rtc_list.css">
<link rel="stylesheet" type="text/css" href="css/pc/bottom_operation.css">
<link rel="stylesheet" type="text/css" href="css/pc/edit_data.css">
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
	<input type="hidden" id="hide" value="">
	<input type="hidden" id="webrtcMobileFlag" value="">
	<input type="hidden" id="tempvalue" value="">


	<!--导航栏start-->
	<div class="rtc_head_box">
		<div class="rtc_head">

			<!--用户信息start-->
			<div class="user_info">
				<div class="portrait">
					<img src="css/pc/images/img/portrait65_3.jpg" width="65"
						height="65" />
				</div>
				<h1 class="user_name">
					<s:property value='#session.email' />
				</h1>
				<div class="head_tips">
					<ul>
						<li num = "0"><a href="javascript:void(0)" onclick="showMissedCalls()"><img
								src="css/pc/images/rtc_head_tips1.png" width="32" height="32"/><i
								class="num" style="display:none;"></i></a></li>

						<li num = "0"><a href="javascript:void(0)" onclick="showMissedMeetings()"><img
								src="css/pc/images/rtc_head_tips2.png" width="32" height="32" /><i
								class="num" style="display:none;"></i></a></li>

						<li num = "0"><a href="javascript:void(0)"><img
								src="css/pc/images/rtc_head_tips3.png" width="32" height="32" /><i
								class="num" style="display:none;"></i></a></li>
					</ul>
				</div>
			</div>
			<!--用户信息end-->

			<!--右侧操作start-->
			<div class="rtc_head_right">
				<ul>
				    <li class="head_enterprise"><a href="enterAdministration">企业管理</a></li>
					<li class="head_help"><a href="javascript:void(0)">帮助</a></li>
					<li class="head_exit" onclick="logout1()"><a href="javascript:void(0)">退出</a></li>
				</ul>
			</div>
			<!--右侧操作end-->

		</div>
	</div>
	<!--导航栏end-->


	<!--主体-->
	<div class="rtc_box">
		<!--左-->
		<div class="rtc_box_left">

			<!--左 菜单-->
			<div class="rtc_menu">
				<ul>
				    <li onclick="backHome(this);"><i><img 
				            src="css/pc/images/rtc_menu_icon0.png" width="50" height="50" /></i>
				            <a href="javascript:void(0)">首页</a></li>
					<li onclick="WebPhone(this);"><i><img
							src="css/pc/images/rtc_menu_icon1.png" width="50" height="50" /></i>
							<a href="javascript:void(0)">Web电话</a></li>
					<li onclick="MyWebMeeting(this);"><i><img
							src="css/pc/images/rtc_menu_icon2.png" width="50" height="50" /></i>
							<a href="javascript:void(0)">Web会议</a></li>
					<li onclick="VideoShare(this);"><i><img 
					        src="css/pc/images/rtc_menu_icon3.png"width="50" height="50" /></i>
					        <a href="javascript:void(0)">视频分享</a></li>
					<li onclick="HistoryCall(this);"><i><img src="css/pc/images/rtc_menu_icon4.png"
							width="50" height="50" /></i><a href="javascript:void(0)">历史记录</a></li>
				</ul>
			</div>
			<!--左 菜单 end-->
			<!--左活动菜单-->
			<div class="recent_calls">
				<ul id="ActiveList"></ul>
			</div>
		</div>
		<!--左 end-->

		<!--中部-->
		<div id="web" class="rtc_box_center">
			<div id="home">
				<!--中 欢迎与提示-->
				<div class="rtc_index_welcome">
					<h2>
						嗨，
						<s:property value='#session.email' />
						，欢迎回来~~
					</h2>
					<!--<p>
						<a href="javascript:void(0)">未接来电（<strong>1</strong>）
						</a> <a href="javascript:void(0)">Web会议（<strong>9</strong>）
						</a> <a href="javascript:void(0)">好友信息（12+）</a>
					</p>-->
				</div>
				<!--中 欢迎与提示 end-->

				<!--中 功能介绍-->
				<div class="rtc_index_function">
					<ul>
						<li>
							<div class="li_img">
								<img src="css/pc/images/rtc_index_function1.png" width="75"
									height="75" />
							</div>
							<div class="li_text">
								<h3>音视频通话</h3>
								<p>
									免费通话<br /> 无需插件，一键发起
								</p>
							</div>
						</li>
						<li>
							<div class="li_img">
								<img src="css/pc/images/rtc_index_function2.png" width="75"
									height="75" />
							</div>
							<div class="li_text">
								<h3>视频会议</h3>
								<p>即时会议，预约会议</p>
							</div>
						</li>
						<li>
							<div class="li_img">
								<img src="css/pc/images/rtc_index_function3.png" width="75"
									height="75" />
							</div>
							<div class="li_text">
								<h3>视频分享</h3>
								<p>
									通过二维码<br /> 进行视频链接分享
								</p>
							</div>
						</li>
						<li>
							<div class="li_img">
								<img src="css/pc/images/rtc_index_function4.png" width="75"
									height="75" />
							</div>
							<div class="li_text">
								<h3>历史记录</h3>
								<p>
									电话、会议、视频记录<br /> 所有记录快捷回顾
								</p>
							</div>
						</li>
					</ul>
				</div>
				<!--中 功能介绍 end-->
			</div>
		</div>
		<!-- 中部结束 -->

		<!--右部-->
		<div class="rtc_box_right">
                <!--右 搜索框-->
                <input class="friend_search_input" placeholder="搜索好友" oninput="SearchFriends();"/>
				<!--右 搜索框 end-->
				
				<div class="friend_tab">
					<ul class="tab3">
						<li id="onFriend" onclick="FindFriendList();">
						    <i class="tab_li1"></i><a href="javascript:void(0)">好友</a>
						    <!--<div class="dropdown-menu" role="menu"  
                                aria-labelledby="dropdownMenu" id="RrightOnFriend">  
                                <div><a onclick="showAddFriend()" href="javascript:void(0)">添加好友</a></div>  
                                <div><a onclick="showDelFriend()" href="javascript:void(0)">删除好友</a></div>  
                             </div> --> 
                        </li>
						<li id="onGroup" onclick="FindGroupList();">
						    <i class="tab_li2"></i><a href="javascript:void(0)">群组</a>
						    <div class="dropdown-menu" role="menu"  
                                aria-labelledby="dropdownMenu" id="RrightOnGroup">  
                                <div><a onclick="showAddGroup()" href="javascript:void(0)">加入群组</a></div>  
                                <div><a onclick="showCreateGroup()" href="javascript:void(0)">创建群组</a></div>  
            <!-- 
                                <div><a onclick="showDelGroup()" href="javascript:void(0)">退出群组</a></div>  
                                <div><a onclick="showDestroyGroup()" href="javascript:void(0)">解散群组</a></div>  -->
                            </div>  
						</li>
						<li id="onContact" onclick="FindContactGroupList();">
						    <i class="tab_li3"></i><a href="javascript:void(0)">通讯录</a>
						    <div class="dropdown-menu" role="menu"  
                                aria-labelledby="dropdownMenu" id="RrightOnContact">  
                                <div><a onclick="showAddContactGroup()" href="javascript:void(0)">添加分组</a></div>  
                            </div>  
						</li>
					</ul>
				</div>
				<!--右 3段标签 end-->

				<!--右 好友列表-->
				<div class="friend_list_box">
					<div id='list_friend'><!--目前好友分组是写死的，以后要按照通讯录修改-->
					    <h2 class="friend_h2" id="friendh2" onclick="showListFriendUL();"><i class='ul_close'></i>
                                                                                  我的好友</h2>
						<ul id="list_friend_UL" class="friend_list" style="display:none;"></ul>
					</div>

					<div id='list_group'>
						<ul id="list_group_UL" class="friend_list"></ul>
					</div>

					<div id="list_contact"></div>
				</div>
				<!--右 好友列表 end-->
			    <!--右 下 操作-->
                <div class="group_operation">
                  <a href="javascript:void(0)">查找</a>|<a href="javascript:void(0)">消息盒子</a>|<a href="javascript:void(0)">系统设置</a>
                </div>
                <!--右 下 操作 end--> 
			</div>
			<!-- 右部 end -->
	</div>
    <!--主体 end--> 

	<!--底部-->
	<div class="rtc_foot_box">
		<div class="foot">
			<p>值电信业务经营许可证A2.B1.B2-20040001 [京网文[2011]0814-291号] |
				京ICP备09031924号</p>
			<p>Copyright © 中国电信集团 版权所有</p>
		</div>
	</div>
	<!--底部 end-->
	
	
	<!--front-body-->
	<!--	<a data-toggle="front-modal" class="btn btn-default"
		data-title="FreeShare" data-href="template/modal_content1.jsp">模态框</a>-->
<!-- <div class="modal fade" id="myModal" tabindex="-1" role="dialog"
		aria-labelledby="myModalLabel" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal"
						aria-hidden="true">×</button>
					<h4 class="modal-title" id="myModalLabel"></h4>
				</div>
				<div class="modal-body">
					<button type="button" class="btn btn-default"
						onclick="ModalCreateVideoBefore();" data-dismiss="modal">视频
					</button>
					<button type="button" class="btn btn-default"
						onclick="ModalCreateAudioBefore();" data-dismiss="modal">音频</button>
					<button type="button" class="btn btn-default"
						onclick="ModalChat();" data-dismiss="modal">聊天</button>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-default" data-dismiss="modal">关闭
					</button>
				</div>
		</div>
	</div>
</div> -->

	<s:include value="/template/_im.jsp"></s:include>
	<s:include value="/template/_contacts.jsp"></s:include>
	<s:include value="/template/_meetingModal.jsp"></s:include>

	<script type="text/javascript" src="js/plugin_webim/jquery-1.11.1.js"></script>
	<script type="text/javascript"
		src="js/plugin_webim/strophe-custom-2.0.0.js"></script>
	<script type="text/javascript" src="js/plugin_webim/json2.js"></script>
	<script type="text/javascript"
		src="js/plugin_webim/easemob.im-1.0.5.js"></script>
	<script type="text/javascript" src="js/plugin/datetimepicker.js"></script>

	<script type="text/javascript"
		src="bootstrap/js/bootstrap-modal.min.js"></script>
	<script type="text/javascript"
		src="bootstrap/js/bootstrap-modalmanager.min.js"></script>
	<script type="text/javascript" src="bootstrap/js/front.js"></script>
	<script type="text/javascript" src="js/plugin_video/org/cometd.js"></script>


	<script type="text/javascript"
		src="js/plugin_video/jquery/jquery.md5.js"></script>

	<script type="text/javascript"
		src="js/plugin_video/jquery/jquery.cookie.js"></script>
	<script type="text/javascript"
		src="js/plugin_video/jquery/jquery.cometd.js"></script>


	<script type="text/javascript" src="js/plugin_video/libcometd.js"></script>
	<script type="text/javascript" src="js/plugin_video/libwebrtc.js"></script>

	<script type="text/javascript" src="js/plugin_video/md5.js"></script>
	<script type="text/javascript" src="js/plugin_video/hashme.js"></script>

	<script type='text/javascript' src='js/plugin_video/init.js'></script>
	<script type="text/javascript" src="js/plugin_video/rtcprotocol.js"></script>
	<script type="text/javascript" src="js/plugin_video/configs.js"></script>


	<script type="text/javascript"
		src="js/plugin_video/fileSystem/lang_ext.js"></script>
	<script type="text/javascript"
		src="js/plugin_video/fileSystem/protocolMessage.js"></script>
	<script type="text/javascript"
		src="js/plugin_video/fileSystem/base64.js"></script>
	<script type="text/javascript" src="js/plugin_video/fileSystem/file.js"></script>
	<script type="text/javascript"
		src="js/plugin_video/fileSystem/queue.js"></script>
	<script type="text/javascript" src="js/plugin_video/fileSystem/FSio.js"></script>
	<script type="text/javascript"
		src="js/plugin_video/fileSystem/Block.js"></script>
	<script type="text/javascript"
		src="js/plugin_video/fileSystem/BlockMap.js"></script>
	<script type="text/javascript"
		src="js/plugin_video/fileSystem/BlockCache.js"></script>
	<script type="text/javascript"
		src="js/plugin_video/fileSystem/AvailabilityMap.js"></script>
	<script type="text/javascript"
		src="js/plugin_video/fileSystem/binaryProtocol.js"></script>


	<script type="text/javascript" src="js/plugin_video/app.js"></script>
	<script type="text/javascript" src="js/plugin_video/SigSession.js"></script>
	<script type="text/javascript" src="js/plugin_video/WConnection.js"></script>
	<script type="text/javascript" src="js/plugin_video/WUserSessionBase.js"></script>
	<script type="text/javascript" src="js/plugin_video/AudioModule.js"></script>
	<script type="text/javascript" src="js/plugin_video/VideoModule.js"></script>
	<script type="text/javascript" src="js/plugin_video/FileModule.js"></script>
	<script type="text/javascript" src="js/plugin_video/IMSAudioModule.js"></script>
	<script type="text/javascript" src="js/plugin_video/IMSVideoModule.js"></script>
	<script type='text/javascript'
		src="js/plugin_video/MeetingVideoModule.js"></script>
	<script type='text/javascript'
		src="js/plugin_video/MeetingAudioModule.js"></script>
	<script type="text/javascript" src="js/plugin_video/WOTTSession.js"></script>
	<script type="text/javascript" src="js/plugin_video/WIMSSession.js"></script>
	<script type='text/javascript' src="js/plugin_video/WMeetingSession.js"></script>
	<script type='text/javascript' src="js/plugin_video/udpclient.js"></script>

	<script type='text/javascript' src='js/jquery_cookie.js'></script>

	<script type='text/javascript' src='js/begin.js'></script>
	<script type='text/javascript' src="js/startwebrtcPc.js"></script>
	<script type='text/javascript' src='js/impc.js'></script>
	<script type='text/javascript' src="js/pclogout.js"></script>
	<script type='text/javascript' src='js/initAll.js'></script>


	<script type="text/javascript" src="bootstrap/js/bootstrap.min.js"></script>


	<script type='text/javascript' src="js/pc/webrtc_pc/FunctionArea.js"></script>
	<script type='text/javascript' src="js/pc/webrtc_pc/RightSide.js"></script>
	<script type='text/javascript' src="js/pc/webrtc_pc/ActiveList.js"></script>
	<script type='text/javascript' src="js/pc/webrtc_pc/Contacts.js"></script>
	<script type='text/javascript' src="js/pc/webrtc_pc/RtcChat.js"></script>
	<script type='text/javascript' src="js/pc/webrtc_pc/RtcMeetingArea.js"></script>
	<script type='text/javascript' src="js/pc/webrtc_pc/RtcMeetingGroup.js"></script>
	<script type='text/javascript' src="js/pc/webrtc_pc/RtcVideoAudio.js"></script>
	<script type='text/javascript' src="js/pc/webrtc_pc/RtcVideoShare.js"></script>
	<script type='text/javascript' src="js/pc/webrtc_pc/RtcHistoryCallArea.js"></script>
	<script type='text/javascript' src="js/pc/webrtc_pc/RtcHistoryChat.js"></script>
	<script type='text/javascript' src="js/pc/webrtc_pc/RtcHistoryMeeting.js"></script>
	<script type='text/javascript' src="js/pc/webrtc_pc/RtcHistoryVideoShare.js"></script>
	<script type='text/javascript' src="js/pc/webrtc_pc/RtcFileOffline.js"></script>
	<script type='text/javascript' src="js/pc/webrtc_pc/RtcFileArea.js"></script>
	<script type='text/javascript' src="js/pc/webrtc_pc/RtcHead.js"></script>	
	<script type='text/javascript' src="js/pc/webrtc_pc/RtcSearch.js"></script>	
	<script type='text/javascript' src="js/pc/webrtc_pc/store.min.js"></script>
	<script type='text/javascript' src="js/pc/webrtc_pc/local_store.js"></script>

	<script>
		$(document).ready(function(){
			
			//初次进入的默认设置
			backHome($('.rtc_menu ul li').eq(0)); //首页菜单项选中
			FindFriendList(); //好友选项卡选中
		});
	</script>
</body>
</html>