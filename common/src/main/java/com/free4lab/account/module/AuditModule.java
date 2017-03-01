package com.free4lab.account.module;

import java.util.List;

import org.apache.log4j.Logger;

//import com.free4lab.account.manager.LogUtilManager;

public class AuditModule {
	private final static Logger logger = Logger.getLogger(AuditModule.class);
//	private final static LogUtilManager lolmanager = new LogUtilManager(AuditModule.class);
	
	public static String getClientIdValue(String client_id){
		String clientId = "";
		if(client_id.equalsIgnoreCase("userinfo")){
			clientId = "Free账号";
		}else if(client_id.equalsIgnoreCase("freeshare")){
			clientId = "Free分享";
		}else if(client_id.equalsIgnoreCase("appcloud")){
			clientId = "云海（Paas）平台";
		}else if(client_id.equalsIgnoreCase("iaas")){
			clientId = "云海（Iaas）平台";
		}else if(client_id.equalsIgnoreCase("webrtc")){
			clientId = "WebRTC";
		}else if(client_id.equalsIgnoreCase("freeshareadmin")){
			clientId = "Free分享企业管理员门户";
		}else if(client_id.equalsIgnoreCase("freeshare_mobile")){
			clientId = "Free分享手机版";
		}
		return clientId;
	}
	
	
	public static void addLogin(int uid, String client_id, String code, String firstCode, String access_token){
		String clientId = getClientIdValue(client_id);
		if(code.equalsIgnoreCase(firstCode)){
			try{
//				lolmanager.info(uid, "用户登录'"+clientId+"'成功", "第一次登录", 
//						access_token, client_id);
			}catch(Exception e){
				logger.error(e.getMessage());
			}
		}else{
			try{
//				lolmanager.info(uid, "用户登录'"+clientId+"'成功", "登录", 
//						access_token, client_id);
			}catch(Exception e){
				logger.error(e.getMessage());
			}
		}
	}

	public static void addLogout(int uid,String access_token,String client_id) {
		String clientId = getClientIdValue(client_id);
//		List<String> results = LogUtilManager.calcLoginTime(uid, access_token);
//		if(results != null && results.size() == 3){
//			lolmanager.info(uid, "用户退出'"+clientId+"'成功，本次登录时常为："+results.get(0)+"ms，共登录过"+results.get(1)+"个应用:"+results.get(2), "退出", 
//					access_token, client_id);
//		}else{
//			lolmanager.info(uid, "用户退出'"+clientId+"'成功", "退出", 
//					access_token, client_id);
		}
		
	}

