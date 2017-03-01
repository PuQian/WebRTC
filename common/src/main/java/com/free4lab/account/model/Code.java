package com.free4lab.account.model;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the code database table.
 * 
 */
@Entity
@Table(name="code")
public class Code implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(unique=true, nullable=false)
	private int id;

	@Column(name="begin_time")
	private long begin_time;

	@Column(name="client_secret", length=50)
	private String client_secret;

	@Column(length=50)
	private String code;

	@Column(name="code_sso", length=50)
	private String code_sso;

	@Column(length=50)
	private String extend;

	private int valid;

    public Code() {
    }

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public long getBegin_time() {
		return begin_time;
	}

	public void setBegin_time(long begin_time) {
		this.begin_time = begin_time;
	}

	public String getClient_secret() {
		return client_secret;
	}

	public void setClient_secret(String client_secret) {
		this.client_secret = client_secret;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getCode_sso() {
		return code_sso;
	}

	public void setCode_sso(String code_sso) {
		this.code_sso = code_sso;
	}

	public String getExtend() {
		return extend;
	}

	public void setExtend(String extend) {
		this.extend = extend;
	}

	public int getValid() {
		return valid;
	}

	public void setValid(int valid) {
		this.valid = valid;
	}

}