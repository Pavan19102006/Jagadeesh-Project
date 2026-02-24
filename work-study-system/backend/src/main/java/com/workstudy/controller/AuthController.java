package com.workstudy.controller;

import com.workstudy.dto.LoginRequest;
import com.workstudy.dto.LoginResponse;
import com.workstudy.dto.RegisterRequest;
import com.workstudy.entity.User;
import com.workstudy.security.JwtUtil;
import com.workstudy.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtUtil jwtUtil;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        User user = userService.findByUsername(request.getUsername());
        String token = jwtUtil.generateToken(user);
        
        return ResponseEntity.ok(new LoginResponse(token, user));
    }
    
    @PostMapping("/register/student")
    public ResponseEntity<?> registerStudent(@Valid @RequestBody RegisterRequest request) {
        User user = userService.createStudent(request);
        String token = jwtUtil.generateToken(user);
        return ResponseEntity.ok(new LoginResponse(token, user));
    }
    
    @PostMapping("/register/admin")
    public ResponseEntity<?> registerAdmin(@Valid @RequestBody RegisterRequest request) {
        User user = userService.createAdmin(request);
        String token = jwtUtil.generateToken(user);
        return ResponseEntity.ok(new LoginResponse(token, user));
    }
    
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        User user = userService.findByUsername(authentication.getName());
        return ResponseEntity.ok(user);
    }
}
