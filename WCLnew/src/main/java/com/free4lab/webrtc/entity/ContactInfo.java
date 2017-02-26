package com.free4lab.webrtc.entity;

import java.util.ArrayList;
import java.util.List;

import com.free4lab.webrtc.model.contact.Friend;

public class ContactInfo {
	//联系人信息，个人信息和所属分组
	private List<Friend> myFriend = new ArrayList<Friend>();
	private String groupName;
	
	public ContactInfo()
	 {
		
	 }
	 public ContactInfo(String groupName,List<Friend> friend)
	 {
		this.groupName=groupName;
		this.myFriend =friend;
	 }
	
	 public void setGroupName(String groupName)
	 {
	 this.groupName=groupName;
	 }
	
	 public String getGroupName()
	 {
	 return this.groupName;
	 }
	 
	 public void setMyFriend(List<Friend> friend)
	 {
	 this.myFriend =friend;
	 }
	 
	 public List<Friend> getMyFriend()
	 {
	 return this.myFriend;
	 }
	 
}
