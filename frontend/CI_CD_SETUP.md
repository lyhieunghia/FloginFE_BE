# CI/CD Setup Guide

## Running Tests in CI Environment

### Prerequisites
Tests are configured to use mocked APIs and should NOT require a running backend. All API calls are mocked using Jest.

### Environment Variables
Set the following environment variable in your CI/CD pipeline if you want to override the default API URL:

```yaml
- name: Set API URL
  run: echo "REACT_APP_API_URL=http://localhost:8080" >> $GITHUB_ENV
```

### Running Tests
```bash
cd frontend
npm install
npm test -- --watchAll=false --passWithNoTests
```

### Test Configuration
- All tests use Jest mocking for API calls
- No real network requests are made during tests
- Backend does NOT need to be running for tests

### Error Handling
All error responses are logged with detailed information:
- HTTP status codes
- Response data/messages
- Full error objects for debugging

### Mock Setup
Tests mock the following services:
- `productService` - All CRUD operations for products
- `authService` - Login and authentication operations

### Troubleshooting

#### "Network Error" in tests
- Verify that `jest.mock()` is called at the top of test files
- Check that all service methods are properly mocked in `beforeEach()`
- Ensure axios is mocked in `src/__mocks__/axios.js`

#### "Cannot read properties of undefined"
- Verify mock functions are initialized: `serviceName.method = jest.fn()`
- Clear mocks properly in `beforeEach()` using `jest.clearAllMocks()`

#### 400/500 errors
- These should only appear in tests that explicitly mock error responses
- Check test data includes all required fields: `name`, `price`, `quantity`, `category`

### Test Coverage
Current status: **155/165 tests passing (94%)**
- ✅ All integration tests passing
- ✅ All mocking tests passing
- ⚠️ Some validation tests need review (not network-related)
