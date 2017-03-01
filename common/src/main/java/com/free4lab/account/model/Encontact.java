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
@Table(name="encontacts")

public class Encontact implements java.io.Serializable {


    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	/**
	 * 
	 */

	@Id @GeneratedValue(strategy=IDENTITY)  
	@Column(name="ID", unique=true, nullable=false)
	private Integer id;
	@Column(name="LNAME", nullable=true, length=30)
	private String lname;
	@Column(name="FNAME", nullable=true, length=30)
	private String fname;
	@Column(name="SEX",  nullable=true,length=30)
	private String sex;
	@Column(name="NC", nullable=true, length=30)	
	private String nc;
	@Column(name="BIRTH", nullable=true, length=30)
	private String birth;
	@Column(name="GH",nullable=true,length=20)
	private String gh;
	@Column(name="ZW", nullable=true, length=30)
	private String zw;
	@Column(name="BM", nullable=true, length=30)
	private String bm;
	@Column(name="TELP", nullable=true, length=30)
	private String telp;
	@Column(name="MOBP", nullable=true, length=30)
	private String mobp;
	@Column(name="EMAILS", nullable=true, length=30)
	private String emails;
	@Column(name="ADDRESS", nullable=true, length=30)
	private String address;
	@Column(name="POSTCODE",  nullable=true)
	private String postcode;
	@Column(name="FZ", nullable=true, length=30)
	private Integer fz;
	@Column(name="BZ", nullable=true, length=30)
	private String bz;


    // Constructors

    /** default constructor */
    public Encontact() {
    }

    
    /** full constructor */
    public Encontact(String lname, String fname, String sex, String nc, 
    		String birth, String gh, String zw, String bm, String telp, String mobp, String emails, 
    		String address,  String postcode, Integer fz, String bz) {
    
    	this.lname = lname;
    	this.fname = fname;
    	this.sex = sex;
    	this.nc = nc;
    	this.birth = birth;
    	this.gh = gh;
    	this.zw = zw;
    	this.bm = bm;
    	this.telp = telp;
    	this.mobp = mobp;
    	this.emails = emails;
    	this.address = address;
    	this.postcode = postcode;
    	this.fz = fz;
    	this.bz = bz;
    }


	public Integer getId() {
		return id;
	}


	public void setId(Integer id) {
		this.id = id;
	}


	public String getLname() {
		return lname;
	}


	public void setLname(String lname) {
		this.lname = lname;
	}


	public String getFname() {
		return fname;
	}


	public void setFname(String fname) {
		this.fname = fname;
	}


	public String getSex() {
		return sex;
	}


	public void setSex(String sex) {
		this.sex = sex;
	}


	public String getNc() {
		return nc;
	}


	public void setNc(String nc) {
		this.nc = nc;
	}


	public String getBirth() {
		return birth;
	}


	public void setBirth(String birth) {
		this.birth = birth;
	}

	public String getGh() {
		return gh;
	}


	public void setGh(String gh) {
		this.gh = gh;
	}

	public String getZw() {
		return zw;
	}


	public void setZw(String zw) {
		this.zw = zw;
	}


	public String getBm() {
		return bm;
	}


	public void setBm(String bm) {
		this.bm = bm;
	}


	public String getTelp() {
		return telp;
	}


	public void setTelp(String telp) {
		this.telp = telp;
	}


	public String getMobp() {
		return mobp;
	}


	public void setMobp(String mobp) {
		this.mobp = mobp;
	}


	public String getEmails() {
		return emails;
	}


	public void setEmails(String emails) {
		this.emails = emails;
	}


	public String getAddress() {
		return address;
	}


	public void setAddress(String address) {
		this.address = address;
	}


	public String getPostcode() {
		return postcode;
	}


	public void setPostcode(String postcode) {
		this.postcode = postcode;
	}


	public Integer getFz() {
		return fz;
	}


	public void setFz(Integer fz) {
		this.fz = fz;
	}


	public String getBz() {
		return bz;
	}


	public void setBz(String bz) {
		this.bz = bz;
	}

   
    // Property accessors
//    @Id @GeneratedValue(strategy=IDENTITY)
//    
//    @Column(name="ID", unique=true, nullable=false)

//    public Integer getId() {
//        return this.id;
//    }
//    
//    public void setId(Integer id) {
//        this.id = id;
//    }
//    
//    public String getZydm() {
//        return this.zydm;
//    }
//    
//    public void setZydm(String zydm) {
//        this.zydm = zydm;
//    }
//    
////    @Column(name="ZYMC", nullable=false, length=30)
//
//    public String getZymc() {
//        return this.zymc;
//    }
//    
//    public void setZymc(String zymc) {
//        this.zymc = zymc;
//    }

}