package com.w.tokenw.service;

import com.w.tokenw.dto.UserDto;
import com.w.tokenw.dto.UserDtoMapper;
import com.w.tokenw.exception.ApiRequestException;
import com.w.tokenw.model.User;
import com.w.tokenw.repository.TokenRepository;
import com.w.tokenw.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final UserDtoMapper userDtoMapper;
    private final TokenRepository tokenRepository;
    private final EmailService emailService;

    public UserService(UserRepository userRepository, UserDtoMapper userDtoMapper, TokenRepository tokenRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.userDtoMapper = userDtoMapper;
        this.tokenRepository = tokenRepository;
        this.emailService = emailService;
    }

    public List<UserDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(userDtoMapper::toDto)
                .collect(Collectors.toList());
    }

    public User updateUser(Integer id, UserDto updatedUserDto) {
        Optional<User> existingUserOptional = userRepository.findById(id);

        if (existingUserOptional.isPresent()) {
            User existingUser = existingUserOptional.get();
            userDtoMapper.updateUserFromDto(updatedUserDto, existingUser);
            return userRepository.save(existingUser);
        } else {
            throw new ApiRequestException("User not found with id: " + id);
        }
    }

    @Transactional
    public void deleteUser(Integer id) {
        if (userRepository.existsById(id)) {
            tokenRepository.deleteByUserId(id);
            userRepository.deleteById(id);
        } else {
            throw new ApiRequestException("User not found with id: " + id);
        }
    }

    public String verifyUser(String verificationCode) {
        Optional<User> optionalUser = userRepository.findByVerificationCode(verificationCode);

        if (optionalUser.isEmpty()) {
            return "Doğrulama kodu yanlış veya kullanıcı bulunamadı.";
        }

        User user = optionalUser.get();

        if (user.isEnabled()) {
            return "Kullanıcı zaten doğrulanmış.";
        }

        user.setEnabled(true);
        user.setVerificationCode(null);
        userRepository.save(user);

        return "E-posta başarıyla doğrulandı. Artık giriş yapabilirsiniz.";
    }

}
