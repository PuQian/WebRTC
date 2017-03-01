package com.free4lab.account.model;

import java.util.List;

public class UserComplete {
	
	private User user;
	private List<UserEmailEx> user_email_ex;
	private List<UserPhoneEx> user_phone_ex;
	private List<UserAllEx> user_all_ex;
	private List<UserPrivacy> user_privacy;
	
	
	public User getUser() {
		return user;
	}
	public void setUser(User user) {
		this.user = user;
	}
	public List<UserEmailEx> getUser_email_ex() {
		return user_email_ex;
	}
	public void setUser_email_ex(List<UserEmailEx> user_email_ex) {
		this.user_email_ex = user_email_ex;
	}
	public List<UserPhoneEx> getUser_phone_ex() {
		return user_phone_ex;
	}
	public void setUser_phone_ex(List<UserPhoneEx> user_phone_ex) {
		this.user_phone_ex = user_phone_ex;
	}
	public List<UserAllEx> getUser_all_ex() {
		return user_all_ex;
	}
	public void setUser_all_ex(List<UserAllEx> user_all_ex) {
		this.user_all_ex = user_all_ex;
	}
	public List<UserPrivacy> getUser_privacy() {
		return user_privacy;
	}
	public void setUser_privacy(List<UserPrivacy> user_privacy) {
		this.user_privacy = user_privacy;
	}

}
