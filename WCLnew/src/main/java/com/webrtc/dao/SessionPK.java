package com.webrtc.dao;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Embeddable;

@Embeddable  
public class SessionPK implements Serializable {
	private static final long serialVersionUID = 1L;
	
	@Column(name = "offer_session_id", nullable = false)
	private String offerSessionID;
	@Column(name = "answer_session_id", nullable = false)
	private String answerSessionID;
	
	public SessionPK(){
	}
	
	
	public SessionPK(String offerSessionID, String answerSessionID) {
		this.offerSessionID = offerSessionID;
		this.answerSessionID = answerSessionID;
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


	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result
				+ ((answerSessionID == null) ? 0 : answerSessionID.hashCode());
		result = prime * result
				+ ((offerSessionID == null) ? 0 : offerSessionID.hashCode());
		return result;
	}


	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		SessionPK other = (SessionPK) obj;
		if (answerSessionID == null) {
			if (other.answerSessionID != null)
				return false;
		} else if (!answerSessionID.equals(other.answerSessionID))
			return false;
		if (offerSessionID == null) {
			if (other.offerSessionID != null)
				return false;
		} else if (!offerSessionID.equals(other.offerSessionID))
			return false;
		return true;
	}

	
	
}
