package com.flogin.dto;

public class AuthResult {
    private final boolean success;
    private final String username;

    public AuthResult(boolean success, String username) {
        this.success = success;
        this.username = username;
    }

    public boolean isSuccess() {
        return success;
    }

    public String getUsername() {
        return username;
    }
}