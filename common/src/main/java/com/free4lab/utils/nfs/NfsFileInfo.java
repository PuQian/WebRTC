/*
 * Copyright 2011 BUPT. All rights reserved.
 * BUPT PROPRIETARY/CONFIDENTIAL.
 */

package com.free4lab.utils.nfs;

import java.io.DataInput;
import java.io.DataInputStream;
import java.io.DataOutput;
import java.io.DataOutputStream;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

/**
 *
 * @author yicou
 */
public class NfsFileInfo implements IFileInfo {

    public NfsFileInfo() { }

    public NfsFileInfo(String name) {
        this.setName(name);
    }

    private String name;
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    private void readFields(DataInput in) throws IOException {
        name = in.readUTF();
    }
    private void writeFields(DataOutput out) throws IOException {
        out.writeUTF(name);
    }

    public boolean save(String path) {
        try {
            OutputStream fos = new FileOutputStream(path);
            DataOutput out = new DataOutputStream(fos);
            writeFields(out);
            return true;
        } catch (Exception ex) {
            System.out.println(ex.getMessage());
            ex.printStackTrace();
            return false;
        }
    }

    public boolean read(String path) {
        try {
            InputStream fis = new FileInputStream(path);
            DataInput in = new DataInputStream(fis);
            readFields(in);
            return true;
        } catch (Exception ex) {
            System.out.println(ex.getMessage());
            ex.printStackTrace();
            return false;
        }
    }
}
