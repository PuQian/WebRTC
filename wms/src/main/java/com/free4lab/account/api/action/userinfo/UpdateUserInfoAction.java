package com.free4lab.account.api.action.userinfo;

import java.util.HashMap;
import java.util.Map;

import org.apache.log4j.Logger;
import org.perf4j.aop.Profiled;

import com.free4lab.account.common.Constants;
import com.free4lab.account.manager.ClientManager;
//import com.free4lab.account.manager.LogUtilManager;
import com.free4lab.account.manager.ParameterUtilManager;
import com.free4lab.account.model.Client;
import com.free4lab.account.model.User;
import com.free4lab.account.module.AccountModule;
import com.free4lab.account.module.UserinfoModule;
import com.free4lab.utils.account.AccountUtil;
import com.free4lab.utils.action.BaseAction;
import com.opensymphony.xwork2.ActionContext;

public class UpdateUserInfoAction extends BaseAction {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private static final Logger logger = Logger.getLogger(UpdateUserInfoAction.class);
//	private static final LogUtilManager lol = new LogUtilManager(UpdateUserInfoAction.class);
	
	private String message;
	private String result;
	
	@Profiled(tag="UpdateUserInfoAction.execute")
	public String execute() throws Exception{
		logger.info("修改用户的userinfo！");
		Map<String, Object> pMap = ActionContext.getContext().getParameters();
		Map<String, String> tMap = new HashMap<String, String>();
		String accessToken = "";
		String signature = "";
		String source = "";
		String uid = "";
		result = "fail";
		if (!pMap.containsKey(Constants.PARAM_ACCESS_TOKEN)) {
			if(pMap.containsKey(Constants.PARAM_SIGNATURE) && pMap.containsKey(Constants.PARAM_SOURCE) && pMap.containsKey(Constants.PARAM_USER_ID)){
				signature = ((String[]) pMap.get(Constants.PARAM_SIGNATURE))[0];
				source = ((String[]) pMap.get(Constants.PARAM_SOURCE))[0];
				uid = ((String[]) pMap.get(Constants.PARAM_USER_ID))[0];
				if(signature.equalsIgnoreCase("") || !ParameterUtilManager.isUuid(signature)){
					this.setMessage("参数不合法" + Constants.PARAM_SIGNATURE);
					return SUCCESS;
				}
				if(source.equalsIgnoreCase("") || !ParameterUtilManager.isStrings(source)){
					this.setMessage("参数不合法" + Constants.PARAM_SOURCE);
					return SUCCESS;
				}
				tMap.put(Constants.PARAM_SOURCE, source);
				if(uid.equalsIgnoreCase("") || !ParameterUtilManager.isInt(uid)){
					this.setMessage("参数不合法" + Constants.PARAM_USER_ID);
					return SUCCESS;
				}
				tMap.put(Constants.PARAM_USER_ID, uid);
			}else{
				this.setMessage("缺少参数 " + Constants.PARAM_ACCESS_TOKEN +"，or 缺少参数："+ Constants.PARAM_SIGNATURE + "，" +Constants.PARAM_SOURCE + "，" + Constants.PARAM_USER_ID);
	            return SUCCESS;
			}
            
        }else{
        	accessToken = ((String[]) pMap.get(Constants.PARAM_ACCESS_TOKEN))[0];
        	if (accessToken.equalsIgnoreCase("") || !ParameterUtilManager.isUuid(accessToken)) {
				this.setMessage("参数不合法" + Constants.PARAM_ACCESS_TOKEN);
				return SUCCESS;
			}
        }
		String profile_image_url = null;
		if (pMap.containsKey(Constants.PARAM_AVATAR)) {
			profile_image_url = ((String[]) pMap.get(Constants.PARAM_AVATAR))[0];
			if(profile_image_url != null && !ParameterUtilManager.isUuid36(profile_image_url)){
				this.setMessage("参数不合法" + Constants.PARAM_AVATAR);
				return SUCCESS;
			}
			tMap.put(Constants.PARAM_AVATAR, profile_image_url);
		}
		
		String real_name = null;
		if (pMap.containsKey(Constants.PARAM_REAL_NAME)) {
			real_name = ((String[]) pMap.get(Constants.PARAM_REAL_NAME))[0];
			if(real_name != null && !ParameterUtilManager.isLetterChinese(real_name)){
				this.setMessage("参数不合法" + Constants.PARAM_REAL_NAME);
				return SUCCESS;
			}
			tMap.put(Constants.PARAM_REAL_NAME, real_name);
		}
		
		String gender = null;
		if (pMap.containsKey(Constants.PARAM_GENDER)) {
			gender = ((String[]) pMap.get(Constants.PARAM_GENDER))[0];
			if(gender != null && !ParameterUtilManager.isString1(gender)){
				this.setMessage("参数不合法" + Constants.PARAM_GENDER);
				return SUCCESS;
			}
			tMap.put(Constants.PARAM_GENDER, gender);
			
		}
		
		String screen_name = null;
		if (pMap.containsKey(Constants.PARAM_SCREEN_NAME)) {
			screen_name = ((String[]) pMap.get(Constants.PARAM_SCREEN_NAME))[0];
			if(screen_name != null && !ParameterUtilManager.isStrings(screen_name)){
				this.setMessage("参数不合法" + Constants.PARAM_SCREEN_NAME);
				return SUCCESS;
			}
			tMap.put(Constants.PARAM_SCREEN_NAME, screen_name);
		}
		
		String description = null;
		if (pMap.containsKey(Constants.PARAM_DESCRIPTION)) {
			description = ((String[]) pMap.get(Constants.PARAM_DESCRIPTION))[0];
			if(description != null && !ParameterUtilManager.isStrings(description)){
				this.setMessage("参数不合法" + Constants.PARAM_DESCRIPTION);
				return SUCCESS;
			}
			tMap.put(Constants.PARAM_DESCRIPTION, description);
		}
		String phone = null;
		if (pMap.containsKey(Constants.PARAM_PHONE)) {
			phone = ((String[]) pMap.get(Constants.PARAM_PHONE))[0];
			if(phone != null && !ParameterUtilManager.isInt11(phone)){
				this.setMessage("参数不合法" + Constants.PARAM_PHONE);
				return SUCCESS;
			}
			tMap.put(Constants.PARAM_PHONE, phone);
		}
		String qq = null;
		if (pMap.containsKey(Constants.PARAM_QQ)) {
			qq = ((String[]) pMap.get(Constants.PARAM_QQ))[0];
			if(qq != null && !ParameterUtilManager.isInt(qq)){
				this.setMessage("参数不合法" + Constants.PARAM_QQ);
				return SUCCESS;
			}
			tMap.put(Constants.PARAM_QQ, qq);
		}
		String company = null;
		if (pMap.containsKey(Constants.PARAM_COMPANY)) {
			company = ((String[]) pMap.get(Constants.PARAM_COMPANY))[0];
			if(company != null && !ParameterUtilManager.isInt(company)){
				this.setMessage("参数不合法" + Constants.PARAM_COMPANY);
				return SUCCESS;
			}
			tMap.put(Constants.PARAM_COMPANY, company);
		}
		String email_home = null;
		if (pMap.containsKey(Constants.PARAM_EMAIL_HOME)) {
			email_home = ((String[]) pMap.get(Constants.PARAM_EMAIL_HOME))[0];
			if(email_home != null && !ParameterUtilManager.isEmail(email_home)){
				this.setMessage("参数不合法" + Constants.PARAM_EMAIL_HOME);
				return SUCCESS;
			}
			tMap.put(Constants.PARAM_EMAIL_HOME, email_home);
		}
		String email_work = null;
		if (pMap.containsKey(Constants.PARAM_EMAIL_WORK)) {
			email_work = ((String[]) pMap.get(Constants.PARAM_EMAIL_WORK))[0];
			if(email_work != null && !ParameterUtilManager.isEmail(email_work)){
				this.setMessage("参数不合法" + Constants.PARAM_EMAIL_WORK);
				return SUCCESS;
			}
			tMap.put(Constants.PARAM_EMAIL_WORK, email_work);
		}
		String phone_work = null;
		if (pMap.containsKey(Constants.PARAM_PHONE_WORK)) {
			phone_work = ((String[]) pMap.get(Constants.PARAM_PHONE_WORK))[0];
			if(phone_work != null && !ParameterUtilManager.isInt11(phone_work)){
				this.setMessage("参数不合法" + Constants.PARAM_PHONE_WORK);
				return SUCCESS;
			}
			tMap.put(Constants.PARAM_PHONE_WORK, phone_work);
		}
		String phone_home = null;
		if (pMap.containsKey(Constants.PARAM_PHONE_HOME)) {
			phone_home = ((String[]) pMap.get(Constants.PARAM_PHONE_HOME))[0];
			if(phone_home != null && !ParameterUtilManager.isInt11(phone_home)){
				this.setMessage("参数不合法" + Constants.PARAM_PHONE_HOME);
				return SUCCESS;
			}
			tMap.put(Constants.PARAM_PHONE_HOME, phone_home);
		}
		int userId = -1;
		if( ! accessToken.equalsIgnoreCase("")){
			userId = UserinfoModule.getUserIdByAccessToken(accessToken);
		}else{
			Client client = ClientManager.getClientByClientId(source);
			if(client != null && client.getClient_secret() != null){
				String client_secret = client.getClient_secret();
				if( ! signature.equals(AccountUtil.getSignature(tMap, client_secret))){
					setMessage("验证" + Constants.PARAM_SIGNATURE + "错误");
					return SUCCESS;
				}else if(client.getNeed_author() != null && client.getNeed_author().equals("1")){
					userId = Integer.parseInt(uid);
				}else{
					setMessage(Constants.PARAM_SOURCE+":"+source + "没有权限");
					return SUCCESS;
				}
			}else{
				setMessage("根据" + Constants.PARAM_SOURCE + "查找client错误");
				return SUCCESS;
			}
			
		}
		
		if(userId > 0){
			User user = UserinfoModule.getUserByUserId(userId);
			user = UserinfoModule.setUserInfo(user, profile_image_url,
					real_name, gender, screen_name, description, phone, qq, company, email_home, email_work, phone_home, phone_work);
			if(user != null){
				result = "success" ;
				setMessage("修改user成功");
				if(! accessToken.equalsIgnoreCase("")){
//					lol.info(userId, "用户级修改用户信息成功", "用户", accessToken, AccountModule.getClientIdByUser(accessToken));
				}else if(! signature.equalsIgnoreCase("")){
//					lol.info(userId, "应用级修改用户信息成功", "用户", signature, source);
				}
			}else{
				if(! accessToken.equalsIgnoreCase("")){
//					lol.warn(userId, "用户级修改用户信息失败", "用户", accessToken, AccountModule.getClientIdByUser(accessToken));
				}else if(! signature.equalsIgnoreCase("")){
//					lol.warn(userId, "应用级修改用户信息失败", "用户", signature, source);
				}
				setMessage("修改user错误");
			}
			
				
		}else{
			if(! accessToken.equalsIgnoreCase("")){
//				lol.error(-1, "用户级修改用户信息失败，userId错误","用户", accessToken, null);
			}else if(! signature.equalsIgnoreCase("")){
//				lol.error(-1, "用户级修改用户信息失败，userId错误", "用户", signature, source);
			}
			setMessage("获取的uid错误");
			
		}
		return SUCCESS;

	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getResult() {
		return result;
	}

	public void setResult(String result) {
		this.result = result;
	}
	
	
	
	
	
}