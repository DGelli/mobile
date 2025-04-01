# language: pt
Funcionalidade: Cadastro
      Eu como QA gostaria de automatizar aplicativos de IOS e Android para realizar a regressão dos teste funcionais

  @CT01
  Cenario: Cadastrar novo aluno
    Dado que o usuario tenha os dados de acesso
      | dataPath    | data              |
      | login       | credenciaisValida |
    Quando preencho os dados de acesso
    E cadastro um aluno
    Entao confirmo o cadastro do aluno

  @CT02
  Cenario: Logar com senha invalida
    Dado que o usuario tenha os dados de acesso
      | dataPath    | data          |
      | login       | senhaInvalida |
    Quando preencho os dados de acesso
    Entao deve apresentar um mensagem de senha invalida
