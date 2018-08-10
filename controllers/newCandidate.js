const candidates = require(`../models/candidates`);
const checkParams = require(`../helpers/checkParams`);

/**
 * Creates a new candidate from scratch if they
 * are not created intially through JazzHR.
 */
module.exports = function (req, db) {
    return new Promise((resolve) => {
        new Promise((resolve, reject) => {
            try {
                /**
                 * You forgot to intialize this variable.
                 *
                 * Incorrect:
                 * candidateInfo = checkParams(req.body);
                 *
                 * Correct: let candidateInfo = checkParams(req.body);
                 */
                let candidateInfo = checkParams(req.body);
                console.log(`blah`, candidateInfo);

                if (candidateInfo.report.total) {
                    candidates.isExistingCandidate(db, candidateInfo.candidate.email).then((isExisting) => {
                        if (isExisting) {
                            reject({
                                message: `Candidate already exists.`,
                                cand: candidateInfo
                            });
                        } else {
                            candidates.createCandidate(db, candidateInfo).then((createdCandidate) => {
                                if (createdCandidate) {
                                    resolve({
                                        cand: candidateInfo
                                    });
                                } else {
                                    reject({
                                        cand: candidateInfo
                                    });
                                }
                            });
                            resolve({
                                status: 1,
                                candidate: candidateInfo
                            });
                        }
                    });
                } else {
                    reject({
                        cand: candidateInfo
                    });
                }
            } catch (error) {
                console.log(error);
                reject(`Unable to create candidate`);
            }
        }).then((response) => {
            response.status = 1;
            resolve(response);
        }).catch((response) => {
            response.status = -1;
            resolve(response);
        });
    });
};
