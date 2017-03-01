package com.free4lab.account.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;


/**
 * Contact entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name="engroups")

public class Engroup implements java.io.Serializable {
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	/**
	 * 
	 */
	@Id @GeneratedValue(strategy=IDENTITY)
	@Column(name="FZ",unique=true,nullable=false)
	private Integer fz;
//	@Column(name="USERNAME",nullable=false,length=30)
//	private String username;
	@Column(name="EID",nullable=false)
	private Integer eid;
	@Column(name="FZMC",nullable=false,length=30)
	private String fzmc;
	@Column(name="LFZ",nullable=false)
	private Integer lfz;
    // Constructors

    /** default constructor */
    public Engroup() {
    }
    /** full constructor */
    public Engroup(Integer eid, String fzmc, Integer lfz){
    	this.eid = eid;
    	this.fzmc = fzmc;
    	this.lfz = lfz;
    }
	public Integer getFz() {
		return fz;
	}
	public void setFz(Integer fz) {
		this.fz = fz;
	}
	public Integer getEid() {
		return eid;
	}
	public void setEid(Integer eid) {
		this.eid = eid;
	}
	public String getFzmc() {
		return fzmc;
	}
	public void setFzmc(String fzmc) {
		this.fzmc = fzmc;
	}
	public Integer getLfz() {
		return lfz;
	}
	public void setLfz(Integer lfz) {
		this.lfz = lfz;
	}
}