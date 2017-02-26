package com.free4lab.account.api.action.friendships;

import java.util.Map;

import org.perf4j.aop.Profiled;

import com.free4lab.account.common.Constants;
//import com.free4lab.account.manager.LogUtilManager;
import com.free4lab.account.manager.ParameterUtilManager;
import com.free4lab.account.model.User;
import com.free4lab.account.module.AccountModule;
import com.free4lab.account.module.FriendshipsModule;
import com.free4lab.account.module.UserinfoModule;
import com.free4lab.utils.action.BaseAction;
import com.opensymphony.xwork2.ActionContext;

public class AddFriendAction extends BaseAction {

	/**
	 * 添加好友
	 */
	private static final long serialVersionUID = 1L;

	//private static final Logger logger = Logger.getLogger(AddFriendAction.class);
//	private static final LogUtilManager lol = new LogUtilManager(AddFriendAction.class);

	private String result="";
	private String message="";
	
	@Profiled(tag="AddFriendAction.execute")
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
        	if (!ParameterUtilManager.isUuid(accessToken)) {
				this.setMessage("参数不合法" + Constants.PARAM_ACCESS_TOKEN);
				return SUCCESS;
			}
        }
		//检验参数friend_id		
		int frid = -1;
		if ( pMap == null || !pMap.containsKey(Constants.PARAM_USER_ID) ){
            this.setMessage("缺少参数 " + Constants.PARAM_USER_ID);
            return SUCCESS;
        }else{
        	String temStr = ((String[]) pMap.get(Constants.PARAM_USER_ID))[0];
        	if (temStr.equalsIgnoreCase("")||!ParameterUtilManager.isInt(temStr) ) {
				this.setMessage("参数不合法" + Constants.PARAM_USER_ID);
				return SUCCESS;
        	}else{
        		frid = Integer.parseInt(temStr);
        	}
        }
		//检验参数group_id
		int group_id = -1;
		if ( !pMap.containsKey(Constants.PARAM_GROUP_ID) ){
            this.setMessage("缺少参数 " + Constants.PARAM_GROUP_ID);
            return SUCCESS;
        }else{
        	String temStr = ((String[]) pMap.get(Constants.PARAM_GROUP_ID))[0];
        	if (temStr.equalsIgnoreCase("") || !ParameterUtilManager.isInt(temStr) ){
				this.setMessage("参数不合法" + Constants.PARAM_GROUP_ID);
				return SUCCESS;
        	}else{
        		group_id = Integer.parseInt(temStr);
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
		//加好友
		this.setResult( FriendshipsModule.addFriend(userId, frid, group_id) );
		if(result!="fail"){
			this.setMessage("添加成功");
//			lol.info(userId, "用户级添加好友成功", "好友", accessToken, AccountModule.getClientIdByUser(accessToken));
		}else{
			this.setMessage("添加失败");
//			lol.error(userId, "用户级添加好友失败", "好友", accessToken, AccountModule.getClientIdByUser(accessToken));
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

}
