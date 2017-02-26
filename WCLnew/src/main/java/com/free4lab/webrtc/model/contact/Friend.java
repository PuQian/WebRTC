package com.free4lab.webrtc.model.contact;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the friend database table.
 * 
 */
@Entity
@Table(name = "friend")
public class Friend implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Column(unique=true, nullable=false)
	private int friendId;
	
	
	private String email;
	
	@Column(nullable=false)
	private String nickname;

	
	private String phone;

	
	private String qq;

	
	private String webrtc;

    public Friend() {
    }

  //有参构造函数 
    public Friend(String nickname,String email,String qq,String webrtc,String phone)
    {
    	//this.friendId =friendId;
    	this.nickname=nickname;
    	this.email =email;
    	this.qq=qq;
    	this.webrtc=webrtc;
    	this.phone=phone;
    }
    
	public int getFriendId() {
		return this.friendId;
	}

	public void setFriendId(int friendId) {
		this.friendId = friendId;
	}

	public String getEmail() {
		return this.email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getNickname() {
		return this.nickname;
	}

	public void setNickname(String nickname) {
		this.nickname = nickname;
	}

	public String getPhone() {
		return this.phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getQq() {
		return this.qq;
	}

	public void setQq(String qq) {
		this.qq = qq;
	}

	public String getWebrtc() {
		return this.webrtc;
	}

	public void setWebrtc(String webrtc) {
		this.webrtc = webrtc;
	}

}