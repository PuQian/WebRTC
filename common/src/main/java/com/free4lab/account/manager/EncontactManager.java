package com.free4lab.account.manager;

import java.util.Collections;
import java.util.List;

import org.apache.log4j.Logger;

import com.free4lab.account.model.Encontact;
import com.free4lab.account.model.EncontactDAO;




public class EncontactManager {

	/*
	 * 
	 */
	private static EncontactDAO encontactDAO = new EncontactDAO();
	private static final Logger LOGGER = Logger.getLogger(EncontactManager.class);
	
	public static List<Encontact> getAllEncontacts() {
		try{
			return encontactDAO.findAll();
		}catch (Exception e) {
			LOGGER.debug(e);
			return Collections.emptyList();
		}
	}
	
	public static List<Encontact> findEncontactByFz(final Object fz){
		try{
			return encontactDAO.findByFz(fz);
		}catch (Exception e) {
			LOGGER.debug(e);
			return Collections.emptyList();
		}
	}
	
	public static Encontact findEngroupById(final Object encontactId){
		try{
			return encontactDAO.findByPrimaryKey(encontactId);
		}catch (Exception e) {
			LOGGER.debug(e);
			return null;
		}
	}
	
	public static List<Encontact> findEncontactByFzForPage(final Object fz,int page,int size){
		try{
			return encontactDAO.findByFzForPage(fz,page,size);
		}catch (Exception e) {
			LOGGER.debug(e);
			return Collections.emptyList();
		}
	} 
	
	public static long countEncontactByFzForPage(final Object fz){
		try{
			return encontactDAO.countByFzForPage(fz);
		}catch (Exception e) {
			LOGGER.debug(e);
			return -1;
		}
	}
	//返回true or false
	public static boolean updateEncontact(Integer id, String lname, String fname, String sex, String nc, 
    		String birth, String gh, String zw, String bm, String telp, String mobp, String emails, 
    		String address, String postcode, Integer fz, String bz) {
		Encontact encontact = encontactDAO.findById(id);
	
		encontact.setLname(lname);
		encontact.setFname(fname);
		encontact.setSex(sex);
		encontact.setNc(nc);
		encontact.setBirth(birth);
		encontact.setGh(gh);
		encontact.setZw(zw);
		encontact.setBm(bm);
		encontact.setTelp(telp);
		encontact.setMobp(mobp);
		encontact.setEmails(emails);
		encontact.setAddress(address);
		encontact.setPostcode(postcode);
		encontact.setFz(fz);
		encontact.setBz(bz);
		try{	
			encontactDAO.update(encontact);
			return true;
		}catch (Exception e) {
			LOGGER.debug(e);
			return false;
		}
	}

	//返回 Encontact
	public static Encontact updateEncontact2(Integer id, String lname, String fname, String sex, String nc, 
    		String birth, String gh, String zw, String bm, String telp, String mobp, String emails, 
    		String address, String postcode, Integer fz, String bz) {
		Encontact encontact = encontactDAO.findById(id);
	
		if(encontact == null){
			return  null;
		}
		encontact.setLname(lname);
		encontact.setFname(fname);
		encontact.setSex(sex);
		encontact.setNc(nc);
		encontact.setBirth(birth);
		encontact.setGh(gh);
		encontact.setZw(zw);
		encontact.setBm(bm);
		encontact.setTelp(telp);
		encontact.setMobp(mobp);
		encontact.setEmails(emails);
		encontact.setAddress(address);
		encontact.setPostcode(postcode);
		encontact.setFz(fz);
		encontact.setBz(bz);
		try{	
			encontactDAO.update(encontact);
			return encontact;
		}catch (Exception e) {
			LOGGER.debug(e);
			return null;
		}
	}
	
	//返回true or false
	public static boolean addEncontact( String lname, String fname, String sex, String nc, 
    		String birth, String gh, String zw, String bm, String telp, String mobp, String emails, 
    		String address, String postcode, Integer fz, String bz) {
		Encontact encontact = new Encontact(lname, fname, sex, nc, birth, gh, zw, 
				bm, telp, mobp, emails, address, postcode, fz, bz);
		try{	
			encontactDAO.save(encontact);
			return true;
		}catch (Exception e) {
			LOGGER.debug(e);
			return false;
		}
	}
	
	//返回Encontact
	public static Encontact addEncontact2( String lname, String fname, String sex, String nc, 
    		String birth, String gh, String zw, String bm, String telp, String mobp, String emails, 
    		String address, String postcode, Integer fz, String bz) {
		Encontact encontact = new Encontact(lname, fname, sex, nc, birth, gh, zw, 
				bm, telp, mobp, emails, address, postcode, fz, bz);
		try{	
			encontactDAO.save(encontact);
			return encontact;
		}catch (Exception e) {
			LOGGER.debug(e);
			return null;
		}
	}
	public static boolean delEncontact(int id) {
		try{	
			encontactDAO.deleteByPrimaryKey(id);
			return true;
		}catch (Exception e) {
			LOGGER.debug(e);
			return false;
		}
	}
	
	//根据分组的ids找联系人
	public static List<Encontact> findEncontactsByFzIds(List<Integer> fzids)
	{
		try{	
			return encontactDAO.findByIds("fz", fzids);
		}catch (Exception e) {
			LOGGER.debug(e);
			return Collections.emptyList();
		}
	}
	
	//根据ids找联系人
	public static List<Encontact> findEncontactsByIds(List<Integer> ids)
	{
		try{	
			return encontactDAO.findByIds("id", ids);
		}catch (Exception e) {
			LOGGER.debug(e);
			return Collections.emptyList();
		}
	}
}
