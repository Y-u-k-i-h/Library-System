package edu.strathmore.backend.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name="Users")
@Inheritance(strategy=InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "user_type")

public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private long user_id;
    @Column(unique=true, nullable=false)
    private String userCode;
    private String fname;
    private String lname;
    private int phone;
    private String email;
    private String gender;
    private String address;
    private Date dateOfBirth;
    private String password;
    private String role;
    private String otp;
    private LocalDateTime otpExpiration;
    private int failedAttempts;
    private boolean accountLocked;

    @OneToMany(mappedBy="borrower", cascade=CascadeType.ALL)
    private List<BorrowingDetails> borrowings = new ArrayList<>();
    public User() {}
    public User(int id, String name, String lname,  int phone, String email, String gender, String address, Date dateOfBirth, String password, String role) {
        this.id = id;
        this.fname = name;
        this.lname = lname;
        this.phone = phone;
        this.email = email;
        this.gender = gender;
        this.address = address;
        this.dateOfBirth = dateOfBirth;
        this.password = password;
        this.role = role;

    }

    public String getUserCode() {
        return userCode;
    }

    public void setUserCode(String userCode) {
        this.userCode = userCode;
    }

    public boolean isAccountLocked() {
        return accountLocked;
    }

    public void setAccountLocked(boolean accountLocked) {
        this.accountLocked = accountLocked;
    }

    public int getFailedAttempts() {
        return failedAttempts;
    }

    public void setFailedAttempts(int failedAttempts) {
        this.failedAttempts = failedAttempts;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }

    public LocalDateTime getOtpExpiration() {
        return otpExpiration;
    }

    public void setOtpExpiration(LocalDateTime otpExpiration) {
        this.otpExpiration = otpExpiration;
    }

    public long getId() {

        return id;
    }
    public String getFname() {
        return fname;
    }
    public String getLname() {
        return lname;
    }
    public int getPhone() {
        return phone;
    }
    public String getEmail() {
        return email;
    }
    public String getGender() {
        return gender;
    }
    public String getAddress() {
        return address;
    }
    public Date getDateOfBirth() {
        return dateOfBirth;
    }
    public void setId(long id) {
        this.id = id;
    }
    public void setFname(String fname) {
        this.fname = fname;
    }
    public void setLname(String lname) {
        this.lname = lname;
    }
    public void setPhone(int phone) {
        this.phone = phone;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public void setGender(String gender){
        this.gender = gender;
    }
    public void setAddress(String address) {
        this.address = address;
    }
    public void setDateOfBirth(Date dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }


    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public long getUser_id() {
        return user_id;
    }

    public void setUser_id(long user_id) {
        this.user_id = user_id;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public List<BorrowingDetails> getBorrowings() {
        return borrowings;
    }

    public void setBorrowings(List<BorrowingDetails> borrowings) {
        this.borrowings = borrowings;
    }
}
