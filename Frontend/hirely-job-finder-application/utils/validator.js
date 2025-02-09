/**
 * Validates an email address based on a strict regex pattern.
 * 
 * @param {string} email - The email address to validate.
 * @returns {boolean} - Returns true if the email is valid, otherwise false.
 */
export function isValidEmail(email) {
    // Define the email validation regex
    const emailRegex = /^(?!.*\.\.)[a-zA-Z0-9][a-zA-Z0-9._%+-]{0,63}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/;

    // Test the provided email against the regex pattern
    return emailRegex.test(email);
}

// Example usage
console.log(isValidEmail("test@example.com")); // true ✅
console.log(isValidEmail("user.name+123@sub.example.co.uk")); // true ✅
console.log(isValidEmail(".invalid@email.com")); // false ❌ (Cannot start with a dot)
console.log(isValidEmail("invalid..email@example.com")); // false ❌ (No consecutive dots allowed)
console.log(isValidEmail("user@invalid_domain.com")); // false ❌ (Invalid character in domain)
console.log(isValidEmail("valid-email@longtld.technology")); // true ✅

