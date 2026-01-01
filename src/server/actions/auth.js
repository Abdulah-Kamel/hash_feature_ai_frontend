"use server";
import { cookies } from "next/headers";

export async function handleRegister(data) {
  const res = await fetch(`${process.env.baseApi}/api/v1/auth/signup`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  const final = await res.json();
  if (!res.ok) return { success: false, error: final?.message || "Signup failed" };
  return { success: true, data: final };
}

export async function handleLogin(data) {
  const res = await fetch(`${process.env.baseApi}/api/v1/auth/login`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  const final = await res.json();
  if (!res.ok) return { success: false, error: final?.message || "Login failed" };
  const c = await cookies();
  const token = final?.token;
  const refreshToken = final?.refreshToken;
  if (token)
    c.set("authToken", token, {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
      expires: new Date(Date.now() + 15 * 60 * 1000),
    });
  if (refreshToken) c.set("refreshToken", refreshToken, { httpOnly: true, sameSite: "strict", path: "/" });

  return { success: true, data: final };
}

export async function handleForgotPassword(data) {
  const res = await fetch(`${process.env.baseApi}/api/v1/auth/forgot-password`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  const final = await res.json();
  if (!res.ok) return { success: false, error: final?.message || "Forgot password failed" };
  return { success: true, data: final };
}

export async function handleVerifyOtp(data) {
  const payload = {
    email:
      typeof data?.email === "string" ? data.email : String(data?.email || ""),
    code: typeof data?.code === "string" ? data.code : String(data?.code || ""),
    otp: typeof data?.code === "string" ? data.code : String(data?.code || ""),
    otpCode:
      typeof data?.code === "string" ? data.code : String(data?.code || ""),
    verificationCode:
      typeof data?.code === "string" ? data.code : String(data?.code || ""),
  };
  const res = await fetch(`${process.env.baseApi}/api/v1/auth/verify-otp`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
  });
  const final = await res.json();
  if (!res.ok)
    return {
      success: false,
      error: final?.message || "OTP verification failed",
    };

  // Set cookies on success
  const c = await cookies();
  const token = final?.token;
  const refreshToken = final?.refreshToken;

  if (token)
    c.set("authToken", token, {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
      expires: new Date(Date.now() + 15 * 60 * 1000),
    });
  if (refreshToken)
    c.set("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
    });

  return { success: true, data: final };
}

export async function handleResetPassword(data) {
  const res = await fetch(`${process.env.baseApi}/api/v1/auth/reset-password`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  const final = await res.json();
  if (!res.ok) return { success: false, error: final?.message || "Reset password failed" };
  return { success: true, data: final };
}

export async function handleVerifyResetCode(data) {
  const res = await fetch(
    `${process.env.baseApi}/api/v1/auth/verify-reset-code`,
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    }
  );
  const final = await res.json();
  if (!res.ok)
    return {
      success: false,
      error: final?.message || "Verify reset code failed",
    };
  return { success: true, data: final };
}
