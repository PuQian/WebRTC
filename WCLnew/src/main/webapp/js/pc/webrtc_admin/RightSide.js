/**
 * 企业通讯录右侧：企业分组
 */

//创建企业通讯录内容(第page页)
var findEnContactList = function(element)
{
	encontactList = $(".mail_list ul");
	
	//清除原来联系人容器内容
	encontactList.empty();

	//根据element查找下一目标页
	page = findTargetPage(element,EnContactsPrefix);

	//查找当前被选中的分组id
	fz = $(".group_h2.on").attr("id").split("_")[1]; //engroup_27 截取fz=27

	//从数据库中拉取所有一级分组
	$.ajax({
		type:"post",
		url:"/Contacts/api/encontactship/encontacts",
		data:{fz:fz,page:page},
		success : function(data)
		{
			//更新页码条内容
			updatePageBar(EnContactsPrefix,data.page,data.total);
			
			if(data.result == "success")
			{				
				if (data.encontacts.length > 0) 
				{					
					//显示联系人明信片
					for ( var i=0; i< data.encontacts.length; i++) 
					{
						var encontact = data.encontacts[i];
						encontactList.append(createEncontactItem(encontact));
					}
				}
				
			}	
		}
	});
};

//查询并创建企业通讯录联系人(根据关键字查询)
var findEnContactListByKeyword = function(keyword)
{
	//清除当前选中的分组
	$('.group_h2').removeClass("on");
	
	//清除原来联系人容器内容
	encontactList = $(".mail_list ul");
	encontactList.empty();

	//预处理关键字
	keyword = keyword.trim(); //剔除左右多余空格
	if(keyword == "")
		return;

	//从数据库中拉取所有一级分组
	$.ajax({
		type:"post",
		url:"/Contacts/api/encontactship/findencontactsbykeyword",
		data:{eid:$("#eid").val(),keyword:keyword},
		async:false, //防止onkeyup事件触发太快造成混乱
		success : function(data)
		{   console.log(data);
			if(data.result == "success")
			{		
				if (data.encontacts.length > 0) 
				{					
					//显示联系人明信片
					for ( var i=0; i< data.encontacts.length; i++) 
					{
						var encontact = data.encontacts[i];
						encontactList.append(createEncontactItem(encontact));
					}
				}
			}	
		}
	});
};

//创建企业分组内容
//classnum：级数（该父列表的级数）
//lfz：分组号（该父级分组号）
var createEnGroupList = function(classnum,lfz)
{
	var engroupList;
	var url="/Contacts/api/engroupship/";
	var input; //JSON格式
	
	switch(classnum)
	{
		case 1:
		{
			engroupList = $("<div class='group_list_box' id='engrouplist_"+ lfz +"'></div>");
			url += "findFirstengroups";
			input = {eid:$("#eid").val()}; //通过eid,0 查询所有一级分组
		}break;
		case 2:
		{
			engroupList = $("<div id='engrouplist_"+ lfz +"'></div>");
			url += "findSecondengroups";
			input = {lfz:lfz}; //通过lfz作为父分组查询
		}break;
		case 3:
		{
			engroupList = $("<ul class='group_list' id='engrouplist_"+ lfz +"'></ul>");
			url += "findSecondengroups";
			input = {lfz:lfz};
		}break;
	}
	
	//从数据库中拉取所有一级分组
	$.ajax({
		type:"post",
		url:url,
		data:input,
		success : function(data)
		{
			if(data.result == "success"){
				if (data.engroups.length > 0) {
					for ( var i=0; i< data.engroups.length; i++) {

						var engroup = data.engroups[i];
						var size = data.engroupsSize[i];
						engroupList.append(createEngroupItem(classnum,engroup,size));
					}
				}
				
			}	
		}
	});

	return engroupList ;
};

//创建右侧下方的导入、导出条
var createEngroupListBottom = function()
{
	return $("<div class='group_operation'><a href='#'>导入</a>|<a href='#'>导出</a>|<a href='#'>修改</a></div>");
};

//分组标签
var createEngroupItem = function(classnum,engroup,size)
{
	var engroupItem;
	if(classnum == 3) //生成圆点型三级分组(不走下面设计菜单事件)
		engroupItem = $("<li class='group_h2' id='engroup_"+ engroup.fz +"' classnum='" + classnum + "' onclick='findChildrenEngroupList(this,\""+ engroup.fz +"\")'><span>"+ engroup.fzmc +"</span></li>");
	else if(classnum == 2)//生成箭头型二级分组
		engroupItem = $("<h2 class='group_h2' id='engroup_"+ engroup.fz +"' classnum='" + classnum + "' style='text-indent:58px;' onclick='findChildrenEngroupList(this,\""+ engroup.fz +"\")'><i class='ul_close' style='left:32px;'></i><span>"+ engroup.fzmc +"</span><span class='num'></span></h2>");
	else if(classnum == 1)//生成箭头型一级分组
		engroupItem = $("<h2 class='group_h2' id='engroup_"+ engroup.fz +"' classnum='" + classnum + "' onclick='findChildrenEngroupList(this,\""+ engroup.fz +"\")'><i class='ul_close'></i><span>"+ engroup.fzmc +"</span><span class='num'></span></h2>");
	else //隐藏的零级分组
	{
		engroupItem = $("<h2 class='group_h2' id='engroup_0' classnum='0' style='display:none;'></h2>");
		
		//创建菜单
		var RightClickMenu = $("<div id='engroup_operation0' style='display:none;' class='friend_pop_operation'></div>");
		$("body").append(RightClickMenu);
		var MenuUL = $("<ul></ul>");
		RightClickMenu.append(MenuUL);
		MenuUL.append("<li onclick='showAddEngroupWindow(0)'>添加分组</li>");
		
		//点击右侧空白处均触发事件！！！！！！！！（需考虑这样好不好，空间满了怎么办）
		$(".rtc_box_right .group_operation").mousedown(function(e){
			if(e.which == 3)
			{
			   document.oncontextmenu = function() 
			   {
				   return false;
			   };
			   var operMenu = document.getElementById("engroup_operation0");
			   $("body").children("div[class='friend_pop_operation']").hide();
			   $(operMenu).attr("style","display: block;  position:absolute; z-index:100; top:" + e.pageY + "px; left:" + e.pageX + "px;");
			   $(operMenu).show();
			   $("body").click(function(e) {
				   $(operMenu).hide();
			   });
			}
		});
		
		
		return engroupItem;
	}
	
	//为该分组(一级、二级)添加菜单项 + 事件
	var RightClickMenu = $("<div id='engroup_operation"+ engroup.fz +"' style='display:none;' class='friend_pop_operation'></div>");
	$("body").append(RightClickMenu);
	var MenuUL = $("<ul></ul>");
	RightClickMenu.append(MenuUL);
	var MenuList1 = $("<li onclick='showModifyEngroupWindow("+engroup.fz+")'>修改分组</li>");
	MenuUL.append(MenuList1);
	var MenuList2 = $("<li onclick='startToDeleteEngroup("+engroup.fz+")'>删除分组</li>");
	MenuUL.append(MenuList2);
	if(classnum != 3) //一二级分组才有添加分组项
	{
		var MenuList3 = $("<li onclick='showAddEngroupWindow("+engroup.fz+")'>添加分组</li>");
		MenuUL.append(MenuList3);
	}
	var MenuList4 = $("<li onclick='showAddEncontactWindow("+engroup.fz+")'>添加联系人</li>");
	MenuUL.append(MenuList4);
	
	engroupItem.mousedown(function(e){
		if(e.which == 3)
		{
			//右击分组
		   engroupId = $(this).attr("id").split("_")[1];
		   document.oncontextmenu = function() 
		   {
			   return false;
		   };
		   var operMenu = document.getElementById("engroup_operation"+engroupId);
		   $("body").children("div[class='friend_pop_operation']").hide();
		   $(operMenu).attr("style","display: block;  position:absolute; z-index:100; top:" + e.pageY + "px; left:" + e.pageX + "px;");
		   $(operMenu).show();
		   $("body").click(function(e) {
			   $(operMenu).hide();
		   });
		}
	});

	return engroupItem;
};

/*
 * 分组弹出菜单的操作
 */
//修改分组
var showModifyEngroupWindow = function(engroupId)
{
	//对话框基本信息
	var engroupName =$("#engroup_"+engroupId).find("span").eq(0).text();
	var windowId="modEngroupWin"+engroupId;
	  
	//创建对话框
	win = createWindow(windowId);
	$(win).addClass("mod"); //置为小窗口
	  
	//对话框头
	winHeadId = 'modEngroupWinHead'+engroupId;
    winHead=$("<table class='edit_data_title'><tr><td style='width:440px;' class='"+ winHeadId +"'><h2>修改分组</h2></td>"+
      "<td><i class='close_pop' onclick='closeWindow(\""+windowId+"\")'></i></td></tr></table>");
	$(win).append(winHead);
	
	//对话框主体
    var winBody=$("<div class='edit_data_table'><div style='overflow: auto;'>"+
	      "<table><tr><th>分组名称</th><td><input name='engroupName' type='text' class='edit_input' value="+engroupName+"></td></tr>"+
	      "<tr><th> </th><td><input type='button' value='确定' class='btn_blue' onclick='startToModifyEngroup(\""+windowId+"\",\""+engroupId+"\")'>"+
	   "<input type='button' value='取消' class='btn_red' onclick='closeWindow(\""+windowId+"\")'></td></tr></table></div></div>");
	$(win).append(winBody);

	//设置对话框可拖动
	dragWindow(winHeadId, win);
};
var startToModifyEngroup = function(windowId,engroupId)
{
	engroupName = $("#"+windowId).find("input[name='engroupName']").val().trim();
	if(engroupName == "") 
	{
		$.fillTipBox({type:'warning', icon:'glyphicon-info-sign', content:"分组名称不能为空"});
		return;
	}
	
	$.ajax({
		type:"post",
		url:"/Contacts/api/engroupship/modengroup",
		data:{
			fz:engroupId,
			fzmc:engroupName
		},
		success : function(data)
		{
			if(data.result=="success"){

				$("#engroup_"+engroupId).find("span").eq(0).text(engroupName);//右侧界面上修改分组
				closeWindow(windowId); //关闭窗口
				$.fillTipBox({type:'info', icon:'glyphicon-info-sign', content:'修改分组成功!'});
			}
		}
	});
};

//删除分组
var startToDeleteEngroup = function(engroupId)
{
	if(!window.confirm("确定要删除该分组")) //否
		return;
	
	$.ajax({
		type:"post",
		url:"/Contacts/api/engroupship/delengroup",
		data:{
			fz:engroupId,
		},
		success : function(data)
		{
			if(data.result=="success"){

				//删分组+联系人
				engroupItem = $("#engroup_"+engroupId);
				if(engroupItem.hasClass("on")) //选中的，即中间正显示着这个分组下的联系人明信片
				{
					//清除原来联系人容器内容
					$(".mail_list ul").empty();
				}
				engroupItem.remove();//右侧界面上删除分组
				
				//删子分组
				engroupList = $("#engrouplist_"+engroupId)[0];
				if(engroupList != null) //存在分组列表，右侧界面上删除该分组旗下的子分组列表
					$(engroupList).remove();
				
				closeWindow(windowId); //关闭窗口
				$.fillTipBox({type:'info', icon:'glyphicon-info-sign', content:'删除分组成功!'});
			}
		}
	});
};

//添加分组
var showAddEngroupWindow = function(engroupId)
{
	//对话框基本信息
	var windowId="addEngroupWin"+engroupId;
	  
	//创建对话框
	win = createWindow(windowId);
	$(win).addClass("mod"); //置为小窗口
	
	//对话框头
	winHeadId = 'addEngroupWinHead'+engroupId;
    winHead=$("<table class='edit_data_title'><tr><td style='width:440px;' class='"+ winHeadId +"'><h2>添加分组</h2></td>"+
      "<td><i class='close_pop' onclick='closeWindow(\""+windowId+"\")'></i></td></tr></table>");
	$(win).append(winHead);
	
	//对话框主体
    var winBody=$("<div class='edit_data_table'><div style='overflow: auto;'>"+
	      "<table><tr><th>分组名称</th><td><input name='engroupName' type='text' class='edit_input' value=''></td></tr>"+
	      "<tr><th> </th><td><input type='button' value='确定' class='btn_blue' onclick='startToAddEngroup(\""+windowId+"\",\""+engroupId+"\")'>"+
	   "<input type='button' value='取消' class='btn_red' onclick='closeWindow(\""+windowId+"\")'></td></tr></table></div></div>");
	$(win).append(winBody);

	//设置对话框可拖动
	dragWindow(winHeadId, win);
};
var startToAddEngroup = function(windowId,engroupId)
{
	engroupName = $("#"+windowId).find("input[name='engroupName']").val().trim();
	if(engroupName == "") 
	{
		$.fillTipBox({type:'warning', icon:'glyphicon-info-sign', content:"请填写分组名称"});
		return;
	}
	
	$.ajax({
		type:"post",
		url:"/Contacts/api/engroupship/addengroup",
		data:{
			eid:$("#eid").val(),
			lfz:engroupId,
			fzmc:engroupName
		},
		success : function(data)
		{
			if(data.result=="success"){

				classnum = $("#engroup_"+engroupId).attr("classnum"); //获取父级分组的级数
				classnum++;
				$("#engrouplist_"+engroupId).append(createEngroupItem(classnum, data.engroup, 0)); //取得父级分组列表
				
				closeWindow(windowId); //关闭窗口
				$.fillTipBox({type:'info', icon:'glyphicon-info-sign', content:'添加分组成功!'});
			}
		}
	});
};

//添加联系人
var showAddEncontactWindow = function(engroupId)
{
	//对话框基本信息
	var windowId="addEncontactWin"+engroupId;
	  
	//创建对话框
	win = createWindow(windowId);
	  
	//对话框头
	winHeadId = 'addEncontactWinHead'+engroupId;
    winHead=$("<table class='edit_data_title'><tr><td style='width:440px;' class='"+ winHeadId +"'><h2>添加联系人</h2></td>"+
      "<td><i class='close_pop' onclick='closeWindow(\""+windowId+"\")'></i></td></tr></table>");
	$(win).append(winHead);
	
	winBody=$("<div class='edit_data_table'><div style='overflow: auto;'>"+
			"<table><tr><th> 姓：</th><td><input name='encontactLname' type='text' class='edit_input' value=''></td></tr>"+
			"<tr><th> 名：</th><td><input name='encontactFname' type='text' class='edit_input' value=''></td></tr>"+
			"<tr><th> 性别：</th><td><input name='encontactSex' type='text' class='edit_input' value=''></td></tr>"+
			"<tr><th> 昵称：</th><td><input name='encontactNc' type='text' class='edit_input' value=''></td></tr>"+
			"<tr><th> 生日：</th><td><input name='encontactBirth' type='text' class='edit_input' value=''></td></tr>"+
			"<tr><th> 职务：</th><td><input name='encontactZw' type='text' class='edit_input' value=''></td></tr>"+
			"<tr><th> 部门：</th><td><input name='encontactBm' type='text' class='edit_input' value=''></td></tr>"+
			"<tr><th> 办公电话：</th><td><input name='encontactTelp' type='text' class='edit_input' value=''></td></tr>"+
			"<tr><th> 手机：</th><td><input name='encontactMobp' type='text' class='edit_input' value=''></td></tr>"+
			"<tr><th> 邮箱：</th><td><input name='encontactEmails' type='text' class='edit_input' value=''></td></tr>"+
			"<tr><th> 通信地址：</th><td><input name='encontactAddress' type='text' class='edit_input' value=''></td></tr>"+
			"<tr><th> 邮政编码：</th><td><input name='encontactPostcode' type='text' class='edit_input' value=''></td></tr>"+
			"<tr><th> 备注：</th><td><input name='encontactBz' type='text' class='edit_input' value=''></td></tr>"+
			"<tr><th> </th><td><input type='button' value='添加' class='btn_blue' onclick='startToAddEncontact\(\""+windowId+"\",\""+engroupId+"\")'>"+
			"<input type='button' value='关闭' class='btn_red' onclick='closeWindow(\""+windowId+"\")'></td></tr></table></div></div>");
    $(win).append(winBody);

	//设置对话框可拖动
	dragWindow(winHeadId, win);
};
var startToAddEncontact = function(windowId,engroupId)
{

	var lname = $("#"+windowId).find("input[name='encontactLname']").val();
	var fname = $("#"+windowId).find("input[name='encontactFname']").val();
	var sex = $("#"+windowId).find("input[name='encontactSex']").val();	
	var nc = $("#"+windowId).find("input[name='encontactNc']").val();	
	var birth = $("#"+windowId).find("input[name='encontactBirth']").val();	
	var zw = $("#"+windowId).find("input[name='encontactZw']").val();	
	var bm = $("#"+windowId).find("input[name='encontactBm']").val();	
	var telp = $("#"+windowId).find("input[name='encontactTelp']").val();	
	var mobp = $("#"+windowId).find("input[name='encontactMobp']").val();	
	var emails = $("#"+windowId).find("input[name='encontactEmails']").val();	
	var address = $("#"+windowId).find("input[name='encontactAddress']").val();	
	var postcode = $("#"+windowId).find("input[name='encontactPostcode']").val();	
	var bz = $("#"+windowId).find("input[name='encontactBz']").val();
	if(checkIfHasRegSig(lname)
	|| checkIfHasRegSig(fname)
	|| checkIfHasRegSig(sex)
	|| checkIfHasRegSig(nc)
	|| checkIfHasRegSig(birth)
	|| checkIfHasRegSig(zw)
	|| checkIfHasRegSig(bm)
	|| checkIfHasRegSig(telp)
	|| checkIfHasRegSig(mobp)
	|| checkIfHasRegSig(emails)
	|| checkIfHasRegSig(address)
	|| checkIfHasRegSig(postcode)
	|| checkIfHasRegSig(bz))//判断是否含有正则表达式中的符号
	{
		$.fillTipBox({type:'warning', icon:'glyphicon-info-sign', content:'请勿包含符号?+*$^\/[](){}|'});
		return;
	}
	
	
	$.ajax({
		type:"post",
		url:"/Contacts/api/encontactship/addencontact",
		data:{
			lname:lname,
			fname:fname,
			sex:sex,
			nc:nc,
			birth:birth,
			zw:zw,
			bm:bm,
			telp:telp,
			mobp:mobp,
			emails:emails,
			address:address,
			postcode:postcode,
			fz:engroupId,
			bz:bz
		},
		success : function(data)
		{
			if(data.result=="success")
			{	
				engroupItem = $("#engroup_"+engroupId);
				if(engroupItem.hasClass("on")) //选中的，即中间正显示着这个分组下的联系人明信片
				{
					findEnContactList($(".bottom_operation .page_end")[0]);//强制翻到最后一页
				}
				
				closeWindow(windowId); //关闭窗口
				$.fillTipBox({type:'info', icon:'glyphicon-info-sign', content:'添加联系人成功!'});
			}
		}
	});
};

//验证str中是否包含正则表达式中的特殊字符
var checkIfHasRegSig =  function(str)
{
	var reg = /\*|\+|\$|\^|\\|\/|\[|\]|\(|\)|\{|\}|\|/;
	return str.match(reg);
};

//生成可拖动的对话框(dom对象),windowId: modEngroup52 addEngroup33  addEncontact22 
var createWindow = function(windowId)
{
	resetPosition();
	if(t < 0){t = 30;}
	if(l < 0){l = 60;}
	    
	var win = document.createElement("div");
	win.setAttribute("id", windowId);
	document.body.appendChild(win);
	
	$(win).attr('class', 'edit_data_pop');
	$(win).css({'position':'absolute', 'top':t-300+'px', 'left':l-350+'px'});
	$(win).css({'z-index':count++});
	$(win).show();
	$(win).click(function(){            //当用鼠标点击该对话框时，该对话框到最上面
	count++;
	$(this).css({'z-index':count});
	});
		  
	return win;
};

//关闭windowId窗口
var closeWindow = function(windowId){
	$("#"+windowId).remove();
	console.log("windowId has been closed");
};

//点击某分组标签，查询该fz对应的子分组
var findChildrenEngroupList = function(element,lfz)
{	
	//获取该分组的级数
	classnum = $(element).attr("classnum");
	classnum++; //旗下分组的级数
	/**
	 * 对中间联系人操作
	 */
	if(!$(element).hasClass("on")) //未选中
	{
		selectEngroup(element);
		findEnContactList(element);
	}
	
	if(classnum == 4) //点击最底层分组，点到为止，不进行后续拉取分组的操作了
		return;

	/**
	 * 对右侧分组操作
	 */
	arrowI = $(element).children('i');//获取箭头标签
	
	switchStatus = arrowI.attr('class'); //箭头开关情况
	arrowI.removeAttr('class'); //删掉
	if(switchStatus == 'ul_close') //关
	{
		arrowI.addClass('ul_open');
		
		//检测旗下是否已拉取分组
		engroupList = getEngroupList(lfz);
		if(engroupList == null) //第一次，拉取
		{
			$(element).after(createEnGroupList(classnum,lfz)); //紧接着把拉取到的旗下分组列表sibling在它后面
		}
		else //非第一次，让其从隐藏变为显示
		{
			$(engroupList).show();
		}
	}
	else //开 
	{
		arrowI.addClass('ul_close');
		
		//隐藏旗下的分组列表
		engroupList = getEngroupList(lfz);
		$(engroupList).hide();
	}
};

//选中element所示分组
var selectEngroup = function(element)
{
	$('.group_h2').removeClass("on");//移除之前的
	$(element).addClass("on"); //选中
};

//获取分组(若该分组一次也没有点过，返回的是null)
var getEngroupList = function(lfz)
{
	return $('#engrouplist_'+lfz)[0]; //转为dom元素
};