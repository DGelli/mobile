const Helper = require('@codeceptjs/helper')
const { container, ecorder, event, output, helper } = require('codeceptjs')
const execSync = require('child_process').execSync
const utf8 = { encoding: 'utf-8' }
const utils = require('./Utils')
var validacao = ''

class hooks extends Helper {

  _init() { // before all tests
    console.log('*************************************')
    console.log('******* Variáveis de Ambiente *******')
    console.log('RETRY: ' + process.env.RETRY)
    console.log('ENV: ' + process.env.ENV)
    console.log('MODE: ' + process.env.MODE)
    console.log('CAPS: ' + process.env.CAPS)
    console.log('APP file: ' + process.env.APP)
    console.log('*************************************')
    try {
       execSync('rm -rfv output/', utf8)
    } catch { }
  }
  _before(test) { // before a test
    // console.log('Information helpers:', container.helpers())
    // console.log('Information support:', container.support())
    // console.log('Information events:', container.event())
    test.retries(process.env.RETRY)
    console.log('--------------------------------Start----------------------------------')
    console.log('------------' + test.title + '------------')
    let allure = codeceptjs.container.plugins('allure')
    try {
      allure.addParameter('0', 'Mode', process.env.MODE)
      allure.addParameter('0', 'Device', process.env.CAPS)
    } catch (error) {
    }
  }
  _after() { // after a test
    console.log('--------------------------------End----------------------------------')
  }
  _beforeStep() { } // before each step
  _afterStep() { // after each step
    utils.addEvidenciaApiAllure()
  }
  _beforeSuite() { } // before each suite
  _afterSuite() { } // after each suite
  _passed() { } // after a test passed
  _failed() { } // after a test failed
  _finishTest() { // after all tests
    //  execSync('allure serve output', utf8)
  }
}
module.exports = hooks
