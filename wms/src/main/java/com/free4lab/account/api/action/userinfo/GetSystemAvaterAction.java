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
import com.free4lab.utils.account.AccountUtil;
import com.free4lab.utils.action.BaseAction;
import com.opensymphony.xwork2.ActionContext;

public class GetSystemAvaterAction extends BaseAction {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private static final Logger logger = Logger.getLogger(GetSystemAvaterAction.class);
//	private static final LogUtilManager lol = new LogUtilManager(GetSystemAvaterAction.class);
	
	private String avatars = null;
	private String result;
	private String message;
	
	@Profiled(tag="GetSystemAvaterAction.execute")
	public String execute() throws Exception{
		Map<String, Object> pMap = ActionContext.getContext().getParameters();
		Map<String, String> tMap = new HashMap<String, String>();
		result = "fail";
		message = "fail";
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
		
    	avatars = Constants.SYSTEM_AVATARS;
    	logger.info(avatars);
    	if(avatars != null && ! avatars.equalsIgnoreCase("")){
    		result = "success";
    		setMessage("获得系统默认头像成功");
//    		lol.info(0, "应用级获取系统默认头像成功", "用户", signature, source);
    	}
		return SUCCESS;
	}

	public String getAvatars() {
		return avatars;
	}

	public void setAvatars(String avatars) {
		this.avatars = avatars;
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
	
	/*public static void main(String[] args) throws Exception{
		GetSystemAvaterAction g = new GetSystemAvaterAction();
		g.execute();
		List<String> temp = g.getAvatars();
		logger.info(g);
	}*/


	
	
	
}