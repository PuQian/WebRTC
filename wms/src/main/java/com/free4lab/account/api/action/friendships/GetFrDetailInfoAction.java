package com.free4lab.account.api.action.friendships;

import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.perf4j.aop.Profiled;

import com.free4lab.account.annotation.util.PrivacyUtil;
import com.free4lab.account.common.Constants;
//import com.free4lab.account.manager.LogUtilManager;
import com.free4lab.account.manager.ParameterUtilManager;
import com.free4lab.account.manager.UserManager;
import com.free4lab.account.manager.UserPrivacyManager;
import com.free4lab.account.manager.UtilFriendManager;
import com.free4lab.account.model.GroupFriend;
import com.free4lab.account.model.User;
import com.free4lab.account.model.UserComplete;
import com.free4lab.account.model.UserEmailEx;
import com.free4lab.account.model.UserPhoneEx;
import com.free4lab.account.model.UserPrivacy;
import com.free4lab.account.module.AccountModule;
import com.free4lab.account.module.UserinfoModule;
import com.free4lab.utils.action.BaseAction;
import com.opensymphony.xwork2.ActionContext;

public class GetFrDetailInfoAction extends BaseAction {

	/**
	 * 根据一个好友的id，返回好友的全部信息
	 */
	private static final long serialVersionUID = 1L;
	
	final static Logger logger = Logger.getLogger(GetFrDetailInfoAction.class);
//	private static final LogUtilManager lol = new LogUtilManager(GetFrDetailInfoAction.class);
	
	private UserComplete user_complete = new UserComplete();
	private String result = "";
	private String message = "";
		
	@Profiled(tag="GetFrDetailInfoAction.execute")
	public String execute(){
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
		//检验参数friend_id		
		int frid = -1; 
		if (pMap == null || !pMap.containsKey(Constants.PARAM_USER_ID) ){
            this.setMessage("缺少参数 " + Constants.PARAM_USER_ID);
            return SUCCESS;
        }else{
        	String tempStr = ((String[]) pMap.get(Constants.PARAM_USER_ID))[0];
        	if (tempStr.equalsIgnoreCase("") || !ParameterUtilManager.isInt(tempStr) ) {
				this.setMessage("参数不合法" + Constants.PARAM_USER_ID);
				return SUCCESS;
        	}else{
        		frid = Integer.parseInt(tempStr);
        	}
        }
		logger.info("获取id为"+frid+"的好友信息");
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
		//获取此好友的全部信息
		user_complete = UserManager.getUserInfoCompeleteByUid(frid);
		user_complete.setUser(UserinfoModule.getBasicUserInfo(user_complete.getUser()));
		logger.info(user_complete.getUser().getEmail());
		//检查“我”是不是frId的好友，若不是，获取好友部分信息
		GroupFriend isFriend = UtilFriendManager.checkFriend(frid, userId);
		if(isFriend == null && userId!=frid){
			logger.info("我不是他的好友");
			user_complete = UserManager.getUserInfoPieceByUid(user_complete);
			
			if(user_complete.getUser().getReal_name()!=null){
				this.setMessage("我不是他的好友，获取部分信息");
				this.setResult("success");
//				lol.info(userId, "用户级获取非好友的部分信息成功", "好友", accessToken, AccountModule.getClientIdByUser(accessToken));
			}else{
				this.setMessage("获取部分信息失败");
				this.setResult("fail");
//				lol.error(userId, "用户级获取非好友的部分信息失败", "好友", accessToken, AccountModule.getClientIdByUser(accessToken));
			}
			return SUCCESS;
		}
        //得到此好友全部的隐私设置
		List<UserPrivacy> userPrivacy = new ArrayList<UserPrivacy>();
		userPrivacy = UserPrivacyManager.getUserPrivacyByUserId(frid);
		logger.info("userPrivacy");
		if(userPrivacy == null || userPrivacy.size() == 0){
			this.setMessage("你的权限不够，只能获取部分信息");
			this.setResult("success");
//			lol.info(userId, "用户级因权限不够，获取好友的部分信息成功", "好友", accessToken, AccountModule.getClientIdByUser(accessToken));
			return SUCCESS;
		}
		for(UserPrivacy up : userPrivacy){
			if( "email_extend".equals( up.getItem() ) ){
				//扩展邮箱
				UserEmailEx temp = new UserEmailEx();
				temp = null;
				for( UserEmailEx ue : user_complete.getUser_email_ex() ){
					if( ue.getId() == up.getItemId() ){
						if( up.getPrivacy() == 2 || ( null == isFriend && up.getPrivacy() == 1 ) ){
							temp = ue;
							break;
						}
					}
				}
				if( temp != null ){
					user_complete.getUser_email_ex().remove(temp);
				}
			}else if( "phone_extend".equals( up.getItem() ) ){
				//扩展电话
				UserPhoneEx temp = new UserPhoneEx();
				temp = null;
				for( UserPhoneEx ue : user_complete.getUser_phone_ex() ){
					if( ue.getId() == up.getItemId() ){
						if( up.getPrivacy() == 2 || ( null == isFriend && up.getPrivacy() == 1 ) ){
							temp = ue;
							break;
						}
					}
				}
				if( temp != null ){
					user_complete.getUser_phone_ex().remove(temp);
				}
			}else{
				logger.info(up.getItem());
				//user表中的其他信息
				if( up.getPrivacy() == 2 || ( null == isFriend && up.getPrivacy() == 1 ) ){
					try {
						PrivacyUtil.setPrivacyByAnnotaion(user_complete.getUser(), up.getItem(), "");
					} catch (IllegalArgumentException e) {
						e.printStackTrace();
					} catch (IllegalAccessException e) {
						e.printStackTrace();
					} catch (InvocationTargetException e) {
						e.printStackTrace();
					}
				}
			}
		}
		if(user_complete.getUser().getUid() > 0){
			this.setMessage("成功获取好友信息");
			this.setResult("success");
//			lol.info(userId, "用户级获取好友信息成功", "好友", accessToken, AccountModule.getClientIdByUser(accessToken));
		}else{
			this.setMessage("获取信息失败");
			this.setResult("fail");
//			lol.error(userId, "用户级获取好友信息失败", "好友", accessToken, AccountModule.getClientIdByUser(accessToken));
		}
		return SUCCESS;
	}

	public UserComplete getUser_complete() {
		return user_complete;
	}

	public void setUser_complete(UserComplete user_complete) {
		this.user_complete = user_complete;
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
