package edu.strathmore.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final CorsConfigurationSource corsConfigurationSource;

    public SecurityConfig(CorsConfigurationSource corsConfigurationSource) {
        this.corsConfigurationSource = corsConfigurationSource;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource)) // Enable CORS with our configuration
            .csrf(csrf -> csrf.disable()) // Disable CSRF for REST APIs
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/authentication/**").permitAll() // Allow public access to all authentication endpoints
                .anyRequest().authenticated() // Require authentication for all other endpoints
            )
            .httpBasic(httpBasic -> httpBasic.disable()) // Disable basic auth popup
            .formLogin(formLogin -> formLogin.disable()) // Disable default login form
            .sessionManagement(session -> session.sessionCreationPolicy(
                org.springframework.security.config.http.SessionCreationPolicy.STATELESS
            )); // Make it stateless for REST API

        return http.build();
    }

    @Bean
    public org.springframework.security.core.userdetails.UserDetailsService userDetailsService() {
        // Return an empty UserDetailsService to disable default user creation
        return username -> {
            throw new org.springframework.security.core.userdetails.UsernameNotFoundException("No users configured");
        };
    }
}
