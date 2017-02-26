package com.free4lab.account.api.action.friendships;

import java.util.ArrayList;
import java.util.List;

import com.free4lab.account.model.User;

public class GroupFriends {

	//private static final Logger logger = Logger.getLogger(GroupFriends.class);
	private Integer id;
	private String name;
	private Boolean is_root;
	private List<User> users=new ArrayList<User>();
	
	public GroupFriends(){
	}
	
	public GroupFriends(Integer id,String name, Boolean is_root,List<User> users){
		this.id = id;
		this.name = name;
		this.is_root = is_root;
		this.users = users;
	}
	
	public Integer getId() {
		return id;
	}
	
	public void setId(Integer id) {
		this.id = id;
	}
	
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public Boolean getIs_root() {
		return is_root;
	}
	
	public void setIs_root(Boolean is_root) {
		this.is_root = is_root;
	}
	
	public List<User> getUsers() {
		return users;
	}
	
	public void setUsers(List<User> users) {
		this.users = users;
	}
}
