const loginPage = require('../pages/LoginPage')
const mainPage = require('../pages/MainPage')
const { utils } = inject()

Given('que o usuario tenha os dados de acesso', (table) => {
    let dataPath, data
    const tableByHeader = table.parse().hashes();
    for (const row of tableByHeader) {
        dataPath = row.dataPath
        data = row.data
    }
    utils.data = utils.getData(dataPath)[data]
    console.log("Massa de teste utilizada: \nUsar a variavel 'utils.data' para recuperar a massa.")
    console.log(utils.data)
})

When('preencho os dados de acesso', () => {
    loginPage.logar(utils.data)
});

When('cadastro um aluno', () => {
    mainPage.cadastrarAluno()
});

Then('confirmo o cadastro do aluno', () => {
    mainPage.confirmarCadastro()
});

Then('deve apresentar um mensagem de senha invalida', () => {
    loginPage.validaMsgSenhaInvalida()
});
