const crypto = require('crypto');

const secretKey = crypto.randomBytes(64).toString('hex');
const refreshTokenSecretKey = crypto.randomBytes(64).toString('hex');
const verificationTokenSecretKey = crypto.randomBytes(64).toString('hex');
const resetPasswordTokenSecretKey = crypto.randomBytes(64).toString('hex');

console.table({ secretKey, refreshTokenSecretKey, verificationTokenSecretKey, resetPasswordTokenSecretKey });
