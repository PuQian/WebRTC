package com.free4lab.account.model;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the group_friend database table.
 * 
 */
@Entity
@Table(name="group_friend")
public class GroupFriend implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(unique=true, nullable=false)
	private int id;

	@Column(length=50)
	private String extend;

	private int follow;

	@Column(name="friend_id")
	private int friend_id;

	@Column(name="group_id")
	private int group_id;

    public GroupFriend() {
    }
    
	public GroupFriend(int group_id, int friend_id, int follow) {
		this.follow = follow;
		this.friend_id = friend_id;
		this.group_id = group_id;
	}



	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getExtend() {
		return extend;
	}

	public void setExtend(String extend) {
		this.extend = extend;
	}

	public int getFollow() {
		return follow;
	}

	public void setFollow(int follow) {
		this.follow = follow;
	}

	public int getFriend_id() {
		return friend_id;
	}

	public void setFriend_id(int friend_id) {
		this.friend_id = friend_id;
	}

	public int getGroup_id() {
		return group_id;
	}

	public void setGroup_id(int group_id) {
		this.group_id = group_id;
	}

}