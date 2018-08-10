const getChecklist = require(`./getChecklist`);
const checklist = require(`../models/checklists`);
const token = require(`../controllers/token`);

/** 
 * Allows users to update the checklist and 
 * actually check complete events off.
 */
module.exports = function (req, db) {
    return new Promise((resolve) => {
        let passedToken = req.body.token || req.params.token || req.headers[`x-access-token`] || req.headers[`authorization`];
        passedToken = token === undefined ? `` : passedToken.replace(`Bearer `, ``);

        const email = token.returnDecodedToken(passedToken);
        if (req.body.department) {
            getChecklist.returnChecklist(req, db)
                .then(() => {
                    let info = req.body;
                    let temp = info.department;
                    info.department = temp + `_checklist`;
                    checklist.alterChecklist(db, info)
                        .then((response) => {
                            info.department = info.department + `_people`;
                            let userEmail = info.check ? email : ``;
                            checklist.recordCheckUser(db, info, userEmail).then((response) => {
                                resolve(response);
                            }).catch(() => {
                                resolve(`error`);
                            });
                        }).catch(() => {
                            resolve(`error`);
                        });
                }).catch((output) => {
                    resolve(`caught an error`);
                });
        } else {
            resolve(`enter a department`);
        }
    });
};
