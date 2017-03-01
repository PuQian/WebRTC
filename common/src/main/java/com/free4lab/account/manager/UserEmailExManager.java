package com.free4lab.account.manager;

import java.util.List;

import org.apache.log4j.Logger;
import com.free4lab.account.model.UserEmailEx;
import com.free4lab.account.model.UserEmailExDAO;

public class UserEmailExManager {
	/**
	 * UserDAO的静态实例
	 */
	private static UserEmailExDAO userEmailExDAO = new UserEmailExDAO();
	private static final Logger logger = Logger.getLogger(UserEmailExManager.class);
	
	public static UserEmailEx getExemailById(int Id){
		UserEmailEx list = userEmailExDAO.findById(Id);
		return list;
	}
	
	public static void  deleteExemailById(int id){
		userEmailExDAO.deleteByPrimaryKey(id);
	}
	/**
	 * 根据用户id获取用户的扩展邮箱信息
	 * @param userId
	 * @return
	 */
	public static List<UserEmailEx> getExemailByUserId(int userId){
		List<UserEmailEx> list = userEmailExDAO.findByProperty("uid", userId);
		if(list.size() <= 0){
			return null;
		}
		return list;
	}
	
	/**
	 * 增加一条用户的扩展邮箱信息
	 * @param userId
	 * @return
	 */
	public static UserEmailEx  addExemail(int userId,String emailTitle,String emailValue){
		UserEmailEx userexemail = new UserEmailEx();
		userexemail.setUid(userId);
		userexemail.setEmail_title(emailTitle);
		userexemail.setEmail_addr(emailValue);
    	try {
    		userEmailExDAO.save(userexemail);
    		logger.info("保存exemail成功!!!");
            return userexemail;
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
    public static List<UserEmailEx> isExisted(int userId,String emailTitle) {
    	List<UserEmailEx> list = userEmailExDAO.findByProperty2("uid", userId, "email_title", emailTitle);
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
	public static UserEmailEx editExemail(int id,String emailTitle,String emailValue){
		UserEmailEx list = userEmailExDAO.findById(id);
		if(list == null){
			return null;
		}else{
			list.setEmail_title(emailTitle);
			list.setEmail_addr(emailValue);
        	try{
        		userEmailExDAO.update(list);
        		logger.info("修改exmail成功!!!--");
        		return list;
        	}catch(Exception ex){
        		System.err.println(ex.getMessage());
                ex.printStackTrace(System.err);
                return null;
        	}
		}
		
	}
}