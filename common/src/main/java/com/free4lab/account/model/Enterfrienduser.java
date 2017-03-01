package com.free4lab.account.model;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 企业--企业好友表
 */
@Entity
@Table(name="enter_frienduser")
public class Enterfrienduser implements Serializable{
	
	private static final long serialVersionUID = 1L;
	
	@Id @GeneratedValue(strategy=IDENTITY)
	@Column(name="id",unique=true,nullable=false)
	private Integer id;

	@Column(name="eid",nullable=false)
	private Integer eid;
	
	@Column(name="fid",nullable=false)
	private Integer fid;
	
    public Enterfrienduser() {
    }
    
	public Enterfrienduser(Integer eid, Integer fid) {

		this.eid = eid;
		this.fid = fid;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getEid() {
		return eid;
	}

	public void setEid(Integer eid) {
		this.eid = eid;
	}

	public Integer getFid() {
		return fid;
	}

	public void setFid(Integer fid) {
		this.fid = fid;
	}

}

