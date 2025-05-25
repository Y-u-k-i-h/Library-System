package edu.strathmore.backend.controller;

import edu.strathmore.backend.model.User;
import edu.strathmore.backend.model.Login;
import edu.strathmore.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

//Telle spring that this class handles REST API requests and all URLs will start with /authentication
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
        // Validates email used
        if (!user.getEmail().toLowerCase().endsWith("@strathmore.edu")) {
            return ResponseEntity.badRequest().body("Your Email must be a @strathmore.edu address");
        }
        // checks if ID exists
        if (userRepository.existsById(user.getUser_Id())) {
            return ResponseEntity.badRequest().body("ID already exists");
        }
        // Checks the role of user from the ID used
        String role = detectRole(user.getUser_Id());
        if (role.equals("UNKNOWN")) {
            return ResponseEntity.badRequest().body("Invalid user ID format");
        }
        // Encryts the password and saves it
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

        if (!passwordEncoder.matches(login.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid credentials"));
        }

        Map<String, String> response = new HashMap<>();
        response.put("message", "Login successful");
        response.put("role", user.getRole());
        response.put("name", user.getUsername());

        return ResponseEntity.ok(response);
    }
}
