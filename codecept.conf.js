const { setHeadlessWhen, setCommonPlugins } = require('@codeceptjs/configure');
const path = require('path')
require('dotenv').config({ path: '.env' })
// turn on headless mode when running with HEADLESS=true environment variable
// export HEADLESS=true && npx codeceptjs run
setHeadlessWhen(process.env.HEADLESS);
const proxy = require("node-global-proxy").default;
// enable all common plugins https://github.com/codeceptjs/configure#setcommonplugins
setCommonPlugins();

const capabilities = require('./resources/conf/' + [process.env.MODE] + '/caps.json')[process.env.CAPS];

if (process.env.PROXY_HTTPS !== '') {
  proxy.setConfig({
    https: process.env.PROXY_HTTPS,
  });
  proxy.start()
}

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

exports.config = {
  name: 'codeceptjs-appium-bdd',
  translation: 'pt-BR',
  output: './output',
  timeout: 10000, // limit all tests in all suites
  helpers: {
    Appium: process.env.MODE == 'local' ?
      // Local
      {
        app: path.join(__dirname, "/resources/app", process.env.APP),
        platform: capabilities.platformName,
        capabilities: capabilities,
      }
      :
      // Remote
      {
        protocol: 'https',
        host: 'saucelabs.com',
        port: 443,
        path: '/wd/hub',
        user: process.env.SAUCE_USER,
        key: process.env.SAUCE_KEY,
        platform: capabilities.platformName,
        app: process.env.APP,
        capabilities: capabilities,
      },
    REST: {
      endpoint: require('./resources/conf/api/' + process.env.ENV + '.json').urlBase
    },
    JSONResponse: {},
    Hooks: {
      require: './helpers/hooks.js'
    },
    ChaiWrapper: {
      require: "codeceptjs-chai"
    }
  },
  bootstrap: null,
  mocha: {
    mochawesome: {
      stdout: './output/console.log',
      options: {
        reportDir: './output',
        reportFilename: 'report'
      }
    },
    reporterOptions: {
      'codeceptjs-cli-reporter': {
        stdout: '-',
        options: {
          verbose: true,
          steps: true,
        }
      },
      'mocha-junit-reporter': {
        stdout: './output/console.log',
        options: {
          mochaFile: './output/result.xml',
          attachments: true //add screenshot for a failed test
        }
      }
    }
  },

  gherkin: {
    features: './tests/**/*.feature',
    steps: './tests/**/*Steps.js'
  },

  include: {
    I: './helpers/components',
    utils: './helpers/Utils',
    faker: '@faker-js/faker/locale/pt_BR',
    timeout: require('./resources/conf/' + [process.env.MODE] + '/caps.json')[process.env.CAPS].newCommandTimeout,
    caps: capabilities, // Para uso de diversificação de IOS e ANDROID, função nativa interefere no allure
    api: './resources/conf/' + process.env.ENV + '.json', // Para usar os dados do arquivo de configuracao
  },

  plugins: {
    // Integracao com Jira (Zephyr)
    zephyr: {
      enabled: process.env.TOKEN_BEARER != '' ? true : false,
      jiraBaseUrl: 'https://jira',
      projectKey: 'EMP',
      testVersion: `${process.env.TEST_VERSION}`,
      testPlataforme: `${process.env.CAPS}`,
      testEnvironment: `${process.env.ENV}`,
      require: "./plugins/zephyr/ZephyrPlugin",
    },
    // Integracao com Sauces labs
    wdio: {
      enabled: (process.env.MODE == 'local' ? false : true),
      services: ['sauce'],
      user: process.env.SAUCE_USER,
      key: process.env.SAUCE_KEY,
      'sauce:options': {
        build: 'Testing Automation',
      },
    },
    // Para uso do Allure report
    allure: {
      enabled: true,
      require: '@codeceptjs/allure-legacy',
      outputDir: "./output"
    },
    stepByStepReport: {
      enabled: true,
      screenshotsForAllureReport: true,
      ignoreSteps: ['grab*', 'wait*', 'aguardo*', 'switch*'],
      output: "./output",
      deleteSuccessful: false,
      disableScreenshotOnFail: false
    },
    // Habilitar o ultimo print em caso de falha
    screenshotOnFail: {
      enabled: true
    },
    // Para usar a funcão retry no script de teste
    retryTo: {
      enabled: true,
      pollInterval: 500,
    },
    // Para executar o retry automatico nos steps em caso de erro
    retryFailedStep: {
      enabled: true,
      factor: 1,
      retries: require('./resources/conf/' + [process.env.MODE] + '/caps.json')[process.env.CAPS].newCommandTimeout,
      ignoredSteps: [
        '*wait*', // ignore all wait steps
        /wait/, // ignore all steps with a wait in it (by regexp)
        '*aguardo*', // ignore all aguardo steps
        /aguardo/, // ignore all steps with a aguardo in it (by regexp)
        '*grab*',
        /grab/,
        '*Grab*',
        /Grab/
      ]
    },
    // Para tentar fazer uma ação com retorno boolean em vez de erro
    // Ex: const result = await tryTo(() => I.see('Welcome'));
    tryTo: {
      enabled: true
    }
  }
}