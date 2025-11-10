# Payment Integration Setup

## Bank Account Details Added

Your Kotak Mahindra Bank account details have been integrated into the checkout system:

- **Bank Name:** Kotak Mahindra Bank
- **Account Holder:** Jai Anup Das
- **Account Number:** 9011750959
- **Account Type:** SAVINGS
- **IFSC Code:** KKBK0001416
- **Branch:** DOMBIVILI BRANCH
- **MICR Code:** 400485137

## Payment Methods Available

The checkout now supports **4 payment methods**:

### 1. 💳 Credit/Debit Card
- Processed through Stripe
- Supports Visa, Mastercard, RuPay
- Secure and encrypted

### 2. 📱 UPI / Wallet
- **UPI ID:** jaidas1994-4@okic
- **Phone Number:** 9167575028
- Supports PhonePe, Google Pay, Paytm
- Customers can copy UPI ID directly

### 3. 🏦 Bank Transfer
- Displays full bank account details
- Supports NEFT/RTGS/IMPS
- Copy account number with one click
- Instructions: "Please transfer the order amount to the above account and share the transaction reference number with us at hello@ace1.in"

### 4. 💵 Cash on Delivery (COD)
- Pay in cash on delivery
- Warning about keeping exact change ready

## User Wallet Feature

All users now have a built-in wallet with the following features:

### Wallet Structure
```javascript
wallet: {
  balance: 0,
  transactions: []
}
```

### Wallet Methods in auth.js

1. **getWalletBalance()** - Get current wallet balance
2. **addToWallet(amount, description)** - Add funds to wallet
3. **deductFromWallet(amount, description)** - Deduct funds (with balance check)
4. **getWalletTransactions()** - Get transaction history

### Transaction Structure
```javascript
{
  id: 'TXN-timestamp',
  type: 'credit' | 'debit',
  amount: number,
  description: string,
  date: ISO string,
  balanceAfter: number
}
```

## Files Modified

### 1. `/assets/js/config.js`
- Added `bankAccount` configuration
- Added `upi` configuration
- Added `razorpay` placeholder (for future integration)
- Added wallet to admin user initialization

### 2. `/checkout.html`
- Added 4 payment method options
- Created payment details sections for each method
- Added bank account details display
- Added UPI payment details display
- Added COD notice
- Added copy-to-clipboard functionality
- Updated checkout handler to support all payment methods
- Order status varies based on payment method:
  - **Card:** "Processing"
  - **UPI/Bank:** "Awaiting Payment Confirmation"
  - **COD:** "Confirmed - Awaiting Delivery"

### 3. `/assets/js/auth.js`
- Added wallet to new user registration
- Added `getWalletBalance()` method
- Added `addToWallet()` method
- Added `deductFromWallet()` method
- Added `getWalletTransactions()` method
- Backwards compatible (initializes wallet for old users)

## How to Use

### For Bank Transfer Payments
1. Customer selects "Bank Transfer" at checkout
2. Bank details are displayed with copy buttons
3. Customer transfers money to your account
4. Customer emails transaction reference to hello@ace1.in
5. Admin verifies and updates order status

### For UPI Payments
1. Customer selects "UPI / Wallet" at checkout
2. UPI ID is displayed with copy button
3. Customer pays via their UPI app
4. Customer emails payment screenshot to hello@ace1.in
5. Admin verifies and updates order status

### For Wallet Usage (Future Implementation)
```javascript
// Add money to user wallet
window.auth.addToWallet(1000, 'Added via UPI');

// Deduct money for purchase
const result = window.auth.deductFromWallet(500, 'Order #ORD-12345');
if (result.success) {
  console.log('New balance:', result.balance);
} else {
  console.log('Error:', result.message);
}

// Get wallet balance
const balance = window.auth.getWalletBalance();

// Get transaction history
const transactions = window.auth.getWalletTransactions();
```

## Next Steps

### Recommended Enhancements

1. **Razorpay Integration**
   - Sign up at https://razorpay.com
   - Get API keys
   - Enable in config.js
   - Razorpay supports UPI, Cards, NetBanking, Wallets automatically

2. **Payment Verification System**
   - Create admin dashboard to verify bank/UPI payments
   - Auto-email notifications when payment received
   - Payment reference number tracking

3. **Wallet Recharge Page**
   - Create dedicated page for wallet top-up
   - Integrate with UPI/Card payment
   - Show transaction history

4. **Order Management**
   - Admin panel to update order status
   - Email notifications for payment confirmation
   - SMS notifications via services like Twilio

## Testing

To test the new payment options:

1. Start your local server:
   ```bash
   cd /Users/jai_das13/Development/website-project/website
   python3 -m http.server 8000
   ```

2. Visit: http://localhost:8000/shop.html

3. Add products to cart and proceed to checkout

4. Try each payment method to see the different displays

5. Check localStorage to verify wallet structure in user profiles

## Security Notes

⚠️ **Important:**
- Bank details are now visible to customers at checkout
- Never share your card PIN or CVV
- Verify all bank transfer payments before shipping
- Consider using Razorpay for automated payment processing
- The wallet system stores data in localStorage (client-side)
- For production, implement server-side wallet management

## Support

For payment-related queries:
- Email: hello@ace1.in
- Phone: 9167575028
