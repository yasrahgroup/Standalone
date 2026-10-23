// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authenticateToken, requireRole } = require('../middleware/auth');

module.exports = function (pool) {
  // Helper to log audit actions
  async function logAudit(userId, userName, action, module, entityType, entityId, details, req) {
    try {
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
      await pool.query(`
        INSERT INTO "AuditLog" (id, "userId", "userName", action, module, "entityType", "entityId", details, "ipAddress", "createdAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
      `, [
        `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        userId || 'system',
        userName || 'System',
        action,
        module,
        entityType,
        entityId,
        JSON.stringify(details || {}),
        ip
      ]);
    } catch (e) {
      console.error('Audit log error:', e.message);
    }
  }

  // 1. Admin Login
  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'unknown';

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    try {
      const result = await pool.query(
        'SELECT id, email, "passwordHash", name, role, "isActive" FROM "AdminUser" WHERE LOWER(email) = LOWER($1)',
        [email.trim()]
      );

      if (result.rows.length === 0) {
        // Record failed login
        await pool.query(
          'INSERT INTO "LoginHistory" (id, email, success, reason, "ipAddress", "userAgent", "createdAt") VALUES ($1, $2, false, $3, $4, $5, NOW())',
          [`log-${Date.now()}`, email.trim(), 'User not found', ip, userAgent]
        );
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      const user = result.rows[0];

      if (!user.isActive) {
        await pool.query(
          'INSERT INTO "LoginHistory" (id, "userId", email, success, reason, "ipAddress", "userAgent", "createdAt") VALUES ($1, $2, $3, false, $4, $5, $6, NOW())',
          [`log-${Date.now()}`, user.id, user.email, 'Account disabled', ip, userAgent]
        );
        return res.status(403).json({
          success: false,
          message: 'This account has been deactivated. Contact an administrator.'
        });
      }

      const passwordMatches = await bcrypt.compare(password, user.passwordHash);
      if (!passwordMatches) {
        await pool.query(
          'INSERT INTO "LoginHistory" (id, "userId", email, success, reason, "ipAddress", "userAgent", "createdAt") VALUES ($1, $2, $3, false, $4, $5, $6, NOW())',
          [`log-${Date.now()}`, user.id, user.email, 'Incorrect password', ip, userAgent]
        );
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Update lastLoginAt
      await pool.query('UPDATE "AdminUser" SET "lastLoginAt" = NOW() WHERE id = $1', [user.id]);

      // Record successful login
      await pool.query(
        'INSERT INTO "LoginHistory" (id, "userId", email, success, "ipAddress", "userAgent", "createdAt") VALUES ($1, $2, $3, true, $4, $5, NOW())',
        [`log-${Date.now()}`, user.id, user.email, ip, userAgent]
      );

      // Issue JWT token (7 days expiry for seamless admin usage)
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        process.env.JWT_SECRET || 'd8rewsBq9dpCwnqRbcVlHP6W7byiqp8Re14H/dx+ByCAHo8h2rqH80UqxqBPAxSP',
        { expiresIn: '7d' }
      );

      await logAudit(user.id, user.name, 'LOGIN', 'AUTH', 'AdminUser', user.id, { email: user.email }, req);

      res.json({
        success: true,
        message: 'Authentication successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during authentication'
      });
    }
  });

  // 2. Current User Profile
  router.get('/me', authenticateToken, async (req, res) => {
    try {
      const result = await pool.query(
        'SELECT id, email, name, role, "isActive", "lastLoginAt", "createdAt" FROM "AdminUser" WHERE id = $1',
        [req.user.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      res.json({
        success: true,
        user: result.rows[0]
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve profile' });
    }
  });

  // 3. Change Password
  router.post('/change-password', authenticateToken, async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword || newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters long.'
      });
    }

    try {
      const result = await pool.query('SELECT "passwordHash" FROM "AdminUser" WHERE id = $1', [req.user.id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const matches = await bcrypt.compare(currentPassword, result.rows[0].passwordHash);
      if (!matches) {
        return res.status(400).json({ success: false, message: 'Current password does not match.' });
      }

      const newHash = await bcrypt.hash(newPassword, 12);
      await pool.query('UPDATE "AdminUser" SET "passwordHash" = $1, "updatedAt" = NOW() WHERE id = $2', [newHash, req.user.id]);

      await logAudit(req.user.id, req.user.name, 'CHANGE_PASSWORD', 'AUTH', 'AdminUser', req.user.id, {}, req);

      res.json({
        success: true,
        message: 'Password changed successfully.'
      });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ success: false, message: 'Failed to change password' });
    }
  });

  // 4. List Users (Super Admin Only)
  router.get('/users', authenticateToken, requireRole('SUPER_ADMIN'), async (req, res) => {
    try {
      const result = await pool.query(
        'SELECT id, email, name, role, "isActive", "lastLoginAt", "createdAt" FROM "AdminUser" ORDER BY "createdAt" ASC'
      );
      res.json({ success: true, users: result.rows });
    } catch (error) {
      console.error('List users error:', error);
      res.status(500).json({ success: false, message: 'Failed to list users' });
    }
  });

  // 5. Create User (Super Admin Only)
  router.post('/users', authenticateToken, requireRole('SUPER_ADMIN'), async (req, res) => {
    const { email, password, name, role } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ success: false, message: 'Email, password, and name are required' });
    }

    try {
      const existing = await pool.query('SELECT id FROM "AdminUser" WHERE LOWER(email) = LOWER($1)', [email.trim()]);
      if (existing.rows.length > 0) {
        return res.status(400).json({ success: false, message: 'A user with this email already exists' });
      }

      const hash = await bcrypt.hash(password, 12);
      const newId = `usr-${Date.now()}`;
      const userRole = role || 'CONTENT_EDITOR';

      await pool.query(`
        INSERT INTO "AdminUser" (id, email, "passwordHash", name, role, "isActive", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, true, NOW(), NOW())
      `, [newId, email.trim(), hash, name.trim(), userRole]);

      await logAudit(req.user.id, req.user.name, 'CREATE_USER', 'AUTH', 'AdminUser', newId, { email, role: userRole }, req);

      res.json({
        success: true,
        message: 'User created successfully',
        user: { id: newId, email, name, role: userRole }
      });
    } catch (error) {
      console.error('Create user error:', error);
      res.status(500).json({ success: false, message: 'Failed to create user' });
    }
  });

  // 6. Update User (Super Admin Only)
  router.put('/users/:id', authenticateToken, requireRole('SUPER_ADMIN'), async (req, res) => {
    const { id } = req.params;
    const { name, role, isActive, password } = req.body;

    try {
      const updates = [];
      const values = [id];
      let idx = 2;

      if (name) {
        updates.push(`name = $${idx++}`);
        values.push(name.trim());
      }
      if (role) {
        updates.push(`role = $${idx++}`);
        values.push(role);
      }
      if (typeof isActive === 'boolean') {
        updates.push(`"isActive" = $${idx++}`);
        values.push(isActive);
      }
      if (password && password.length >= 8) {
        const hash = await bcrypt.hash(password, 12);
        updates.push(`"passwordHash" = $${idx++}`);
        values.push(hash);
      }

      if (updates.length === 0) {
        return res.status(400).json({ success: false, message: 'No fields provided to update' });
      }

      updates.push(`"updatedAt" = NOW()`);
      await pool.query(`UPDATE "AdminUser" SET ${updates.join(', ')} WHERE id = $1`, values);

      await logAudit(req.user.id, req.user.name, 'UPDATE_USER', 'AUTH', 'AdminUser', id, { name, role, isActive }, req);

      res.json({ success: true, message: 'User updated successfully' });
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({ success: false, message: 'Failed to update user' });
    }
  });

  // 7. Delete User (Super Admin Only)
  router.delete('/users/:id', authenticateToken, requireRole('SUPER_ADMIN'), async (req, res) => {
    const { id } = req.params;
    if (id === req.user.id) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
    }

    try {
      await pool.query('DELETE FROM "AdminUser" WHERE id = $1', [id]);
      await logAudit(req.user.id, req.user.name, 'DELETE_USER', 'AUTH', 'AdminUser', id, {}, req);
      res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({ success: false, message: 'Failed to delete user' });
    }
  });

  return router;
};
