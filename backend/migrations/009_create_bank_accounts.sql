-- Migration: Create bank_accounts table
-- Description: Store encrypted bank account information for users
-- Created: 2025-11-10

-- UP
CREATE TABLE IF NOT EXISTS bank_accounts (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  account_number TEXT NOT NULL COMMENT 'Encrypted account number',
  ifsc_code TEXT NOT NULL COMMENT 'Encrypted IFSC code',
  account_holder_name TEXT NOT NULL COMMENT 'Encrypted account holder name',
  bank_name TEXT COMMENT 'Encrypted bank name',
  branch_name TEXT COMMENT 'Encrypted branch name',
  is_verified BOOLEAN DEFAULT FALSE COMMENT 'Whether account is verified',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_verified (is_verified)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Encrypted bank account information';

-- DOWN
DROP TABLE IF EXISTS bank_accounts;
