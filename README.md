<h1 align="center">
  <img src=".github/chef.png" width="200px">
</h1>

<h4 align="center"> 
	:heavy_check_mark: Foodfy
</h4>

<p align="center">
  <a href="https://opensource.org/licenses/MIT"><img alt="License MIT" src="https://img.shields.io/badge/license-MIT-brightgreen"></a>
</p>

<p align="center">
  <a href="#interrobang">Foodfy</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#rocket-tecnologias">Tecnologias usadas</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#interrobang-como-usar">Como usar</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#confetti_ball-como-contribuir">Como contribuir</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#key-licença">Licença</a>
</p>


<div align="center">
  <img src=".github/foodfy_2.gif" alt="Foodfy" height="450px">
</div>


## :interrobang: O que é o Foodfy?

O Foodfy é um site de receitas que foi desenvolvido no Bootcamp LaunchBase.

## :rocket: Tecnologias:

Esse projeto foi desenvolvido com as seguintes tecnologias:

- [HTML][html]
- [CSS][css]
- [JavaScript][js]
- [Node.js][nodejs]
- [Express][express]
- [Nunjucks][njk]
- [PostgreSQL][postgresql]
- [Multer][multer]
- [PG][pg]


## :construction_worker: Como usar: (Em desenvolvimento)

Para clonar e executar essa aplicação você vai precisar dos seguintes softwares instalados em seu computador: 
- [Git][git]
- [Node][nodejs]
- [PostgreSQL][postgresql]

### :electric_plug: Instalar dependências

```bash
# Clone este repositório:
$ git clone https://github.com/i-ramoss/Foodfy.git

# Entre no repositório:
$ cd Foodfy

# Instale as dependências:
$ npm install
```

### Após instalar as dependências, deve-se configurar o banco de dados

Além do [PostgreSQL], instale o [Postbird] para gerenciamento e visualização do BD numa interface gráfica. <br>
Após essas instalações, ligue o PostgreSQL.

*Perceba que a versão que estou usando neste projeto, é a versão 13. Caso a sua versão instalada seja outra, atente-se ao número da versão na pasta acima. Troque o 13 pela versão do seu postgres.*

#### Windows:

1. Abra o Powershell como administrador, e navegue até a pasta de instalação:
```bash
$ cd "C:\Program Files\PostgreSQL\13\bin\"
```

2. Inicie o postgres com o comando abaixo:
```bash
$ .\pg_ctl.exe -D "C:\Program Files\PostgreSQL\13\data" star
```

3. Após o uso, o comando para desligá-lo é:
```bash
$ .\pg_ctl.exe -D "C:\Program Files\PostgreSQL\13\data" stop
```

#### Mac: 

1. Iniciar o postgres
```shell
pg_ctl -D /usr/local/var/postgres start
```

2. Desligar o postgresql
```shell
pg_ctl -D /usr/local/var/postgres stop
```

#### Linux:
[Documentação Oficial de Instalação do Postgres][postgres-linux]

### Utilizando o Postbird

Após ligar o Postgres, abra o Postbird e crie um banco de dados, de nome foodfy. *As informações de usuário e senha do postgres estão no arquivo src/config/db.js*. <br>
Quando conectado, crie um banco de dados com o nome de foodfy. Após isso, importe um arquivo .sql e utilize o que está na raiz deste repositório. <br>
Se não for possível realizar a importação, abra o arquivo sql e *copie toda a query* para a sessão de Query do Postbird e clique em Run Query<br>
Caso as tabelas tenham sido criadas, a importação ocorreu com sucesso.

### Executar a aplicação
```bash
# Entre no repositório:
$ cd Foodfy

# Inicie a aplicação:
$ npm start

# A aplicação estará rodando na porta 5000 (http://localhost:5000/)
```


## :confetti_ball: Como contribuir:

-  Realize um fork;
-  Crie uma branch com sua funcionalidade: `git checkout -b my-feature`;
-  Envie as mudanças realizadas: `git commit -m 'feat: My new feature'`;
-  Faça um push da sua branch: `git push origin my-feature`.

Depois que a sua solicitação for aceita e adicionada ao projeto, você pode excluir a sua branch.

## :key: Licença:

Este projeto está sob licença MIT, para mais detalhes verifique em [LICENSE][license].

Feito com :green_heart: por **Ian Ramos** :fire: [Entre em contato!][linkedin]



[html]: https://developer.mozilla.org/pt-BR/docs/Web/HTML
[css]: https://developer.mozilla.org/pt-BR/docs/Web/CSS
[js]: https://developer.mozilla.org/pt-BR/docs/Web/JavaScript
[nodejs]: https://nodejs.org/en/
[express]: https://expressjs.com/pt-br/
[njk]: https://mozilla.github.io/nunjucks/
[postgresql]: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
[postgres-linux]: https://www.postgresql.org/download/linux/
[multer]: https://github.com/expressjs/multer
[pg]: https://github.com/brianc/node-postgres/tree/master/packages/pg
[git]: https://git-scm.com
[license]: https://github.com/i-ramoss/Foodfy/blob/master/LICENSE
[linkedin]: https://www.linkedin.com/in/ian-ramos/
