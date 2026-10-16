const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, "data");
const DB_FILE = path.join(DATA_DIR, "db.json");
const PUBLIC_DIR = path.join(__dirname, "public");

fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({ users: [], posts: [] }, null, 2));
}

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || "change-this-session-secret",
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: "lax", secure: false, maxAge: 1000 * 60 * 60 * 24 }
}));

function readDB() {
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}
function writeDB(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}
function publicUser(user) {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}
function requireAuth(req, res, next) {
  if (!req.session.userId) return res.status(401).json({ error: "Please sign in first." });
  const db = readDB();
  const user = db.users.find(u => u.id === req.session.userId);
  if (!user) {
    req.session.destroy(() => {});
    return res.status(401).json({ error: "Session expired. Please sign in again." });
  }
  req.user = user;
  next();
}

app.get("/api/health", (req, res) => res.json({ status: "ok", app: "Wheel Deal API" }));

app.post("/api/auth/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, username, password } = req.body;
    if (![firstName, lastName, email, username, password].every(v => typeof v === "string" && v.trim())) {
      return res.status(400).json({ error: "Please complete all required fields." });
    }
    if (password.length < 8) return res.status(400).json({ error: "Password must be at least 8 characters." });

    const db = readDB();
    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim().replace(/^@/, "");
    if (db.users.some(u => u.email === cleanEmail)) return res.status(409).json({ error: "Email already exists." });
    if (db.users.some(u => u.username.toLowerCase() === cleanUsername.toLowerCase())) {
      return res.status(409).json({ error: "Username already exists." });
    }

    const user = {
      id: require("crypto").randomUUID(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      username: "@" + cleanUsername,
      email: cleanEmail,
      passwordHash: await bcrypt.hash(password, 12),
      bio: "",
      createdAt: new Date().toISOString()
    };
    db.users.push(user);
    writeDB(db);
    req.session.userId = user.id;
    res.status(201).json({ user: publicUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to create account right now." });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    if (!emailOrUsername || !password) return res.status(400).json({ error: "Enter your username/email and password." });
    const db = readDB();
    const login = String(emailOrUsername).trim().toLowerCase();
    const user = db.users.find(u => u.email === login || u.username.toLowerCase() === (login.startsWith("@") ? login : "@" + login));
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: "Invalid username/email or password." });
    }
    req.session.userId = user.id;
    res.json({ user: publicUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to sign in right now." });
  }
});

// Development password-reset flow. The token is printed to the server terminal;
// configure an email provider before using this flow in production.
app.post("/api/auth/forgot-password", (req, res) => {
  const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const db = readDB();
  const user = db.users.find(u => u.email === email);
  // Keep the browser response generic so account existence is not revealed.
  if (user) {
    const crypto = require("crypto");
    const token = crypto.randomBytes(24).toString("hex");
    db.resetTokens ||= [];
    db.resetTokens = db.resetTokens.filter(t => t.userId !== user.id);
    db.resetTokens.push({ token, userId: user.id, expiresAt: Date.now() + 15 * 60 * 1000 });
    writeDB(db);
    console.log(`\n[Wheel Deal password reset] ${user.email}\nToken: ${token}\nExpires in 15 minutes.\n`);
  }
  res.json({ message: "If that email is registered, a reset token has been generated. For this local demo, check the server terminal." });
});

app.post("/api/auth/reset-password", async (req, res) => {
  try {
    const token = typeof req.body.token === "string" ? req.body.token.trim() : "";
    const password = typeof req.body.password === "string" ? req.body.password : "";
    if (password.length < 8) return res.status(400).json({ error: "Password must be at least 8 characters." });
    const db = readDB();
    db.resetTokens ||= [];
    const reset = db.resetTokens.find(t => t.token === token && t.expiresAt > Date.now());
    if (!reset) return res.status(400).json({ error: "Invalid or expired reset token. Request a new one." });
    const user = db.users.find(u => u.id === reset.userId);
    if (!user) return res.status(400).json({ error: "Account not found." });
    user.passwordHash = await require("bcryptjs").hash(password, 12);
    db.resetTokens = db.resetTokens.filter(t => t.token !== token);
    writeDB(db);
    res.json({ message: "Password updated. You can now sign in with your new password." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to reset password right now." });
  }
});

app.post("/api/auth/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: "Unable to sign out." });
    res.clearCookie("connect.sid");
    res.json({ message: "Signed out." });
  });
});

app.get("/api/auth/me", requireAuth, (req, res) => res.json({ user: publicUser(req.user) }));

app.get("/api/posts", (req, res) => {
  const db = readDB();
  const posts = db.posts
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map(post => ({
      ...post,
      author: (() => {
        const u = db.users.find(user => user.id === post.userId);
        return u ? { id: u.id, firstName: u.firstName, lastName: u.lastName, username: u.username } : null;
      })()
    }));
  res.json({ posts });
});

app.post("/api/posts", requireAuth, (req, res) => {
  const { title, content, image = null, tags = "", category = "Collection Showcase" } = req.body;
  if (typeof title !== "string" || !title.trim() || typeof content !== "string" || !content.trim()) {
    return res.status(400).json({ error: "Post title and caption are required." });
  }
  if (image && typeof image === "string" && image.length > 8 * 1024 * 1024) {
    return res.status(413).json({ error: "Image is too large. Please use an image under 6 MB." });
  }
  const db = readDB();
  const post = {
    id: require("crypto").randomUUID(),
    userId: req.user.id,
    title: title.trim(),
    content: content.trim(),
    image,
    tags: String(tags).trim(),
    category: String(category).trim(),
    likes: [],
    comments: [],
    createdAt: new Date().toISOString()
  };
  db.posts.push(post);
  writeDB(db);
  res.status(201).json({ post });
});

app.put("/api/posts/:id", requireAuth, (req, res) => {
  const { title, content } = req.body;
  if (typeof title !== "string" || !title.trim() || typeof content !== "string" || !content.trim()) {
    return res.status(400).json({ error: "Post title and caption are required." });
  }
  const db = readDB();
  const post = db.posts.find(p => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: "Post not found." });
  if (post.userId !== req.user.id) return res.status(403).json({ error: "You can only edit your own posts." });
  post.title = title.trim();
  post.content = content.trim();
  post.updatedAt = new Date().toISOString();
  writeDB(db);
  res.json({ post });
});

app.put("/api/auth/profile", requireAuth, (req, res) => {
  const { firstName, lastName, username, bio = "" } = req.body;
  if (![firstName, lastName, username].every(v => typeof v === "string" && v.trim())) {
    return res.status(400).json({ error: "First name, last name, and username are required." });
  }
  const cleanUsername = "@" + username.trim().replace(/^@/, "");
  const db = readDB();
  if (db.users.some(u => u.id !== req.user.id && u.username.toLowerCase() === cleanUsername.toLowerCase())) {
    return res.status(409).json({ error: "That username is already taken." });
  }
  const user = db.users.find(u => u.id === req.user.id);
  user.firstName = firstName.trim();
  user.lastName = lastName.trim();
  user.username = cleanUsername;
  user.bio = String(bio).trim();
  writeDB(db);
  res.json({ user: publicUser(user) });
});

app.delete("/api/posts/:id", requireAuth, (req, res) => {
  const db = readDB();
  const index = db.posts.findIndex(p => p.id === req.params.id);
  if (index < 0) return res.status(404).json({ error: "Post not found." });
  if (db.posts[index].userId !== req.user.id) return res.status(403).json({ error: "You can only delete your own posts." });
  db.posts.splice(index, 1);
  writeDB(db);
  res.json({ message: "Post deleted." });
});

app.post("/api/posts/:id/like", requireAuth, (req, res) => {
  const db = readDB();
  const post = db.posts.find(p => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: "Post not found." });
  post.likes ||= [];
  const index = post.likes.indexOf(req.user.id);
  if (index >= 0) post.likes.splice(index, 1);
  else post.likes.push(req.user.id);
  writeDB(db);
  res.json({ likes: post.likes, liked: index < 0 });
});

app.post("/api/posts/:id/comments", requireAuth, (req, res) => {
  const text = typeof req.body.text === "string" ? req.body.text.trim() : "";
  if (!text) return res.status(400).json({ error: "Comment cannot be empty." });
  const db = readDB();
  const post = db.posts.find(p => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: "Post not found." });
  post.comments ||= [];
  const comment = { id: require("crypto").randomUUID(), userId: req.user.id, text, createdAt: new Date().toISOString() };
  post.comments.push(comment);
  writeDB(db);
  res.status(201).json({ comment });
});

// Serve the existing frontend from the public folder.
// Put your HTML/CSS/JS files and images inside public/.
app.use(express.static(PUBLIC_DIR));

app.listen(PORT, () => {
  console.log(`Wheel Deal server running at http://localhost:${PORT}`);
});
