package com.free4lab.account.model;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the client database table.
 * 
 */
@Entity
@Table(name="client")
public class Client implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(unique=true, nullable=false)
	private int id;

	@Column(name="client_id", length=50)
	private String client_id;

	@Column(name="client_secret", length=50)
	private String client_secret;

	@Column(length=50)
	private String extend;

	@Column(length=50)
	private String name;

	@Column(name="need_author")
	private String need_author;

	@Column(name="url", length=255)
	private String url;
	
	@Column(name="img_url", length=255)
	private String img_url;

    public Client() {
    }

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getClient_id() {
		return client_id;
	}

	public void setClient_id(String client_id) {
		this.client_id = client_id;
	}

	public String getClient_secret() {
		return client_secret;
	}

	public void setClient_secret(String client_secret) {
		this.client_secret = client_secret;
	}

	public String getExtend() {
		return extend;
	}

	public void setExtend(String extend) {
		this.extend = extend;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getNeed_author() {
		return need_author;
	}

	public void setNeed_author(String needAuthor) {
		this.need_author = needAuthor;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getImg_url() {
		return img_url;
	}

	public void setImg_url(String img_url) {
		this.img_url = img_url;
	}

}