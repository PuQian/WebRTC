<!DOCTYPE html>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="java.util.*"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<html>
<head>
<title>编辑好友信息</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
 <script language="javascript"  src="js/contactGroupOperation.js"></script>

</head>
<body>

	 <div>聊天室成员 </div>
	 <ul id="memberContainer">
	 </ul>
	 
	<div class="rightalign">
	    <input id= "showRoomButton"  type="button" class="button" value="单击显示成员列表" onclick="showRoomMemberFn()"/>
   	 	<input type="button" class="button" value="取消" onclick="cancelFaceboxFn()"/>
   	</div>
	
  
		
</body>
</html>
