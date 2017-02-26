
//显示一组成员联系人分组显示,
function showContactGroup(groupName, groupMember){
	var htmlInside = [];
	var groupMembers = [];
	//在这里根据groupName判断一下是不是根组“我的联系人”,如果是根组则无操作
	var is_root=false;
	if(groupName=="我的联系人")
		{
		is_root=true;
		}
	
	if(is_root){
		htmlInside[0] = "<div><div class=\"greyletter groupname leftfloat\">"+groupName+"</div>"+
						"<div class=\"clear\"></div></div>";
	}else{
			var operation = "<ul><li><a class=\"greyletter nodecoration rightmargin_5 bigsize\" href=\"javascript:void(0)\">...</a>"+
							"<ul>"+
							"<li class=\"padding715 dottedline\"><a class=\"greyletter\" href=\"basic/_editContactGroupInfo.jsp\" rel=\"facebox\" size=\"s\" title=\"编辑信息\" onclick=\"writeIntoMark('"+groupName+"')\">编辑信息</a></li>"+
							"<li class=\"padding715\"><a class=\"greyletter\" href=\"javascript:void(0)\" onclick=\"deleteContactGroupFn('"+groupName+"')\">删除群组</a></li>"+
							"</ul></li></ul>";
			htmlInside[0] = "<div><div class=\"greyletter groupname leftfloat\">"+groupName+"</div>"+
							"<div class=\"rightfloat webwidget_vertical_menu_temp\">"+operation+"</div>"+
							"<div class=\"clear\"></div></div>";
	}
	
	for(var i = 0; i < groupMember.length; i++){
		
		var name = groupMember[i].userName;
		//判断
		if( name.indexOf('@') != -1){
			name = name.replace('@','-');
		}		
		
		
		
		groupMembers[i] = "<div class=\"groupmembertemp\" name=\""+name+"\">";
		
		if(groupMember[i].avatar != undefined){
			groupMembers[i] += "<img src='"+groupMember[i].avatar+"' height=\"30px\" width=\"30px\"  class=\"leftfloat\"/>";
		}
		// m: var friendAccountId = emailToUserId(groupMember[i].email);
		
		//modify,如果qq,email,phone为空的判断。。。
		
		var email=groupMember[i].email;
		var qqNumber=groupMember[i].qq;
		var phone=groupMember[i].phone;
		//没有写邮箱，也不是好友，也不能发起会话，会在发起webrtc会话时提醒。
		var qqHtml="";
		if(qqNumber!=""&&qqNumber!="null")
		{
			qqHtml="<a class=\"greyletter\" href=\"tencent://message/?uin="+qqNumber+"\" target=\"_blank\">发起qq会话</a></li>";
		}
		else{
			qqHtml = "<a href=\"javascript:void(0)\" onclick=\"alert('该联系人没有填写QQ号码');\" class=\"greyletter\" >发起qq会话</a></li>";
		}

		//
		var emailHtml="";
		if(email!=""&&email!="null")
		{
			emailHtml ="<a class=\"greyletter\" href=\"mailto:"+ email+"\" target=\"_blank\" >发电子邮件</a></li>";
		}
		else{
			emailHtml ="<a class=\"greyletter\" href=\"javascript:void(0)\" onclick=\"alert('该联系人没有填写email邮箱');\" >发电子邮件</a></li>";

		}


		//webrtc  
		var webrtcHtml="";
		if(email!=""&&email!="null")
		{
		var friendAccountId = emailToUserId(email);
		webrtcHtml="<a class=\"greyletter\"  href=\"javascript:void(0)\" onclick=\"contactStartFriendDialog('"+friendAccountId+"','"+groupMember[i].avatar+"')\">webrtc会话</a></li>";
		}
		else{
			webrtcHtml= "<a class=\"greyletter\" href=\"javascript:void(0)\" onclick=\"alert('该联系人不是webrtc好友！');\" >webrtc会话</a></li>";

		}//
		
		//contact operation
		var operation = "<ul><li><a class=\"greyletter nodecoration leftmargin_5\" href=\"javascript:void(0)\">▼</a>"+
						"<ul>"+
						"<li class=\"padding715 dottedline\"><a class=\"greyletter\" href=\"basic/_editContactInfo.jsp\" onclick=\"writeIntoMark('"+groupMember[i].userId+"')\" rel=\"facebox\" size=\"s\" title=\"编辑信息\">编辑信息</a></li>"+
						"<li class=\"padding715 dottedline\"><a class=\"greyletter\" href=\"javascript:void(0)\" onclick=\"deleteContactFn('"+groupMember[i].userId+"')\">删除联系人</a></li>"+
						"<li class=\"padding715 dottedline\">"+emailHtml+
						"<li class=\"padding715 dottedline\">"+webrtcHtml+
						"<li class=\"padding715 \">"+qqHtml+
						"</ul></li></ul>";
		groupMembers[i] += "<div class=\"leftfloat padding5\">"+groupMember[i].userName+"</div>"+
							"<div class=\"rightfloat webwidget_vertical_menu_temp\">"+operation+"</div>"+
							"<div class=\"clear\"></div></div>";
	}
	htmlInside[1] = groupMembers.join("");
	var htmlInsideSum = htmlInside.join("");
	$("#frloading").hide();
	$("#realcontact").append(htmlInsideSum);
	$(".groupmembertemp").attr('class', 'padding5 groupmember');
}

//搜索联系人，在联系人列表中找，
function searchContact(){	
	//alert("here");
	var searchContactList = contactNameList; 
	console.log(searchContactList);
	if(searchContactList.length > 0){
		var searchTip = $('#searchcontact input').val(); //获取搜索框值，按名字搜索联系人
		var groupName = "搜索结果";//新建一组搜索结果
		var groupMember = [];
		for(var i = 0; i < searchContactList.length; i++){
			if(searchTip != '' && searchContactList[i].userName.match(searchTip)){
				groupMember[i] = {
					name:searchContactList[i].userName,
					id:searchContactList[i].userId
				};
			}
		}
		$('#search').remove();
		$('#searchmember').remove();
		if(searchTip != ''){
			optionSpecialGroup(groupName, 'search', 'add', groupMember);
			if(groupMember.length == 0){
				$('#searchmember').html('<div class="padding715 centeralign redletter">没有搜索到任何联系人</div>');
			}
		}
	}
}


//add js
//验证qq号码
	   	function checkQqIllegalFn(checkId,tipId)
			{
				var checkValue = $("#"+checkId).val();
				var check = new RegExp(/^[1-9][0-9]{4,11}$/).test(checkValue);	 //qq号码从10000开始最多11位
				if(!check){
					$("#"+tipId).html("格式错误");
					return false;
				}else{
				$("#"+tipId).html("√");
				return true;	
					}

			}
	
		
/*
//验证手机号码
		function checkPhoneIllegalFn(checkId,tipId)
		{
			var checkValue = $("#"+checkId).val();
			var check = new RegExp(/^1[3|4|5|8][0-9]\d{4,8}$/).test(checkValue);	
			if(!check){
				$("#"+tipId).html("格式错误");
				return false;
			}else{
				$("#"+tipId).html("√");
				return true;	
			}

		}
		
		*/
	  //验证手机号码
		function checkPhoneIllegalFn(checkId,tipId)
		{
			var checkValue = $("#"+checkId).val();
			var check = new RegExp(/^1[3|4|5|8][0-9]\d{8}$/).test(checkValue);	
			if(!check){
				$("#"+tipId).html("格式错误");
				return false;
			}else{
				$("#"+tipId).html("√");
				return true;	
			}

		}
		
//邮件字段
	function checkEmailFn(checkId,tipId)
	{
		//先检查是否为空，为空则不作
		var checkValue = $("#"+checkId).val();
		if(!checkValue || checkValue == ""){
			
			$("#"+tipId).html("√");
			return true;	
		}
		else{
			var check = new RegExp(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/).test(checkValue);	
			if(!check){
				$("#"+tipId).html("格式错误");				
				return false;
			}else{
				$("#"+tipId).html("√");
				return true;	
			}
		}
	}

	//qq字段检查
	function checkQqFn(checkId,tipId)
	{
		//先检查是否为空，为空则不作
		var checkValue = $("#"+checkId).val(); 
		if(!checkValue || checkValue == ""){
			//var errorTip = "该项不能为空";
			$("#"+tipId).html("√");
			//为空，不做任何操作
			return true;
		}else{
			//不为空，则检查合法性。
			checkQqIllegalFn(checkId,tipId);
			//$("#"+tipId).html("√");
			//return true;
		}
	}
	//phone字段检查
	function checkPhoneFn(checkId,tipId)
	{
		//先检查是否为空，为空则不作
		var checkValue = $("#"+checkId).val();
		if(!checkValue || checkValue == ""){
			//var errorTip = "该项不能为空";
			$("#"+tipId).html("√");
			//为空，不做任何操作
			return true;
		}else{
			//不为空，则检查合法性。
			checkPhoneIllegalFn(checkId,tipId);
			//$("#"+tipId).html("√");
			//return true;
		}
	}
	