const candidates = require(`../models/candidates`);

module.exports = function (req, db) {
    return new Promise((resolve) => {
        new Promise((resolve, reject) => {
            let email = req.body.email;
            console.log(`look`, email);
            candidates.isExistingCandidate(db, email)
                .then((isExisting) => {
                    if (isExisting) {
                        candidates.returnCandidates(db, {
                            email: email
                        }, true)
                            .then((candidate) => {
                                resolve(candidate[0]);
                            }).catch(() => {
                                reject();
                            });
                    } else {
                        reject({
                            status: -1,
                            message: `candidate could not be found`
                        });
                    }
                }).catch(() => {
                    reject();
                });
        }).then((candidate) => {
            if (candidate.deleted) {
                candidates.deleteFromCandidate(db, candidate.email)
                    .then((wasDeleted) => {
                        if (wasDeleted) {

                            resolve({
                                status: 1
                            });
                        } else {
                            resolve({
                                status: -1
                            });
                        }
                    });
            } else {
                resolve({
                    stauts: -1,
                    message: `Candidate was never deleted prior`
                });
            }
        }).catch(() => {
            resolve({
                status: -1
            });
        });
    });
};
