package com.free4lab.account.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;


/**
 * Contact entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name="groups")

public class Group implements java.io.Serializable {
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	/**
	 * 
	 */
	@Id @GeneratedValue(strategy=IDENTITY)
	@Column(name="id",unique=true,nullable=false)
	private Integer id;
	@Column(name="user_id",nullable=false)
	private Integer userId;
	@Column(name="group_name",nullable=false)
	private String groupName;
	
    // Constructors

    /** default constructor */
    public Group() {
    }
    /** full constructor */
    public Group(int userid, String groupname){
    	this.userId = userid;
    	this.groupName = groupname;
    }
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	
	public String getGroupName() {
		return groupName;
	}
	public void setGroupName(String groupName) {
		this.groupName = groupName;
	}
	public Integer getUserId() {
		return userId;
	}
	public void setUserId(Integer userId) {
		this.userId = userId;
	}

    
}