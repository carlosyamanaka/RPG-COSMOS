# 🌌 RPG Cosmos - Gerenciamento de Missões para Servidor de Guilda

Este projeto é um software desenvolvido para gerenciar missões em um servidor de guilda, uma comunidade de RPG de mesa onde múltiplos jogadores participam de missões lideradas por diferentes mestres.

> **Este projeto foi inicialmente desenvolvido para a disciplina de Programação Web Back-end pela UTFPR, com orientação do professor Adriano Rivolli.**

## 🚀 Funcionalidades

- **Gerenciamento de Missões:** Criação, edição e remoção de missões.
- **Categorias de Missões:** Classificação de missões em diferentes categorias.
- **Relação de Jogadores:** Associação de múltiplos jogadores e mestres a uma missão.
- **Autenticação de Usuários:** Sistema de login para proteger as rotas.
- **Instalação Automatizada:** Rota específica para popular o banco de dados com dados iniciais.

## 🛠️ Tecnologias Utilizadas

- **Node.js:** Plataforma de execução do JavaScript no servidor.
- **Express:** Framework web para Node.js, utilizado para gerenciar as rotas e middlewares.
- **Sequelize:** ORM para Node.js que facilita a interação com o banco de dados.
- **Postgres:** Banco de dados utilizado para persistência dos dados durante o desenvolvimento.
- **Swagger:** Documentação automática de APIs RESTful.

## 📂 Estrutura do Projeto

```bash
├── controllers/       # Controladores responsáveis pela lógica de negócios
├── middleware/        # Middlewares, como o de autenticação
├── models/            # Modelos do banco de dados utilizando Sequelize
├── routes/            # Definições das rotas da API
├── config/            # Configurações de banco de dados e outros recursos
└── app.js             # Arquivo principal que inicializa o servidor e configura o Express
```

## ▶️ Como Executar

Clone o repositório:
`git clone https://github.com/usuario/rpg-cosmos.git`

Instale as dependências:
`npm install`

Inicie o servidor:
`npm start`

## 🌐 Rotas Principais

### Missões:
**POST** `/missao/create`: Criação de uma nova missão.

**GET** `/missao/get/:id`: Obtenção dos detalhes de uma missão específica.

**PUT** `/missao/update/:id`: Atualização de uma missão.

**DELETE** `/missao/delete/:id`: Remoção de uma missão.

**GET** `/missao/getTotal`: Obtenção do total de missões.

**GET** `/missao/getTotalByCategoria/:id`: Obtenção do total de missões por categoria.



### Categorias:
**POST** `/categoria/create`: Criação de uma nova categoria.

**GET** `/categoria/get/:id`: Obtenção dos detalhes de uma categoria específica.

**PUT** `/categoria/update/:id`: Atualização de uma categoria.

**DELETE** `/categoria/delete/:id`: Remoção de uma categoria.



### Usuários:
**POST** `/usuario/register`: Registro de um novo usuário.

**GET** `/usuario/login`: Login de um usuário.

**PUT** `/usuario/update/:email_usuario`: Atualização dos dados de um usuário.

**PUT** `/usuario/updateRole/:email_usuario`: Atualização do papel (role) de um usuário.

**DELETE** `/usuario/delete/:email_usuario`: Remoção de um usuário.

**DELETE** `/usuario/deleteByAdmin/:email_usuario`: Remoção de um usuário pelo administrador.

**POST** `/usuario/registerAdmin`: Registro de um novo administrador.

**GET** `/usuario/get/:email_usuario`: Obtenção dos detalhes de um usuário específico.

**GET** `/usuario/getAll`: Obtenção de todos os usuários.



### Instalação:
**GET** `/install`: Rota para popular o banco de dados com dados iniciais.
