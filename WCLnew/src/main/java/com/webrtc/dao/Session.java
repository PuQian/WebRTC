package com.webrtc.dao;

import static javax.persistence.GenerationType.IDENTITY;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * Item entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name = "session")
public class Session implements java.io.Serializable {
	
	private static final long serialVersionUID = 1L;
	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "id", unique = true, nullable = false)
	private Integer id;
//	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "offerer", nullable = false)
	private String offerer;
	@Column(name = "answerer", nullable = false)
	private String answerer;
	@Column(name = "offer_session_id", nullable = false)
	private String offerSessionID;
	@Column(name = "answer_session_id", nullable = false)
	private String answerSessionID;
	@Column(name = "status", nullable = false)
	private String status;
	@Column(name = "seq", nullable = false)
	private Long seq;
	@Column(name = "call_date", nullable = true)
	private Timestamp callDate;
	@Column(name = "accept_date", nullable = true)
	private Timestamp acceptDate;
	@Column(name = "bye_date", nullable = true)
	private Timestamp byeDate;
	
	public Session(){
	}
	
	public Session(String offerer, String answerer, String offerSessionID,
			String answerSessionID, String status, Long seq,
			Timestamp callDate, Timestamp acceptDate, Timestamp byeDate) {
		this.offerer = offerer;
		this.answerer = answerer;
		this.offerSessionID = offerSessionID;
		this.answerSessionID = answerSessionID;
		this.status = status;
		this.seq = seq;
		this.callDate = callDate;
		this.acceptDate = acceptDate;
		this.byeDate = byeDate;
	}

	public String getOfferer() {
		return offerer;
	}
	public void setOfferer(String offerer) {
		this.offerer = offerer;
	}
	public String getAnswerer() {
		return answerer;
	}
	public void setAnswerer(String answerer) {
		this.answerer = answerer;
	}
	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getOfferSessionID() {
		return offerSessionID;
	}


	public void setOfferSessionID(String offerSessionID) {
		this.offerSessionID = offerSessionID;
	}

	public String getAnswerSessionID() {
		return answerSessionID;
	}

	public void setAnswerSessionID(String answerSessionID) {
		this.answerSessionID = answerSessionID;
	}

	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public Long getSeq() {
		return seq;
	}
	public void setSeq(Long seq) {
		this.seq = seq;
	}
	public Timestamp getCallDate() {
		return callDate;
	}
	public void setCallDate(Timestamp callDate) {
		this.callDate = callDate;
	}
	public Timestamp getAcceptDate() {
		return acceptDate;
	}
	public void setAcceptDate(Timestamp acceptDate) {
		this.acceptDate = acceptDate;
	}
	public Timestamp getByeDate() {
		return byeDate;
	}
	public void setByeDate(Timestamp byeDate) {
		this.byeDate = byeDate;
	}
	
	public String toString(){
		return 
				this.id+" "+
				this.offerer+" "+
				this.answerer+" "+
				this.offerSessionID +" "+
				this.answerSessionID+" "+
				this.status+" "+
				this.seq+" "+
				this.callDate+" "+
				this.acceptDate+" "+
				this.byeDate;
	}
}