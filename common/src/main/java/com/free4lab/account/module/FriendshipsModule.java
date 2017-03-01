package com.free4lab.account.module;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.apache.log4j.Logger;
import org.apache.struts2.json.JSONException;
import org.apache.struts2.json.JSONUtil;

import com.free4lab.account.common.Constants;
import com.free4lab.account.manager.UserManager;
import com.free4lab.account.manager.UtilFriendManager;
import com.free4lab.account.model.GroupFriend;
import com.free4lab.account.model.GroupList;
import com.free4lab.account.model.GroupUser;
import com.free4lab.account.model.User;

public class FriendshipsModule {
	private static final Logger logger = Logger.getLogger(FriendshipsModule.class);
	/*
	 * 缺少参数或参数不合法，抛异常
	 * */	
	public static void doParameterException(String myresult,String result , 
			String callback, InputStream inputStr){
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
	}
	
	/*
	 * 加好友，首先判断给定的groupId是否正确
	 * */
	public static String addFriend(Integer userId, Integer friendId,
			Integer groupId) {
		String status="fail";
		//A要添加B为好友，首先要检测B是否为A的好友，若是则不再添加
		if( UtilFriendManager.isFriend(userId, friendId) >0){
			return "fail";
		}else{		
			List<GroupList> groupLists = UtilFriendManager.getGroupListByUid(userId);
			boolean flag = false;
			for(GroupList groupList : groupLists){
				if(groupList.getId() == groupId){
					flag = true;
					break;
				}
			}
			if(flag == false){
				return status;
			}
			//A要添加B为好友，首先检测B是否已添加A为好友。若为好友，返回B所在的行
			GroupFriend hisGroupFriend = UtilFriendManager.checkFriend(friendId, userId);
			//返回值是null，说明B没有添加A为好友；否则，返回的是A在B群组（group_friend）
			if(hisGroupFriend == null){
				if(UtilFriendManager.addFriendToGroup(userId, friendId, groupId, 0) != null){
					status="single";//follow为0的情况说明是单向好友
				}
			}else{
				//插入A与B的好友关系
				GroupFriend myGroupFriend = UtilFriendManager.addFriendToGroup(userId, friendId, groupId, hisGroupFriend.getId());
				//修改B的好友关系中friendId=A一行数据的follow属性，即follow中存储的是对称的反向关系的id
				hisGroupFriend.setFollow(myGroupFriend.getId());
				UtilFriendManager.updateGroupFriend(hisGroupFriend);
				status="both";
			}
			updateGroupTime(groupId);
			return status;
		}	
	}
	
	/*
	 * 删除好友
	 * */
	public static String delFriend(Integer userId, Integer friendId) {
		GroupFriend myGroupFriend = UtilFriendManager.checkFriend(userId, friendId);
		String status = "fail";
		if(myGroupFriend != null){
			if(myGroupFriend.getFollow() != 0){
				//是双向的好友关系
				GroupFriend hisGroupFriend = UtilFriendManager.findGroupFriendById(myGroupFriend.getFollow());
				hisGroupFriend.setFollow(0);
				UtilFriendManager.updateGroupFriend(hisGroupFriend);
				status = "both";//both
			}else{
				status = "single";//single
			}
			updateGroupTime(myGroupFriend.getGroup_id());
			UtilFriendManager.delGroupFriendByPrimaryKey(myGroupFriend.getId());
		}
		return status;
	}
	/*
	 * 创建非根组的群组
	 * */
	public static GroupList addGroup(Integer userId, String groupName){
		GroupList myGroup = new GroupList(groupName);
		UtilFriendManager.saveGroupList(myGroup);
		if(myGroup != null){
			Integer groupId = myGroup.getId();
			GroupUser groupUser = new GroupUser(userId, groupId, "0");//isRoot=0代表非根组
			UtilFriendManager.saveGroupUser(groupUser);
			updateGroupTime(groupId);
		}
		return myGroup;
	}
	
	/*
	 * 删除群组
	 * */
	public static Boolean delGroup(Integer userId, Integer groupId) {
		List<GroupUser> groupUsers = UtilFriendManager.findGroupUserByProperty2("uid", userId, "group_id", groupId);
		if(groupUsers.size() > 0){
			String isRoot=groupUsers.get(0).getIs_root();
			if(isRoot.equals("1")){
				//根组不可被删除
				return false;
			}else if(isRoot.equals("0")){
				//将好友归入到根组，再删除子组
				Integer rootGroupId = UtilFriendManager.getRootGroupId(userId);
				List<GroupFriend> groupFriends = UtilFriendManager.findGroupFriendByProperty("group_id", groupId);
				for(GroupFriend aGroupFriend:groupFriends){
					aGroupFriend.setGroup_id(rootGroupId);
					UtilFriendManager.updateGroupFriend(aGroupFriend);
					updateGroupTime(rootGroupId);
				}
				UtilFriendManager.delGroupUserByPrimaryKey(groupUsers.get(0).getId());
				UtilFriendManager.delGroupListByPrimaryKey(groupId);
				return true;
			}
		}
		return false;
	}
	
	/*
	 * 更新好友群组信息（由旧群组更新到新群组）
	 * */
	public static boolean updateFriend(Integer userId, Integer friendId,
			Integer oldGroupId, Integer newGroupId) {
		List<GroupList> groupLists = UtilFriendManager.getGroupListByUid(userId);
		boolean flag = false;
		for(GroupList groupList : groupLists){
			if(groupList.getId() == newGroupId){
				flag = true;
				break;
			}
		}
		List<GroupFriend> groupFriends = UtilFriendManager.findGroupFriendByProperty2("group_id", oldGroupId, "friend_id", friendId);
		if(groupFriends.size() > 0 && flag){
			GroupFriend myGroupFriend = groupFriends.get(0);
			myGroupFriend.setGroup_id(newGroupId);
			UtilFriendManager.updateGroupFriend(myGroupFriend);
			updateGroupTime(oldGroupId);
			updateGroupTime(newGroupId);
			return true;
		}
		return false;
	}
	
	/*
	 * 修改群组信息（修改群组名称）
	 * */
	public static boolean updateGroup(Integer userId, Integer groupId,
			String groupName) {
		List<GroupUser> groupUsers=UtilFriendManager.findGroupUserByProperty2("uid", userId, "group_id", groupId);
		if(groupUsers.size()>0){
			GroupList myGroupList=UtilFriendManager.findGroupListById(groupId);
			myGroupList.setName(groupName);
			myGroupList.setUpdate_time(System.currentTimeMillis());
			UtilFriendManager.updateGroupList(myGroupList);
			return true;
		}
		return false;
	}
	
	/*
	 * 好友关系进行修改，要更改群组的更新时间
	 * */
	public static void updateGroupTime(Integer groupId) {
		GroupList myGroupList=UtilFriendManager.findGroupListById(groupId);
		if(myGroupList != null){
			myGroupList.setUpdate_time(System.currentTimeMillis());
			UtilFriendManager.updateGroupList(myGroupList);
		}
	}
	
	/*
	 * 获取某组的好友列表
	 * */
	public static List<User> getFriendsPerGroup(int groupId) {
		List<GroupFriend> myGroupFriends = UtilFriendManager.findGroupFriendByProperty("group_id", groupId);
		List<Integer> myGroupFriendIds = new ArrayList<Integer>();
		for (GroupFriend myGroupFriend : myGroupFriends){
			myGroupFriendIds.add(myGroupFriend.getFriend_id());
		}
		
		if(myGroupFriendIds.size()>0){
			List<User> allUsers =  UserManager.getUserByUserId(myGroupFriendIds);
			List<User> users = new ArrayList<User>();
			for( User u : allUsers ){
				User newUser = new User();
				//newUser.setId(u.getId());
				newUser.setUid(u.getUid());
				newUser.setEmail(u.getEmail());
				newUser.setDescription(u.getDescription());
				newUser.setReal_name(u.getReal_name());
				newUser.setGender(u.getGender());
				if( null == u.getScreen_name() || u.getScreen_name().length() < 1){
					int l = u.getEmail().indexOf('@');
					newUser.setScreen_name(u.getEmail().substring(0, l));
				}else{
					newUser.setScreen_name(u.getScreen_name());
				}
				if( null == u.getProfile_image_url() || u.getProfile_image_url().length() < 1){
					newUser.setProfile_image_url(Constants.DEFAULT_AVATAR);
				}else{
					newUser.setProfile_image_url(u.getProfile_image_url());
				}
				users.add(newUser);
			}
			return users;
		}
		return Collections.emptyList();
	}
	
	/*
	 * 获取我的好友关系最新更改时间
	 * */
	public static long getLatestTime(Integer userId){
		List<GroupList> groupLists = UtilFriendManager.getGroupListByUid(userId);
		long tempTime=groupLists.get(0).getUpdate_time();
		for(GroupList itemGroupList:groupLists){
			if(itemGroupList.getUpdate_time() > tempTime){
				tempTime = itemGroupList.getUpdate_time();
			}
		}
		return tempTime;
	}

}
