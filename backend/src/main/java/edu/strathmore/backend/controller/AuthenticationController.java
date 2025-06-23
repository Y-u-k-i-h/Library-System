package edu.strathmore.backend.controller;

import edu.strathmore.backend.model.Login;
import edu.strathmore.backend.model.Signup;
import edu.strathmore.backend.model.User;
import edu.strathmore.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;

import java.util.*;

@RestController
@RequestMapping("/authentication")

public class AuthenticationController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody Signup signup) {
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
            return ResponseEntity.badRequest().body("User code must start with ST, LI, or AD followed by 4 digits (e.g., ST1234)");
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


        User user = new User();
        user.setUserCode(userCode);
        user.setFname(signup.getFname());
        user.setLname(signup.getLname());
        user.setPhone(signup.getPhone());
        user.setEmail(signup.getEmail());
        user.setGender(signup.getGender());
        user.setAddress(signup.getAddress());
        user.setDateOfBirth(signup.getDateOfBirth());
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);

        userRepository.save(user);

        return ResponseEntity.ok("Signup successful");
    }

    private String detectRole(String userCode){
        if (userCode.startsWith("ST")) return "STUDENT";
        if (userCode.startsWith("LI")) return "LIBRARIAN";
        if (userCode.startsWith("AD")) return "ADMIN";
        return "UNKNOWN";
    }
        @PostMapping("/login")
        public ResponseEntity<Map<String, String>> login(@RequestBody Login login) {
            Optional<User> userOpt = userRepository.findByUserCode(login.getUserCode());

            if (userOpt.isEmpty() || !passwordEncoder.matches(login.getPassword(), userOpt.get().getPassword())) {
                return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
            }

            Map<String, String> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("role", userOpt.get().getRole());
            return ResponseEntity.ok(response);
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
        String userCode = request.get("userCode");
        String newPassword = request.get("newPassword");
        String confirmPassword = request.get("confirmPassword");

        if (userCode == null || newPassword == null || confirmPassword == null) {
            return ResponseEntity.badRequest().body("All fields are required");
        }

        if (!newPassword.equals(confirmPassword)) {
            return ResponseEntity.badRequest().body("Passwords do not match");
        }
        if (!newPassword.matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$")) {
            return ResponseEntity.badRequest().body("Password must be at least 8 characters and include upper case, lower case, and a number");
        }



        Optional<User> userOpt = userRepository.findByUserCode(userCode);
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


