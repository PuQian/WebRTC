package com.free4lab.account.api.action.account;

import java.util.HashMap;
import java.util.Map;

import org.apache.log4j.Logger;

import com.free4lab.account.common.Constants;
import com.free4lab.account.manager.AccessTokenManager;
import com.free4lab.account.manager.ClientManager;
//import com.free4lab.account.manager.LogUtilManager;
import com.free4lab.account.manager.ParameterUtilManager;
import com.free4lab.account.model.Client;
import com.free4lab.account.module.AccountModule;
import com.free4lab.account.module.UserinfoModule;
import com.free4lab.utils.account.AccountUtil;
import com.free4lab.utils.action.BaseAction;
import com.opensymphony.xwork2.ActionContext;

public class UpdateOldPwdAction extends BaseAction {
	/**
	 * 修改密码
	 */
	private static final long serialVersionUID = 1L;
	private static final Logger logger = Logger.getLogger(UpdateOldPwdAction.class);
//	private static final LogUtilManager lol = new LogUtilManager(UpdateOldPwdAction.class);
	private String message = "";
	private String result = "fail";
	
	public String execute() throws Exception {
		Map<String, Object> pMap = ActionContext.getContext().getParameters();
		Map<String, String> tMap = new HashMap<String, String>();
		String accessToken = "";
		String signature = "";
		String source = "";
		String old_pwd = "";
		String uid = "";
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
        	if (pMap.containsKey(Constants.PARAM_OLD_PWD)) {
    			old_pwd = ((String[]) pMap.get(Constants.PARAM_OLD_PWD))[0];
    			if(old_pwd != "" && !ParameterUtilManager.isUuid(old_pwd)){
    				this.setMessage("参数不合法" + Constants.PARAM_OLD_PWD);
    				return SUCCESS;
    			}
    		}else{
    			this.setMessage("缺少参数" + Constants.PARAM_OLD_PWD);
    			return SUCCESS;
    		}
        }
		String pwd = "";
		if (pMap.containsKey(Constants.PARAM_PWD)) {
			pwd = ((String[]) pMap.get(Constants.PARAM_PWD))[0];
			if(/*pwd != "" && */!ParameterUtilManager.isUuid(pwd)){
				this.setMessage("参数不合法" + Constants.PARAM_PWD);
				return SUCCESS;
			}
		}else{
			this.setMessage("缺少参数" + Constants.PARAM_PWD);
			return SUCCESS;
		}
		tMap.put(Constants.PARAM_PWD, pwd);
		int userId = -1;
		if(! accessToken.equalsIgnoreCase("")){
			userId = UserinfoModule.getUserIdByAccessToken(accessToken);
		}else{
			Client client = ClientManager.getClientByClientId(source);
			if(client != null && client.getClient_secret() != null){
				String client_secret = client.getClient_secret();
				if( ! signature.equals(AccountUtil.getSignature(tMap, client_secret))){
					setMessage("验证" + Constants.PARAM_SIGNATURE + "错误");
					return SUCCESS;
				}else{
					userId = Integer.parseInt(uid);
				}
			}else{
				setMessage("根据" + Constants.PARAM_SOURCE + "查找client错误");
				return SUCCESS;
			}
			
		}
		if(userId > 0){
			if(! accessToken.equalsIgnoreCase("")){
				if(AccountModule.updatePwd(userId, old_pwd, pwd)){
					setMessage("修改密码成功");
					logger.info("修改密码成功");
					setResult("success");
//					lol.info(userId, "用户级修改密码成功", "账号", accessToken, AccountModule.getClientIdByUser(accessToken));
				}else{
					setMessage("修改密码失败");
//					lol.error(userId, "用户级修改密码失败", "账号", accessToken, AccountModule.getClientIdByUser(accessToken));
				}
			}else{
				if(AccountModule.resetPwd(userId, pwd)){
					setMessage("修改密码成功");
					logger.info("修改密码成功");
					setResult("success");
//					lol.info(userId, "应用级修改密码成功", "账号", signature, source);
				}else{
					setMessage("修改密码失败");
//					lol.error(userId, "应用级修改密码失败", "账号", signature, source);
				}
			}
			
		}else{
			
			if(! accessToken.equalsIgnoreCase("")){
				this.setMessage("accessToken invalid");
//				lol.error(-1, "用户级修改密码失败", "账号", accessToken, null);
			}else{
				this.setMessage("userId invalid");
//				lol.error(-1, "应用级修改密码失败", "账号", signature, source);
			}
			
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