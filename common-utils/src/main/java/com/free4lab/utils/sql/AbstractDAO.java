/*
 * Copyright 2011 BUPT. All rights reserved.
 * BUPT PROPRIETARY/CONFIDENTIAL.
 */
package com.free4lab.utils.sql;

import java.util.Collection;
import java.util.logging.Logger;

import java.util.List;
import java.util.logging.Level;
import javax.persistence.EntityManager;
import javax.persistence.Query;

import org.hibernate.FlushMode;
import org.hibernate.Session;

/**
 * 基础DAO，这是一个抽象类，请DAO继承此类
 * @author yicou
 */
public abstract class AbstractDAO<T> {

    /**
     * 获取实体名称，内部使用
     * @return
     */
    public String getClassName() {
        return getEntityClass().getName();
    }

    /**
     * 获取实体类型，需要继承，内部使用
     * @return
     */
    public abstract Class getEntityClass();

    /**
     * 获取数据库持久单元名称，需要继承，内部使用
     * @return
     */
    public abstract String getPUName();

    /**
     * 获取JPA数据库管理器，需要继承，内部使用
     * @return
     */
    public abstract IEntityManagerHelper getEntityManagerHelper();

    protected EntityManager getEntityManager() {
        return getEntityManagerHelper().getEntityManager(getPUName());
    }
    protected Logger logger = null;

    protected Logger getLogger() {
        if (logger == null) {
            logger = Logger.getLogger(getClassName());
        }
        return logger;
    }

    protected void log(String info, Level level, Throwable ex) {
        getLogger().log(level, info, ex);
    }

    /**
     * 保存一个数据库实例
     */
    public void save(Collection<T> el) {

        EntityManager em = getEntityManager();

        if (em.getTransaction().isActive()) {
            em.getTransaction().rollback();
            log("A transaction is still active before another begin, we have to roll back it!", Level.SEVERE, null);
        }
        em.getTransaction().begin();

        log("saving " + getClassName() + " instance", Level.INFO, null);
        try {
        	Session session = (Session) em.getDelegate();
        	session.setFlushMode(FlushMode.MANUAL);
        	
            for (T entity : el) {
            	session.save(entity);
            }
            session.flush();
            session.clear();
            
            log("save successful", Level.INFO, null);
            em.getTransaction().commit();
        } catch (RuntimeException re) {
            log("save failed", Level.SEVERE, re);
            em.getTransaction().rollback();
            throw re;
        }

    }

    /**
     * 保存一个数据库实例
     */
    @SuppressWarnings("unchecked")
    public void save(T entity) {

        EntityManager em = getEntityManager();

        if (em.getTransaction().isActive()) {
            em.getTransaction().rollback();
            log("A transaction is still active before another begin, we have to roll back it!", Level.SEVERE, null);
        }
        em.getTransaction().begin();

        log("saving " + getClassName() + " instance", Level.INFO, null);
        try {
            em.persist(entity);
            log("save successful", Level.INFO, null);
            em.getTransaction().commit();
        } catch (RuntimeException re) {
            log("save failed", Level.SEVERE, re);
            em.getTransaction().rollback();
            throw re;
        }

    }

    /**
     * 通过主键删除一个数据库实例
     */
    @SuppressWarnings("unchecked")
    public void deleteByPrimaryKey(Object primaryKey) {

        EntityManager em = getEntityManager();

        if (em.getTransaction().isActive()) {
            em.getTransaction().rollback();
            log("A transaction is still active before another begin, we have to roll back it!", Level.SEVERE, null);
        }
        em.getTransaction().begin();
        log("deleting " + getClassName() + " instance", Level.INFO, null);
        try {
            Object entity = em.getReference(getEntityClass(),
                    primaryKey);
            em.remove(entity);
            log("delete successful", Level.INFO, null);
            em.getTransaction().commit();
        } catch (RuntimeException re) {
            log("delete failed", Level.SEVERE, re);
            em.getTransaction().rollback();
            throw re;
        }
    }

    /**
     * 更新一个数据库实例
     */
    @SuppressWarnings("unchecked")
    public void update(Collection<T> el) {

        EntityManager em = getEntityManager();

        if (em.getTransaction().isActive()) {
            em.getTransaction().rollback();
            log("A transaction is still active before another begin, we have to roll back it!", Level.SEVERE, null);
        }
        em.getTransaction().begin();

        log("updating " + getClassName() + " instance", Level.INFO, null);
        try {
            for (T entity : el) {
                em.merge(entity);
            }
            log("update successful", Level.INFO, null);
            em.getTransaction().commit();
        } catch (RuntimeException re) {
            log("update failed", Level.SEVERE, re);
            em.getTransaction().rollback();
            throw re;
        }
    }

    /**
     * 更新一个数据库实例
     */
    @SuppressWarnings("unchecked")
    public T update(T entity) {

        EntityManager em = getEntityManager();

        if (em.getTransaction().isActive()) {
            em.getTransaction().rollback();
            log("A transaction is still active before another begin, we have to roll back it!", Level.SEVERE, null);
        }
        em.getTransaction().begin();

        log("updating " + getClassName() + " instance", Level.INFO, null);
        try {
            T result = em.merge(entity);
            log("update successful", Level.INFO, null);
            em.getTransaction().commit();
            return result;
        } catch (RuntimeException re) {
            log("update failed", Level.SEVERE, re);
            em.getTransaction().rollback();
            throw re;
        }
    }

    /**
     * 通过主键寻找数据库实例
     * @param pKey 主键
     * @return
     */
    @SuppressWarnings("unchecked")
    public T findByPrimaryKey(Object pKey) {
        log("finding " + getClassName() + " instance with primary key: " + pKey,
                Level.INFO, null);
        try {
            Object instance = getEntityManager().find(getEntityClass(), pKey);
            return (T) instance;
        } catch (RuntimeException re) {
            log("find failed", Level.SEVERE, re);
            throw re;
        }
    }

    /**
     * 通过id寻找实体
     * @param id
     * @return
     */
    @SuppressWarnings("unchecked")
    public T findById(Integer id) {
        return findByPrimaryKey(id);
    }

    /**
     * 通过属性查找
     */
    @SuppressWarnings("unchecked")
    public List<T> findByProperty(String propertyName,
            final Object value) {
        log("finding " + getClassName() + " instance with property: "
                + propertyName + ", value: " + value, Level.INFO, null);
        try {
            final String queryString = "select model from " + getClassName() + " model where model."
                    + propertyName + "= :propertyValue";
            Query query = getEntityManager().createQuery(queryString);
            query.setParameter("propertyValue", value);
            return query.getResultList();
        } catch (RuntimeException re) {
            log("find by property name failed",
                    Level.SEVERE, re);
            throw re;
        }
    }
    
    /**
     * 通过属性查找
     */
    @SuppressWarnings("unchecked")
    public List<T> findByProperty2(String name1,
            final Object value1,String name2,final Object value2) {
        log("finding " + getClassName() + " instance with property1: "
                + name1 + ", value1: " + value1 
                + "; propety2: "+ name2 + ", value2: " + value2, Level.INFO, null);
        try {
            final String queryString = "select model from " + getClassName() + " model where model."
                    + name1 + "= :value1 and model." + name2 + "= :value2";
            Query query = getEntityManager().createQuery(queryString);
            query.setParameter("value1", value1);
            query.setParameter("value2", value2);
            return query.getResultList();
//            logger.info(query.getResultList());
        } catch (RuntimeException re) {
            log("find by property name2 failed",
                    Level.SEVERE, re);
            throw re;
        }
    }
    

    /**
     * 通过属性查找
     * @param page 从0开始，page0代表最靠前的数据
     * @param size
     * @return
     */
    @SuppressWarnings("unchecked")
    public List<T> findByProperty(String propertyName,
            final Object value, int page, int size) {
        log("finding " + getClassName() + " instance with property: "
                + propertyName + ", value: " + value, Level.INFO, null);
        try {
            final String queryString = "select model from " + getClassName() + " model where model."
                    + propertyName + "= :propertyValue";
            Query query = getEntityManager().createQuery(queryString);
            query.setParameter("propertyValue", value);
            query.setMaxResults(size).setFirstResult(page * size);
            return query.getResultList();
        } catch (RuntimeException re) {
            log("find by property name failed",
                    Level.SEVERE, re);
            throw re;
        }
    }

    /**
     * 查找所有
     */
    @SuppressWarnings("unchecked")
    public List<T> findAll() {
        log("finding all " + getClassName() + " instances", Level.INFO,
                null);
        try {
            final String queryString = "select model from " + getClassName() + " model";
            Query query = getEntityManager().createQuery(queryString);
            return query.getResultList();
        } catch (RuntimeException re) {
            log("find all failed", Level.SEVERE, re);
            throw re;
        }
    }

    /**
     * 查找所有, 包含分页
     * @param page 从0开始，page0代表最靠前的数据
     * @param size
     * @return
     */
    @SuppressWarnings("unchecked")
    public List<T> findAll(int page, int size) {
        log("finding all " + getClassName() + " instances", Level.INFO,
                null);
        try {
            final String queryString = "select model from " + getClassName() + " model";
            Query query = getEntityManager().createQuery(queryString);
            query.setMaxResults(size).setFirstResult(page * size);
            return query.getResultList();
        } catch (RuntimeException re) {
            log("find all failed", Level.SEVERE, re);
            throw re;
        }
    }
    
    /**
     * 计数
     * @author wenlele
     */
    public long countAll(){
    	log("count all " + getClassName() + "instances", Level.INFO,
    			null);
    	try {
			final String qlString = "select count(model)" +
					" from " + getClassName() + " model";
			Query query = getEntityManager().createQuery(qlString);
			Long count = (Long)query.getSingleResult();
			return count.longValue();
		} catch (RuntimeException re) {
			log("count all failed", Level.SEVERE, re);
			throw re;
		}
    }
    
    /**
     * 
     * @param property
     * @param value
     * @return
     */
    public long countByProperty(String property, Object value){
    	log("finding " + getClassName() + " instance with property: "
                + property + ", value: " + value, Level.INFO, null);
        try {
            final String queryString = "select count(model)" +
            		" from " + getClassName() + " model" +
            		" where model." + property + "= :propertyValue";
            Query query = getEntityManager().createQuery(queryString);
            query.setParameter("propertyValue", value);
            Long count = (Long)query.getSingleResult();
            return count.longValue();
        } catch (RuntimeException re) {
            log("count by property name failed",
                    Level.SEVERE, re);
            throw re;
        }
    }
    /**
     * 查找匹配两个字段值的计数
     * @param firstName
     * @param firstValue
     * @param secondName
     * @param secondValue
     * @return
     */
    public long countByProperty(String firstName, Object firstValue,
    		String secondName, Object secondValue){
    	log("finding " + getClassName() + " instance with property1: "
                + firstName + ", value1: " + firstValue 
                + "; propety2: "+ secondName + ", value2: " + secondValue, Level.INFO, null);
        try {
            final String queryString = "select count(model)" +
            		" from " + getClassName() + " model" +
            		" where model." + firstName + "= :value1" +
            		" and model." + secondName + "=:value2";
            Query query = getEntityManager().createQuery(queryString);
            query.setParameter("value1", firstValue);
            query.setParameter("value2", secondValue);
            Long count = (Long)query.getSingleResult();
            return count.longValue();
        } catch (RuntimeException re) {
            log("count by property name2 failed",
                    Level.SEVERE, re);
            throw re;
        }
    }
}