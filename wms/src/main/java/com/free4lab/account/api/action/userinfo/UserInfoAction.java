package com.free4lab.account.api.action.userinfo;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.apache.log4j.Logger;
import org.perf4j.aop.Profiled;

import com.free4lab.account.common.Constants;
import com.free4lab.account.manager.UserManager;
import com.free4lab.account.manager.UserPrivacyManager;
import com.free4lab.account.model.User;
import com.free4lab.account.model.UserPrivacy;
import com.free4lab.account.model.UserPrivacyItem;
import com.free4lab.account.model.UserComplete;
import com.free4lab.utils.action.BaseAction;
import com.opensymphony.xwork2.ActionContext;

public class UserInfoAction extends BaseAction {

	/**
	 * 获取当前用户的用户信息
	 * 返回用户信息页面
	 */
	private static final long serialVersionUID = 1L;
	private static final Logger logger = Logger.getLogger(UserInfoAction.class);
	private static UserComplete userCompleteInfo;
	private User user;
	private String email = "";
	private String screenName = "";
	private String description = "";
	private String microblog;	
	private String blog;
	private UserPrivacyItem phone;
	private UserPrivacyItem qq;
	/*private UserPrivacyItem msn;*/
	private UserPrivacyItem realName;
	private UserPrivacyItem sex;
	private List<UserPrivacyItem> userPhonePrivacyItem = new ArrayList<UserPrivacyItem>();
	private List<UserPrivacyItem> userExPhonePrivacyItem = new ArrayList<UserPrivacyItem>();
	private List<UserPrivacyItem> userQqMsn = new ArrayList<UserPrivacyItem>();
	private List<UserPrivacyItem> userEmailPrivacyItem = new ArrayList<UserPrivacyItem>();
	private List<UserPrivacyItem> userExEmailPrivacyItem = new ArrayList<UserPrivacyItem>();
	private String privacy = "";
	
	@Profiled(tag="UserInfoAction.execute")
	public String execute(){
		return SUCCESS;
	}
	
	public String getBasicInfo(){
		Map<String, Object> session = ActionContext.getContext().getSession();
		Integer uid = (Integer) session.get(Constants.KEY_USER_ID);
		userCompleteInfo = UserManager.getUserInfoCompeleteByUid(uid);
		logger.info(userCompleteInfo);
		if(userCompleteInfo != null){
			user = userCompleteInfo.getUser();
			//screenName = user.getScreen_name();
			//description = user.getDescription();
			return SUCCESS;
		}else{
			return ERROR;
		}
	}
	
	/*public String editBasicInfo(){
		Map<String, Object> session = ActionContext.getContext().getSession();
		Integer uid = (Integer) session.get(Constants.KEY_USER_ID);
		userCompleteInfo = UserManager.getUserInfoCompeleteByUid(uid);
		logger.info(userCompleteInfo);
		if(userCompleteInfo != null){
			user = userCompleteInfo.getUser();
			return SUCCESS;
		}else{
			return ERROR;
		}
	}*/
	
	/*public String getPersonalInfo(){
		Map<String, Object> session = ActionContext.getContext().getSession();
		Integer uid = (Integer) session.get(Constants.KEY_USER_ID);
		userCompleteInfo = UserManager.getUserInfoCompeleteByUid(uid);
		if(userCompleteInfo != null){
			User user = userCompleteInfo.getUser();
			realName = user.getReal_name();
			sex = user.getGender();
			microblog = user.getMicroblog();
			blog = user.getBlog();
			List<UserPrivacy> userprivacy = UserPrivacyManager.getUserPrivacyItemByUserId(uid, "personalprivacy");
			if(userprivacy != null){
				setPrivacy(Integer.toString(userprivacy.get(0).getPrivacy()));
			}else{
				setPrivacy("0");
			}	
			logger.info("realName:"+realName+";sex:"+sex+";privacy:"+privacy);
			return SUCCESS;
		}else{
			return ERROR;
		}
	}*/
	
	public String getPersonalInfo(){
		Map<String, Object> session = ActionContext.getContext().getSession();
		Integer uid = (Integer) session.get(Constants.KEY_USER_ID);
		userCompleteInfo = UserManager.getUserInfoCompeleteByUid(uid);
		logger.info(userCompleteInfo);
		if(userCompleteInfo != null){
			HashMap<Integer,String> privacyMap = new HashMap<Integer, String>();
			privacyMap.put(0, "未设置隐私权限");
			privacyMap.put(1, "仅好友可见");
			privacyMap.put(2, "仅自己可见");
			privacyMap.put(3, "全部人可见");
			List<UserPrivacy> userprivacy = UserPrivacyManager.getUserPrivacyItemByUserId(uid, "realName");
			Integer privacy = 0;
			if(userprivacy != null){
				logger.info(userprivacy.size());
			}
			logger.info(userprivacy);
			if(userprivacy != null && userprivacy.size() >0){
				privacy = userprivacy.get(0).getPrivacy();
				
			}else{
				privacy = 0;
			}
			realName = new UserPrivacyItem("realName","真实姓名",userCompleteInfo.getUser().getReal_name(),privacy,privacyMap.get(privacy));
			
			userprivacy = UserPrivacyManager.getUserPrivacyItemByUserId(uid, "gender");
			if(userprivacy != null && userprivacy.size() >0){
				privacy = userprivacy.get(0).getPrivacy();
				
			}else{
				privacy = 0;
			}
			String gender = null;
			if(userCompleteInfo.getUser() !=null && userCompleteInfo.getUser().getGender()!=null && userCompleteInfo.getUser().getGender().equalsIgnoreCase("f")){
				gender="女";
			}else if(userCompleteInfo.getUser() !=null && userCompleteInfo.getUser().getGender()!=null && userCompleteInfo.getUser().getGender().equalsIgnoreCase("m")){
				gender="男";
			}else{
				gender="";
			}
			sex = new UserPrivacyItem("gender","性别",gender,privacy,privacyMap.get(privacy));
			
			email = userCompleteInfo.getUser().getEmail();
			
			userprivacy = UserPrivacyManager.getUserPrivacyItemByUserId(uid, "phone");
			if(userprivacy != null && userprivacy.size() >0){
				privacy = userprivacy.get(0).getPrivacy();
				
			}else{
				privacy = 0;
			}
			phone=new UserPrivacyItem("phone","手机",userCompleteInfo.getUser().getPhone(),privacy,privacyMap.get(privacy));
			
			userPhonePrivacyItem.clear();
			if(userCompleteInfo.getUser().getPhone_home()!=null && ! userCompleteInfo.getUser().getPhone_home().equals("")){
				userprivacy = UserPrivacyManager.getUserPrivacyItemByUserId(uid, "phone_home");
				if(userprivacy != null && userprivacy.size() >0){
					privacy = userprivacy.get(0).getPrivacy();
				}else{
					privacy = 0;
				}
				userPhonePrivacyItem.add(new UserPrivacyItem("phone_home","手机（家庭）",userCompleteInfo.getUser().getPhone_home(),privacy,privacyMap.get(privacy)));
			}
			if(userCompleteInfo.getUser().getPhone_work()!=null && ! userCompleteInfo.getUser().getPhone_work().equals("")){
				userprivacy=UserPrivacyManager.getUserPrivacyItemByUserId(uid, "phone_work");
				if(userprivacy!=null){	
					privacy=userprivacy.get(0).getPrivacy();
				}else{
					privacy = 0;
				}
				userPhonePrivacyItem.add(new UserPrivacyItem("phone_work","手机（工作）",userCompleteInfo.getUser().getPhone_work(),privacy,privacyMap.get(privacy)));
			}
			
			userExPhonePrivacyItem.clear();
			if(userCompleteInfo.getUser_phone_ex()!=null){ 
				for(int i=0;i<userCompleteInfo.getUser_phone_ex().size();i++){
					UserPrivacy userPrivacy = UserPrivacyManager.getUserExPrivacyItemByUserId(uid, "phone_extend", userCompleteInfo.getUser_phone_ex().get(i).getId());
					if(userPrivacy != null){
						privacy=userPrivacy.getPrivacy();
					}else{
						privacy = 0;
					}
					userExPhonePrivacyItem.add(new UserPrivacyItem("exphone"+userCompleteInfo.getUser_phone_ex().get(i).getId(),userCompleteInfo.getUser_phone_ex().get(i).getPhoneTitle(),userCompleteInfo.getUser_phone_ex().get(i).getPhoneValue(),privacy,privacyMap.get(privacy)));
				}
			}
			
			userEmailPrivacyItem.clear();
			if(userCompleteInfo.getUser().getEmail_home()!=null && ! userCompleteInfo.getUser().getEmail_home().equals("")){
				userprivacy=UserPrivacyManager.getUserPrivacyItemByUserId(uid, "email_home");
				if(userprivacy!=null){	
					privacy=userprivacy.get(0).getPrivacy();
				}else{
					privacy = 0;
				}
				userEmailPrivacyItem.add(new UserPrivacyItem("email_home","邮箱（家庭）",userCompleteInfo.getUser().getEmail_home(),privacy,privacyMap.get(privacy)));
			}
			if(userCompleteInfo.getUser().getEmail_work()!=null && ! userCompleteInfo.getUser().getEmail_work().equals("")){
				userprivacy=UserPrivacyManager.getUserPrivacyItemByUserId(uid, "email_work");
				if(userprivacy!=null){	
					privacy=userprivacy.get(0).getPrivacy();
				}else{
					privacy = 0;
				}
				userEmailPrivacyItem.add(new UserPrivacyItem("email_work","邮箱（工作）",userCompleteInfo.getUser().getEmail_home(),privacy,privacyMap.get(privacy)));
			}
			
			userExEmailPrivacyItem.clear();
			if(userCompleteInfo.getUser_email_ex()!=null){ 
				for(int i=0;i<userCompleteInfo.getUser_email_ex().size();i++){
					UserPrivacy userPrivacy = UserPrivacyManager.getUserExPrivacyItemByUserId(uid, "email_extend", userCompleteInfo.getUser_email_ex().get(i).getId());
					if(userPrivacy != null){
						privacy=userPrivacy.getPrivacy();
					}else{
						privacy = 0;
					}
					userExEmailPrivacyItem.add(new UserPrivacyItem("exemail"+userCompleteInfo.getUser_email_ex().get(i).getId(),userCompleteInfo.getUser_email_ex().get(i).getEmail_title(),userCompleteInfo.getUser_email_ex().get(i).getEmail_addr(),privacy,privacyMap.get(privacy)));
				}
			}
			
			if(userCompleteInfo.getUser().getQq()!=null && ! userCompleteInfo.getUser().getQq().equals("")){
				userprivacy=UserPrivacyManager.getUserPrivacyItemByUserId(uid, "qq");
				if(userprivacy!=null){	
					privacy=userprivacy.get(0).getPrivacy();
				}else{
					privacy = 0;
				}
				qq=new UserPrivacyItem("qq","QQ",userCompleteInfo.getUser().getQq(),privacy,privacyMap.get(privacy));
			}
			/*if(userCompleteInfo.getUser().getMsn()!=null && ! userCompleteInfo.getUser().getMsn().equals("")){
				userprivacy=UserPrivacyManager.getUserPrivacyItemByUserId(uid, "msn");
				if(userprivacy!=null){	
					privacy=userprivacy.get(0).getPrivacy();
				}else{
					privacy = 0;
				}
				msn=new UserPrivacyItem("msn","MSN",userCompleteInfo.getUser().getMsn(),privacy,privacyMap.get(privacy));
			}*/
			return SUCCESS;
						
		}else{
			return ERROR;
		}
		
	}
	
/*	public String getContactInfo(){
		Map<String, Object> session = ActionContext.getContext().getSession();
		Integer uid = (Integer) session.get(Constants.KEY_USER_ID);
		userCompleteInfo = UserManager.getUserInfoCompeleteByUid(uid);
		userPhonePrivacyItem.clear();
		userPhonePrivacyItem.clear();
		userExPhonePrivacyItem.clear();
		userExPhonePrivacyItem.clear();
		userQqMsn.clear();
		userQqMsn.clear();
		userEmailPrivacyItem.clear();
		userEmailPrivacyItem.clear();
		userExEmailPrivacyItem.clear();
		userExEmailPrivacyItem.clear();
		if(userCompleteInfo != null){
			email=userCompleteInfo.getUser().getEmail();
			List<UserPrivacy> userprivacy=UserPrivacyManager.getUserPrivacyItemByUserId(uid, "phone");;
			int itemPrivacy=0;
			if(userprivacy!=null){	
				itemPrivacy=userprivacy.get(0).getPrivacy();
			}else{
				itemPrivacy=0;
			}
			logger.info(itemPrivacy);
			phone=new UserPrivacyItem("phone","手机",userCompleteInfo.getUser().getPhone(),itemPrivacy);
			userprivacy=UserPrivacyManager.getUserPrivacyItemByUserId(uid, "realName");;
			if(userprivacy!=null){	
				itemPrivacy=userprivacy.get(0).getPrivacy();
			}else{
				itemPrivacy=0;
			}
			realName=new UserPrivacyItem("realName","真实姓名",userCompleteInfo.getUser().getReal_name(),itemPrivacy);
			userprivacy=UserPrivacyManager.getUserPrivacyItemByUserId(uid, "gender");;
			if(userprivacy!=null){	
				itemPrivacy=userprivacy.get(0).getPrivacy();
			}else{
				itemPrivacy=0;
			}
			sex=new UserPrivacyItem("gender","性别",userCompleteInfo.getUser().getGender(),itemPrivacy);
			if(userCompleteInfo.getUser().getPhone_home()!=null && ! userCompleteInfo.getUser().getPhone_home().equals("")){
				userprivacy=UserPrivacyManager.getUserPrivacyItemByUserId(uid, "phone_home");
				if(userprivacy!=null){	
					itemPrivacy=userprivacy.get(0).getPrivacy();
				}else{
					itemPrivacy=0;
				}
				userPhonePrivacyItem.add(new UserPrivacyItem("phone_home","手机（家庭）",userCompleteInfo.getUser().getPhone_home(),itemPrivacy));
			}
			if(userCompleteInfo.getUser().getPhone_work()!=null && ! userCompleteInfo.getUser().getPhone_work().equals("")){
				userprivacy=UserPrivacyManager.getUserPrivacyItemByUserId(uid, "phone_work");
				if(userprivacy!=null){	
					itemPrivacy=userprivacy.get(0).getPrivacy();
				}else{
					itemPrivacy=0;
				}
				userPhonePrivacyItem.add(new UserPrivacyItem("phone_work","手机（工作）",userCompleteInfo.getUser().getPhone_work(),itemPrivacy));
			}
			if(userCompleteInfo.getUser_phone_ex()!=null){ 
				for(int i=0;i<userCompleteInfo.getUser_phone_ex().size();i++){
					UserPrivacy userPrivacy = UserPrivacyManager.getUserExPrivacyItemByUserId(uid, "phone_extend", userCompleteInfo.getUser_phone_ex().get(i).getId());
					if(userPrivacy != null){
						itemPrivacy=userPrivacy.getPrivacy();
					}else{
						itemPrivacy=0;
					}
					userExPhonePrivacyItem.add(new UserPrivacyItem("exphone"+userCompleteInfo.getUser_phone_ex().get(i).getId(),userCompleteInfo.getUser_phone_ex().get(i).getPhoneTitle(),userCompleteInfo.getUser_phone_ex().get(i).getPhoneValue(),itemPrivacy));
				}
			}
			if(userCompleteInfo.getUser().getQq()!=null && ! userCompleteInfo.getUser().getQq().equals("")){
				userprivacy=UserPrivacyManager.getUserPrivacyItemByUserId(uid, "qq");
				if(userprivacy!=null){	
					itemPrivacy=userprivacy.get(0).getPrivacy();
				}else{
					itemPrivacy=0;
				}
				qq=new UserPrivacyItem("qq","QQ",userCompleteInfo.getUser().getQq(),itemPrivacy);
			}
			if(userCompleteInfo.getUser().getMsn()!=null && ! userCompleteInfo.getUser().getMsn().equals("")){
				userprivacy=UserPrivacyManager.getUserPrivacyItemByUserId(uid, "msn");
				if(userprivacy!=null){	
					itemPrivacy=userprivacy.get(0).getPrivacy();
				}else{
					itemPrivacy=0;
				}
				msn=new UserPrivacyItem("msn","MSN",userCompleteInfo.getUser().getMsn(),itemPrivacy);
			}
			if(userCompleteInfo.getUser().getEmail_home()!=null && ! userCompleteInfo.getUser().getEmail_home().equals("")){
				userprivacy=UserPrivacyManager.getUserPrivacyItemByUserId(uid, "email_home");
				if(userprivacy!=null){	
					itemPrivacy=userprivacy.get(0).getPrivacy();
				}else{
					itemPrivacy=0;
				}
				userEmailPrivacyItem.add(new UserPrivacyItem("email_home","邮箱（家庭）",userCompleteInfo.getUser().getEmail_home(),itemPrivacy));
			}
			if(userCompleteInfo.getUser().getEmail_work()!=null && ! userCompleteInfo.getUser().getEmail_work().equals("")){
				userprivacy=UserPrivacyManager.getUserPrivacyItemByUserId(uid, "email_work");
				if(userprivacy!=null){	
					itemPrivacy=userprivacy.get(0).getPrivacy();
				}else{
					itemPrivacy=0;
				}
				userEmailPrivacyItem.add(new UserPrivacyItem("email_work","邮箱（工作）",userCompleteInfo.getUser().getEmail_work(),itemPrivacy));
			}
			if(userCompleteInfo.getUser_email_ex()!=null){ 
				for(int i=0;i<userCompleteInfo.getUser_email_ex().size();i++){
					UserPrivacy userPrivacy = UserPrivacyManager.getUserExPrivacyItemByUserId(uid, "email_extend", userCompleteInfo.getUser_email_ex().get(i).getId());
					if(userPrivacy != null){
						itemPrivacy=userPrivacy.getPrivacy();
					}else{
						itemPrivacy=0;
					}
					userExEmailPrivacyItem.add(new UserPrivacyItem("exemail"+userCompleteInfo.getUser_email_ex().get(i).getId(),userCompleteInfo.getUser_email_ex().get(i).getEmail_title(),userCompleteInfo.getUser_email_ex().get(i).getEmail_addr(),itemPrivacy));
				}
			}
			
			return SUCCESS;
		}
		return ERROR;
	}*/
	
	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getScreenName() {
		return screenName;
	}

	public void setScreenName(String screenName) {
		this.screenName = screenName;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public UserPrivacyItem getRealName() {
		return realName;
	}

	public void setRealName(UserPrivacyItem realName) {
		this.realName = realName;
	}

	public UserPrivacyItem getSex() {
		return sex;
	}

	public void setSex(UserPrivacyItem sex) {
		this.sex = sex;
	}

	public String getMicroblog() {
		return microblog;
	}

	public void setMicroblog(String microblog) {
		this.microblog = microblog;
	}

	public String getBlog() {
		return blog;
	}

	public void setBlog(String blog) {
		this.blog = blog;
	}

	public String getPrivacy() {
		return privacy;
	}

	public void setPrivacy(String privacy) {
		this.privacy = privacy;
	}

	public List<UserPrivacyItem> getUserPhonePrivacyItem() {
		return userPhonePrivacyItem;
	}

	public void setUserPhonePrivacyItem(List<UserPrivacyItem> userPhonePrivacyItem) {
		this.userPhonePrivacyItem = userPhonePrivacyItem;
	}

	public List<UserPrivacyItem> getUserEmailPrivacyItem() {
		return userEmailPrivacyItem;
	}

	public void setUserEmailPrivacyItem(List<UserPrivacyItem> userEmailPrivacyItem) {
		this.userEmailPrivacyItem = userEmailPrivacyItem;
	}

	public List<UserPrivacyItem> getUserQqMsn() {
		return userQqMsn;
	}

	public void setUserQqMsn(List<UserPrivacyItem> userQqMsn) {
		this.userQqMsn = userQqMsn;
	}

	public UserPrivacyItem getPhone() {
		return phone;
	}

	public void setPhone(UserPrivacyItem phone) {
		this.phone = phone;
	}

	public List<UserPrivacyItem> getUserExPhonePrivacyItem() {
		return userExPhonePrivacyItem;
	}

	public void setUserExPhonePrivacyItem(List<UserPrivacyItem> userExPhonePrivacyItem) {
		this.userExPhonePrivacyItem = userExPhonePrivacyItem;
	}

	public List<UserPrivacyItem> getUserExEmailPrivacyItem() {
		return userExEmailPrivacyItem;
	}

	public void setUserExEmailPrivacyItem(
			List<UserPrivacyItem> userExEmailPrivacyItem) {
		this.userExEmailPrivacyItem = userExEmailPrivacyItem;
	}

	public UserPrivacyItem getQq() {
		return qq;
	}

	public void setQq(UserPrivacyItem qq) {
		this.qq = qq;
	}

/*	public UserPrivacyItem getMsn() {
		return msn;
	}

	public void setMsn(UserPrivacyItem msn) {
		this.msn = msn;
	}
*/
	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}
	
}
