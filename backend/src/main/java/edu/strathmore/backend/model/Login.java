package edu.strathmore.backend.model;

public class Login{
    private String user_Id;
    private String password;

    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public String getUser_Id() {
        return user_Id;
    }
    public void setId(String user_Id) {
        this.user_Id = user_Id;
    }
}
