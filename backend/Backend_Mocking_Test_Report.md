# Backend Mocking Tests - Summary Report

## 5.1.2 Backend Mocking (2.5 điểm)

### Test Results: ✅ **20/20 PASSED**

---

## a) Mock AuthService với @MockBean (1 điểm) ✅

**File:** `AuthControllerMockingTest.java`  
**Tests:** 4/4 PASSED

| Test Case | Description | Status |
|-----------|-------------|--------|
| TC1 | Verify AuthService được mock thành công | ✅ PASSED |
| TC2 | Mock multiple scenarios - success và failure | ✅ PASSED |
| TC3 | Mock với different return values dựa trên input | ✅ PASSED |
| TC4 | Mock exception scenario | ✅ PASSED |

### Key Implementations:

```java
@MockBean
private AuthService authService;  // Tạo mock bean và inject vào Spring context

// TC1: Verify mock object
when(authService.authenticate(any(LoginRequest.class)))
    .thenReturn(successResponse);

// TC2: Mock multiple scenarios với argThat()
when(authService.authenticate(argThat(req -> 
    req != null && "testuser".equals(req.getUsername()))))
    .thenReturn(successResponse);

// TC4: Mock exception
when(authService.authenticate(any(LoginRequest.class)))
    .thenThrow(new RuntimeException("Database connection failed"));
```

**Điểm đạt được:** ✅ **1/1 điểm**

---

## b) Test controller với mocked service (1 điểm) ✅

**Tests:** 5/5 PASSED

| Test Case | Description | Status |
|-----------|-------------|--------|
| TC5 | Test login endpoint với mocked success response | ✅ PASSED |
| TC6 | Test login endpoint với mocked failure response | ✅ PASSED |
| TC7 | Test multiple calls với different mocked responses | ✅ PASSED |
| TC8 | Test controller behavior với null token trong response | ✅ PASSED |
| TC9 | Test controller với empty message | ✅ PASSED |

### Key Implementations:

```java
// TC5: Mocked success
@Test
void testLoginEndpointWithMockedSuccess() throws Exception {
    when(authService.authenticate(any(LoginRequest.class)))
        .thenReturn(successResponse);

    mockMvc.perform(post("/api/auth/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(validRequest)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.success", is(true)))
        .andExpect(jsonPath("$.token", is("jwt-token-12345")));
}

// TC7: Multiple calls với reset mock
reset(authService);
when(authService.authenticate(any(LoginRequest.class)))
    .thenReturn(failureResponse);
```

**Điểm đạt được:** ✅ **1/1 điểm**

---

## c) Verify mock interactions (0.5 điểm) ✅

**Tests:** 8/8 PASSED

| Test Case | Description | Status |
|-----------|-------------|--------|
| TC10 | Verify authenticate() được gọi đúng 1 lần | ✅ PASSED |
| TC11 | Verify authenticate() không được gọi khi request invalid | ✅ PASSED |
| TC12 | Verify argument được pass vào authenticate() | ✅ PASSED |
| TC13 | Verify multiple calls với verify(times()) | ✅ PASSED |
| TC14 | Verify authenticate() với specific argument matchers | ✅ PASSED |
| TC15 | Verify no more interactions after expected calls | ✅ PASSED |
| TC16 | Verify call order với InOrder | ✅ PASSED |
| TC17 | Verify với ArgumentCaptor - capture multiple calls | ✅ PASSED |

### Key Implementations:

```java
// TC10: Verify times(1)
verify(authService, times(1)).authenticate(any(LoginRequest.class));

// TC11: Verify never() called
verify(authService, never()).authenticate(any(LoginRequest.class));

// TC12: ArgumentCaptor
ArgumentCaptor<LoginRequest> captor = ArgumentCaptor.forClass(LoginRequest.class);
verify(authService).authenticate(captor.capture());
LoginRequest capturedRequest = captor.getValue();
assertThat(capturedRequest.getUsername()).isEqualTo("testuser");

// TC13: Verify multiple calls
verify(authService, times(3)).authenticate(any(LoginRequest.class));

// TC14: Verify với specific matcher
verify(authService).authenticate(argThat(request -> 
    request.getUsername().equals("testuser") && 
    request.getPassword().equals("password123")
));

// TC15: Verify no more interactions
verifyNoMoreInteractions(authService);

// TC17: Capture all calls
verify(authService, times(2)).authenticate(captor.capture());
var allValues = captor.getAllValues();
assertThat(allValues).hasSize(2);
```

**Điểm đạt được:** ✅ **0.5/0.5 điểm**

---

## Bonus: Advanced Mocking Techniques ✅

**Tests:** 3/3 PASSED

| Test Case | Description | Status |
|-----------|-------------|--------|
| TC18 | Mock với thenAnswer() để custom behavior | ✅ PASSED |
| TC19 | Mock với doReturn() thay vì when() | ✅ PASSED |
| TC20 | Reset mock giữa các test cases | ✅ PASSED |

### Advanced Techniques:

```java
// TC18: thenAnswer() cho custom logic
when(authService.authenticate(any(LoginRequest.class)))
    .thenAnswer(invocation -> {
        LoginRequest request = invocation.getArgument(0);
        if ("admin".equals(request.getUsername())) {
            return new LoginResponse(true, "Admin access", "admin-token");
        }
        return new LoginResponse(false, "User not admin");
    });

// TC19: doReturn() - useful khi when() có side effects
doReturn(successResponse)
    .when(authService)
    .authenticate(any(LoginRequest.class));

// TC20: Reset mock để clear stubbing và invocations
reset(authService);
```

---

## Test Execution Summary

```
╔════════════════════════════════════════════════════════════════╗
║            Backend Mocking Tests - Final Results               ║
╠════════════════════════════════════════════════════════════════╣
║  a) Mock AuthService với @MockBean:           4/4 tests PASSED ║
║  b) Test controller với mocked service:       5/5 tests PASSED ║
║  c) Verify mock interactions:                 8/8 tests PASSED ║
║  Bonus: Advanced Mocking Techniques:          3/3 tests PASSED ║
╠════════════════════════════════════════════════════════════════╣
║  Total Tests:                                20/20 tests PASSED ║
║  Build Status:                                    ✅ SUCCESS    ║
╚════════════════════════════════════════════════════════════════╝
```

### Test Execution Time: 6.208 seconds

---

## Key Technologies Used

- **@MockBean**: Spring Boot annotation để tạo mock bean trong application context
- **Mockito**: Framework chính cho mocking
  - `when().thenReturn()`: Stub method behavior
  - `verify()`: Verify method calls
  - `ArgumentCaptor`: Capture method arguments
  - `times()`, `never()`: Verify call count
  - `argThat()`: Custom argument matchers
  - `reset()`: Reset mock state
  - `verifyNoMoreInteractions()`: Ensure no unexpected calls
- **MockMvc**: Test Spring MVC controllers
- **@WebMvcTest**: Load only web layer for controller tests
- **@AutoConfigureMockMvc(addFilters = false)**: Disable security filters

---

## Coverage Achieved

✅ **a) Mock AuthService với @MockBean:** 1/1 điểm  
✅ **b) Test controller với mocked service:** 1/1 điểm  
✅ **c) Verify mock interactions:** 0.5/0.5 điểm

### **Total Score: 2.5/2.5 điểm** 🎉

---

## Test File Location

`src/test/java/com/flogin/controller/AuthControllerMockingTest.java`

**Total Lines:** ~600 lines  
**Test Methods:** 20 tests  
**Nested Classes:** 4 groups (@Nested)

---

## How to Run

```bash
# Run all mocking tests
mvn test -Dtest=AuthControllerMockingTest

# Run specific nested class
mvn test -Dtest=AuthControllerMockingTest$MockAuthServiceTests
mvn test -Dtest=AuthControllerMockingTest$TestControllerWithMockedService
mvn test -Dtest=AuthControllerMockingTest$VerifyMockInteractionsTests

# Run with coverage
mvn clean test jacoco:report -Dtest=AuthControllerMockingTest
```

---

## Best Practices Demonstrated

1. **AAA Pattern**: Arrange-Act-Assert in all tests
2. **Mock Isolation**: Each test uses `reset(authService)` in @BeforeEach
3. **Specific Assertions**: Use ArgumentCaptor và argThat() cho precise verification
4. **Clear Test Names**: @DisplayName với Vietnamese descriptions
5. **Organized Structure**: @Nested classes group related tests
6. **No Side Effects**: Tests don't affect each other
7. **Comprehensive Coverage**: Success, failure, edge cases, và exceptions

---

**Date:** 2025-11-30  
**Status:** ✅ **ALL TESTS PASSING**  
**Score:** **2.5/2.5 điểm**
