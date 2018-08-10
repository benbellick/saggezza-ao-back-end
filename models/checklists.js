const candidates = require(`../models/candidates`);

module.exports = {
    alterChecklist: (db, info) => {
        return new Promise((resolve) => {
            db.query(`UPDATE ${info.department} SET ${info.checklistStep} = ${info.check} WHERE email='${info.email}';`).then(() => {
                resolve(true);
            }).catch(() => {
                resolve(false);
            });
        });
    },
    /*Function that should save the person who flips the checklist
     */
    recordCheckUser: (db, info, userEmail) => {
        return new Promise((resolve) => {
            db.query(`UPDATE ${info.department} SET ${info.checklistStep} = '${userEmail}' WHERE email='${info.email}';`)
                .then(() => {
                    resolve(true);
                }).catch(() => {});
        });
    },

    returnPeopleChecklist: (db, criteria) => {
        const email = criteria.email.trim().toLowerCase();
        let checklist = {};
        return new Promise((resolve) => {
            const department = criteria.department;
            new Promise((resolve, reject) => {
                candidates.isExistingCandidate(db, email)
                    .then((isExisting) => {
                        if (isExisting) {
                            resolve(true);
                        } else {
                            reject(false);
                        }
                    });
            }).then(() => {
                let queryList = [];

                for (let i in department) {
                    queryList[i] = new Promise((resolve) => {
                        db.query(`SELECT * FROM ${department[i].tableName + `_people`} WHERE email='${email}';`)
                            .then((response) => {
                                if (response.rows.lengh > 1) {
                                    resolve({});
                                } else {
                                    checklist[department[i].keyName] = response.rows[0];
                                    resolve(response.rows[0]);
                                }
                            }).catch(() => {
                                resolve({});
                            });
                    });
                }

                Promise.all(queryList).then(() => {

                    // Strip out email key from all entries.
                    for (let i of Object.keys(checklist)) {
                        delete checklist[i].email;
                    }
                    resolve(checklist);
                    console.log(checklist);
                }).catch(() => {
                    resolve({});
                });
            }).catch(() => {
                resolve({});
            });
        });
    },

    returnChecklist: (db, criteria) => {
        const email = criteria.email.trim().toLowerCase();

        let checklist = {};

        return new Promise((resolve) => {
            const department = criteria.department;

            new Promise((resolve, reject) => {
                candidates.isExistingCandidate(db, email)
                    .then((isExisting) => {
                        if (isExisting) {
                            resolve(true);
                        } else {
                            reject(false);
                        }
                    });
            }).then(() => {
                let queryList = [];

                for (let i in department) {
                    queryList[i] = new Promise((resolve) => {
                        db.query(`SELECT * FROM ${department[i].tableName} WHERE email='${email}';`)
                            .then((response) => {
                                if (response.rows.lengh > 1) {
                                    reject({});
                                } else {
                                    checklist[department[i].keyName] = response.rows[0];
                                    resolve(response.rows[0]);
                                }
                            }).catch(() => {
                                reject({});
                            });
                    });
                }

                Promise.all(queryList).then(() => {

                    // Strip out email key from all entries.
                    for (let i of Object.keys(checklist)) {
                        delete checklist[i].email;
                    }
                    resolve(checklist);
                }).catch(() => {
                    resolve({});
                });
            }).catch(() => {
                resolve({});
            });
        });
    },

    returnApplicabilityChecklist: (db, candidate) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM checklist_applicability WHERE email='${candidate.email.trim().toLowerCase()}';`)
                .then((response) => {
                    resolve(response.rows);
                }).catch(() => {
                    reject(`error`);
                });
        });
    },

    rebuildChecklistForDeletedCand: (db, email) => {
        return new Promise((resolve, reject) => {
            db.query(`
            INSERT INTO recruiting_checklist (email) VALUES
            ('${email}');
            INSERT INTO it_checklist (email) VALUES
            ('${email}');
            INSERT INTO office_management_checklist (email) VALUES
            ('${email}');
            INSERT INTO operations_checklist (email) VALUES
            ('${email}');
            INSERT INTO hr_checklist (email) VALUES
            ('${email}');
            INSERT INTO training_checklist (email) VALUES
            ('${email}');
            INSERT INTO checklist_applicability (email) VALUES
            ('${email}');
            `)
                .then(() => {
                    db.query(`
                INSERT INTO recruiting_checklist_people (email) VALUES
                ('${email}');
                INSERT INTO it_checklist_people (email) VALUES
                ('${email}');
                INSERT INTO office_management_checklist_people (email) VALUES
                ('${email}');
                INSERT INTO operations_checklist_people (email) VALUES
                ('${email}');
                INSERT INTO hr_checklist_people (email) VALUES
                ('${email}');
                INSERT INTO training_checklist_people (email) VALUES
                ('${email}');
                `)
                        .then(() => {
                            resolve(true);
                        }).catch(() => {
                            resolve(`error`);
                        });
                }).catch(() => {
                    resolve(`error`);
                });
        });
    }
};
