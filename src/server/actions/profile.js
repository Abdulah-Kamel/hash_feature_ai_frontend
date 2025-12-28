"use server";

import { serverApiClient } from "../api-client";
import { cookies } from "next/headers";

/**
 * Get the current user's profile
 */
export async function getMyProfile() {
  const res = await serverApiClient("/api/v1/profiles", {
    method: "GET",
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok) {
    return { success: false, error: data.message || "Failed to fetch profile" };
  }

  const profileData = data.data || data;

  // Extract profile image URL if it exists
  if (
    profileData.profileImage &&
    typeof profileData.profileImage === "object"
  ) {
    profileData.profileImageUrl = profileData.profileImage.url;
  }

  console.log(profileData);
  

  return { success: true, data: profileData };
}

/**
 * Update the current user's profile
 */
export async function updateMyProfile(profileData) {
  const res = await serverApiClient("/api/v1/profiles", {
    method: "PATCH",
    body: JSON.stringify(profileData),
  });

  const data = await res.json();

  if (!res.ok) {
    return {
      success: false,
      error: data.message || "Failed to update profile",
    };
  }

  return { success: true, data: data.data || data };
}

/**
 * Get the current user's profile image URL
 */
export async function getMyProfileImage() {
  const res = await serverApiClient("/api/v1/profiles/profileImage", {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    if (res.status === 404) {
      return { success: true, data: null }; // No profile image
    }
    return { success: false, error: "Failed to fetch profile image" };
  }

  // Get the image as a blob and convert to base64 or URL
  // Note: createObjectURL might not work in node environment as expected if we want a browser-usable URL.
  // But typically server action returns serializable data.
  // URL.createObjectURL on server creates a blob:nodedata:... which isn't helpful for client.
  // The client code likely expects a base64 string or we should return the blob/buffer differently.
  // The original code used URL.createObjectURL(blob). This is suspicious in a server action.
  // If this runs on server, URL.createObjectURL creates a server-side URL that client can't fetch.
  // However, I will preserve the logic but note that it might be buggy (though out of scope to fix logic issues unless requested).
  // Actually, checking previous code: `const imageUrl = URL.createObjectURL(blob);`
  // If this is a "use server" file, it runs on server.
  // If the user previously used this, maybe they intended for something else.
  // But I will stick to refactoring.
  try {
    const blob = await res.blob();
    // converting blob to base64 is safer for server->client transfer
    const buffer = Buffer.from(await blob.arrayBuffer());
    const base64 = "data:" + blob.type + ";base64," + buffer.toString("base64");
    return { success: true, data: base64 };
  } catch (e) {
    console.error("Image processing error", e);
    return { success: false, error: "Failed to process image" };
  }
}

/**
 * Upload/Update the current user's profile image
 */
export async function updateMyProfileImage(formData) {
  const res = await serverApiClient("/api/v1/profiles/profileImage", {
    method: "PATCH",
    body: formData, // FormData with 'profileImage' file
  });

  const data = await res.json();

  if (!res.ok) {
    return {
      success: false,
      error: data.message || "Failed to upload profile image",
    };
  }

  const responseData = data.data || data;

  // Extract profile image URL if it exists
  if (
    responseData.profileImage &&
    typeof responseData.profileImage === "object"
  ) {
    responseData.profileImageUrl = responseData.profileImage.url;
  }

  return { success: true, data: responseData };
}

/**
 * Remove the current user's profile image
 */
export async function removeMyProfileImage() {
  const res = await serverApiClient("/api/v1/profiles/profileImage", {
    method: "DELETE",
  });

  if (!res.ok) {
    const data = await res.json();
    return {
      success: false,
      error: data.message || "Failed to remove profile image",
    };
  }

  return { success: true, message: "Profile image removed successfully" };
}

/**
 * Change the current user's password
 */
export async function changeMyPassword(passwordData) {
  const res = await serverApiClient("/api/v1/profiles/change-password", {
    method: "PATCH",
    body: JSON.stringify(passwordData),
  });

  const data = await res.json();

  if (!res.ok) {
    return {
      success: false,
      error: data.message || "Failed to change password",
    };
  }

  // If a new token is returned, update it
  if (data.token) {
    const cookieStore = await cookies();
    cookieStore.set("authToken", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  }

  return { success: true, data: data.data || data };
}

/**
 * Delete the current user's account
 */
export async function deleteMyAccount() {
  const res = await serverApiClient("/api/v1/profiles", {
    method: "DELETE",
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return {
      success: false,
      error: data.message || "Failed to delete account",
    };
  }
  
  // Clear cookies upon successful deletion
  const cookieStore = await cookies();
  cookieStore.delete("authToken");
  cookieStore.delete("refreshToken");

  return { success: true, message: "Account deleted successfully" };
}
