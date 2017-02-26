<!DOCTYPE html>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="java.util.*"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<html>
<head>
<title>文件传输</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<style type="text/css">
 #filedrag
{
	display: none;
	font-weight: bold;
	text-align: center;
	padding: 1em 0;
	margin: 1em 0;
	color: #555;
	border: 2px dashed #555;
	border-radius: 7px;
	cursor: default;
}

#filedrag.hover
{
	color: #f00;
	border-color: #f00;
	border-style: solid;
	box-shadow: inset 0 3px 4px #888;
}
</style>
</head>
<body>
	

  <form id="upload" action="upload.php" method="POST" enctype="multipart/form-data">
    <fieldset>
      <legend>HTML File Upload</legend>
      <input type="hidden" id="MAX_FILE_SIZE" name="MAX_FILE_SIZE" value="300000" />
      <div>
        <label for="fileselect">Files to upload:</label>
        <input type="file" id="files" name="files[]"  onchange="com.webrtc.file.handleFiles(this.files)" multiple/>
        <div id="filedrag">or drop files here</div>
      </div>

      <div id="transferbutton">
     <!--    <button type="submit">Upload Files</button> -->
      <input type="button" id="file_share" value="发送文件" onClick="beginFileTransfer()"/>
      </div>
    </fieldset>
  </form>
  
  <div id="messages">
 <!--    <p>Status Messages</p> -->
  </div>
  
  
  
  
  <script>
  //页面加载时初始化的数据
 $(document).ready(function(){
	 var remoteUserId = readFromMark();
	 //设置页面id为要发送对象的ID
	 $("#").val(remoteUserId);
  }
 )
 
 //点击发送后关闭窗口
  $('#file_share').click(function(){
    
	 $(document).trigger('close.facebox');

	})

  </script>
  <script type="text/javascript" src="js/plugin_video/filedrag.js"></script>	
  <script type="text/javascript" src="js/plugin_video/md5.js"></script>	
  <script type="text/javascript" src="js/plugin_video/hashme.js"></script>
  <script type="text/javascript" src="js/plugin_video/configs.js"></script>	
  <script type="text/javascript" src="js/plugin_video/fileSystem/protocolMessage.js"></script>  
  <script type="text/javascript" src="js/plugin_video/fileSystem/base64.js"></script>
  <script type="text/javascript" src="js/plugin_video/fileSystem/file.js"></script>
  <script type="text/javascript" src="js/plugin_video/fileSystem/lang_ext.js"></script> 
  <script type="text/javascript" src="js/plugin_video/fileSystem/queue.js"></script>
  <script type="text/javascript" src="js/plugin_video/fileSystem/FSio.js"></script>
  <script type="text/javascript" src="js/plugin_video/fileSystem/Block.js"></script>  
  <script type="text/javascript" src="js/plugin_video/fileSystem/BlockMap.js"></script>
  <script type="text/javascript" src="js/plugin_video/fileSystem/BlockCache.js"></script>
  <script type="text/javascript" src="js/plugin_video/fileSystem/AvailabilityMap.js"></script>
  <script type="text/javascript" src="js/plugin_video/fileSystem/binaryProtocol.js"></script>	
</body>
</html>
