package com.free4lab.account.manager;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.free4lab.account.common.Constants;

public class Log {

	private static final Logger logger = Logger.getLogger(Log.class);
	
	private String topic;
	private String content;
	private String source;
	private Long createdTime;
	private String offset;
	private String accessToken;
	private String ipaddress;
	private String userId;
	private String clientId;
	private String transactionId;
	private String action;
	private String logTime;
	private String logLevel;
	
	public Log() {
	}
	
	public Log(JSONObject o) {
		try {
			if(o.has(Constants.LOG_TOPIC)){
				this.topic = o.getString(Constants.LOG_TOPIC);
			}else{
				this.topic = null;
			}
			if(o.has(Constants.LOG_CONTENT)){
				this.content = o.getString(Constants.LOG_CONTENT);
			}else{
				this.content = null;
			}
			if(o.has(Constants.LOG_SOURCE)){
				this.source = o.getString(Constants.LOG_SOURCE);
			}else{
				this.source = null;
			}
			if(o.has(Constants.LOG_OFFSET)){
				this.offset = o.getString(Constants.LOG_OFFSET);
			}else{
				this.offset = null;
			}
			if(o.has(Constants.LOG_ACCESSTOKEN)){
				this.accessToken = o.getString(Constants.LOG_ACCESSTOKEN);
			}else{
				this.accessToken = null;
			}
			if(o.has(Constants.LOG_IPADDRESS)){
				this.ipaddress = o.getString(Constants.LOG_IPADDRESS);
			}else{
				this.ipaddress = null;
			}
			if(o.has(Constants.LOG_USERID)){
				this.userId = o.getString(Constants.LOG_USERID);
			}else{
				this.userId = null;
			}
			if(o.has(Constants.LOG_CLIENT_ID)){
				this.clientId = o.getString(Constants.LOG_CLIENT_ID);
			}else{
				this.clientId = null;
			}
			if(o.has(Constants.LOG_TRANSACTION_ID)){
				this.transactionId = o.getString(Constants.LOG_TRANSACTION_ID);
			}else{
				this.transactionId = null;
			}
			if(o.has(Constants.LOG_ACTION)){
				this.action = o.getString(Constants.LOG_ACTION);
			}else{
				this.action = null;
			}
			if(o.has(Constants.LOG_CREATEDTIME)){
				this.createdTime = Long.parseLong(o.getString(Constants.LOG_CREATEDTIME));
			}else{
				this.createdTime = null;
			}
			if(o.has(Constants.LOG_TIME)){
				this.logTime = o.getString(Constants.LOG_TIME);
			}else{
				this.logTime = null;
			}
			if(o.has(Constants.LOG_LEVEL)){
				this.logLevel = o.getString(Constants.LOG_LEVEL);
			}else{
				this.logLevel = null;
			}
		} catch (JSONException e) {
			logger.debug("invalid Balance",e);
		}
	}
	
	public static List<Log> getList(JSONArray array){
		List<Log> logs = new ArrayList<Log>();
		for(int i=0;i<array.length();i++){
			JSONObject o;
			try {
				o = array.getJSONObject(i);
				logger.info(o);
				Log r = new Log(o);
				logs.add(r);
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
		}
		return logs;
		
	}
	
	public String getTopic() {
		return topic;
	}
	public void setTopic(String topic) {
		this.topic = topic;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public String getSource() {
		return source;
	}
	public void setSource(String source) {
		this.source = source;
	}
	public String getAccessToken() {
		return accessToken;
	}

	public void setAccessToken(String accessToken) {
		this.accessToken = accessToken;
	}

	public Long getCreatedTime() {
		return createdTime;
	}
	public void setCreatedTime(Long createdTime) {
		this.createdTime = createdTime;
	}
	public String getOffset() {
		return offset;
	}
	public void setOffset(String offset) {
		this.offset = offset;
	}
	public String getIpaddress() {
		return ipaddress;
	}
	public void setIpaddress(String ipaddress) {
		this.ipaddress = ipaddress;
	}
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getClientId() {
		return clientId;
	}
	public void setClientId(String clientId) {
		this.clientId = clientId;
	}
	public String getTransactionId() {
		return transactionId;
	}
	public void setTransactionId(String transactionId) {
		this.transactionId = transactionId;
	}
	public String getAction() {
		return action;
	}
	public void setAction(String action) {
		this.action = action;
	}

	public String getLogTime() {
		return logTime;
	}

	public void setLogTime(String logTime) {
		this.logTime = logTime;
	}

	public String getLogLevel() {
		return logLevel;
	}

	public void setLogLevel(String logLevel) {
		this.logLevel = logLevel;
	}
	
}
