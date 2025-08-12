const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_SECRET = process.env.JWT_SECRET;

const validator = require('validator');
//a token is a piece of data that represents the authorization or authentication status of a user or system.


// handling signup process
const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const normalizedEmail = validator.normalizeEmail(email);

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user (password will be hashed by the pre-save hook)
    const user = new User({
      firstName,
      lastName,
      email: normalizedEmail,
      password
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.cookie('token', token,
      { httpOnly: true, 
       secure: true,
       sameSite: 'strict',
        maxAge: 3600000 
       
       });

    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      token
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
};

//Handling Login process
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = validator.normalizeEmail(email);
    console.log('Login attempt for email:', normalizedEmail);
    console.log('Received password:', password);

    // Find user
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('User found:', {
      id: user._id,
      email: user.email,
      hasPassword: !!user.password
    });

    console.log('Comparing passwords...');
    // Check password using the model's comparePassword method
    const isValidPassword = await user.comparePassword(password);
    console.log('Password comparison result:', isValidPassword);

    if (!isValidPassword) {
      console.log('Invalid password');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Password valid, generating token');
    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: '1h' },
  
    );
    res.cookie('token', token,
       { httpOnly: true, 
        secure: true,
        sameSite: 'strict',
         maxAge: 3600000 
        
        }); //added cookie security

    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = validator.normalizeEmail(email);
    console.log('Verifying email:', normalizedEmail);

    // Check if user exists
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      console.log('Email not found');
      return res.status(404).json({ message: 'Email not found' });
    }

    console.log('Email verified successfully');
    res.json({ message: 'Email verified' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: 'Error verifying email' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    console.log('Password reset requested for email:', email);

    // Find user
    const user = await User.findOne({ email: validator.normalizeEmail(email) });
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found, updating password');
    // Update password (will be hashed by the pre-save hook)
    user.password = newPassword;
    user.markModified('password'); // Explicitly mark password as modified
    await user.save();

    console.log('Password updated successfully');
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Error resetting password' });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ message: 'Error fetching user data' });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Error changing password' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, email, currentPassword } = req.body;
    const userId = req.user.id;
    const normalizedEmail = validator.normalizeEmail(email);
    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already taken' });
      }
    }

    // Update user data
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = normalizedEmail;

    await user.save();

    // Return updated user without password
    const updatedUser = user.toObject();
    delete updatedUser.password;
    res.json(updatedUser);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
};

module.exports = {
  signup,
  login,
  verifyEmail,
  resetPassword,
  getMe,
  changePassword,
  updateProfile
}; 
