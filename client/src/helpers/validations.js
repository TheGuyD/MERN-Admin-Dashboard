const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const EMAIL_REGEX = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const PHONE_REGEX = /^[0-9]{10,15}$/;
const NAME_REGEX = /^[a-zA-Z]{2,}$/;

export { USER_REGEX, EMAIL_REGEX, PWD_REGEX, PHONE_REGEX, NAME_REGEX };
