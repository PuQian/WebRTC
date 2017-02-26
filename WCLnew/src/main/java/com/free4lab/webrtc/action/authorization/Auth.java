//package com.free4lab.webrtc.action.authorization;
//
//import org.apache.commons.httpclient.HttpClient;
//import org.apache.http.HttpResponse;
//import org.apache.http.client.ClientProtocolException;
//import org.apache.http.client.methods.HttpGet;
//import org.apache.http.client.methods.HttpPost;
//import org.apache.http.entity.StringEntity;
//import org.apache.http.impl.client.BasicResponseHandler;
//import org.apache.http.impl.client.DefaultHttpClient;
//import org.apache.http.util.EntityUtils;
//import org.apache.log4j.Logger;
//import org.apache.struts2.ServletActionContext;
//import org.json.JSONException;
//import org.json.JSONObject;
//import org.mortbay.log.Log;
////import org.apache.struts2.components.Date;
//
//import com.free4lab.utils.action.BaseAction;
////import com.free4lab.webrtc.action.authorization.HttpXmlClient;
//import com.free4lab.webrtc.common.APIConstants;
//import com.free4lab.webrtc.common.SessionConstants;
//import com.opensymphony.xwork2.ActionContext;
//import com.sun.mail.iap.ResponseHandler;
//
//import java.lang.Object;
//import java.net.URLEncoder;
//import java.net.UnknownHostException;
//import java.sql.Timestamp;
//import java.util.Calendar;
//import java.util.Date;
//import java.security.*;
//import java.io.IOException;
//import java.io.UnsupportedEncodingException;
//import javax.crypto.SecretKey;
//import javax.crypto.spec.SecretKeySpec;
//import sun.misc.*;  //Base64加密包
//import java.security.*;
//import javax.crypto.*;
//import javax.crypto.spec.SecretKeySpec;
//import javax.servlet.ServletException;
//import javax.servlet.http.HttpServletRequest;
//import javax.servlet.http.HttpServletResponse;
//import java.util.*;
//
//public class Auth{
//	  
// 
//    private static final Logger logger = Logger.getLogger(Auth.class);
//
//	//用json发送httpPOST认证请求
//	public static void sendWMSHttpAuth() throws NoSuchAlgorithmException, JSONException, UnknownHostException{
//		JSONObject authDescription = new JSONObject();
////		logger.info( WMSRequest.WMSAuthPara());
//		try{
//			authDescription.put("WebRTCLoginRequestValue", WMSRequest.WMSAuthPara());
//			authDescription.put("testKey", "testValue");			
//		}catch(JSONException e){
//			e.printStackTrace();
//		}
//		DefaultHttpClient client = new DefaultHttpClient();
//		HttpPost httppost = new HttpPost(APIConstants.WMS_URL+"api/WMSAuth");
//		
//		try{
//			StringEntity s = new StringEntity(authDescription.toString());
//			s.setContentEncoding("UTF-8");    
//		    s.setContentType("application/json");    
//			httppost.setEntity(s);
////			httppost.addHeader("Content_Type", "application/json");
//			HttpResponse response = client.execute(httppost);
////			JSONObject resJSON = response.getEntity().getContent();
////			String locationsJSONString = getStringFromHttp(response.getEntity());
//			logger.info("authDescription:"+authDescription);
//			
//			
//			String strResult="";
//			 /**请求发送成功，并得到响应**/  
//            if(response.getStatusLine().getStatusCode()==200){    
//               try {  
//                     /**读取服务器返回过来的json字符串数据**/  
//                     strResult = EntityUtils.toString(response.getEntity());     
//               } catch (IllegalStateException e) {  
//                   // TODO Auto-generated catch block  
//                   e.printStackTrace();  
//               } catch (IOException e) {  
//                   // TODO Auto-generated catch block  
//                   e.printStackTrace();  
//               }
//               JSONObject jsonObject = null;  
//               try {  
//                   /**把json字符串转换成json对象**/  
//                   jsonObject = getJSON(strResult);  
//               } catch (JSONException e1) {  
//                   // TODO Auto-generated catch block  
//                   e1.printStackTrace();  
//               }   
//            }
//          }
//		catch(UnsupportedEncodingException e){
//			e.printStackTrace();
//		}
//		catch(ClientProtocolException e){
//			e.printStackTrace();
//		}
//		catch(IOException e){
//			e.printStackTrace();
//		}
//	}
//	
//    public static JSONObject getJSON(String sb) throws JSONException {    
//        return new JSONObject(sb);    
//    }   
//
// }
//	
//
