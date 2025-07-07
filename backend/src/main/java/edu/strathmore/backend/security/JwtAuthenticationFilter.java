package edu.strathmore.backend.security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * JWT Authentication Filter
 * This filter runs on every request and checks for JWT tokens in the Authorization header
 * If a valid token is found, it sets the authentication in the SecurityContext
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                  HttpServletResponse response, 
                                  FilterChain filterChain) throws ServletException, IOException {
        
        System.out.println("Debug - JWT Filter - Processing request: " + request.getRequestURI());
        
        try {
            // Get JWT token from Authorization header
            String authToken = getTokenFromRequest(request);
            
            System.out.println("Debug - JWT Filter - Token found: " + (authToken != null));
            
            if (authToken != null && jwtUtils.validateJwtToken(authToken) && SecurityContextHolder.getContext().getAuthentication() == null) {
                System.out.println("Debug - JWT Filter - Token is valid");
                
                // Extract username from token
                String username = jwtUtils.getUsernameFromJwtToken(authToken);
                System.out.println("Debug - JWT Filter - Username from token: " + username);
                
                // Load user details
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                System.out.println("Debug - JWT Filter - User details loaded successfully");
                
                // Create authentication token
                UsernamePasswordAuthenticationToken authentication = 
                    new UsernamePasswordAuthenticationToken(
                        userDetails, 
                        null, 
                        userDetails.getAuthorities()
                    );
                
                // Set additional details
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                
                // Set authentication in SecurityContext
                SecurityContextHolder.getContext().setAuthentication(authentication);
                System.out.println("Debug - JWT Filter - Authentication set in SecurityContext");
            } else {
                if (authToken != null) {
                    System.out.println("Debug - JWT Filter - Token validation failed");
                } else {
                    System.out.println("Debug - JWT Filter - No token found in request");
                }
            }
        } catch (Exception e) {
            System.err.println("Debug - JWT Filter - Error during authentication: " + e.getMessage());
            e.printStackTrace();
        }
        
        // Continue with the filter chain
        filterChain.doFilter(request, response);
    }

    /**
     * Extract JWT token from the Authorization header
     * Expected format: "Bearer <token>"
     */
    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        
        System.out.println("Debug - JWT Filter - Authorization header: " + bearerToken);
        
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            String token = bearerToken.substring(7); // Remove "Bearer " prefix
            System.out.println("Debug - JWT Filter - Extracted token length: " + token.length());
            return token;
        }
        
        return null;
    }
}
