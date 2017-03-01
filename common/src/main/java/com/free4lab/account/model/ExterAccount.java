package com.free4lab.account.model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * add by yck
 * 外部临时用户登录表
 */
@Entity
@Table(name="exter_account")
public class ExterAccount  implements Serializable {
	private static final long serialVersionUID = 1L;

	public ExterAccount(){
		
	}
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(unique=true, nullable=false)
	private int id;

	@Column(name="name",nullable=false)
	private String name;
	
	@Column(name="extend",nullable=false)
	private String extend;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getExtend() {
		return extend;
	}

	public void setExtend(String extend) {
		this.extend = extend;
	}
}
