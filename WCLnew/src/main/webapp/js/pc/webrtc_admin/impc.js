	var LocalStore ;
	var indexstore;
window.onload = function() {
	 LocalStore = get_store();
	 indexstore = new LocalStore();
};

	var MsgListPrefix="MsgList";
	var Ease_Password = "123456";
	var RecordPrefix = "Record";
	var MessagePrefix = "Msg";
	var GroupPrefix = "Group+";
	var InfoPrefix = "Info";
	var CallVideoPrefix = "Video";
	var CallAudioPrefix = "Audio";
	var MeetingPrefix = "Meeting";
	var VideoSharePrefix = "VideoShare";
	var WebPhonePrefix = "WebPhone";
	var VideoMeetingPrefix = "VideoMeeting";
	var AudioMeetingPrefix = "AudioMeeting";
	var FriendListPrefix ="FriendList";
	var HistoryPrefix = "History";
	
	//add by yck
	//左侧选项卡标志
	var HomePrefix = "home";
	var UnderCheckPrefix = "UnderCheck";
	var EnContactsPrefix = "EnContacts";
	var EnterUserPrefix ="EnterUser";
	var ArtiUserPrefix ="ArtiUser";	
	var ArtiDeployPrefix ="ArtiDeploy";	
	
	var apiURL = null;
	var curUserId = null;
	var curChatUserId = null;
	var conn = null;
	var curRoomId = null;
	var msgCardDivId = "chat01";
	var talkToDivId = "talkTo";
	var talkInputId = "talkInputId";
	var fileInputId = "fileInput";
	var bothRoster = [];
	var toRoster = [];
	var maxWidth = 200;
	var groupFlagMark = "group";
	var groupQuering = false;
	var textSending = false;
	var appkey = "buptwebrtc#webrtc";
	var time = 0;
	
	var test;
	// add by guoxun
	var roomList = [];

	var WEBIM_URL = com.urls[0];
	
	window.URL = window.URL || window.webkitURL || window.mozURL|| window.msURL;
	var getLoginInfo = function() {
		return {
			isLogin : false
		};
	};
	var showLoginUI = function() {
		$('#loginmodal').modal('show');
		$('#username').focus();
	};
	var hiddenLoginUI = function() {
		$('#loginmodal').modal('hide');
	};
	var showWaitLoginedUI = function() {
		//目前空实现，后续需要显示等待的gif
	};
	var hiddenWaitLoginedUI = function() {
		//目前空实现，后续需要隐藏等待的gif
	};
	var showChatUI = function() {
		$('#content').css({
			"display" : "block"
		});
		var login_userEle = document.getElementById("login_user").children[0];
		login_userEle.innerHTML = curUserId;
		login_userEle.setAttribute("title", curUserId);
	};
	// 登录之前不显示web对话框
	var hiddenChatUI = function() {
		$('#content').css({
			"display" : "none"
		});
		document.getElementById(talkInputId).value = "";
	};
	// 定义消息编辑文本域的快捷键，enter和ctrl+enter为发送，alt+enter为换行
	// 控制提交频率
	$(function() {
//		$("textarea").keydown(function(event) {
//			if (event.altKey && event.keyCode == 13) {
//				e = $(this).val();
//				$(this).val(e + '\n');
//			} else if (event.ctrlKey && event.keyCode == 13) {
//				// e = $(this).val();
//				// $(this).val(e + '<br>');
//				event.returnValue = false;
//				sendText();
//				return false;
//			} else if (event.keyCode == 13) {
//				event.returnValue = false;
//				sendText();
//				return false;
//			}
//
//		});
	});
	// easemobwebim-sdk注册回调函数列表
	var connectToEase = function(){

		conn = new Easemob.im.Connection();
		console.log("start to connectToEase");
		// 初始化连接
		conn.init({
			https : false,
			// 当连接成功时的回调方法
			onOpened : function() {
				handleOpen(conn);
			},
			// 当连接关闭时的回调方法
			onClosed : function() {
				handleClosed();
			},
			// 收到文本消息时的回调方法
			onTextMessage : function(message) {
				console.log(message);
				handleTextMessage(message);
			},
			// 收到表情消息时的回调方法
			onEmotionMessage : function(message) {
				console.log(message);
				handleEmotion(message);
			},
			// 收到图片消息时的回调方法
			onPictureMessage : function(message) {
				console.log(message);
				handlePictureMessage(message);
			},
			// 收到音频消息的回调方法
			onAudioMessage : function(message) {
				console.log(message);
				handleAudioMessage(message);
			},
			// 收到位置消息的回调方法
			onLocationMessage : function(message) {
				console.log(message);
				handleLocationMessage(message);
			},
			// 收到文件消息的回调方法
			onFileMessage : function(message) {
				console.log(message);
				handleFileMessage(message);
			},
			// 收到视频消息的回调方法
			onVideoMessage : function(message) {
				console.log(message);
				handleVideoMessage(message);
			},
			// 收到联系人订阅请求的回调方法
			onPresence : function(message) {
				console.log(message);
				handlePresence(message);
			},
			// 收到联系人信息的回调方法
			onRoster : function(message) {
				console.log(message);
				handleRoster(message);
			},
			// 收到群组邀请时的回调方法
			onInviteMessage : function(message) {
				console.log(message);
				handleInviteMessage(message);
			},
			// 异常时的回调方法
			onError : function(message) {
				console.log(message);
				handleError(message);
			}
		});
		var loginInfo = getLoginInfo();
		if (loginInfo.isLogin) {
			showWaitLoginedUI();
		} else {
			//showLoginUI();
			console.log("start to loginToEase");
			login();
			console.log("end to loginToEase");
			
		}
		// 发送文件的模态窗口
		$('#fileModal').on('hidden.bs.modal', function(e) {
			var ele = document.getElementById(fileInputId);
			ele.value = "";
			if (!window.addEventListener) {
				ele.outerHTML = ele.outerHTML;
			}
			document.getElementById("fileSend").disabled = false;
			document.getElementById("cancelfileSend").disabled = false;
		});

		$('#addFridentModal').on('hidden.bs.modal', function(e) {
			var ele = document.getElementById("addfridentId");
			ele.value = "";
			if (!window.addEventListener) {
				ele.outerHTML = ele.outerHTML;
			}
			document.getElementById("addFridend").disabled = false;
			document.getElementById("cancelAddFridend").disabled = false;
		});

		$('#delFridentModal').on('hidden.bs.modal', function(e) {
			var ele = document.getElementById("delfridentId");
			ele.value = "";
			if (!window.addEventListener) {
				ele.outerHTML = ele.outerHTML;
			}
			document.getElementById("delFridend").disabled = false;
			document.getElementById("canceldelFridend").disabled = false;
		});

		$('#confirm-block-div-modal').on('hidden.bs.modal', function(e) {

		});
		
		$('#option-room-div-modal').on('hidden.bs.modal', function(e) {

		});
		
		$('#notice-block-div').on('hidden.bs.modal', function(e) {

		});

		$('#regist-div-modall').on('hidden.bs.modal', function(e) {

		});

		// 在 密码输入框时的回车登录
		$('#password').keypress(function(e) {
			var key = e.which;
			if (key == 13) {
				login();
			}
		});

		$(function() {
			$(window).bind('beforeunload', function() {
				if (conn) {
					conn.close();
					if (navigator.userAgent.indexOf("Firefox") > 0)
						return ' ';
					else
						return '';
				}
			});
		});
	};

	
	
	// 处理连接时函数,主要是登录成功后对页面元素做处理
	var handleOpen = function(conn) {
		// 从连接中获取到当前的登录人注册帐号名
		console.log("in handleOpen");
		curUserId = conn.context.userId;

		console.log("curUserId="+curUserId);
		
		//创建”我“界面
		//createMeHome(curUserId);

		
		// 获取当前登录人的联系人列表
		conn.getRoster({
			success : function(roster) {
				// 页面处理
				hiddenWaitLoginedUI();
				//showChatUI();
				var curroster;
				for ( var i in roster) {
					var ros = roster[i];
					console.log(ros);
					// both为双方互为好友，要显示的联系人,from我是对方的单向好友
					if (ros.subscription == 'both'
							|| ros.subscription == 'from') {
						bothRoster.push(ros);
					} else if (ros.subscription == 'to') {
						// to表明了联系人是我的单向好友
						toRoster.push(ros);
					}
				}
				if (bothRoster.length > 0) {
					//联系人列表处理拉取过来的好友,
					buildContactDiv("list_friend",bothRoster);
//					curroster = bothRoster[0];
//					buildContactDiv("contractlist", bothRoster);// 联系人列表页面处理
//					if (curroster)
//						setCurrentContact(curroster.name);// 页面处理将第一个联系人作为当前聊天div
				}
				else{
					buildNullContactDiv("list_friend");
				}
				
				// 获取当前登录人的群组列表
				conn.listRooms({
					success : function(rooms) {
						conn.setPresence();// 设置用户上线状态，必须调用
					}
				});
			}
		});
	};
	
	// 连接中断时的处理，主要是对页面进行处理
	var handleClosed = function() {
		curUserId = null;
		curChatUserId = null;
		bothRoster = [];
		toRoster = [];
		hiddenChatUI();
		clearContactUI("contactlistUL", msgCardDivId);
		
		showLoginUI();
		textSending = false;
	};
	// easemobwebim-sdk中收到联系人订阅请求的处理方法，具体的type值所对应的值请参考xmpp协议规范
	var handlePresence = function(e) {

		// （发送者希望订阅接收者的出席信息），即别人申请加你为好友
		if (e.type == 'subscribe') {
			if (e.status) {
				if (e.status.indexOf('resp:true') > -1) {
					agreeAddFriend(e.from);
					return;
				}
			}
			var normal_efrom =formatReEase(e.from);
			var subscribeMessage = normal_efrom + "请求加你为好友。\n验证消息：" + e.status;
			showNewNotice(subscribeMessage);
			$('#confirm-block-footer-confirmButton').click(function() {
				// 同意好友请求
				agreeAddFriend(e.from);// e.from用户名
				// 反向添加对方好友
				conn.subscribe({
					to : e.from,
					message : "[resp:true]"
				});
				$('#confirm-block-div-modal').modal('hide');
			});
			$('#confirm-block-footer-cancelButton').click(function() {
				rejectAddFriend(e.from);// 拒绝加为好友
				$('#confirm-block-div-modal').modal('hide');
			});
			return;
		}
		// (发送者允许接收者接收他们的出席信息)，即别人同意你加他为好友
		if (e.type == 'subscribed') {
			toRoster.push({
				name : e.from,
				jid : e.fromJid,
				subscription : "to"
			});
			return;
		}
		// （发送者取消订阅另一个实体的出席信息）,即删除现有好友
		if (e.type == 'unsubscribe') {
			// 单向删除自己的好友信息，具体使用时请结合具体业务进行处理
			delFriend(e.from);
			// add by guoxun
			
			
			return;
		}
		// （订阅者的请求被拒绝或以前的订阅被取消），即对方单向的删除了好友
		if (e.type == 'unsubscribed') {
			delFriend(e.from);
			return;
		}

	};
	// easemobwebim-sdk中处理出席状态操作
	var handleRoster = function(rosterMsg) {
		for (var i = 0; i < rosterMsg.length; i++) {
			var contact = rosterMsg[i];
			if (contact.ask && contact.ask == 'subscribe') {
				continue;
			}
			if (contact.subscription == 'to') {
				toRoster.push({
					name : contact.name,
					jid : contact.jid,
					subscription : "to"
				});
			}
			// app端删除好友后web端要同时判断状态from做删除对方的操作
			if (contact.subscription == 'from') {
				toRoster.push({
					name : contact.name,
					jid : contact.jid,
					subscription : "from"
				});
			}
			if (contact.subscription == 'both') {
				var isexist = contains(bothRoster, contact);
				if (!isexist) {
					if($("#friend_list_none")!=null){$("#friend_list_none").remove();}
					console.log("handleRoster:contact.name="+contact.name);
					var contact_normal=formatReEase(contact.name);
					var lielem = $('<li>').attr({
						'id' : FriendListPrefix+contact_normal,
						'name' :contact_normal
					}).dblclick(function() {
						//FriendModal(this);
		                chooseContactDivClick(this);
					});
					var liImg = $("<div class='list_portrait'>"+
   					    "<img src='css/pc/images/img/portrait65_2.jpg'/></div>");
					lielem.append(liImg);
					 
					var liName = $("<span class='friend_name'>"+ contact_normal +"</span>");
					
					lielem.append(liName);
					$('#list_friend_UL').append(lielem);
					
					console.log("执行handleRoster，加入一个我的好友！");
					bothRoster.push(contact);
					
			        //////////为我的每位好友添加右击菜单操作
					var RightClickMenu = $("<div id='pop_operation"+ contact_normal +"' style='display:none;' class='friend_pop_operation'></div>");
					//document.body.appendChild(RightClickMenu);
					 $(document.body).append(RightClickMenu);
					
					var MenuUL = $("<ul></ul>");
					RightClickMenu.append(MenuUL);
					var MenuList1 = $("<li onclick='chooseContactDivClickBefore(\""+ contact_normal +"\")'>发送即时消息</li>");
					MenuUL.append(MenuList1);
					var MenuList2 = $("<li>查看资料</li><li onclick='createMyChatHistory(\""+ name +"\")'>消息记录</li>");
					MenuUL.append(MenuList2);
					var MenuList3 = $("<li onclick=\"createCallVideoPageBefore\('"+ contact_normal+ "'\);\">发起视频通话</li>");
					MenuUL.append(MenuList3);
					var MenuList4 = $("<li class='li_sub'><i></i>"+
						"移动好友至 <ul class='subul'><li>运营部</li><li>技术部 </li></ul></li>");
					MenuUL.append(MenuList4);
					
					lielem.mousedown(function(e){
						if(e.which == 3){
					    //右击我的一个好友
						   console.log("右击我的好友:"+this.id);
						   var username = this.id.replace("FriendList","");
						   document.oncontextmenu = function() {
							   return false;
						   }
						var RightClick = document.getElementById("pop_operation"+username);
						//$(RightClick).hide();
//						$(this).parent().parent().parent().parent().parent().parent().children("div[class='friend_pop_operation']").hide();
						$(document.body).children("div[class='friend_pop_operation']").hide();
						
						$(RightClick).attr(
								"style",
								"display: block;  position:absolute; z-index:100; top:" + e.pageY + "px; left:"
										+ e.pageX + "px;");
						$(RightClick).show();
						$("body").click(function(e) {
							$(RightClick).hide();
						});
						
						}
						
					});
				}
			}
			if (contact.subscription == 'remove') {
				var isexist = contains(bothRoster, contact);
				console.log(isexist);
				if (isexist) {
					removeFriendDomElement(contact.name);
				}
			}
		}
		
	};
	// 异常情况下的处理方法
	var handleError = function(e) {
		if (curUserId == null) {
			//hiddenWaitLoginedUI();
			console.log(e.msg + ",请重新登录");
			//showLoginUI();
			//用户不存在，新注册一个。
			regist();
		} else {
			var msg = e.msg;
			if (e.type == EASEMOB_IM_CONNCTION_SERVER_CLOSE_ERROR) {
				if (msg == "" || msg == 'unknown' ) {
					//alert("服务器器断开连接,可能是因为在别处登录");
					
				console.log("服务器器断开连接,可能是因为在别处登录");
				var contents = "服务器器断开连接,可能是因为在别处登录";
			    $.fillTipBox({type:'info', icon:'glyphicon-info-sign', content:contents})
				} else {
					//alert("服务器器断开连接");
					console.log("服务器器断开连接");
					var contents = "服务器器断开连接";
				    $.fillTipBox({type:'info', icon:'glyphicon-info-sign', content:contents})
				}
			} else {
				//alert(msg);
				console.log(msg);
			}
		}
	};
	// 判断要操作的联系人和当前联系人列表的关系
	var contains = function(roster, contact) {
		var i = roster.length;
		while (i--) {
			if (roster[i].name === contact.name) {
				return true;
			}
		}
		return false;
	};

	Array.prototype.indexOf = function(val) {
		for (var i = 0; i < this.length; i++) {
			if (this[i].name == val.name)
				return i;
		}
		return -1;
	};
	Array.prototype.remove = function(val) {
		var index = this.indexOf(val);
		if (index > -1) {
			this.splice(index, 1);
		}
	};

	// 登录系统时的操作方法
	var login = function() {
		console.log("come into login function");
		var user = formatToEase($('.pub_banner').attr("user"));
		
		var pass = Ease_Password;
		console.log("user="+user);
		console.log("pass="+pass);
		if (user == '' || pass == '') {
			alert("请输入用户名和密码");
			return;
		}
		//hiddenLoginUI();
		showWaitLoginedUI();
		// 根据用户名密码登录系统
		conn.open({
			apiUrl : apiURL,
			user : user,
			pwd : pass,
			// 连接时提供appkey
			appKey : appkey
		// accessToken :
		// 'YWMt8bfZfFk5EeSiAzsQ0OXu4QAAAUpoZFOMJ66ic5m2LOZRhYUsRKZWINA06HI'
		});
		return false;
	};

	// 注册新用户操作方法
	var regist = function() {
//		var user = $("#regist_username").val();
//		var pass = $("#regist_password").val();
//		var nickname = $("#regist_nickname").val();
//		if (user == '' || pass == '' || nickname == '') {
//			alert("用户名/密码/昵称 不能为空");
//			return;
//		}
		
		var user = formatToEase($('.pub_banner').attr("user"));
		var pass = Ease_Password;
		var nickname = $('.pub_banner').attr("user");
		var options = {
			username : user,
			password : pass,
			nickname : nickname,
			appKey : appkey,
			success : function(result) {
				console.log("注册成功!");
				//$('#loginmodal').modal('show');
				//$('#regist-div-modal').modal('hide');
				login();
			},
			error : function(e) {
				//alert(e.error);
				console.log(e.error);
			}
		};
		Easemob.im.Helper.registerUser(options);
	};

	// 注册页面返回登录页面操作
	var showlogin = function() {
		$('#loginmodal').modal('show');
		$('#regist-div-modal').modal('hide');
	};

	var logout = function() {
		conn.close();
	};

	// 设置当前显示的聊天窗口div，如果有联系人则默认选中联系人中的第一个联系人，如没有联系人则当前div为null-nouser
	var setCurrentContact = function(defaultUserId) {
		showContactChatDiv(defaultUserId);
		if (curChatUserId != null) {
			hiddenContactChatDiv(curChatUserId);
		} else {
			$('#null-nouser').css({
				"display" : "none"
			});
		}
		curChatUserId = defaultUserId;
	};

	// 构造联系人列表,目前只有我的好友这一个分组
	var buildContactDiv = function(contactlistDivId, roster) {
		var contactlist = $(document.getElementById(contactlistDivId));

		var cache = {};
		for (i = 0; i < roster.length; i++) {
			if (!(roster[i].subscription == 'both' || roster[i].subscription == 'from')) {
				continue;
			}
			var jid = roster[i].jid;
			var userName = jid.substring(jid.indexOf("_") + 1).split("@")[0];
			console.log("userName= "+ userName);
			var name = formatReEase(userName);
			
			
			if (userName in cache) {
				continue;
			}
			cache[userName] = true;
			
			var lielem = $('<li>').attr({
				'id' : FriendListPrefix+name,
				'name' :name
			}).dblclick(function() {
				//FriendModal(this);
                chooseContactDivClick(this);
			});
			
			var liImg = $("<div class='list_portrait'>"+
				    "<img src='css/pc/images/img/portrait65_2.jpg'/></div>");
			lielem.append(liImg);
			 
			var liName = $("<span class='friend_name'>"+ name +"</span>");
			lielem.append(liName);
			
			$('#list_friend_UL').append(lielem);
			
			//////////为我的每位好友添加右击菜单操作
			var RightClickMenu = $("<div id='pop_operation"+ name +"' style='display:none;' class='friend_pop_operation'></div>");
			//document.body.appendChild(RightClickMenu);
			 $(document.body).append(RightClickMenu);
			
			var MenuUL = $("<ul></ul>");
			RightClickMenu.append(MenuUL);
			var MenuList1 = $("<li onclick='chooseContactDivClickBefore(\""+ name +"\")'>发送即时消息</li>");
			MenuUL.append(MenuList1);
			var MenuList2 = $("<li>查看资料</li><li onclick='createMyChatHistory(\""+ name +"\")' >消息记录</li>");
			MenuUL.append(MenuList2);
			var MenuList3 = $("<li onclick=\"createCallVideoPageBefore\('"+ name+ "'\);\">发起视频通话</li>");
			MenuUL.append(MenuList3);
			var MenuList4 = $("<li class='li_sub'><i></i>"+
				"移动好友至 <ul class='subul'><li>运营部</li><li>技术部 </li></ul></li>");
			MenuUL.append(MenuList4);
			
			lielem.mousedown(function(e){
				if(e.which == 3){
			    //右击我的一个好友
				   console.log("右击我的好友:"+this.id);
				   var username = this.id.replace("FriendList","");
				   document.oncontextmenu = function() {
					   return false;
				   }
				var RightClick = document.getElementById("pop_operation"+username);
	
				$(document.body).children("div[class='friend_pop_operation']").hide();
				
				$(RightClick).attr(
						"style",
						"display: block;  position:absolute; z-index:100; top:" + e.pageY + "px; left:"
								+ e.pageX + "px;");
				$(RightClick).show();
				$("body").click(function(e) {
					$(RightClick).hide();
				});
				
				}
				
			});
		}
	};
	
	var buildNullContactDiv = function(contactlistDivId){
		var contactlist = $(document.getElementById(contactlistDivId));
		
		/**** right friend_list Null ****/
		var friend_list_none = $("<div id=\"friend_list_none\" class=\"friend_list_none\"></div>");
		var li_img = $("<div class=\"li_img\"><img src=\"images/rtc_right_none1.png\" width=\"60\" height=\"60\" /></div>");
		var li_p = $("<p>您还没有好友</p><a onclick=\"showAddFriend()\" href=\"javascript:void(0)\" class=\"btn_blue\">添加好友</a>");
		$(friend_list_none).append(li_img);
		$(friend_list_none).append(li_p);
		/**** right friend_list Null end ****/

		$(contactlist).append(friend_list_none);
	}


	var clearContactUI = function(contactlistUL,contactChatDiv) {
		// 清除左侧联系人内容
		$('#contactlistUL').empty();

		// 处理联系人分组的未读消息处理
		var accordionChild = $('#accordionDiv').children();
		for (var i = 1; i <= accordionChild.length; i++) {
			var badgegroup = $('#accordion' + i).find(".badgegroup");
			if (badgegroup && badgegroup.length > 0) {
				$('#accordion' + i).children().remove();
			}
		};

		// 清除右侧对话框内容
		document.getElementById(talkToDivId).children[0].innerHTML = "";
		var chatRootDiv = document.getElementById(contactChatDiv);
		var children = chatRootDiv.children;
		for (var i = children.length - 1; i > 1; i--) {
			chatRootDiv.removeChild(children[i]);
		}
		$('#null-nouser').css({
			"display" : "block"
		});
	};

	var emotionFlag = false;
	var showEmotionDialog = function() {
		if (emotionFlag) {
			$('#wl_faces_box').css({
				"display" : "block"
			});
			return;
		}
		emotionFlag = true;
		// Easemob.im.Helper.EmotionPicData设置表情的json数组
		var sjson = Easemob.im.Helper.EmotionPicData;
		for ( var key in sjson) {
			var emotions = $('<img>').attr({
				"id" : key,
				"src" : sjson[key],
				"style" : "cursor:pointer;"
			}).click(function() {
				selectEmotionImg(this);
			});
			$('<li>').append(emotions).appendTo($('#emotionUL'));
		}
		$('#wl_faces_box').css({
			"display" : "block"
		});
	};
	// 表情选择div的关闭方法
	var turnoffFaces_box = function() {
		$("#wl_faces_box").fadeOut("slow");
	};
	var selectEmotionImg = function(selImg) {
		var txt = document.getElementById(talkInputId);
		txt.value = txt.value + selImg.id;
		txt.focus();
	};
	var showSendPic = function() {
		$('#fileModal').modal('toggle');
		$('#sendfiletype').val('pic');
		$('#send-file-warning').html("");
	};
	var showSendAudio = function() {
		$('#fileModal').modal('toggle');
		$('#sendfiletype').val('audio');
		$('#send-file-warning').html("");
	};

	var sendText = function(remoteName) {
		console.log(textSending);
		if (textSending) {
			return;
		}
		textSending = true;
		//var $contactPage = $(document.getElementById(MessagePrefix+remoteName));
		
		//var $msgInput = $contactPage.find("#msginput");
		var $msgInput=$(document.getElementById(remoteName+"message"));
		var msg = $msgInput.val();
		//console.log("msg="+msg);

		if (msg == null || msg.length == 0) {
			textSending = false;
			return;
		}
		var to = formatToEase(remoteName);
		//var to = remoteName;
		//console.log("to_name="+to);
		
		if (to == null) {
			return;
		}
		var options = {
			to : to,
			msg : msg,
			type : "chat"
		};
		console.log("非空");
		
		//console.log("options.to="+options.to);
		// easemobwebim-sdk发送文本消息的方法 to为发送给谁，meg为文本消息对象
		conn.sendTextMessage(options);

		// 当前登录人发送的信息在聊天窗口中原样显示
		var msgtext = msg.replace(/\n/g, '<br>');
		
		appendMsg2(curUserId, to, msgtext);
		//console.log("in appendMsg2,curUserId="+curUserId+",to="+to+",msgtext="+msgtext);
		//turnoffFaces_box();
		//console.log("clear input");
		$msgInput.val("");
		$msgInput.focus();

		setTimeout(function() {
			textSending = false;
		}, 1000);
	};

	var pictype = {
		"jpg" : true,
		"gif" : true,
		"png" : true,
		"bmp" : true
	};
	var sendFile = function() {
		var type = $("#sendfiletype").val();
		if (type == 'pic') {
			sendPic();
		} else {
			sendAudio();
		}
	};
	// 发送图片消息时调用方法
	var sendPic = function() {
		var to = curChatUserId;
		if (to == null) {
			return;
		}
		// Easemob.im.Helper.getFileUrl为easemobwebim-sdk获取发送文件对象的方法，fileInputId为
		// input 标签的id值
		var fileObj = Easemob.im.Helper.getFileUrl(fileInputId);
		if (fileObj.url == null || fileObj.url == '') {
			$('#send-file-warning')
					.html("<font color='#FF0000'>请选择发送图片</font>");
			return;
		}
		var filetype = fileObj.filetype;
		var filename = fileObj.filename;
		if (filetype in pictype) {
			document.getElementById("fileSend").disabled = true;
			document.getElementById("cancelfileSend").disabled = true;
			var opt = {
				type : 'chat',
				fileInputId : fileInputId,
				to : to,
				onFileUploadError : function(error) {
					$('#fileModal').modal('hide');
					var messageContent = error.msg + ",发送图片文件失败:" + filename;
					appendMsg(curUserId, to, messageContent);
				},
				onFileUploadComplete : function(data) {
					$('#fileModal').modal('hide');
					var file = document.getElementById(fileInputId);
					if (file && file.files) {
						var objUrl = getObjectURL(file.files[0]);
						if (objUrl) {
							var img = document.createElement("img");
							img.src = objUrl;
							img.width = maxWidth;
						}
					}
					appendMsg(curUserId, to, {
						data : [ {
							type : 'pic',
							filename : filename,
							data : img
						} ]
					});
				}
			};

			opt.apiUrl = apiURL;
			conn.sendPicture(opt);
			return;
		}
		$('#send-file-warning').html(
				"<font color='#FF0000'>不支持此图片类型" + filetype + "</font>");
	};
	var audtype = {
		"mp3" : true,
		"wma" : true,
		"wav" : true,
		"amr" : true,
		"avi" : true
	};
	// 发送音频消息时调用的方法
	var sendAudio = function() {
		var to = curChatUserId;
		if (to == null) {
			return;
		}
		// 利用easemobwebim-sdk提供的方法来构造一个file对象
		var fileObj = Easemob.im.Helper.getFileUrl(fileInputId);
		if (fileObj.url == null || fileObj.url == '') {
			$('#send-file-warning')
					.html("<font color='#FF0000'>请选择发送音频</font>");
			return;
		}
		var filetype = fileObj.filetype;
		var filename = fileObj.filename;
		if (filetype in audtype) {
			document.getElementById("fileSend").disabled = true;
			document.getElementById("cancelfileSend").disabled = true;
			var opt = {
				type : "chat",
				fileInputId : fileInputId,
				to : to,// 发给谁
				onFileUploadError : function(error) {
					$('#fileModal').modal('hide');
					var messageContent = error.msg + ",发送音频失败:" + filename;
					appendMsg(curUserId, to, messageContent);
				},
				onFileUploadComplete : function(data) {
					var messageContent = "发送音频" + filename;
					$('#fileModal').modal('hide');
					appendMsg(curUserId, to, messageContent);
				}
			};

			opt.apiUrl = apiURL;
			conn.sendAudio(opt);
			return;
		}
		$('#send-file-warning').html(
				"<font color='#FF0000'>不支持此音频类型" + filetype + "</font>");
	};
	// easemobwebim-sdk收到文本消息的回调方法的实现
	var handleTextMessage = function(message) {

		var from = message.from;// 消息的发送者
		var mestype = message.type;// 消息发送的类型是群组消息 or 个人消息 or 企业用户 or 访问用户 
		var messageContent = message.data;// 文本消息体

		appendMsg(from, from, messageContent);

	};
	// easemobwebim-sdk收到表情消息的回调方法的实现，message为表情符号和文本的消息对象，文本和表情符号sdk中做了
	// 统一的处理，不需要用户自己区别字符是文本还是表情符号。
	var handleEmotion = function(message) {
		var from = message.from;
		appendMsg(from, from, message);
	};
	// easemobwebim-sdk收到图片消息的回调方法的实现
	var handlePictureMessage = function(message) {
		var filename = message.filename;// 文件名称，带文件扩展名
		var from = message.from;// 文件的发送者
		var contactDivId = from;

		var options = message;
		// 图片消息下载成功后的处理逻辑
		options.onFileDownloadComplete = function(response, xhr) {
			var objectURL = window.URL.createObjectURL(response);
			img = document.createElement("img");
			img.onload = function(e) {
				img.onload = null;
				window.URL.revokeObjectURL(img.src);
			};
			img.onerror = function() {
				img.onerror = null;
				if (typeof FileReader == 'undefined') {
					img.alter = "当前浏览器不支持blob方式";
					return;
				}
				img.onerror = function() {
					img.alter = "当前浏览器不支持blob方式";
				};
				var reader = new FileReader();
				reader.onload = function(event) {
					img.src = this.result;
				};
				reader.readAsDataURL(response);
			}
			img.src = objectURL;
			var pic_real_width = options.width;

			if (pic_real_width == 0) {
				$("<img/>").attr("src", objectURL).load(function() {
					pic_real_width = this.width;
					if (pic_real_width > maxWidth) {
						img.width = maxWidth;
					} else {
						img.width = pic_real_width;
					}
					appendMsg(from, contactDivId, {
						data : [ {
							type : 'pic',
							filename : filename,
							data : img
						} ]
					});

				});
			} else {
				if (pic_real_width > maxWidth) {
					img.width = maxWidth;
				} else {
					img.width = pic_real_width;
				}
				appendMsg(from, contactDivId, {
					data : [ {
						type : 'pic',
						filename : filename,
						data : img
					} ]
				});
			}
		};
        
        var redownLoadFileNum = 0;
		options.onFileDownloadError = function(e) {
            // 下载失败时只重新下载一次
            if(redownLoadFileNum < 1){
               redownLoadFileNum++;
                options.accessToken = options_c;
               Easemob.im.Helper.download(options);
               
            }else{
              appendMsg(from, contactDivId, e.msg + ",下载图片" + filename + "失败");
              redownLoadFileNum = 0;
            }
           
		};
		// easemobwebim-sdk包装的下载文件对象的统一处理方法。
		Easemob.im.Helper.download(options);
	};

	// easemobwebim-sdk收到音频消息回调方法的实现
	var handleAudioMessage = function(message) {
		var filename = message.filename;
		var filetype = message.filetype;
		var from = message.from;
		var contactDivId = from;

		var options = message;
		options.onFileDownloadComplete = function(response, xhr) {
			var objectURL = window.URL.createObjectURL(response);
			var audio = document.createElement("audio");
			if (("src" in audio) && ("controls" in audio)) {
				audio.onload = function() {
					audio.onload = null;
					window.URL.revokeObjectURL(audio.src);
				};
				audio.onerror = function() {
					audio.onerror = null;
					appendMsg(from, contactDivId, "当前浏览器不支持播放此音频:" + filename);
				};
				audio.controls = "controls";
				audio.src = objectURL;
				appendMsg(from, contactDivId, {
					data : [ {
						type : 'audio',
						filename : filename,
						data : audio
					} ]
				});
				// audio.play();
				return;
			}
		};
		options.onFileDownloadError = function(e) {
			appendMsg(from, contactDivId, e.msg + ",下载音频" + filename + "失败");
		};
		options.headers = {
			"Accept" : "audio/mp3"
		};
		Easemob.im.Helper.download(options);
	};

	// 处理收到文件消息
	var handleFileMessage = function(message) {
		var filename = message.filename;
		var filetype = message.filetype;
		var from = message.from;
		var contactDivId = from;

		var options = message;
		options.onFileDownloadComplete = function(response, xhr) {
			var spans = "收到文件消息:" + filename + '   ';
			var content = spans + "【<a href='"
					+ window.URL.createObjectURL(response) + "' download='"
					+ filename + "'>另存为</a>】";
			appendMsg(from, contactDivId, content);
			return;
		};
		options.onFileDownloadError = function(e) {
			appendMsg(from, contactDivId, e.msg + ",下载文件" + filename + "失败");
		};
		Easemob.im.Helper.download(options);
	};

	// 收到视频消息
	var handleVideoMessage = function(message) {

		var filename = message.filename;
		var filetype = message.filetype;
		var from = message.from;

		var contactDivId = from;
		var options = message;
		options.onFileDownloadComplete = function(response, xhr) {
			// var spans = "收到视频消息:" + filename;
			// appendMsg(from, contactDivId, spans);
			var objectURL = window.URL.createObjectURL(response);
			var video = document.createElement("video");
			if (("src" in video) && ("controls" in video)) {
				video.onload = function() {
					video.onload = null;
					window.URL.revokeObjectURL(video.src);
				};
				video.onerror = function() {
					video.onerror = null;
					appendMsg(from, contactDivId, "当前浏览器不支持播放此音频:" + filename);
				};
				video.src = objectURL;
				video.controls = "controls";
				video.width = "320";
				video.height = "240";
				appendMsg(from, contactDivId, {
					data : [ {
						type : 'video',
						filename : filename,
						data : video
					} ]
				});
				// audio.play();
				return;
			}

		};
		options.onFileDownloadError = function(e) {
			appendMsg(from, contactDivId, e.msg + ",下载音频" + filename + "失败");
		};
		Easemob.im.Helper.download(options);
	};

	var handleLocationMessage = function(message) {
		var from = message.from;
		var to = message.to;
		var content = message.addr;
		appendMsg(from, from, content);
	};
	
	// 显示聊天记录的处理方法
	//appendMsg(from, from, messageContent);
	// Object {type: "chat", from: "webrtc5-163.com", to: "webrtc4-163.com", data: "dddddddd", ext: Object}
	//appendMsg(webrtc1-163.com,Group+134160751114846652,aa,groupchat);
	var appendMsg = function(who, Imcontact, message) {
		var chatFriendId = formatReEase(Imcontact);
		//console.log("in appendMsg,contact="+chatFriendId);
		var Message = message.replace(/\n/g, '<br>');

		//add by yck
		//1.判断与chatFriendId的聊天框是否存在
		var contentDiv = getContactChatDiv(chatFriendId);
		if (contentDiv == null) //不存在
		{
			var newContent;
			 //进一步判断chatFriendId是否在clients中的那个等待服务的用户
			if(clients.indexOf(chatFriendId) >= 0) //是
				newContent = createArtiUserChatDiv(chatFriendId);
			else //不是，即普通用户 
				newContent = createContactChatDiv(chatFriendId); 

			document.getElementById("web").appendChild(newContent); //加入
			newContent.setAttribute("style","display:none;"); //隐藏
	    	createActiveList(chatFriendId,MessagePrefix); // 但左侧活动会话列表需要生成、显示
	    	
	    	// 获取对端uid(2016-10)
	    	requestUid(chatFriendId);
		} 

		//2.判断当前打开的对话框是否正是chatFriendId的
		if(globalCur != (MessagePrefix + chatFriendId)) //并不是
		{
			//找到ActiveList中chatFriendId项，使其右侧消息数量+1
			incNumInActiveListItem(chatFriendId,MessagePrefix);

			//顶部消息数量+1
			incNumInHeadTips(MessagePrefix);
		}

		//3.显示消息气泡至chatFriendId的聊天框
		appendMsg3(curUserId, Imcontact, Message);
	};
	
	//发送方回显自己发送的消息
	var appendMsg2 = function(who, Imcontact, message) {

		var contact = formatReEase(Imcontact);
		var MsgDivId = MessagePrefix+contact;
		
		addMessageMsg(MsgDivId,who,Imcontact,message);
	}

	var appendMsg3 = function(who, Imcontact, message) {

		var contact = formatReEase(Imcontact);
		var MsgDivId = MessagePrefix+contact;
		addMessageMsg(MsgDivId,Imcontact,Imcontact,message);
	}
	var showAddFriend = function() {
		console.log("show addFriend")
		$('#addFridentModal').modal('toggle');
		$('#addfridentId').val('好友账号');// 输入好友账号
		$('#add-frident-warning').html("");
	};

	// 添加输入框鼠标焦点进入时清空输入框中的内容
	var clearInputValue = function(inputId) {
		$('#' + inputId).val('');
	};

	var showDelFriend = function() {
		$('#delFridentModal').modal('toggle');
		$('#delfridentId').val('好友账号');// 输入好友账号
		$('#del-frident-warning').html("");
	};

	// 消息通知操作时条用的方法
	var showNewNotice = function(message) {
		$('#confirm-block-div-modal').modal('toggle');
		$('#confirm-block-footer-body').html(message);
	};

	var showWarning = function(message) {
		$('#notice-block-div').modal('toggle');
		$('#notice-block-body').html(message);
	};

	// 主动添加好友操作的实现方法
	var startAddFriend = function() {
		var user = $('#addfridentId').val();
		var user = formatToEase(user);
		if (user == '') {
			$('#add-frident-warning').html(
					"<font color='#FF0000'>请输入好友名称</font>");
			return;
		}
		if (bothRoster)
			for (var i = 0; i < bothRoster.length; i++) {
				if (bothRoster[i].name == user) {
					$('#add-frident-warning').html(
							"<font color='#FF0000'>已是您的好友</font>");
					return;
				}
			}
		// 发送添加好友请求
		conn.subscribe({
			to : user,
			message : "加个好友呗-" + getLoacalTimeString()
		});
		
		$('#addFridentModal').modal('hide');
		var contents = "已成功发送申请信息给好友！";
	    $.fillTipBox({type:'info', icon:'glyphicon-info-sign', content:contents})
		return;
	};

	// 回调方法执行时同意添加好友操作的实现方法
	var agreeAddFriend = function(user) {
		conn.subscribed({
			to : user,
			message : "[resp:true]"
		});
	};
	// 拒绝添加好友的方法处理
	var rejectAddFriend = function(user) {
		conn.unsubscribed({
			to : user,
			message : getLoacalTimeString()
		});
	};

	// 直接调用删除操作时的调用方法
	var directDelFriend = function() {
		var user = $('#delfridentId').val();
		var user = formatToEase(user);
		if (validateFriend(user, bothRoster)) {
			conn.removeRoster({
				to : user,
				success : function() {
					conn.unsubscribed({
						to : user
					});
					// 删除操作成功时隐藏掉dialog
					$('#delFridentModal').modal('hide');
				},
				error : function() {
					$('#del-frident-warning').html(
							"<font color='#FF0000'>删除联系人失败!</font>");
				}
			});
		} else {
			$('#del-frident-warning').html(
					"<font color='#FF0000'>该用户不是你的好友!</font>");
		}
	};
	// 判断要删除的好友是否在当前好友列表中
	var validateFriend = function(optionuser, bothRoster) {
		for ( var deluser in bothRoster) {
			if (optionuser == bothRoster[deluser].name) {
				return true;
			}
		}
		return false;
	};

	// 回调方法执行时删除好友操作的方法处理
	var delFriend = function(user) {
		conn.removeRoster({
			to : user,
			groups : [ 'default' ],
			success : function() {
				conn.unsubscribed({
					to : user
				});
			}
		});
	};


	var removeFriendDomElement = function(userToDel) {
		var contactToDel;
		if (bothRoster.length > 0) {
			for (var i = 0; i < bothRoster.length; i++) {
				if (bothRoster[i].name == userToDel) {
					contactToDel = bothRoster[i];
					break;
				}
			}
		}
		//console.log("userToDel="+userToDel);
		//console.log("contactToDel=");
		//console.log(contactToDel)
		if (contactToDel) {
			console.log("remove contact")
			bothRoster.remove(contactToDel);
			var normal_userToDel = formatReEase(userToDel);
			console.log("normal_userToDel="+normal_userToDel);
			$(document.getElementById(FriendListPrefix+normal_userToDel)).remove();
		}
		
		var username = formatReEase(userToDel);
		
		console.log(username);
		$("div[id *= '"+username+"']").remove();
		$("li[id *= '"+username+"']").remove();
		
		globalCur=null;
		
		// 隐藏删除好友窗口
		console.log("removeFriendDomElement");
	};

	// 清除聊天记录
	var clearCurrentChat = function clearCurrentChat() {
		var currentDiv = getContactChatDiv(curChatUserId)
				|| createContactChatDiv(curChatUserId);
		currentDiv.innerHTML = "";
	};

	var showRegist = function showRegist() {
		$('#loginmodal').modal('hide');
		$('#regist-div-modal').modal('toggle');
	};

	var getObjectURL = function getObjectURL(file) {
		var url = null;
		if (window.createObjectURL != undefined) { // basic
			url = window.createObjectURL(file);
		} else if (window.URL != undefined) { // mozilla(firefox)
			url = window.URL.createObjectURL(file);
		} else if (window.webkitURL != undefined) { // webkit or chrome
			url = window.webkitURL.createObjectURL(file);
		}
		return url;
	};
	var getLoacalTimeString = function getLoacalTimeString() {
		var date = new Date();
		var time = date.getHours() + ":" + date.getMinutes() + ":"
				+ date.getSeconds();
		return time;
	}
