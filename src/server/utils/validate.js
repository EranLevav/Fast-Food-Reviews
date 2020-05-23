const { serverError, clientError, successResponse } = require('./serverResponses');
// Error Messages
const UNIQUE_ERROR_MSG = 'Error: more than 1 user with the same ID in the db';
const EXISTS_ERROR = 'Error: username or password are incorrect';
const REQUEST_PARAM_ERROR = 'Error: one of the following fields are blank';
const ALREADY_EXIST_ERROR = 'Error: an account already exists';
const NOT_VALID_PASSWORD = 'Error: password is incorrect';
module.exports = {
    isUnique: (users, res) => {
        if (users.length > 1) {
            console.log(UNIQUE_ERROR_MSG);
            serverError(res);
            return false
        }
        return true;
    },
    isExist: (users, res) => {
        if (users.length === 0) {
            console.log(EXISTS_ERROR);
            clientError(res, EXISTS_ERROR);
            return false;
        }
        return true;
    },
    isAlreadyExists: (users, res) => {
        if (users.length > 0) {
            console.log(ALREADY_EXIST_ERROR);
            clientError(res, ALREADY_EXIST_ERROR);
            return true;
        }
        return false;
    },
    validPassword: (user,password, res) => {
        if (!user.validPassword(password)) {
            console.log(NOT_VALID_PASSWORD);
            clientError(res, NOT_VALID_PASSWORD);
            return false;
        }
        return true;
    },
    isRequestValid:(params,res) => {
        const paramsKeys = Object.keys(params);
        for(let key of paramsKeys){
            if(!params[key]) {
                console.log(`${REQUEST_PARAM_ERROR}: ${paramsKeys}`);
                clientError(res, `${REQUEST_PARAM_ERROR}: ${paramsKeys}`);
                return false;        
            }
        }
        return true;
    },
};

