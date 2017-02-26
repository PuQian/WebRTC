package com.free4lab.account.api.action.account;

import java.util.HashMap;
import java.util.Map;

import org.apache.log4j.Logger;
import org.perf4j.aop.Profiled;

import com.free4lab.account.common.Constants;
import com.free4lab.account.manager.AccountManager;
import com.free4lab.account.manager.ClientManager;
//import com.free4lab.account.manager.LogUtilManager;
import com.free4lab.account.manager.ParameterUtilManager;
import com.free4lab.account.model.Client;
import com.free4lab.account.module.AccountModule;
import com.free4lab.account.module.AccountModule.LoginResult;
import com.free4lab.utils.account.AccountUtil;
import com.free4lab.utils.action.BaseAction;
import com.free4lab.utils.hash.Md5Util;
import com.opensymphony.xwork2.ActionContext;

public class AddUserAction extends BaseAction {
	/**
	 * 添加新用户——直接注册
	 */
	private static final long serialVersionUID = 1L;
	
	private static final Logger logger = Logger.getLogger(AddUserAction.class);
//	private static final LogUtilManager lol = new LogUtilManager(AddUserAction.class);
	
	private String message = "";
	private String result = "fail";
	
	@Profiled(tag="AddUserAction.execute")
	public String execute() throws Exception{
		Map<String, Object> pMap = ActionContext.getContext().getParameters();
		Map<String, String> hashMap = new HashMap<String, String>();
		String email = "";
		if (!pMap.containsKey(Constants.PARAM_EMAIL)) {
			this.setMessage("缺少参数" + Constants.PARAM_EMAIL);
			return SUCCESS;
		}else{
			email = ((String[]) pMap.get(Constants.PARAM_EMAIL))[0];
			if(email.equalsIgnoreCase("") || !ParameterUtilManager.isEmail(email)){
				this.setMessage("参数不合法" + Constants.PARAM_EMAIL);
				return SUCCESS;
			}
			hashMap.put(Constants.PARAM_EMAIL, email);
		}
		
		String passwordMd5 = "";
		if (!pMap.containsKey(Constants.PARAM_PWD)) {
			this.setMessage("缺少参数" + Constants.PARAM_PWD);
			return SUCCESS;
		}else{
			passwordMd5 = ((String[]) pMap.get(Constants.PARAM_PWD))[0];
			if(passwordMd5.equalsIgnoreCase("") || !ParameterUtilManager.isUuid(passwordMd5)){
				this.setMessage("参数不合法" + Constants.PARAM_PWD);
				return SUCCESS;
			}
			hashMap.put(Constants.PARAM_PWD, passwordMd5);
		}
		String company = null;
		if (pMap.containsKey(Constants.PARAM_COMPANY)) {
			company = ((String[]) pMap.get(Constants.PARAM_COMPANY))[0];
			if(company != null && !ParameterUtilManager.isDigitLetterChinese(company)){
				this.setMessage("参数不合法" + Constants.PARAM_COMPANY);
				return SUCCESS;
			}
			hashMap.put(Constants.PARAM_COMPANY, company);
		}
		
		String real_name = "";
		if (!pMap.containsKey(Constants.PARAM_REAL_NAME)) {
			this.setMessage("缺少参数" + Constants.PARAM_REAL_NAME);
			return SUCCESS;
		}else{
			real_name = ((String[]) pMap.get(Constants.PARAM_REAL_NAME))[0];
			if(real_name.equalsIgnoreCase("") || !ParameterUtilManager.isLetterChinese(real_name)){
				this.setMessage("参数不合法" + Constants.PARAM_REAL_NAME);
				return SUCCESS;
			}
			hashMap.put(Constants.PARAM_REAL_NAME, real_name);
		}
		
		String description = "";
		if (!pMap.containsKey(Constants.PARAM_DESCRIPTION)) {
			this.setMessage("缺少参数" + Constants.PARAM_DESCRIPTION);
			return SUCCESS;
		}else{
			description = ((String[]) pMap.get(Constants.PARAM_DESCRIPTION))[0];
			if(description.equalsIgnoreCase("") || !ParameterUtilManager.isStrings(description)){
				this.setMessage("参数不合法" + Constants.PARAM_DESCRIPTION);
				return SUCCESS;
			}
			hashMap.put(Constants.PARAM_DESCRIPTION, description);
		}
		
		String source = "";
		if (!pMap.containsKey(Constants.PARAM_SOURCE)) {
			this.setMessage("缺少参数" + Constants.PARAM_SOURCE);
			return SUCCESS;
		}else{
			source = ((String[]) pMap.get(Constants.PARAM_SOURCE))[0];
			if(source.equalsIgnoreCase("") || !ParameterUtilManager.isString(source)){
				this.setMessage("参数不合法" + Constants.PARAM_SOURCE);
				return SUCCESS;
			}
			hashMap.put(Constants.PARAM_SOURCE, source);
		}
		
		String signature = "";
		if (!pMap.containsKey(Constants.PARAM_SIGNATURE)) {
			this.setMessage("缺少参数" + Constants.PARAM_SIGNATURE);
			return SUCCESS;
		}else{
			signature = ((String[]) pMap.get(Constants.PARAM_SIGNATURE))[0];
			if(signature.equalsIgnoreCase("") || !ParameterUtilManager.isUuid(signature)){
				this.setMessage("参数不合法" + Constants.PARAM_SIGNATURE);
				return SUCCESS;
			}
		}
		
		Client client = ClientManager.getClientByClientId(source);
		if(client != null && client.getClient_secret() != null){
			String client_secret = client.getClient_secret();
			if( ! signature.equals(AccountUtil.getSignature(hashMap, client_secret))){
				setMessage("验证" + Constants.PARAM_SIGNATURE + "错误");
				return SUCCESS;
			}else if(client.getNeed_author() != null && client.getNeed_author().equals("1")){
				String pwdSalt = Md5Util.getMd5Standard(passwordMd5 + email);
	            LoginResult result = AccountModule.valid(email, pwdSalt);
	            logger.info("is the new user valide:"+result);
	            if (result == LoginResult.USERNAME_NOT_EXISTED) {
	            	if(AccountModule.createUser(email, pwdSalt, real_name, description, company)){
	            		this.setResult("success");
	                	this.setMessage("创建新用户成功");
//	                	lol.info(0, "应用级注册新用户成功，email:"+email + ",uid:" + AccountManager.getUserIdByEmail(email), "账号", signature, source);
	                } else {
	                	this.setResult("fail");
	                	this.setMessage("创建新用户失败");
//	                	lol.error(0, "应用级注册新用户失败，email:"+email, "账号", signature, source);
	                }
	            } else {
	            	this.setResult("fail");
	            	this.setMessage("已经注册完毕，无需再次注册");
//	            	lol.warn(0, "应用级注册新用户失败，此用户已经存在，email:"+email, "账号", signature, source);
	            }
			}else{
				this.setMessage(Constants.PARAM_SOURCE+":"+source + "没有权限");
//				lol.error(0, "应用级注册新用户失败，"+ Constants.PARAM_SOURCE+":"+source + "没有权限", "账号", signature, source);
				return SUCCESS;
			}
		}else{
			this.setResult("fail");
			this.setMessage("根据" + Constants.PARAM_SOURCE + "查找client错误");
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
