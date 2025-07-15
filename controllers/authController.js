const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 🔐 Token menyertakan role juga
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      role: user.role, // ← tambahkan role
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

exports.register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const existing = await User.findOne({ username });
    if (existing)
      return res.status(400).json({ message: "Username sudah dipakai" });

    const hashed = await bcrypt.hash(password, 10);

    // Set role default = user
    const newUser = await User.create({
      username,
      password: hashed,
      role: "user", // default role
    });

    res.status(201).json({
      message: "Register berhasil",
      user: {
        username: newUser.username,
        role: newUser.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "User tidak ditemukan" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Password salah" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // ubah ke true jika pakai https
      path: "/api/auth/refresh",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
    });

    res.json({
      message: "Login berhasil",
      accessToken,
      user: {
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.refresh = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token)
    return res.status(401).json({ message: "Refresh token tidak ada" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ message: "Refresh token tidak valid" });
    }

    // ✅ ROTASI TOKEN
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Simpan refresh baru dan buang yang lama
    user.refreshToken = newRefreshToken;
    await user.save();

    // Perbarui cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false, // true jika https
      path: "/api/auth/refresh",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({ message: "Refresh token tidak valid" });
  }
};

exports.logout = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token)
    return res.status(400).json({ message: "Tidak ada token untuk logout" });

  try {
    const user = await User.findOne({ refreshToken: token });

    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    res.clearCookie("refreshToken", { path: "/api/auth/refresh" });
    res.status(200).json({ message: "Logout berhasil" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
