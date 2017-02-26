package com.free4lab.account.api.action.friendships;

public class OneGroup {
	
	private Integer id;
	private String name;
	private boolean isRoot;
	
	public OneGroup(){}
	
	public OneGroup(Integer id, String name, boolean isRoot){
		this.id = id;
		this.name = name;
		this.isRoot = isRoot;
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

	public boolean getIsRoot() {
		return isRoot;
	}

	public void setIsRoot(boolean isRoot) {
		this.isRoot = isRoot;
	}

}
