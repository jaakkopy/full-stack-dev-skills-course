
const successMsg = (msg) => {
    return {success: true, msg};
}

const failureMsg = (msg) => {
    return {success: false, msg};
}

module.exports = {successMsg, failureMsg};