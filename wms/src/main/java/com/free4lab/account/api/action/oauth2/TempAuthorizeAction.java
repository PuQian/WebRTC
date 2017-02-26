package com.free4lab.account.api.action.oauth2;

import java.util.Map;
import java.util.UUID;
import java.util.Vector;

import org.apache.log4j.Logger;
import org.perf4j.aop.Profiled;

import com.free4lab.account.common.Constants;
import com.free4lab.account.manager.TempAccountManager;
import com.free4lab.account.manager.WcsUserManager;
import com.free4lab.account.model.WcsUser;
import com.free4lab.account.module.Oauth2Module;
import com.opensymphony.xwork2.ActionContext;

public class TempAuthorizeAction {

	private String temp_name;
	private long temp_begintime;
	private String result;
	private String message;
	private String temp_access_token;

	private static final long serialVersionUID = 1L;
	private static final Logger logger = Logger.getLogger(TempAuthorizeAction.class);
	private static final String SUCCESS = "success";
	public static final long EXPIRE_TIME = Long.parseLong(Constants.ACCESSTOKEN_EXPIRE_TIME);

	@Profiled(tag = "TempAuthorizeAction.execute")
	public String execute() throws Exception{
		Map<String, Object> aMap = ActionContext.getContext().getParameters();
		
		if (aMap.containsKey(Constants.PARAM_TEMP_NAME)) {
			temp_name = ((String[]) aMap.get(Constants.PARAM_TEMP_NAME))[0];
			System.out.println(temp_name);
			if (temp_name.equalsIgnoreCase("")) {
				this.setMessage("参数不合法" + Constants.PARAM_TEMP_NAME);
				return SUCCESS;
			}
		} else {
			this.setMessage("缺少参数" + Constants.PARAM_TEMP_NAME);
			return SUCCESS;
		}
		
		if (aMap.containsKey(Constants.PARAM_TEMP_BEGINTIME)) {
			temp_begintime = Long.parseLong(((String[]) aMap.get(Constants.PARAM_TEMP_BEGINTIME))[0]);
			System.out.println(temp_begintime);
			if (Long.toString(temp_begintime).equalsIgnoreCase("")) {
				this.setMessage("参数不合法" + Constants.PARAM_TEMP_BEGINTIME);
				return SUCCESS;
			}
		} else {
			this.setMessage("缺少参数" + Constants.PARAM_TEMP_BEGINTIME);
			return SUCCESS;
		}
		long temp_begintime2=System.currentTimeMillis();
		if (TempAccountManager.findTempAccountByTemp_Name(temp_name)!=null&&(temp_begintime + EXPIRE_TIME > temp_begintime2) ) {
            setResult("true");
		}else setResult("false");
		temp_access_token=UUID.randomUUID().toString().replace("-", "");
		if(WcsUserManager.findWcsUserByTemp_Name(temp_name)!=null){
			 Vector ve = WcsUserManager.FindTempThirdPartyUser(temp_name);
			    if(!ve.isEmpty()){
			    	WcsUserManager.deleteAccTokenByUserId(ve);
		}
		}		
		Oauth2Module.createTempThirdPartyAccessToken(temp_name, temp_access_token,temp_begintime2);
		
		return SUCCESS;
		
		
		
	}

	public String getTemp_name() {
		return temp_name;
	}

	public void setTemp_name(String temp_name) {
		this.temp_name = temp_name;
	}



	public long getTemp_begintime() {
		return temp_begintime;
	}

	public void setTemp_begintime(long temp_begintime) {
		this.temp_begintime = temp_begintime;
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

	public String getTemp_access_token() {
		return temp_access_token;
	}

	public void setTemp_access_token(String temp_access_token) {
		this.temp_access_token = temp_access_token;
	}





}
