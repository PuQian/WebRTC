package com.free4lab.account.api.action.friendships;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.perf4j.aop.Profiled;

import com.free4lab.account.common.Constants;
//import com.free4lab.account.manager.LogUtilManager;
import com.free4lab.account.manager.ParameterUtilManager;
import com.free4lab.account.manager.UtilFriendManager;
import com.free4lab.account.model.GroupList;
import com.free4lab.account.model.User;
import com.free4lab.account.module.AccountModule;
import com.free4lab.account.module.FriendshipsModule;
import com.free4lab.account.module.UserinfoModule;
import com.free4lab.utils.action.BaseAction;
import com.opensymphony.xwork2.ActionContext;

public class GetGroupFriendListAction extends BaseAction {

	/**
	 * 返回组信息以及组内好友列表
	 */
	private static final long serialVersionUID = 1L;
//	private static final LogUtilManager lol = new LogUtilManager(GetGroupFriendListAction.class);
	private String result = "";
	private String message = "";
	private List<GroupFriends> lists = new ArrayList<GroupFriends>();		
	
	@Profiled(tag="GetGroupFriendListAction.execute")
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
		Integer rootGroupId = UtilFriendManager.getRootGroupId(userId);
		List<GroupList> myGroups = UtilFriendManager.getGroupListByUid(userId);
		for(GroupList aGroup:myGroups){
			Integer group_id = aGroup.getId();
			String group_name = aGroup.getName();
			Boolean isRoot;
			if(aGroup.getId() == rootGroupId){
				isRoot = true;
			}else{
				isRoot = false;
			}
			List<User> group_member = FriendshipsModule.getFriendsPerGroup(aGroup.getId());
			group_member = UserinfoModule.getBasicUserInfos(group_member);
			GroupFriends groupContent = new GroupFriends(group_id,group_name,isRoot,group_member);
			lists.add(groupContent);
		}
		if(lists.size() > 0){
			this.setMessage("获取成功");
			this.setResult("success");
//			lol.info(userId, "用户级获取组信息及组内好友列表成功", "好友", accessToken, AccountModule.getClientIdByUser(accessToken));
		}else{
			this.setMessage("获取失败");
			this.setResult("fail");
//			lol.error(userId, "用户级获取组信息及组内好友列表失败", "好友", accessToken, AccountModule.getClientIdByUser(accessToken));
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

	public List<GroupFriends> getLists() {
		return lists;
	}

	public void setLists(List<GroupFriends> lists) {
		this.lists = lists;
	}

}
