package edu.strathmore.backend.model;
import jakarta.persistence.*;

// marks this class as a JPA entity and the entity is mapped to users in the table in database
@Entity
@Table(name = "users")

public class User {

    @Id
    @Column(name = "user_id", nullable = false, unique = true)
    private String user_Id;

    private String username;
    @Column(nullable = false, unique = true)
    private String email;
    private String password;
    private String phone;
    private String role

    // Getters and setters
    public String getUser_Id() {
        return user_Id;
    }
    public void setUser_Id(String studentId) {
        this.user_Id = user_Id;
    }

    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
    public String getRole() {
        return role;
    }
    public void setRole(String role) {
        this.role = role;
    }
}