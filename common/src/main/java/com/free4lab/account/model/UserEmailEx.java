package com.free4lab.account.model;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the user_email_ex database table.
 * 
 */
@Entity
@Table(name="user_email_ex")
public class UserEmailEx implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(unique=true, nullable=false)
	private int id;

	@Column(name="email_addr", length=50)
	private String email_addr;

	@Column(name="email_title", length=20)
	private String email_title;

	@Column(length=50)
	private String extend;

	private int uid;

    public UserEmailEx() {
    }

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getEmail_addr() {
		return email_addr;
	}

	public void setEmail_addr(String email_addr) {
		this.email_addr = email_addr;
	}

	public String getEmail_title() {
		return email_title;
	}

	public void setEmail_title(String email_title) {
		this.email_title = email_title;
	}

	public String getExtend() {
		return extend;
	}

	public void setExtend(String extend) {
		this.extend = extend;
	}

	public int getUid() {
		return uid;
	}

	public void setUid(int uid) {
		this.uid = uid;
	}

}