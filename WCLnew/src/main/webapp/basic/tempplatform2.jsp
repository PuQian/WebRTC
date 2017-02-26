<!DOCTYPE html>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"
	import="java.util.*"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<%@page import="com.free4lab.webrtc.common.APIConstants"%>
<% String WCS_URL = APIConstants.WCS_URL;  %>
<%

    String plateformfrontURL="";
    if(request.getScheme()=="https")
    {
    	plateformfrontURL=APIConstants.APIPrefix_FreeFront;
    }
    else
    {
    	plateformfrontURL=APIConstants.APIPrefix_HTTP_FreeFront;
    }
    
    System.out.println("plateformfrontURL="+plateformfrontURL);

%>


<html>
<body>
${temp_url} 
</body>
</html>