/*
 * testbrower.js: test brower, avoid IE6 or IE7
 * author		: lmqt(lmqt890930@163.com)
 * last_modify	: 2012-5-4 by lmqt(lmqt890930@163.com)
 */

//以下两个对象是检测浏览器名字及版本号所必须的
var browserName = navigator.userAgent.toLowerCase();
var mybrowser = {
	ie11: browserName.indexOf("trident")>-1 && browserName.indexOf("rv")>-1?true:false,
    msie: /msie/i.test(browserName) && !/opera/.test(browserName),
    mozilla: /mozilla/i.test(browserName) && !/(compatible|webkit)/.test(browserName) && !this.chrome,
    chrome: /chrome/i.test(browserName) && /webkit/i.test(browserName) && /mozilla/i.test(browserName)
};
var bVersionNum = "";
window.ActiveXObject ? bVersionNum = browserName.match(/msie ([\d.]+)/)[1] :
    browserName.indexOf('firefox')>-1 ? bVersionNum = browserName.match(/firefox\/([\d.]+)/)[1] :
    window.MessageEvent && !document.getBoxObjectFor && browserName.indexOf('chrome')>-1 ? 
    bVersionNum = browserName.match(/chrome\/([\d.]+)/)[1] :
    window.opera ? bVersionNum = browserName.match(/opera.([\d.]+)/)[1] :
    window.openDatabase ? bVersionNum = browserName.match(/version\/([\d.]+)/)[1] : 0;
// 页面加载时运行以下if判断语句
$(document).ready(function(){
	if(mybrowser.ie11) bVersionNum = "11";
    if((mybrowser.msie && !StringCompare(bVersionNum,"9")) || (mybrowser.mozilla && 
    		!StringCompare(bVersionNum,"3.0.19")) || (mybrowser.chrome && 
    				!StringCompare(bVersionNum,"0.2.149.27"))){
    	if($(".pub_banner").attr("class") == "pub_banner"){
    		$(".pub_banner").after("<div id=\"browerbox\"></div>");
    	}else if($(".indexbg").attr("class") == "indexbg"){
    		$(".indexbg").prepend("<div id=\"browerbox\"></div>");
    	}
        var mytip = {
				title:"您的浏览器版本过低",
				/*content:"本页面未针对IE8及以下版本进行优化，建议使用IE9及以上版本、Chrome0.2.149.27及以上版本" +
						"或Firefox浏览器3.0.19.0及以上版本！",*/
				content:"本页面未针对IE8及以下版本进行优化，推荐您使用Chrome浏览器！" +
						"<div class='rightalign'><a class='blueletter' href='"+baseAddr+"prompt.jsp"+
						"'>更新浏览器</a></div>如您使用360、搜狗等浏览器请切换到“极速/高速" +
					    "<image src=\""+baseAddr+"images/lighting1.png\" width='10px' height='13px'>"+"”模式。" +
					    "<div class='rightalign'><a class='blueletter' href='"+baseAddr+"prompt.jsp#360"+
						"'>如何切换？</a></div>",
				hasclose:false
		};
		$("#browerbox").tipbox(mytip);
    }     
});

function StringCompare(a, b){//a>b为true
	if(a == ""){
		return false;
	}
	var strs1= new Array(); //定义一数组
	strs1=a.split("."); //字符分割
	var strs2= new Array(); //定义一数组
    strs2=b.split("."); //字符分割
    if(strs1.length >= strs2.length){
    	for (var i=0;i<strs1.length;i++ ) { 
            if(i<strs2.length){
            	if(parseInt(strs1[i])>parseInt(strs2[i])){
            		return true;
            	}else if(parseInt(strs1[i])<parseInt(strs2[i])){
            		return false;
            	}
            }else{
            	return true;
            }
        }
    }else{
    	for (var i=0;i<strs2.length;i++ ) {   
    		if(i<strs1.length){
                if(parseInt(strs2[i])>parseInt(strs1[i])){
                    return false;
                }else if(parseInt(strs2[i])<parseInt(strs1[i])){
                    return true;
                }
            }else{
                return false;
            }
        }
    }
	 
}