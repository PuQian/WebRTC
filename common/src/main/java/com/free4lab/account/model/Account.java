package com.free4lab.account.model;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the account database table.
 * 
 */
@Entity
@Table(name="account")
public class Account implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(unique=true, nullable=false)
	private int id;

	@Column(length=50)
	private String email;

	@Column(length=50)
	private String extend;

	@Column(length=50)
	private String pwd_salt;

    public Account() {
    }

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getExtend() {
		return extend;
	}

	public void setExtend(String extend) {
		this.extend = extend;
	}

	public String getPwd_salt() {
		return pwd_salt;
	}

	public void setPwd_salt(String pwd_salt) {
		this.pwd_salt = pwd_salt;
	}
}