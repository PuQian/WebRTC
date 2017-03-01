package com.free4lab.account.model;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the user_phone_ex database table.
 * 
 */
@Entity
@Table(name="user_phone_ex")
public class UserPhoneEx implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(unique=true, nullable=false)
	private int id;

	@Column(length=50)
	private String extend;

	@Column(name="phone_title", length=20)
	private String phoneTitle;

	@Column(name="phone_value", length=20)
	private String phoneValue;

	private int uid;

    public UserPhoneEx() {
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

	public String getPhoneTitle() {
		return phoneTitle;
	}

	public void setPhoneTitle(String phoneTitle) {
		this.phoneTitle = phoneTitle;
	}

	public String getPhoneValue() {
		return phoneValue;
	}

	public void setPhoneValue(String phoneValue) {
		this.phoneValue = phoneValue;
	}

	public int getUid() {
		return uid;
	}

	public void setUid(int uid) {
		this.uid = uid;
	}

}