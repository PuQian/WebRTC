package com.free4lab.account.model;

import java.io.Serializable;
import javax.persistence.*;

/**
 * The persistent class for the user database table.
 * 
 */
@Entity
@Table(name="user")
public class User implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(unique=true, nullable=false)
	private int id;
	
	private int uid;

	@Column(name="all_extend")
	private byte all_extend;

	@Column(length=100)
	private String blog;

	@Column(length=255)
	private String description;

	@Column(length=50)
	private String email;

	@Column(name="email_extend")
	private byte email_extend;

	@Column(name="email_home", length=50)
	private String email_home;

	@Column(name="email_work", length=50)
	private String email_work;

	@Column(length=50)
	private String extend;

	@Column(length=1)
	private String gender;

	@Column(length=100)
	private String microblog;

	@Column(length=50)
	private String msn;

	@Column(length=20)
	private String phone;

	@Column(name="phone_extend")
	private byte phone_extend;

	@Column(name="phone_home", length=20)
	private String phone_home;

	@Column(name="phone_work", length=20)
	private String phone_work;

	@Column(name="profile_image_url", length=100)
	private String profile_image_url;

	@Column(name="company", length=255)
	private String company;
	
	@Column(length=50)
	private String qq;

	@Column(name="real_name", length=50)
	private String real_name;

	@Column(name="screen_name", length=50)
	private String screen_name;

    public User() {
    }

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getUid() {
		return uid;
	}

	public void setUid(int uid) {
		this.uid = uid;
	}

	public byte getAll_extend() {
		return all_extend;
	}

	public void setAll_extend(byte all_extend) {
		this.all_extend = all_extend;
	}

	public String getBlog() {
		return blog;
	}
	
	public void setBlog(String blog) {
		this.blog = blog;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public byte getEmail_extend() {
		return email_extend;
	}

	public void setEmail_extend(byte email_extend) {
		this.email_extend = email_extend;
	}

	public String getEmail_home() {
		return email_home;
	}

	public void setEmail_home(String email_home) {
		this.email_home = email_home;
	}

	public String getEmail_work() {
		return email_work;
	}

	public void setEmail_work(String email_work) {
		this.email_work = email_work;
	}

	public String getExtend() {
		return extend;
	}

	public void setExtend(String extend) {
		this.extend = extend;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public String getMicroblog() {
		return microblog;
	}

	public void setMicroblog(String microblog) {
		this.microblog = microblog;
	}

	public String getMsn() {
		return msn;
	}

	public void setMsn(String msn) {
		this.msn = msn;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public byte getPhone_extend() {
		return phone_extend;
	}

	public void setPhone_extend(byte phone_extend) {
		this.phone_extend = phone_extend;
	}

	public String getPhone_home() {
		return phone_home;
	}

	public void setPhone_home(String phone_home) {
		this.phone_home = phone_home;
	}

	public String getPhone_work() {
		return phone_work;
	}

	public void setPhone_work(String phone_work) {
		this.phone_work = phone_work;
	}

	public String getProfile_image_url() {
		return profile_image_url;
	}

	public void setProfile_image_url(String profile_image_url) {
		this.profile_image_url = profile_image_url;
	}

	public String getQq() {
		return qq;
	}

	public void setQq(String qq) {
		this.qq = qq;
	}

	public String getReal_name() {
		return real_name;
	}

	public void setReal_name(String real_name) {
		this.real_name = real_name;
	}

	public String getScreen_name() {
		return screen_name;
	}

	public void setScreen_name(String screen_name) {
		this.screen_name = screen_name;
	}

	public String getCompany() {
		return company;
	}

	public void setCompany(String company) {
		this.company = company;
	}

}