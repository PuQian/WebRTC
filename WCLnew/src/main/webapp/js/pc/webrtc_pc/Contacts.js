var ContactGroupsPrefix = "ContactGroups";
var ContactGroupPrefix = "ContactGroup";
var GroupContactsPrefix = "GroupContacts";
var GroupContactsListPrefix = "GroupContactsList";
var GroupContactsListULPrefix = "GroupContactsListUL";
var GroupContactsListLIPrefix = "GroupContactsListLi";
var findcontact = new Array();
var findgroup = false;
var findSingleContact = new Array();

//点击通信录按钮
var showContactGroupList = function() {
	document.getElementById("onContact").setAttribute("class","on");
	document.getElementById("onGroup").removeAttribute("class");
	document.getElementById("onFriend").removeAttribute("class");
	$('#list_contact').show();
	$('#list_friend').hide();
	$('#list_group').hide();
}

//显示添加分组模态框
var showAddContactGroup = function() {
	console.log("show addContactGroup");
	$('#addContactGroupModal').modal('toggle');
	$('#addContactGroupId').val('分组名称');// 输入好友账号
	$('#add-contactgroup-warning').html("");
};

//显示分组编辑模态框
var ShowContactGroupModal = function(groupName,groupId){
	$("#contactGroupModal .modal-title").text(groupName);
	$("#contactGroupModal .modal-group-id").val(groupId)
	console.log("ShowContactGroupModal");
	$("#contactGroupModal").modal('show');
}

//添加分组
var startAddContactGroup = function() {
	var userId = $('.pub_banner').attr("userid");
	var groupName = $('#addContactGroupId').val().trim();
	console.log("userId + groupName="+userId+groupName);

	$.ajax({
		type:"post",
		url:"/Contacts/api/groupship/addgroup",
		data:{
			userId:userId,
			groupName:groupName,
		},
		success : function(data)
		{
			$('#addContactGroupModal').modal('hide');
			var contactGroupToAdd = data.group;
			buildContactGroupDiv("list_contact",contactGroupToAdd.id,contactGroupToAdd.groupName);
			OnAddContactGroupSuccess();
		}
	
	});
}

//显示分组，根据用户id查询所有分组
var FindContactGroupList = function(){

	if(findgroup==false){
	console.log("FindContactGroupList");
	var userId  = $('.pub_banner').attr("userid");
	console.log("FindContactGroupList,userId="+userId);
	$.ajax({
		type:"post",
		url:"/Contacts/api/groupship/groups",
		data:{
			userId:userId,
		},
		success : function(data)
		{
			if(data.result == "success"){
				if (data.groups.length > 0) {
			
					//从数据库中拉取过来的分组
					for ( i=0; i< data.groups.length; i++) {
						var contactGroup = data.groups[i];
						console.log(contactGroup);
						buildContactGroupDiv("list_contact",contactGroup.id,contactGroup.groupName);
						findgroup=true;
					}
				}
				
			}	
		}
	});
}
	showContactGroupList();
}
//删除分组
var startDelContactGroup = function(groupId){
//	var groupId = $("#contactGroupModal .modal-group-id").val();
	
	$.ajax({
		type:"post",
		url:"/Contacts/api/groupship/delgroup",
		data:{
			id:groupId,
		},
		success : function(data)
		{
			if(data.result=="success"){
				contactGroupsToDel = $("#"+ContactGroupsPrefix+groupId);
				contactGroupsToDel.remove();
				$("#GroupBox"+groupId).remove();
				OnDelContactGroupSuccess();
			}
		}
	
	});
}

//显示修改分组界面
var showModContactGroupPage = function(groupId){
	
//	if(globalCur!=null){
//		   document.getElementById(globalCur).setAttribute("style","display:none;");
//		}
//	var modContactGroupDiv = $("#modcontactgroup");
//	$("#web").append(modContactGroupDiv);
//	document.getElementById("modcontactgroup").setAttribute("style","display:block;");
//	globalCur="modcontactgroup";
	var groupNameToMod =$("#GroupBox"+groupId).find(".friend_h2").find("#name"+groupId).html();
	console.log("groupName"+groupNameToMod);
	var groupIdToMod = groupId;
	var modcontactgroup="modcontactgroup"+groupIdToMod;
	  
	  resetPosition()
	  if(t < 0){t = 30;}
	  if(l < 0){l = 60;}
	    
	  var groupContactInfoDiv = document.createElement("div");
	  groupContactInfoDiv.setAttribute("id", modcontactgroup);
	  document.body.appendChild(groupContactInfoDiv);

	  $(groupContactInfoDiv).attr('class', 'edit_data_pop mod');
	  $(groupContactInfoDiv).css({'position':'absolute', 'top':t-250+'px', 'left':l-230+'px'});
	  $(groupContactInfoDiv).css({'z-index':count++});
	  $(groupContactInfoDiv).show();
	  $(groupContactInfoDiv).click(function(){            //当用鼠标点击该对话框时，该对话框到最上面
	    count++;
	    $(this).css({'z-index':count});
	  });
	  
	  var HeadInfor=$("<table class='edit_data_title'><tr><td style='width:440px;' id="+'mod'+groupIdToMod+"><h2>修改分组名称</h2></td>"+
	      "<td><i class='close_pop' onclick=\"closeModContactGroupPage\('"+groupIdToMod+"'\)\"></i></td></tr></table>");
	  
	  $(groupContactInfoDiv).append(HeadInfor);
	
	  var bodyInfor=$("<div class='edit_data_table'><div style='overflow: auto;'>"+
		      " <input type='hidden' name='groupId' id='contactgroupId' value="+groupIdToMod+">"+
		      "<table><tr><th>分组名称</th><td><input name='' type='text' class='edit_input' id='contactgroupName' value="+groupNameToMod+"></td></tr>"+
		      "<tr><th> </th><td><input type='button' value='确定' class='btn_blue' onclick=\"startModContactGroup\('"+groupIdToMod+"'\)\">"+
		   "<input type='button' value='取消' class='btn_red' onclick=\"closeModContactGroupPage\('"+groupIdToMod+"'\)\"></td></tr></table></div></div>");
		  
		  $(groupContactInfoDiv).append(bodyInfor);

		  var infordragClass='mod'+groupIdToMod; //设置窗口可拖拽
		  console.log(infordragClass);
		  $("#mod"+groupIdToMod).attr('class', infordragClass);
		  dragWindow(infordragClass, groupContactInfoDiv);
	
}

//修改分组
var startModContactGroup = function(groupIdToMod){
	var groupId =groupIdToMod;
	var userId = $('.pub_banner').attr("userid");
	var groupName = $("#modcontactgroup"+groupId).find("#contactgroupName").val();
	
	$.ajax({
		type:"post",
		url:"/Contacts/api/groupship/modgroup",
		data:{
			id:groupId,
			userId:userId,
			groupName:groupName,
		},
		success : function(data)
		{
			if(data.result=="success"){
				contactGroupsNameToMod = $("#"+ContactGroupPrefix+groupId);
				contactGroupsNameToMod.html(groupName);
				$("#GroupBox"+groupId).remove();
				findcontact.remove(groupId);
				buildContactGroupDiv("list_contact",groupId,groupName);
				console.log(groupName);
				closeModContactGroupPage(groupId);
				OnModContactGroupSuccess();
			}
		}
	});
}

//关闭修改分组页面
var closeModContactGroupPage = function(groupId){
	$("#modcontactgroup"+groupId).remove();
//	globalCur=null;
	console.log("closeModContactGroupPage");
}

//关闭联系人信息页面
var closeContactGroupInfo = function(contactId,remove){
	$("#groupContactInfo"+contactId).remove();
	$(remove).attr('class','0');
//	globalCur=null;
//	console.log("closeGroupContactInfoPage");
}

//关闭修改联系人信息界面
var closeModGroupContactInfoPage = function(){
	$("#modGroupContactInfo").hide();
	globalCur=null;
	console.log("closeModGroupContactInfoPage");
}

//关闭修改联系人信息界面
var closeAddGroupContactInfoPage = function(groupId){
	$("#addGroupContactInfo"+groupId).remove();
//	globalCur=null;
	console.log("closeAddGroupContactInfoPage");
}

//添加分组成功提醒
var OnAddContactGroupSuccess = function(){
    console.log("add contactgroup success!");
    var contents = "添加分组成功!";
    $.fillTipBox({type:'info', icon:'glyphicon-info-sign', content:contents})
}

//删除分组成功提醒
var OnDelContactGroupSuccess = function(){
    console.log("del contactgroup success!");
    var contents = "删除分组成功!";
    $.fillTipBox({type:'info', icon:'glyphicon-info-sign', content:contents})
}

//修改分组成功提醒
var OnModContactGroupSuccess = function(){
    console.log("mod contactgroup success!");
    var contents = "修改分组成功!";
    $.fillTipBox({type:'info', icon:'glyphicon-info-sign', content:contents})
}

//删除分组成功提醒
var OnDelGroupContactSuccess = function(){
	console.log("del groupcontact success!");
    var contents = "删除联系人成功!";
    $.fillTipBox({type:'info', icon:'glyphicon-info-sign', content:contents})
}

//修改联系人信息成功提醒
var OnModGroupContactSuccess = function(){
    console.log("mod groupcontact success!");
    var contents = "修改联系人信息成功!";
    $.fillTipBox({type:'info', icon:'glyphicon-info-sign', content:contents})
}

//添加联系人成功提醒
var OnAddGroupContactSuccess = function(){
    console.log("add groupcontact success!");
    var contents = "添加联系人成功!";
    $.fillTipBox({type:'info', icon:'glyphicon-info-sign', content:contents})
}

//构造分组列表
var buildContactGroupDiv = function(contactGroupDiv,groupId,groupName){	
	console.log("buildContactGroupDiv start");
    var GroupBox = document.createElement("div");
    GroupBox.setAttribute("id", "GroupBox"+ groupId);
   
    var ContactGroup = $("<h2 class='friend_h2' onclick='FindGroupContactsList(\"" + groupId + "\");'>"+
    		             "<i id = "+ groupId + " class='ul_close'></i><span id='name"+groupId+"'>"+groupName+"</span></h2>");
    	  
    
	$(GroupBox).append(ContactGroup);
	$("#list_contact").append(GroupBox);
	

//////////为每个组添加右击菜单操作
	var RightClickMenu = $("<div id='group_operation"+ groupId +"' style='display:none;' class='friend_pop_operation'></div>");
	 $(document.body).append(RightClickMenu);
	//"+groupId+","+groupName+"
	var MenuUL = $("<ul></ul>");
	RightClickMenu.append(MenuUL);
//	var MenuList1 = $("<li onclick=\"showModContactGroupPage(\'"+groupName+"\'"+","+groupId+")\">修改分组</li>");
	var MenuList1 = $("<li onclick=showModContactGroupPage("+groupId+")>修改分组</li>");
	MenuUL.append(MenuList1);
	var MenuList2 = $("<li onclick=startDelContactGroup("+groupId+")>删除分组</li>");
	MenuUL.append(MenuList2);
	var MenuList3 = $("<li onclick=showAddGroupContactPage("+groupId+")>添加联系人</li>");
	MenuUL.append(MenuList3);
	
	ContactGroup.mousedown(function(e){
		if(e.which == 3){
	    //右击我的一个好友
		   console.log("右击我的好友:"+this.id);
		   var username = this.id.replace("FriendList","");
		   document.oncontextmenu = function() {
			   return false;
		   }
		var RightClick = document.getElementById("group_operation"+groupId);
		//$(RightClick).hide();
//		$(this).parent().parent().parent().parent().parent().parent().children("div[class='friend_pop_operation']").hide();
		$(document.body).children("div[class='friend_pop_operation']").hide();
		
		$(RightClick).attr("style","display: block;  position:absolute; z-index:100; top:" + e.pageY + "px; left:" + e.pageX + "px;");
		$(RightClick).show();
		$("body").click(function(e) {
			$(RightClick).hide();
		});
		
		}
		
	});
	
}

var FindGroupContactsListAvailable = function(groupId){
	for(var i=0;i<findcontact.length;i++){
		if(findcontact[i]==groupId){
			return true;
		}
		
	}
	return false;
}
var FindSingleContactAvailable = function(contactId){
	for(var i=0;i<findSingleContact.length;i++){
		if(findSingleContact[i]==contactId){
			return true;
		}
		
	}
	return false;
}

//显示好友，根据分组id查询分组的好友
var FindGroupContactsList = function(groupId){
	var isAvailable=FindGroupContactsListAvailable(groupId);
	console.log("isAvailable="+isAvailable);
	
	var Classi = $(document.getElementById(groupId)).attr("class");
	console.log("********************"+Classi);
	if(isAvailable==true){ //拉取过分组信息
	     if (Classi == "ul_open") {// 隐藏分组
		    $(document.getElementById(groupId)).attr("class","ul_close");
			var ContactUL = document.getElementById("contactlist" + groupId);
			ContactUL.setAttribute("style","display:none;");
		 }
	     if(Classi == "ul_close"){//显示分组
	    	 $(document.getElementById(groupId)).attr("class","ul_open");
	    	 var ContactUL = document.getElementById("contactlist" + groupId);
	    	 ContactUL.setAttribute("style","display:block;");
	     }
	}
	
	if(isAvailable==false){//没有从数据库中拉取该分组信息(分组里没有联系人)
		if (Classi == "ul_open") {// 隐藏分组
		    $(document.getElementById(groupId)).attr("class","ul_close");
		    return;
		}
		 $(document.getElementById(groupId)).attr("class","ul_open");
	console.log("groupId="+groupId);
	$.ajax({
		type:"post",
		url:"/Contacts/api/contactship/contacts",
		data:{
			groupId:groupId,
		},
		success : function(data)
		{
			if(data.result == "success"){
				console.log(data);
				console.log("FindGroupContactsList success");
				if (data.contacts.length > 0) {
					//从数据库中拉取过来的分组
					for (var i=0; i< data.contacts.length; i++) {
						var groupContact = data.contacts[i];
						var GroupBox = $(document.getElementById("GroupBox"+groupId));
						var ContactUL = $("<ul id='contactlist"+ groupId +"' class='friend_list'></ul>");
						GroupBox.append(ContactUL);
						
						buildGroupContactDiv(groupContact);						
				    }
					findcontact.push(data.groupId);
				}
			}	
		}
	});
}
}
//构造联系人列表
var buildGroupContactDiv = function(groupContact){
	console.log("groupContact.groupId="+groupContact.groupId);
	var conId=groupContact.id;
//	var contactGroupUl = document.getElementById(GroupContactsListULPrefix+groupContact.groupId);
	var ContactUL = $(document.getElementById("contactlist" + groupContact.groupId));
	var groupContactLi = $("<li class='0' id="+conId+"><div class='list_portrait'><img src='css/pc/images/img/portrait65_2.jpg'/></div>"+
               "<span class='friend_name'>"+groupContact.lname+groupContact.fname+"</span></li>").click(function(){
            	  console.log($(groupContactLi).attr('class')!=0);
            	   if($(groupContactLi).attr('class')==1){
            		  $('#groupContactInfo'+groupContact.id).remove();
            		  
            		  console.log($(groupContactLi).attr('class'));
            	  }
            		  showGroupContactInfo(this); 
            		  $(groupContactLi).attr('class','1');
            	  });
	
//	var groupContactLi = $("<li class=\"li_style\" displayname="+groupContact.nc
//		+" classname=\"offline\" class=\"offline\" id="+GroupContactsListLIPrefix+groupContact.id+
//		" type=\"chat\"></li>")
//	.click(function(){
//		showGroupContactInfo(this);
//	});
	
//	var groupContactAvater = $("<img src=\"img/head/contact_normal.png\">");
	var groupContactInfoSpan = $(
//			"<span id=\"lishow\">"+groupContact.lname+groupContact.fname+"</span>"+
			"<span id=\"contactNc\" class=\"hidden\">"+groupContact.nc+
			"</span><span id=\"contactId\" class=\"hidden\">"+groupContact.id+
			"</span><span id=\"contactLname\" class=\"hidden\">"+groupContact.lname+
			"</span><span id=\"contactFname\" class=\"hidden\">"+groupContact.fname+
			"</span><span id=\"contactSex\" class=\"hidden\">"+groupContact.sex+
			"</span><span id=\"contactBirth\" class=\"hidden\">"+groupContact.birth+
			"</span><span id=\"contactZw\" class=\"hidden\">"+groupContact.zw+
			"</span><span id=\"contactBm\" class=\"hidden\">"+groupContact.bm+
			"</span><span id=\"contactTelp\" class=\"hidden\">"+groupContact.telp+
			"</span><span id=\"contactMobp\" class=\"hidden\">"+groupContact.mobp+
			"</span><span id=\"contactEmails\" class=\"hidden\">"+groupContact.emails+
			"</span><span id=\"contactAddress\" class=\"hidden\">"+groupContact.address+
			"</span><span id=\"contactPostcode\" class=\"hidden\">"+groupContact.postcode+
			"</span><span id=\"contactGroupId\" class=\"hidden\">"+groupContact.groupId+
			"</span><span id=\"contactBz\" class=\"hidden\">"+groupContact.bz+"</span>");
//	groupContactLi.append(groupContactAvater);
	groupContactLi.append(groupContactInfoSpan);
	
	ContactUL.append(groupContactLi);
	console.log("buildGroupContactDiv success");
}

//显示联系人信息
var showGroupContactInfo = function(groupContactLi){
	var remove=groupContactLi;
	var contactId = $(groupContactLi).find("#contactId").html();

	var friendId = $(groupContactLi).find(".friend_name").html();
	var groupContactInfo='groupContactInfo'+contactId;
	
	var contactGroupId = $(groupContactLi).find("#contactGroupId").text();

	var contactLname = $(groupContactLi).find("#contactLname").text();
	
	var contactFname = $(groupContactLi).find("#contactFname").text();
	
	var contactSex = $(groupContactLi).find("#contactSex").text();
	
	var contactNc = $(groupContactLi).find("#contactNc").text();
	
	var contactBirth = $(groupContactLi).find("#contactBirth").html();
	
	
	var contactZw = $(groupContactLi).find("#contactZw").html();
	
	var contactBm = $(groupContactLi).find("#contactBm").html();
	
	var contactTelp = $(groupContactLi).find("#contactTelp").html();
	
	var contactMobp = $(groupContactLi).find("#contactMobp").html();
	
	var contactEmails = $(groupContactLi).find("#contactEmails").html();
	
	var contactAddress = $(groupContactLi).find("#contactAddress").html();
	
	var contactPostcode = $(groupContactLi).find("#contactPostcode").html();
	
	var contactBz = $(groupContactLi).find("#contactBz").html();
	
	
	
	resetPosition()
	if(t < 0){t = 30;}
	if(l < 0){l = 60;}
    
	var groupContactInfoDiv = document.createElement("div");
	groupContactInfoDiv.setAttribute("id", groupContactInfo);
	document.body.appendChild(groupContactInfoDiv);

	$(groupContactInfoDiv).attr('class', 'edit_data_pop');
	$(groupContactInfoDiv).css({'position':'absolute', 'top':t-300+'px', 'left':l-350+'px'});
	$(groupContactInfoDiv).css({'z-index':count++});
	$(groupContactInfoDiv).show();
	$(groupContactInfoDiv).click(function(){      			//当用鼠标点击该对话框时，该对话框到最上面
		count++;
		$(this).css({'z-index':count});
	});
	
	var HeadInfor=$("<table class='edit_data_title'><tr><td style='width:440px;' id="+'inforMove'+contactId+"><h2>联系人信息</h2></td>"+
			"<td><i class='close_pop' onclick=\"closeContactGroupInfo\('"+contactId+"','"+remove+"'\)\"></i></td></tr></table>");
	
	$(groupContactInfoDiv).append(HeadInfor);
	
	var bodyInfor=$("<div class='edit_data_table'><div style='overflow: auto;'>"+"<input type='hidden' name='contactId' id='contact_contactId' value="+contactId+">"+
			" <input type='hidden' name='groupId' id='contact_groupId' value="+contactGroupId+">"+
			"<table><tr><th> 姓：</th><td><input name='' type='text' class='edit_input' id='contactLname' value="+contactLname+"></td></tr>"+
			"<tr><th> 名：</th><td><input name='' type='text' class='edit_input' id='contactFname' value="+contactFname+"></td></tr>"+
			"<tr><th> 性别：</th><td><input name='' type='text' class='edit_input' id='contactSex' value="+contactSex+"></td></tr>"+
			"<tr><th> 昵称：</th><td><input name='' type='text' class='edit_input' id='contactNc' value="+contactNc+"></td></tr>"+
			"<tr><th> 生日：</th><td><input name='' type='text' class='edit_input' id='contactBirth' value="+contactBirth+"></td></tr>"+
			"<tr><th> 职务：</th><td><input name='' type='text' class='edit_input' id='contactZw' value="+contactZw+"></td></tr>"+
			"<tr><th> 部门：</th><td><input name='' type='text' class='edit_input' id='contactBm' value="+contactBm+"></td></tr>"+
			"<tr><th> 办公电话：</th><td><input name='' type='text' class='edit_input' id='contactTelp' value="+contactTelp+"></td></tr>"+
			"<tr><th> 手机：</th><td><input name='' type='text' class='edit_input' id='contactMobp' value="+contactMobp+"></td></tr>"+
			"<tr><th> 邮箱：</th><td><input name='' type='text' class='edit_input' id='contactEmails' value="+contactEmails+"></td></tr>"+
			"<tr><th> 通信地址：</th><td><input name='' type='text' class='edit_input' id='contactAddress' value="+contactAddress+"></td></tr>"+
			"<tr><th> 邮政编码：</th><td><input name='' type='text' class='edit_input' id='contactPostcode' value="+contactPostcode+"></td></tr>"+
			"<tr><th> 备注：</th><td><input name='' type='text' class='edit_input' id='contactBz' value="+contactBz+"></td></tr>"+
			"<tr><th> </th><td><input type='button' value='修改信息' class='btn_blue' onclick=\"startModGroupContact\('"+contactId+"'\)\">"+
   "<input type='button' value='删除联系人' class='btn_red' onclick=\"startDelGroupContact\('"+contactId+"'\)\"></td></tr></table></div></div>");
	
	$(groupContactInfoDiv).append(bodyInfor);
	

	var infordragClass='infor'+contactId;	//设置窗口可拖拽
	console.log(infordragClass);
	$("#inforMove"+contactId).attr('class', infordragClass);
	dragWindow(infordragClass, groupContactInfoDiv);
	
	
	
	
//	if(globalCur!=null){
//		   document.getElementById(globalCur).setAttribute("style","display:none;");
//		}
//	var groupContactInfoDiv = $("#groupContactInfo");
//	$("#web").append(groupContactInfoDiv);
//	document.getElementById("groupContactInfo").setAttribute("style","display:block;");
//	globalCur="groupContactInfo";
}

//删除联系人
var startDelGroupContact = function(contactId){
	var contactId = $("#groupContactInfo"+contactId+" #contact_contactId").val();

	$.ajax({
		type:"post",
		url:"/Contacts/api/contactship/delcontact",
		data:{
			id:contactId,
		},
		success : function(data)
		{
			if(data.result=="success"){
				groupContactToDel = $("#"+GroupContactsListLIPrefix+contactId);
				groupContactToDel.remove();
				$("#groupContactInfo"+contactId).remove();
				$('#'+contactId).remove();
				OnDelGroupContactSuccess();	
			}
		}
	});
}

//修改联系人
var startModGroupContact = function(contactId){
	
	var modcontactId =contactId;
	console.log(modcontactId);
	var modcontactGroupId = $("#groupContactInfo"+modcontactId).find("#contact_groupId").val();
	console.log("#groupContactInfo"+modcontactId);
	
	var modcontactLname = $("#groupContactInfo"+modcontactId).find("#contactLname").val();
	console.log(modcontactLname);
	
	var modcontactFname = $("#groupContactInfo"+modcontactId+" #contactFname").val();
	console.log(modcontactFname);
	
	var modcontactSex = $("#groupContactInfo"+modcontactId+" #contactSex").val();
	console.log(modcontactSex);
	
	var modcontactNc = $("#groupContactInfo"+modcontactId+" #contactNc").val();
	console.log(modcontactNc);
	
	var modcontactBirth =$("#groupContactInfo"+modcontactId+" #contactBirth").val();
	console.log(modcontactBirth);
	
	var modcontactZw = $("#groupContactInfo"+modcontactId+" #contactZw").val();
	console.log(modcontactZw);
	
	var modcontactBm = $("#groupContactInfo"+modcontactId+" #contactBm").val();
	console.log(modcontactBm);
	
	var modcontactTelp = $("#groupContactInfo"+modcontactId+" #contactTelp").val();
	console.log(modcontactTelp);
	
	var modcontactMobp = $("#groupContactInfo"+modcontactId+" #contactMobp").val();
	console.log(modcontactMobp);
	
	var modcontactEmails = $("#groupContactInfo"+modcontactId+" #contactEmails").val();
	console.log(modcontactEmails);
	
	var modcontactAddress = $("#groupContactInfo"+modcontactId+" #contactAddress").val();
	console.log(modcontactAddress);
	
	var modcontactPostcode = $("#groupContactInfo"+modcontactId+" #contactPostcode").val();
	console.log(modcontactPostcode);
	
	var modcontactBz = $("#groupContactInfo"+modcontactId+" #contactBz").val();
	
	$.ajax({
		type:"post",
		url:"/Contacts/api/contactship/modcontact",
		data:{
			id:modcontactId,
			lname:modcontactLname,
			fname:modcontactFname,
			sex:modcontactSex,
			nc:modcontactNc,
			birth:modcontactBirth,
			zw:modcontactZw,
			bm:modcontactBm,
			telp:modcontactTelp,
			mobp:modcontactMobp,
			emails:modcontactEmails,
			address:modcontactAddress,
			postcode:modcontactPostcode,
			groupId:modcontactGroupId,
			bz:modcontactBz,
			
			
		},
		success : function(data)
		{
			if(data.result=="success"){
//				closeModGroupContactInfoPage();
				
				var modContact = data.contact;
				console.log(modContact);
				var contactId = modContact.id;
				console.log(contactId);
				$('#groupContactInfo'+contactId).find("div[id='contact_contactId']").val(contactId);
				
				var contactLname = modContact.lname;
				$('#groupContactInfo'+contactId).find("div[id='contactLname']").val(contactLname);
				
				var contactFname = modContact.fname;
				$('#groupContactInfo'+contactId).find("div[id='contactFname']").val(contactFname);
				
				var contactSex = modContact.sex;
				$('#groupContactInfo'+contactId).find("div[id='contactSex']").val(contactSex);
				
				var contactBirth = modContact.birth;
				$('#groupContactInfo'+contactId).find("div[id='contactBirth']").val(contactBirth);
				
				var contactZw = modContact.zw;
				$('#groupContactInfo'+contactId).find("div[id='contactZw']").val(contactZw);
				
				var contactBm = modContact.bm;
				$('#groupContactInfo'+contactId).find("div[id='contactBm']").val(contactBm);
				
				var contactTelp = modContact.telp;
				console.log("contactTelp="+contactTelp);
				$('#groupContactInfo'+contactId).find("div[id='contactTelp']").val(contactTelp);
				
				var contactMobp = modContact.mobp;
				$('#groupContactInfo'+contactId).find("div[id='contactMobp']").val(contactMobp);
				
				var contactEmails = modContact.emails;
				$('#groupContactInfo'+contactId).find("div[id='contactEmails']").val(contactEmails);
				
				var contactAddress = modContact.address;
				$('#groupContactInfo'+contactId).find("div[id='contactAddress']").val(contactAddress);
				
				var contactPostcode = modContact.postcode;
				$('#groupContactInfo'+contactId).find("div[id='contactPostcode']").val(contactPostcode);
				
				var contactGroupId = modContact.groupId;
				console.log("contactGroupId="+modContact.groupId);
				$('#groupContactInfo'+contactId).find("div[id='contact_groupId']").val(contactGroupId);
				
				var contactBz = modContact.bz;
				$('#groupContactInfo'+contactId).find("div[id='contactBz']").val(contactBz);
				
				$("#groupContactInfo"+contactId).remove();

				$('#'+contactId).remove();
				buildGroupContactDiv(modContact);
				OnModGroupContactSuccess();
				
			}
		}
	});
}


//显示添加联系人界面
var showAddGroupContactPage = function(groupId){
	
//	if(globalCur!=null){
//		   document.getElementById(globalCur).setAttribute("style","display:none;");
//		}
//	var addGroupContactInfoDiv = $("#addGroupContactInfo");
//	$("#web").append(addGroupContactInfoDiv);
//	document.getElementById("addGroupContactInfo").setAttribute("style","display:block;");
//	globalCur="addGroupContactInfo";
	var addGroupContactInfo="addGroupContactInfo"+groupId;
	
	resetPosition()
	if(t < 0){t = 30;}
	if(l < 0){l = 60;}
    
	var groupContactInfoDiv = document.createElement("div");
	groupContactInfoDiv.setAttribute("id", addGroupContactInfo);
	document.body.appendChild(groupContactInfoDiv);

	$(groupContactInfoDiv).attr('class', 'edit_data_pop');
	$(groupContactInfoDiv).css({'position':'absolute', 'top':t-300+'px', 'left':l-350+'px'});
	$(groupContactInfoDiv).css({'z-index':count++});
	$(groupContactInfoDiv).show();
	$(groupContactInfoDiv).click(function(){      			//当用鼠标点击该对话框时，该对话框到最上面
		count++;
		$(this).css({'z-index':count});
	});
	
	var HeadInfor=$("<table class='edit_data_title'><tr><td style='width:440px;' id="+'inforMove'+groupId+"><h2>添加联系人信息</h2></td>"+
			"<td><i class='close_pop' onclick=\"closeAddGroupContactInfoPage\('"+groupId+"'\)\"></i></td></tr></table>");
	
	$(groupContactInfoDiv).append(HeadInfor);
	
	var bodyInfor=$("<div class='edit_data_table'><div style='overflow: auto;'>"+"<input type='hidden' name='contactId' id='contact_contactId' value=''>"+
			" <input type='hidden' name='groupId' id='contact_groupId' value="+groupId+">"+
			"<table><tr><th> 姓：</th><td><input name='' type='text' class='edit_input' id='contactLname' value=''></td></tr>"+
			"<tr><th> 名：</th><td><input name='' type='text' class='edit_input' id='contactFname' value=''></td></tr>"+
			"<tr><th> 性别：</th><td><input name='' type='text' class='edit_input' id='contactSex' value=''></td></tr>"+
			"<tr><th> 昵称：</th><td><input name='' type='text' class='edit_input' id='contactNc' value=''></td></tr>"+
			"<tr><th> 生日：</th><td><input name='' type='text' class='edit_input' id='contactBirth' value=''></td></tr>"+
			"<tr><th> 职务：</th><td><input name='' type='text' class='edit_input' id='contactZw' value=''></td></tr>"+
			"<tr><th> 部门：</th><td><input name='' type='text' class='edit_input' id='contactBm' value=''></td></tr>"+
			"<tr><th> 办公电话：</th><td><input name='' type='text' class='edit_input' id='contactTelp' value=''></td></tr>"+
			"<tr><th> 手机：</th><td><input name='' type='text' class='edit_input' id='contactMobp' value=''></td></tr>"+
			"<tr><th> 邮箱：</th><td><input name='' type='text' class='edit_input' id='contactEmails' value=''></td></tr>"+
			"<tr><th> 通信地址：</th><td><input name='' type='text' class='edit_input' id='contactAddress' value=''></td></tr>"+
			"<tr><th> 邮政编码：</th><td><input name='' type='text' class='edit_input' id='contactPostcode' value=''></td></tr>"+
			"<tr><th> 备注：</th><td><input name='' type='text' class='edit_input' id='contactBz' value=''></td></tr>"+
			"<tr><th> </th><td><input type='button' value='添加' class='btn_blue' onclick=\"startAddGroupContact\('"+groupId+"'\)\">"+
   "<input type='button' value='关闭' class='btn_red' onclick=\"closeAddGroupContactInfoPage\('"+groupId+"'\)\"></td></tr></table></div></div>");
	
	$(groupContactInfoDiv).append(bodyInfor);
	

	var infordragClass='infor'+groupId;	//设置窗口可拖拽
	console.log(infordragClass);
	$("#inforMove"+groupId).attr('class', infordragClass);
	dragWindow(infordragClass, groupContactInfoDiv);
	
}

//添加联系人
var startAddGroupContact = function(groupId){
	
	var addcontactGroupId = groupId;
	console.log(addcontactGroupId);
	var addcontactLname = $("#addGroupContactInfo"+groupId).find("#contactLname").val();
	console.log("addcontactLname="+addcontactLname);
	var addcontactFname = $("#addGroupContactInfo"+groupId+" #contactFname").val();
	
	var addcontactSex = $("#addGroupContactInfo"+groupId+" #contactSex").val();
	
	var addcontactNc = $("#addGroupContactInfo"+groupId+" #contactNc").val();
	
	var addcontactBirth = $("#addGroupContactInfo"+groupId+" #contactBirth").val();
	
	var addcontactZw = $("#addGroupContactInfo"+groupId+" #contactZw").val();
	
	var addcontactBm = $("#addGroupContactInfo"+groupId+" #contactBm").val();
	
	var addcontactTelp = $("#addGroupContactInfo"+groupId+" #contactTelp").val();
	
	var addcontactMobp = $("#addGroupContactInfo"+groupId+" #contactMobp").val();
	
	var addcontactEmails =$("#addGroupContactInfo"+groupId+" #contactEmails").val();
	
	var addcontactAddress = $("#addGroupContactInfo"+groupId+" #contactAddress").val();
	
	var addcontactPostcode = $("#addGroupContactInfo"+groupId+" #contactPostcode").val();
	
	var addcontactBz = $("#addGroupContactInfo"+groupId+" #contactBz").val();
	
	$.ajax({
		type:"post",
		url:"/Contacts/api/contactship/addcontact",
		data:{
			lname:addcontactLname,
			fname:addcontactFname,
			sex:addcontactSex,
			nc:addcontactNc,
			birth:addcontactBirth,
			zw:addcontactZw,
			bm:addcontactBm,
			telp:addcontactTelp,
			mobp:addcontactMobp,
			emails:addcontactEmails,
			address:addcontactAddress,
			postcode:addcontactPostcode,
			groupId:addcontactGroupId,
			bz:addcontactBz,
			
			
		},
		success : function(data)
		{
			if(data.result=="success"){
				closeAddGroupContactInfoPage(data.contact.groupId);
				buildGroupContactDiv(data.contact);
				console.log("Addcontact.id="+data.contact.id);
				findSingleContact.push(data.contact.id);
				
				OnAddGroupContactSuccess();
				
			}
		}
	});
}
