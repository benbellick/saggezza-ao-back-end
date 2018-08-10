const candidates = require(`../models/candidates`);
const admin = require(`../helpers/adminChecker`);
const checkParams = require(`../helpers/checkParams`);
const convert = require(`../helpers/convert`);

/**
 * Allows users to edit candidates after specifying which
 * components they would like to edit.
 */
module.exports = function (req, db) {
    return new Promise((resolve) => {
        console.log(req.body);
        let currentEmail,
            newEmail;
        try {
            console.log(req.body);
            candidateInfo = checkParams(convert.sqlToJs(req.body));
            currentEmail = candidateInfo.candidate.email.trim().toLowerCase();
            //newEmail = req.body.new_email.trim().toLowerCase();
        } catch (err) {
            resolve(`Email parameter error.`);
        }

        new Promise((resolve, reject) => {
            if (candidateInfo.report.total) {
                candidates.isExistingCandidate(db, currentEmail).then((isCandidate) => {
                    if (!isCandidate) {
                        reject(`Unable to locate candidate.`);
                    } else {
                        admin(db, req).then((isAdmin) => {
                            if (isAdmin) {
                                candidates.updateCandidate(db, currentEmail, convert.JsToSql(candidateInfo.candidate)).then((updateSuccess) => {
                                    console.log(`check this out`, candidateInfo);
                                    if (updateSuccess) {
                                        resolve(`Candidate updated.`);
                                    } else {
                                        reject(`Unable to update candidate.`);
                                    }
                                });
                            } else {
                                reject(`Unauthroized`);
                            }
                        }).catch(() => {
                            resolve(`No email to authroize`);
                        });
                    }
                });
            } else {
                resolve(`Not every item is checked`);
            }
        }).then((response) => {
            /* if (newEmail !== currentEmail) {
                candidates.updateCandidateEmail(db, currentEmail, newEmail).then((emailUpdated) => {
                    if (emailUpdated) {
                        resolve(`Candidate profile and email updated.`);
                    } else {
                        resolve(`Candidate profile updated, but unable to update email.`);
                    }
                });
            } else {
                resolve(response);
            } */
            resolve({
                status: 1,
                message: response,
                candidate: candidateInfo.candidate,
                report: candidateInfo.report
            });
        }).catch((response) => {
            resolve({
                status: -1,
                message: response,
                candidate: candidateInfo.candidate,
                report: candidateInfo.report
            });
        });
    });
};
