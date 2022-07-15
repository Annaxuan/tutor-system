import bcrypt from 'bcrypt';

/**
 * Checks password against defined password rules.
 * Returns error message or null
 */
const validatePassword = (password) => {
  let error = null;

  if (! password) {
    error = 'Password is required';
  } else if (password.length <= 3) {
    error = 'Password must have at least 4 characters';
  } else if (password.length > 15) {
    error = 'Password cannot be more than 15 characters long';
  }

  return error;
}

/**
 * Checks if rawPassword is equal to hashedPassword
 * Returns a boolean
 */
const comparePassword = async (rawPassword, hashedPassword) => {
  const isValidPassword = await bcrypt.compare(
    rawPassword,
    hashedPassword
  );
  return isValidPassword
}

/**
 * Return an encrypted version of password that is ready to be stored in database
 */
const encrypt = async (password) => {
  // bcrypt the user's password
  // instead of saving the password directly, it's secure to use
  // bcrypt to hash the password and save the hashed one
  const saltRound = 10;
  const hashedPassword = await bcrypt.hash(password, saltRound);
  return hashedPassword
}

export {
	validatePassword,
	comparePassword,
	encrypt
}
