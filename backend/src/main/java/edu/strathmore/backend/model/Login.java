package edu.strathmore.backend.model;

public class Login {
    private String userCode;
    private String password;

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String  getUserCode() {
        return userCode;
    }

    public void setUserCode(String user_id) {
        this.userCode = user_id;
    }



}
