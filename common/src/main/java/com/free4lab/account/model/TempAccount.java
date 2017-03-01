package com.free4lab.account.model;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the access_token database table.
 * 
 */
@Entity
@Table(name="temp_account")
public class TempAccount implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="ID", unique=true, nullable=false)
	private Integer id;

	@Column(name="INVITER_EMAIL", length=50, nullable=false)
	private String inviter_email;
	
	@Column(name="TEMP_NAME", length=50, nullable= false)
	private String temp_name;
	
	@Column(name="TEMP_ACCOUNT", length=50, nullable= false)
	private String temp_account;
	
	@Column(name="INVITE_TYPE", length=10, nullable= false)
	private Integer temp_type;
	
	@Column(name="INVITE_URL", length=255, nullable= false)
	private String temp_url;
	
	@Column(name="INVITE_BEGINTIME", length=20, nullable= false)
	private long temp_begintime;
	
	@Column(name="TEMP_VALID", length=10, nullable= false)
	private Integer temp_valid;
	
	@Column(name="TEMP_EXTEND", length=255, nullable= false)
	private String temp_extend;
	

	
	 /** default constructor */
    public TempAccount() {
    }
    /** full constructor */
	 public TempAccount(String inviter_email, String temp_name, 
			 String temp_account, Integer temp_type, String temp_url, long temp_begintime, 
	    		Integer temp_valid, String temp_extend) {
		 this.inviter_email=inviter_email;
		 this.temp_name=temp_name;
		 this.temp_account=temp_account;
		 this.temp_type=temp_type;
		 this.temp_url=temp_url;
		 this.temp_begintime=temp_begintime;
		 this.temp_valid=temp_valid;
		 this.temp_extend=temp_extend;
		 this.inviter_email=inviter_email;
		 
		 
	    }



	public Integer getId() {
		return id;
	}




	public void setId(Integer id) {
		this.id = id;
	}




	public String getInviter_email() {
		return inviter_email;
	}




	public void setInviter_email(String inviter_email) {
		this.inviter_email = inviter_email;
	}




	public String getTemp_name() {
		return temp_name;
	}




	public void setTemp_name(String temp_name) {
		this.temp_name = temp_name;
	}




	public String getTemp_account() {
		return temp_account;
	}




	public void setTemp_account(String temp_account) {
		this.temp_account = temp_account;
	}




	public Integer getTemp_type() {
		return temp_type;
	}




	public void setTemp_type(Integer temp_type) {
		this.temp_type = temp_type;
	}




	public String getTemp_url() {
		return temp_url;
	}




	public void setTemp_url(String temp_url) {
		this.temp_url = temp_url;
	}




	public long getTemp_begintime() {
		return temp_begintime;
	}




	public void setTemp_begintime(long temp_begintime) {
		this.temp_begintime = temp_begintime;
	}




	public Integer getTemp_valid() {
		return temp_valid;
	}




	public void setTemp_valid(Integer temp_valid) {
		this.temp_valid = temp_valid;
	}




	public String getTemp_extend() {
		return temp_extend;
	}




	public void setTemp_extend(String temp_extend) {
		this.temp_extend = temp_extend;
	}
	
	

	

   
}