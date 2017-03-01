package com.free4lab.account.model;

public class UserPrivacyItem {
	private String id;
	private String title;
	private String value;
	private int privacy;
	private String privacyContent;
	
	public UserPrivacyItem(){}
	public UserPrivacyItem(String id,String title,String value,int privacy){
		this.id = id;
		this.title=title;
		this.value=value;
		this.privacy=privacy;
	}
	public UserPrivacyItem(String id,String title,String value,int privacy,String privacyContent){
		this.id = id;
		this.title=title;
		this.value=value;
		this.privacy=privacy;
		this.privacyContent = privacyContent;
	}

	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getValue() {
		return value;
	}
	public void setValue(String value) {
		this.value = value;
	}
	public int getPrivacy() {
		return privacy;
	}
	public void setPrivacy(int privacy) {
		this.privacy = privacy;
	}
	public String getPrivacyContent() {
		return privacyContent;
	}
	public void setPrivacyContent(String privacyContent) {
		this.privacyContent = privacyContent;
	}
	
	

	
	
}