/**
 * This function should convert the SQL notation (e.g. '_') to the js notation with camelcase
 */

module.exports = {

    sqlToJs: (candObj) => {
        if (candObj.start_date.length > 10) {
            candObj.start_date = candObj.start_date.substring(0, 10);
        }
        return {
            email: candObj.email,
            firstName: candObj.first_name,
            lastName: candObj.last_name,
            phonePrimary: candObj.phone_primary,
            phoneSecondary: candObj.phone_secondary,
            offerNegotiated: candObj.offer_negotiated,
            salaryInitial: candObj.salary_offer_initial,
            salaryFinal: candObj.salary_offer_final,
            title: candObj.title,
            isRemote: candObj.is_remote,
            startDate: candObj.start_date,
            applicantId: candObj.applicant_id,
            completed: candObj.completed,
            deleted: candObj.deleted
        };
    },

    JsToSql: (candObj) => {
        if (candObj.startDate.length > 10) {
            candObj.startDate = candObj.startDate.substring(0, 10);
        }
        return {
            email: candObj.email,
            first_name: candObj.firstName,
            last_name: candObj.lastName,
            phone_primary: candObj.phonePrimary,
            phone_secondary: candObj.phoneSecondary,
            offer_negotiated: candObj.offerNegotiated,
            salary_offer_initial: candObj.salaryInitial,
            salary_offer_final: candObj.salaryFinal,
            title: candObj.title,
            is_remote: candObj.isRemote,
            start_date: candObj.startDate,
            applicant_id: candObj.applicantId,
            completed: candObj.completed,
            deleted: candObj.deleted
        };

    }
};
