package com.flogin.service;

import org.springframework.stereotype.Component;

@Component
public class PlainPasswordMatcher implements PasswordMatcher {
    @Override
    public boolean matches(String raw, String stored) {
        return raw != null && raw.equals(stored);
    }
}
