package com.free4lab.webrtc.model.contact;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the usergroup database table.
 * 
 */
@Entity
@Table(name = "usergroup")
public class Usergroup implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private int id;

	private int groupId;

	private String isRoot;

	private int userId;

    public Usergroup() {
    }
    
    public Usergroup(Integer userId, Integer groupId, String isRoot){
    	this.userId = userId;
    	this.groupId = groupId;
    	this.isRoot = isRoot;
    }

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getGroupId() {
		return this.groupId;
	}

	public void setGroupId(int groupId) {
		this.groupId = groupId;
	}

	public String getIsRoot() {
		return this.isRoot;
	}

	public void setIsRoot(String isRoot) {
		this.isRoot = isRoot;
	}

	public int getUserId() {
		return this.userId;
	}

	public void setUserId(int userId) {
		this.userId = userId;
	}

}