const candidates = require(`../models/candidates`);
const checklist = require(`../models/checklists`);

module.exports = function (req, db) {
    return new Promise((resolve) => {
        let email;
        try {
            email = req.body.email;
        } catch (error) {
            resolve(`error`);
        }
        new Promise((resolve, reject) => {
            console.log(email);
            if (email.length) {
                candidates.isExistingCandidate(db, email).then((isExisting) => {
                    if (isExisting) {
                        candidates.returnCandidates(db, {
                            email: email
                        }, true).then((output) => {
                            console.log(`look`, output);
                            if (output[0].deleted) {
                                resolve(email);
                            } else {
                                reject({
                                    status: -1,
                                    message: `candidate was never deleted`
                                });
                            }
                        });
                    } else {
                        reject({
                            status: -1,
                            message: `candidate does not exist`
                        });
                    }
                });
            } else {
                reject({
                    status: -1,
                    message: `No email given`
                });
            }
        }).then((email) => {
            console.log(`then`);
            candidates.allowImportAgain(db, {
                email: email
            }).then(() => {
                console.log(`test`);
                checklist.rebuildChecklistForDeletedCand(db, email)
                    .then(() => {
                        console.log(`heleys`);
                        resolve({
                            status: 1,
                            email: email
                        });
                    });
            }).catch((output) => {
                resolve(output);
            });
        }).catch((output) => {
            console.log(`catch`);
            resolve(output);
        });
    });
};
