
const BASE_URL = "https://dummyjson.com";
const REGISTERED_USERS_KEY = "registeredUsers";
const LOCAL_TOKEN_PREFIX = "local-session:";
export const ADMIN_USERNAME = "ayush1234";

export function isAdminUser(user) {
  return user?.username?.trim().toLowerCase() === ADMIN_USERNAME;
}

function getUserRole(username) {
  return username?.trim().toLowerCase() === ADMIN_USERNAME
    ? "admin"
    : "user";
}

function getRegisteredUsers() {
  const storedUsers = localStorage.getItem(REGISTERED_USERS_KEY);

  if (!storedUsers) {
    return [];
  }

  const users = JSON.parse(storedUsers);

  if (!Array.isArray(users)) {
    throw new Error("Saved account data is invalid. Please clear your browser data and sign up again.");
  }

  return users;
}

function bytesToHex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function hashPassword(password, salt) {
  const saltBytes = Uint8Array.from(
    salt.match(/.{2}/g),
    (byte) => parseInt(byte, 16)
  );
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const hash = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBytes,
      iterations: 100000,
      hash: "SHA-256",
    },
    key,
    256
  );

  return bytesToHex(new Uint8Array(hash));
}

export async function loginUser(username, password) {
  const normalizedUsername = username.toLowerCase();
  const registeredUser = getRegisteredUsers().find(
    (user) => user.username.toLowerCase() === normalizedUsername
  );

  if (registeredUser) {
    const passwordHash = await hashPassword(password, registeredUser.salt);

    if (passwordHash !== registeredUser.passwordHash) {
      throw new Error("Invalid username or password.");
    }

    return {
      id: registeredUser.id,
      firstName: registeredUser.firstName,
      lastName: registeredUser.lastName,
      email: registeredUser.email,
      username: registeredUser.username,
      role: getUserRole(registeredUser.username),
      accessToken: `${LOCAL_TOKEN_PREFIX}${crypto.randomUUID()}`,
    };
  }

  if (normalizedUsername === ADMIN_USERNAME) {
    throw new Error(
      `Admin account not found in this browser. Sign up with username ${ADMIN_USERNAME} first.`
    );
  }

  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
      expiresInMins: 60,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return {
    ...data,
    role: getUserRole(data.username),
  };
}

export async function registerUser(user) {
  const users = getRegisteredUsers();
  const normalizedUsername = user.username.toLowerCase();

  if (users.some((savedUser) => savedUser.username.toLowerCase() === normalizedUsername)) {
    throw new Error("That username is already registered. Please choose another one.");
  }

  const saltBytes = crypto.getRandomValues(new Uint8Array(16));
  const salt = bytesToHex(saltBytes);
  const passwordHash = await hashPassword(user.password, salt);
  const registeredUser = {
    id: crypto.randomUUID(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    username: user.username,
    salt,
    passwordHash,
  };

  localStorage.setItem(
    REGISTERED_USERS_KEY,
    JSON.stringify([...users, registeredUser])
  );

  return {
    id: registeredUser.id,
    firstName: registeredUser.firstName,
    lastName: registeredUser.lastName,
    email: registeredUser.email,
    username: registeredUser.username,
  };
}

export async function getCurrentUser(token) {
  const response = await fetch(`${BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Unable to fetch user");
  }

  return response.json();
}



export async function validateSession(token) {
  if (!token) {
    throw new Error("No authentication token found.");
  }

  if (token.startsWith(LOCAL_TOKEN_PREFIX)) {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!user || user.accessToken !== token) {
      throw new Error("Session expired. Please login again.");
    }

    return {
      ...user,
      role: getUserRole(user.username),
    };
  }

  const response = await fetch("https://dummyjson.com/auth/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Session expired. Please login again.");
  }

  const user = await response.json();

  return {
    ...user,
    role: getUserRole(user.username),
  };
}

