const checklists = require(`../models/checklists`);
const candidates = require(`../models/candidates`);
const getChecklist = require(`../controllers/getChecklist`);

module.exports = function (req, db) {
    return new Promise((resolve) => {
        new Promise((resolve, reject) => {
            try {
                getChecklist.returnChecklistDone(req, db)
                    .then((checklist) => {
                        resolve(checklist);
                    });
            } catch (error) {
                reject({
                    status: -1,
                    message: `error or email not found`,
                    error: error
                });
            }
        }).then((checklist) => {
            let total = checklist.total;
            if (total[0] === total[1] && total[0] > 0) {
                //should maybe add feature that checks if completed is already true so
                //that api call isn't made
                candidates.editCandidateCompleteness(db, req.body.email, true).then(() => {
                    resolve({
                        status: 1,
                        complete: true,
                        fraction: total
                    });
                });
            } else {
                candidates.editCandidateCompleteness(db, req.body.email, false).then(() => {
                    resolve({
                        status: 1,
                        complete: false,
                        fraction: total
                    });
                });
            }
        }).catch((error) => {
            resolve(error);
        });
    });
};
