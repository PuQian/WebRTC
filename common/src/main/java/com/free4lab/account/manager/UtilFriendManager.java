package com.free4lab.account.manager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import com.free4lab.account.model.GroupFriend;
import com.free4lab.account.model.GroupFriendDAO;
import com.free4lab.account.model.GroupList;
import com.free4lab.account.model.GroupListDAO;
import com.free4lab.account.model.GroupUser;
import com.free4lab.account.model.GroupUserDAO;

public class UtilFriendManager {

	//private static final Logger logger = Logger.getLogger(UtilFriendManager.class);
	/**
	 * GroupFriendDAO、GroupUserDAO、GroupList的静态变量
	 */
	private static GroupFriendDAO groupFriendDAO = new GroupFriendDAO();
	private static GroupUserDAO groupUserDAO = new GroupUserDAO();
	private static GroupListDAO groupListDAO = new GroupListDAO();
	
	/*
	 * 检查某人是不是我的好友，若他是我的好友，返回值为GroupFriend表中这一行记录；否则返回null
	 * */
	public static GroupFriend checkFriend(Integer userId, Integer friendId) {
		List<GroupUser> myGroupUserList = findGroupUserByProperty("uid", userId);
		//存在好友列表
		if(myGroupUserList.size()>0){			
			for(GroupUser itemGroupUser:myGroupUserList){
				Integer groupId = itemGroupUser.getGroup_id();
				//找到好友好友信息
				List<GroupFriend> myGroupFriend = findGroupFriendByProperty2("group_id", groupId, "friend_id", friendId);
				if(myGroupFriend.size()>0 ){
					return myGroupFriend.get(0);
				}				
			}
		}
		return null;
	}
	
	/*
	 * 保存新群组到group_list
	 * */
	public static void saveGroupList(GroupList myGroup){
		groupListDAO.save(myGroup);
	}
	
	/*
	 * 保存用户到group_user
	 * */
	public static void saveGroupUser(GroupUser groupUser){
		groupUserDAO.save(groupUser);
	}
	
	/*
	 * 更新好友信息表group_friend
	 * */
	public static void updateGroupFriend(GroupFriend hisGroupFriend){
		groupFriendDAO.update(hisGroupFriend);
	}
	
	/*
	 * 更新群组信息表group_list
	 * */
	public static void updateGroupList(GroupList myGroupList){
		groupListDAO.update(myGroupList);
	}
	
	/*
	 * 根据ID找到好友
	 * */
	public static GroupFriend findGroupFriendById(Integer friendId){
		return groupFriendDAO.findById(friendId);
	}
	
	/*
	 * 通过主键删除一个GroupFriend
	 * */
	public static void delGroupFriendByPrimaryKey( Integer primaryKey){
		groupFriendDAO.deleteByPrimaryKey(primaryKey);
	}
	/*
	 * 通过主键删除一个GroupUser
	 * */
	public static void delGroupUserByPrimaryKey( Integer primaryKey){
		groupUserDAO.deleteByPrimaryKey(primaryKey);
	}
	/*
	 * 通过主键删除一个GroupList
	 * */
	public static void delGroupListByPrimaryKey( Integer primaryKey){
		groupListDAO.deleteByPrimaryKey(primaryKey);
	}
	
	/*
	 * 通过属性查找GroupFriend
	 * */
	public static List<GroupFriend> findGroupFriendByProperty(String propertyName, Integer value){
		return groupFriendDAO.findByProperty(propertyName, value);
	}
	public static List<GroupFriend> findGroupFriendByProperty2(String propertyName1, Integer value1,
			String propertyName2, Integer value2 ){
		return groupFriendDAO.findByProperty2(propertyName1, value1, propertyName2, value2);
	}
	
	/*
	 * 通过属性查找GroupUser
	 * */
	public static List<GroupUser> findGroupUserByProperty(String propertyName, Integer value){
		return groupUserDAO.findByProperty(propertyName, value);
	}
	public static List<GroupUser> findGroupUserByProperty2(String propertyName1, Integer value1,
			String propertyName2, Integer value2 ){
		return groupUserDAO.findByProperty2(propertyName1, value1, propertyName2, value2);
	}

	/*
	 * 通过groupId查找group_list表
	 * */
	public static GroupList findGroupListById( Integer groupId){
		return groupListDAO.findById(groupId);
	}

	/*
	 * 将好友加入某个群组
	 * */
	public static GroupFriend addFriendToGroup(Integer userId, Integer friendId, Integer groupId, Integer follow){
		//验证该群组是否为该用户所拥有
		List<GroupUser> myGroupUserList = groupUserDAO.findByProperty2("uid", userId, "group_id", groupId);
		if(myGroupUserList.size()>0){
			GroupFriend groupFriend = new GroupFriend(groupId, friendId, follow);
			groupFriendDAO.save(groupFriend);
			return groupFriend;
		}else{
			return null;
		}		
	}
	
	/*
	 * 检测是否为好友，在checkFriend外再封装一层
	 * */
	public static int isFriend(Integer userId, Integer friendId) {
		GroupFriend groupFriend = checkFriend(userId, friendId);
		if(groupFriend != null){
			return groupFriend.getGroup_id();
		}else{
			return -1;
		}
	}
	
	/*
	 * 获取根组id，如果没有根组则新建根组
	 * */
	public static Integer getRootGroupId(Integer userId){		
		List<GroupUser> groupUsers = groupUserDAO.findByProperty2("uid", userId, "is_root", "1");
		if(groupUsers.size()>0){
			return groupUsers.get(0).getGroup_id();
		}else{
			//如果没有根组则建立根组
			GroupList myGroup = new GroupList("我的好友");
			groupListDAO.save(myGroup);
			if(myGroup != null){
				Integer groupId = myGroup.getId();
				GroupUser groupUser = new GroupUser(userId,groupId,"1");//isRoot=1代表根组
				groupUserDAO.save(groupUser);
			}
			return myGroup.getId();
		}
	}

	/*
	 * 获取某人的组列表，若无群组，则创建根组
	 * */
	public static List<GroupList> getGroupListByUid(Integer userId) {
		List<GroupUser> myGroups = groupUserDAO.findByProperty("uid", userId);
		//ComparatorGroup myComparatorGroup = new ComparatorGroup();
		
		Collections.sort(myGroups, new Comparator() {  
	          public int compare(Object a, Object b) {  
	            int one = ((GroupUser)a).getGroup_id();  
	            int two = ((GroupUser)b).getGroup_id();   
	            return one-two ;   
	          }  
	    });
		
		
		List<GroupList> myGroupList = new ArrayList<GroupList>();
		//若有则返回；若为空，则创建根组
		if(myGroups.size()>0){			
			for(GroupUser aGroup:myGroups){
				myGroupList.add(groupListDAO.findById(aGroup.getGroup_id()));
			}
			return myGroupList;
		}else{
			GroupList myGroup = new GroupList("我的好友");
			groupListDAO.save(myGroup);
			if(myGroup != null){
				Integer groupId = myGroup.getId();
				GroupUser groupUser = new GroupUser(userId,groupId,"1");//isRoot=1代表根组
				groupUserDAO.save(groupUser);
			}
			myGroupList.add(myGroup);
			return myGroupList;
		}
	}

	

	
}
