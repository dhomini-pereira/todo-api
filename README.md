# ToDo API

## Descrição

Esta API (Application Programming Interface) tem dois recursos que serão utilizados no projeto de ToDo Avançado, que é o WebSocket e o HTTP.

O motivo da escolha do WebSocket foi principalmente pela implementação de grupos e atualização do quadro de tarefas em tempo real.

Quanto ao HTTP, foi não haver a necessidade de atualizar em tempo real informações não-relevantes, como SignIn, SignUp, Criar Workarea e etc.

## Tecnologias utilizadas

- Node.js
- TypeScript
- Express
- Socket.IO
- JWT (Json Web Token)
- Redis
- Prisma ORM
- PostgreSQL
- CloudFlare R2

## Documentação da API

### Autenticação

Para acessar os recursos da API, é necessário um token JWT (Json Web Token). O token deve ser enviado no cabeçalho `Authorization` com o prefixo `Bearer`, por exemplo: `Authorization: Bearer <seu_token>`.

O token é obtido através das rotas `/signup` e `/signin` (HTTP).

### Rotas HTTP de Autenticação

| ROTA                        | MÉTODO | AUTORIZAÇÃO | DESCRIÇÃO                           |
| --------------------------- | ------ | ----------- | ----------------------------------- |
| `/auth/signup`              | `POST` | ❌          | Cadastra um novo usuário.           |
| `/auth/signin`              | `POST` | ❌          | Autentica um usuário existente.     |
| `/auth/forgot-password`     | `POST` | ❌          | Envia o e-mail para trocar a senha. |
| `/auth/reset-password`      | `POST` | ❌          | Altera a senha do usuário.          |
| `/auth/active-account`      | `POST` | ❌          | Ativa a conta do usuário.           |
| `/auth/resend-active-email` | `POST` | ❌          | Reenvia o e-mail de confirmação.    |
| `/auth/refresh-token`       | `POST` | ✅          | Atualiza o token de autenticação.   |

### Rotas HTTP de tarefas

| ROTA                    | MÉTODO   | AUTORIZAÇÃO | DESCRIÇÃO                             |
| ----------------------- | -------- | ----------- | ------------------------------------- |
| `/workarea`             | `GET`    | ✅          | Lista todas as workareas do usuário.  |
| `/workarea`             | `POST`   | ✅          | Cria uma nova workarea.               |
| `/workarea/:id`         | `PUT`    | ✅          | Atualiza uma workarea.                |
| `/workarea/:id`         | `DELETE` | ✅          | Deleta uma workarea.                  |
| `/workarea/:id/members` | `GET`    | ✅          | Lista todos os membros da workarea.   |
| `/workarea/:id/member`  | `POST`   | ✅          | Envia um convite para a workarea.     |
| `/workarea/:id/member`  | `DELETE` | ✅          | Remove um membro da workarea.         |
| `/workarea/:id/member`  | `PATCH`  | ✅          | Muda a role de um membro da workarea. |
| `/user`                 | `DELETE` | ✅          | Deleta a conta do usuário.            |
| `/user`                 | `PUT`    | ✅          | Atualiza as informações do usuário.   |
| `/invite`               | `GET`    | ✅          | Lista todos os convites do usuário    |
| `/invite`               | `POST`   | ✅          | Aceita ou rejeita um convite.         |

### Rotas WebSocket

A conexão WebSocket é estabelecida através da URL `localhost:3000/ws`. Após a conexão, o cliente pode enviar e receber mensagens.

| EVENTO        | DESCRIÇÃO                |
| ------------- | ------------------------ |
| `connection`  | Conecta ao WebSocket.    |
| `disconnect`  | Desconecta do WebSocket. |
| `create-task` | Cria uma nova tarefa.    |
