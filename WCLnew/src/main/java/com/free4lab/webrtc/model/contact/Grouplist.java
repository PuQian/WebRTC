package com.free4lab.webrtc.model.contact;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the grouplist database table.
 * 
 */
@Entity
@Table(name = "grouplist")
public class Grouplist implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private int groupId;

	private String groupName;

    public Grouplist() {
    }

    public Grouplist(String groupName)
    {
    	this.groupName=groupName;
    }
    
	public int getGroupId() {
		return this.groupId;
	}

	public void setGroupId(int groupId) {
		this.groupId = groupId;
	}

	public String getGroupName() {
		return this.groupName;
	}

	public void setGroupName(String groupName) {
		this.groupName = groupName;
	}

}