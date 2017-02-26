package com.free4lab.account.api.action.tempaccount;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.apache.log4j.Logger;
import org.perf4j.aop.Profiled;

import com.free4lab.account.common.Constants;
import com.free4lab.account.manager.AccountManager;
import com.free4lab.account.manager.ClientManager;
//import com.free4lab.account.manager.LogUtilManager;
import com.free4lab.account.manager.ParameterUtilManager;
import com.free4lab.account.manager.TempAccountManager;
import com.free4lab.account.model.Client;
import com.free4lab.account.module.AccountModule;
import com.free4lab.account.module.Oauth2Module;
import com.free4lab.account.module.AccountModule.LoginResult;
import com.free4lab.utils.account.AccountUtil;
import com.free4lab.utils.action.BaseAction;
import com.free4lab.utils.hash.Md5Util;
import com.opensymphony.xwork2.ActionContext;

public class AddTempAccountAction extends BaseAction {
	/**
	 *添加新临时用户 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 增加临时用户信息
	 */
	private static final Logger logger = Logger.getLogger(AddTempAccountAction.class);
	
	private String inviter_email="";
	private String temp_name="";
	private String temp_account="";
	private Integer temp_type=-1;
	private String temp_url="";
	private long temp_begintime=-1;
	private Integer temp_valid=-1;
	private String temp_extend="";
	private String message = "";
	private String result = "fail";


	@Profiled(tag = "AddTempAccountAction.execute")
	public String execute() throws Exception{
		
		System.out.println("in AddTempAccountAction");
		Map<String, Object> aMap = ActionContext.getContext().getParameters();
		
//		inviter_email=((String[]) aMap.get("inviter_email"))[0];
//		temp_type=Integer.valueOf(((String[]) aMap.get("temp_type"))[0]);		
//		temp_extend=((String[]) aMap.get("temp_extend"))[0];
		if (aMap.containsKey(Constants.PARAM_INVITER_EMAIL)) {
			inviter_email = ((String[]) aMap.get(Constants.PARAM_INVITER_EMAIL))[0];
			System.out.println(inviter_email);
			if (inviter_email.equalsIgnoreCase("")) {
				this.setMessage("参数不合法" + Constants.PARAM_INVITER_EMAIL);
				return SUCCESS;
			}
		} else {
			this.setMessage("缺少参数" + Constants.PARAM_INVITER_EMAIL);
			return SUCCESS;
		}
		
		if (aMap.containsKey(Constants.PARAM_TEMP_TYPE)) {
			temp_type = Integer.valueOf(((String[]) aMap.get(Constants.PARAM_TEMP_TYPE))[0]);
			if (temp_type==-1) {
				this.setMessage("参数不合法" + Constants.PARAM_TEMP_TYPE);
				return SUCCESS;
			}
		} else {
			this.setMessage("缺少参数" + Constants.PARAM_TEMP_TYPE);
			return SUCCESS;
		}
		
		if (aMap.containsKey(Constants.PARAM_TEMP_EXTEND)) {
			temp_extend = ((String[]) aMap.get(Constants.PARAM_TEMP_EXTEND))[0];
			if (temp_extend.equalsIgnoreCase("")) {
				this.setMessage("参数不合法" + Constants.PARAM_TEMP_EXTEND);
				return SUCCESS;
			}
		} else {
			this.setMessage("缺少参数" + Constants.PARAM_TEMP_EXTEND);
			return SUCCESS;
		}
		
	
		
		temp_account=UUID.randomUUID().toString().replace("-", "");
		temp_name="temp"+temp_account+"@WebRTC";
		temp_begintime=System.currentTimeMillis();
		temp_valid=1;
		
		if (aMap.containsKey(Constants.PARAM_TEMP_URL)) {
			temp_url = ((String[]) aMap.get(Constants.PARAM_TEMP_URL))[0];
			temp_url=temp_url+"/temploginauth?temp_name="+temp_name+"&temp_begintime="+temp_begintime+"&temp_type="+temp_type+"&inviter_email="+inviter_email;
			if (temp_url.equalsIgnoreCase("") ) {
				this.setMessage("参数不合法" + Constants.PARAM_TEMP_URL);
				return SUCCESS;
			}
		} else {
			this.setMessage("缺少参数" + Constants.PARAM_TEMP_URL);
			return SUCCESS;
		}

		System.out.println("inviter_email="+inviter_email);
		System.out.println("temp_account="+temp_account);
		System.out.println("temp_name="+temp_name);
		System.out.println("temp_type="+temp_type);

		System.out.println("temp_url="+temp_url);
		System.out.println("temp_begintime="+temp_begintime);
		System.out.println("temp_valid="+temp_valid);
		System.out.println("temp_extend="+temp_extend);
//		inviter_email=(String) session.get(Constants.KEY_USER_EMAIL);
//		temp_name="temp";
//		temp_account=UUID.randomUUID().toString().replace("-", "");
//		temp_type=0;
//		temp_url="123456";
//		temp_begintime=System.currentTimeMillis();
//		temp_valid=1;
//		temp_extend="webrtc";
//		
		if(TempAccountManager.addTempAccount(inviter_email, temp_name, temp_account, temp_type,
				temp_url, temp_begintime, temp_valid, temp_extend)){
			logger.info("testaddtempaccount");
			System.out.println("abcdefg");
		}
		setMessage("Action is success!");
		setResult("true");
		return SUCCESS;
	}




	public String getInviter_email() {
		return inviter_email;
	}




	public void setInviter_email(String inviter_email) {
		this.inviter_email = inviter_email;
	}




	public String getTemp_name() {
		return temp_name;
	}




	public void setTemp_name(String temp_name) {
		this.temp_name = temp_name;
	}




	public String getTemp_account() {
		return temp_account;
	}




	public void setTemp_account(String temp_account) {
		this.temp_account = temp_account;
	}




	public Integer getTemp_type() {
		return temp_type;
	}




	public void setTemp_type(Integer temp_type) {
		this.temp_type = temp_type;
	}




	public String getTemp_url() {
		return temp_url;
	}




	public void setTemp_url(String temp_url) {
		this.temp_url = temp_url;
	}




	public long getTemp_begintime() {
		return temp_begintime;
	}




	public void setTemp_begintime(long temp_begintime) {
		this.temp_begintime = temp_begintime;
	}




	public Integer getTemp_valid() {
		return temp_valid;
	}




	public void setTemp_valid(Integer temp_valid) {
		this.temp_valid = temp_valid;
	}




	public String getTemp_extend() {
		return temp_extend;
	}




	public void setTemp_extend(String temp_extend) {
		this.temp_extend = temp_extend;
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
