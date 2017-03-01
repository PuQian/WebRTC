package com.free4lab.account.model;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the group_user database table.
 * 
 */
@Entity
@Table(name="group_user")
public class GroupUser implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(unique=true, nullable=false)
	private int id;

	@Column(length=50)
	private String extend;

	@Column(name="group_id")
	private int group_id;

	@Column(name="is_root", length=1)
	private String is_root;

	private int uid;

    public GroupUser() {
    }

	public GroupUser(int uid, int group_id, String is_root) {
		this.group_id = group_id;
		this.is_root = is_root;
		this.uid = uid;
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

	public int getGroup_id() {
		return group_id;
	}

	public void setGroup_id(int group_id) {
		this.group_id = group_id;
	}

	public String getIs_root() {
		return is_root;
	}

	public void setIs_root(String is_root) {
		this.is_root = is_root;
	}

	public int getUid() {
		return uid;
	}

	public void setUid(int uid) {
		this.uid = uid;
	}

}