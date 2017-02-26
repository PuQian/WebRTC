package com.free4lab.account.api.action.oauth2;

import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.perf4j.aop.Profiled;

import com.free4lab.account.common.Constants;
import com.free4lab.account.manager.AccessTokenManager;
//import com.free4lab.account.manager.LogUtilManager;
import com.free4lab.account.manager.ParameterUtilManager;
import com.free4lab.account.module.AccountModule;
import com.free4lab.account.module.Oauth2Module;
import com.free4lab.utils.action.BaseAction;
import com.opensymphony.xwork2.ActionContext;

public class GetTokenInfoAction extends BaseAction {

	/**
	 * 获取access_token的信息 判断accessToken是否有效（通过valid和时间），若有效返回剩余时间，否则返回-1
	 */
	private static final long serialVersionUID = 1L;
	final static Logger logger = Logger.getLogger(GetTokenInfoAction.class);
//	private static final LogUtilManager lol = new LogUtilManager(GetTokenInfoAction.class);

	private String message="";
	private String result = "fail";
	private String expire_in = "-1";
	private String uid = "-1";

	@Profiled(tag = "GetTokenInfoAction.execute")
	public String execute() {
		// 获取参数&参数合法性检查
		Map<String, Object> pMap = ActionContext.getContext().getParameters();
		String access_token = "";
		if (!pMap.containsKey(Constants.PARAM_ACCESS_TOKEN)) {
			this.setMessage("缺少参数 " + Constants.PARAM_ACCESS_TOKEN);
			return SUCCESS;
		} else {
			access_token = ((String[]) pMap.get(Constants.PARAM_ACCESS_TOKEN))[0];
			if (access_token.equalsIgnoreCase("") ||!ParameterUtilManager.isUuid(access_token)) {
				this.setMessage("参数不合法" + Constants.PARAM_ACCESS_TOKEN);
				return SUCCESS;
			}
		}

		// 获取Token信息
		List<String> results = Oauth2Module.getAccessTokenInfo(access_token);
		if (results.size() == 2) {
			uid = results.get(0);
			expire_in = results.get(1);
			this.setMessage("获取成功");
			this.setResult("success");
//			lol.info(Integer.parseInt(uid), "用户级验证" + Constants.KEY_ACCESSTOKEN + "是否有效成功，expire_in："+expire_in, "OAuth2.0", access_token, AccountModule.getClientIdByUser(access_token));
		}else{
			this.setMessage("获取失败");
//			lol.info(-1, "用户级验证" + Constants.KEY_ACCESSTOKEN + "是否有效失败", "OAuth2.0", access_token, null);
		}

		return SUCCESS;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getExpire_in() {
		return expire_in;
	}

	public void setExpire_in(String expire_in) {
		this.expire_in = expire_in;
	}

	public String getUid() {
		return uid;
	}

	public void setUid(String uid) {
		this.uid = uid;
	}

	public String getResult() {
		return result;
	}

	public void setResult(String result) {
		this.result = result;
	}
}
