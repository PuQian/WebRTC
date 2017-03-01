package com.free4lab.account.module;


import java.util.List;

import com.free4lab.account.common.Constants;
import com.free4lab.account.manager.AccessTokenManager;
import com.free4lab.account.manager.AccountManager;
import com.free4lab.account.manager.UserManager;
import com.free4lab.account.model.Account;
import com.free4lab.account.model.User;

public class UserinfoModule {
	
	
	/**
	 * 根据access_token获取用户的userId
	 * @param access_token
	 * @return userId
	 */
	public static int getUserIdByAccessToken(String access_token){
		int userId = -1;
		if(! access_token.equals("0")){
			userId = AccessTokenManager.getUserIdByAccessToken(access_token);
		}
		return userId;
	}
	
	public static int getUserIdByAccToken(String acc_token){
		int userId = -1;
		if(! acc_token.equals("0")){
			userId = AccessTokenManager.getUserIdByAccToken(acc_token);
		}
		return userId;
	}
	
	/**
	 * 根据用户的userId获取用户的User对象
	 * @param userId
	 * @return User
	 */
	public static User getUserByUserId(int userId){
		User user = UserManager.getUserByUserId(userId);
		return user;
	}
	
	/**
	 * 设置用户的默认信息，当real_name或者profile_image_url为空时设置默认值
	 * @param user
	 * @return
	 */
	public static User defaultUserInfo(User user){
		if(user != null){
			if(user.getProfile_image_url() == null || user.getProfile_image_url().equalsIgnoreCase("")){
				user.setProfile_image_url(Constants.DEFAULT_AVATAR);
			}
			String email = user.getEmail();
			if(user.getReal_name() == null || user.getReal_name().equalsIgnoreCase("")){
				if(email != null && email.indexOf("@") != -1){
					user.setReal_name(email.substring(0, email.indexOf("@")));
				}else{
					user.setReal_name(email);
				}
			}
			user = UserManager.editUser(user);
			if(user != null){
				return user;
			}else{
				return null;
			}
		}else{
			return null;
		}
		
	}
	
	/**
	 * 在获取单个user时为方便显示对数据进行简单处理，real_name、gender和头像，在GetUserInfoAction中使用
	 * @param user
	 * @return
	 */
	public static User getBasicUserInfo(User user){
		if(user != null){
			if( null == user.getReal_name() || user.getReal_name().length() < 1){
				user.setReal_name("");
				/*int l = user.getEmail().indexOf('@');
				if(user.getEmail() != null && user.getEmail().indexOf('@') == -1){
					user.setReal_name(user.getEmail());
				}else{
					user.setReal_name(user.getEmail().substring(0, l));
				}*/
			}
			if(user.getGender() != null &&  user.getGender().equals("f")){
				 
				user.setGender("女");
			}
			if(user.getGender() != null &&  user.getGender().equals("m")){
				user.setGender("男");
			}
			if( null == user.getProfile_image_url() || user.getProfile_image_url().length() < 1){
				user.setProfile_image_url(Constants.DEFAULT_AVATAR);
			}
			return user;
		}else{
			return null;
		}
	}
	
	/**
	 * 修改用户的userinfo，参数为null表示此项不修改
	 * @param user
	 * @param email
	 * @param profile_image_url
	 * @param real_name
	 * @param gender
	 * @param screen_name
	 * @param description
	 * @param phone
	 * @param qq
	 * @param company
	 * @param email_home
	 * @param email_work
	 * @param phone_home
	 * @param phone_work
	 * @return
	 */
	public static User setUserInfo(User user,String profile_image_url,String real_name,String gender,
			String screen_name,String description,String phone,String qq,String company,String email_home,String email_work,
			String phone_home,String phone_work){
		if(user != null){
			/*if(email != null){
				user.setEmail(email);
			}*/
			if(profile_image_url != null){
				user.setProfile_image_url(profile_image_url);
			}
			if(real_name != null){
				user.setReal_name(real_name);
			}
			if(gender != null){
				user.setGender(gender);
			}
			if(screen_name != null){
				user.setScreen_name(screen_name);
			}
			if(description != null){
				user.setDescription(description);
			}
			if(phone != null){
				user.setPhone(phone);
			}
			if(qq != null){
				user.setQq(qq);
			}
			
			if(company != null){
				user.setCompany(company);
			}
			if(email_home != null){
				user.setEmail_home(email_home);
			}
			if(email_work != null){
				user.setEmail_work(email_work);
			}
			if(phone_home != null){
				user.setPhone_home(phone_home);
			}
			if(phone_work != null){
				user.setPhone_work(phone_work);
			}
			user = UserManager.editUser(user);
			if(user != null){
				return user;
			}else{
				return null;
			}
		}else{
			return null;
		}
		
	}
	
	/**
	 * 根据用户的userId检查用户的User和Account信息是否完整，
	 * User中real_name和profile_image_url是否有为空，Account中的密码是否过于简单
	 * nopwd表示密码过于简单，no表示user信息不完整，yes表示以上都完整，fail表示根据userId获取的User或者Account为null
	 * @param userId
	 * @return
	 */
	public static String checkBasicUserinfo(int userId){
		User user = UserinfoModule.getUserByUserId(userId);
		Account account = AccountManager.getAccountByUid(userId);
		if(account != null && user != null){
			int	easycode = AccountManager.testCode(account.getEmail(), account.getPwd_salt());
			String realName = user.getReal_name();
			String profileImageUrl = user.getProfile_image_url();
			if(easycode == 1){
				return "nopwd";
			}else if(realName == null || realName.equals("") || profileImageUrl == null || profileImageUrl.equals("")){
				return "no";
			}else{
				return "yes";
			}
		}else{
			return "fail";
		}
	}

	/**
	 * 根据用户的userid的list获取多个user
	 * @param userIds
	 * @return
	 */
	public static List<User> getUsersByIds(List<Integer> userIds){
		return UserManager.getUserByUserId(userIds);
	}
	
	/**
	 * 将user的list中的一些基本信息进行显示的转换
	 * @param users
	 * @return
	 */
	public static List<User> getBasicUserInfos(List<User> users){
		if(users != null && users.size() >0){
			for(User user:users){
				if( null == user.getReal_name() || user.getReal_name().length() < 1){
					int l = user.getEmail().indexOf('@');
					if(user.getEmail() != null && user.getEmail().indexOf('@') == -1){
						user.setReal_name(user.getEmail());
					}else{
						user.setReal_name(user.getEmail().substring(0, l));
					}
				}
				if(user.getGender() != null &&  user.getGender().equals("f")){
					 
					user.setGender("女");
				}
				if(user.getGender() != null &&  user.getGender().equals("m")){
					user.setGender("男");
				}
				if( null == user.getProfile_image_url() || user.getProfile_image_url().length() < 1){
					user.setProfile_image_url(Constants.DEFAULT_AVATAR);
				}
			}
			
			return users;
		}else{
			return null;
		}
	}
	
	/**
	 * 查询user分页
	 * @param email
	 * @param realName
	 * @param company
	 * @param description
	 * @param page
	 * @param pageSize
	 * @return
	 */
	public static List<User> searchUsersByPage(String email, String realName, 
			String company,String description, int page, int pageSize){
		return UserManager.getUserByCompanyByPage(email, realName, company, description, page, pageSize) ;
	}
	
	/**
	 * 查询user的数目
	 * @param email
	 * @param realName
	 * @param company
	 * @param description
	 * @return
	 */
	public static int searchUsersTotal(String email, String realName, 
			String company,String description){
		List<User> users = UserManager.getUserByCompany(email, realName, company, description) ;
		if(users != null && users.size() >0){
			return users.size();
		}
		return 0;
	}
	
	/**
	 * 根据email获取userid
	 * @param email
	 * @return
	 */
	public static int getUserIdByEmail(String email){
		return AccountManager.getUserIdByEmail(email);
	}
	
	/**
	 * 根据userid获取email
	 * @param userId
	 * @return
	 */
	public static String getEmailByUserId(int userId){
		return AccountManager.getEmailByUserId(userId);
	}
}
