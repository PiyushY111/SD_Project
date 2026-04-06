import User from '../models/User.js';

// POST /api/auth/signup
export const signup = async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: 'Email already registered' });
      }
  
      const user = new User({ name, email, password });
      await user.save();
  
      res.status(201).json({ message: 'User created', userId: user._id });
    } catch (err) {
      res.status(500).json({ message: 'Signup failed', error: err.message });
    }
  };
  

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check user
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Login success
    res.status(200).json({ message: 'Login successful', userId: user._id, name: user.name });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};
