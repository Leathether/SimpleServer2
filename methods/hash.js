import bycrypt from 'bcryptjs';

export default function hashPassword(password, salt) {
    const hashedPassword = bycrypt.hashSync(password, salt);
    return hashedPassword;
}
