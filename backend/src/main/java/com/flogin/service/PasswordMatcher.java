package com.flogin.service;

public interface PasswordMatcher {
    boolean matches(String raw, String stored);
}
