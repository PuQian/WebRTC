package com.free4lab.account.manager;

import java.util.List;

import org.apache.log4j.Logger;

import com.free4lab.account.model.UserPhoneEx;
import com.free4lab.account.model.UserPhoneExDAO;

public class UserPhoneExManager {
	/**
	 * UserDAO的静态实例
	 */
	private static UserPhoneExDAO userPhoneExDAO = new UserPhoneExDAO();
	private static final Logger logger = Logger.getLogger(UserPhoneExManager.class);
	

	/**
	 * 根据用户id获取用户的扩展手机信息
	 * @param userId
	 * @return
	 */
	public static List<UserPhoneEx> getExphoneByUserId(int userId){
		List<UserPhoneEx> list = userPhoneExDAO.findByProperty("uid", userId);
		if(list.size() <= 0){
			return null;
		}
		return list;
	}
	
	public static UserPhoneEx getExphoneById(int Id){
		UserPhoneEx list = userPhoneExDAO.findById(Id);
		return list;
	}
	
	public static void  deleteExphoneById(int id){
		userPhoneExDAO.deleteByPrimaryKey(id);
	}
	
	/**
	 * 增加一条用户的扩展手机信息
	 * @param userId
	 * @return
	 */
	public static UserPhoneEx  addExphone(int userId,String phoneTitle,String phoneValue){
		UserPhoneEx userexphone = new UserPhoneEx();
		userexphone.setUid(userId);
		userexphone.setPhoneTitle(phoneTitle);
		userexphone.setPhoneValue(phoneValue);
    	try {
    		userPhoneExDAO.save(userexphone);
    		logger.info("保存exphone成功!!!");
            return userexphone;
        } catch (Exception ex) {
            System.err.println(ex.getMessage());
            ex.printStackTrace(System.err);
            return null;
        }
	}
	
    /**
     * 扩展信息是否存在
     * @param userId
     * @param phoneTitle
     * @return 
     */
    public static List<UserPhoneEx> isExisted(int userId,String phoneTitle) {
    	List<UserPhoneEx> list = userPhoneExDAO.findByProperty2("uid", userId, "phoneTitle", phoneTitle);
    	if(list.size() <= 0){
			return null;
		}
    	return list;

    }
	
	/**
	 * 根据用户id和title修改用户的扩展手机信息
	 * @param userId
	 * @return
	 */
	public static UserPhoneEx editExphone(int id,String phoneTitle,String phoneValue){
		UserPhoneEx list = userPhoneExDAO.findById(id);
		if(list == null){
			return null;
		}else{
			list.setPhoneTitle(phoneTitle);
			list.setPhoneValue(phoneValue);
        	try{
        		userPhoneExDAO.update(list);
        		logger.info("修改exphone成功!!!--");
        		return list;
        	}catch(Exception ex){
        		System.err.println(ex.getMessage());
                ex.printStackTrace(System.err);
                return null;
        	}
		}
		
	}
}