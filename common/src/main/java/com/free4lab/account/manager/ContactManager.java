package com.free4lab.account.manager;

import java.util.Collections;
import java.util.List;

import org.apache.log4j.Logger;

import com.free4lab.account.model.Contact;
import com.free4lab.account.model.ContactDAO;




public class ContactManager {

	/*
	 * 
	 */
	private static ContactDAO contactDAO = new ContactDAO();
	private static final Logger LOGGER = Logger.getLogger(ContactManager.class);
	
	public static List<Contact> getAllContacts() {
		try{
			return contactDAO.findAll();
		}catch (Exception e) {
			LOGGER.debug(e);
			return Collections.emptyList();
		}
	}
	
	public static Contact findGroupById(final Object contactId){
		try{
			return contactDAO.findByPrimaryKey(contactId);
		}catch (Exception e) {
			LOGGER.debug(e);
			return null;
		}
	}
	
	public static List<Contact> findContactByFz(final Object fz){
		try{
			return contactDAO.findByFz(fz);
		}catch (Exception e) {
			LOGGER.debug(e);
			return Collections.emptyList();
		}
	}
	
	public static List<Contact> findContactByFzForPage(final Object fz,int page,int size){
		try{
			return contactDAO.findByFzForPage(fz,page,size);
		}catch (Exception e) {
			LOGGER.debug(e);
			return Collections.emptyList();
		}
	} 
	
	public static long countContactByFzForPage(final Object id){
		try{
			return contactDAO.countByFzForPage(id);
		}catch (Exception e) {
			LOGGER.debug(e);
			return -1;
		}
	}
	//返回true or false
	public static boolean updateContact(Integer id, String lname, String fname, String sex, String nc, 
    		String birth, String zw, String bm, String telp, String mobp, String emails, 
    		String address, String postcode, int fz, String bz) {
		Contact contact = contactDAO.findById(id);
	
		contact.setLname(lname);
		contact.setFname(fname);
		contact.setSex(sex);
		contact.setNc(nc);
		contact.setBirth(birth);
		contact.setZw(zw);
		contact.setBm(bm);
		contact.setTelp(telp);
		contact.setMobp(mobp);
		contact.setEmails(emails);
		contact.setAddress(address);
		contact.setPostcode(postcode);
		contact.setGroupId(fz);
		contact.setBz(bz);
		try{	
			contactDAO.update(contact);
			return true;
		}catch (Exception e) {
			LOGGER.debug(e);
			return false;
		}
	}
	//返回Contact
	public static Contact updateContact2(Integer id, String lname, String fname, String sex, String nc, 
    		String birth, String zw, String bm, String telp, String mobp, String emails, 
    		String address, String postcode, int fz, String bz) {
		Contact contact = contactDAO.findById(id);
	
		if(contact == null){
			return  null;
		}
		contact.setLname(lname);
		contact.setFname(fname);
		contact.setSex(sex);
		contact.setNc(nc);
		contact.setBirth(birth);
		contact.setZw(zw);
		contact.setBm(bm);
		contact.setTelp(telp);
		contact.setMobp(mobp);
		contact.setEmails(emails);
		contact.setAddress(address);
		contact.setPostcode(postcode);
		contact.setGroupId(fz);
		contact.setBz(bz);
		try{	
			contactDAO.update(contact);
			return contact;
		}catch (Exception e) {
			LOGGER.debug(e);
			return null;
		}
	}
//返回true or false
	public static boolean addContact( String lname, String fname, String sex, String nc, 
    		String birth, String zw, String bm, String telp, String mobp, String emails, 
    		String address, String postcode, int fz, String bz) {
		Contact contact = new Contact(lname, fname, sex, nc, birth, zw, 
				bm, telp, mobp, emails, address, postcode, fz, bz);
		try{	
			contactDAO.save(contact);
			return true;
		}catch (Exception e) {
			LOGGER.debug(e);
			return false;
		}
	}
//返回Contact
	public static Contact addContact2( String lname, String fname, String sex, String nc, 
    		String birth, String zw, String bm, String telp, String mobp, String emails, 
    		String address, String postcode, int fz, String bz) {
		Contact contact = new Contact(lname, fname, sex, nc, birth, zw, 
				bm, telp, mobp, emails, address, postcode, fz, bz);
		try{	
			contactDAO.save(contact);
			return contact;
		}catch (Exception e) {
			LOGGER.debug(e);
			return null;
		}
	}
	
	public static boolean delContact(int id) {
		try{	
			contactDAO.deleteByPrimaryKey(id);
			return true;
		}catch (Exception e) {
			LOGGER.debug(e);
			return false;
		}
	}
}
