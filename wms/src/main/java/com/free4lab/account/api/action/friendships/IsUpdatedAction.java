package com.free4lab.account.api.action.friendships;

import java.util.Map;

import org.perf4j.aop.Profiled;

import com.free4lab.utils.action.BaseAction;
import com.free4lab.account.common.Constants;
//import com.free4lab.account.manager.LogUtilManager;
import com.free4lab.account.manager.ParameterUtilManager;
import com.free4lab.account.model.User;
import com.free4lab.account.module.AccountModule;
import com.free4lab.account.module.FriendshipsModule;
import com.free4lab.account.module.UserinfoModule;
import com.opensymphony.xwork2.ActionContext;

public class IsUpdatedAction extends BaseAction {

	/**
	 * 检测我的好友关系是否发生了改变
	 */
	private static final long serialVersionUID = 1L;
//	private static final LogUtilManager lol = new LogUtilManager(IsUpdatedAction.class);
	private String result="";
	private String message="";
	private long latestTime=-1;
	
	@Profiled(tag="IsFriendAction.execute")
	public String execute() throws Exception{
		Map<String, Object> pMap = ActionContext.getContext().getParameters();
		//检验参数access_token
		String accessToken = "";
		result = "fail";
		if (pMap == null || !pMap.containsKey(Constants.PARAM_ACCESS_TOKEN)) {
            this.setMessage("缺少参数 " + Constants.PARAM_ACCESS_TOKEN);
            return SUCCESS;
        }else{
        	accessToken = ((String[]) pMap.get(Constants.PARAM_ACCESS_TOKEN))[0];
        	if (accessToken.equalsIgnoreCase("") || !ParameterUtilManager.isUuid(accessToken)) {
				this.setMessage("参数不合法" + Constants.PARAM_ACCESS_TOKEN);
				return SUCCESS;
			}
        }
				
		int userId = UserinfoModule.getUserIdByAccessToken(accessToken);
		if(userId > 0){
			User user = UserinfoModule.getUserByUserId(userId);
			if(user == null){
				this.setMessage("根据" + Constants.PARAM_USER_ID + "获取的user或者account为null错误");
				this.setResult("fail");
//				lol.warn(userId, "用户级根据用户Id获取用户失败", "好友", accessToken, AccountModule.getClientIdByUser(accessToken));
				return SUCCESS;
			}
		}else{
			this.setMessage("根据" + Constants.PARAM_ACCESS_TOKEN + "获取的uid错误");
			this.setResult("fail");
//			lol.error(userId, "用户级获取用户Id错误", "好友", accessToken, AccountModule.getClientIdByUser(accessToken));
			return SUCCESS;
		}
		
		if(FriendshipsModule.getLatestTime(userId) > 0){
			this.setLatestTime(FriendshipsModule.getLatestTime(userId));
			this.setResult("success");
			this.setMessage("更新时间获取成功");
//			lol.info(userId, "用户级检测好友关系更新成功", "好友", accessToken, AccountModule.getClientIdByUser(accessToken));
			return SUCCESS;
		}else{
			this.setResult("fail");
			this.setMessage("更新时间获取失败");
//			lol.error(userId, "用户级检测好友关系更新失败", "好友", accessToken, AccountModule.getClientIdByUser(accessToken));
			return SUCCESS;
		}
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

	public long getLatestTime() {
		return latestTime;
	}

	public void setLatestTime(long latestTime) {
		this.latestTime = latestTime;
	}

	
}
