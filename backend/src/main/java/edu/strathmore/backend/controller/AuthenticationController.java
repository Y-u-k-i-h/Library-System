package edu.strathmore.backend.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.strathmore.backend.model.AdminUser;
import edu.strathmore.backend.model.Login;
import edu.strathmore.backend.model.Signup;
import edu.strathmore.backend.model.User;
import edu.strathmore.backend.repository.UserRepository;
import edu.strathmore.backend.security.CustomUserDetailsService;
import edu.strathmore.backend.security.JwtUtils;

@RestController
@RequestMapping("/authentication")

public class AuthenticationController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody Signup signup) {
        System.out.println("DEBUG: Signup endpoint called for user: " + signup.getUserCode());
        String userCode = signup.getUserCode();

        if (!signup.getEmail().toLowerCase().endsWith("@strathmore.edu")) {
            return ResponseEntity.badRequest().body("Your Email must be a @strathmore.edu address");
        }

        if (userRepository.findByEmail(signup.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already in use");
        }

        if (userRepository.existsByUserCode(signup.getUserCode())) {
            return ResponseEntity.badRequest().body("User Code already exists");
        }

        if (!userCode.matches("^(ST|LI|AD)\\d{4}$")) {
            return ResponseEntity.badRequest().body("User code must start with ST or LI followed by 4 digits (e.g., ST1234)");
        }

        String role = detectRole(userCode);

        if (role.equals("UNKNOWN")) {
            return ResponseEntity.badRequest().body("Invalid user ID format");
        }


        String password = signup.getPassword();

        if (password == null || password.isBlank()) {
            password = generateSuggestedPassword();
        }

        if (!password.matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$")) {
            return ResponseEntity.badRequest().body("Password must be at least 8 characters long and include upper case, lower case, and a number");
        }

        User user;
        
        // Create AdminUser for librarians, regular User for students
        if (role.equals("LIBRARIAN")) {
            System.out.println("DEBUG: Creating AdminUser for librarian");
            user = new AdminUser();
        } else {
            System.out.println("DEBUG: Creating regular User for student");
            user = new User();
        }
        
        user.setUserCode(userCode);
        user.setFname(signup.getFname());
        user.setLname(signup.getLname());
        user.setPhone(signup.getPhone());
        user.setEmail(signup.getEmail());
        // Set optional fields with defaults if not provided
        user.setGender(signup.getGender() != null ? signup.getGender() : "Not specified");
        user.setAddress(signup.getAddress() != null ? signup.getAddress() : "Not provided");
        user.setDateOfBirth(signup.getDateOfBirth()); // Can be null
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);

        userRepository.save(user);

        return ResponseEntity.ok("Signup successful");
    }

    private String detectRole(String userCode){
        if (userCode.startsWith("ST")) return "STUDENT";
        if (userCode.startsWith("LI")) return "LIBRARIAN";
        return "UNKNOWN";
    }
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Login login) {
        try {
            // Authenticate the user
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(login.getUserCode(), login.getPassword())
            );

            // Set authentication in SecurityContext
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Get user details from authentication
            CustomUserDetailsService.CustomUserPrincipal userPrincipal = 
                (CustomUserDetailsService.CustomUserPrincipal) authentication.getPrincipal();

            // Generate JWT token
            String jwtToken = jwtUtils.generateJwtToken(userPrincipal);

            // Get user information
            User user = userPrincipal.getUser();

            // Create response with token and user info
            Map<String, String> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("token", jwtToken);
            response.put("role", user.getRole());
            response.put("userCode", user.getUserCode());
            response.put("name", user.getFname() + " " + user.getLname());
            response.put("userId", String.valueOf(user.getUser_id()));

            return ResponseEntity.ok(response);

        } catch (org.springframework.security.core.AuthenticationException e) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }
    }

    private String generateSuggestedPassword() {
        String upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        String lower = "abcdefghijklmnopqrstuvwxyz";
        String digits = "0123456789";
        String all = upper + lower + digits;

        Random rand = new Random();
        StringBuilder password = new StringBuilder();


        password.append(upper.charAt(rand.nextInt(upper.length())));
        password.append(lower.charAt(rand.nextInt(lower.length())));
        password.append(digits.charAt(rand.nextInt(digits.length())));

        for (int i = 0; i < 7; i++) {
            password.append(all.charAt(rand.nextInt(all.length())));
        }

        return password.toString();
    }
    @PostMapping("/request-otp")
    public ResponseEntity<String> requestOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Email not found");
        }

        User user = userOpt.get();
        String otp = String.valueOf(new Random().nextInt(900000) + 100000);
        user.setOtp(otp);
        user.setOtpExpiration(LocalDateTime.now().plusMinutes(5));
        userRepository.save(user);

        System.out.println("OTP sent to email: " + otp);

        return ResponseEntity.ok("OTP sent to email");
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) return ResponseEntity.badRequest().body("Email not found");

        User user = userOpt.get();
        if (user.getOtp() == null || !user.getOtp().equals(otp)) {
            return ResponseEntity.badRequest().body("Invalid OTP");
        }

        if (user.getOtpExpiration() == null || user.getOtpExpiration().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("OTP expired");
        }

        return ResponseEntity.ok("OTP valid, proceed to reset password");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String newPassword = request.get("newPassword");
        String confirmPassword = request.get("confirmPassword");

        if (email == null || newPassword == null || confirmPassword == null) {
            return ResponseEntity.badRequest().body("All fields are required");
        }

        if (!newPassword.equals(confirmPassword)) {
            return ResponseEntity.badRequest().body("Passwords do not match");
        }
        if (!newPassword.matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$")) {
            return ResponseEntity.badRequest().body("Password must be at least 8 characters and include upper case, lower case, and a number");
        }



        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) return ResponseEntity.badRequest().body("User not found");

        User user = userOpt.get();
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setOtp(null);
        user.setOtpExpiration(null);
        user.setFailedAttempts(0);
        user.setAccountLocked(false);

        userRepository.save(user);
        return ResponseEntity.ok("Password reset successfully");
    }

    }


