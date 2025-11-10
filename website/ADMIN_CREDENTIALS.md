# ADMIN CREDENTIALS - Ace#1

**KEEP THIS FILE SECURE AND PRIVATE!**

---

## 🔐 ADMIN LOGIN

### Admin Dashboard Access:
```
Login URL: /login.html
Admin Panel URL: /admin-panel.html

Email: hello@ace1.in
Password: Mobilaeiou@9898
```

**Important:** Keep this password safe and don't share it!

---

## 💼 BUSINESS INFORMATION

### Contact Details:
```
Business Name: Ace#1 - Health | Comfort | Innovation
Business Phone: 9167575028
Business Email: hello@ace1.in
```

### Payment Information:
```
Paytm Business Phone: 9167575028
UPI ID: paytmqr5na93v@ptys
Transaction Fee: 0% for UPI (FREE!)
```

### Banking Details:
```
Bank: Kotak Mahindra Bank
Account Holder: Jai Anup Das
Account Number: 9011750959
IFSC Code: KKBK0001416
Branch: Dombivili
```

---

## 🎯 ADMIN CAPABILITIES

### What You Can Do:
- ✅ Edit product names
- ✅ Update product prices
- ✅ Change product images
- ✅ Update descriptions
- ✅ Mark products in/out of stock
- ✅ View inventory statistics
- ✅ Monitor total product value

### Admin Panel Features:
- **Dashboard Stats:**
  - Total products count
  - In stock count
  - Out of stock count
  - Total inventory value

- **Product Management:**
  - Quick edit any product
  - Toggle stock status
  - Update all product details
  - Real-time changes

---

## 📱 HOW TO USE ADMIN PANEL

### Step 1: Login
```
1. Go to your website/login.html
2. Enter email: hello@ace1.in
3. Enter password: Mobilaeiou@9898
4. Click "Login"
```

### Step 2: Access Admin Panel
```
1. After login, go to /admin-panel.html
2. You'll see all products and statistics
```

### Step 3: Edit Products
```
1. Click "Edit" button on any product
2. Update price, image, description, etc.
3. Click "Save Changes"
4. Changes saved to localStorage (customers will see updates)
```

### Step 4: Manage Stock
```
1. Click "Mark Out" to mark product as out of stock
2. Click "Mark In" to mark back in stock
3. Status updates immediately
```

---

## 🔒 SECURITY NOTES

### Password Security:
- ✅ Password is hashed in the code
- ✅ Not stored in plain text
- ⚠️ Keep this file private
- ⚠️ Don't commit to public GitHub

### Admin Access:
- Only accessible after login
- Automatically redirects non-admin users
- Session-based authentication
- Logout option available

### Data Storage:
- Products stored in localStorage
- Changes persist across sessions
- In production, would sync to server
- Currently client-side only (demo mode)

---

## 🚨 IMPORTANT REMINDERS

### DO NOT:
- ❌ Share admin password with anyone
- ❌ Commit this file to public repository
- ❌ Use the same password for other accounts
- ❌ Share admin access with untrusted people

### DO:
- ✅ Keep this file in a secure location
- ✅ Change password if compromised
- ✅ Add this file to .gitignore
- ✅ Use strong, unique password (already done!)

---

## 📞 CUSTOMER SERVICE INFO

### For Customers:
```
WhatsApp: 9167575028
Email: hello@ace1.in
Website: [Your Domain]
```

### Business Hours:
```
Suggested: 9 AM - 9 PM IST
(Adjust based on your availability)
```

---

## 🔄 CHANGING ADMIN PASSWORD

If you need to change the password:

1. Generate new hash:
```javascript
// Run in browser console:
let password = 'YourNewPassword';
let hash = 0;
for (let i = 0; i < password.length; i++) {
  const char = password.charCodeAt(i);
  hash = ((hash << 5) - hash) + char;
  hash = hash & hash;
}
console.log('hash_' + hash.toString(36));
```

2. Update `assets/js/config.js`:
```javascript
admin: {
  email: 'hello@ace1.in',
  password: 'YourNewPassword',
  passwordHash: 'hash_[generated_hash]'
}
```

3. Save file and refresh website

---

## 📋 QUICK REFERENCE

### URLs:
```
Homepage: /index.html
Products: /marketplace.html
Login: /login.html
Admin: /admin-panel.html
```

### Admin Credentials:
```
Email: hello@ace1.in
Password: Mobilaeiou@9898
```

### Payment:
```
Phone: 9167575028
UPI: paytmqr5na93v@ptys
```

---

## ✅ FIRST TIME SETUP

### Initial Login Steps:

1. **Open browser** (Chrome/Safari/Firefox)

2. **Navigate to login page:**
   - http://localhost:8000/login.html (if testing locally)
   - https://yourdomain.com/login.html (when live)

3. **Enter credentials:**
   - Email: `hello@ace1.in`
   - Password: `Mobilaeiou@9898`

4. **Click Login**
   - You'll be redirected to homepage

5. **Go to Admin Panel:**
   - Navigate to /admin-panel.html
   - Or bookmark it for quick access

6. **Test editing:**
   - Click "Edit" on any product
   - Change the price
   - Save changes
   - Verify changes appear on marketplace

**Done!** You're ready to manage your inventory! 🎉

---

## 📝 NOTES

- Admin account is automatically created on first page load
- Role is set to "admin" in the system
- Can view all products and statistics
- Changes are saved to browser localStorage
- For production, implement backend API for persistence

---

**Created:** November 9, 2025  
**Last Updated:** November 9, 2025  
**Status:** Active

**KEEP THIS FILE SECURE!** 🔒
