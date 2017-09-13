// Validates the length of arr is larger than minimum
export function validatesMinCount(arr, min) {
  if (arr.length < min)
    return false;
  else
    return true;
}

// validate field existence
// return undefined if valid, error message if invalid
export function validateExistence(str) {
  if (!str)
    return "required";
}

// validate string minimum length
// return undefined if valid, error message if invalid
export function validateMinLength(str, min) {
  if (str.length < min)
    return "the minimum length is " + min;
}

export function validateMaxLength(str, max) {
  if (str.length > max)
    return "the maximum length is " + max;
}
