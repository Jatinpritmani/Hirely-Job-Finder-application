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
// console.log(isValidEmail("test@example.com"),); // true ✅
// console.log(isValidEmail("user.name+123@sub.example.co.uk")); // true ✅
// console.log(isValidEmail(".invalid@email.com")); // false ❌ (Cannot start with a dot)
// console.log(isValidEmail("invalid..email@example.com")); // false ❌ (No consecutive dots allowed)
// console.log(isValidEmail("user@invalid_domain.com")); // false ❌ (Invalid character in domain)
// console.log(isValidEmail("valid-email@longtld.technology")); // true ✅


/**
 * Checks whether a given string is truthy or falsy.
 * 
 * @param {string} str - The string to be evaluated.
 * @returns {boolean} - Returns `true` if the string is truthy, otherwise `false`.
 */
export function isTruthyString(str) {
    // Convert the input to a boolean using !! (double NOT operator)
    return !!str;
}

// Example Usage:
// console.log(isTruthyString("Hello"));  // true (Truthy)
// console.log(isTruthyString(""));       // false (Falsy)
// console.log(isTruthyString("0"));      // true (Truthy, because it's a non-empty string)
// console.log(isTruthyString("false"));  // true (Truthy, because it's a non-empty string)
// console.log(isTruthyString(null));     // false (Falsy)
// console.log(isTruthyString(undefined)); // false (Falsy)
// console.log(isTruthyString(" "));      // true (Truthy, because it's a non-empty space)


export function shuffleArray(array) {
    if (!Array.isArray(array)) {
        return [];
    }

    // Deep clone using JSON
    const newArray = JSON.parse(JSON.stringify(array));

    // Fisher-Yates shuffle
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }

    return newArray;
}