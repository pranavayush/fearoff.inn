// User management utilities

export interface User {
  username: string;
  password: string;
  email: string;
  fullName: string;
  userType: "student" | "teacher";
  createdAt: string;
}

// Get all users
export const getAllUsers = (): User[] => {
  const stored = localStorage.getItem("users");
  return stored ? JSON.parse(stored) : [];
};

// Register new user
export const registerUser = (user: Omit<User, "createdAt">): { success: boolean; message: string } => {
  const users = getAllUsers();
  
  // Check if username already exists
  if (users.some(u => u.username === user.username)) {
    return { success: false, message: "Username already exists" };
  }
  
  // Check if email already exists
  if (users.some(u => u.email === user.email)) {
    return { success: false, message: "Email already exists" };
  }
  
  const newUser: User = {
    ...user,
    createdAt: new Date().toISOString(),
  };
  
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
  
  return { success: true, message: "Account created successfully" };
};

// Validate login credentials
export const validateLogin = (
  username: string, 
  password: string, 
  userType: "student" | "teacher"
): { success: boolean; message: string; user?: User } => {
  const users = getAllUsers();
  
  const user = users.find(
    u => u.username === username && u.password === password && u.userType === userType
  );
  
  if (!user) {
    return { success: false, message: "Invalid username or password" };
  }
  
  return { success: true, message: "Login successful", user };
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const validatePassword = (password: string): { valid: boolean; message: string } => {
  if (password.length < 6) {
    return { valid: false, message: "Password must be at least 6 characters" };
  }
  return { valid: true, message: "Password is valid" };
};
