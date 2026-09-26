const User = require("./../schema/User");
const { hashPassword, comparePassword } = require("./../utils/Password");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  hashRefreshToken,
} = require("./../utils/Tokens");

async function issueTokenPair(user) {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshTokenHash = hashRefreshToken(refreshToken);

  await user.save();
  return { accessToken, refreshToken };
}

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "name, email and password are required" });
  }
  if (password.length < 8) {
    return res
      .status(400)
      .json({ error: "Password must be at least 8 characters" });
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res
      .status(400)
      .json({ error: "An account with that email already exists" });
  }

  const passwordHash = await hashPassword(password);
  const user = await User.create({ name, email, passwordHash });

  const { accessToken, refreshToken } = await issueTokenPair(user);

  res.status(201).json({
    user: { id: user._id, name: user.name, email: user.email },
    accessToken,
    refreshToken,
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and Password are required" });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const passwordMatches = await comparePassword(password, user.passwordHash);
  if (!passwordMatches) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const { accessToken, refreshToken } = await issueTokenPair(user);

  res.status(200).json({
    user: { id: user._id, name: user.name, email: user.email },
    accessToken,
    refreshToken,
  });
};

exports.refresh = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ error: "refreshToken is required" });
  }

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired refresh token" });
  }

  const user = await User.findById(payload.sub);
  if (!user || !user.refreshTokenHash) {
    return res.status(401).json({ error: "Refresh token no longer valid" });
  }

  const providedHash = hashRefreshToken(refreshToken);

  if (providedHash !== user.refreshTokenHash) {
    user.refreshTokenHash = null;
    await user.save();
    return res
      .status(401)
      .json({ error: "Refresh token reuse detected, please log in again" });
  }

  const tokens = await issueTokenPair(user);
  res.status(200).json(tokens);
};

exports.logout = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token is required" });
  }

  try {
    const payload = verifyRefreshToken(refreshToken);
    await User.findByIdAndUpdate(payload.sub, { refreshTokenHash: null });
  } catch (err) {}

  res.status(204).send();
};

exports.me = async (req, res) => {
  const user = await User.findById(req.user.id).select("name email createdAt");
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.status(200).json({ user });
};
