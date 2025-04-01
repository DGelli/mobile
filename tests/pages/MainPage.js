const { I, timeout } = inject()

const locs = {
  txtCodigo: { android: '~codigo', ios: '~codigo' },
  txtAluno: { android: '~aluno', ios: '~aluno' },
  btnSalvar: { android: 'Salvar', ios: '~salvar' },
  txtSearch: { android: '~search', ios: '~search' },
  lblCadastro: { android: '1234 - Teste', ios: '#1234' }
}

module.exports = {
  cadastrarAluno() {
    I.waitForElement(locs.txtCodigo, timeout)
    I.fillField(locs.txtCodigo, '1234')
    I.fillField(locs.txtAluno, 'Teste')
    I.tap(locs.btnSalvar)
  },

  confirmarCadastro() {
    I.fillField(locs.txtSearch, 'Teste')
    I.seeElement(locs.lblCadastro)
  }
}