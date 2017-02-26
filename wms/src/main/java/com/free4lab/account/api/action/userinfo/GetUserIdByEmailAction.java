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
import com.free4lab.account.module.UserinfoModule;
import com.free4lab.utils.account.AccountUtil;
import com.free4lab.utils.action.BaseAction;
import com.opensymphony.xwork2.ActionContext;

public class GetUserIdByEmailAction extends BaseAction {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private static final Logger logger = Logger.getLogger(GetUserIdByEmailAction.class);
//	private static final LogUtilManager lol = new LogUtilManager(GetUserIdByEmailAction.class);
	
	private int uid;
	private String result;
	private String message;
	
	@Profiled(tag="GetUserIdByEmailAction.execute")
	public String execute(){
		Map<String, Object> pMap = ActionContext.getContext().getParameters();
		Map<String, String> tMap = new HashMap<String, String>();
		message = "fail";
		result = "fail";
		String signature = "";
		String source = "";
		if(pMap.containsKey(Constants.PARAM_SIGNATURE) && pMap.containsKey(Constants.PARAM_SOURCE)){
			signature = ((String[]) pMap.get(Constants.PARAM_SIGNATURE))[0];
			source = ((String[]) pMap.get(Constants.PARAM_SOURCE))[0];
			if(signature.equalsIgnoreCase("") || !ParameterUtilManager.isUuid(signature)){
				this.setMessage("参数不合法" + Constants.PARAM_SIGNATURE);
				return SUCCESS;
			}
			if(source.equalsIgnoreCase("") || !ParameterUtilManager.isStrings(source)){
				this.setMessage("参数不合法" + Constants.PARAM_SOURCE);
				return SUCCESS;
			}
			tMap.put(Constants.PARAM_SOURCE, source);
		}else{
			this.setMessage("缺少参数 " + Constants.PARAM_SIGNATURE + "，or " +Constants.PARAM_SOURCE );
            return SUCCESS;
		}
		String email = "";
		if (!pMap.containsKey(Constants.PARAM_EMAIL)) {
            this.setMessage("缺少参数 " + Constants.PARAM_EMAIL);
            return SUCCESS;
        }else{
        	email = ((String[]) pMap.get(Constants.PARAM_EMAIL))[0];
        	if(email.equalsIgnoreCase("") || !ParameterUtilManager.isEmail(email)){
        		this.setMessage("参数不合法" + Constants.PARAM_EMAIL);
				return SUCCESS;
        	}
        	tMap.put(Constants.PARAM_EMAIL, email);
        }
		
		Client client = ClientManager.getClientByClientId(source);
		if(client != null && client.getClient_secret() != null){
			String client_secret = client.getClient_secret();
			if( ! signature.equals(AccountUtil.getSignature(tMap, client_secret))){
				setMessage("验证" + Constants.PARAM_SIGNATURE + "错误");
				return SUCCESS;
			}
		}else{
			setMessage("根据" + Constants.PARAM_SOURCE + "查找client错误");
			return SUCCESS;
		}
		
		logger.info("email="+email);
		uid = UserinfoModule.getUserIdByEmail(email);
		
		if(uid == -1){
			this.setMessage(Constants.PARAM_EMAIL+"错误，不存在此用户");
//			lol.error(0, "应用级根据email:"+ email +"获取uid失败，不存在此用户", "用户", signature, source);
		}else{
			result = "success";
			this.setMessage("根据" + Constants.PARAM_EMAIL + "查找userid成功");
//			lol.info(uid, "应用级根据email:"+ email +"获取uid成功，uid:" + uid, "用户", signature, source);
		}
		
		return SUCCESS;
	}

	public int getUid() {
		return uid;
	}

	public void setUid(int uid) {
		this.uid = uid;
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
