package com.free4lab.account.api.action.userinfo;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.util.Map;

import org.apache.log4j.Logger;
import org.apache.struts2.json.JSONException;
import org.apache.struts2.json.JSONUtil;
import org.perf4j.aop.Profiled;
import com.free4lab.account.common.Constants;
//import com.free4lab.account.manager.LogUtilManager;
import com.free4lab.account.manager.ParameterUtilManager;
import com.free4lab.account.module.AccountModule;
import com.free4lab.account.module.UserinfoModule;
import com.free4lab.utils.action.BaseAction;
import com.opensymphony.xwork2.ActionContext;

public class CheckBasicUserInfoAction extends BaseAction {

	/**
	 * 检查默认信息是否完整
	 */
	private static final long serialVersionUID = 1L;
	private static final Logger logger = Logger.getLogger(CheckBasicUserInfoAction.class);
//	private static final LogUtilManager lol = new LogUtilManager(CheckBasicUserInfoAction.class);
	private String result;
	private String message;
	private String callback;
	private String myresult;
	private InputStream inputStr;
	
	@Profiled(tag="CheckBasicUserInfoAction.execute")
	public String execute(){
		logger.info("检查默认信息是否完整！");
		Map<String, Object> pMap = ActionContext.getContext().getParameters();
		result = "fail";
		String accessToken = "";
		if (pMap == null || !pMap.containsKey(Constants.PARAM_ACCESS_TOKEN)) {
            this.setMessage("缺少参数 " + Constants.PARAM_ACCESS_TOKEN);
            try {
    			myresult = callback + "(" + JSONUtil.serialize(result) + ")";
    		} catch (JSONException e1) {
    			e1.printStackTrace();
    		}
        	try {
    			inputStr = new ByteArrayInputStream(myresult.getBytes("utf-8"));
    		} catch (UnsupportedEncodingException e) {
    			logger.debug("UnsupportedEncodingException");
    			e.printStackTrace();
    		}
            return SUCCESS;
        }else{
        	accessToken = ((String[]) pMap.get(Constants.PARAM_ACCESS_TOKEN))[0];
        	if (accessToken.equalsIgnoreCase("") || !ParameterUtilManager.isUuid16(accessToken)) {
				this.setMessage("参数不合法" + Constants.PARAM_ACCESS_TOKEN);
				try {
					myresult = callback + "(" + JSONUtil.serialize(result) + ")";
				} catch (JSONException e1) {
					e1.printStackTrace();
				}
		    	try {
					inputStr = new ByteArrayInputStream(myresult.getBytes("utf-8"));
				} catch (UnsupportedEncodingException e) {
					logger.debug("UnsupportedEncodingException");
					e.printStackTrace();
				}
				return SUCCESS;
			}
        }
		int userId = UserinfoModule.getUserIdByAccToken(accessToken);
		if(userId > 0){
			result = UserinfoModule.checkBasicUserinfo(userId);
			if(result.equals("fail")){
				this.setMessage("根据" + Constants.PARAM_USER_ID + "获取的user或者account为null错误");
				
			}else{
				this.setMessage("根据" + Constants.PARAM_ACCESS_TOKEN + "检查basicinfo成功");
			}
//			lol.info(userId, "用户级检查用户基本信息是否完善成功，结果：" + result, "用户", accessToken, AccountModule.getClientIdByUser(accessToken));
		}else{
			this.setMessage("根据" + Constants.PARAM_ACCESS_TOKEN + "获取的uid错误");
//			lol.error(-1, "用户级检查用户基本信息是否完善失败，根据" + Constants.PARAM_ACCESS_TOKEN + "获取的uid错误", "用户", accessToken, null);
		}
		try {
			myresult = callback + "(" + JSONUtil.serialize(result) + ")";
		} catch (JSONException e1) {
			e1.printStackTrace();
		}
    	try {
			inputStr = new ByteArrayInputStream(myresult.getBytes("utf-8"));
		} catch (UnsupportedEncodingException e) {
			logger.debug("UnsupportedEncodingException");
			e.printStackTrace();
		}
		return SUCCESS;
	}

	public String getResult() {
		return result;
	}

	public void setResult(String result) {
		this.result = result;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getCallback() {
		return callback;
	}

	public void setCallback(String callback) {
		this.callback = callback;
	}

	public String getMyresult() {
		return myresult;
	}

	public void setMyresult(String myresult) {
		this.myresult = myresult;
	}

	public InputStream getInputStr() {
		return inputStr;
	}

	public void setInputStr(InputStream inputStr) {
		this.inputStr = inputStr;
	}
	
	
}
