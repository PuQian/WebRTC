package com.free4lab.account.manager;

import java.util.Collections;
import java.util.List;

import org.apache.log4j.Logger;

import com.free4lab.account.model.Group;
import com.free4lab.account.model.GroupDAO;

public class GroupManager {

	/*
	 * 
	 */
	private static GroupDAO groupDAO = new GroupDAO();
	private static final Logger LOGGER = Logger.getLogger(GroupManager.class);
	
	public static List<Group> getAllGroups() {
		try{
			return groupDAO.findAll();
		}catch (Exception e) {
			LOGGER.debug(e);
			return Collections.emptyList();
		}
	}
	
	@SuppressWarnings("null")
	public static List<Group> findGroupByUsername(final Object userId){
		try{
			 List<Group> groups = groupDAO.findByUsername(userId);
			 
			 if(groups.isEmpty()){
				 Group group = addGroup2((Integer)userId,"我的好友");
				 if(group == null){
					 return Collections.emptyList();
				 }
				 groups.add(group);
			 }
			 return groups;
		}catch (Exception e) {
			LOGGER.debug(e);
			return Collections.emptyList();
		}
	}
	public static Group findGroupById(final Object groupId){
		try{
			return groupDAO.findByPrimaryKey(groupId);
		}catch (Exception e) {
			LOGGER.debug(e);
			return null;
		}
	}
	
	public static List<Group> findGroupByUsernameForPage(final Object userId,int page,int size){
		try{
			return groupDAO.findByUsernameForPage(userId,page,size);
		}catch (Exception e) {
			LOGGER.debug(e);
			return Collections.emptyList();
		}
	} 
	
	public static long countGroupByUsernameForPage(final Object userId){
		try{
			return groupDAO.countByUsernameForPage(userId);
		}catch (Exception e) {
			LOGGER.debug(e);
			return -1;
		}
	}
	
	//返回ture or false
	public static boolean updateGroup(Integer id, Integer userId, String groupName) {
		Group group = groupDAO.findById(id);
		if(group == null){
			return false;
		}		
		group.setId(id);
		group.setUserId(userId);
		group.setGroupName(groupName);
		try{	
			groupDAO.update(group);
			return true;
		}catch (Exception e) {
			LOGGER.debug(e);
			return false;
		}
	}
	
	//返回更新后的群组
	public static Group updateGroup2(Integer id, Integer userId, String groupName) {
		Group group = groupDAO.findById(id);
		if(group == null){
			return null;
		}	
		group.setId(id);
		group.setUserId(userId);
		group.setGroupName(groupName);
		try{	
			groupDAO.update(group);
			return group;
		}catch (Exception e) {
			LOGGER.debug(e);
			return null;
		}
	}


	//返回true or false
	public static boolean addGroup(Integer userId, String groupName) {
		Group group = new Group(userId, groupName);
		try{	
			groupDAO.save(group);
			System.out.println("save success");
			return true;
		}catch (Exception e) {
			LOGGER.debug(e);
			return false;
		}
	}
	//返回group
	public static Group addGroup2(int userId, String groupName) {
		Group group = new Group(userId, groupName);
		try{	
			groupDAO.save(group);
			System.out.println("save success");
			return group;
		}catch (Exception e) {
			LOGGER.debug(e);
			return null;
		}
	}
	
	public static boolean delGroup(Integer id) {
		try{	
			groupDAO.deleteByPrimaryKey(id);
			return true;
		}catch (Exception e) {
			LOGGER.debug(e);
			return false;
		}
	}
	
	public static void main(String[] args){
		List<Group> groups = findGroupByUsername(10000);
		if(null == groups){
			System.out.println("test1");
		}
		else if(groups.isEmpty()){
			System.out.println("test2");
		}
		else{
			System.out.println(groups.size());
		}
 	}
}
