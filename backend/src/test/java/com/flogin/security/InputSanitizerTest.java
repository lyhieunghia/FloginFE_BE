package com.flogin.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class InputSanitizerTest {

    private InputSanitizer sanitizer;

    @BeforeEach
    void setUp() {
        sanitizer = new InputSanitizer();
    }

    @Test
    void testSanitizeHtml() {
        String input = "<div>Hello & welcome</div>";
        String result = sanitizer.sanitizeHtml(input);
        assertEquals("&lt;div&gt;Hello &amp; welcome&lt;/div&gt;", result);
    }

    @Test
    void testSanitizeJavaScript() {
        String input = "alert('XSS')";
        String result = sanitizer.sanitizeJavaScript(input);
        // OWASP encoder uses \x27 for single quotes
        assertEquals("alert(\\x27XSS\\x27)", result);
    }

    @Test
    void testSanitizeSql() {
        String input = "SELECT * FROM users; DROP TABLE users;";
        String result = sanitizer.sanitizeSql(input);
        assertFalse(result.toLowerCase().contains("select"));
        assertFalse(result.toLowerCase().contains("drop"));
        assertFalse(result.contains(";"));
    }

    @Test
    void testSanitizeUsername() {
        String input = "user<>!@#_123";
        String result = sanitizer.sanitizeUsername(input);
        assertEquals("user_123", result);
    }

    @Test
    void testRemoveXssVectors() {
        String input = "<script>alert('XSS')</script><iframe src='evil'></iframe>javascript:alert(1)";
        String result = sanitizer.removeXssVectors(input);
        assertFalse(result.contains("<script>"));
        assertFalse(result.contains("<iframe>"));
        assertFalse(result.contains("javascript:"));
    }

    @Test
    void testNullInputs() {
        assertNull(sanitizer.sanitizeHtml(null));
        assertNull(sanitizer.sanitizeJavaScript(null));
        assertNull(sanitizer.sanitizeSql(null));
        assertNull(sanitizer.sanitizeUsername(null));
        assertNull(sanitizer.removeXssVectors(null));
    }
}
