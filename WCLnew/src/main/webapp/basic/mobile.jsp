<!DOCTYPE html>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"
	import="java.util.*"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<%@page import="com.free4lab.webrtc.common.APIConstants"%>
<%
	String frontURL = "";
	if (request.getScheme() == "https") {
		frontURL = APIConstants.APIPrefix_FreeFront;
	} else {
		frontURL = APIConstants.APIPrefix_HTTP_FreeFront;
	}

	System.out.println("frontURL=" + frontURL);
%>
<html>
<head>
<base
	href="<%=request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
					+ request.getContextPath()%>/" />
<meta name="viewport" content="width=device-width,  initial-scale=1"
	charset="UTF-8">

<link rel="stylesheet" type="text/css"
	href="bootstrap/css/bootstrap.min.css">
<link rel="stylesheet" type="text/css" href="bootstrap/css/front.css">

<link rel="stylesheet" type="text/css"
	href="css/mobile/frame/jquery.mobile-1.4.5.css">
<link rel="stylesheet" href="css/mobile/frame/pro.css">
<link rel="stylesheet" href="css/mobile/frame/ionicons.css">
<link rel="stylesheet" href="css/mobile/frame/prettify.css">
<link rel="stylesheet" href="css/mobile/frame/doc.css">
<link rel="stylesheet" href="css/mobile/webrtc/webrtc.css">

<title>好消息：在线多媒体通信应用</title>
</head>
<body class="ui-app">
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


	<div data-role="page" id="msghome">
		<div class="ui-top-bar">
			<div class="ui-tab js-active">
				<ul class="ui-groupbutton">
					<li class="ui-button js-active"><a href="#msghome"><span
							class="title-tab-choose">消息</span><span
							class="ui-red-counter  no-visible">123</span></a></li>
					<li class="ui-button"><a href="#callhome"><span
							class="my-title-tab">电话</span></a></li>
				</ul>
			</div>
		</div>
		<div class="ui-page-content">

			<div class="titilesearch">
				<!-- <input class="mysearch" type="search" name="MsgSearch" id="MsgSearch" placeholder="搜索">    -->
				<input class="mysearch" name="MsgSearch" id="MsgSearch"
					placeholder="搜索">
				<input type="file" />
			</div>
			<ul class="ui-list" id="recordlist">
			</ul>
		</div>

		<div class="ui-bottom-bar " role="toolbar">
			<a href="#msghome" class="ui-bottom-bar-button js-active"
				role="button" data-toggle="tab" data-target=".page1"
				data-transition="none"> <img src="images/foot_icon_chat_on.jpg">
				<span class="ui-label choose">对话</span>
			</a> <a href="#msghome"><span
				class="ui-red-counter my-bottom-counter no-visible">15</span> </a> <a
				href="#friendhtml" class="ui-bottom-bar-button" role="button"
				data-toggle="tab" data-target=".page2" data-transition="none"> <img
				src="images/foot_icon_contacts.jpg"> <span class="ui-label ">联系人</span>
			</a> <a href="#friendhtml"><span
				class="ui-red-counter my-bottom-counter no-visible">2</span> </a> <a
				href="javascript:void(0)" class="ui-bottom-bar-button" role="button"
				data-toggle="tab" data-target=".page3"> <img
				src="images/foot_icon_meeting.jpg"> <span class="ui-label">会议</span>
			</a> <a href="javascript:void(0)"><span
				class="ui-red-counter my-bottom-counter no-visible">3</span></a> <a
				href="#mehome" class="ui-bottom-bar-button" role="button"
				data-toggle="tab" data-target=".page4"> <img
				src="images/foot_icon_me.jpg"> <span class="ui-label">我</span>
			</a> <a href="#mehome"><span
				class="ui-red-counter my-bottom-counter no-visible">4</span> </a>
		</div>
	</div>

	<div data-role="page" id="callhome">
		<div class="ui-top-bar js-no-bounce">
			<div class="ui-tab page1 js-active">
				<ul class="ui-groupbutton" role="tablist">
					<li class="ui-button"><a href="#msghome"><span
							class="my-title-tab">消息</span></a></li>
					<li class="ui-button js-active"><a href="#callhome"><span
							class="title-tab-choose">电话</span><span
							class="ui-red-counter  no-visible">123</span></a></li>
				</ul>
			</div>
		</div>

		<div class="ui-page-content">

			<div class="titilesearch">
				<input class="mysearch" name="MsgSearch" id="MsgSearch"
					placeholder="搜索">
			</div>
			<ul class="ui-list">
				<li class="ui-item ui-ignore-space"><a href="#loginpage">
						<div class="my-item-left roundphoto" id="avater">
							<img src="images/icon_business.jpg">
						</div>
						<div class="pictureandps">
							<p class="">企业通信录</p>
							<p class="rightsigns">
								<img src="images/list_icon_arrow.jpg">
							<p>
						</div>
				</a></li>
				<li class="ui-item ui-ignore-space"><a href="#loginpage">
						<div class="my-item-left roundphoto" id="avater">
							<img src="images/icon_telephone.jpg">

						</div>
						<div class="pictureandps">
							<p class="ui-no-wrap">手机通信录</p>
							<p class="rightsigns">
								<img src="images/list_icon_arrow.jpg"></span>
							</p>
						</div>
				</a></li>
			</ul>
			<p class="characterp">通话记录</p>
			<ul class="ui-list">
				<li class="ui-item ui-ignore-space"><a href="#loginpage">
						<div class="my-item-left" id="avater">
							<img src="images/boy.jpg">
						</div>
						<div class="my-item-right">
							<p class="ui-no-wrap">测试1</p>
							<p class="rightsignsfortwoline">
								<img src="images/list_icon_phone.jpg">
							</p>
							<span class="rotatered ui-icon ion-arrow-down-c"></span>
							<p class="rotaterightp ui-gray">10-10</p>

						</div>
				</a></li>
				<li class="ui-item ui-ignore-space"><a href="#loginpage">
						<div class="my-item-left" id="avater">
							<img src="images/animal.jpg">
						</div>
						<div class="my-item-right">
							<p class="ui-no-wrap">测试2</p>
							<p class="rightsignsfortwoline">
								<img src="images/list_icon_phone.jpg">
							</p>
							<span class="rotategreen ui-icon ion-arrow-up-c"></span>
							<p class="rotaterightp ui-gray">10-09</p>

						</div>
				</a></li>
			</ul>
		</div>

		<div class="ui-bottom-bar js-no-bounce" role="toolbar">

			<a href="#msghome" class="ui-bottom-bar-button js-active"
				role="button" data-toggle="tab" data-target=".page1"> <img
				src="images/foot_icon_chat_on.jpg"> <span
				class="ui-label choose">对话</span>
			</a> <a href="#msghome"><span
				class="ui-red-counter my-bottom-counter no-visible">15</span></a> <a
				href="#friendhtml" class="ui-bottom-bar-button" role="button"
				data-toggle="tab" data-target=".page2"> <img
				src="images/foot_icon_contacts.jpg"> <span class="ui-label ">联系人</span>
			</a> <a href="#friendhtml"><span
				class="ui-red-counter my-bottom-counter no-visible">2</span></a> <a
				href="javascript:void(0)" class="ui-bottom-bar-button" role="button"
				data-toggle="tab" data-target=".page3"> <img
				src="images/foot_icon_meeting.jpg"> <span class="ui-label">会议</span>
			</a> <a href="javascript:void(0)"><span
				class="ui-red-counter my-bottom-counter no-visible">3</span></a> <a
				href="#mehome" class="ui-bottom-bar-button" role="button"
				data-toggle="tab" data-target=".page4"> <img
				src="images/foot_icon_me.jpg"> <span class="ui-label">我</span>
			</a> <a href="#mehome"><span
				class="ui-red-counter my-bottom-counter no-visible">4</span> </a>
		</div>
	</div>

	<div data-role="page" id="friendhtml">
		<div class="ui-top-bar js-no-bounce">
			<div class="js-active">
				<p class="titlep">联系人</p>
				<a href="#addfriendhtml"><p class="titlerightp ">添加</p></a>
			</div>

		</div>

		<div class="ui-page-content">

			<div class="titilesearch">

				<input class="mysearch" name="MsgSearch" id="MsgSearch"
					placeholder="搜索">
			</div>
			<div class="ui-content-bar">
				<a class="ui-bottom-bar-button" role="button" data-toggle="tab"
					data-target=".page1">
					<div id="avater">
						<img src="images/icon_friend.jpg"> <span
							class="content-label">好友</span>
					</div>
				</a> <a class="ui-bottom-bar-button" role="button" data-toggle="tab"
					data-target=".page2">
					<div id="avater">
						<img src="images/icon_telephone.jpg"> <span
							class="content-label">通信录</span>
					</div>
				</a> <a class="ui-bottom-bar-button" role="button" data-toggle="tab"
					data-target=".page3">
					<div id="avater">
						<img src="images/icon_group.jpg"> <span
							class="content-label">群组</span>
					</div>
				</a>
			</div>
			<ul class="ui-list">
				<li class="ui-item ui-ignore-space" id="groupone">
					<div id="click">
						<span id="rightordown"
							class="ui-icon ion-arrow-down-b collapsibleicon"></span>
						<p class="onlyps">
							我的好友<span class="onlyps-right ui-gray">1/3</span>
						</p>
					</div>
					<ul class="ui-list no-bottom-border">
					</ul>
				</li>
			</ul>

			<div class="ui-bottom-bar js-no-bounce" role="toolbar">

				<a href="#msghome" class="ui-bottom-bar-button js-active"
					role="button" data-toggle="tab" data-target=".page1"> <img
					src="images/foot_icon_chat.jpg"> <span class="ui-label">对话</span>
				</a> <a href="#msghome"><span
					class="ui-red-counter my-bottom-counter no-visible">15</span> </a> <a
					href="#friendhtml" class="ui-bottom-bar-button" role="button"
					data-toggle="tab" data-target=".page2"> <img
					src="images/foot_icon_contacts_on.jpg"> <span
					class="ui-label choose">联系人</span>
				</a> <a href="#friendhtml"><span
					class="ui-red-counter my-bottom-counter no-visible">2</span> </a> <a
					href="javascript:void(0)" class="ui-bottom-bar-button"
					role="button" data-toggle="tab" data-target=".page3"> <img
					src="images/foot_icon_meeting.jpg"> <span class="ui-label">会议</span>
				</a> <a href="javascript:void(0)"><span
					class="ui-red-counter my-bottom-counter no-visible">3</span></a> <a
					href="#mehome" class="ui-bottom-bar-button" role="button"
					data-toggle="tab" data-target=".page4"> <img
					src="images/foot_icon_me.jpg"> <span class="ui-label">我</span>
				</a> <a href="#mehome"><span
					class="ui-red-counter my-bottom-counter no-visible">4</span> </a>
				<!-- /尾部内容-->
			</div>
		</div>
	</div>

	<div data-role="page" id="mehome">
		<div class="ui-top-bar"></div>
		<div class="ui-page-content"></div>
		<div class="ui-bottom-bar js-no-bounce" role="toolbar">

			<a href="#msghome" class="ui-bottom-bar-button" role="button"
				data-toggle="tab" data-target=".page1"> <img
				src="images/foot_icon_chat.jpg"> <span class="ui-label">对话</span>
			</a> <a href="#msghome"><span
				class="ui-red-counter my-bottom-counter no-visible">15</span></a> <a
				href="#friendhtml" class="ui-bottom-bar-button" role="button"
				data-toggle="tab" data-target=".page2"> <img
				src="images/foot_icon_contacts.jpg"> <span class="ui-label ">联系人</span>
			</a> <a href="#friendhtml"><span
				class="ui-red-counter my-bottom-counter  no-visible">2</span></a> <a
				href="javascript:void(0)" class="ui-bottom-bar-button" role="button"
				data-toggle="tab" data-target=".page3"> <img
				src="images/foot_icon_meeting.jpg"> <span class="ui-label">会议</span>
			</a> <a href="javascript:void(0)"><span
				class="ui-red-counter my-bottom-counter no-visible">3</span> </a> <a
				href="#mehome"><span
				class="ui-red-counter my-bottom-counter no-visible">3</span></a> <a
				href="#mehome" class="ui-bottom-bar-button  js-active" role="button"
				data-toggle="tab" data-target=".page4"> <img
				src="images/foot_icon_me_on.jpg"> <span
				class="ui-label  choose">我</span>
			</a> <a href="#mehome"><span
				class="ui-red-counter my-bottom-counter no-visible">4</span> </a>
			<!-- /尾部内容-->
		</div>
	</div>

	<div data-role="page" id="addfriendhtml">
		<div class="ui-top-bar">
			<div class="js-active">
				<div class="title-left floatleft">
					<a href="#friendhtml"> <span
						class="ion-ios-arrow-back  title-left-icon"></span> <span
						class=" title-left-p">联系人</span>
					</a>
				</div>
				<p class="titlep marginright inline-block">添加</p>
				<!-- <div class="title-right floatright">
                <a href="#audiohome"><span class="ion-mic-a title-right-icon "></span><a>
                <a href="#videohome"><span class="ion-ios-videocam  title-right-icon"></span></a>
            </div>  -->
			</div>
		</div>
		<div class="ui-page-content">

			<div class="friendsearch">
				<!-- <input class="mysearch" type="search" name="MsgSearch" id="MsgSearch" placeholder="搜索">    -->
				<label for="myfriendsearch"><span class="p_label">添加好友</span></label>
				<div class="leftinput">
					<input class="" id="addfridentId" name="myfriendsearch"
						placeholder="账号">
				</div>

				<div class="rightbutton">
					<button type="button" onclick="startAddFriend()">添加</button>
				</div>
				<div id="add-frident-warning"></div>
			</div>
		</div>
	</div>

	<div data-role="page" id="newFriend">
		<div class="ui-top-bar js-no-bounce">
			<div class="js-active">
				<a href="#msghome"><span
					class="ion-ios-arrow-back  title_left_icon"></span><span
					class="title_left_p">消息</span></a> <span class="title_left_p_center">新朋友</span>
			</div>
		</div>

		<div class="ui-page-content">
			<ul class="ui-list" id="newfriendlist">
			</ul>
		</div>
	</div>

	<script type="text/javascript" src="js/plugin_webim/jquery-1.11.1.js"></script>
	<script type="text/javascript"
		src="js/plugin_webim/strophe-custom-2.0.0.js"></script>
	<script type="text/javascript" src="js/plugin_webim/json2.js"></script>
	<script type="text/javascript"
		src="js/plugin_webim/easemob.im-1.0.5.js"></script>


	<script type='text/javascript' src="<%=frontURL%>js/public.js"></script>

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

	<script type="text/javascript" src="js/plugin_video/hashme.js"></script>
	<script type="text/javascript" src="js/plugin_video/md5.js"></script>

	<script type="text/javascript" src="js/plugin_video/init.js"></script>
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
	<script type="text/javascript"
		src="js/plugin_video/WUserSessionBase.js"></script>
	<script type="text/javascript" src="js/plugin_video/AudioModule.js"></script>
	<script type="text/javascript" src="js/plugin_video/VideoModule.js"></script>
	<script type="text/javascript" src="js/plugin_video/FileModule.js"></script>
	<script type="text/javascript" src="js/plugin_video/WOTTSession.js"></script>
	<script type="text/javascript" src="js/plugin_video/WIMSSession.js"></script>

	<script type='text/javascript' src='js/jquery_cookie.js'></script>

	<script type='text/javascript' src='js/begin.js'></script>
	<script type="text/javascript" src="js/startwebrtcMobile.js"></script>
	<script type='text/javascript' src='js/immobile.js'></script>
	<script type='text/javascript' src="js/mobilelogout.js"></script>
	<script type="text/javascript" src="js/mobile/webrtc/webrtc.js"></script>
	<script type='text/javascript' src='js/initMobile.js'></script>

	<script type="text/javascript"
		src="js/mobile/frame/jquery.mobile-1.4.5.js"></script>
	<script type="text/javascript" src="js/mobile/frame/fingerblast.js"></script>
	<script type="text/javascript" src="js/mobile/frame/prettify.js"></script>
	<script type="text/javascript" src="js/mobile/frame/require.js"></script>

</body>

</html>