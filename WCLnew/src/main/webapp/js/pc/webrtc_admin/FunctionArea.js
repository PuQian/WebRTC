/**
 * 点击“首页”
 */
var Home = function(element)
{
	toggleListMenu("recent_calls","rtc_menu",element);//高亮这个菜单项
	turnContainerToCenter2();//更新容器的布局
	showWeb(HomePrefix,"");
};

/**
 * 点击“待审核”
 */
var UnderCheck = function(element)
{
	toggleListMenu("recent_calls","rtc_menu",element);//高亮这个菜单项
	turnContainerToCenter2();//更新容器的布局
	
	//显示中间
	showWeb(UnderCheckPrefix,"");
};

/**
 * 点击“企业通讯录”
 */
var EnContacts = function(element)
{
	toggleListMenu("recent_calls","rtc_menu",element);//高亮这个菜单项
	turnContainerToCenterRight();//更新容器的布局（左右）
	
	if(getRtcCenterDiv(EnContactsPrefix) == null) //第一次点击，生成外壳，以后就都不用生成啦~
	{
		//中间
		var centerContainer = $("#web"); //rtc_box_center
		var enContactsContainer = createEnContactsContainer(EnContactsPrefix);
		centerContainer.append(enContactsContainer);//放入中间布局中
		
		//右边
		var rightContainer = $(".rtc_box_right");
		rightContainer.append(createEnGroupList(1,0));//生成右边的一级分组列表，放入右边布局中
		rightContainer.append(createEngroupListBottom());//生成右边下方的导入、导出条，放入右边布局中
		rightContainer.prepend(createEngroupItem(0)); //生成右边的零级隐藏分组
	}
	
	//显示中间
	showWeb(EnContactsPrefix,"");
};



/**
 * 点击“访问用户”
 */
var ArtiUser = function(element)
{
	toggleListMenu("recent_calls","rtc_menu",element);//高亮这个菜单项
	turnContainerToCenter2();//更新容器的布局
	
	if(getRtcCenterDiv(ArtiUserPrefix) == null) //第一次点击，生成外壳
	{
		var centerContainer = $("#web");
		var postcardDivContainer = createPostcardDivContainer(ArtiUserPrefix);
		centerContainer.append(postcardDivContainer);//放入中间布局中
	}
		
	//放入访问用户
	artiUserUl = $('#'+ArtiUserPrefix).find(".mail_list ul"); //找到ul容器
	artiUserUl.empty(); //清空
	for(var i=0;i<clients.length;i++)
	{
		addArtiUser(artiUserUl,clients[i]);
	}
	
	//显示及处理当前状态
	showWeb(ArtiUserPrefix,"");
};


/**
 * 点击“企业用户”
 */
var EnterUser = function(element)
{
	toggleListMenu("recent_calls","rtc_menu",element);//高亮这个菜单项
	turnContainerToCenter2();//更新容器的布局
	
	if(getRtcCenterDiv(EnterUserPrefix) == null) //第一次点击，生成外壳
	{
		var centerContainer = $("#web");
		var enterUserContainer = createEnterUserContainer(EnterUserPrefix);
		centerContainer.append(enterUserContainer);//放入中间布局中
	}
	
	//显示及处理当前状态
	showWeb(EnterUserPrefix,"");
};

/**
 * 共用
 */

//将外层容器换成横向拉伸的中间布局
var turnContainerToCenter2 = function()
{
	$("#web").removeClass("rtc_box_center");
	$("#web").addClass("rtc_box_center2");
	$(".rtc_box_right").hide();
};

//将外层容器换成中间、右边联合布局
var turnContainerToCenterRight = function()
{
	$("#web").removeClass("rtc_box_center2");
	$("#web").addClass("rtc_box_center");
	$(".rtc_box_right").show();
};

//通过Prefix作为id获取中间部分的Div
var getRtcCenterDiv = function(Prefix) {
	return document.getElementById(Prefix);
};
