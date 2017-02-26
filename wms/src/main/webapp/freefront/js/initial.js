//引入facebox插件
if( $('a[rel*=facebox]').length > 0 && "undefined" == typeof(facebox_start) ){
	$.getScript(baseAddr + "js/plugin/facebox.js",function(){
		facebox_start("facebox");
	});
}
//引入首页幻灯片插件
if( $('.lof-slidecontent').length > 0 ){
	$.getScript(baseAddr + "js/plugin/slider.js");
}

//引入验证码插件
if($("#checkCode").length > 0 && "undefined" == typeof(createCode)){
	$.getScript(baseAddr + "js/plugin/captchas.js");
}
//引入vertical menu插件
if( $('.webwidget_vertical_menu').length > 0 && "undefined" == typeof(vertical_menu_start) ){
	$.getScript(baseAddr + "js/plugin/vertical_menu.js");
}
//引入shareto_button
if( $('.shareto_button').length > 0 ){
	$.getScript(baseAddr + "js/plugin/shareto_button.js");
}

//引入jp-container插件
//if( $('#jp-container').length > 0 ){
//	$.getScript(baseAddr + "js/plugin/scroll.js");
//}

//引入highchart插件，要求，所用的id必须带有highchart字样
if($('div[id*="highchart"]').length > 0){
	$.getScript(baseAddr + "js/plugin/highcharts.js");
}
//引入userAutoTips插件
function userAutoTips(args){
	if( "undefined" == typeof(userAutoTipsReady) ){
		$.getScript(baseAddr + "js/plugin/userAutoTips.js",function(){
			userAutoTipsReady(args);
		});
	}else{
		userAutoTipsReady(args);
	}
}

//加载选择群组/加入列表的方法文件（initall是使用这个文件必须是用的第一个方法）
function initall(nohistorymsg, grouplist, selectedId){
	if(undefined == selectedId){
		selectedId = "selectedvalue";
	}
	if( "undefined" == typeof(initallAddGroup) ){
		$.getScript(baseAddr + "js/plugin/addgroup.js",function(){
			initallAddGroup(nohistorymsg, grouplist, selectedId);
		});
	}else{
		initallAddGroup(nohistorymsg, grouplist, selectedId);
	}
}

//引入好友列表插件
function loadFriendList(){
	$.getScript(baseAddr + "js/plugin/myfriend.js");
}

//加载工具条插件
function loadToolBar(param){
	if('undefined' == typeof(toolBar)){
		$.getScript(baseAddr + "js/plugin/toolbar.js",function(){
			toolBar.loadToolBar(param);
		});
	}else{
		toolBar.loadToolBar(param);
	}
}

/*
*复制到剪贴板
*/
function prepareCopy(clipbutton, container, text) {//button“复制”的ID，复制的内容所在的ID，复制的内容 
    if('undefined'== typeof(initClip)){
    	$.getScript(baseAddr + "js/plugin/zeroClipboard.js",function(){
    		//console.log("initClip");
    		initClip(clipbutton, container, text);
    	});
    }else{
    	//console.log("initClip");
		initClip(clipbutton, container, text);
    }   
}

function loadJpMenu(url, param){
	if( "undefined" == typeof(autoHideShowFn)) {
		$.getScript( baseAddr + "js/plugin/scroll.js",function(){
			loadJpMenu_start(url,param);
		});
	}
	else{
		loadJpMenu_start(url,param);
	}
};

(function($) {
	//后加载的facebox插件，要求是必须有rel这个属性
	$.fn.facebox = function(){
		var rel = $(this).attr("rel");
		if( "undefined" == typeof(facebox_start) ){
			$.getScript( baseAddr + "js/plugin/facebox.js",function(){
				facebox_start(rel);
			});
		}else{
			facebox_start(rel);
		}
	};
	
	//后加载的helpcontent插件，只会后加载
	$.fn.helpcontent_show = function(option1,option2){
		var $this = $(this);
		if( "undefined" == typeof(helpcontent_show_start) ){
			$.getScript( baseAddr + "js/plugin/helpcontent.js",function(){
				$this.helpcontent_showReady(option1,option2);
			});
		}else{
			$this.helpcontent_showReady(option1,option2);
		}
	};
	//后加载的树形插件，只会后加载
	$.fn.initZtree = function(obj,zSetting,zNodes){
		if( "undefined" == typeof(zTree) ){
			$.getScript( baseAddr + "js/plugin/jquery.ztree.core-3.5.js",function(){
				$.fn.zTree.init(obj,zSetting,zNodes);
			});
		}else{
			$.fn.zTree.init(obj,zSetting,zNodes);
		}
	};
	
	//后加载的daterangepicker插件
	$.fn.daterangepicker = function(options){
		var $this = $(this);
		if( "undefined" == typeof(daterangepicker_start)) {
			$.getScript( baseAddr + "js/plugin/jquery-ui-1.7.1.custom.min.js",function(){
				$.getScript( baseAddr + "js/plugin/daterangepicker.js",function(){
					$this.daterangepickerReady(options);
				});
			});
		}
		else{
			$this.daterangepickerReady(options);
		}
	};
	
	//引入jphotogrid，目前只在about us 页面有，而且使用的时候需要写jphotogrid函数，故只考虑后加载的情况
	$.fn.jphotogrid = function(options){
		var $this = $(this);
		if( "undefined" == typeof(jphotogrid_start)) {
			$.getScript( baseAddr + "js/plugin/jphotogrid.js",function(){
				$this.jphotogridReady(options);
			});
		}
		else{
			$this.jphotogridReady(options);
		}
	};
	
	//引入adGallery，目前只在about us 页面有，而且使用的时候需要写adGallery函数，故只考虑后加载的情况
	$.fn.adGallery = function(){
		var $this = $(this);
		if( "undefined" == typeof(adgallery_start)) {
			$.getScript( baseAddr + "js/plugin/adgallery.js",function(){
				$this.adGalleryReady();
			});
		}
		else{
			$this.adGalleryReady();
		}
	};
	
	//后加载的vertical_menu插件，要求是必须用webwidget_vertical_menu这个class
	$.fn.webwidget_vertical_menu = function(){
		if( "undefined" == typeof(vertical_menu_start) ){
			$.getScript(baseAddr + "js/plugin/vertical_menu.js",function(){
				vertical_menu_start();
			});
		}else{
			vertical_menu_start();
		}
	};
	//文件上传插件的引用
	$.fn.fileUploadUI = function(method, type){
		if( type == undefined ){
			type = "id";
		}
		var typeValue = $(this).attr(type);
		
		if("undefined" == typeof(fileUploadUIReady)){
			$.getScript(baseAddr + "js/plugin/fileupload.js",function(){
				$("[" + type + "=" + typeValue + "]").fileUploadUIReady(method);
			});
		}else{
			$("[" + type + "=" + typeValue + "]").fileUploadUIReady(method);
		}
	};
	//输入框智能拉伸插件的引用
	$.fn.tah = function(opt, type){
		if( type == undefined ){
			type = "id";
		}
		var typeValue = $(this).attr(type);
		
		if( "undefined" == typeof(tah_start) ){
			$.getScript(baseAddr + "js/plugin/input.js",function(){
				$("[" + type + "=" + typeValue + "]").tahReady(opt);
			});
		}else{
			$("[" + type + "=" + typeValue + "]").tahReady(opt);
		}
	};
	//提示框插件的引用
	$.fn.tipbox = function(options, type){
		if( type == undefined ){
			type = "id";
		}
		var typeValue = $(this).attr(type);
		if( "undefined" == typeof(tipbox_start) ){
			$.getScript(baseAddr + "js/plugin/tipbox.js",function(){
				$("[" + type + "=" + typeValue + "]").tipboxReady(options);
			});
		}else{
			$("[" + type + "=" + typeValue + "]").tipboxReady(options);
		}
	};
})(jQuery);
