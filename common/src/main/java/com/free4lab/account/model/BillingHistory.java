package com.free4lab.account.model;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;


/**
 * The persistent class for the billing_history database table.
 * 
 */
@Entity
@Table(name="billing_history")
public class BillingHistory implements Serializable {
	private static final long serialVersionUID = 1L;
	
	public final static String PAYTYPE_HOUR = "按需";
	public final static String PAYTYPE_DAY = "包日";
	public final static String PAYTYPE_MONTH = "包月";
	public final static String PAYTYPE_YEAR = "包年";
	public final static String PAYTYPE_TIMES = "计次";
	public final static String PAYTYPE_ONCE = "一次性";
	public final static String PAYTYPE_OTHERS = "其它";
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(unique=true, nullable=false)
	private int id;

	private int amount;

	private double count;

	@Column(length=255)
	private String extend;

	@Column(length=255)
	private String log;

	@Column(name="payment_type")
	@Enumerated(EnumType.STRING)
	private String payment_type;

	@Column(length=255)
	private String reason;

	@Column(length=255)
	private String name;

	@Column(length=255)
	private String product_type;

	private int recid;

	private int times;
	
	private Timestamp time;

	private int uid;

    public BillingHistory() {
    }

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getAmount() {
		return this.amount;
	}

	public void setAmount(int amount) {
		this.amount = amount;
	}

	public double getCount() {
		return this.count;
	}

	public void setCount(double count) {
		this.count = count;
	}

	public String getExtend() {
		return this.extend;
	}

	public void setExtend(String extend) {
		this.extend = extend;
	}

	public String getLog() {
		return this.log;
	}

	public void setLog(String log) {
		this.log = log;
	}

	public String getPaymentType() {
		return this.payment_type;
	}

	public void setPayment_type(String paymentType) {
		this.payment_type = paymentType;
	}

	public String getReason() {
		return reason;
	}

	public void setReason(String reason) {
		this.reason = reason;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getProduct_type() {
		return product_type;
	}

	public void setProduct_type(String product_type) {
		this.product_type = product_type;
	}

	public String getPayment_type() {
		return payment_type;
	}

	public int getRecid() {
		return this.recid;
	}

	public void setRecid(int recid) {
		this.recid = recid;
	}

	public int getTimes() {
		return this.times;
	}

	public void setTimes(int times) {
		this.times = times;
	}

	public Timestamp getTime() {
		return time;
	}

	public void setTime(Timestamp time) {
		this.time = time;
	}

	public int getUid() {
		return this.uid;
	}

	public void setUid(int uid) {
		this.uid = uid;
	}

}