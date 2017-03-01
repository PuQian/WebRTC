package com.free4lab.account.manager;

import java.util.List;

import com.free4lab.account.model.UserPrivacy;
import com.free4lab.account.model.UserPrivacyDAO;

public class UserPrivacyManager{
	
	private static UserPrivacyDAO userPrivacyDAO = new UserPrivacyDAO();
	
	/**
	 * 根据用户id获取用户隐私
	 * @param userId
	 * @return
	 */
	public static List<UserPrivacy> getUserPrivacyByUserId(Integer userId){
		List<UserPrivacy> list = userPrivacyDAO.findByProperty("uid", userId);
		if(list.size() <= 0){
			return null;
		}
		//list = userPrivacyDAO.
		return list;
		
	}
	
	/**
	 * 根据用户id和隐私项名称获取用户隐私
	 * @param userId
	 * @param item
	 * @return
	 */
	public static List<UserPrivacy> getUserPrivacyItemByUserId(Integer userId,String item){
		List<UserPrivacy> list = userPrivacyDAO.findByProperty2("uid", userId, "item", item);
		if(list.size() <= 0){
			return null;
		}
		return list;
	}
	
	/**
	 * 新增用户隐私
	 * @param userId,item,itemId,privacy
	 * @return
	 */
	public static UserPrivacy addUserPrivacy(int userId, String item,int itemId,int privacy){
		UserPrivacy userPrivacy = new UserPrivacy();
		userPrivacy.setUid(userId);
		userPrivacy.setItem(item);
		userPrivacy.setItemId(itemId);
		userPrivacy.setPrivacy(privacy);
		try{
			userPrivacyDAO.save(userPrivacy);
			return userPrivacy;
		}catch(Exception ex) {
            System.err.println(ex.getMessage());
            ex.printStackTrace(System.err);
            return null;
		}
	}
	
	/**
	 * 修改用户隐私
	 * @param userId,item,itemId,privacy
	 * @return
	 */
	public static UserPrivacy editUserPrivacy(UserPrivacy userPrivacy){
		//userPrivacy.setPrivacy(privacy);
		try{
			userPrivacyDAO.update(userPrivacy);
			return userPrivacy;
		}catch(Exception ex) {
            System.err.println(ex.getMessage());
            ex.printStackTrace(System.err);
            return null;
		}
	}
	
	public static UserPrivacy getUserExPrivacyItemByUserId(Integer userId,String item,Integer item_id){
		List<UserPrivacy> list = userPrivacyDAO.findByProperty2("uid", userId, "item", item);
		UserPrivacy exlist = null;
		if(list.size() <= 0){
			return null;
		}else{
			for(int i=0;i<list.size();i++){
				if(list.get(i).getItemId()==item_id){
					exlist = list.get(i);
					break;
				}
			}
			return exlist;
		}
		
	}
	
	public static String deleteUserExprivacyItemByUserId(Integer userId,String item,Integer item_id){
		UserPrivacy record = getUserExPrivacyItemByUserId(userId,item,item_id);
		if(record != null){
			userPrivacyDAO.deleteByPrimaryKey(record.getId());
			return "success";
		}else{
			return "NOTEXIST";
		}
	}
	
}