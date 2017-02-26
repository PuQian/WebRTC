package com.free4lab.webrtc.entity;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 企业表
 */
@Entity
@Table(name="enterprise")
public class Enterprise implements Serializable{
	
	private static final long serialVersionUID = 1L;
	
	@Id @GeneratedValue(strategy=IDENTITY)
	@Column(name="eid",unique=true,nullable=false)
	private Integer eid;
	
	@Column(name="name",nullable=false,length=30)
	private String name;
	
	@Column(name="introduction",nullable=false,length=30)
	private String introduction;
	
	@Column(name="scale",nullable=false)
	private Integer scale;
	
    public Enterprise() {
    }
    
	public Enterprise(String name, String introduction, Integer scale) {

		this.name = name;
		this.introduction = introduction;
		this.scale = scale;
	}

	public Integer getEid() {
		return eid;
	}

	public void setEid(Integer eid) {
		this.eid = eid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getIntroduction() {
		return introduction;
	}

	public void setIntroduction(String introduction) {
		this.introduction = introduction;
	}

	public Integer getScale() {
		return scale;
	}

	public void setScale(Integer scale) {
		this.scale = scale;
	}
}
