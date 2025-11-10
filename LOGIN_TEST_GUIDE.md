# Login & Lockout Testing Guide

## Quick Test Instructions

### Option 1: Use the Test Page (Recommended)

1. **Open the test page:**
   ```
   http://localhost/test-login.html
   ```
   (Or navigate to wherever your website is served)

2. **Follow the on-screen steps:**
   - Step 1: Create a test user with email `hello@ace1.in`
   - Step 2: Test login with correct credentials
   - Step 3: Click "Trigger Lockout" to test 5 failed attempts
   - Step 4: Verify the account is locked

### Option 2: Manual Testing via login.html

1. **Register a user first** (if not already created):
   - Go to `/register.html`
   - Register with email: `hello@ace1.in`
   - Use any password (remember it!)

2. **Test successful login:**
   - Go to `/login.html`
   - Enter email: `hello@ace1.in`
   - Enter correct password
   - Should redirect to marketplace

3. **Test lockout mechanism:**
   - Go to `/login.html`
   - Enter email: `hello@ace1.in`
   - Enter **wrong password** 5 times
   - On the 5th attempt, you should see: "Account locked due to too many failed attempts. Try again in 15 minutes."
   - Even with the correct password, login should be blocked

4. **Clear lockout (for testing):**
   - Open DevTools (F12)
   - Go to Console
   - Run: `window.configManager.clearFailedLogins('hello@ace1.in')`
   - Now you can log in again

## Lockout Configuration

Current settings in `env-config.js`:

```javascript
security: {
  maxLoginAttempts: 5,       // Lock after 5 failed attempts
  lockoutDuration: 15 * 60 * 1000  // Lock for 15 minutes
}
```

## How It Works

### 1. Failed Login Tracking
- Each failed login attempt is recorded in localStorage
- Key format: `lockout_{email}`
- Stores: `{ attempts: number, lockedUntil: timestamp }`

### 2. Lockout Check
- Before each login attempt, `auth.login()` checks if user is locked out
- If locked, returns error message immediately
- No password checking occurs when locked

### 3. Lockout Clear
- After 15 minutes, lockout automatically expires
- Successful login clears all failed attempts
- Manual clear via `configManager.clearFailedLogins(email)`

## Testing Checklist

### ✅ Login Tests
- [ ] Can create user with `hello@ace1.in`
- [ ] Can login with correct password
- [ ] Login redirects to marketplace
- [ ] Invalid email shows error
- [ ] Wrong password shows error
- [ ] User session persists on page reload

### ✅ Lockout Tests
- [ ] 1st wrong password: "Invalid email or password"
- [ ] 2nd wrong password: "Invalid email or password"
- [ ] 3rd wrong password: "Invalid email or password"
- [ ] 4th wrong password: "Invalid email or password"
- [ ] 5th wrong password: "Account locked..."
- [ ] 6th attempt (even correct password): Still locked
- [ ] After 15 minutes: Can login again
- [ ] Successful login: Clears failed attempts

### ✅ Security Tests
- [ ] User data is encrypted in localStorage
- [ ] Session data is encrypted in localStorage
- [ ] Password is hashed (SHA-256) before storage
- [ ] Lockout data is stored in localStorage
- [ ] Console shows crypto utilities loaded

## DevTools Verification

### Check localStorage
1. Press F12
2. Go to Application → localStorage
3. Look for these keys:

```
ace1_users          - Should be encrypted (not readable JSON)
ace1_session        - Should be encrypted (not readable JSON)
lockout_hello@ace1.in - Plain JSON with attempts count
ace1_secure_storage_key - Encryption key
```

### Check Console
Should see these messages on page load:
```
✅ Crypto utilities loaded
✅ Environment configuration loaded
```

### Check Lockout Data
```javascript
// Check if user is locked out
window.configManager.isLockedOut('hello@ace1.in')

// View lockout data
JSON.parse(localStorage.getItem('lockout_hello@ace1.in'))

// Clear lockout
window.configManager.clearFailedLogins('hello@ace1.in')
```

## Common Issues

### Issue: "Invalid email or password" on correct password
**Solution:** User might be locked out. Clear lockout data:
```javascript
window.configManager.clearFailedLogins('hello@ace1.in')
```

### Issue: User doesn't exist
**Solution:** Register the user first at `/register.html` or use test page

### Issue: Encryption errors
**Solution:** Make sure scripts load in correct order:
1. crypto-utils.js
2. env-config.js
3. auth.js

### Issue: Lockout doesn't trigger
**Solution:** Check that `window.configManager` is loaded and initialized

## Files Involved

- `/login.html` - Login page
- `/register.html` - Registration page
- `/test-login.html` - Test utility page
- `/assets/js/auth.js` - Authentication logic
- `/assets/js/env-config.js` - Configuration & lockout logic
- `/assets/js/crypto-utils.js` - Encryption utilities

## Support

For issues or questions, check:
1. Browser console for errors
2. localStorage for data state
3. Network tab for script loading issues
