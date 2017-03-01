package com.free4lab.account.model;

import java.io.Serializable;

import javax.persistence.*;


/**
 * The persistent class for the wcs_user database table.
 * 
 */
@Entity  
@Table(name="wcs_user")
public class WcsUser implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(unique=true, nullable=false)
	private int id;

	@Column(name="access_token", length=50)
	private String access_token;
	
	@Column(name="status", length=64, nullable= false)
	private String status;

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	@Column(name="begin_time")
	private long begin_time;

	@Column(length=50)
	private String code;

	@Column(length=50)
	private String extend;
	
	@Column(name="server_id", nullable=true)
	private int server_id;

	@Column(name="user_id", nullable=true)
	private String user_id;
	
	public String getUser_id() {
		return user_id;
	}

	public void setUser_id(String user_id) {
		this.user_id = user_id;
	}

	public int getServer_id() {
		return server_id;
	}

	public void setServer_id(int server_id) {
		this.server_id = server_id;
	}

	private int uid;

	private int valid;
	
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getAccess_token() {
		return access_token;
	}

	public void setAccess_token(String access_token) {
		this.access_token = access_token;
	}

	public long getBegin_time() {
		return begin_time;
	}

	public void setBegin_time(long begin_time) {
		this.begin_time = begin_time;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getExtend() {
		return extend;
	}

	public void setExtend(String extend) {
		this.extend = extend;
	}

	public int getUid() {
		return uid;
	}

	public void setUid(int uid) {
		this.uid = uid;
	}

	public int getValid() {
		return valid;
	}

	public void setValid(int valid) {
		this.valid = valid;
	}


	public WcsUser() {
    }

}