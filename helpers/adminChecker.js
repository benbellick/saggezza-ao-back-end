const token = require(`../controllers/token`);
const users = require(`../models/users`);

/**
 * Here we check if the user has the rights
 * required to perform various functions.
 */
module.exports = function (db, req) {
    return new Promise((resolve, reject) => {
        let passedToken = req.body.token || req.params.token || req.headers[`x-access-token`] || req.headers[`authorization`];
        passedToken = token === undefined ? `` : passedToken.replace(`Bearer `, ``);
        console.log(passedToken);

        const email = token.returnDecodedToken(passedToken);
        console.log(email);
        if (email) {
            users.returnSingleUser(db, email).then((user) => {
                if (user.admin) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        } else {
            reject();
        }
    });
};
