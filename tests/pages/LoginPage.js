const { I, utils, timeout, caps } = inject()
const assert = require('assert')

const locs = {
  txtEmail: { android: '~email', ios: '~email' },
  txtSenha: { android: '~senha', ios: '~senha' },
  btnEntrar: { android: '~entrar', ios: '~entrar' },
  lblErro: { android: '~lognFail', ios: '#lognFail' },
}

module.exports = {
  logar(data) {
    I.waitForElement(locs.txtEmail, timeout)
    I.fillField(locs.txtEmail, data.user)
    I.fillField(locs.txtSenha, data.pass)
    I.tap(locs.btnEntrar)
  },

  validaMsgSenhaInvalida() {
    if (caps.platformName == 'iOS') {
      I.seeElement(locs.lblErro)
    } else {
      I.seeTextEquals('Erro no login!', locs.lblErro)
    }
  }
}
