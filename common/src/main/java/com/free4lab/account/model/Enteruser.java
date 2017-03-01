package com.free4lab.account.model;


import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;
import java.sql.Time;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 企业--企业用户表
 */
@Entity
@Table(name="enter_user")
public class Enteruser implements Serializable{
	
	private static final long serialVersionUID = 1L;
	
	@Id @GeneratedValue(strategy=IDENTITY)
	@Column(name="id",unique=true,nullable=false)
	private Integer id;
	
	@Column(name="eid",nullable=false)
	private Integer eid;

	@Column(name="uid",nullable=false)
	private Integer uid;
	
	@Column(name="maxcalltime",nullable=false)
	private Integer maxcalltime;
	
	@Column(name="isadmin",nullable=false)
	private Integer isadmin;
	
	@Column(name="isarti",nullable=false)
	private Integer isarti;
	
	@Column(name="maxservingnum",nullable=true)
	private Integer maxservingnum;
	
	@Column(name="priority",nullable=true)
	private Integer priority;
	
	@Column(name="isbindtimer",nullable=false)
	private Integer isbindtimer;
	
	@Column(name = "login_time", nullable = true)
	private Time loginTime;
	
	@Column(name = "logout_time", nullable = true)
	private Time logoutTime;
	
	public Enteruser() {
		
	}

	public Enteruser(Integer eid, Integer uid, Integer maxcalltime, Integer isadmin, Integer isarti,
			Integer maxservingnum, Integer priority, Integer isbindtimer, Time loginTime, Time logoutTime) {
		super();
		this.eid = eid;
		this.uid = uid;
		this.maxcalltime = maxcalltime;
		this.isadmin = isadmin;
		this.isarti = isarti;
		this.maxservingnum = maxservingnum;
		this.priority = priority;
		this.isbindtimer = isbindtimer;
		this.loginTime = loginTime;
		this.logoutTime = logoutTime;
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

	public Integer getUid() {
		return uid;
	}

	public void setUid(Integer uid) {
		this.uid = uid;
	}

	public Integer getIsadmin() {
		return isadmin;
	}
	public void setIsadmin(Integer isadmin) {
		this.isadmin = isadmin;
	}
	
	public Integer getIsarti() {
		return isarti;
	}
	public void setIsarti(Integer isarti) {
		this.isarti = isarti;
	}
	public Integer getIsbindtimer() {
		return isbindtimer;
	}
	public void setIsbindtimer(Integer isbindtimer) {
		this.isbindtimer = isbindtimer;
	}

	public Time getLoginTime() {
		return loginTime;
	}

	public void setLoginTime(Time loginTime) {
		this.loginTime = loginTime;
	}

	public Time getLogoutTime() {
		return logoutTime;
	}

	public void setLogoutTime(Time logoutTime) {
		this.logoutTime = logoutTime;
	}

	public Integer getPriority() {
		return priority;
	}
	public void setPriority(Integer priority) {
		this.priority = priority;
	}
	public Integer getMaxservingnum() {
		return maxservingnum;
	}
	public void setMaxservingnum(Integer maxservingnum) {
		this.maxservingnum = maxservingnum;
	}
	public Integer getMaxcalltime() {
		return maxcalltime;
	}
	public void setMaxcalltime(Integer maxcalltime) {
		this.maxcalltime = maxcalltime;
	}
}
