//右栏查询好友
var SearchFriends = function(){
	var keyword = $(".friend_search_input").val();
	console.log(keyword);
	//修改前端搜索框背景
	if(!keyword){ 
		$(".friend_search_input").css("background","url(css/pc/images/search_icon.png) 80px no-repeat #fff");
		 if($(".friend_list_box_search").html()){
         	$(".friend_list_box_search").remove();
         }
		$(".friend_tab").show();
        $(".friend_list_box").show();
        $(".group_operation").show();
	    return;
	}
	if(keyword){ $(".friend_search_input").css("background","#fff");	}
    //从数据库中拉取所有好友
    $.ajax({
        type:"post",
        url:"/WCLnew/SearchEaseFriendsbykeyword",
        data:{hostname:curUserId,keyword:keyword},
        async:false, //同步
        success : function(data)
        {   
        	console.log(data);
        	
        	//前端操作
        	$(".friend_tab").hide();
            $(".friend_list_box").hide();
            $(".group_operation").hide();
            if($(".friend_list_box_search").html()){
            	$(".friend_list_box_search").remove();
            }
            /////前端添加搜索到的好友信息
            var FriendListBoxSearch = $("<div class='friend_list_box_search'></div>");
            $(".rtc_box_right").append(FriendListBoxSearch);
            var FriendListUL = $("<div id='list_friend_UL_search' class='friend_list_search'></div>");
            FriendListBoxSearch.append(FriendListUL);
            
            if(!data.easefriend.length){ 
            	var NullFriendText = $("<div style='text-align:center'>没有搜到匹配的好友</div>");
            	$(".friend_list_box_search").append(NullFriendText);
            	return; 
            }
            for(var i=0; i<data.easefriend.length; i++){
            	var friendname = data.easefriend[i].friendname;
                addPerSearchFriend(formatReEase(friendname));
            }         
        }
    });
};

//添加一个搜索到的好友（没有右键事件）
var addPerSearchFriend = function(friendname){
	var lielem = $('<li>').attr({
		'id' : "FriendListSearch" + friendname,
		'name' :friendname
	}).dblclick(function() {
        chooseContactDivClick(this);
	});
	var liImg = $("<div class='list_portrait'>"+
		    "<img src='css/pc/images/img/portrait65_2.jpg'/></div>");
	lielem.append(liImg);
	 
	var liName = $("<span class='friend_name'>"+ friendname +"</span>");
	lielem.append(liName);
	$('#list_friend_UL_search').append(lielem);
	
    //////////为我的每位好友添加右击菜单操作
	var RightClickMenu = $("<div id='pop_operationFriendListSearch"+ friendname +"' style='display:none;' class='friend_pop_operation'></div>");
	 $(document.body).append(RightClickMenu);
	
	var MenuUL = $("<ul></ul>");
	RightClickMenu.append(MenuUL);
	var MenuList1 = $("<li onclick='chooseContactDivClickBefore(\""+ friendname +"\")'>发送即时消息</li>");
	MenuUL.append(MenuList1);
	var MenuList2 = $("<li onclick=\"createCallAudioPageBefore\('"+ friendname + "'\);\">发起音频通话</li>");
	MenuUL.append(MenuList2);
	var MenuList3 = $("<li onclick=\"createCallVideoPageBefore\('"+ friendname + "'\);\">发起视频通话</li>");
	MenuUL.append(MenuList3);
	
	lielem.mousedown(function(e){
		if(e.which == 3){
	    //右击我的一个好友
		   console.log("右击我的好友:"+this.id);
		   var username = this.id.replace("FriendListSearch","");
		   document.oncontextmenu = function() {
			   return false;
		   };
		var RightClick = document.getElementById("pop_operationFriendListSearch"+username);
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
};

//环信拉取所有好友(暂时还没用)
var EaseGetFriends = function(ownerhostname){
	 $.ajax({  
	        url : WEBIM_URL+"/getfriends",  
	        async: true,  
	        type : "get",
	        dataType : "jsonp",
	        jsonp: "callbackparam", // 服务端用于接收callback调用的function名的参数
	        jsonpCallback: "success_jsonpCallback", // callback的function名称,服务端会把名称和data一起传递回来
	        data : {
	            'ownerusername':ownerhostname
	        },  
	        success : function(json) {
	            // var contents = json[0].msg;
	            console.log(json);
	        }  
	    });
};

//删除EaseFriend好友记录
var DeleteEaseFriendDB = function(hostname,friendname){
	 $.ajax({  
	        url : "WClnew/DelEaseFriend",  
	        type : "get",
	        async:false, //同步
	        data : {
	            'hostname':hostname,
	            'friendname':friendname
	        },  
	        success : function(json) {
	            // var contents = json[0].msg;
	            console.log(json);
	        }  
	    });
};

//添加EaseFriend好友记录
var AddEaseFriendDB = function(hostname,friendname){
	 $.ajax({  
	        url : "WClnew/AddEaseFriend",  
	        type : "get",
	        async:false, //同步
	        data : {
	            'hostname':hostname,
	            'friendname':friendname
	        },  
	        success : function(json) {
	            // var contents = json[0].msg;
	            //console.log(json);
	        }  
	    });
};