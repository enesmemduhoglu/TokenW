package com.w.tokenw.controller;

import com.w.tokenw.exception.ApiRequestException;
import com.w.tokenw.model.AuthenticationResponse;
import com.w.tokenw.model.User;
import com.w.tokenw.service.AuthenticationService;
import com.w.tokenw.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
public class AuthenticationController {


    private final AuthenticationService authService;
    private final UserService userService;

    public AuthenticationController(AuthenticationService authService, UserService userService) {
        this.authService = authService;
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody User request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(
            @RequestBody User request
    ) {
        return ResponseEntity.ok(authService.authenticateUser(request));
    }

    @PostMapping("/admin")
    public ResponseEntity<AuthenticationResponse> admin(
            @RequestBody User request
    ) {
        return ResponseEntity.ok(authService.authenticateAdmin(request));
    }

    @PostMapping("/refresh_token")
    public ResponseEntity<AuthenticationResponse> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        return authService.refreshToken(request, response);
    }

    @GetMapping("/verify")
    public ResponseEntity<String> verifyUser(@RequestParam("code") String code) {
        String verificationResult = userService.verifyUser(code);
        if ("E-posta başarıyla doğrulandı. Artık giriş yapabilirsiniz.".equals(verificationResult)) {
            return ResponseEntity.ok(verificationResult);
        } else {
            return ResponseEntity.badRequest().body(verificationResult);
        }
    }

}