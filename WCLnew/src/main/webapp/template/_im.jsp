<!DOCTYPE html>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"
	import="java.util.*"%>
<div id="loginmodal" class="modal hide fade in" role="dialog"
	aria-hidden="true" data-backdrop="static">
	<div class="modal-header">
		<h3>用户登录</h3>
	</div>
	<div class="modal-body">
		<table>
			<tr>
				<td width="65%"><label for="username">用户名:</label> <input
					type="text" name="username" value="" id="username" tabindex="1" />
					<label for="password">密码:</label> <input type="password" value=""
					name="password" id="password" tabindex="2" /></td>
			</tr>
		</table>
	</div>
	<div class="modal-footer">
		<button class="flatbtn-blu" onclick="login()" tabindex="3">登录</button>
		<button class="flatbtn-blu" onclick="showRegist()" tabindex="4">注册</button>
	</div>
</div>

<!-- 注册操作界面 -->
<div id="regist-div-modal" class="alert modal fade hide" role="dialog"
	aria-hidden="true" data-backdrop="static">
	<div class="modal-header">
		<h3>用户注册</h3>
	</div>
	<div class="modal-body">
		<div id="regist_div" style="overflow-y: auto">
			<table>
				<tr>
					<td width="65%"><label>用户名:</label> <input type="text"
						value="" id="regist_username" tabindex="1" /> <label>密码:</label>
						<input type="password" value="" id="regist_password" tabindex="2" />
						<label>昵称:</label> <input type="text" value=""
						id="regist_nickname" tabindex="3" /></td>
				</tr>
			</table>
		</div>
	</div>
	<div class="modal-footer">
		<button id="confirm-regist-confirmButton" class="btn btn-primary"
			onclick="regist()">完成</button>
		<button id="confirm-regist-cancelButton" class="btn"
			onclick="showlogin()">返回</button>
	</div>
</div>

<div id="waitLoginmodal" class="modal hide fade" data-backdrop="static">
	<img src="img/waitting.gif">
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;正在努力加载中...
	</img>
</div>
<div class="content" id="content" style="display: none">
	<div class="leftcontact" id="leftcontact">
		<div id="headerimg" class="leftheader">
			<span> <img src="img/head/header2.jpg" alt="logo"
				class="img-circle" width="60px" height="60px"
				style="margin-top: -40px; margin-left: 20px" />
			</span> <span id="login_user" class="login_user_title"> <a
				class="leftheader-font" href="javascript:void(0)"></a>
			</span> <span>
				<div class="btn-group" style="margin-left: 5px;">
					<button class="btn btn-inverse dropdown-toggle"
						data-toggle="dropdown">
						<span class="caret"></span>
					</button>
					<ul class="dropdown-menu">
						<li><a href="javascript:void(0)" onclick="showAddFriend()">添加好友</a></li>
						<li><a href="javascript:void(0)" onclick="showDelFriend()">删除好友</a></li>
						<li><a href="javascript:void(0)" onclick="showAddGroup()">加入群组</a></li>
						<li><a href="javascript:void(0)" onclick="showDelGroup()">退出群组</a></li>
						<li><a href="javascript:void(0)" onclick="showCreateGroup()">创建群组</a></li>
						<li><a href="javascript:void(0)" onclick="showDestroyGroup()">解散群组</a></li>
						<li class="divider"></li>
						<li><a href="javascript:void(0)" onclick="logout()">退出</a></li>
					</ul>
				</div>
			</span>
		</div>
		<div id="leftmiddle">
			<!--
				<input style="width: 120px; color: #999999; margin-top: 8px;"
					type="text" id="searchfriend" value="搜索"
					onFocus="if(value==defaultValue){value='';this.style.color='#000'}"
					onBlur="if(!value){value=defaultValue;this.style.color='#999'}" />
			<button id="searchFriend" style="background: #cccccc">查询</button>
			-->
		</div>
		<div id="contractlist11"
			style="height: 492px; overflow-y: auto; overflow-x: auto;">
			<div class="accordion" id="accordionDiv">
				<div class="accordion-group">
					<div class="accordion-heading">
						<a id="accordion1" class="accordion-toggle" data-toggle="collapse"
							data-parent="#accordionDiv" href="#collapseOne">我的好友</a>
					</div>
					<div id="collapseOne" class="accordion-body collapse in">
						<div class="accordion-inner" id="contractlist">
							<ul id="contactlistUL" class="chat03_content_ul"></ul>
						</div>
					</div>
				</div>
				<div class="accordion-group">
					<div class="accordion-heading">
						<a id="accordion2" class="accordion-toggle collapsed"
							data-toggle="collapse" data-parent="#accordionDiv"
							href="#collapseTwo">我的群组</a>
					</div>
					<div id="collapseTwo" class="accordion-body collapse">
						<div class="accordion-inner" id="contracgrouplist">
							<ul id="contactgrouplistUL" class="chat03_content_ul"></ul>
						</div>
					</div>
				</div>
				<div class="accordion-group">
					<div class="accordion-heading">
						<a id="accordion3" class="accordion-toggle collapsed"
							data-toggle="collapse" data-parent="#accordionDiv"
							href="#collapseThree">陌生人</a>
					</div>
					<div id="collapseThree" class="accordion-body collapse">
						<div class="accordion-inner" id="momogrouplist">
							<ul id="momogrouplistUL" class="chat03_content_ul"></ul>
						</div>
					</div>
				</div>
			</div>

		</div>
	</div>
	<div id="rightTop" style="height: 78px;"></div>
	<!-- 聊天页面 -->
	<div class="chatRight">
		<div id="chat01">
			<div class="chat01_title">
				<ul class="talkTo">
					<li id="talkTo"><a href="javascript:void(0)"></a></li>
					<li id="recycle" style="float: right;"><img
						src="img/recycle.png" onclick="clearCurrentChat();"
						style="margin-right: 15px; cursor: hand; width: 18px;" title="清屏" />
					</li>
					<li id="roomInfo" style="float: right;"><img
						id="roomMemberImg"
						src="img/head/find_more_friend_addfriend_icon.png"
						onclick="showRoomMember();"
						style="margin-right: 15px; cursor: hand; width: 18px; display: none"
						title="群组成员" /></li>
				</ul>
			</div>
			<div id="null-nouser" class="chat01_content"></div>
		</div>

		<div class="chat02">
			<div class="chat02_title">
				<a class="chat02_title_btn ctb01" onclick="showEmotionDialog()"
					title="选择表情"></a> <a class="chat02_title_btn ctb03" title="选择图片"
					onclick="showSendPic()" href="javascript:void(0)"></a> <a
					class="chat02_title_btn ctb02" onclick="showSendAudio()"
					href="javascript:void(0)" title="选择语音"> <span></span>
				</a> <label id="chat02_title_t"></label>
				<div id="wl_faces_box" class="wl_faces_box">
					<div class="wl_faces_content">
						<div class="title">
							<ul>
								<li class="title_name">常用表情</li>
								<li class="wl_faces_close"><span
									onclick='turnoffFaces_box()'>&nbsp;</span></li>
							</ul>
						</div>
						<div id="wl_faces_main" class="wl_faces_main">
							<ul id="emotionUL"></ul>
						</div>
					</div>
					<div class="wlf_icon"></div>
				</div>
			</div>
			<div id="input_content" class="chat02_content">
				<textarea id="talkInputId" style="resize: none;"></textarea>
			</div>
			<div class="chat02_bar">
				<ul>
					<li style="right: 5px; top: 5px;"><img src="img/send_btn.jpg"
						onclick="sendText()" /></li>
				</ul>
			</div>

			<div style="clear: both;"></div>
		</div>
		<div id="fileModal" class="modal hide fade" role="dialog"
			aria-hidden="true" data-backdrop="static">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal"
					aria-hidden="true">&times;</button>
				<h3>文件选择框</h3>
			</div>
			<div class="modal-body">
				<input type='file' id="fileInput" /> <input type='hidden'
					id="sendfiletype" />
				<div id="send-file-warning"></div>
			</div>
			<div class="modal-footer">
				<button id="fileSend" class="btn btn-primary" onclick="sendFile()">发送</button>
				<button id="cancelfileSend" class="btn" data-dismiss="modal">取消</button>
			</div>
		</div>
	</div>

	<div id="addFridentModal" class="modal  fade" role="dialog"
		aria-hidden="true" data-backdrop="static">
		<div class="modal-dialog">
			<div class="modal-content modal_content_width">
				<div class="modal-header modal_header">
					<button type="button" class="close modal_header_close"
						data-dismiss="modal" aria-hidden="true">&times;</button>
					<h3 class="modal_header_h">添加好友</h3>
				</div>
				<div class="modal-body modal_body">
					<input class="modal_input" id="addfridentId"
						onfocus='clearInputValue("addfridentId")' />
					<div id="add-frident-warning"></div>
				</div>
				<div class="modal-footer modal_footer">
					<button id="addFridend" class="btn btn-primary"
						onclick="startAddFriend()">添加</button>
					<button id="cancelAddFridend" class="btn" data-dismiss="modal">取消</button>
				</div>
			</div>
		</div>
	</div>

	<div id="delFridentModal" class="modal  fade" role="dialog"
		aria-hidden="true" data-backdrop="static">
		<div class="modal-dialog">
			<div class="modal-content modal_content_width">
				<div class="modal-header modal_header">
					<button type="button" class="close modal_header_close"
						data-dismiss="modal" aria-hidden="true">&times;</button>
					<h3 class="modal_header_h">删除好友</h3>
				</div>
				<div class="modal-body modal_body">
					<input class="modal_input" id="delfridentId"
						onfocus='clearInputValue("delfridentId")' />
					<div id="del-frident-warning"></div>
				</div>
				<div class="modal-footer modal_footer">
					<button id="delFridend" class="btn btn-primary"
						onclick="directDelFriend()">删除</button>
					<button id="canceldelFridend" class="btn" data-dismiss="modal">取消</button>
				</div>
			</div>
		</div>
	</div>



	<div id="addContactGroupModal" class="modal  fade" role="dialog"
		aria-hidden="true" data-backdrop="static">
		<div class="modal-dialog">
			<div class="modal-content modal_content_width">
				<div class="modal-header modal_header">
					<button type="button" class="close modal_header_close"
						data-dismiss="modal" aria-hidden="true">&times;</button>
					<h3 class="modal_header_h">添加分组</h3>
				</div>
				<div class="modal-body modal_body">
					<input class="modal_input" id="addContactGroupId"
						onfocus='clearInputValue("addContactGroupId")' />
					<div id="add-contactgroup-warning"></div>
				</div>
				<div class="modal-footer modal_footer">
					<button id="addFridend" class="btn btn-primary"
						onclick="startAddContactGroup()">添加</button>
					<button id="startAddContactGroup" class="btn" data-dismiss="modal">取消</button>
				</div>
			</div>
		</div>
	</div>
	<!-- add by guoxun -->
	<div id="addGroupModal" class="modal  fade" role="dialog"
		aria-hidden="true" data-backdrop="static">
		<div class="modal-dialog">
			<div class="modal-content modal_content_width">
				<div class="modal-header modal_header">
					<button type="button" class="close modal_header_close"
						data-dismiss="modal" aria-hidden="true">&times;</button>
					<h3 class="modal_header_h">加入群组</h3>
				</div>
				<div class="modal-body modal_body">
					<input class="modal_input" id="searchGroupId"
						onfocus='clearInputValue("searchGroupId")' />
					<div id="search-group-warning"></div>
					<button id="searchdGroup" class="btn btn-primary"
						onclick="startSearchGroup()">搜索</button>
						
					<ui id="searchresult"></ui>	
				</div>
			
				
				<div class="modal-body modal_body">
					<input class="modal_input" id="addGroupId"
						onfocus='clearInputValue("addGroupId")' />
					<div id="add-group-warning"></div>
				</div>
				<div class="modal-footer modal_footer">
					<button id="addGroup" class="btn btn-primary"
						onclick="startAddGroup()">加入群组</button>
					<button id="cancelAddGroup" class="btn" data-dismiss="modal">取消</button>
				</div>
			</div>
		</div>
	</div>

	<div id="delGroupModal" class="modal  fade" role="dialog"
		aria-hidden="true" data-backdrop="static">
		<div class="modal-dialog">
			<div class="modal-content modal_content_width">

				<div class="modal-header modal_header">
					<button type="button" class="close modal_header_close"
						data-dismiss="modal" aria-hidden="true">&times;</button>
					<h3>退出群组</h3>
				</div>
				<div class="modal-body modal_body">
					<input class="modal_input" id="delGroupId" onfocus='clearInputValue("delGroupId")' />
					<div id="del-group-warning"></div>
				</div>
				<div class="modal-footer modal_footer">
					<button id="delGroup" class="btn btn-primary"
						onclick="startDelGroup()">退出群组</button>
					<button id="cancelDelGroup" class="btn" data-dismiss="modal">取消</button>
				</div>
			</div>
		</div>
	</div>

	<div id="destroyGroupModal" class="modal fade" role="dialog"
		aria-hidden="true" data-backdrop="static">
			<div class="modal-dialog">
			<div class="modal-content modal_content_width">
		<div class="modal-header modal_header">
			<button type="button" class="close modal_header_close" data-dismiss="modal"
				aria-hidden="true">&times;</button>
			<h3>解散群组</h3>
		</div>
		<div class="modal-body modal_body">
			<input class="modal_input" id="destroyGroupId"
				onfocus='clearInputValue("destroyGroupId")' />
			<div id="destroy-group-warning"></div>
		</div>
		<div class="modal-footer modal_footer">
			<button id="destroyGroup" class="btn btn-primary"
				onclick="startDestroyGroup()">解散群组</button>
			<button id="cancelDestroyGroup" class="btn" data-dismiss="modal">取消</button>
		</div>
	</div>
	</div>
	</div>



	<div id="createGroupModal" class="modal fade" role="dialog"
		aria-hidden="true" data-backdrop="static">
			<div class="modal-dialog">
			<div class="modal-content modal_content_width">
		<div class="modal-header modal_header">
			<button type="button" class="close modal_header_close" data-dismiss="modal"
				aria-hidden="true">&times;</button>
			<h3>创建群组</h3>
		</div>
		<div class="modal-body modal_body">
			<div>
				群组账号&nbsp;<input class="modal_input creategroup_input_margin" id="createGroupId"
					onfocus='clearInputValue("createGroupId")' />
			</div>
			<div>
				群组描述&nbsp;<input class="modal_input creategroup_input_margin" id="createGroupDesc"
					onfocus='clearInputValue("createGroupDesc")' />
			</div>
			<div>
				群组最大成员数&nbsp;<input class="modal_input creategroup_input_margin" id="createGroupMax"
					onfocus='clearInputValue("createGroupMax")' />
			</div>
	<!-- 	<div id="createGroupApproval">
				是否公开&nbsp; <input  type="radio" name="approval" value="true" /> 公开 <input
					type="radio" name="approval" value="false" /> 不公开
			</div>
			<div id="createGroupPub">
				加群是否验证&nbsp; <input type="radio" name="pub" value="true" /> 验证 <input
					type="radio" name="pub" value="false" /> 不验证
			</div> -->	
			<div id="create-group-warning"></div>
		</div>
		<div class="modal-footer modal_footer">
			<button id="createGroup" class="btn btn-primary"
				onclick="startCreateGroup()">创建群组</button>
			<button id="cancelCreateGroup" class="btn" data-dismiss="modal">取消</button>
		</div>
	</div>
	</div>
	</div>

	<!-- 一般消息通知 -->
	<div id="notice-block-div" class="modal hide">
		<button type="button" class="close" data-dismiss="alert">&times;</button>
		<div class="modal-body">
			<h4>Warning!</h4>
			<div id="notice-block-body"></div>
		</div>
	</div>

	<!-- 确认消息通知 -->
	<div id="confirm-block-div-modal" class="modal fade" role="dialog"
		aria-hidden="true" data-backdrop="static">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<h3>订阅通知</h3>
				</div>
				<div class="modal-body">
					<div id="confirm-block-footer-body"></div>
				</div>
				<div class="modal-footer">
					<button id="confirm-block-footer-confirmButton"
						class="btn btn-primary">同意</button>
					<button id="confirm-block-footer-cancelButton" class="btn"
						data-dismiss="modal">拒绝</button>
				</div>
			</div>
		</div>
	</div>

	<!-- 群组成员操作界面 -->
	<div id="option-room-div-modal" class="alert modal fade" role="dialog"
		aria-hidden="true" data-backdrop="static">
		<button type="button" class="close" data-dismiss="modal"
			aria-hidden="true">&times;</button>
		<div class="modal-header">
			<h3>群组成员</h3>
		</div>
		<div class="modal-body">
			<div id="room-member-list" style="height: 100px; overflow-y: auto"></div>
		</div>
	</div>
</div>