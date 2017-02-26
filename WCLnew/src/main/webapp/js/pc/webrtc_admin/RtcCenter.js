/**
 * 企业通讯录选项卡
 */
//创建企业通讯录容器
var createEnContactsContainer = function(Prefix)
{
	return $("<div id='"+ Prefix +"'>\
			   	<div class='rtc_tab'>\
			   		<h2>企业通讯录</h2>\
			   		<div class='rtc_tab_search'><input name='encontact_search' class='search_input' value='' placeholder='姓名 / 邮箱 / 电话 / 地址' onkeyup='findEnContactListByKeyword(this.value)'/><span class='search_tips'></span></div>\
			   	</div>\
				<div class='mail_list'><ul></ul></div>\
				<div class='bottom_operation'>\
					<div class='bottom_operation_l'><a href='javascript:void(0);' onclick='selectAllEncontact()'>全选</a>|<a href='javascript:void(0);' onclick='deleteEncontact()'>删除</a></div>\
					<div class='bottom_operation_r'><span class='page_first' onclick='findEnContactList(this)'>最前页</span><span class='page_up' onclick='findEnContactList(this)'>上一页</span><span>第</span><span>\
						<input name='' type='text' class='input_num' value='1'/>\
						</span><span>页/</span><span>1</span><span>页</span><span class='page_next' onclick='findEnContactList(this)'>最前页</span><span class='page_end' onclick='findEnContactList(this)'>最后页</span>\
					</div>\
				</div>\
    		</div>");
};

//创建企业通讯录联系人明信片项
var createEncontactItem = function(encontact)
{
	encontactJsonStr = JSON.stringify(encontact).replace(/"/g,'!@#');
	return $("<li onclick='selectEncontact(this)' encontactId='"+encontact.id+"'>\
	    <div class='list_portrait'><img src='images/img/portrait65_2.jpg' /></div>\
		 <div class='list_text'>\
			 <h3>"+ encontact.lname + encontact.fname +"</h3>\
			 <p>"+ encontact.emails +"</p>\
			 <p><a href='javascript:void(0);' onclick='showQueryEncontactWindow(\""+ encontactJsonStr +"\")'>查看</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;<a href='javascript:void(0);' onclick='showModifyEncontactWindow(\""+ encontactJsonStr +"\")'>修改</a></p>\
		 </div>\
	 </li>");
};

//显示查看联系人对话框
var showQueryEncontactWindow = function(encontact)
{
	encontact = JSON.parse(encontact.replace(/!@#/g,'"')); //将encontact字符串转为JSON对象

	//对话框基本信息
	var windowId="queryEncontactWin"+encontact.id;
	  
	//创建对话框
	win = createWindow(windowId);
	  
	//对话框头
	winHeadId = 'queryEncontactWinHead'+encontact.id;
    winHead=$("<table class='edit_data_title'><tr><td style='width:440px;' class='"+ winHeadId +"'><h2>查看联系人</h2></td>"+
      "<td><i class='close_pop' onclick='closeWindow(\""+windowId+"\")'></i></td></tr></table>");
	$(win).append(winHead);
	
	winBody=$("<div class='edit_data_table'><div style='overflow: auto;'>"+
			"<table><tr><th> 姓：</th><td><input name='encontactLname' type='text' class='edit_input' value='"+ encontact.lname +"' disabled></td></tr>"+
			"<tr><th> 名：</th><td><input name='encontactFname' type='text' class='edit_input' value='"+ encontact.fname +"' disabled></td></tr>"+
			"<tr><th> 性别：</th><td><input name='encontactSex' type='text' class='edit_input' value='"+ encontact.sex +"' disabled></td></tr>"+
			"<tr><th> 昵称：</th><td><input name='encontactNc' type='text' class='edit_input' value='"+ encontact.nc +"' disabled></td></tr>"+
			"<tr><th> 生日：</th><td><input name='encontactBirth' type='text' class='edit_input' value='"+ encontact.birth +"' disabled></td></tr>"+
			"<tr><th> 职务：</th><td><input name='encontactZw' type='text' class='edit_input' value='"+ encontact.zw +"' disabled></td></tr>"+
			"<tr><th> 部门：</th><td><input name='encontactBm' type='text' class='edit_input' value='"+ encontact.bm +"' disabled></td></tr>"+
			"<tr><th> 办公电话：</th><td><input name='encontactTelp' type='text' class='edit_input' value='"+ encontact.telp +"' disabled></td></tr>"+
			"<tr><th> 手机：</th><td><input name='encontactMobp' type='text' class='edit_input' value='"+ encontact.mobp +"' disabled></td></tr>"+
			"<tr><th> 邮箱：</th><td><input name='encontactEmails' type='text' class='edit_input' value='"+ encontact.emails +"' disabled></td></tr>"+
			"<tr><th> 通信地址：</th><td><input name='encontactAddress' type='text' class='edit_input' value='"+ encontact.address +"' disabled></td></tr>"+
			"<tr><th> 邮政编码：</th><td><input name='encontactPostcode' type='text' class='edit_input' value='"+ encontact.postcode +"' disabled></td></tr>"+
			"<tr><th> 备注：</th><td><input name='encontactBz' type='text' class='edit_input' value='"+ encontact.bz +"' disabled></td></tr>"+
			"<tr><th> </th><td><input type='button' value='关闭' class='btn_red' onclick='closeWindow(\""+windowId+"\")'></td></tr></table></div></div>");
    $(win).append(winBody);

	//设置对话框可拖动
	dragWindow(winHeadId, win);
};
//显示修改联系人对话框
var showModifyEncontactWindow = function(encontact)
{
	encontact = JSON.parse(encontact.replace(/!@#/g,'"')); //将encontact字符串转为JSON对象

	//对话框基本信息
	var windowId="modEncontactWin"+encontact.id;
	  
	//创建对话框
	win = createWindow(windowId);
	  
	//对话框头
	winHeadId = 'modEncontactWinHead'+encontact.id;
    winHead=$("<table class='edit_data_title'><tr><td style='width:440px;' class='"+ winHeadId +"'><h2>修改联系人</h2></td>"+
      "<td><i class='close_pop' onclick='closeWindow(\""+windowId+"\")'></i></td></tr></table>");
	$(win).append(winHead);
	
	winBody=$("<div class='edit_data_table'><div style='overflow: auto;'>"+
			"<table><tr><th> 姓：</th><td><input name='encontactLname' type='text' class='edit_input' value='"+ encontact.lname +"'></td></tr>"+
			"<tr><th> 名：</th><td><input name='encontactFname' type='text' class='edit_input' value='"+ encontact.fname +"'></td></tr>"+
			"<tr><th> 性别：</th><td><input name='encontactSex' type='text' class='edit_input' value='"+ encontact.sex +"'></td></tr>"+
			"<tr><th> 昵称：</th><td><input name='encontactNc' type='text' class='edit_input' value='"+ encontact.nc +"'></td></tr>"+
			"<tr><th> 生日：</th><td><input name='encontactBirth' type='text' class='edit_input' value='"+ encontact.birth +"'></td></tr>"+
			"<tr><th> 职务：</th><td><input name='encontactZw' type='text' class='edit_input' value='"+ encontact.zw +"'></td></tr>"+
			"<tr><th> 部门：</th><td><input name='encontactBm' type='text' class='edit_input' value='"+ encontact.bm +"'></td></tr>"+
			"<tr><th> 办公电话：</th><td><input name='encontactTelp' type='text' class='edit_input' value='"+ encontact.telp +"'></td></tr>"+
			"<tr><th> 手机：</th><td><input name='encontactMobp' type='text' class='edit_input' value='"+ encontact.mobp +"'></td></tr>"+
			"<tr><th> 邮箱：</th><td><input name='encontactEmails' type='text' class='edit_input' value='"+ encontact.emails +"'></td></tr>"+
			"<tr><th> 通信地址：</th><td><input name='encontactAddress' type='text' class='edit_input' value='"+ encontact.address +"'></td></tr>"+
			"<tr><th> 邮政编码：</th><td><input name='encontactPostcode' type='text' class='edit_input' value='"+ encontact.postcode +"'></td></tr>"+
			"<tr><th> 备注：</th><td><input name='encontactBz' type='text' class='edit_input' value='"+ encontact.bz +"'></td></tr>"+
			"<tr><th> </th><td><input type='button' value='修改' class='btn_blue' onclick='startToModifyEncontact\(\""+windowId+"\","+ encontact.id +","+ encontact.fz +")'>"+
			"<input type='button' value='关闭' class='btn_red' onclick='closeWindow(\""+windowId+"\")'></td></tr></table></div></div>");
    $(win).append(winBody);

	//设置对话框可拖动
	dragWindow(winHeadId, win);
};
var startToModifyEncontact = function(windowId,id,fz) //id:联系人的id  fz:父级分组号
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
		$.fillTipBox({type:'warning', icon:'glyphicon-info-sign', content:'请勿包含符号?+*$^\/[](){}|'})
		return;
	}
	//构造json对象传给后台
	encontact = {
			id:id,
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
			fz:fz,
			bz:bz
	};
	
	$.ajax({
		type:"post",
		url:"/Contacts/api/encontactship/modencontact",
		data:encontact,
		success : function(data)
		{
			if(data.result=="success")
			{	
				//检测当前中间的联系人里面有没有id为刚才修改过的那人的
				$(".mail_list ul li").each(function(){

					if($(this).attr("encontactId") == id)	//若有
					{
						//更新它的姓名和邮箱字段
						$(this).find("h3").text(lname+fname); 
						$(this).find("p").eq(0).text(emails);
						
						//更新查看、修改链接里面的encontact JSON对象
						encontactJsonStr = JSON.stringify(encontact).replace(/"/g,'!@#');
						$(this).find("p").eq(1).children("a").eq(0).attr("onclick","showQueryEncontactWindow(\""+ encontactJsonStr +"\")");
						$(this).find("p").eq(1).children("a").eq(1).attr("onclick","showModifyEncontactWindow(\""+ encontactJsonStr +"\")");
						
						return false; //跳出
					}
				});

				closeWindow(windowId); //关闭窗口
				$.fillTipBox({type:'info', icon:'glyphicon-info-sign', content:'修改联系人成功!'})
			}
		}
	});
};



//点击联系人明信片，选中
var selectEncontact = function(element)
{
	if($(element).hasClass("on")) //选中的
		$(element).removeClass("on");
	else //未选中
		$(element).addClass("on");	
};

//全选
var selectAllEncontact = function()
{
	//检测是否有没选的
	var isAllSelected = true;
	encontactLis = $(".mail_list ul").children("li");
	encontactLis.each(function()
	{
		if(!$(this).hasClass("on")) //未选中
		{
			isAllSelected = false;
			return false; //跳出，不检测其他的了
		}
	});
	
	if(isAllSelected == false) //有未选中的
		encontactLis.addClass("on");
	else //全选中了
		encontactLis.removeClass("on");
};

//删除联系人
var deleteEncontact = function()
{	
	var selectedAtLeastOne = false; //至少有一个
	var encontactIds = "";
	
	encontactLis = $(".mail_list ul").children("li");
	encontactLis.each(function()
	{
		if($(this).hasClass("on")) //选中
		{
			selectedAtLeastOne = true;
			encontactIds += $(this).attr("encontactId") + ",";
		}
	});
	
	if(selectedAtLeastOne == false) //一个也没选中
		return;
	
	if(!window.confirm("确认要删除?")) //取消
		return;
	
	//通知后台删除所有选中的联系人
	console.log("EncontactIds:["+ encontactIds +"] are waiting to be deleted !!!!");
	//从数据库中拉取所有一级分组
	$.ajax({
		type:"post",
		url:"/Contacts/api/encontactship/delencontact",
		data:{encontactIds:encontactIds},
		success : function(data)
		{
			if(data.result == "success") //成功删除所有encontactIds
			{
				encontactLis.filter(".on").remove();
			}
		}
	});
};

/**
 * 企业用户选项卡
 */
//创建企业用户容器
var createEnterUserContainer = function(Prefix)
{
	return $("<div id='"+ Prefix +"'>\
			   	<div class='rtc_tab'>\
			   		<ul>\
						<li id='onPersonalAdmin' onclick='PersonalAdmin(this);' class='on'>用户管理</li>\
			   			<li id='onBusinessStatistic' onclick='BusinessStatistic(this);'>业务统计</li>\
			   			<li id='onBusinessDeploy' onclick='BusinessDeploy(this);'>业务配置</li>\
			   		</ul>\
	   				<div class='rtc_tab_search'><input name='enteruser_search' class='search_input' value='' placeholder='请输入用户名' onkeyup='findEnterUserDataListByKeyword(this.value)'/><span class='search_tips'></span></div>\
			   	</div>\
				<div class='list_table'>\
					<div id='list_personaladmin' style='display:block;'>\
						<table>\
							<tr>\
							    <th width='80' class='pl10'>用户名</th>\
								<th width='80' class='pl10'>姓名</th>\
							    <th width='80' class='pl10'>邮箱</th>\
					    		<th width='80' class='pl10'>地址</th>\
							    <th width='80' class='pl10'>出生年月</th>\
							    <th width='80' class='pl10'>加入时间</th>\
							    <th width='80' class='pl10'>备注</th>\
						    </tr>\
					    </table>\
					</div>\
					<div id='list_businessstatistic' style='display:none;'>\
						<table>\
							<tr>\
							    <th width='80' class='pl10'>用户名</th>\
								<th width='80' class='pl10'>通话时长</th>\
							    <th width='80' class='pl10'>通话次数</th>\
					    		<th width='80' class='pl10'>实时费用</th>\
						    </tr>\
					    </table>\
					</div>\
					<div id='list_businessdeploy' style='display:none;'>\
						<table>\
							<tr>\
							    <th width='140' class='pl10'>用户名</th>\
								<th width='70' class='pl10'>通话时限</th>\
								<th width='70' class='pl10'>管理员</th>\
							    <th width='70' class='pl10'>客服</th>\
		    					<th width='70' class='pl10'>优先级</th>\
					    		<th width='70' class='pl10'>服务数量</th>\
							    <th width='100' class='pl10'>登录时间</th>\
							    <th width='100' class='pl10'>注销时间</th>\
							    <th width='60' class='pl10'>操作</th>\
						    </tr>\
					    </table>\
					</div>\
				</div>\
				<div class='bottom_operation'>\
					<div class='bottom_operation_l'><a href='javascript:void(0);'>导出</a>|<a href='javascript:void(0);'>删除</a></div>\
					<div class='bottom_operation_r'><span class='page_first' onclick='findEnterUserDataListByPage(this)'>最前页</span><span class='page_up' onclick='findEnterUserDataListByPage(this)'>上一页</span><span>第</span><span>\
						<input name='' type='text' class='input_num' value='1'/>\
						</span><span>页/</span><span>1</span><span>页</span><span class='page_next' onclick='findEnterUserDataListByPage(this)'>最前页</span><span class='page_end' onclick='findEnterUserDataListByPage(this)'>最后页</span>\
					</div>\
				</div>\
    		</div>");
};

//点击翻页按钮，通过当前有on的选项卡确定是要查询哪块
var findEnterUserDataListByPage = function(element)
{
	switch($(".rtc_tab ul li.on").attr("id"))
	{
		case 'onPersonalAdmin':;break;
		case 'onBusinessStatistic':;break;
		case 'onBusinessDeploy':findBusinessDeployListByPage(element,"list_businessdeploy");break;
	}
};

//关键字，通过当前有on的选项卡确定是要查询哪块
var findEnterUserDataListByKeyword = function(keyword)
{
	switch($(".rtc_tab ul li.on").attr("id"))
	{
		case 'onPersonalAdmin':;break;
		case 'onBusinessStatistic':;break;
		case 'onBusinessDeploy':findBusinessDeployListByKeyword("list_businessdeploy",keyword);break;
	}
};

//选项卡1：个人信息管理
var PersonalAdmin = function(element)
{
//	if($(element).hasClass("on"))
//		return;
	toggleEnterUserTabAndTable(element,"list_personaladmin");
	
	//查第一页
};

//选项卡2：业务统计
var BusinessStatistic = function(element)
{
//	if($(element).hasClass("on"))
//		return;
	toggleEnterUserTabAndTable(element,"list_businessstatistic");
	
	//查第一页
};

//选项卡3：业务配置
var BusinessDeploy = function(element)
{
//	if($(element).hasClass("on"))
//		return;
	toggleEnterUserTabAndTable(element,"list_businessdeploy");

	//查第一页
	findBusinessDeployListByPage(element,"list_businessdeploy");
};
var findBusinessDeployListByPage = function(element,tableId) //按页码查
{
	//根据element查找下一目标页
	page = findTargetPage(element,EnterUserPrefix);

	//从数据库中拉取第一页所有的企业用户信息
	$.ajax({
		type:"post",
		url:"/Enterprise/businessdeploy/querybypage",
		data:{eid:$("#eid").val(),page:page},
		success : function(data)
		{
			//更新页码条内容
			updatePageBar(EnterUserPrefix,data.page,data.total);
			
			if(data.result == "success")
			{				
				if (data.enterusers.length > 0) 
				{		
					tableList = $("#"+tableId+" table tbody");
					tableList.children("tr:first").nextAll().remove();//清空当前表格内容

					//显示企业用户的业务配置
					for (var i=0; i < data.enterusers.length; i++) 
					{
						var enteruser = data.enterusers[i];
						var account = data.accounts[i];
						addRowIntoBusinessDeployTable(tableList,enteruser,account);
					}
				}
				
			}	
		}
	});
};
var findBusinessDeployListByKeyword = function(tableId,keyword) //按关键字查
{
	//清除原表格中内容
	tableList = $("#"+tableId+" table tbody");
	tableList.children("tr:first").nextAll().remove();//清空当前表格内容
	
	//预处理关键字
	keyword = keyword.trim(); //剔除多余空格
	if(keyword == "")
		return;

	//从数据库中拉取第一页所有的企业用户信息
	$.ajax({
		type:"post",
		url:"/Enterprise/businessdeploy/querybykeyword",
		data:{eid:$("#eid").val(),keyword:keyword},
		async:false, //防止onkeyup事件触发太快造成混乱
		success : function(data)
		{
			if(data.result == "success")
			{
				if (data.enterusers.length > 0) 
				{		
					//显示企业用户的业务配置
					for (var i=0; i < data.enterusers.length; i++) 
					{
						var enteruser = data.enterusers[i];
						var account = data.accounts[i];
						addRowIntoBusinessDeployTable(tableList,enteruser,account);
					}
				}
				
			}	
		}
	});
};

//切换企业用户选项卡时相应的界面切换操作
//element:tab标签
//tableId:要显示的表格的id
var toggleEnterUserTabAndTable = function(element,tableId)
{
	//选项卡
	$(element).siblings().removeClass("on");
	$(element).addClass("on");
	
	//表格
	$("#"+tableId).siblings().hide();
	$("#"+tableId).show();
};

//向tableId指示的表格中添加一行数据记录
var addRowIntoBusinessDeployTable = function(tableList,enteruser,account)
{
	enteruserJsonStr = JSON.stringify(enteruser).replace(/"/g,'!@#');
	
	//创建行
	var tableRow =$("<tr enteruserId=\""+ enteruser.id +"\"></tr>");

	//创建列
	tableRow.append(createCol(account.email));
	tableRow.append(createCol(enteruser.maxcalltime == -1 ? "不限" : enteruser.maxcalltime));
	tableRow.append(createCol(enteruser.isadmin == 1 ? "是" : "否"));
	tableRow.append(createCol(enteruser.isarti == 1 ? "是" : "否"));
	tableRow.append(createCol(enteruser.priority));
	tableRow.append(createCol(enteruser.maxservingnum));
	tableRow.append(createCol(deleteBeforeT(enteruser.loginTime)));
	tableRow.append(createCol(deleteBeforeT(enteruser.logoutTime)));
	tableRow.append(createCol("<a href='javascript:void(0);' class='fBlue' onclick='showModifyBusinessDeployWindow(\""+ account.email +"\",\""+ enteruserJsonStr +"\")'>修改</a>"));
	//添加行
	tableList.append(tableRow);
};

//创建带有数据data的列
var createCol = function(data)
{
	data = data == null ? "-" : data;
	return $("<td class='pl10'>"+ data +"</td>");
};

//弹出“修改业务配置”对话框
var showModifyBusinessDeployWindow = function(username,enteruser)
{
	//数据预处理
	enteruser = JSON.parse(enteruser.replace(/!@#/g,'"')); //将enteruser字符串转为JSON对象
	console.log(enteruser);
		//权限
	adminAuthor = enteruser.isadmin == 1 ? "是" : "否";
	artiAuthor = enteruser.isarti == 1 ? "是" : "否";
	artiTimer = enteruser.isbindtimer == 1 ? "开" : "关";

		//时间
	limitCallHour = getLimitCallHour(enteruser.maxcalltime);
	limitCallMinute = getLimitCallMinute(enteruser.maxcalltime);
	loginTime = deleteBeforeT(enteruser.loginTime);
	logoutTime = deleteBeforeT(enteruser.logoutTime);
	loginHour = getHourInTime(loginTime);
	loginMinute = getMinuteInTime(loginTime);
	logoutHour = getHourInTime(logoutTime);
	logoutMinute = getMinuteInTime(logoutTime);
	
	//对话框基本信息
	var windowId="modBusinessDeployWin"+enteruser.id;
	  
	//创建对话框
	win = createWindow(windowId);
	  
	//对话框头
	winHeadId = 'modBusinessDeployWinHead'+enteruser.id;
    winHead=$("<table class='edit_data_title'><tr><td style='width:440px;' class='"+ winHeadId +"'><h2>修改业务配置</h2></td>"+
      "<td><i class='close_pop' onclick='closeWindow(\""+windowId+"\")'></i></td></tr></table>");
	$(win).append(winHead);
	
	winBody=$("<div class='edit_data_table meeting_found'><div style='overflow: auto;'>"+
			"<table style='margin:0;'><tr><th>企业用户&nbsp;</th><td>"+ username +"</td></tr>"+
			"<tr><th>通话时限&nbsp;</th><td><div class='meeting_input w100 fl'><input name='maxcalltime_hour' type='text' class='meeting_time' onblur='checkInputNum(this,0,5)' value='"+ limitCallHour +"'><i onclick='showSelectorTimeMenu(this)' class='input_more'></i></div>"+
			"<div class='meeting_input w100' style='clear:both;position:absolute; margin:38px 0 0 0; display:none;'>" +
				"<ul>" +
					"<li class='meetingTypeMenuLi' onclick='showSelectorTimeItem(this);' style='border-bottom:1px solid #bad1de;'>不限</li>" +
					"<li class='meetingTypeMenuLi' onclick='showSelectorTimeItem(this);' style='border-bottom:1px solid #bad1de;'>0</li>" +
					"<li class='meetingTypeMenuLi' onclick='showSelectorTimeItem(this);' style='border-bottom:1px solid #bad1de;'>1</li>" +
					"<li class='meetingTypeMenuLi' onclick='showSelectorTimeItem(this);' style='border-bottom:1px solid #bad1de;'>2</li>" +
					"<li class='meetingTypeMenuLi' onclick='showSelectorTimeItem(this);' style='border-bottom:1px solid #bad1de;'>3</li>" +
					"<li class='meetingTypeMenuLi' onclick='showSelectorTimeItem(this);' style='border-bottom:1px solid #bad1de;'>4</li>" +
					"<li class='meetingTypeMenuLi' onclick='showSelectorTimeItem(this);' style='border-bottom:1px solid #bad1de;'>5</li>" +
				"</ul>" +
			"</div>" +
			"<span class='fl pl5 pr20'>小时</span><div class='meeting_input w100 fl'><input name='maxcalltime_minute' type='text' class='meeting_time' onblur='checkInputNum(this,0,60)' value='"+ limitCallMinute +"'><i onclick='showSelectorTimeMenu(this)' class='input_more'></i></div>"+
			"<div class='meeting_input w100' style='clear:both;position:absolute; margin:38px 0px 0px 155px; display:none;'>" +
				"<ul style='overflow:auto;'>" +
					"<li class='meetingTypeMenuLi' onclick='showSelectorTimeItem(this);' style='border-bottom:1px solid #bad1de;'>不限</li>" +
					"<li class='meetingTypeMenuLi' onclick='showSelectorTimeItem(this);' style='border-bottom:1px solid #bad1de;'>0</li>" +
					"<li class='meetingTypeMenuLi' onclick='showSelectorTimeItem(this);' style='border-bottom:1px solid #bad1de;'>5</li>" +
					"<li class='meetingTypeMenuLi' onclick='showSelectorTimeItem(this);' style='border-bottom:1px solid #bad1de;'>10</li>" +
					"<li class='meetingTypeMenuLi' onclick='showSelectorTimeItem(this);' style='border-bottom:1px solid #bad1de;'>15</li>" +
					"<li class='meetingTypeMenuLi' onclick='showSelectorTimeItem(this);' style='border-bottom:1px solid #bad1de;'>20</li>" +
					"<li class='meetingTypeMenuLi' onclick='showSelectorTimeItem(this);' style='border-bottom:1px solid #bad1de;'>25</li>" +
					"<li class='meetingTypeMenuLi' onclick='showSelectorTimeItem(this);' style='border-bottom:1px solid #bad1de;'>30</li>" +
					"<li class='meetingTypeMenuLi' onclick='showSelectorTimeItem(this);' style='border-bottom:1px solid #bad1de;'>35</li>" +
					"<li class='meetingTypeMenuLi' onclick='showSelectorTimeItem(this);' style='border-bottom:1px solid #bad1de;'>40</li>" +
					"<li class='meetingTypeMenuLi' onclick='showSelectorTimeItem(this);' style='border-bottom:1px solid #bad1de;'>45</li>" +
					"<li class='meetingTypeMenuLi' onclick='showSelectorTimeItem(this);' style='border-bottom:1px solid #bad1de;'>50</li>" +
					"<li class='meetingTypeMenuLi' onclick='showSelectorTimeItem(this);' style='border-bottom:1px solid #bad1de;'>55</li>" +
				"</ul>" +
			"</div>" +
			"<span class='fl pl5 pr5'>分钟</span>"+
			"</td></tr>"+

			"<tr><th>管理员权限&nbsp;</th><td><div class='meeting_input w200'><div onclick='showSelectorMenu(this);' class='meeting_date' name='isadmin'>"+ adminAuthor +"</div><i onclick='showSelectorMenu(this);' class='input_more'></i></div>"+
			"<div class='meeting_input w200' style='position:absolute; margin:1px 0 0 0; display:none;'>" +
				"<ul>" +
					"<li class='meetingTypeMenuLi' onclick='openAdminAuthor(this);' style='border-bottom:1px solid #bad1de;'>是</li>" +
					"<li class='meetingTypeMenuLi' onclick='closeAdminAuthor(this);' style='border-bottom:1px solid #bad1de;'>否</li>" +
				"</ul>" +
			"</div></td></tr>"+

			"<tr><th>客服权限&nbsp;</th><td><div class='meeting_input w200'><div onclick='showSelectorMenu(this);' class='meeting_date' name='isarti'>"+ artiAuthor +"</div><i onclick='showSelectorMenu(this);' class='input_more'></i></div>"+
			"<div class='meeting_input w200' style='position:absolute; margin:1px 0 0 0; display:none;'>" +
				"<ul>" +
					"<li class='meetingTypeMenuLi' onclick='openArtiAuthor(this,\""+ windowId +"\");' style='border-bottom:1px solid #bad1de;'>是</li>" +
					"<li class='meetingTypeMenuLi' onclick='closeArtiAuthor(this,\""+ windowId +"\");' style='border-bottom:1px solid #bad1de;'>否</li>" +
				"</ul>" +
			"</div></td></tr>"+
			
			
			"<tr><th>优先级&nbsp;</th><td><div class='meeting_input w125'><i onclick='incInputNum(this,5);' class='input_num_add'>+</i><input name='priority' type='text' class='meeting_person_num' value='"+ enteruser.priority +"' onblur='checkInputNum(this,1,5)'><i onclick='subInputNum(this,1);' class='input_num_minus'>-</i></div></td></tr>"+
			"<tr><th>服务数量&nbsp;</th><td><div class='meeting_input w125'><i onclick='incInputNum(this,5);' class='input_num_add'>+</i><input name='maxservingnum' type='text' class='meeting_person_num' value='"+ enteruser.maxservingnum +"' onblur='checkInputNum(this,1,5)'><i onclick='subInputNum(this,1);' class='input_num_minus'>-</i></div></td></tr>"+
			"<tr><th>客服自动开关&nbsp;</th><td><div class='meeting_input w200'><div onclick='showSelectorMenu(this);' class='meeting_date' name='isbindtimer'>"+ artiTimer +"</div><i onclick='showSelectorMenu(this);' class='input_more'></i></div>"+
			"<div class='meeting_input w200' style='position:absolute; margin:1px 0 0 0; display:none;'>" +
				"<ul>" +
					"<li class='meetingTypeMenuLi' onclick='openArtiTimer(this,\""+ windowId +"\");' style='border-bottom:1px solid #bad1de;'>开</li>" +
					"<li class='meetingTypeMenuLi' onclick='closeArtiTimer(this,\""+ windowId +"\");' style='border-bottom:1px solid #bad1de;'>关</li>" +
				"</ul>" +
			"</div></td></tr>"+
			
			"<tr><th>登录时间&nbsp;</th><td><div class='meeting_input w100 fl'><input name='loginTime_hour' type='text' class='meeting_time' onblur='checkInputNum(this,0,23)' value='"+ loginHour +"'><i class='input_more'></i></div><span class='fl pl5 pr5'>:</span><div class='meeting_input w100 fl'><input name='loginTime_minute' type='text' class='meeting_time' onblur='checkInputNum(this,0,59)' value='"+ loginMinute +"'><i class='input_more'></i></div></td></tr>"+
			"<tr><th>注销时间&nbsp;</th><td><div class='meeting_input w100 fl'><input name='logoutTime_hour' type='text' class='meeting_time' onblur='checkInputNum(this,0,23)' value='"+ logoutHour +"'><i class='input_more'></i></div><span class='fl pl5 pr5'>:</span><div class='meeting_input w100 fl'><input name='logoutTime_minute' type='text' class='meeting_time' onblur='checkInputNum(this,0,59)' value='"+ logoutMinute +"'><i class='input_more'></i></div></td></tr>"+
			"<tr><th></th><td><input type='button' value='修改' class='btn_blue' onclick='startToModifyBusinessDeploy(\""+windowId+"\","+enteruser.id+",\""+ username +"\")'>"+
			"<input type='button' value='关闭' class='btn_red' onclick='closeWindow(\""+windowId+"\")'></td></tr></table></div></div>");
    $(win).append(winBody);

    //根据所有开关，决定初始显示哪些信息
    toggleItemDetail(windowId);
    
	//设置对话框可拖动
	dragWindow(winHeadId, win);
};
var startToModifyBusinessDeploy = function(windowId,enteruserId,username)
{
	//获取并验证合法性
	maxcalltime_hour = $("#"+windowId).find("input[name='maxcalltime_hour']").val().trim();
	maxcalltime_minute = $("#"+windowId).find("input[name='maxcalltime_minute']").val().trim();
	isadmin = $("#"+windowId).find("div[name='isadmin']").text();
	isarti = $("#"+windowId).find("div[name='isarti']").text();
	priority = $("#"+windowId).find("input[name='priority']").val().trim();
	maxservingnum = $("#"+windowId).find("input[name='maxservingnum']").val().trim();
	isbindtimer = $("#"+windowId).find("div[name='isbindtimer']").text();
	loginTime_hour = $("#"+windowId).find("input[name='loginTime_hour']").val().trim();
	loginTime_minute = $("#"+windowId).find("input[name='loginTime_minute']").val().trim();
	logoutTime_hour = $("#"+windowId).find("input[name='logoutTime_hour']").val().trim();
	logoutTime_minute = $("#"+windowId).find("input[name='logoutTime_minute']").val().trim();
	
	deploy = {
		id:enteruserId,
		maxcalltime : maxcalltime_hour == "不限" || maxcalltime_minute == "不限" ? -1 : calLimitCallTime(maxcalltime_hour,maxcalltime_minute),
		isadmin : isadmin == "是" ? 1 : 0,
		isarti : isarti == "是" ? 1 : 0 ,
		isbindtimer :  isbindtimer == "开" ? 1 : 0,
		priority : priority,
		maxservingnum : maxservingnum,
		loginTime : calCatTime(loginTime_hour,loginTime_minute),
		logoutTime : calCatTime(logoutTime_hour,logoutTime_minute)
	};

	$.ajax({
		type:"post",
		url:"/Enterprise/businessdeploy/modify",
		data:deploy,
		success: function(data)
		{
			if(data.result=="success")
			{
				//检测当前中间的联系人里面有没有id为刚才修改过的那人的
				$("#list_businessdeploy table tbody tr:not(:first)").each(function(){

					if($(this).attr("enteruserId") == enteruserId)	//若有
					{
						tds = $(this).children("td");
						
						//更新配置表中该项的所有字段
						tds.eq(1).text(deploy.maxcalltime == -1 ? "不限" : deploy.maxcalltime);
						tds.eq(2).text(isadmin);
						tds.eq(3).text(isarti);
						tds.eq(4).text(deploy.priority);
						tds.eq(5).text(deploy.maxservingnum);
						tds.eq(6).text(deploy.loginTime);
						tds.eq(7).text(deploy.logoutTime);

						//统一时间格式
						deploy.loginTime = "1970-01-01T" + deploy.loginTime;
						deploy.logoutTime = "1970-01-01T" + deploy.logoutTime;
						
						//更新修改链接里面的enteruser JSON对象
						deployStr = JSON.stringify(deploy).replace(/"/g,'!@#');
						tds.eq(8).children("a").attr("onclick","showModifyBusinessDeployWindow(\""+ username +"\",\""+ deployStr +"\")");

						return false; //跳出
					}
				});
			
				closeWindow(windowId); //关闭窗口
				$.fillTipBox({type:'info', icon:'glyphicon-info-sign', content:'修改业务配置成功!'})
			}
		}
	});
};

//通过分钟数计算小时数(130-->1)
var getLimitCallHour = function(minutes)
{
	if(minutes == -1)
		return "不限";
	
	return parseInt(Number(minutes) / 60);
};

//通过分钟数计算余下分钟数(130-->10)
var getLimitCallMinute = function(minutes)
{
	if(minutes == -1)
		return "不限";
	
	return Number(minutes) % 60;
};

//通过小时数hour和分钟数minute计算总分钟数
var calLimitCallTime = function(hour,minute)
{
	return Number(hour)*60+Number(minute);
};
//-----------------------------------------------
//通过时间点拆分出 "时"（17:30 --> 17）
var getHourInTime = function(time)
{
	return time.split(":")[0];
};

//通过时间点拆分出"分"（17:30 --> 30）
var getMinuteInTime = function(time)
{
	return time.split(":")[1];
};

//通过小时hour和分钟minute拼接成总时间
var calCatTime = function(hour,minute)
{
	return hour + ":" + minute + ":" + "00";
};

/**
 * 表单控件共用操作(selector,+,-)
 */
//显示element控件最近邻的下拉筛选菜单（普通开关）
var showSelectorMenu = function(element)
{
	$(element).parent(".meeting_input.w200").next().toggle();
};
//显示element控件最近邻的下拉筛选菜单（时间开关）
var showSelectorTimeMenu = function(element)
{
	$(element).parent(".meeting_input.w100").next().toggle();
};

//把选项element的内容显示到正式控件里面（普通开关）
var showSelectorItem = function(element)
{
	content = $(element).text();
	$(element).parents(".meeting_input.w200").siblings().eq(0).children("div.meeting_date").text(content);
	$(element).parents(".meeting_input.w200").toggle();
	
};
//把选项element的内容显示到正式控件里面（时间开关）
var showSelectorTimeItem = function(element)
{
	//获取现在点击的时间
	newtime = $(element).text();

	//获取之前的时限
	limitCallTimeInputs = $(element).parents("tbody").children("tr").eq(1).find(".meeting_time");
	hour = limitCallTimeInputs.eq(0).val();
	minute = limitCallTimeInputs.eq(1).val();

	if(newtime == "不限") //点击不限
	{
		limitCallTimeInputs.eq(0).val("不限");
		limitCallTimeInputs.eq(1).val("不限");
	}
	else //点击数字
	{
		if(hour == "不限" || minute == "不限")
		{
			limitCallTimeInputs.eq(0).val(0);
			limitCallTimeInputs.eq(1).val(0);
		}
	}
	
	$(element).parents(".meeting_input.w100").prev().children("input.meeting_time").val(newtime);
	
	//弹出框消失
	$(element).parents(".meeting_input.w100").toggle();
};

//切换窗口winodwId中所有 “是/否” 、“开/关”（含有meeting_date样式的） 旗下的细节选项
var toggleItemDetail = function(windowId)
{
	$("#"+windowId).find(".meeting_date").each(function(index)
	{
		if(index > 0)
		{
			//获得开关 状态
			content = $(this).text();
			index = $(this).parents("tr").index(); //所在行标
			length = $(this).parents("tbody").children("tr").length; //共几行
			if(content == '否' || content == '关') //隐藏该选项旗下的深入配置
			{
				$(this).parents("tbody").children("tr").slice(index+1,length-1).hide();
				return false; //跳出，后面的开关已无用，不再探测
			}
			else if(content == '是' || content == '开') //显示该选项旗下的深入配置
				$(this).parents("tbody").children("tr").slice(index+1,length-1).show();
		}
	});
};


//管理员权限“是”
var openAdminAuthor = function(element)
{
	showSelectorItem(element);
};
//管理员权限“否”
var closeAdminAuthor = function(element)
{
	showSelectorItem(element);
};
//客服权限“是”
var openArtiAuthor = function(element,windowId)
{
	showSelectorItem(element);
	toggleItemDetail(windowId);
};
//客服权限“否”
var closeArtiAuthor = function(element,windowId)
{
	showSelectorItem(element);
	toggleItemDetail(windowId);
};
//客服自动开关“开”
var openArtiTimer = function(element,windowId)
{
	showSelectorItem(element);
	toggleItemDetail(windowId);
};
//客服自动开关“关”
var closeArtiTimer = function(element,windowId)
{
	showSelectorItem(element);
	toggleItemDetail(windowId);
};

//点击加号element（合法上限：max）
var incInputNum = function(element,max)
{	
	//input框
	inputBox = $(element).next();
	num = inputBox.val();
	num++
	if(num > max)
	{
		$.fillTipBox({type:'warning', icon:'glyphicon glyphicon-warning-sign', content:"数量超出合法范围!"});
		return;
	}
	inputBox.val(num);
};
//点击减号element（合法下限：min）
var subInputNum = function(element,min)
{
	//input框
	inputBox = $(element).prev();
	num = inputBox.val();
	num--
	if(num < min)
	{
		$.fillTipBox({type:'warning', icon:'glyphicon glyphicon-warning-sign', content:"数量超出合法范围!"});
		return;
	}
	
	inputBox.val(num);
};
//实时监测输入框数字的合法性（合法上限：max,合法下限：min）
var checkInputNum = function(element,min,max)
{
	//input框
	inputBox = $(element);
	num = inputBox.val();
	
	if(!isDigit(num))
	{
		$.fillTipBox({type:'warning', icon:'glyphicon glyphicon-warning-sign', content:"请输入纯数字"});
		num = min;
	}
	else 
	{
		if(num < min)
		{
			$.fillTipBox({type:'warning', icon:'glyphicon glyphicon-warning-sign', content:"数量超出合法范围!"});
			num = min;
		}
		else if(num > max)
		{
			$.fillTipBox({type:'warning', icon:'glyphicon glyphicon-warning-sign', content:"数量超出合法范围!"});
			num = max;
		}	
	}
	
	inputBox.val(num);
};

//验证是否为纯数字
var isDigit = function(str)
{
	reg = /^[0-9]*$/;
	return reg.test(str);
};

/**
 * 访问用户选项卡
 */
//创建访问用户容器
var createPostcardDivContainer = function(Prefix)
{
	return $("<div id='"+ Prefix +"'><div class='mail_list'><ul></ul></div></div>");
};

//创建明信片（访问用户）
var createArtiUserPostcardDiv = function(clientname)
{
	return $("<li>\
			     <div class='list_portrait'><img src='images/img/portrait65_2.jpg' /></div>\
				 <div class='list_text'>\
					 <h3>临时用户</h3>\
					 <p>"+ clientname +"</p>\
					 <p><a href='javascript:void(0);' onclick='serve(this,\""+clientname+"\")'>服务</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;<a href='javascript:void(0);' onclick='finish(\""+clientname+"\")'>完成</a></p>\
				 </div>\
			  </li>");
};

//添加访问用户
var addArtiUser = function(artiUserUl,clientname)
{	
	var postcardDiv = createArtiUserPostcardDiv(clientname);
	artiUserUl.append(postcardDiv);
};

//删除访问用户
var removeArtiUser = function(element,clientname)
{
	$(element).parents('li').remove();
	clients.remove(clientname); //从数组移除
};

//删除访问用户的对话框+活动列表
var removeArtiUserActiveListAndWindow = function(clientname)
{
	activeItem = getActiveList(clientname,MessagePrefix);
	if(activeItem != null)
	{
		subNumInHeadTips(clientname,MessagePrefix); //顶部减去sub
		clearNumInActiveListItem(clientname, MessagePrefix);//自身清空不显示
		activeItem.remove();//删除会话列表对应项
	}
	
	chatBox = document.getElementById( MessagePrefix + clientname);
	if(chatBox != null) chatBox.remove();//删除对话框
};

//选中访问用户(方便人工总机服务完成后点击完成)
var selectArtiUser = function(element)
{
	//之前选中的清空
	$(element).parents('li').siblings().removeClass('on');
	
	//该项选中
	$(element).parents('li').addClass('on');
};

//点击“服务”
var serve = function(element,clientname)
{
	//该用户的明信片被选中
	selectArtiUser(element);
	
	//创建并弹出ActiveList、聊天框
	openServingWindow(clientname);
};

//打开服务窗口
var openServingWindow = function(clientname)
{
	var newContent = getContactChatDiv(clientname);
	if(newContent == null)
	{
		newContent = createArtiUserChatDiv(clientname);
		document.getElementById("web").appendChild(newContent); //加入
		newContent.setAttribute("style","display:none;"); //隐藏
	}
	createActiveList(clientname,MessagePrefix); // 但左侧活动会话列表需要生成、显示
	chooseShowDivType(clientname,MessagePrefix); //强制触发打开activeList操作
};

//点击“完成”
var finish = function(clientname)
{
	//发送FINISH消息至WCS
	sendActionToArti("FINISH",clientname);
};

/**
 * ActiveList选项卡
 */
//新建客服与外部用户聊天功能区界面
var createArtiUserChatDiv = function(chatFriendId) {
	var Div = MessagePrefix + chatFriendId;
	
	var newContent = document.createElement("div");
	newContent.setAttribute("id", Div);
	
	var switchboardBox = $("<div class='switchboard_box'></div>");
	$(newContent).append(switchboardBox);
	
	var chatHead = $("<div class=\"chat_head\"><h2 onclick=\"FriendModalFunctionArea\('"+ chatFriendId+ "'\);\">"+ chatFriendId +"</h2></div>");
	switchboardBox.append(chatHead);

    /*************对话框头部***************************************/ 
	var chatHeadRight = $("<div class=\"chat_head_operation\">"+ 
		                  "<ul><li class='operation_close' onclick=\"hideChatDiv\('"+ chatFriendId+ "'\);\">关闭</li>"+
                          "<li class='operation_video' onclick=\"createCallVideoPageBefore\('"+ chatFriendId+ "'\);\">发起视频</li>"+
                          "<li class='operation_audio' onclick=\"createCallAudioPageBefore\('"+ chatFriendId+ "'\);\">发起音频</li>"+
                          "<li class='operation_file'><input type='file' id='files"+ chatFriendId +"' "+
                          "name='files[]' onchange=\"CallFilesBefore(this,this.files,'"+ chatFriendId +"');\" multiple /></li>"+
						  "</ul></div>");
              //            "<li class='operation_file'><input style='display:none;' type='file' id='files' name='files[]' onchange=\"CallFilesBefore(this.files,'"+chatFriendId+"');\" multiple /></li></ul></div>");
						  //"<li class='operation_file'>传送文件</li></ul></div>");
	chatHead.append(chatHeadRight);

	/** ****************对话框内容*********************************/
	var switchboardBoxLeft = $("<div class='switchboard_box_l'></div>");
	var switchboardBoxRight = $("<div class='switchboard_box_r'></div>");
	switchboardBox.append(switchboardBoxLeft);
	switchboardBox.append(switchboardBoxRight);
	
	var chatListBox = $("<div id=\"" + chatFriendId + "front\" class='chat_list_box'></div>");
	switchboardBoxLeft.append(chatListBox);
    switchboardBoxLeft.append(chatListBox);
   
    var inputChatBox = $("<div class='input_chat_box'>");
    switchboardBoxLeft.append(inputChatBox);

    var inputTextArea = $("<textarea id=\"" + chatFriendId
			          + "message\" name='' cols='' rows='' class='input_text' onkeydown='checkEnterDown(\""+chatFriendId+"\")'></textarea>");
    inputChatBox.append(inputTextArea);

    var inputFace = $("<div class='input_chat_edit'>"+
 //                "<ul class='input_chat_edit_l'><li class='icon_history'>查看历史对话</li>"+
    		"<ul class='input_chat_edit_l'><li class='icon_history' onclick='createMyChatHistory(\""+ chatFriendId +"\")'></li></ul>"+
//                  "<li class='icon_face'>选择表情</li>"+
//                  "<li class='icon_font_size'>文字大小</li>"+
//                  "<li class='icon_color'>文字颜色</li></ul>"+
                  "<div class='input_chat_edit_r'>"+
                  "<input id=\""+chatFriendId+"sendBtn\" type='button' onclick=\"sendText\('"+ 
                  	chatFriendId + "'\);\" value='发送' class='send_out btn_blue'/></div></div>");
    inputChatBox.append(inputFace);
    
    
    //右侧上方“常用语选项卡”
    artiCommonWordTabs = $("<div class='rtc_tab'>\
    				<ul class='tab3'>\
    					<li class='on' onclick='showCommonWordList(this);'>常用文本</li>\
    					<li onclick='showCommonLinkList(this);'>常用链接</li>\
    				</ul>\
    			  </div>");
    switchboardBoxRight.append(artiCommonWordTabs);
    
    //右侧下方“常用语列表”
    artiCommonWordList = $("<div class='friend_list_box'>\
    							<ul id='list_commonword' class='friend_list'>\
    								<li onclick='sendCommonWord(this,\""+chatFriendId+"\")'><span class='friend_name' style='width:250px;font-size:13px;margin-left:20px;' title='请问您有什么需要帮助的吗?'>请问您有什么需要帮助的吗?</span></li>\
    								<li onclick='sendCommonWord(this,\""+chatFriendId+"\")'><span class='friend_name' style='width:250px;font-size:13px;margin-left:20px;' title='嗯，这个问题我们内部正在尽力解决。'>嗯，这个问题我们内部正在尽力解决。</span></li>\
    								<li onclick='sendCommonWord(this,\""+chatFriendId+"\")'><span class='friend_name' style='width:250px;font-size:13px;margin-left:20px;' title='好的，请稍等，好了通知您。'>好的，请稍等，好了通知您。</span></li>\
    								<li onclick='sendCommonWord(this,\""+chatFriendId+"\")'><span class='friend_name' style='width:250px;font-size:13px;margin-left:20px;' title='您好，没什么问题的话，我这边就先关闭会话啦，祝您生活愉快。'>您好，没什么问题的话，我这边就先关闭会话啦，祝您生活愉快。</span></li>\
    							</ul>\
    							<ul id='list_commonlink' class='friend_list' style='display:none;'>\
    								<li onclick='openSendEmailModal()'><span class='friend_name' style='width:250px;font-size:13px;margin-left:20px;' title='发送账号'>发送账号</span></li>\
    								<li><span class='friend_name' style='width:250px;font-size:13px;margin-left:20px;' title='感谢您的来访，请您对本次服务评价：非常满意  满意  一般  不满意  非常不满意'>感谢您的来访，请您对本次服务评价：非常满意  满意  一般  不满意  非常不满意</span></li>\
    							</ul>\
    						</div>");
    switchboardBoxRight.append(artiCommonWordList);
    
	return newContent;
};

//显示常用文本
var showCommonWordList = function(element)
{
	$(element).siblings().removeClass('on');
	$('#list_commonlink').hide();
	
	$(element).addClass('on');
	$('#list_commonword').show();
};

//显示常用连接
var showCommonLinkList = function(element)
{
	$(element).siblings().removeClass('on');
	$('#list_commonword').hide();
	
	$(element).addClass('on');
	$('#list_commonlink').show();
};

//点击常用语,发送
var sendCommonWord = function(element,chatFriendId)
{
	//获取常用语
	var commonWord = $(element).children('span').text();
	
	//设置输入框中的文本
	setTextToInputBox(chatFriendId,commonWord);
	
	sendText(chatFriendId);
};

//在输入框中设置文本
var setTextToInputBox = function(chatFriendId,message)
{
	//设置输入框中的文本
	var $msgInput=$(document.getElementById(chatFriendId+"message"));
	var msg = $msgInput.val(message);
};

//点击“发送邮箱”常用链接,弹出模态框
var openSendEmailModal = function()
{
	console.log("show sendEmailModal");
	$('#sendEmailModal').modal('toggle');
};

//点击“发送”按钮
var sendEmail = function()
{
	//判断输入的邮箱格式是否正确
	email = $("#sendEmailId").val().trim();
	if(email == "")
	{
		$.fillTipBox({type:'warning', icon:'glyphicon glyphicon-warning-sign', content:"请输入邮箱!"})
		return;
	}
	
	if(!isEmail(email))
	{
		$.fillTipBox({type:'warning', icon:'glyphicon glyphicon-warning-sign', content:"邮箱格式不正确!"})
		return;
	}
	
	//发送邮箱至外部用户chatFirendId
	//构建查询到的账号链接：webrtc6@163.com 呼叫
	eid = $("#eid").val();
	ename = $("#ename").val();
	message = email + "&nbsp;<a href='enterchat?chatFriendId="+email+"&eid="+eid+"&ename="+ename+"' style='text-decoration:underline;'>呼叫</a>";
	chatFriendId = globalCur.split(MessagePrefix)[1];

	setTextToInputBox(chatFriendId,message);
	sendText(chatFriendId);
	
	//关闭模态框
	$('#sendEmailModal').modal('hide');
};

//判断是否是email
var isEmail = function(str){
    var reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    return reg.test(str);
};

/**
 * 共用
 */

//找到val对应数组元素下标
Array.prototype.indexOf = function(val) {
	for (var i = 0; i < this.length; i++) {
	if (this[i] == val) return i;
	}
	return -1;
};

//删除val对应数组元素
Array.prototype.remove = function(val) {
	var index = this.indexOf(val);
	if (index > -1) {
	this.splice(index, 1);
	}
};

//获取clientname对应的那个“完成”标签
var getFinishElementA = function(clientname)
{
	var index = clients.indexOf(clientname);
	artiUserUl = $('#' + ArtiUserPrefix).find(".mail_list ul");
	element_a = artiUserUl.children("li").eq(index).find(".list_text p").eq(1).children("a").eq(1);
	
	return element_a;
};

//去掉后端返回的时间中的T
var deleteBeforeT = function(datetime)
{
	if(datetime == null || datetime == "")
		return datetime;
	
	separates = datetime.split("1970-01-01T");
	return separates[1];
};

//根据当前中间的窗口prefix && 按下的控件element的class，确定下个要跳转的目标页
var findTargetPage = function(element,prefix)
{
	//根据element获取需要查找的页码信息
	spans = $("#"+prefix).find(".bottom_operation_r span");
	var page; //下次的目标页
	var pageNow = spans.eq(3).children('input').val(); //获取当前页
	var pageEnd = spans.eq(5).text(); //获取最后一页

	switch($(element).attr("class"))
	{
		case "on":
		case "group_h2 on":
		case "page_first":page = 1;break;
		case "page_end":page = pageEnd;break;
		case "page_up":page = Number(pageNow) - 1;page = page < 1 ? 1 : page;page = page > pageEnd ? pageEnd : page;break;//检测是否超过合法页数范围
		case "page_next":page = Number(pageNow) + 1;page = page < 1 ? 1 : page;page = page > pageEnd ? pageEnd : page;break;
	}
	
	return page;
};

//更新页码
var updatePageBar = function(prefix,page,total)
{
	//更新页码条内容
	spans = $("#"+prefix).find(".bottom_operation_r span");
	spans.eq(3).children("input").val(page); //当前页
	spans.eq(5).text(total); //总页数	
};