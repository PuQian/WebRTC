<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>webRTC 业务主界面</title>
<link href="/WCLnew/css/pc/base.css" rel="stylesheet" type="text/css" />
<link href="/WCLnew/css/pc/common_rtc.css" rel="stylesheet" type="text/css" />
<link href="/WCLnew/css/pc/rtc_index.css" rel="stylesheet" type="text/css" />
</head>

<body>
<!--头部 菜单-->
<div class="rtc_head_box">
  <div class="rtc_head"> 
    <!--用户信息-->
    <div class="user_info">
      <div class="portrait"><img src="images/img/portrait65_1.jpg" width="65" height="65" /></div>
      <h1 class="user_name">小嘟嘟</h1>
      <i class="user_role">管理员</i>
      <div class="head_tips">
        <ul>
          <li><a href="#"><img src="images/rtc_head_tips1.png" width="32" height="32" /><i class="num">1</i></a></li>
          <li><a href="#"><img src="images/rtc_head_tips2.png" width="32" height="32" /><i class="num">2</i></a></li>
          <li><a href="#"><img src="images/rtc_head_tips3.png" width="32" height="32" /><i class="num">...</i></li></li>
        </ul>
      </div>
    </div>
    <!--用户信息-end--> 
    <!--右侧操作-->
    <div class="rtc_head_right">
      <ul>
        <li class="head_help"><a href="#">帮助</a></li>
        <li class="head_exit"><a href="#">退出</a></li>
      </ul>
    </div>
    <!--右侧操作 end--> 
  </div>
</div><!--endofrtchead-->
<!--头部 菜单 end--> 

<!--主体-->
<div class="rtc_box"> 
  <!--左-->
  <div class="rtc_box_left"> 
    <!--左 菜单-->
    <div class="rtc_menu">
      <ul>
        <li><i><img src="images/rtc_menu_icon1.png" width="50" height="50" /></i><a href="#">Web电话</a></li>
        <li><i><img src="images/rtc_menu_icon2.png" width="50" height="50" /></i><a href="#">Web会议</a></li>
        <li><i><img src="images/rtc_menu_icon3.png" width="50" height="50" /></i><a href="#">视频分享</a></li>
        <li><i><img src="images/rtc_menu_icon4.png" width="50" height="50" /></i><a href="#">历史记录</a></li>
      </ul>
    </div>
    <!--左 菜单 end--> 
    
    
    
  </div>
  <!--左 end--> 
  
  <!--中-->
  <div class="rtc_box_center"> 
    <!--中 欢迎与提示-->
    <div class="rtc_index_welcome">
      <h2>嗨，小嘟嘟，欢迎回来~~</h2>
      <p><a href="#">未接来电（<strong>1</strong>）</a><a href="#">Web会议（<strong>9</strong>）</a><a href="#">好友信息（99+）</a></p>
    </div>
    <!--中 欢迎与提示 end--> 
    
    <!--中 功能介绍-->
    <div class="rtc_index_function">
      <ul>
        <li>
          <div class="li_img"><img src="images/rtc_index_function1.png" width="75" height="75" /></div>
          <div class="li_text">
            <h3>音视频通话</h3>
            <p>免费通话<br />
              无需插件，一键发起</p>
          </div>
        </li>
        <li>
          <div class="li_img"><img src="images/rtc_index_function2.png" width="75" height="75" /></div>
          <div class="li_text">
            <h3>视频会议</h3>
            <p>即时会议，预约会议</p>
          </div>
        </li>
        <li>
          <div class="li_img"><img src="images/rtc_index_function3.png" width="75" height="75" /></div>
          <div class="li_text">
            <h3>视频分享</h3>
            <p>通过二维码<br />
              进行视频链接分享</p>
          </div>
        </li>
        <li>
          <div class="li_img"><img src="images/rtc_index_function4.png" width="75" height="75" /></div>
          <div class="li_text">
            <h3>历史记录</h3>
            <p>电话、会议、视频记录<br />
              所有记录快捷回顾</p>
          </div>
        </li>
      </ul>
    </div>
    <!--中 功能介绍 end--> 
  </div>
  
  <!--中 end--> 
  
  <!--右-->
  <div class="rtc_box_right"> 
    <!--右 搜索框--> 
    <div class="friend_search"><span class="search_tips">提示</span></div>
    <!--右 搜索框 end--> 
    
    <!--右 3段标签--> 
    <div class="friend_tab"><ul class="tab3">
    <li class="on"><i class="tab_li1"></i><a href="#">好友</a></li>
    <li><i class="tab_li2"></i><a href="#">群组</a></li>
    <li><i class="tab_li3"></i><a href="#">通讯录</a></li>
    </ul></div>
    <!--右 3段标签 end--> 
    
    <!--右 好友列表 空--> 
    <div class="friend_list_box">
    
    <div class="friend_list_none">
    <div class="li_img"><img src="images/rtc_right_none1.png" width="60" height="60" /></div>
    <p>您还没有好友</p>
    <a href="#">添加好友</a>
    </div>
      
    </div>
    <!--右 好友列表 空 end--> 
    
  </div>
  
  <!--右 end--> 
</div>
<!--主体 end--> 

<!--底部-->
<div class="rtc_foot_box">
  <div class="foot">
    <p>值电信业务经营许可证A2.B1.B2-20040001 [京网文[2011]0814-291号] | 京ICP备09031924号 </p>
    <p>Copyright © 中国电信集团 版权所有</p>
  </div>
</div>
<!--底部 end-->
</body>
</html>
