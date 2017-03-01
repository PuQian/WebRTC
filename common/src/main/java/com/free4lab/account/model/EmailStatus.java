package com.free4lab.account.model;

import java.io.Serializable;
import javax.persistence.*;
import java.sql.Timestamp;


/**
 * The persistent class for the email_status database table.
 * 
 */
@Entity
@Table(name="email_status")
public class EmailStatus implements Serializable {
	private static final long serialVersionUID = 1L;

	public final static String TYPE_REGISTER = "REGISTER";
	public final static String TYPE_FINDBACK = "FINDBACK";
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	@Column(name="client_id")
	private String clientId;

	private String email;

	private String pwd_salt;

    @Lob()
	@Column(name="redirect_uri")
	private String redirectUri;

	private Timestamp time;

	private String type;

	private String uuid;

	private int valid;

    public EmailStatus() {
    }

	public EmailStatus(String clientId, String email, String pwd_salt,
			String redirectUri, Timestamp time, String type, String uuid,
			int valid) {
		this.clientId = clientId;
		this.email = email;
		this.pwd_salt = pwd_salt;
		this.redirectUri = redirectUri;
		this.time = time;
		this.type = type;
		this.uuid = uuid;
		this.valid = valid;
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getClientId() {
		return this.clientId;
	}

	public void setClientId(String clientId) {
		this.clientId = clientId;
	}

	public String getEmail() {
		return this.email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPwd_salt() {
		return pwd_salt;
	}

	public void setPwd_salt(String pwd_salt) {
		this.pwd_salt = pwd_salt;
	}

	public String getRedirectUri() {
		return this.redirectUri;
	}

	public void setRedirectUri(String redirectUri) {
		this.redirectUri = redirectUri;
	}

	public Timestamp getTime() {
		return this.time;
	}

	public void setTime(Timestamp time) {
		this.time = time;
	}

	public String getType() {
		return this.type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getUuid() {
		return this.uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public int getValid() {
		return this.valid;
	}

	public void setValid(int valid) {
		this.valid = valid;
	}

}