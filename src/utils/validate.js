// Validates login/signup fields. Pass username as null to skip its check (sign-in).
// Returns an error message string, or null when everything is valid.
export const checkValidity = (email, password, username) => {
  const isEmailValid = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(
    email
  );

  const isPasswordValid =
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\S+$).{8,}$/.test(
      password
    );

  let isUserNameValid = true;
  if (username !== null) {
    isUserNameValid = /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/.test(username);
  }

  if (!isEmailValid) return "Email is not valid";
  if (!isPasswordValid) return "Password is not valid";
  if (username !== null && !isUserNameValid) return "Username is not valid";

  return null;
};
