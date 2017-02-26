package com.webrtc.dao;

import java.io.Serializable;

import javax.persistence.*;


import java.util.Date;


/**
 * The persistent class for the conf_member database table.
 * 
 */
@Entity
@Table(name="conf_member")
@IdClass(value = ConfMemberPK.class) 
public class ConfMember implements Serializable {
	private static final long serialVersionUID = 1L;

	//id 和  member 为联合主键
	//conf_member 表中 roomid 为 room 表中 roomid 主键的 外键
	
	@Id
	private String id;
	@Id
	private String member;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="join_at",nullable=true)
	private Date joinAt;
	
	@Column(name="conn_id",nullable=true)
	private String connid;
	
//	@ManyToOne   
//    @JoinColumn(name="roomid")
//	private Room room;
	
	
	public String getMember() {
		return member;
	}

	public void setMember(String member) {
		this.member = member;
	}

	public Date getJoinAt() {
		return joinAt;
	}

	public void setJoinAt(Date joinAt) {
		this.joinAt = joinAt;
	}

	public String getConnId() {
		return connid;
	}

	public void setConnId(String connid) {
		this.connid = connid;
	}


//	public Room getRoom() {
//		return room;
//	}
//
//	public void setRoom(Room room) {
//		this.room = room;
//	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

}
