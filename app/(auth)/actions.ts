'use server';

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE } from "@/lib/auth/session";
import { getDashboardPath } from "@/lib/constants/roles";

export async function loginUserAction(emailOrUsername: string, passwordText: string) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: emailOrUsername },
          { username: emailOrUsername }
        ],
        password: passwordText // (MVP Note: Passwords are plain text for hackathon)
      }
    });

    if (!user) {
      return { success: false, error: "Email/Username atau password salah." };
    }

    // Set cookie
    const store = await cookies();
    store.set(SESSION_COOKIE, user.id, {
      path: "/",
      maxAge: 86400, // 1 day
      httpOnly: false, // Since some old logic might be reading document.cookie (though we should avoid it)
      secure: process.env.NODE_ENV === 'production'
    });

    return { 
      success: true, 
      redirectUrl: getDashboardPath(user.role.toLowerCase() as any) 
    };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Terjadi kesalahan internal server." };
  }
}

export async function logoutUserAction() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function registerUserAction(formData: any) {
  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: formData.email },
          { username: formData.username }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.email === formData.email) {
        return { success: false, error: "Email sudah terdaftar." };
      }
      return { success: false, error: "Username sudah digunakan." };
    }

    const user = await prisma.user.create({
      data: {
        email: formData.email,
        username: formData.username,
        password: formData.password,
        fullName: formData.fullName,
        role: formData.role.toUpperCase() as any,
        status: 'ACTIVE'
      }
    });

    // Automatically login after register
    const store = await cookies();
    store.set(SESSION_COOKIE, user.id, {
      path: "/",
      maxAge: 86400,
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production'
    });

    return { 
      success: true, 
      redirectUrl: getDashboardPath(user.role.toLowerCase() as any) 
    };
  } catch (error) {
    console.error("Register error:", error);
    return { success: false, error: "Terjadi kesalahan internal server." };
  }
}

export async function forgotPasswordAction(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (user) {
      // (MVP Note: Actually sending email is skipped, just pretend success)
      return { success: true };
    }
    
    return { success: false, error: 'Email tidak ditemukan di sistem kami.' };
  } catch (error) {
    console.error("Forgot password error:", error);
    return { success: false, error: 'Terjadi kesalahan, coba lagi.' };
  }
}
