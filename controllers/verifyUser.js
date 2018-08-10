const users = require(`../models/users`);

module.exports = function(req, db) {
    return new Promise((resolve) => {
        const email, hash;
        try {
            email = req.body.email;
            hash = req.body.hash;
        } catch (error) {
            reject({
                status: -1,
                message: "Email and/or hash not recieved"
            })
        }
        users.returnSingleUser(db, email)
            .then((candidate) => {
                let dbHash = candidate.hash_verify;
                if (hash === dbHash) {
                    users.verifyUser(db, email)
                        .then((success) => {
                            if (success) {
                                resolve({
                                    status: 1,
                                    email: email,
                                    message: "User verified"
                                });
                            } else {
                                resolve({
                                    status: -1,
                                    message: "Error"
                                });
                            }
                        })
                } else {
                    resolve({
                        status: -1,
                        message: "Hash did not match"
                    });
                }
            })
    });

}
