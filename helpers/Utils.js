const { container } = require('codeceptjs')
let random_number = require('random-number');
let cpf = require("cpf_cnpj").CPF;
let cnpj = require("cpf_cnpj").CNPJ;
let datetime = require('node-datetime');
let datetimeContornaBug = require('node-datetime/src/datetime');

/**
 * Adicionar evidencia do request e response no report allure 
 */
let validacao = '';
exports.addEvidenciaApiAllure = () => {
    try {
        let url = container.helpers().JSONResponse.response.config.baseURL
        let method = container.helpers().JSONResponse.response.config.method
        if (validacao != container.helpers().JSONResponse.response) {
            let request = container.helpers().JSONResponse.response.config;
            let response = {
                'status': container.helpers().JSONResponse.response.status,
                'headers': container.helpers().JSONResponse.response.headers,
                'body': container.helpers().JSONResponse.response.data
            }
            console.log(`[${method}] ${url}`)
            console.log('************Request************')
            console.log(request)
            console.log('************Response***********')
            console.log(response)

            let allure = codeceptjs.container.plugins('allure');
            allure.addAttachment(
                'Request params',
                JSON.stringify(request, null, 2),
                'application/json'
            );
            allure.addAttachment(
                'Response body',
                JSON.stringify(response, null, 2),
                'application/json'
            );
        }
    } catch (error) { }
    validacao = container.helpers().JSONResponse.response
}

/**
 * Generate random string
 * 
 * @param {int} length integer
 * @returns random string
 */
exports.generateRandomString = (length) => {
    let result = ''
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    let charactersLength = characters.length
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
};

/**
 * Generate randon number between two values
 * 
 * @param {int} minimo interger, default = 0
 * @param {int} maximo interger, default = 1000
 * @param {boolean} inteiro true or false, default true
 * @returns number
 */
exports.getNumber = (minimo, maximo, inteiro) => {
    var options = {
        min: minimo == undefined ? 0 : minimo,
        max: maximo == undefined ? 1000 : maximo,
        integer: inteiro == undefined ? true : inteiro
    }
    return (random_number(options))
};

/**
 * Gera data com o formato desejado
 * 
 * @param {string} fomratDate: Format	Meaning
 *                              y	The last 2 digit of the year
 *                              Y	Year
 *                              m	Month with leading 0
 *                              n	Shortened name of a month
 *                              f	Full name of a month
 *                              d	Date with leading 0
 *                              D	Formatted date (1th, 2nd, 3rd, 4th...)
 *                              H	Hours with leading 0 in 24 hours format
 *                              I	Hours with leading 0 in 12 hours format
 *                              M	Minutes with leading 0
 *                              S	Seconds with leading 0
 *                              N	Milliseconds with leading 0
 *                              p	Period (AM or PM)
 *                              w	Shortened name of the week day
 *                              W	Full name of the week day
 * @param {int} addDays 0 to now or +or-
 * @returns date
 */
exports.getDate = (formatDate, addDays) => {
    addDays = (addDays == undefined ? 0 : addDays)
    formatDate = (formatDate == undefined ? 'd/m/Y' : formatDate)
    //Customizar nomes
    datetime.setWeekNames(['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'])
    datetimeContornaBug.setShortMonthNames(['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'])
    let dt = datetime.create()
    dt.offsetInDays(addDays)
    return dt.format(formatDate)
};

/**
 * Gera CPF
 * @param {boolean} formatting 
 * @returns cpf 
 */
exports.getCPF = (formatting) => {
    return (cpf.generate(formatting));
};

/**
 * Gera CNPJ
 * @param {boolean} formatting 
 * @returns cnpj
 */
exports.getCNPJ = (formatting) => {
    return (cnpj.generate(formatting));
};


/**
 * Get Data 
 * @param {string} relativePath 
 * @returns object from json file
 */
exports.getData = (relativePath) => {
    return require('./../resources/data/' + process.env.ENV + '/' + process.env.MODE + '/'+ process.env.CAPS + '/'+ relativePath + '.json');
};

/**
* Format word - first character UpperCase and rest of character lowercase
* 
* @param {string} word 
* @returns {string} first character UpperCase and rest of character lowercase
*/
exports.formatWord = (word) => {
    let newWord
    for (let index = 0; index < word.length; index++) {
        const element = word[index]
        if (index == 0) {
            newWord = element.toUpperCase()
        }
        if (index >= 1) {
            newWord = newWord.concat(element.toLowerCase())
        }
    }
    return (newWord)
};

/**
 * Remover todos os caracteres não numericos da string
 * 
 * @param {string} text 
 * @returns 
 */
exports.removeAllCharacters = (text) => {
    return text.replace(/[^0-9]/g, '');
};

/**
 * Remover todos os caracteres numericos da string
 * 
 * @param {string} text 
 * @returns 
 */
exports.removeAllNumbers = (text) => {
    return text.replace(/[^A-Z]/g, '');
}