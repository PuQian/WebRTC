package com.webrtc.dao;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 好友关系记录表
 */
@Entity
@Table(name = "easefriend")
public class EaseFriend implements Serializable{
	
	    private static final long serialVersionUID = 1L;
	    
	    @Id
	    @GeneratedValue(strategy = IDENTITY)
	    @Column(name = "id", unique = true, nullable = false)
	    private Integer id;
	    
	    @Column(name = "hostname", nullable = false)
	    private String hostname;
	    
	    @Column(name = "friendname", nullable = false)
	    private String friendname;
	    
	    public Integer getId() {
	        return id;
	    }

	    public void setId(Integer id) {
	        this.id = id;
	    }

	    public String getHostname() {
	        return hostname;
	    }

	    public void setHostname(String hostname) {
	        this.hostname = hostname;
	    }

	    public String getFriendname() {
	        return friendname;
	    }

	    public void setFriendname(String friendname) {
	        this.friendname = friendname;
	    }

}
