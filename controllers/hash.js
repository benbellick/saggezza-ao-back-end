const bcrypt = require(`bcrypt`);

/**
 * Hashes the user's password.
 */
module.exports = {
    encrypt: (password) => {
        return new Promise((resolve) => {
            bcrypt.hash(password, 10).then((hash) => {
                resolve(hash);
            }).catch(() => {
                resolve(false);
            });
        });
    },
    compare: (password, hash) => {
        return new Promise((resolve) => {
            bcrypt.compare(password, hash).then((passwordMatch) => {
                if (passwordMatch) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }).catch(() => {
                resolve(false);
            });
        });
    },

    random: () => {
        return new Promise((resolve) => {
            let number = Math.random * 1000;
            bcrypt.hash(number.toString(), 10).then((hash) => {
                resolve(hash);
            }).catch(() => {
                resolve(false);
            });
        });
    }
};
