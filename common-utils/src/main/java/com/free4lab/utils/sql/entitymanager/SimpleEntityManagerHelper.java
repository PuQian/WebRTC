/*
 * Copyright 2011 BUPT. All rights reserved.
 * BUPT PROPRIETARY/CONFIDENTIAL.
 */
package com.free4lab.utils.sql.entitymanager;

import com.free4lab.utils.sql.IEntityManagerHelper;
import java.util.HashMap;
import java.util.Map;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;

/**
 * 简单的JPA数据库管理器
 * （可能会存在长链接问题，对于定期执行的数据库程序较为适用）
 * @author yicou
 */
public class SimpleEntityManagerHelper implements IEntityManagerHelper {

    private static final Map<String, EntityManagerFactory> threadLocalMap =
            new HashMap<String, EntityManagerFactory>();

    public EntityManager getEntityManager(String PUName) {
        EntityManagerFactory emf;
        if (!threadLocalMap.containsKey(PUName)) {
            emf = Persistence.createEntityManagerFactory(PUName);
            threadLocalMap.put(PUName, emf);
        } else {
            emf = threadLocalMap.get(PUName);
        }

        EntityManager manager = emf.createEntityManager();
        return manager;
    }
}
