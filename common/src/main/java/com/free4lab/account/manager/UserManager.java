package com.free4lab.account.manager;

import java.util.ArrayList;
import java.util.List;
import com.free4lab.account.model.User;
import com.free4lab.account.model.UserComplete;
import com.free4lab.account.model.UserDAO;
import com.free4lab.account.model.UserEmailEx;
import com.free4lab.account.model.UserPhoneEx;
import com.free4lab.account.model.UserPrivacy;
//import com.webrtc.dao.EaseFriend;
//import com.webrtc.dao.EaseFriendDAO;

public class UserManager {
	
	/**
	 * UserDAO的静态实例
	 */
	private static UserDAO userDAO = new UserDAO();
	
	/**
	 * 根据用户id批量获取用户信息
	 * @param userId
	 * @return
	 */
	public static List<User> getUserByUserId(List<Integer> userIds){
		List<User> list = userDAO.findUsersByIds("uid", userIds);
		if(list.size() <= 0){
			return null;
		}
		return list;
	}
	/**
	 * 获取用户总数目
	 * @return
	 */
	public static Integer userSize(){
		List<User> users = userDAO.findAll();
		Integer size = users.size();
		
		return size;
	}
	
	/**
	 * 根据用户id批量获取用户信息
	 * @param userId
	 * @return
	 */
	public static User getUserByUserId(Integer userId){
		List<User> list = userDAO.findUserById("uid", userId);
		if(list == null || list.size() <= 0){
			return null;
		}
		return list.get(0);
	}
	
	/**
	 * 新增用户信息（新用户注册，未填写详细信息时）
	 * @param userId
	 * @param email
	 * @return
	 */
	public static User addUser(int userId, String email, String real_name, 
			String description, String company){
		User user = new User();
		user.setUid(userId);
		user.setEmail(email);
		user.setReal_name(real_name);
		user.setDescription(description);
		user.setCompany(company);
		try{
			userDAO.save(user);
			return user;
		}catch(Exception ex) {
            System.err.println(ex.getMessage());
            ex.printStackTrace(System.err);
            return null;
		}
	}
	/**
	 * 设置用户company（新用户注册，未填写详细信息时）
	 * @param userId
	 * @param company
	 * @return
	 */
	public static User setUserCompany(int userId, String company){
		UserComplete users = UserManager.getUserInfoCompeleteByUid(userId);
		if(users == null){
			return null;
		}
		users.getUser().setCompany(company);
		try{
			userDAO.update(users.getUser());
			return users.getUser();
		}catch(Exception ex) {
            System.err.println(ex.getMessage());
            ex.printStackTrace(System.err);
            return null;
		}
	}
	
	/**
	 * 获得用户的部分信息
	 * @param uid
	 * @return
	 */
	public static UserComplete getUserInfoPieceByUid(UserComplete user_complete){
		if(user_complete == null){
			return null;
		}
		user_complete.setUser_all_ex(null);
		user_complete.setUser_email_ex(null);
		user_complete.setUser_phone_ex(null);
		user_complete.setUser_privacy(null);
		
		User user = new User();
		user.setEmail(user_complete.getUser().getEmail());
		user.setReal_name(user_complete.getUser().getReal_name());
		user.setProfile_image_url(user_complete.getUser().getProfile_image_url());
		user.setDescription(user_complete.getUser().getDescription());
		user_complete.setUser(user);
		
		return user_complete;
	}
	
	/**
	 * 获得用户的完整信息
	 * @param uid
	 * @return
	 */
	public static UserComplete getUserInfoCompeleteByUid(int uid){
		UserComplete userComplete = new UserComplete();
		List<Integer> uids = new ArrayList<Integer>();
		uids.add(uid);
		List<User> users = getUserByUserId(uids);
		if(users == null){
			return null;
		}
		
		User user = users.get(0);
		userComplete.setUser(user);
		
		
		if(user.getEmail_extend() == 1){
			List<UserEmailEx> userEmailExs = UserEmailExManager.getExemailByUserId(uid);
			userComplete.setUser_email_ex(userEmailExs);
		}else{
			userComplete.setUser_email_ex(null);
		}
		
		if(user.getPhone_extend() == 1){
			List<UserPhoneEx> userPhoneExs = UserPhoneExManager.getExphoneByUserId(uid);
			userComplete.setUser_phone_ex(userPhoneExs);
		}else{
			userComplete.setUser_phone_ex(null);
		}
		
		List<UserPrivacy> userPrivacy = UserPrivacyManager.getUserPrivacyByUserId(uid);
		userComplete.setUser_privacy(userPrivacy);
		return userComplete;
	}
	
	public static User editUser(User user){
		try{
			userDAO.update(user);
			return user;
		}catch(Exception ex) {
            System.err.println(ex.getMessage());
            ex.printStackTrace(System.err);
            return null;
		}
	}

	/**
	 * 删除用户信息
	 * @param userId
	 * @param email
	 * @return
	 */
	public static int delUser(int userId, String email) {
		List<User> users = userDAO.findByProperty2("uid", userId, "email", email);
		if(users.size()>0){
			int uid = users.get(0).getId();
			try{
				userDAO.deleteByPrimaryKey(users.get(0).getId());
				return uid;
			} catch (Exception ex) {
                System.err.println(ex.getMessage());
                ex.printStackTrace(System.err);
                return -1;
            }
		}
		return -1;
	}

	/*
	 * 根据email获取uid
	 * 
	 * */
	public static int searchUidByEmail (String email){
		return userDAO.searchUidByEmail(email);
	}
	
	public static List<User> getUserByCompany(String email, String screenName, String company) {
		List<User> list = userDAO.findByProperty3("email", email, "screen_name", screenName, 
				"company", company);
		return list;
	}
	
	public static List<User> getUserByCompanyByPage(String email, String screenName, 
			String company, int page, int pageSize) {
		List<User> list = userDAO.findByProperty3ByPage("email", email, "screen_name", 
				screenName, "company", company, page, pageSize);
		return list;
	}
	
	public static List<User> getUserByCompany(String email, String realName, 
			String company,String description) {
		List<User> list = userDAO.findByProperty4("email", email, "real_name", 
				realName, "company", company,"description",description);
		return list;
	}
	
	public static List<User> getUserByCompanyByPage(String email, String realName, 
			String company,String description, int page, int pageSize) {
		List<User> list = userDAO.findByProperty4ByPage("email", email, "real_name", 
				realName, "company", company,"description",description, page, pageSize);
		return list;
	}
	
	/**
	 * 修改用户信息
	 * @param userId
	 * @param avatar
	 * @param userName
	 * @param realName
	 * @param sex
	 * @param phone
	 * @param qq
	 * @param intro
	 * @return
	 */
	/*public static User editUser(int userId, String profile_image_url, String screen_name, 
							String realName, int sex, String phone, String qq, String intro){
		User user = userDAO.findByProperty("userId", userId).get(0);
		user.setProfile_image_url(profile_image_url);
		user.setUserName(userName);
		user.setRealName(realName);
		user.setSex(sex);
		user.setPhone(phone);
		user.setQq(qq);
		user.setIntro(intro);
		try{
			userDAO.save(user);
			return user;
		}catch(Exception ex) {
            System.err.println(ex.getMessage());
            ex.printStackTrace(System.err);
            return null;
		}
	}*/
	public static void main(String[] args){
		UserManager usermanager = new UserManager();
		System.out.println(usermanager.searchUidByEmail("webrtc1@163.com"));
	}
}

