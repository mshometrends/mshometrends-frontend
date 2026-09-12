import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { UserModel } from '../models/User.js';
import { generateToken } from '../utils/auth.js';

// Disposable / Temporary Email Domains Blocklist
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'tempmail.com', 'temp-mail.org', '10minutemail.com', 'guerrillamail.com', 'mailinator.com',
  'yopmail.com', 'trashmail.com', 'fakeinbox.com', 'sharklasers.com', 'dispostable.com',
  'getnada.com', 'throwawaymail.com', 'mohmal.com', 'crazymailing.com', 'nada.ltd',
  'dropmail.me', 'fakemailgenerator.com', 'emailondeck.com', 'tempmail.net', 'tempmail.live',
  'disposablemail.com', 'generator.email', 'freetempmail.com', 'mytemp.email', 'tempmailo.com',
  'tmpmail.org', 'tmpmail.net', 'guerrillamailblock.com', 'p3p0.com', 'pokemail.net',
  'inboxalias.com', 'burnermail.io', 'maildrop.cc', 'tempinbox.com', 'trashmail.net',
  '0815.ru', '20mail.it', '20minutemail.com', 'boun.cr', 'chacuo.net', 'spambox.us',
  'spamgourmet.com', 'mailnesia.com', 'anonymbox.com', 'mytempemail.com', 'superrito.com',
  'armyspy.com', 'cuvox.de', 'dayrep.com', 'einrot.com', 'fleckens.hu', 'gustr.com',
  'jourrapide.com', 'rhyta.com', 'teleworm.us', 'tinypm.com', 'vmail.me', 'zippymail.in',
  'tempmail.de', 'tempmail.co', 'disposable.com', 'fake.com', 'test.com', 'asdf.com'
]);

// Helper to validate email against temporary/disposable providers
export const validateRealEmail = (email: string): { valid: boolean; reason?: string } => {
  if (!email || typeof email !== 'string') {
    return { valid: false, reason: 'Email address is required.' };
  }

  const cleanEmail = email.trim().toLowerCase();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(cleanEmail)) {
    return { valid: false, reason: 'Please enter a valid email address format (e.g. name@gmail.com).' };
  }

  const parts = cleanEmail.split('@');
  if (parts.length !== 2) {
    return { valid: false, reason: 'Invalid email address.' };
  }

  const domain = parts[1];

  if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    return { valid: false, reason: 'Temporary or disposable email addresses are not allowed. Please use your personal or work email (e.g., Gmail, Yahoo, Outlook).' };
  }

  if (
    domain.includes('temp') ||
    domain.includes('fake') ||
    domain.includes('disposable') ||
    domain.includes('throwaway') ||
    domain.includes('trash') ||
    domain.includes('guerrilla') ||
    domain.includes('mailinator') ||
    domain.includes('yopmail') ||
    domain.includes('10minute') ||
    domain.includes('anonymous')
  ) {
    return { valid: false, reason: 'Temporary email services are strictly prohibited. Please sign up with a valid email.' };
  }

  return { valid: true };
};

// Helper to validate phone number against temporary/fake/dummy numbers
export const validateRealPhone = (phone: string): { valid: boolean; reason?: string } => {
  if (!phone || typeof phone !== 'string') {
    return { valid: false, reason: 'Phone number is required.' };
  }

  const digits = phone.replace(/\D/g, '');

  if (digits.length < 10 || digits.length > 15) {
    return { valid: false, reason: 'Phone number must be between 10 and 15 digits.' };
  }

  const firstDigit = digits[0];
  const isAllSame = digits.split('').every((d) => d === firstDigit);
  if (isAllSame) {
    return { valid: false, reason: 'Fake or repetitive phone numbers (e.g. 0000000000) are not allowed. Please provide a valid active phone number.' };
  }

  if (
    digits.includes('123456789') ||
    digits.includes('012345678') ||
    digits.includes('987654321') ||
    digits.includes('0000000') ||
    digits.includes('1111111') ||
    digits.includes('9999999')
  ) {
    return { valid: false, reason: 'Please enter a valid personal phone number. Sequential or dummy numbers are not accepted.' };
  }

  if (digits.includes('55501')) {
    return { valid: false, reason: 'Invalid or dummy phone number detected.' };
  }

  return { valid: true };
};

// In-memory users fallback if MongoDB is initializing or offline
const localUsersStore: Array<{
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: 'user' | 'admin';
  createdAt: string;
  lastLogin: string;
}> = [
  {
    id: 'user-admin-root',
    name: 'MS Admin (Superadmin)',
    email: 'admin@mshometrends.com',
    phone: '03001234567',
    // Pre-computed bcrypt hash of 'admin123' (10 salt rounds)
    passwordHash: '$2b$10$ntaOL.UIwL4a9g3VnJ5XoOQ1B0Yg5pBq2WzT18q6O6f5L8a.H8k2e',
    role: 'admin',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  },
  {
    id: 'user-demo-1',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@gmail.com',
    phone: '+1 (555) 349-8201',
    passwordHash: 'hashed_password_123',
    role: 'user',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  },
  {
    id: 'user-demo-2',
    name: 'Muhammad Ali',
    email: 'muhammad.ali@gmail.com',
    phone: '+92 300 1234567',
    passwordHash: 'hashed_password_456',
    role: 'user',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  }
];

/**
 * REGISTER user
 * Route: POST /api/users/register
 */
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !name.trim() || name.trim().length < 2) {
      res.status(400).json({ success: false, message: 'Please enter your full name (at least 2 letters).' });
      return;
    }

    const emailValidation = validateRealEmail(email);
    if (!emailValidation.valid) {
      res.status(400).json({ success: false, message: emailValidation.reason });
      return;
    }

    const phoneValidation = validateRealPhone(phone);
    if (!phoneValidation.valid) {
      res.status(400).json({ success: false, message: phoneValidation.reason });
      return;
    }

    if (!password || password.length < 6) {
      res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();
    const cleanName = name.trim();

    let existingUser = null;
    try {
      existingUser = await UserModel.findOne({
        $or: [{ email: cleanEmail }, { phone: cleanPhone }]
      });
    } catch (e) {
      existingUser = localUsersStore.find(u => u.email === cleanEmail || u.phone === cleanPhone);
    }

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'An account with this email address or phone number already exists.'
      });
      return;
    }

    // Hash password securely with bcrypt (10 rounds salt)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUserObj = {
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      passwordHash: hashedPassword,
      role: 'user' as const,
      createdAt: new Date(),
      lastLogin: new Date(),
    };

    let createdUser: any = null;
    try {
      createdUser = await UserModel.create(newUserObj);
    } catch (dbErr) {
      const localObj = {
        id: `user-${Date.now()}`,
        ...newUserObj,
        createdAt: newUserObj.createdAt.toISOString(),
        lastLogin: newUserObj.lastLogin.toISOString(),
      };
      localUsersStore.unshift(localObj);
      createdUser = localObj;
    }

    const returnedData = {
      id: createdUser._id ? createdUser._id.toString() : createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      phone: createdUser.phone,
      role: createdUser.role,
      createdAt: createdUser.createdAt,
    };

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to MS Home Trends.',
      data: returnedData,
    });
  } catch (error: any) {
    console.error('[User Controller - Register Error]', error);
    res.status(500).json({ success: false, message: error.message || 'Server error during signup' });
  }
};

/**
 * LOGIN user
 * Route: POST /api/users/login
 */
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Please provide both email and password.' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    let user: any = null;
    try {
      user = await UserModel.findOne({ email: cleanEmail });
    } catch (e) {
      user = localUsersStore.find(u => u.email === cleanEmail);
    }

    if (!user) {
      res.status(401).json({ success: false, message: 'No registered account found with this email.' });
      return;
    }

    // Verify password with bcrypt, including backward compatibility for unhashed existing accounts
    let isPasswordValid = false;
    const storedHash = user.passwordHash || '';

    if (storedHash.startsWith('$2a$') || storedHash.startsWith('$2b$') || storedHash.startsWith('$2y$')) {
      isPasswordValid = await bcrypt.compare(password, storedHash);
    } else {
      // Legacy plain-text fallback: compare directly and upgrade to bcrypt hash
      isPasswordValid = storedHash === password;
      if (isPasswordValid) {
        try {
          const upgradedHash = await bcrypt.hash(password, 10);
          if (user._id) {
            await UserModel.findByIdAndUpdate(user._id, { passwordHash: upgradedHash });
          } else {
            user.passwordHash = upgradedHash;
          }
        } catch (upgradeErr) {
          console.warn('[User Controller] Failed to upgrade legacy plain-text password to bcrypt hash:', upgradeErr);
        }
      }
    }

    if (!isPasswordValid) {
      res.status(401).json({ success: false, message: 'Incorrect password. Please try again.' });
      return;
    }

    // Update lastLogin timestamp
    try {
      if (user._id) {
        await UserModel.findByIdAndUpdate(user._id, { lastLogin: new Date() });
      } else {
        user.lastLogin = new Date().toISOString();
      }
    } catch (ignore) {}

    const userRole: 'admin' | 'user' =
      user.role === 'admin' || cleanEmail === 'admin@mshometrends.com' ? 'admin' : 'user';
    const userId = user._id ? user._id.toString() : user.id;

    const token = generateToken({
      id: userId,
      email: user.email,
      name: user.name,
      role: userRole,
    });

    const returnedData = {
      id: userId,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: userRole,
      token,
      createdAt: user.createdAt,
    };

    res.json({
      success: true,
      message: 'Logged in successfully!',
      token,
      data: returnedData,
    });
  } catch (error: any) {
    console.error('[User Controller - Login Error]', error);
    res.status(500).json({ success: false, message: error.message || 'Server error during login' });
  }
};

/**
 * GET ALL registered users (Admin Panel)
 * Route: GET /api/users
 */
export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    let users: any[] = [];
    try {
      users = await UserModel.find({}).sort({ createdAt: -1 });
    } catch (dbErr) {
      users = [];
    }

    const combined = [...users.map(u => ({
      id: u._id ? u._id.toString() : u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: u.role,
      createdAt: u.createdAt,
      lastLogin: u.lastLogin,
    })), ...localUsersStore];

    const uniqueMap = new Map();
    combined.forEach(u => {
      if (!uniqueMap.has(u.email)) {
        uniqueMap.set(u.email, u);
      }
    });

    res.json({
      success: true,
      data: Array.from(uniqueMap.values()),
    });
  } catch (error: any) {
    console.error('[User Controller - GET Error]', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch registered users' });
  }
};

/**
 * DELETE user (Admin Action)
 * Route: DELETE /api/users/:id
 */
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    try {
      await UserModel.findByIdAndDelete(id);
    } catch (e) {
      // Ignore
    }
    const idx = localUsersStore.findIndex(u => u.id === id);
    if (idx !== -1) {
      localUsersStore.splice(idx, 1);
    }

    res.json({ success: true, message: 'User removed successfully.' });
  } catch (error: any) {
    console.error('[User Controller - DELETE Error]', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to delete user' });
  }
};

/**
 * SEED ADMIN USER
 * Route: POST /api/users/seed-admin or GET /api/users/seed-admin
 * Ensures the default Admin account exists in MongoDB with a secure bcrypt hash.
 */
export const seedAdminUser = async (req?: Request, res?: Response): Promise<any> => {
  try {
    const adminEmail = (req?.body?.email || 'admin@mshometrends.com').trim().toLowerCase();
    const adminPassword = req?.body?.password || 'admin123';
    const adminName = req?.body?.name || 'MS Admin (Superadmin)';
    const adminPhone = req?.body?.phone || '03001234567';

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminPassword, salt);

    let seededUser: any = null;

    try {
      // Upsert into MongoDB
      seededUser = await UserModel.findOneAndUpdate(
        { email: adminEmail },
        {
          $set: {
            name: adminName,
            phone: adminPhone,
            role: 'admin',
            passwordHash,
            lastLogin: new Date(),
          },
          $setOnInsert: {
            createdAt: new Date(),
          },
        },
        { upsert: true, new: true }
      );
    } catch (dbErr) {
      console.warn('[User Controller] Could not upsert admin in MongoDB, updating local store:', dbErr);
    }

    // Also update localUsersStore
    const existingLocalIdx = localUsersStore.findIndex(u => u.email === adminEmail);
    const localAdminObj = {
      id: seededUser?._id ? seededUser._id.toString() : 'user-admin-root',
      name: adminName,
      email: adminEmail,
      phone: adminPhone,
      passwordHash,
      role: 'admin' as const,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    if (existingLocalIdx >= 0) {
      localUsersStore[existingLocalIdx] = localAdminObj;
    } else {
      localUsersStore.unshift(localAdminObj);
    }

    const returnedData = {
      id: seededUser?._id ? seededUser._id.toString() : localAdminObj.id,
      name: adminName,
      email: adminEmail,
      phone: adminPhone,
      role: 'admin',
      database: seededUser ? 'MongoDB Atlas' : 'In-Memory Store',
    };

    if (res) {
      res.status(200).json({
        success: true,
        message: `Admin account (${adminEmail}) seeded successfully into ${returnedData.database}!`,
        data: returnedData,
      });
    }

    return returnedData;
  } catch (error: any) {
    console.error('[User Controller - Seed Admin Error]', error);
    if (res) {
      res.status(500).json({ success: false, message: error.message || 'Failed to seed admin user' });
    }
    throw error;
  }
};

