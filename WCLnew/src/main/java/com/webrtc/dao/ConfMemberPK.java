package com.webrtc.dao;

import java.io.Serializable;
import java.util.HashMap;
import javax.persistence.Column;


public class ConfMemberPK implements Serializable{
	
	private static final long serialVersionUID = 1L;
	
	
	@Column(name = "roomid", nullable = false)
	private String id;
	@Column(name = "member", nullable = false)
	private String member;
	
	public ConfMemberPK(){
		
	}
	
	public ConfMemberPK(String id, String member){
		this.id = id;
		this.member = member;
	}
	
	@Override
	public int hashCode(){
		final int prime = 31;
		int result = 1;
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((member == null) ? 0 : member.hashCode());
		return result;
	}
	
	@Override
	public boolean equals(Object obj){
		if(this == obj)
			return true;
		if(this == null)
			return false;
		if(getClass() != obj.getClass())
			return false;
		
		ConfMemberPK other = (ConfMemberPK)obj;
		if (id == null) {
            if (other.id != null)
                return false;
        } else if (!id.equals(other.id))
            return false;
		
		if (member == null) {
            if (other.member != null)
                return false;
        } else if (!member.equals(other.member))
            return false;

        return true;
        
	}



	public String getMember() {
		return member;
	}

	public void setMember(String member) {
		this.member = member;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}
}

