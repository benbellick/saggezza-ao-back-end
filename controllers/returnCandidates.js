const candidates = require(`../models/candidates`);
const admin = require(`../helpers/adminChecker`);

/**
 * Allows users to see all the candidates in the 
 * candidates database and all their basic information.
 */
module.exports = function (req, db) {
    let email = ``;
    if (`email` in req.body) {
        email = req.body.email;
    }
    let showDeleted = false;
    if (`showDeleted` in req.body) {
        showDeleted = req.body.showDeleted;
    }
    let showComplete = false;
    if (`showComplete` in req.body) {
        showComplete = req.body.showComplete;
    }
    return new Promise((resolve) => {
        candidates.returnCandidates(db, {
            email: email
        }, showDeleted, showComplete).then((candidateList) => {
            admin(db, req).then((isAdmin) => {
                if (isAdmin) {
                    resolve(candidateList);
                } else {
                    candList = candArrayHideSalary(candidateList);
                    resolve(candList);
                }
            });
        });
    });
};

candArrayHideSalary = function (candArray) {
    for (let i in candArray) {
        let cand = candArray[i];
        cand.salary_offer_initial = `********`;
        cand.salary_offer_final = `********`;
    }
    return candArray;
};
