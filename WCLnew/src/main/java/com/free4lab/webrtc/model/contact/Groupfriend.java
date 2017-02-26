package com.free4lab.webrtc.model.contact;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the groupfriend database table.
 * 
 */
@Entity
@Table(name = "groupfriend")
public class Groupfriend implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private int id;

	private int friendId;

	private int groupId;

    public Groupfriend() {
    }

    //
    public Groupfriend( Integer groupId,Integer friendId)
    {
    	this.groupId=groupId;
    	this.friendId=friendId;
    	
    }
    
	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getFriendId() {
		return this.friendId;
	}

	public void setFriendId(int friendId) {
		this.friendId = friendId;
	}

	public int getGroupId() {
		return this.groupId;
	}

	public void setGroupId(int groupId) {
		this.groupId = groupId;
	}

}