
	var Ease_Password = "123456";
	var RecordPrefix = "Record";
	var MessagePrefix = "Msg";
	var InfoPrefix = "Info";
	var CallVideoPrefix = "Video";
	var CallAudioPrefix = "Audio";
	var AddNewFriendName = "新朋友";
	var NewFriendPrefix = "newfriend";
	var deletefriendPrefix="deletefriend";
	
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
	var groupFlagMark = "group--";
	var groupQuering = false;
	var textSending = false;
	var appkey = "buptwebrtc#webrtc";
	var time = 0;

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
			login();
			
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
		
		createMeHome(curUserId);
		console.log("in handleOpen test 2");
		
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
					buildContactDiv("groupone",bothRoster);
//					curroster = bothRoster[0];
//					buildContactDiv("contractlist", bothRoster);// 联系人列表页面处理
//					if (curroster)
//						setCurrentContact(curroster.name);// 页面处理将第一个联系人作为当前聊天div
				}
				// 获取当前登录人的群组列表
				conn.listRooms({
					success : function(rooms) {
						//目前不考虑群组的实现
//						if (rooms && rooms.length > 0) {
//							buildListRoomDiv("contracgrouplist", rooms);// 群组列表页面处理
//							if (curChatUserId == null) {
//								setCurrentContact(groupFlagMark
//										+ rooms[0].roomId);
//								$('#accordion2').click();
//							}
//						}
						conn.setPresence();// 设置用户上线状态，必须调用
					},
					error : function(e) {

					}
				});
			}
		});
	};

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
		from = e.from;
		noraml_from = formatReEase(from);
		if (e.type == 'subscribe') {
			if (e.status) {
				if (e.status.indexOf('resp:true') > -1) {
					agreeAddFriend(e.from);
					return;
				}
			}
			var subscribeMessage = noraml_from + "请求加为好友。";
			console.log(subscribeMessage);
			appendNewFriendMsg(from,from,subscribeMessage);
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

		if(e.type == 'unavailable')
		{
			console.log(e);
			var isexist = contains2(roomList, e.from);
			if (isexist) {
				removeGroupDomElement(e.from);
				// conn.listRooms({
				// success : function(rooms) {
				// if (rooms) {
				// console.log(rooms);
				// cleanListRoomDiv();//先将原群组列表中的内容清除，再将最新的群组列表加入
				// buildListRoomDiv("contracgrouplist", rooms);//群组列表页面处理
				// }
				// },
				// error : function(e) {
				// }
				// });
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
//					var lielem = $('<li>').attr({
//						"id" : contact.name,
//						"class" : "offline",
//						"className" : "offline"
//					}).click(function() {
//						chooseContactDivClick(this);
//					});
//					$('<img>').attr({
//						"src" : "img/head/contact_normal.png"
//					}).appendTo(lielem);
//
//					$('<span>').html(contact.name).appendTo(lielem);
//					$('#contactlistUL').append(lielem);
					var lielem = $('<li>').attr({
						'id' : contact.name,
						'class' : 'ui-item ui-ignore-space'
					}).click(function() {
						chooseContactDivClick(this);
					});
					var contactlist = $("#groupone");
					var content = contactlist.children("ul");
					var normal_contactname = formatReEase(contact.name);
					var $image = $("<div class='my-item-left' id='avater'> <img src='images/sites.jpg'></div>");
					var $people = $("<div class='pictureandps'><p>"+normal_contactname+"</p><p class='onelinerightps'><span class='ui-right ui-gray'>[离线]</span></span><p></div>");			
				
					var $href = $("<a onclick = \"createFriendInfoPage\('"+contact.name+"'\)\" href = \""+"#"+InfoPrefix+contact.name+"\">");
					
					$href.append($image);
					$href.append($people);
					lielem.append($href);
					content.append(lielem);
					bothRoster.push(contact);
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

	// add by guoxun
	var contains2 = function(roster, contact) {
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
		var user = formatToEase($('.pub_banner').attr("user"));
		
		var pass = Ease_Password;
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
		
		var content = contactlist.children("ul");
		var cache = {};
		for (i = 0; i < roster.length; i++) {
			if (!(roster[i].subscription == 'both' || roster[i].subscription == 'from')) {
				continue;
			}
			var jid = roster[i].jid;
			var userName = jid.substring(jid.indexOf("_") + 1).split("@")[0];
			var name = formatReEase(userName);
			if (userName in cache) {
				continue;
			}
			cache[userName] = true;
			
			var lielem = $('<li>').attr({
				'id' : userName,
				'class' : 'ui-item ui-ignore-space'
			}).click(function() {
				chooseContactDivClick(this);
			});
			var $image = $("<div class='my-item-left' id='avater'> <img src='images/sites.jpg'></div>");
			var $people = $("<div class='pictureandps'><p>"+name+"</p><p class='onelinerightps'><span class='ui-right ui-gray'>[离线]</span></span><p></div>");			
		
			var $href = $("<a onclick = \"createFriendInfoPage\('"+userName+"'\)\" href = \""+"#"+InfoPrefix+userName+"\">");
			
			$href.append($image);
			$href.append($people);
			lielem.append($href);
			content.append(lielem);
			console.log("buildContactDiv success");
			
//			if(false == judgeExist(InfoPrefix+userName)){
//				//一个联系人的信息界面没有，创建一个
//				createFriendInfoPage(userName);
//			}
		}
//		var contactlist = $(document.getElementById(contactlistDivId));
//		var children = contactlist.children("ul");
//		if (children.length > 0) {
//			contactlist.removeChild(children);
//		}
//		contactlist.appendChild(content);
	};

	// 构造群组列表
	var buildListRoomDiv = function(contactlistDivId, rooms) {
		var uielem = document.getElementById("contactgrouplistUL");
		var cache = {};
		for (i = 0; i < rooms.length; i++) {
			
			console.log(rooms[i]);
			
			var roomsName = rooms[i].name;
			var roomId = rooms[i].roomId;
			if (roomId in cache) {
				continue;
			}
			// add by guoun
			roomList.push(rooms[i]);
			cache[roomId] = true;
			var lielem = $('<li>').attr({
				'id' : groupFlagMark + roomId,
				'class' : 'offline',
				'className' : 'offline',
				'type' : 'groupchat',
				'displayName' : roomsName,
				'roomId' : roomId,
				'joined' : 'false'
			}).click(function() {
				chooseContactDivClick(this);
			});
			$('<img>').attr({
				'src' : 'img/head/group_normal.png'
			}).appendTo(lielem);
			$('<span>').html(roomsName).appendTo(lielem);
			$('#contactgrouplistUL').append(lielem);
		}
		var contactlist = document.getElementById(contactlistDivId);
		var children = contactlist.children;
		if (children.length > 0) {
			contactlist.removeChild(children[0]);
		}
		contactlist.appendChild(uielem);
	};

	// 选择联系人的处理
	var getContactLi = function(chatUserId) {
		return document.getElementById(chatUserId);
	};

	// 选择好友申请的处理
	var getNewfriendLi = function(newfriendId) {
		return document.getElementById(newfriendId);
	};
	// 构造当前聊天记录的窗口div
	var getContactChatDiv = function(chatUserId) {
		return document.getElementById(curUserId + "-" + chatUserId);
	};

	// 如果当前没有某一个联系人的聊天窗口div就新建一个
	var createContactChatDiv = function(chatUserId) {
		var msgContentDivId = curUserId + "-" + chatUserId;
		var newContent = document.createElement("div");
		$(newContent).attr({
			"id" : msgContentDivId,
			"class" : "chat01_content",
			"className" : "chat01_content",
			"style" : "display:none"
		});
		return newContent;
	};

	// 显示当前选中联系人的聊天窗口div，并将该联系人在联系人列表中背景色置为蓝色
	var showContactChatDiv = function(chatUserId) {
		var contentDiv = getContactChatDiv(chatUserId);
		if (contentDiv == null) {
			contentDiv = createContactChatDiv(chatUserId);
			document.getElementById(msgCardDivId).appendChild(contentDiv);
		}
		contentDiv.style.display = "block";
		var contactLi = document.getElementById(chatUserId);
		if (contactLi == null) {
			return;
		}
		contactLi.style.backgroundColor = "#33CCFF";
		var dispalyTitle = null;// 聊天窗口显示当前对话人名称
		if (chatUserId.indexOf(groupFlagMark) >= 0) {
			dispalyTitle = "群组" + $(contactLi).attr('displayname') + "聊天中";
			curRoomId = $(contactLi).attr('roomid');
			$("#roomMemberImg").css('display', 'block');
		} else {
			dispalyTitle = "与" + chatUserId + "聊天中";
			$("#roomMemberImg").css('display', 'none');
		}

		document.getElementById(talkToDivId).children[0].innerHTML = dispalyTitle;
	};
	// 对上一个联系人的聊天窗口div做隐藏处理，并将联系人列表中选择的联系人背景色置空
	var hiddenContactChatDiv = function(chatUserId) {
		var contactLi = document.getElementById(chatUserId);
		if (contactLi) {
			contactLi.style.backgroundColor = "";
		}
		var contentDiv = getContactChatDiv(chatUserId);
		if (contentDiv) {
			contentDiv.style.display = "none";

		}

	};
	// 切换联系人聊天窗口div
	var chooseContactDivClick = function(li) {
//		var chatUserId = li.id;
//		if ($(li).attr("type") == 'groupchat'
//				&& ('true' != $(li).attr("joined"))) {
//			conn.join({
//				roomId : $(li).attr("roomId")
//			});
//			$(li).attr("joined", "true");
//		}
//		if (chatUserId != curChatUserId) {
//			if (curChatUserId == null) {
//				showContactChatDiv(chatUserId);
//			} else {
//				showContactChatDiv(chatUserId);
//				hiddenContactChatDiv(curChatUserId);
//			}
//			curChatUserId = chatUserId;
//		}
//		// 对默认的null-nouser div进行处理,走的这里说明联系人列表肯定不为空所以对默认的聊天div进行处理
//		$('#null-nouser').css({
//			"display" : "none"
//		});
//		var badgespan = $(li).children(".badge");
//		if (badgespan && badgespan.length > 0) {
//			li.removeChild(li.children[2]);
//		}
//
//		// 点击有未读消息对象时对未读消息提醒的处理
//		var badgespanGroup = $(li).parent().parent().parent().find(".badge");
//		if (badgespanGroup && badgespanGroup.length == 0) {
//			$(li).parent().parent().parent().prev().children().children()
//					.remove();
//		}
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

	var sendText = function(remoteName) {
		console.log(textSending);
		if (textSending) {
			return;
		}
		textSending = true;
		var $contactPage = $(document.getElementById(MessagePrefix+remoteName));
		
		var $msgInput = $contactPage.find("#msginput");
		
		var msg = $msgInput.val();
		console.log(msg);

		if (msg == null || msg.length == 0) {
			return;
		}
		var to = remoteName;
		if (to == null) {
			return;
		}
		var options = {
			to : to,
			msg : msg,
			type : "chat"
		};
		// 群组消息和个人消息的判断分支
		//目前不考虑分组
//		if (remoteName.indexOf(groupFlagMark) >= 0) {
//			options.type = 'groupchat';
//			options.to = curRoomId;
//		}
		// easemobwebim-sdk发送文本消息的方法 to为发送给谁，meg为文本消息对象
		conn.sendTextMessage(options);

		// 当前登录人发送的信息在聊天窗口中原样显示
		var msgtext = msg.replace(/\n/g, '<br>');
		
		appendMsg2(curUserId, to, msgtext);
		//turnoffFaces_box();
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
		var from = message.from;// 消息的发送者
		var mestype = message.type;// 消息发送的类型是群组消息还是个人消息
		var messageContent = message.data;// 文本消息体
		// TODO 根据消息体的to值去定位那个群组的聊天记录
		var room = message.to;
		if (mestype == 'groupchat') {
			//目前不处理群组消息
			//appendMsg(message.from, message.to, messageContent, mestype);
		} else {
			appendMsg(from, from, messageContent);
		}
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

	var handleInviteMessage = function(message) {
		var type = message.type;
		var from = message.from;
		var roomId = message.roomid;

		// 获取当前登录人的群组列表
		conn.listRooms({
			success : function(rooms) {
				if (rooms) {
					for (i = 0; i < rooms.length; i++) {
						var roomsName = rooms[i].name;
						var roomId = rooms[i].roomId;
						var existRoom = $('#contactgrouplistUL').children(
								'#group--' + roomId);
						if (existRoom && existRoom.length == 0) {

							roomList.push(rooms[i]);
							var lielem = $('<li>').attr({
								'id' : groupFlagMark + roomId,
								'class' : 'offline',
								'className' : 'offline',
								'type' : 'groupchat',
								'displayName' : roomsName,
								'roomId' : roomId,
								'joined' : 'false'
							}).click(function() {
								chooseContactDivClick(this);
							});
							$('<img>').attr({
								'src' : 'img/head/group_normal.png'
							}).appendTo(lielem);
							$('<span>').html(roomsName).appendTo(lielem);
							$('#contactgrouplistUL').append(lielem);
							// return;
						}
					}
					// cleanListRoomDiv();//先将原群组列表中的内容清除，再将最新的群组列表加入
					// buildListRoomDiv("contracgrouplist", rooms);//群组列表页面处理
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
	var appendMsg = function(who, contact, message, chattype) {
		//var contactUL = document.getElementById("contactlistUL");
		
		var contactDivId = RecordPrefix+contact;
		if (chattype && chattype == 'groupchat') {
			contactDivId = RecordPrefix+groupFlagMark + contact;
		}
		
		var contactLi = getContactLi(contactDivId);
		if (contactLi == null) {
			//如果对话界面没有这个人的选项，就创建对话界面对于这个人的选项
			createRecordlistLi("recordlist",contact);
		}
		
		var MsgDivId = MessagePrefix+contact;
		
		if(false == judgeExist(MsgDivId)){
			
			//与这个人的消息聊天界面不存在，生成一个;
			createMsgPage(contact);
		}

		// 构造消息体
		// {isemotion:true;body:[{type:txt,msg:ssss}{type:emotion,msg:imgdata}]}
		var localMsg = null;
		if (typeof message == 'string') {
			localMsg = Easemob.im.Helper.parseTextMessage(message);
			localMsg = localMsg.body;
		} else {
			localMsg = message.data;
		}
		
		var messageContent = localMsg;
		//普通消息数字大小为1 ，其余种类消息目前不处理，未来此处要改
		var type = messageContent[0].type;
		var data = messageContent[0].data;
		console.log(type+data);
		
		
		//离线消息最新一条显示在对话界面中对应人的那一项	
		addRecordMsg(RecordPrefix+contact,contact,data);

		
		
		//如果当前页面是与这个人消息聊天页面，即 class中包含 ui-page-active 则 不需要 增加 红色离线消息个数		
		if(judgeHasClass(MessagePrefix+contact,"ui-page-active")){
			//不操作
		}
		else{
		//对话界面离线消息各数显示
		//此处也需要变成函数
			var contactLi = getContactLi(contactDivId);
			if (contactLi == null) {
				return;
			}
			
			var badgespan = $(contactLi).find("#avater").children("span");
						
			if (badgespan && badgespan.html()!="") {
				var count = badgespan.html();
				var myNum = new Number(count);
				myNum++;
				badgespan.html(myNum);
				//去掉 no-visible class
				badgespan.removeClass("no-visible");
			} else {
				badgespan.attr({
					'class':'ui-red-counter'
				});
				badgespan.html(1);
			}
		}
			
		
					
//		//与某个人消息聊天界面 添加 消息体
//		var msgContentDiv = getContactChatDiv(contactDivId);
//		if (curUserId == who) {
//			lineDiv.style.textAlign = "right";
//		} else {
//			lineDiv.style.textAlign = "left";
//		}
//		var create = false;
//		if (msgContentDiv == null) {
//			msgContentDiv = createContactChatDiv(contactDivId);
//			create = true;
//		}
//		msgContentDiv.appendChild(lineDiv);
//		if (create) {
//			document.getElementById(msgCardDivId).appendChild(msgContentDiv);
//		}
//		msgContentDiv.scrollTop = msgContentDiv.scrollHeight;
//		return lineDiv;
		
		//与某个人消息聊天界面 添加 消息体
		addMessageMsg(MsgDivId,contact,data);
	};
	var appendNewFriendMsg = function(who, contact, message, chattype) {
		//var contactUL = document.getElementById("contactlistUL");
		
		var contactDivId = RecordPrefix+"newFriend";
		var newfriendlistDivId = NewFriendPrefix + contact;
		console.log("contactDivId="+contactDivId);
		if (chattype && chattype == 'groupchat') {
			contactDivId = RecordPrefix+groupFlagMark + contact;
		}
		
		var contactLi = getContactLi(contactDivId);
		if (contactLi == null) {
			//如果对话界面没有这个人的选项，就创建对话界面对于这个人的选项
			createRecordlistLi("recordlist","newFriend");
		}
		//在添加好友申请列表中显示好友申请信息
//		var newfriendLi = getNewfriendLi(newfriendlistDivId);
//		if (newfriendLi == null){
			//如果好友申请界面没有这个人的选项，就创建好友申请界面对于这个人的选项
			createNewFriendlistLi("newfriendlist",contact);
//		}
		console.log("appendNewFriendMsg test 1");
		//离线消息最新一条显示在对话界面中对应人的那一项	
		addRecordMsg(RecordPrefix+"newFriend",AddNewFriendName,message);

		console.log("appendNewFriendMsg test 2");
		
		//如果当前页面是与这个人消息聊天页面，即 class中包含 ui-page-active 则 不需要 增加 红色离线消息个数		
		if(judgeHasClass("newFriend","ui-page-active")){
			//不操作
		}
		else{
		//对话界面离线消息各数显示
		//此处也需要变成函数
		    console.log("appendNewFriendMsg test 3");
			var contactLi = getContactLi(contactDivId);
			if (contactLi == null) {
				return;
			}
			console.log("appendNewFriendMsg test 4");
			var badgespan = $(contactLi).find("#avater").children("span");
						
			if (badgespan && badgespan.html()!="") {
				var count = badgespan.html();
				var myNum = new Number(count);
				myNum++;
				badgespan.html(myNum);
				//去掉 no-visible class
				badgespan.removeClass("no-visible");
			} else {
				badgespan.attr({
					'class':'ui-red-counter'
				});
				badgespan.html(1);
			}
		}
		
		//与某个人消息聊天界面 添加 消息体
		//addMessageMsg(MsgDivId,contact,data);
		console.log("appendNewFriendMsg end");
	};
	
	//发送方回显自己发送的消息
	var appendMsg2 = function(who, contact, message, chattype) {
		var MsgDivId = MessagePrefix+contact;
		addMessageMsg(MsgDivId,who,message);
		addRecordMsg(RecordPrefix+contact,contact,message);
	}

	var showAddFriend = function() {
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
		$('#addGroupId').val('群组账号');// 输入好友账号
		$('#add-group-warning').html("");
	};

	var showDelGroup= function() {
		$('#delGroupModal').modal('toggle');
		$('#delGroupId').val('群组账号');// 输入好友账号
		$('#del-group-warning').html("");


	};

	var showDestroyGroup= function() {
		$('#destroyGroupModal').modal('toggle');
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
			
			setTimeout(function() {
				$('#add-frident-warning').html(
				"");
			}, 2000);
			
		
			return;
		}
		if (bothRoster){
			for (var i = 0; i < bothRoster.length; i++) {
				if (bothRoster[i].name == user) {
					$('#add-frident-warning').html(
							"<font color='#FF0000'>已是您的好友</font>");

					}
				setTimeout(function() {
					$('#add-frident-warning').html(
					"");
				}, 2000);
					return;
				}
			}
		// 发送添加好友请求
		conn.subscribe({
			to : user,
			message : "加个好友呗-" + getLoacalTimeString()
		});
		//$('#addFridentModal').modal('hide');
		console.log("add friend start!");
	    var contents = "已成功发送申请信息给好友！";
	    $.fillTipBox({type:'info', icon:'glyphicon-info-sign', content:contents})
		//$('#add-frident-warning').html("<font color='#00FF00'>已成功发送申请信息给好友！</font>");
		$('#addfridentId').val("");
	    $('#add-frident-warning').html("");
		return;
	};

	// add by guoxun
	var startAddGroup = function() {
		var chatgroupname = $('#addGroupId').val();
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
        	async: false,  
        	type : "get",
        	dataType : "jsonp",
        	jsonp: "callbackparam", // 服务端用于接收callback调用的function名的参数
        	jsonpCallback: "success_jsonpCallback", // callback的function名称,服务端会把名称和data一起传递回来
        	data : {'chatgroupname': chatgroupname,
        		'userid': curUserId
        	},  
        	success : function(json) {
        	// alert('success');
        	console.log(json[0]);
        	console.log(json[0].msg);
        	}
         
        });
		$('#addGroupModal').modal('hide');
		return;
	};

	var startDelGroup = function() {
		var chatgroupname = $('#delGroupId').val();
		if (chatgroupname == '') {
			$('#del-group-warning').html(
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
        	url : WEBIM_URL+"/delgroup",  
        	async: false,  
        	type : "get",
        	dataType : "jsonp",
        	jsonp: "callbackparam", // 服务端用于接收callback调用的function名的参数
        	jsonpCallback: "success_jsonpCallback", // callback的function名称,服务端会把名称和data一起传递回来
        	data : {'chatgroupname': chatgroupname,
        		'userid': curUserId
        	},  
        	success : function(json) {
        	// alert('success');
        	console.log(json[0]);
        	console.log(json[0].msg);
        	}
         
        });
		

		$('#delGroupModal').modal('hide');


		return;
	};

	var startDestroyGroup = function() {
		var chatgroupname = $('#destroyGroupId').val();
		if (chatgroupname == '') {
			$('#destroy-group-warning').html(
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
        	url : WEBIM_URL+"/destroygroup",  
        	async: false,  
        	type : "get",
        	dataType : "jsonp",
        	jsonp: "callbackparam", // 服务端用于接收callback调用的function名的参数
        	jsonpCallback: "success_jsonpCallback", // callback的function名称,服务端会把名称和data一起传递回来
        	data : {'chatgroupname': chatgroupname,
        		'userid': curUserId
        	},  
        	success : function(json) {
        	// alert('success');
        	console.log(json[0]);
        	console.log(json[0].msg);
        	}
         
        });
		

		$('#destroyGroupModal').modal('hide');


		return;
	};

	var startCreateGroup = function() {
		var chatgroupname = $('#createGroupId').val();
		var chatgroupdesc = $('#createGroupDesc').val();
		var chatgroupmax = $('#createGroupMax').val(); 
		var chatgroupapproval = $('#createGroupApproval input[name="approval"]:checked').val();
		var chatgrouppub = $('#createGroupPub input[name="pub"]:checked').val();
		var chatgroupowner = curUserId;
		if (chatgroupname == '') {
			$('#create-group-warning').html(
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
		// //发送加入群组请求
		$.ajax({  
        	url : WEBIM_URL+"/creategroup",  
        	async: false,  
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
        	console.log(json[0]);
        	console.log(json[0].msg);
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
	var directDelFriend = function(Imname) {
		//var user = $('#delfridentId').val();
		var normal_name = formatReEase(Imname);
		console.log("in directDelFriend, Imname="+Imname);
		if (validateFriend(Imname, bothRoster)) {
			conn.removeRoster({
				to : Imname,
				success : function() {
					conn.unsubscribed({
						to : Imname
					});
					// 删除操作成功时隐藏掉dialog
					//$('#delFridentModal').modal('hide');
//					$("#"+Imname).remove();
					var father =deletefriendPrefix+normal_name;
                	var child = "friendhtml";
                    turnToHref(father,child);
                    console.log("on click concel button, delete friend success");
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


	var removeFriendDomElement = function(userToDel, local) {
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
			bothRoster.remove(contactToDel);
		}
		// 隐藏删除好友窗口
		if (local) {
			$('#delFridentModal').modal('hide');
		}
		// 删除通讯录
		$(document.getElementById(userToDel)).remove();
		//$('#' + userToDel).remove();
		// 删除聊天
		var recordDivId = RecordPrefix+userToDel;
		var recordDiv = $(document.getElementById(recordDivId));
		if (recordDiv) {
			recordDiv.remove();
		}
	
		
		//如果当前页面是与这个人消息聊天页面，即 class中包含 ui-page-active 则 不需要 增加 红色离线消息个数		
		if(judgeHasClass(MessagePrefix+userToDel,"ui-page-active")){
			var father = MessagePrefix+userToDel;
			var child = "msghome";
			turnToHref(father,child);
		}
		var chatDivId = MessagePrefix+userToDel;
		//var chatDiv = $('#' + chatDivId);
		
		var chatDiv = $(document.getElementById(chatDivId));
		if (chatDiv) {
			chatDiv.remove();
		}
		
//		if (curChatUserId != userToDel) {
//			return;
//		} else {
//			var displayName = '';
//			// 将第一个联系人作为当前聊天div
//			if (bothRoster.length > 0) {
//				curChatUserId = bothRoster[0].name;
////				$('#' + curChatUserId).css({
////					"background-color" : "#33CCFF"
////				});
//				
//				$(document.getElementById(curChatUserId)).css({
//				"background-color" : "#33CCFF"
//				});
//				
//				var currentDiv = getContactChatDiv(curChatUserId)
//						|| createContactChatDiv(curChatUserId);
//				document.getElementById(msgCardDivId).appendChild(currentDiv);
//				$(currentDiv).css({
//					"display" : "block"
//				});
//				displayName = '与' + curChatUserId + '聊天中';
//			} else {
//				$('#null-nouser').css({
//					"display" : "block"
//				});
//				displayName = '';
//				curChatUserId = null;
//			}
//			$('#talkTo').html('<a href="javascript:void(0)">' + displayName + '</a>');
//		}
	};

	// add by guoxun
	var removeGroupDomElement = function(groupToDel, local) {
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
	}
