package com.w.tokenw.service;

import com.w.tokenw.exception.ApiRequestException;
import com.w.tokenw.model.AuthenticationResponse;
import com.w.tokenw.model.Role;
import com.w.tokenw.model.Token;
import com.w.tokenw.model.User;
import com.w.tokenw.repository.TokenRepository;
import com.w.tokenw.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class AuthenticationService {
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final TokenRepository tokenRepository;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    public AuthenticationService(UserRepository repository,
                                 PasswordEncoder passwordEncoder,
                                 JwtService jwtService,
                                 TokenRepository tokenRepository,
                                 AuthenticationManager authenticationManager, EmailService emailService) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.tokenRepository = tokenRepository;
        this.authenticationManager = authenticationManager;
        this.emailService = emailService;
    }

    public AuthenticationResponse register(User request) {
        if (repository.findByUsername(request.getUsername()).isPresent()) {
            throw new ApiRequestException("User already exists");
        }

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setRole(request.getRole());

        user.setVerificationCode(UUID.randomUUID().toString());
        user.setEnabled(false);

        user = repository.save(user);

        emailService.sendVerificationEmail(user);

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        saveUserToken(accessToken, refreshToken, user);

        return new AuthenticationResponse(accessToken, refreshToken);
    }


    public AuthenticationResponse authenticateUser(User request) {
        User user = repository.findByUsername(request.getUsername())
                .orElseThrow(() -> new ApiRequestException("Username not found"));

        if (user.getRole() != Role.USER) {
            throw new ApiRequestException("Unauthorized access");
        }

        if (!user.isEnabled()) {
            throw new ApiRequestException("Email not verified");
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );

            String accessToken = jwtService.generateAccessToken(user);
            String refreshToken = jwtService.generateRefreshToken(user);

            revokeAllTokenByUser(user);

            saveUserToken(accessToken, refreshToken, user);

            return new AuthenticationResponse(accessToken, refreshToken);
        } catch (BadCredentialsException e) {
            throw new ApiRequestException("Incorrect password");
        }
    }


    public AuthenticationResponse authenticateAdmin(User request) {
        User user = repository.findByUsername(request.getUsername())
                .orElseThrow(() -> new ApiRequestException("Username not found"));

        if (user.getRole() == Role.USER) {
            throw new ApiRequestException("Unauthorized access");
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );

            String accessToken = jwtService.generateAccessToken(user);
            String refreshToken = jwtService.generateRefreshToken(user);

            revokeAllTokenByUser(user);
            saveUserToken(accessToken, refreshToken, user);

            return new AuthenticationResponse(accessToken, refreshToken);
        } catch (BadCredentialsException e) {
            throw new ApiRequestException("Incorrect password");
        }
    }




    public ResponseEntity<AuthenticationResponse> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new ApiRequestException("Refresh token is missing or invalid");
        }

        String refreshToken = authHeader.substring(7);

        String username = jwtService.extractUsername(refreshToken);

        User user = repository.findByUsername(username)
                .orElseThrow(() -> new ApiRequestException("User not found"));

        if (!jwtService.isValidRefreshToken(refreshToken, user)) {
            throw new ApiRequestException("Invalid refresh token");
        }

        String newAccessToken = jwtService.generateAccessToken(user);
        String newRefreshToken = jwtService.generateRefreshToken(user);

        revokeAllTokenByUser(user);
        saveUserToken(newAccessToken, newRefreshToken, user);

        return ResponseEntity.ok(new AuthenticationResponse(newAccessToken, newRefreshToken));
    }

    private void revokeAllTokenByUser(User user) {
        List<Token> validTokens = tokenRepository.findAllAccessTokensByUser(user.getId());
        if (validTokens.isEmpty()) {
            return;
        }

        validTokens.forEach(t -> t.setLoggedOut(true));

        tokenRepository.saveAll(validTokens);
    }

    private void saveUserToken(String accessToken, String refreshToken, User user) {
        Token token = new Token();
        token.setAccessToken(accessToken);
        token.setRefreshToken(refreshToken);
        token.setLoggedOut(false);
        token.setUser(user);
        tokenRepository.save(token);
    }
}