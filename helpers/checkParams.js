// Require `PhoneNumberFormat`.
//const PNF = require(`google-libphonenumber`).PhoneNumberFormat;

// Get an instance of `PhoneNumberUtil`.
//const phoneUtil = require(`google-libphonenumber`).PhoneNumberUtil.getInstance();
const libPhone = require(`libphonenumber-js`);

module.exports = function (candObj) {
    //console.log(`important test`, libPhone.isValidNumber(``, `US`));
    console.log(candObj);
    let deleted = candObj.deleted;
    console.log(deleted, `deleted`);
    let completed = candObj.completed;
    console.log(completed, `completed`);
    let report = {};
    let email = candObj.email;
    let firstName = candObj.firstName;
    let lastName = candObj.lastName;
    let phonePrimary = candObj.phonePrimary;
    if (phonePrimary == null) {
        phonePrimary = ``;
    }
    let phoneSecondary = candObj.phoneSecondary;
    if (phoneSecondary == null) {
        phoneSecondary = ``;
    }
    let offerAccepted = stringToBool(candObj.offerAccepted);
    let offerNegotiated = stringToBool(candObj.offerNegotiated);
    let salaryInitial = parseFloat(candObj.salaryInitial.toString().replace(/[^0-9.]/g, ``));
    let salaryFinal = parseFloat(candObj.salaryFinal.toString().replace(/[^0-9.]/g, ``));
    let title = candObj.title;
    let isRemote = stringToBool(candObj.isRemote);
    let startDate = candObj.startDate;
    let applicantId = candObj.applicantId;
    if (validateEmail(email)) {
        report.email = true;
    } else {
        report.email = false;
    }
    if (validateName(firstName)) {
        report.firstName = true;
    } else {
        report.firstName = false;
    }
    if (validateName(lastName)) {
        report.lastName = true;
    } else {
        report.lastName = false;
    }
    console.log(`before`, phonePrimary);
    console.log(`after`, libPhone.formatNumber(phonePrimary, `E.164`));
    if (libPhone.isValidNumber(phonePrimary, `US`)) {
        report.phonePrimary = true;
    } else {
        report.phonePrimary = false;
    }
    console.log(phoneSecondary);
    if (libPhone.isValidNumber(phoneSecondary, `US`)) {
        report.phoneSecondary = true;
    } else {
        if (phoneSecondary.length === 0 || phoneSecondary === ``) {
            report.phoneSecondary = true;
            phoneSecondary = ``;
        } else {
            report.phoneSecondary = false;
        }
    }
    if (validateBool(offerAccepted)) {
        report.offerAccepted = true;
    } else {
        if (offerAccepted.length === 0) {
            report.offerAccepted = true;
            offerAccepted = true;
        } else {
            report.offerAccepted = false;
        }
    }
    if (validateBool(offerNegotiated)) {
        report.offerNegotiated = true;
    } else {
        if (offerNegotiated.length === 0) {
            offerNegotiated = true;
            report.offerNegotiated = true;
        } else {
            report.offerNegotiated = false;
        }
    }
    if (validateSalary(salaryInitial)) {
        report.salaryInitial = true;
    } else {
        if (candObj.salaryInitial === ``) {
            salaryInitial = -1;
            report.salaryInitial = true;
        } else {
            report.salaryInitial = false;
        }
    }
    if (validateSalary(salaryFinal)) {
        report.salaryFinal = true;
    } else {
        if (candObj.salaryFinal === ``) {
            salaryFinal = -1;
            report.salaryFinal = true;
        } else {
            report.salaryFinal = false;
        }
    }
    if (validateBool(isRemote)) {
        report.isRemote = true;
    } else {
        if (isRemote.length === 0) {
            report.isRemote = true;
            isRemote = false;
        } else {
            report.isRemote = false;
        }
    }
    if (validateDate(startDate)) {
        report.startDate = true;
    } else { //do we want a default?
        if (startDate === ``) {
            report.startDate = true;
            startDate = `01-01-1800`;
        } else {
            report.startDate = false;
        }
    }
    if (applicantId) {
        report.applicantId = true;
    } else {
        applicantId = `NotAJazzImport`;
        report.applicantId = true;
    }
    if (validateTitle(title)) {
        report.title = true;
    } else {
        report.title = false;
    }
    report.total = true;
    for (let test in report) {
        if (!report[test]) {
            report.total = false;
        }
    }
    return ({
        candidate: {
            email: email.toLowerCase().trim(),
            firstName: firstName,
            lastName: lastName,
            phonePrimary: phonePrimary,
            phoneSecondary: phoneSecondary,
            offerAccepted: offerAccepted,
            offerNegotiated: offerNegotiated,
            salaryInitial: salaryInitial,
            salaryFinal: salaryFinal,
            title: title,
            isRemote: isRemote,
            startDate: startDate,
            applicantId: applicantId,
            deleted: deleted,
            completed: completed
        },
        report: report
    });

};

function validateEmail (email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function validatePhone (number, valid, allowDefault = false) {
    /* if (phoneUtil.isValidNumber(number)) {
        return true;
        //number = phoneUtil.format(number, PNF.E164);
    } else {
        return false;
    } */
    return false;

}

function validateName (name) {
    if (typeof name === `string` && name.length > 0) {
        return true;
    } else {
        return false;
    }
}

function validateBool (bool) {
    if (typeof bool === `boolean`) {
        return true;
    } else {
        return false;
    }
}

function validateSalary (salary) {
    if (typeof salary === `number` && salary >= 0) {
        return true;
    } else {
        return false;
    }
}

function validateTitle (title) {
    //not really any validation here, but just put here to be
    //consistent and offer ability to customize
    if (title.length > 0) {
        return true;
    } else {
        return false;
    }

}

function validateDate (date) {
    var re = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/;
    return re.test(date);
}

function stringToBool (string) {
    if (typeof string === `string` && string.length > 0) {
        return (string == `true`);
    } else {
        return ``;
    }
}
