//package com.free4lab.account.manager;
//
//import java.io.IOException;
//import java.io.UnsupportedEncodingException;
//import java.net.URLEncoder;
//import java.util.ArrayList;
//import java.util.HashSet;
//import java.util.List;
//import java.util.Set;
//import java.util.UUID;
//
//import org.apache.commons.httpclient.HttpClient;
//import org.apache.commons.httpclient.HttpException;
//import org.apache.commons.httpclient.methods.GetMethod;
//import org.apache.log4j.Logger;
//import org.json.JSONArray;
//import org.json.JSONException;
//import org.json.JSONObject;
//
//import com.free4lab.account.common.Constants;
//
//public class LogUtilManager {
//
//	private static final Logger logger = Logger.getLogger(LogUtilManager.class);
//	
//	
//	private String source = ""; //类名，如：LogUtilManager.class
//	private String transactionId = "";
//	
//	public LogUtilManager(){}
//	
//	public LogUtilManager(Class<?> source){
//		this.source = source.toString();
//		this.transactionId = UUID.randomUUID().toString().replace("-", "");
//	}
//	
//	public void info(int userId, String content, String action,String access_token, String clientId){
//		pushLog(Constants.LOG_LEVEL_INFO,String.valueOf(userId), content, action, access_token,clientId);
//	}
//	public void warn(int userId, String content, String action,String access_token, String clientId){
//		pushLog(Constants.LOG_LEVEL_WARN,String.valueOf(userId), content, action, access_token,clientId);
//	}
//	public void error(int userId, String content, String action,String access_token, String clientId){
//		pushLog(Constants.LOG_LEVEL_ERROR,String.valueOf(userId), content, action, access_token,clientId);
//	}
//	
//	/**
//	 * 写日志，
//	 * userId：用户Id，accountAdmin为0；content：用户具体操作的内容，如：用户查询交易记录；action：用户行为，包括：第一次登录，登录，退出，账户，用户，好友，计费，OAuth2.0；
//	 * access_token：用户的登录凭证；clientId：应用的Id，loglevel：日志级别：error、debug、info,
//	 * @param userId
//	 * @param content
//	 * @param action
//	 * @param access_token
//	 * @param clientId
//	 * @param loglevel
//	 */
//	public void pushLog(String loglevel,String userId , String content, String action,
//			String access_token, String clientId) {
//		String pushLogUrl = Constants.URL_LOG_PUSH_LOG + "?" + Constants.LOG_TOPIC + "=" +Constants.LOG_TOPIC_VALUE + "&c=";
//		//String pushLogUrl = "http://dc.free4lab.com/push/batchlog?topic=account&c=";
//		JSONObject obj = new JSONObject();
//		JSONArray objArray = new JSONArray();
//		String resultMessage = null;
//		int resultStatus = -1;
//		JSONObject result = null;
//		String logtime = new Long(System.currentTimeMillis()).toString();
//		try {
//			obj.put(Constants.LOG_USERID, userId);
//			obj.put(Constants.LOG_CONTENT, content);
//			obj.put(Constants.LOG_ACTION, action);
//			obj.put(Constants.LOG_ACCESSTOKEN, access_token);
//			obj.put(Constants.LOG_CLIENT_ID, clientId);
//			obj.put(Constants.LOG_SOURCE, source);
//			obj.put(Constants.LOG_TRANSACTION_ID, transactionId);
//			obj.put(Constants.LOG_TIME, logtime);
//			obj.put(Constants.LOG_LEVEL, loglevel);
//		} catch (JSONException e) {
//			e.printStackTrace();
//		}
//		objArray.put(obj);
//		String uri="";
//		try {
//			uri = pushLogUrl +URLEncoder.encode(objArray.toString(),"UTF-8");
//			
//		} catch (UnsupportedEncodingException e) {
//			logger.error(e.getMessage());
//			e.printStackTrace();
//		}
//		logger.info("url: "+uri);
//		HttpClient httpclient = new HttpClient();
//		httpclient.getHttpConnectionManager().getParams().setConnectionTimeout(2000);
//		GetMethod method = new GetMethod(uri);
//		int statusCode = 0;
//		try {
//			statusCode = httpclient.executeMethod(method);
//			if(statusCode != Constants.LOG_HTTPSTATUS_OK){
//				logger.info("HTTP访问失败！错误代码："+statusCode);
//			}else{
//				result = new JSONObject(method.getResponseBodyAsString());
//				resultMessage =  result.getString(Constants.LOG_MESSAGE);
//				resultStatus = result.getInt(Constants.LOG_STATUS);
//				if(resultStatus == 0){
//					logger.info("写lol日志成功,message:"+resultMessage);
//				}else{
//					logger.info("写lol日志失败，message:"+resultMessage);
//				}
//			}
//		} catch (HttpException e) {
//			e.printStackTrace();
//		} catch (IOException e) {
//			e.printStackTrace();
//		} catch (JSONException e) {
//			e.printStackTrace();
//		}
//		httpclient.getHttpConnectionManager().closeIdleConnections(1);
//
//	}
//
//	/**
//	 * 参数为null表示此项全部
//	 * @param userId
//	 * @param content
//	 * @param action
//	 * @param access_token
//	 * @param clientId
//	 * @param source
//	 * @param size
//	 * @param btime
//	 * @param etime
//	 * @param timeasc
//	 */
//	public static List<Log> getLog(Integer userId, String content, String action,
//			String access_token, String clientId,Class<?> source, String loglevel,String size,
//			String btime,String etime,String timeasc){
//		String getLogUrl = Constants.URL_LOG_GET_SEARCH + "?" + Constants.LOG_TOPIC + "=" +Constants.LOG_TOPIC_VALUE + "&q=";
//		//String getLogUrl = "http://dc.free4lab.com/get/search?topic=account&q=" ;
//		JSONObject obj = new JSONObject();
//		JSONArray result = null;
//		List<Log> logs = new ArrayList<Log>();
//		try{
//			if(userId != null){
//				obj.put(Constants.LOG_USERID, userId);
//			}
//			if(content != null){
//				obj.put(Constants.LOG_CONTENT, content);
//			}
//			if(access_token != null){
//				obj.put(Constants.LOG_ACCESSTOKEN, access_token);
//			}
//			if(action != null){
//				obj.put(Constants.LOG_ACTION, action);
//			}
//			if(clientId != null){
//				obj.put(Constants.LOG_CLIENT_ID, clientId);
//			}
//			if(source != null){
//				obj.put(Constants.LOG_SOURCE, source);
//			}
//			if(loglevel != null){
//				obj.put(Constants.LOG_LEVEL, loglevel);
//			}
//			if(size != null){
//				obj.put(Constants.LOG_SIZE, size);
//			}
//			if(btime != null){
//				obj.put(Constants.LOG_BTIME, btime);
//			}
//			if(etime != null){
//				obj.put(Constants.LOG_ETIME, etime);
//			}
//			if(timeasc != null){
//				obj.put(Constants.LOG_TIMEASC, timeasc);
//			}
//		}catch(JSONException e){
//			e.printStackTrace();
//		}
//		String uri="";
//		try {
//			uri = getLogUrl +URLEncoder.encode(obj.toString(),"UTF-8");
//		} catch (UnsupportedEncodingException e) {
//			e.printStackTrace();
//		}
//		logger.info("url: "+uri);
//		HttpClient httpclient = new HttpClient();
//		httpclient.getHttpConnectionManager().getParams().setConnectionTimeout(2000);
//		GetMethod method = new GetMethod(uri);
//		int statusCode;
//		try {
//			statusCode = httpclient.executeMethod(method);
//			if(statusCode != Constants.LOG_HTTPSTATUS_OK){
//				logger.info("HTTP访问失败！错误代码："+statusCode);
//			}else{
//				result = new JSONArray(method.getResponseBodyAsString());
//				logs = Log.getList(result.getJSONObject(0).getJSONArray(Constants.LOG_RESULT));
//				logger.info("logs:"+result.getJSONObject(0).getJSONArray(Constants.LOG_RESULT).toString());
//				logger.info("size:"+result.getJSONObject(0).getInt(Constants.LOG_SIZE));
//			}
//		} catch (HttpException e) {
//			e.printStackTrace();
//		} catch (IOException e) {
//			e.printStackTrace();
//		} catch (JSONException e) {
//			e.printStackTrace();
//		}
//		httpclient.getHttpConnectionManager().closeIdleConnections(1);
//		return logs;
//	}
//
//	/**
//	 *计算用户登录时长
//	 * @param userId
//	 * @param access_token
//	 * @return
//	 */
//	public static List<String> calcLoginTime(Integer userId,String access_token){
//		List<String> result = new ArrayList<String>();
//		long etime = System.currentTimeMillis();
//		long btime = etime - 24*60*60*1000;
//		List<Log> logs = LogUtilManager.getLog(userId, null, "登录", access_token, null, null, Constants.LOG_LEVEL_INFO, null, String.valueOf(btime), String.valueOf(etime), null);
//		Long loginTime = null;
//		if(logs != null && logs.size() > 0){
//			Set<String> clientIds = new HashSet<String>();
//			for(Log log : logs){
//				if("第一次登录".equalsIgnoreCase(log.getAction())){
//					loginTime = Long.valueOf(log.getLogTime());
//				}
//				clientIds.add(log.getClientId());
//			}
//			if(loginTime != null){
//				Long totalTime = System.currentTimeMillis() - loginTime;
//				result.add(0, totalTime.toString());
//			}
//			result.add(1, String.valueOf(logs.size()));
//			result.add(2,clientIds.toString());
//		}
//		logger.info(result);
//		return result;
//	}
//
//}
