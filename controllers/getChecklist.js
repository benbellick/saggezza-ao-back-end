const checklists = require(`../models/checklists`);
const candidates = require(`../models/candidates`);

// Require `PhoneNumberFormat`.
const PNF = require(`google-libphonenumber`).PhoneNumberFormat;

// Get an instance of `PhoneNumberUtil`.
const phoneUtil = require(`google-libphonenumber`).PhoneNumberUtil.getInstance();

/**
 * Table Names:
 *
 * hr_checklist
 * it_checklist
 * office_management_checklist
 * operations_checklist
 * recruiting_checklist
 * training_checklist
 */

/**
 * Allows the user to view the checklists and
 * their current status. req.body Now has an optional parameter
 * If the user inputs people: true into the object, the controller
 * will return a report of who updated the checklist to true
 * rather than the checklist itself
 */
module.exports = {
    returnChecklist: (req, db) => {
        const tables = {
            hr: {
                tableName: `hr_checklist`,
                keyName: `hr`
            },
            it: {
                tableName: `it_checklist`,
                keyName: `it`
            },
            office: {
                tableName: `office_management_checklist`,
                keyName: `office_management`
            },
            operations: {
                tableName: `operations_checklist`,
                keyName: `operations`
            },
            recruiting: {
                tableName: `recruiting_checklist`,
                keyName: `recruiting`
            },
            training: {
                tableName: `training_checklist`,
                keyName: `training`
            },
        };

        return new Promise((resolve) => {
            try {
                if (!(`people` in req.body)) {
                    req.body.people = false;
                }
                if (req.body.email.length) {
                    const department = req.body.department.toLowerCase(),
                        criteria = {
                            email: req.body.email,
                            //Checks to see if in an object or array
                            department: department ? [tables[department]] : Object.values(tables)
                        };
                    if (req.body.people) {
                        checklists.returnPeopleChecklist(db, criteria).then((response) => {
                            resolve(response);
                        });
                    } else {
                        checklists.returnChecklist(db, criteria).then((response) => {
                            resolve(response);
                        });
                    }
                } else {
                    resolve(`Missing email address.`);
                }
            } catch (error) {
                resolve(`Parameter error.`);
            }
        });
    },

    returnChecklistDone: (req, db) => {
        const tables = {
            hr: {
                tableName: `hr_checklist`,
                keyName: `hr`
            },
            it: {
                tableName: `it_checklist`,
                keyName: `it`
            },
            office: {
                tableName: `office_management_checklist`,
                keyName: `office`
            },
            operations: {
                tableName: `operations_checklist`,
                keyName: `operations`
            },
            recruiting: {
                tableName: `recruiting_checklist`,
                keyName: `recruiting`
            },
            training: {
                tableName: `training_checklist`,
                keyName: `training`
            },
        };
        return new Promise((resolve) => {
            try {
                checklists.returnChecklist(db, {
                    email: req.body.email,
                    department: Object.values(tables)
                }).then((checklist) => {
                    var count = 0;
                    var incomplete = 0;
                    var amountDone = [0, 0];
                    var result = {};
                    try {
                        for (let i in checklist) {
                            let completePerChecklist = 0;
                            let totalPerChecklist = 0;
                            for (let j in checklist[i]) {
                                if (checklist[i][j] === true) {
                                    count++;
                                    completePerChecklist++;
                                } else {
                                    incomplete++;
                                }
                                totalPerChecklist++;
                            }

                            result[i] = [completePerChecklist, totalPerChecklist];

                        }
                        amountDone = [count, count + incomplete];
                        //console.log(req.body.email, amountDone);
                        result.total = amountDone;
                        resolve(result);
                    } catch (error) {
                        resolve(`Sorry, there was an error.`);

                    }

                }).catch(() => {
                    resolve(`error`);
                });
            } catch (error) {
                resolve(error);
            }

        });

    }

};
