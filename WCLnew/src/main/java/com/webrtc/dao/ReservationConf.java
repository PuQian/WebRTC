package com.webrtc.dao;

import java.io.Serializable;
import java.sql.Timestamp;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.*;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name="reservation_conf")
public class ReservationConf implements Serializable{
	private static final long serialVersionUID = 1L;
	
	@Id
	@Column(name="id", unique=true, nullable=false)
	private int id;
	
	@Column(name="theme", nullable=true)
	private String theme;
	
	@Column(name="roomid", nullable=false)
	private String roomid;
	
	@Column(name="type", nullable=false)
	private int type;
	
	@Column(name="creator", nullable=false)
	private String creator;
	
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="reservation_time")
	private Date reservation_time;
	
	@Column(name="cycle", nullable=true)
	private int cycle;
	
	@Column(name="duration", nullable=true)
	private int duration;
	
	@Column(name="member_num", nullable=true)
	private int member_num;
	
	@Column(name="members", nullable=true)
	private String members;
	
	@Column(name="valid", nullable=false)
	private int valid;
	
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="endtime")
	private Date endtime;
	
	
	@Column(name="confname", nullable=false)
	private String confname;
	
	
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}
	
	public String getTheme() {
		return theme;
	}

	public void setTheme(String theme) {
		this.theme = theme;
	}
	
	public String getRoomid() {
		return roomid;
	}

	public void setRoomid(String roomid) {
		this.roomid = roomid;
	}
	
	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}
	
	public String getCreator() {
		return creator;
	}

	public void setCreator(String creator) {
		this.creator = creator;
	}
	
	public Date getReservation_time() {
		return reservation_time;
	}

	public void setReservation_time(Date reservation_time) {
		this.reservation_time = reservation_time;
	}
	
	public int getCycle() {
		return cycle;
	}

	public void setCycle(int cycle) {
		this.cycle = cycle;
	}
	
	public int getDuration() {
		return duration;
	}

	public void setDuration(int duration) {
		this.duration = duration;
	}
	
	public int getMember_num() {
		return member_num;
	}

	public void setMember_num(int member_num) {
		this.member_num = member_num;
	}
	
	public String getMembers() {
		return members;
	}

	public void setMembers(String members) {
		this.members = members;
	}
	
	public int getValid() {
		return valid;
	}

	public void setValid(int valid) {
		this.valid = valid;
	}
	
	public Date getEndTime() {
		return endtime;
	}

	public void setEndTime(Date endtime) {
		this.endtime = endtime;
	}
	
	public String getConfname() {
		return confname;
	}

	public void setConfname(String confname) {
		this.confname = confname;
	}
}
