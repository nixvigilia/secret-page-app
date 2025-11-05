export type PasswordStrength = {
  score: number; // 0-4
  feedback: string[];
  isValid: boolean;
};

export function checkPasswordStrength(password: string): PasswordStrength {
  const feedback: string[] = [];
  let score = 0;

  if (password.length === 0) {
    return {
      score: 0,
      feedback: [],
      isValid: false,
    };
  }

  // Length check
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push("At least 8 characters");
  }

  // Lowercase check
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Add lowercase letters");
  }

  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Add uppercase letters");
  }

  // Number check
  if (/[0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Add numbers");
  }

  // Special character check
  if (/[^a-zA-Z0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Add special characters (!@#$%^&*)");
  }

  // Minimum length requirement
  if (password.length < 6) {
    return {
      score: 0,
      feedback: ["Password must be at least 6 characters"],
      isValid: false,
    };
  }

  // Strong password requires at least 3 criteria
  const isValid = score >= 3;

  return {
    score,
    feedback: feedback.length > 0 ? feedback : ["Strong password!"],
    isValid,
  };
}

export function getPasswordStrengthLabel(score: number): {
  label: string;
  color: string;
} {
  if (score === 0) return { label: "Very Weak", color: "bg-red-500" };
  if (score === 1) return { label: "Weak", color: "bg-orange-500" };
  if (score === 2) return { label: "Fair", color: "bg-yellow-500" };
  if (score === 3) return { label: "Good", color: "bg-blue-500" };
  return { label: "Strong", color: "bg-green-500" };
}

