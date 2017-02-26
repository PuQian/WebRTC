package com.webrtc.dao;

import java.io.Serializable;

import javax.persistence.*;

@Entity
@Table(name = "wcs_user")
public class User implements Serializable {

	private static final long serialVersionUID = 1L;
	@Id
	@Column(name = "user_id", nullable = false)
	private String userID;
	@Column(name = "server_id", nullable = false)
	private Integer serverID;
	@Column(name = "status", nullable = false)
	private String status;
	@Column(name = "access_token", nullable = true)
	private String token;
	
	public User(){
	}
	
	
	public User(String userID, Integer serverAddr, String status, String token) {
		this.userID = userID;
		this.serverID = serverAddr;
		this.status = status;
		this.token = token;
	}


	public String getUserID() {
		return userID;
	}
	public void setUserID(String userID) {
		this.userID = userID;
	}
	public Integer getServerAddr() {
		return serverID;
	}
	public void setServerAddr(Integer serverID) {
		this.serverID = serverID;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}

	public String getToken() {
		return token;
	}
	
	public void setToken(String token) {
		this.token = token;
	}
	

}
