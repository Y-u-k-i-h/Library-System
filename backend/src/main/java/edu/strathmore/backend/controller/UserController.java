package edu.strathmore.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.strathmore.backend.model.User;
import edu.strathmore.backend.repository.UserRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/users/me")
    public ResponseEntity<?> getCurrentUserProfile(Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication required");
            }
            
            // Get the authenticated user code from the security context
            String authenticatedUserCode = authentication.getName();
            System.out.println("Fetching profile for user: " + authenticatedUserCode);
            
            // Find the user by userCode in the User table
            User user = userRepository.findByUserCode(authenticatedUserCode).orElse(null);
            
            if (user != null) {
                System.out.println("User found: " + user.getFname() + " " + user.getLname());
                return ResponseEntity.ok(user);
            } else {
                System.out.println("User not found for userCode: " + authenticatedUserCode);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
        } catch (Exception e) {
            System.err.println("Error in getCurrentUserProfile: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error fetching user profile: " + e.getMessage());
        }
    }

    @GetMapping("/users/profile")
    public ResponseEntity<?> getUserProfile(Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication required");
            }
            
            String authenticatedUserCode = authentication.getName();
            System.out.println("Fetching profile for user: " + authenticatedUserCode);
            
            // Query the User table directly
            User user = userRepository.findByUserCode(authenticatedUserCode).orElse(null);
            
            if (user != null) {
                // Create a response object with only the needed fields to avoid serialization issues
                UserProfileResponse profile = new UserProfileResponse();
                profile.setId(user.getId());
                profile.setUser_id(user.getUser_id());
                profile.setUserCode(user.getUserCode());
                profile.setFname(user.getFname());
                profile.setLname(user.getLname());
                profile.setEmail(user.getEmail());
                profile.setPhone(user.getPhone());
                profile.setRole(user.getRole());
                
                return ResponseEntity.ok(profile);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
        } catch (Exception e) {
            System.err.println("Error in getUserProfile: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error fetching user profile: " + e.getMessage());
        }
    }

    // DTO class for user profile response
    public static class UserProfileResponse {
        private long id;
        private long user_id;
        private String userCode;
        private String fname;
        private String lname;
        private String email;
        private int phone;
        private String role;

        // Getters and setters
        public long getId() { return id; }
        public void setId(long id) { this.id = id; }

        public long getUser_id() { return user_id; }
        public void setUser_id(long user_id) { this.user_id = user_id; }

        public String getUserCode() { return userCode; }
        public void setUserCode(String userCode) { this.userCode = userCode; }

        public String getFname() { return fname; }
        public void setFname(String fname) { this.fname = fname; }

        public String getLname() { return lname; }
        public void setLname(String lname) { this.lname = lname; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public int getPhone() { return phone; }
        public void setPhone(int phone) { this.phone = phone; }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
    }
}
