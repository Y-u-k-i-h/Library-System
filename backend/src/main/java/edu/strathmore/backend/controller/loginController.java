package edu.strathmore.backend.controller;

import edu.strathmore.backend.model.User;
import edu.strathmore.backend.model.Login;
import edu.strathmore.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/authentication")
public class loginController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private String detectRole(String user_Id) {
        if (user_Id.startsWith("ST")) return "STUDENT";
        else if (user_Id.startsWith("SF")) return "STAFF";
        else if (user_Id.startsWith("MG")) return "MANAGEMENT";
        else return "UNKNOWN";
    }
    @PostMapping("/signup")
    public ResponseEntity<String> registerUser(@RequestBody User user) {

        if (!user.getEmail().toLowerCase().endsWith("@strathmore.edu")) {
            return ResponseEntity.badRequest().body("Your Email must be a @strathmore.edu address");
        }

        if (userRepository.existsById(user.getUser_Id())) {
            return ResponseEntity.badRequest().body("ID already exists");
        }

        String role = detectRole(user.getUser_Id());
        if (role.equals("UNKNOWN")) {
            return ResponseEntity.badRequest().body("Invalid user ID format");
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
        if (!password.matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$")) {
            return ResponseEntity.badRequest().body("Password must be at least 8 characters long and include upper case, lower case, and a number");
        }

        user.setRole(role);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully as " + role);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Login login) {
        Optional<User> userOpt = userRepository.findById(login.getUser_Id());

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid ID or password"));
        }

        User user = userOpt.get();

        if (user.isAccountLocked()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Account locked. Reset password to continue.");
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            user.setFailedAttempts(user.getFailedAttempts() + 1);

            if (user.getFailedAttempts() >= 3) {
                user.setAccountLocked(true);
            }

            userRepository.save(user);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }

        Map<String, String> response = new HashMap<>();
        response.put("message", "Login successful");
        response.put("role", user.getRole());
        response.put("name", user.getUsername());

        return ResponseEntity.ok(response);
    }
    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestBody Map<String, String> request) {
        String otp = request.get("otp");

        if ( otp == null) {
            return ResponseEntity.badRequest().body("OTP are required.");
        }

        User user = userOpt.get();

        if (user.getOtp() == null || user.getOtpExpiration() == null) {
            return ResponseEntity.badRequest().body("No OTP found. Please request a new one.");
        }

        if (!user.getOtp().equals(otp)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid OTP.");
        }

        if (user.getOtpExpiration().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("OTP has expired.");
        }

        return ResponseEntity.ok("OTP verified. Proceed to reset password.");
    }

    @PostMapping("/request-otp")
    public ResponseEntity<String> requestPasswordReset(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Email not found");

        User user = userOpt.get();

        String otp = String.format("%06d", new Random().nextInt(999999));
        user.setOtp(otp);
        user.setOtpExpiration(LocalDateTime.now().plusMinutes(05));
        userRepository.save(user);

        emailService.sendOtp(email, otp);

        return ResponseEntity.ok("OTP sent to your email");
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

        if ( newPassword == null || confirmPassword == null) {
            return ResponseEntity.badRequest().body("All fields are required");
        }

        if (!newPassword.equals(confirmPassword)) {
            return ResponseEntity.badRequest().body("Passwords do not match");
        }

        if (!isPasswordStrong(newPassword)) {
            return ResponseEntity.badRequest().body(
                    "Password must be at least 8 characters long and include uppercase, lowercase, digit, and special character."
            );
        }

        User user = userOpt.get();
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setOtp(null);
        user.setOtpExpiration(null);
        user.setFailedAttempts(0);
        user.setAccountLocked(false);
        userRepository.save(user);

        return ResponseEntity.ok("Password successfully reset");
}
