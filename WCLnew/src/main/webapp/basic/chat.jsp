<!DOCTYPE html>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="java.util.*"%>
<%@ taglib prefix="s" uri="/struts-tags"%>

<html>
<head>

  <meta name="viewport"  content="width=device-width,  initial-scale=1"  charset="UTF-8">  
 
<title>好友</title>  
<link rel="shortcut icon" href="images/favicon.ico" />
</head>
<body> 
<div data-role="page"id="e2">   
    <div data-role="header"  id="h1header" data-position="fixed" data-tap-toggle="false" data-theme="b"> 
    <a data-role="button" href="#e1" class="ui-btn-left">返回</a> 
        <h1>会话中</h1>  
          <input type="button" value="删除该好友"  class="ui-btn-right" onclick="deletefriend()"/> 
       
    </div>  
    <div data-role="content" id="c1" >  
    </div>
    <div data-role="content" id="h1video" style="display:none">
      <video class="front-video" id="local_media" 
          autoplay="autoplay"></video>
          <video class="behind-video" id="remote_media" autoplay="autoplay" sytle=""></video>
    </div> 
   <div data-theme="b" id="h1footer" data-role="footer" data-position="fixed">
        <div data-role="fieldcontain">
         
            <input name="" id="textinput7" placeholder="" value="" type="text" >
    <!--        <div sytle="float:right;" data-type="horizontal" data-role="controlgroup">
<a href="index.html" data-role="button">Call</a>
<a href="index.html" data-role="button"> Send </a>
</div> -->
          <div style="float:right">
             <a data-role="button" href="" data-inline="true" id="h1call" class="" onclick='phoneCall($("#hide").val())'>CALL</a>
           <a data-role="button" href="" class="" data-inline="true" onclick="opendialog()">发送</a>
      </div>
        </div>
         
    </div>
   
</div> 



</body> 

</html>