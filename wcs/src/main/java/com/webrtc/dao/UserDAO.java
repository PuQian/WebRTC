package com.webrtc.dao;

import com.free4lab.utils.sql.AbstractDAO;
import com.free4lab.utils.sql.IEntityManagerHelper;
import com.free4lab.utils.sql.entitymanager.NoCacheEntityManagerHelper;

public class UserDAO extends AbstractDAO<User>{
	public static String USER_STATUS_OFFLINE = "offline";
	public static String USER_STATUS_ONLINE = "online";
	public static String USER_STATUS_BUSY = "busy";
	
	public static String USER_STATUS_UNAUTH = "unauth";
	@Override
	public Class getEntityClass() {
		return User.class;
	}

	public static final String PU_NAME = "WebrtcDemoPU";
	@Override
	public String getPUName() {
		return PU_NAME;
	}

	@Override
	public IEntityManagerHelper getEntityManagerHelper() {
		return new NoCacheEntityManagerHelper();
	}
	
	public String getClassName() {
		return getEntityClass().getName();
	}
	
	public User create(String userID, Integer serverID){
		User user = new User(userID, serverID, USER_STATUS_UNAUTH,null);
		save(user);
		return user;
	}
	
	/**
	 * check whether the same serverID before update
	 */
	public void updateServerID(String userID, Integer serverID){
		User user = findByPrimaryKey(userID);
		if(user != null && !user.getServerAddr().equals(serverID)){
			user.setServerAddr(serverID);
			update(user);
		}
	}
	
	public void updateStatus(String userID, String status){
		User user = findByPrimaryKey(userID);
		if(user != null && !user.getStatus().equals(status)){
			user.setStatus(status);
			update(user);
		}
	}
	
	
	public boolean isUserExist(String userID){
		if(findByPrimaryKey(userID) == null)
			return false;
		return true;
	}
	
	/**
	 * 判断是否可以呼叫该用户
	 * @param userID
	 * @return 仅当存在该用户且用户状态为online时返回true
	 */
	public boolean isUserAvailable(String userID){
		User user = findByPrimaryKey(userID);
		if(user != null){
			if(user.getStatus().equals(USER_STATUS_ONLINE) ||user.getStatus().equals(USER_STATUS_BUSY))
				return true;
		}
		return false;
	}
	
	/**
	 * 判断用户是否经过验证
	 * @param userID
	 * @return 仅当存在该用户且用户状态为unauth时返回true
	 */
	public boolean isUserUnauth(String userID){
		User user = findByPrimaryKey(userID);
		if(user != null){
			if(user.getStatus().equals(USER_STATUS_UNAUTH))
				return true;
		}
		return false;
	}
	
	/**
	 * 判断用户是否离线
	 * @param userID
	 * @return 仅当存在该用户且用户状态为offline时返回true
	 */
	public boolean isUserOffline(String userID){
		User user = findByPrimaryKey(userID);
		if(user != null){
			if(user.getStatus().equals(USER_STATUS_OFFLINE))
				return true;
		}
		return false;
	}
	
	/**
	 * 由server地址找到server id
	 * @param serverAddr
	 * * @throws IllegalArgumentException 如果由serverID找不到对应的serverAddr
	 * @return
	 */
	public Integer getServerAddr(String userID)  throws IllegalArgumentException {
		User user = findByPrimaryKey(userID);
		if(user == null)
			throw new IllegalArgumentException("can not find a server by serverAddr");
		return user.getServerAddr();	
	}
	
	public static void test(){
		UserDAO userDAO = new UserDAO();
//		System.out.println(userDAO.create("liu", "127.0.0.1").getStatus());

	}
	
	
	public boolean verify(String userID, String token) {
		// TODO Auto-generated method stub
		User user = findByPrimaryKey(userID);		
		if(user != null) {
			
			if(user.getToken() != null && user.getToken().equals(token)) {
				if (this.isUserUnauth(userID)) {
					user.setStatus(USER_STATUS_ONLINE);
				}
				return true;
			}
		}		
		return false;
	}

}
