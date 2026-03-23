import { Router } from "express";
import crypto from "crypto";
import type { Request, Response } from "express";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET ?? "rextra-dev-secret-2025";
const TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function hashPassword(password: string, salt: string): string {
  return crypto.createHmac("sha256", salt).update(password).digest("hex");
}

function generateToken(payload: object): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(JSON.stringify({ ...payload, iat: Date.now(), exp: Date.now() + TOKEN_EXPIRY_MS })).toString("base64url");
  const sig = crypto.createHmac("sha256", JWT_SECRET).update(`${header}.${body}`).digest("base64url");
  return `${header}.${body}.${sig}`;
}

function verifyToken(token: string): Record<string, unknown> | null {
  try {
    const [header, body, sig] = token.split(".");
    const expected = crypto.createHmac("sha256", JWT_SECRET).update(`${header}.${body}`).digest("base64url");
    if (expected !== sig) return null;
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf-8")) as Record<string, unknown>;
    if (typeof payload.exp === "number" && payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  passwordHash: string;
  salt: string;
  isVerified: boolean;
}

const users = new Map<string, User>();

function seedUser(id: string, name: string, email: string, password: string, role: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const passwordHash = hashPassword(password, salt);
  users.set(email.toLowerCase(), { id, name, email, role, passwordHash, salt, isVerified: true });
}

seedUser("usr-001", "Aditya Bli", "bliaditdev@gmail.com", "Ry12Ho34", "ADMIN");
seedUser("usr-admin", "Admin REXTRA", "admin@rextra.id", "admin123", "ADMIN");

router.post("/v1/auth/login", (req: Request, res: Response) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    res.status(400).json({ success: false, message: "Email dan password wajib diisi" });
    return;
  }

  const user = users.get(email.toLowerCase());
  if (!user) {
    res.status(401).json({ success: false, message: "Email atau kata sandi salah" });
    return;
  }

  const hash = hashPassword(password, user.salt);
  if (hash !== user.passwordHash) {
    res.status(401).json({ success: false, message: "Email atau kata sandi salah" });
    return;
  }

  if (!user.isVerified) {
    res.status(403).json({ success: false, message: "Akun belum diverifikasi. Silakan cek email Anda." });
    return;
  }

  const access_token = generateToken({ sub: user.id, email: user.email, role: user.role });
  const refresh_token = generateToken({ sub: user.id, type: "refresh" });

  res.json({
    success: true,
    message: "Login berhasil",
    data: { role: user.role, access_token, refresh_token },
  });
});

router.post("/v1/auth/register", (req: Request, res: Response) => {
  const { name, email, password } = req.body as { name?: string; email?: string; password?: string };

  if (!name || !email || !password) {
    res.status(400).json({ success: false, message: "Semua field wajib diisi" });
    return;
  }

  const existing = users.get(email.toLowerCase());
  if (existing) {
    res.status(409).json({ success: false, message: "Email sudah terdaftar" });
    return;
  }

  const id = `usr-${Date.now()}`;
  const salt = crypto.randomBytes(16).toString("hex");
  const passwordHash = hashPassword(password, salt);

  users.set(email.toLowerCase(), {
    id, name, email, role: "ADMIN",
    passwordHash, salt, isVerified: false,
  });

  res.status(201).json({
    success: true,
    message: "Registrasi berhasil. Silakan verifikasi email Anda.",
    data: { id, email, name },
  });
});

router.get("/v1/auth/me", (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ success: false, message: "Tidak terautentikasi" });
    return;
  }

  const token = authHeader.slice(7);
  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ success: false, message: "Token tidak valid atau kadaluarsa" });
    return;
  }

  const email = payload.email as string;
  const user = users.get(email?.toLowerCase());
  if (!user) {
    res.status(404).json({ success: false, message: "User tidak ditemukan" });
    return;
  }

  res.json({
    success: true,
    data: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});

router.post("/v1/auth/forgot-password", (req: Request, res: Response) => {
  const { email } = req.body as { email?: string };

  if (!email) {
    res.status(400).json({ success: false, message: "Email wajib diisi" });
    return;
  }

  res.json({
    success: true,
    message: "Jika email terdaftar, tautan reset akan dikirimkan.",
  });
});

router.post("/v1/auth/reset-password", (req: Request, res: Response) => {
  const { token, new_password } = req.body as { token?: string; new_password?: string };

  if (!token || !new_password) {
    res.status(400).json({ success: false, message: "Token dan password baru wajib diisi" });
    return;
  }

  const payload = verifyToken(token);
  if (!payload) {
    res.status(400).json({ success: false, message: "Token tidak valid atau kadaluarsa" });
    return;
  }

  const email = payload.email as string;
  const user = users.get(email?.toLowerCase());
  if (!user) {
    res.status(404).json({ success: false, message: "User tidak ditemukan" });
    return;
  }

  const newSalt = crypto.randomBytes(16).toString("hex");
  user.salt = newSalt;
  user.passwordHash = hashPassword(new_password, newSalt);
  users.set(email.toLowerCase(), user);

  res.json({ success: true, message: "Kata sandi berhasil diubah" });
});

router.post("/v1/auth/verify-email", (req: Request, res: Response) => {
  const { token } = req.body as { token?: string };

  if (!token) {
    res.status(400).json({ success: false, message: "Token wajib diisi" });
    return;
  }

  const payload = verifyToken(token);
  if (!payload) {
    res.status(400).json({ success: false, message: "Token tidak valid atau kadaluarsa" });
    return;
  }

  const email = payload.email as string;
  const user = users.get(email?.toLowerCase());
  if (!user) {
    res.status(404).json({ success: false, message: "User tidak ditemukan" });
    return;
  }

  user.isVerified = true;
  users.set(email.toLowerCase(), user);

  res.json({ success: true, message: "Email berhasil diverifikasi" });
});

router.post("/v1/auth/resend-verification", (req: Request, res: Response) => {
  const { email } = req.body as { email?: string };
  if (!email) {
    res.status(400).json({ success: false, message: "Email wajib diisi" });
    return;
  }
  res.json({ success: true, message: "Email verifikasi telah dikirim ulang." });
});

export default router;
