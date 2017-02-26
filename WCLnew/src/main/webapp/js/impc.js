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
	
	window.URL = window.URL || window.webkitURL || window.mozURL
			|| window.msURL;
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
	};//end of init

	
	
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
				console.log(roster);
				// 页面处理
				hiddenWaitLoginedUI();
				
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
				}
				else{
					buildNullContactDiv("list_friend");
				}
				// 获取当前登录人的群组列表
				conn.listRooms({
					success : function(rooms) {
						if (rooms && rooms.length > 0) {
							buildListRoomDiv("list_group", rooms);// 群组列表页面处理
						}
						else {
							buildNullListRoomDiv("list_group");
						}
						conn.setPresence();// 设置用户上线状态，必须调用
					},
					error : function(e) {

					}
				});
			}
		});
	}; //end of handleOpen

	// 连接中断时的处理，主要是对页面进行处理
	var handleClosed = function() {
		curUserId = null;
		curChatUserId = null;
		curRoomId = null;
		bothRoster = [];
		toRoster = [];
		hiddenChatUI();
		clearContactUI("contactlistUL", "contactgrouplistUL",
				"momogrouplistUL", msgCardDivId);

		showLoginUI();
		groupQuering = false;
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
			console.log("对方同意添加为我的好友");
			AddEaseFriendDB(curUserId,e.from);
			console.log("add hostname:"+curUserId +"friendname:"+e.from);
			return;
		}
		// （发送者取消订阅另一个实体的出席信息）,即删除现有好友（双方在线删除才会推送）
		if (e.type == 'unsubscribe') {
			// 单向删除自己的好友信息，具体使用时请结合具体业务进行处理
			delFriend(e.from);
			//console.log("我单向删除好友");
			//DeleteEaseFriendDB(curUserId,e.from);
			//console.log("delete hostname:"+curUserId +"friendname:"+e.from);
			return;
		}
		// （订阅者的请求被拒绝或以前的订阅被取消），即对方单向的删除了好友
		if (e.type == 'unsubscribed') {
			delFriend(e.from);
			//DeleteEaseFriendDB(e.from,curUserId);
			//console.log("delete hostname:"+ e.from +"friendname:"+curUserId);
			//console.log("对方单项删除好友");
			return;
		}
		
        //退出群组（删除好友）
		if(e.type == 'unavailable')
		{
			var isexist = contains2(roomList, e.from,e.fromJid);
			if (isexist) {
				removeGroupDomElement(e.from);
			}
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
						//'class' : 'list-group-item right-item',
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
						   };
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
			//删除好友
			if (contact.subscription == 'remove') {
				//数据库双向删除好友
				DeleteEaseFriendDB(curUserId,contact.name);
				console.log("Del hostname:"+curUserId+" friendname:"+contact.name);
				DeleteEaseFriendDB(contact.name,curUserId);
				console.log("Del hostname:"+contact.name+" friendname:"+curUserId);
				
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
			    $.fillTipBox({type:'info', icon:'glyphicon-info-sign', content:contents});
				}
				else {
					//alert("服务器器断开连接");
					console.log("服务器器断开连接");
					var contents = "服务器器断开连接";
				    $.fillTipBox({type:'info', icon:'glyphicon-info-sign', content:contents});
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

	// add by guoxun
	var contains2 = function(roster, contact,fromJid) {
		//删除好友消息
		if(fromJid.indexOf(curUserId)<0){		
			return false;
		}
		//退出群组消息
		var i = roster.length;
		while (i--) {
			console.log(roster[i].roomId);
			console.log(contact);
			if (roster[i].roomId === contact) {
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
		for (var i = 0; i < roster.length; i++) {
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
				   };
				var RightClick = document.getElementById("pop_operation"+username);
				//$(RightClick).hide();
//				$(this).parent().parent().parent().parent().parent().parent().children("div[class='friend_pop_operation']").hide();
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

//			var $image = $("<div class='my-item-left' id='avater'> <img src='images/sites.jpg'></div>");
//			var $people = $("<div class='pictureandps'><p>"+name+"</p><p class='onelinerightps'><span class='ui-right ui-gray'>[离线]</span></span><p></div>");			
//			var $href = $("<a onclick = \"createFriendInfoPage\('"+userName+"'\)\" href = \""+"#"+InfoPrefix+userName+"\">");
//			
//			$href.append($image);
//			$href.append($people);
//			lielem.append($href);
//			content.append(lielem);
			
			
			
//			console.log("name="+name);
//			var list1 = $("<a class=\"list-group-item\" onclick=\"FriendModal\('"+name+"'\);\"></a>");
//		    $('<span>').html(name).appendTo(list1);
//		    $('#list_friend').append(list1);
			
			
//			if(false == judgeExist(InfoPrefix+userName)){
//				//一个联系人的信息界面没有，创建一个
//				createFriendInfoPage(userName);
//			}
		}
//		var contactlist = $(document.getElementById(contactlistDivId));
//		var children = contactlist.children;
//		if (children.length > 0) {
//			contactlist.removeChild(children);
//		}
//		contactlist.appendChild(uielem);
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
		
	};

	// 构造群组列表
	var buildListRoomDiv = function(contactlistDivId, rooms) {
		var uielem = document.getElementById("list_group_UL");
		var cache = {};
		for (var i = 0; i < rooms.length; i++) {
			
			//console.log(rooms[i]);
			
			var roomsName = rooms[i].name;
//			//处理会议群聊
//			if(roomsName.substr(4) == "@conf.com"){
//				//群名为1234@conf.com
//				console.log("是会议群聊");
//				continue;
//		    }
			/////////右栏群聊
			var roomId = rooms[i].roomId;
			if (roomId in cache) {
				continue;
			}
			roomList.push(rooms[i]);
			cache[roomId] = true;
			var lielem = $('<li>').attr({
				'id' : groupFlagMark + roomId,
				//'class' : 'list-group-item group_margin right-item',
				'className' : 'offline',
				'type' : 'groupchat',
				'displayName' : roomsName,
				'roomId' : roomId,
				'joined' : 'false'
			}).dblclick(function() {
			chooseGroupDivClick(this);
		});
		
		
		var liImg = $("<div class='list_portrait'>"
				+ "<img src='css/pc/images/img/portrait65_4.jpg'/></div>");
		lielem.append(liImg);

		var liName = $("<span class='friend_name'>" + roomsName + "</span>");
		lielem.append(liName);
		console.log("singleGroup test1");

		var right_div=$("<div class=\"dropdown-menu\" display:\"none\" role=\"menu\"  aria-labelledby=\"dropdownMenu\" id=\"RightOnSingleGroup"+roomId+"\"></div>");
		var delGroup = $("<div><a onclick=\"showDelGroup(\'"+roomId+"\')\" href=\"javascript:void(0)\">退出群组</a></div>");
		var destroyGroup = $("<div><a onclick=\"showDestroyGroup(\'"+roomId+"\')\" href=\"javascript:void(0)\">解散群组</a></div>");
		right_div.append(delGroup);
		right_div.append(destroyGroup);
		lielem.append(right_div);
		
		
		lielem.mousedown(function(e) {
		if (3 == e.which){
//		  //右键按下
			document.oncontextmenu = function() {
				return false;
			};
			console.log("lielem右键");
			//$("#RightOnFriend").hide();
			console.log(this.id);
			var li_id = this.id;
			var singleRoomId = li_id.replace("group","");
			
			console.log("#RightOnSingleGroup"+singleRoomId);
			var right_click="#RightOnSingleGroup"+singleRoomId;
			$(right_click).hide();
			//$("#RightOnContact").hide();
			
			$(right_click).attr(
					"style",
					"display: block; top:" + e.pageY + "px; left:"
							+ e.pageX + "px;");
			$(right_click).show();
			$("body").click(function(e) {
				$(right_click).hide();
			});
		}});
		
			$(uielem).append(lielem);
		}
	};

	//构造空群组界面
	var buildNullListRoomDiv = function(contactlistDivId){
		var list_group = document.getElementById(contactlistDivId);
		
		/**** right group_list Null ****/
		var group_list_none = $("<div id=\"group_list_none\" class=\"friend_list_none\"></div>");
		var li_img = $("<div class=\"li_img\"><img src=\"images/rtc_right_none2.png\" width=\"60\" height=\"60\" /></div>");
		var li_p = $("<p>您还没有群组</p><a onclick=\"showAddGroup()\" href=\"javascript:void(0)\" class=\"btn_blue\">添加群组</a>");
		$(group_list_none).append(li_img);
		$(group_list_none).append(li_p);
		/**** right group_list Null end ****/

		$(list_group).append(group_list_none);
	};

	var clearContactUI = function(contactlistUL, contactgrouplistUL,
			momogrouplistUL, contactChatDiv) {
		// 清除左侧联系人内容
		$('#contactlistUL').empty();
		$('#contactgrouplistUL').empty();
		$('#momogrouplistUL').empty();

		// 处理联系人分组的未读消息处理
		var accordionChild = $('#accordionDiv').children();
		for (var i = 1; i <= accordionChild.length; i++) {
			var badgegroup = $('#accordion' + i).find(".badgegroup");
			if (badgegroup && badgegroup.length > 0) {
				$('#accordion' + i).children().remove();
			}
		}
		;

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

	//发送消息（群组remoteName：Group+test4+138636573657793068）
	var sendText = function(remoteName) {
		//textSending用于标识是否可以发送消息
		console.log(textSending);
		if (textSending) {
			return;
		}
		textSending = true;
		
		//获取textarea要发送的内容
		var $msgInput=$(document.getElementById(remoteName+"message"));
		var msg = $msgInput.val();

		if (msg == null || msg.length == 0) {
			textSending = false;
			return;
		}
		//发消息给好友
		var to = formatToEase(remoteName);
		if (to == null) {
			return;
		}
		var options = {
			to : to,
			msg : msg,
			type : "chat"
		};
		console.log("非空");
		
        //发消息到群组
		if (remoteName.indexOf(GroupPrefix) >= 0) {
			options.type = 'groupchat';
			options.to = curRoomId;	  //群组Id（在活动页面保存当前roomId）		
		}
		console.log("options.to="+options.to);
		// easemobwebim-sdk发送文本消息的方法 to为发送给谁，meg为文本消息对象
		conn.sendTextMessage(options);

		// 当前登录人发送的信息在聊天窗口中原样显示
		var msgtext = msg.replace(/\n/g, '<br>');
		
		appendMsg2(curUserId, to, msgtext);

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

			if (curChatUserId.indexOf(groupFlagMark) >= 0) {
				opt.type = 'groupchat';
				opt.to = curRoomId;
			}
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
			// 构造完opt对象后调用easemobwebim-sdk中发送音频的方法
			if (curChatUserId.indexOf(groupFlagMark) >= 0) {
				opt.type = 'groupchat';
				opt.to = curRoomId;
			}
			opt.apiUrl = apiURL;
			conn.sendAudio(opt);
			return;
		}
		$('#send-file-warning').html(
				"<font color='#FF0000'>不支持此音频类型" + filetype + "</font>");
	};
	
	// easemobwebim-sdk收到文本消息的回调方法的实现
	var handleTextMessage = function(message) {
		var mestype = message.type;         // 消息发送的类型是群组消息还是个人消息
		var from = message.from;            // 消息的发送者
		var messageContent = message.data;  // 文本消息体
        //群组消息
		if (mestype == 'groupchat') 
		{   
			//根据消息体的to值去定位那个群组的聊天记录
			//to字段为群组Id(根据会议Id查询会议名称)
			//startSearchMeetingGroupName(message,message.to);
			handleTextMessageCallBack(message);
		}
		//好友消息
		else 
		{   console.log("是好友消息");
			appendMsg(from, from, messageContent);
		}
	};
	//add by pq 查询会议群组回调(群聊)
	var handleTextMessageCallBack = function(message){
		
		var mestype = message.type;         // 消息发送的类型是群组消息还是个人消息
		var from = message.from;            // 消息的发送者
		var messageContent = message.data;  // 文本消息体
		
		//var GroupMeetingName = $("input[class='"+ message.to +"']").val();
//		if(GroupMeetingName.substr(4) == "@conf.com"){
//			console.log("是会议群聊消息");
//			//显示群组其他成员消息
//			appendOtherMeetingContent(GroupMeetingName,from,messageContent);
//			return;
//		}
		////普通群聊
		console.log("是普通群聊");
		var room = GroupPrefix+message.to;
		message.to=room;
		appendMsg(message.from, message.to, messageContent, mestype);//appendMsg(webrtc1-163.com,134160751114846652,aa,groupchat);
	};
	
	// easemobwebim-sdk收到表情消息的回调方法的实现，message为表情符号和文本的消息对象，文本和表情符号sdk中做了
	// 统一的处理，不需要用户自己区别字符是文本还是表情符号。
	var handleEmotion = function(message) {
		var from = message.from;
		var room = message.to;
		var mestype = message.type;// 消息发送的类型是群组消息还是个人消息
		if (mestype == 'groupchat') {
			appendMsg(message.from, message.to, message, mestype);
		} else {
			appendMsg(from, from, message);
		}

	};
	// easemobwebim-sdk收到图片消息的回调方法的实现
	var handlePictureMessage = function(message) {
		var filename = message.filename;// 文件名称，带文件扩展名
		var from = message.from;// 文件的发送者
		var mestype = message.type;// 消息发送的类型是群组消息还是个人消息
		var contactDivId = from;
		if (mestype == 'groupchat') {
			contactDivId = groupFlagMark + message.to;
		}
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
			};
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

		var mestype = message.type;// 消息发送的类型是群组消息还是个人消息
		var contactDivId = from;
		if (mestype == 'groupchat') {
			contactDivId = groupFlagMark + message.to;
		}
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

		var mestype = message.type;// 消息发送的类型是群组消息还是个人消息
		var contactDivId = from;
		if (mestype == 'groupchat') {
			contactDivId = groupFlagMark + message.to;
		}
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

		var mestype = message.type;// 消息发送的类型是群组消息还是个人消息
		var contactDivId = from;
		if (mestype == 'groupchat') {
			contactDivId = groupFlagMark + message.to;
		}
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
		var mestype = message.type;
		var content = message.addr;
		if (mestype == 'groupchat') {
			appendMsg(from, to, content, mestype);
		} else {
			appendMsg(from, from, content, mestype);
		}
	};

	//新添好友或群组调用
	var handleInviteMessage = function(message) {
		//var type = message.type;
		//var from = message.from;
		//var roomId = message.roomid;
		console.log("handleInviteMessage test1");

		// 获取当前登录人的群组列表
		conn.listRooms({
			success : function(rooms) {
				if (rooms) {
					//清空群组列表
					$('#list_group_UL li').remove();
					if($("#group_list_none")!=null){$("#group_list_none").remove();}
                    //遍历每个群组
					for (var  i = 0; i < rooms.length; i++) {
						var roomsName = rooms[i].name;
						var roomId = rooms[i].roomId;
						console.log("roomsName="+roomsName);
						//处理会议群聊
//						if(roomsName.substr(4) == "@conf.com"){
//							//群名为1234@conf.com
//							console.log("是会议群聊");
//					    	//将群组Id添加到会议召开界面(创建成功)
//					    	startSearchMeetingGroup(roomsName);
//							continue;
//					    }
						//右栏群聊
						var existRoom = $('#list_group_UL').children(
								'#group--' + roomId);
						if (existRoom && existRoom.length == 0) {

							
							roomList.push(rooms[i]);
						//	cache[roomId] = true;
							var lielem = $('<li>').attr({
								'id' : groupFlagMark + roomId,
								//'class' : 'list-group-item group_margin right-item',
								'className' : 'offline',
								'type' : 'groupchat',
								'displayName' : roomsName,
								'roomId' : roomId,
								'joined' : 'false'
							}).dblclick(function() {
							chooseGroupDivClick(this);
						});
						console.log("handleInviteMessage test2");
						var liImg = $("<div class='list_portrait'>"
								+ "<img src='css/pc/images/img/portrait65_4.jpg'/></div>");
						lielem.append(liImg);
						console.log("handleInviteMessage test3");
						var liName = $("<span class='friend_name'>" + roomsName + "</span>");
						lielem.append(liName);
						var right_div=$("<div class=\"dropdown-menu\" display:\"none\" role=\"menu\"  aria-labelledby=\"dropdownMenu\" id=\"RightOnSingleGroup"+roomId+"\"></div>");
						var delGroup = $("<div><a onclick=\"showDelGroup(\'"+roomId+"\')\" href=\"javascript:void(0)\">退出群组</a></div>");
						var destroyGroup = $("<div><a onclick=\"showDestroyGroup(\'"+roomId+"\')\" href=\"javascript:void(0)\">解散群组</a></div>");
						right_div.append(delGroup);
						right_div.append(destroyGroup);
						lielem.append(right_div);
						
						
						lielem.mousedown(function(e) {
						if (3 == e.which){
//						  //右键按下
							document.oncontextmenu = function() {
								return false;
							};
							var li_id = this.id;
							var singleRoomId = li_id.replace("group","");
							
							//console.log("#RightOnSingleGroup"+singleRoomId);
							var right_click="#RightOnSingleGroup"+singleRoomId;
							$(right_click).hide();
							//$("#RightOnContact").hide();
							
							$(right_click).attr(
									"style",
									"display: block; top:" + e.pageY + "px; left:"
											+ e.pageX + "px;");
							$(right_click).show();
							$("body").click(function(e) {
								$(right_click).hide();
							});
						}});
						$('#list_group_UL').append(lielem);
						console.log("add newgroup success!");
						}
					// cleanListRoomDiv();//先将原群组列表中的内容清除，再将最新的群组列表加入
					// buildListRoomDiv("contracgrouplist", rooms);//群组列表页面处理
					} //end of遍历群
				}
			},
			error : function(e) {
			}
		});

	};
	var cleanListRoomDiv = function cleanListRoomDiv() {
		$('#contactgrouplistUL').empty();
	};

	// 收到消息，而对话界面没有该联系人时，创建对话项
	var createMomogrouplistUL = function createMomogrouplistUL(who, message) {
		var momogrouplistUL = document.getElementById("momogrouplistUL");
		var cache = {};

		if (who in cache) {
			return;
		}
		cache[who] = true;
		var lielem = document.createElement("li");
		$(lielem).attr({
			'id' : who,
			'class' : 'offline',
			'className' : 'offline',
			'type' : 'chat',
			'displayName' : who
		});
		lielem.onclick = function() {
			chooseContactDivClick(this);
		};
		var imgelem = document.createElement("img");
		imgelem.setAttribute("src", "img/head/contact_normal.png");
		lielem.appendChild(imgelem);

		var spanelem = document.createElement("span");
		spanelem.innerHTML = who;
		lielem.appendChild(spanelem);

		momogrouplistUL.appendChild(lielem);
	};
	
	// 显示聊天记录的处理方法
	//appendMsg(from, from, messageContent);
	// Object {type: "chat", from: "webrtc5-163.com", to: "webrtc4-163.com", data: "dddddddd", ext: Object}
	//appendMsg(webrtc1-163.com,Group+134160751114846652,aa,groupchat);
	var appendMsg = function(who, Imcontact, message, chattype) {
		var chatFriendId = formatReEase(Imcontact);
		//console.log("in appendMsg,contact="+chatFriendId);
		var Message = message.replace(/\n/g, '<br>');
		/**
		 * 区分是单聊还是群聊
		 */
		if (chatFriendId.indexOf(GroupPrefix) >= 0) //群聊：chatFriendId=Group+134160751114846652;
		{
			var pattern = GroupPrefix;
			//console.log("去除前缀前，chatFriendId="+chatFriendId);
			chatFriendId = chatFriendId.replace(new RegExp(pattern), "");//chatFriendId=134160751114846652;
			chatFriendId = chatFriendId.replace("+","");
			var chatFriendIdPlus=chatFriendId;
			//console.log("去除前缀后，chatFriendId="+chatFriendId);
			//var contactLi = document.getElementById(groupFlagMark+chatFriendId);//group--134160751114846652
			var liMark=groupFlagMark+chatFriendId;
			var contactLi = $("#list_group_UL #"+liMark);
			var contactName = $(contactLi).attr("displayname"); //test2;
			chatFriendIdandName =contactName+"+"+chatFriendId;//test2+134160751114846652;
		
			//1.判断与chatFriendId的聊天框是否存在
			var contentDiv = getGroupContactChatDiv(chatFriendIdandName);
			if (contentDiv==null)  //不存在
			{
				//console.log("接收方接收群组消息，新建群组聊天窗口，参数一：chatFriendId="+chatFriendId+",参数二：contactName="+contactName);
				chatFriendId=contactName+"+"+chatFriendId;
				var newContent = createGroupChatDiv(chatFriendId,contactName); //生成一个新的
				document.getElementById("web").appendChild(newContent); //加入
				newContent.setAttribute("style","display:none;"); //隐藏
		    	createActiveList(contactName,GroupPrefix,chatFriendId); // 但左侧活动会话列表需要生成、显示
			} 			
			//2.判断当前打开的对话框是否正是chatFriendId的
			if(globalCur != (GroupPrefix+contactName+"+"+chatFriendIdPlus)) //并不是
			{
				//找到ActiveList中chatFriendId项，使其右侧消息数量+1
				incNumInActiveListItem(chatFriendIdandName,GroupPrefix);

				//顶部消息数量+1
				incNumInHeadTips(MessagePrefix);
			}
			
			//3.显示消息气泡至chatFriendId的聊天框
			//console.log("who= "+who);
			appendMsg3(who, Imcontact, Message);

		}	
		else //单聊
		{
			//add by yck
			//1.判断与chatFriendId的聊天框是否存在
			var contentDiv = getContactChatDiv(chatFriendId);
			if (contentDiv == null) //不存在
			{
				var newContent = createContactChatDiv(chatFriendId); //生成一个新的

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
		}
			

		// 构造消息体
		// {isemotion:true;body:[{type:txt,msg:ssss}{type:emotion,msg:imgdata}]}
//		var localMsg = null;
//		if (typeof message == 'string') 
//		{
//			localMsg = Easemob.im.Helper.parseTextMessage(message);
//			localMsg = localMsg.body;
//		} 
//		else 
//		{
//			localMsg = message.data;
//		}
//		
//		var messageContent = localMsg;
//		//普通消息数字大小为1 ，其余种类消息目前不处理，未来此处要改
//		var type = messageContent[0].type;
//		var data = messageContent[0].data;
//		console.log(type+data);

	};
	
	//发送方回显自己发送的消息
	var appendMsg2 = function(who, Imcontact, message, chattype) {

		var contact = formatReEase(Imcontact);
		//console.log("第二个参数contact="+contact);

		var MsgDivId = MessagePrefix+contact;
		if (contact.indexOf(GroupPrefix) >= 0) {
			
			var MsgDivId = contact;
		}
		
		//console.log("MsgDivId="+MsgDivId);
		addMessageMsg(MsgDivId,who,Imcontact,message);
		//console.log("发送方回显自己的消息：addMessageMsg,MsgDivId="+MsgDivId+",who="+who+",Imcontact="+Imcontact+",message="+message);
		//addRecordMsg(RecordPrefix+contact,contact,message);
	};

	var appendMsg3 = function(who, Imcontact, message, chattype) {

		var contact = formatReEase(Imcontact);
		//console.log("第二个参数contact="+contact);

		var MsgDivId = MessagePrefix+contact;
		if (contact.indexOf(GroupPrefix) >= 0) 
		{
			
			var MsgDivId = contact;
			//console.log("去除前缀前，contact="+contact);
			var pattern = GroupPrefix;
			contact = contact.replace(new RegExp(pattern), "");
			contact = contact.replace("+","");//chatFriendId=134160751114846652;
			//console.log("去除前缀后，contact="+contact);
			var contactLi = document.getElementById(groupFlagMark+contact);
			var contactName = $(contactLi).attr("displayname");//test
			//Imcontact = GroupPrefix+ImcontactName+"+"+Imcontact;
			MsgDivId=GroupPrefix+contactName+"+"+contact;
			console.log("in appendMsg3 Group,addMessageMsg,MsgDivId="+MsgDivId+",who="+who+",MsgDivId="+MsgDivId+",message="+message);
			addMessageMsg(MsgDivId,who,MsgDivId,message);
		}
		else
		{
			addMessageMsg(MsgDivId,Imcontact,Imcontact,message);
		}
		//addRecordMsg(RecordPrefix+contact,contact,message);
	};
	var showAddFriend = function() {
		console.log("show addFriend");
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

	// add by guoxun
	var showAddGroup= function() {
		$('#addGroupModal').modal('toggle');
		$('#searchGroupId').val('群组名称');// 输入好友账号
		$('#addGroupId').val('搜索结果的群组ID号');// 输入好友账号
		$('#add-group-warning').html("");
	};
    
	//是否确认退出群组
	var showDelGroup= function(GroupId) {
		//$('#delGroupModal').modal('toggle');
		if(confirm("确认退出该群组吗？")){
			startDelGroup(GroupId);
		}
		$('#delGroupId').val('群组账号');// 输入好友账号
		
		$('#del-group-warning').html("");
	};
	
    //是否确认解散群组
	var showDestroyGroup= function(GroupId) {
		//$('#destroyGroupModal').modal('toggle');
		if(confirm("确认解散该群组吗？")){
			startDestroyGroup(GroupId);
		}
		$('#destroyGroupId').val('群组账号');// 输入好友账号
		$('#destroy-group-warning').html("");
	};
	var showCreateGroup= function() {
		$('#createGroupModal').modal('toggle');
		$('#createGroupId').val('');// 输入好友账号
		$('#createGroupDesc').val('');
		$('#createGroupMax').val('');
		$('#create-group-warning').html("");
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
	    $.fillTipBox({type:'info', icon:'glyphicon-info-sign', content:contents});
		return;
	};

	// add by guoxun
	//加入群组
	var startAddGroup = function() {
		var chatgroupname = $('#addGroupId').val();
		console.log("chatgroupname="+chatgroupname);
		if (chatgroupname == '') {
			$('#add-group-warning').html(
					"<font color='#FF0000'>请输入群组名</font>");
			return;
		}
		// if (bothRoster)
		// for (var i = 0; i < bothRoster.length; i++) {
		// if (bothRoster[i].name == user) {
		// $('#add-group-warning').html(
		// "<font color='#FF0000'>您已在群组中</font>");
		// return;
		// }
		// }
		// 发送加入群组请求
		$.ajax({  
        	url : WEBIM_URL+"/addgroup",  
        	async: true,  
        	type : "get",
        	dataType : "jsonp",
        	jsonp: "callbackparam", // 服务端用于接收callback调用的function名的参数
        	jsonpCallback: "success_jsonpCallback", // callback的function名称,服务端会把名称和data一起传递回来
        	data : {'chatgroupname': chatgroupname,
        		'userid': curUserId
        	},  
        	success : function(json) {
        	// alert('success');
        	//console.log(json[0]);
        	//console.log(json[0].msg);
        	var contents = json[0].msg;
        	$.fillTipBox({type:'info', icon:'glyphicon-info-sign', content: contents});
        	}
         
        });
		$('#addGroupModal').modal('hide');
		return;
	};
	
	// add by guoxun
	//根据群组名称搜索群号
	var startSearchGroup = function() {
		var chatgroupname = $('#searchGroupId').val();
		console.log("chatgroupname="+chatgroupname);
		if (chatgroupname == '') {
			$('#search-group-warning').html(
					"<font color='#FF0000'>请输入群组名</font>");
			return;
		}
		$.ajax({  
        	url : WEBIM_URL+"/searchgroup",  
        	async: true,  
        	type : "get",
        	dataType : "jsonp",
        	jsonp: "callbackparam", // 服务端用于接收callback调用的function名的参数
        	jsonpCallback: "success_jsonpCallback", // callback的function名称,服务端会把名称和data一起传递回来
        	data : {'chatgroupname': chatgroupname
        	},  
        	success : function(json) {
        	// alert('success');
        	$('#searchresult').children().remove();
        	
        	test=json[0];
        	//console.log(json[0]);
        		if(json[0].status=="empty"){
        			var $li = $("<li>空<li>");
        			$('#searchresult').append($li);
        		}
        		else{
        			var contents = json[0].content;
        			for(var i=0;i<contents.length;i++){
        				var itr = contents[i];
        				var name = formatReEase(itr.owner.split("_")[1]);
        				var $li =  $("<li>"+"群组名:"+itr.groupname+" 群组创建者:"+name+" 群组ID号"+itr.groupid+"<li>");
        				$('#searchresult').append($li);
        			}
        		}
        	}
         
        });
		return;
	}; 
	
	var startFindRoomMember = function(RoomId){
		$.ajax({  
        	url : WEBIM_URL+"/getRoomMember",  
        	async: true,  
        	type : "get",
        	dataType : "jsonp",
        	jsonp: "callbackparam", // 服务端用于接收callback调用的function名的参数
        	jsonpCallback: "success_jsonpCallback", // callback的function名称,服务端会把名称和data一起传递回来
        	data : {'RoomId': RoomId
        	},  
        	success : function(json) {
        		var groupMembers=json[0].data;
        		var length = groupMembers.length;
        		console.log(length);
        		for(var i=0;i<groupMembers.length;i++){
    				var itr = groupMembers[i];
    				if(itr.owner!=null&&itr.owner.length>0){
    					var owner_name = formatReEase(itr.owner);
    					var li = $("<li><div class=\"list_portrait\"><img src=\"images/img/portrait65_2.jpg\" /></div><a href=\"javascript:void(0)\">"+owner_name+"</a></li>");
    					
    				}
    				if(itr.member!=null&&itr.member.length>0){
    					var member_name = formatReEase(itr.member);
    					var li = $("<li><div class=\"list_portrait\"><img src=\"images/img/portrait65_2.jpg\" /></div><a href=\"javascript:void(0)\">"+member_name+"</a></li>");
    					
    				}
    				$("#"+RoomId+"group_member ul").append(li);
    			}
        	}
        		
        	});
		return;
	};
	
	//退出群组
	var startDelGroup = function(GroupId) {
		
		if (GroupId == '') {
			return;
		}
		console.log("In startDelGroup, GroupId="+GroupId);
		$.ajax({  
        	url : WEBIM_URL+"/delgroup",  
        	async: true,  
        	type : "get",
        	dataType : "jsonp",
        	jsonp: "callbackparam", // 服务端用于接收callback调用的function名的参数
        	jsonpCallback: "success_jsonpCallback", // callback的function名称,服务端会把名称和data一起传递回来
        	data : {'chatgroupname': GroupId,
        		'userid': curUserId
        	},  
        	success : function(json) {
        	// alert('success');
        	//console.log(json[0]);
        	//console.log(json[0].msg);
        	var contents = json[0].msg;
        	$.fillTipBox({type:'info', icon:'glyphicon-info-sign', content: contents});
        	//重新刷新群组列表
    		conn.listRooms({
				success : function(rooms) {
					//目前不考虑群组的实现
					if (rooms && rooms.length > 0) {

					}
					else {
						buildNullListRoomDiv("list_group");
					}
					conn.setPresence();// 设置用户上线状态，必须调用
				},
				error : function(e) {

				}
			});
        	}
         
        });
		

		$('#delGroupModal').modal('hide');


		return;
	};
    
	//解散群组
	var startDestroyGroup = function(GroupId) {
		//var chatgroupname = $('#destroyGroupId').val();
		if (GroupId == '') {
			return;
		}
		// 发送加入群组请求
		$.ajax({  
        	url : WEBIM_URL+"/destroygroup",  
        	async: true,  
        	type : "get",
        	dataType : "jsonp",
        	jsonp: "callbackparam", // 服务端用于接收callback调用的function名的参数
        	jsonpCallback: "success_jsonpCallback", // callback的function名称,服务端会把名称和data一起传递回来
        	data : {'chatgroupname': GroupId,
        		'userid': curUserId
        	},  
        	success : function(json) {
        	// alert('success');
        	//console.log(json[0]);
        	//console.log(json[0].msg);
        	var contents = json[0].msg;
        	$.fillTipBox({type:'info', icon:'glyphicon-info-sign', content: contents});
        	//刷新群组信息
    		conn.listRooms({
				success : function(rooms) {
					if (rooms && rooms.length > 0) {

					}
					else {
						buildNullListRoomDiv("list_group");
					}
					conn.setPresence();// 设置用户上线状态，必须调用
				},
				error : function(e) {

				}
			});
        	}
         
        });
		

		$('#destroyGroupModal').modal('hide');


		return;
	};
    
	//创建群组
	var startCreateGroup = function() {
		var chatgroupname = $('#createGroupId').val();
		var chatgroupdesc = $('#createGroupDesc').val();
		var chatgroupmax = $('#createGroupMax').val(); 
		//var chatgroupapproval = $('#createGroupApproval input[name="approval"]:checked').val();
		var chatgroupapproval=true;
		//var chatgrouppub = $('#createGroupPub input[name="pub"]:checked').val();
		var chatgrouppub = false;
		var chatgroupowner = curUserId;
		if (chatgroupname == '') {
			$('#create-group-warning').html(
					"<font color='#FF0000'>请输入群组名</font>");
			return;
		}
		// //发送加入群组请求
		$.ajax({  
        	url : WEBIM_URL+"/creategroup",  
        	async: true,  
        	type : "get",
        	dataType : "jsonp",
        	jsonp: "callbackparam", // 服务端用于接收callback调用的function名的参数
        	jsonpCallback: "success_jsonpCallback", // callback的function名称,服务端会把名称和data一起传递回来
        	data : {
        		'chatgroupname':chatgroupname,
				'userid' :chatgroupowner,
				'desc':chatgroupdesc,
				'approval':chatgroupapproval,
				'pub':chatgrouppub,
				'max':chatgroupmax
        	},  
        	success : function(json) {
        	// alert('success');
        	//console.log(json[0]);
        	//console.log(json[0].msg);
        	var contents = json[0].msg;
        	$.fillTipBox({type:'info', icon:'glyphicon-info-sign', content: contents});
        	}
         
        });
		$('#createGroupModal').modal('hide');
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

    //如果存在与该好友的聊天界面，则删除
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
		if (contactToDel) {
			console.log("remove contact");
			bothRoster.remove(contactToDel);
			var normal_userToDel = formatReEase(userToDel);
			console.log("normal_userToDel="+normal_userToDel);
			$(document.getElementById(FriendListPrefix+normal_userToDel)).remove();
		}
		
		var username = formatReEase(userToDel);
		
//		console.log(username);
//		$("div[id *= '"+username+"']").remove();
//		$("li[id *= '"+username+"']").remove();
		
		// 删除聊天会话界面
		hideChatDiv(username);
		
		// 隐藏删除好友窗口
		console.log("removeFriendDomElement");		
	};

	//如果存在群组的聊天界面，则删除
	var removeGroupDomElement = function(groupToDel, local) {
		console.log(groupToDel);
		var contactToDel;
		if (roomList.length > 0) {
			for (var i = 0; i < roomList.length; i++) {
				if (roomList[i].roomId == groupToDel) {
					contactToDel = roomList[i];
					break;
				}
			}
		}
		
		if (contactToDel) {
			roomList.remove(contactToDel);
		}
		
//		$('div[id *= '+groupToDel+']').remove();
//		$('li[id *= '+groupToDel+']').remove();
//		
//		globalCur=null;
		
		//删除群组会话Dom（groupToDel为groupId号）
		hideGroupChatDiv(groupToDel);
		
		// 隐藏删除好友窗口
		if (local) {
			$('#delGroupModal').modal('hide');
		}
		// 删除通讯录
		//$('#' + groupFlagMark+groupToDel).remove();
		$(document.getElementById(groupFlagMark+groupToDel)).remove();
		// 删除聊天
		var chatDivId = curUserId + "-" + groupFlagMark+groupToDel;
		//var chatDiv = $('#' + chatDivId);
		var chatDiv = $(document.getElementById(chatDivId));
		if (chatDiv) {
			chatDiv.remove();
		}
		if (curChatUserId != groupFlagMark+groupToDel) {
			return;
		} else {
			var displayName = '';
			// 将第一个联系人作为当前聊天div
			if (bothRoster.length > 0) {
				curChatUserId = bothRoster[0].name;
				$(document.getElementById(curChatUserId)).css({
					"background-color" : "#33CCFF"
					});	
				var currentDiv = getContactChatDiv(curChatUserId)
						|| createContactChatDiv(curChatUserId);
				document.getElementById(msgCardDivId).appendChild(currentDiv);
				$(currentDiv).css({
					"display" : "block"
				});
				displayName = '与' + curChatUserId + '聊天中';
			} else if(roomList.length>0){

				curChatUserId = groupFlagMark+roomList[0].roomId;
//				$('#' + curChatUserId).css({
//					"background-color" : "#33CCFF"
//				});
				$(document.getElementById(curChatUserId)).css({
				"background-color" : "#33CCFF"
				});				
				var currentDiv = getContactChatDiv(curChatUserId)
						|| createContactChatDiv(curChatUserId);
				document.getElementById(msgCardDivId).appendChild(currentDiv);
				$(currentDiv).css({
					"display" : "block"
				});

				var contactLi = document.getElementById(curChatUserId);
				displayName = "群组" + $(contactLi).attr('displayname') + "聊天中";
			} 
			else 
			{
				$('#null-nouser').css({
					"display" : "block"
				});
				displayName = '';
				curChatUserId = null;
			}
			$('#talkTo').html('<a href="javascript:void(0)">' + displayName + '</a>');
		}
	};

	// 清除聊天记录
	var clearCurrentChat = function clearCurrentChat() {
		var currentDiv = getContactChatDiv(curChatUserId)
				|| createContactChatDiv(curChatUserId);
		currentDiv.innerHTML = "";
	};

	// 显示成员列表
	var showRoomMember = function showRoomMember() {
		if (groupQuering) {
			return;
		}
		groupQuering = true;
		queryOccupants(curRoomId);
	};

	// 根据roomId查询room成员列表
	var queryOccupants = function queryOccupants(roomId) {
		var occupants = [];
		conn.queryRoomInfo({
			roomId : roomId,
			success : function(occs) {
				if (occs) {
					for (var i = 0; i < occs.length; i++) {
						occupants.push(occs[i]);
					}
				}
				conn.queryRoomMember({
					roomId : roomId,
					success : function(members) {
						if (members) {
							for (var i = 0; i < members.length; i++) {
								occupants.push(members[i]);
							}
						}
						showRoomMemberList(occupants);
						groupQuering = false;
					},
					error : function() {
						groupQuering = false;
					}
				});
			},
			error : function() {
				groupQuering = false;
			}
		});
	};

	var showRoomMemberList = function showRoomMemberList(occupants) {
		var list = $('#room-member-list')[0];
		var childs = list.childNodes;
		for (var i = childs.length - 1; i >= 0; i--) {
			list.removeChild(childs.item(i));
		}
		for (i = 0; i < occupants.length; i++) {
			var jid = occupants[i].jid;
			var userName = jid.substring(jid.indexOf("_") + 1).split("@")[0];
			var txt = $("<p></p>").text(userName);
			$('#room-member-list').append(txt);
		}
		$('#option-room-div-modal').modal('toggle');
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
	};
