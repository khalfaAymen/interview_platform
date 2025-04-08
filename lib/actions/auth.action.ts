"use server";

import { auth, db } from "@/firebase/admin";
import { FirebaseError } from "firebase/app";
import { cookies } from "next/headers";

const ONE_WEEK = 60 * 60 * 24 * 7; // 7 days

export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;

  try {
    const userRecord = await db.collection("users").doc(uid).get();
    if (userRecord.exists) {
      return {
        success: false,
        message: "User already exists",
      };
    }

    await db.collection("users").doc(uid).set({
      name,
      email,
    });

    return {
      success: true,
      message: "User created successfully",
    };
  } catch (error) {
    console.error("Error signing up:", error);

    if (error instanceof FirebaseError) {
      if (error.code === "auth/email-already-in-use") {
        return {
          success: false,
          message: "Email already in use",
        };
      }
    }

    return {
      success: false,
      message: "Error signing up",
    };
  }
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    const userRecord = await auth.getUserByEmail(email);
    if (!userRecord) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // Set session cookie
    await setSessionCookie(idToken);

    return {
      success: true,
      message: "User signed in successfully",
    };
  } catch (error) {
    console.error("Error signing in:", error);
    return {
      success: false,
      message: "Error signing in",
    };
  }
}

export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();

  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: ONE_WEEK * 1000,
  });
  cookieStore.set("session", sessionCookie, {
    maxAge: ONE_WEEK * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();

  const sessionCookie = cookieStore.get("session")?.value || null;
  if (!sessionCookie) {
    return null;
  }
  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    const userRecord = await db
      .collection("users")
      .doc(decodedClaims.uid)
      .get();
    if (!userRecord.exists) {
      return null;
    }

    return {
      ...userRecord.data(),
      id: userRecord.id,
    } as User;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

export async function isAuthenticated() {
    const user = await getCurrentUser();
    return !!user; // Return true if user is authenticated, false otherwise
}

