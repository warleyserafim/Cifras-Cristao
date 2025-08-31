# Cifras Cristao

Este é um projeto full-stack de um site de cifras cristãs, desenvolvido com Next.js para o frontend e Node.js (Express) para o backend.

## Tecnologias Utilizadas

- **Monorepo:** NPM Workspaces
- **Frontend:**
  - Next.js (React)
  - TypeScript
  - TailwindCSS
  - Axios
- **Backend:**
  - Node.js
  - Express.js
  - TypeScript
  - PostgreSQL
  - Prisma ORM
  - JSON Web Tokens (JWT) para autenticação
  - Bcrypt.js

---

## Guia de Instalação e Execução

Siga os passos abaixo para configurar e rodar o projeto em seu ambiente de desenvolvimento local.

### Pré-requisitos

- Node.js (versão 18 ou superior)
- NPM
- Uma instância de banco de dados PostgreSQL rodando localmente ou na nuvem.

### 1. Instalar Dependências

Após clonar o repositório, navegue até a raiz do projeto e instale todas as dependências do frontend e backend com um único comando:

```bash
npm install
```

### 2. Configurar o Backend (API)

O backend precisa de algumas variáveis de ambiente para se conectar ao banco de dados e para a segurança da autenticação.

- Navegue até a pasta `api`.
- Crie um arquivo chamado `.env`.
- Adicione as seguintes variáveis a ele, substituindo pelos seus próprios valores:

```env
# String de conexão do seu banco de dados PostgreSQL
DATABASE_URL="postgresql://SEU_USUARIO:SUA_SENHA@SEU_HOST:PORTA/SEU_BANCO"

# Chave secreta para gerar os tokens de autenticação (JWT)
JWT_SECRET="UMA_CHAVE_SUPER_SECRETA_E_LONGA_AQUI"
```

### 3. Preparar o Banco de Dados

Com o backend configurado, precisamos criar as tabelas no banco de dados. O Prisma utiliza um sistema de "migrações" para fazer isso.

- Na raiz do projeto, execute o seguinte comando:

```bash
npm run prisma:migrate --workspace=api
```

- O Prisma pedirá um nome para esta primeira migração. Você pode digitar algo como `initial-setup` e pressionar Enter.

### 4. Rodar a Aplicação

Agora, estamos prontos para iniciar os servidores de desenvolvimento. Você precisará de **dois terminais** abertos na raiz do projeto.

- **No Terminal 1 (para rodar o Backend):**

```bash
npm run dev:api
```

- **No Terminal 2 (para rodar o Frontend):**

```bash
npm run dev
```

Após alguns instantes, o servidor da API estará rodando na porta `3001` e o site estará acessível em **[http://localhost:3000](http://localhost:3000)**.

---

## Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento do frontend.
- `npm run dev:api`: Inicia o servidor de desenvolvimento do backend.
- `npm run build`: Gera as builds de produção para ambos os projetos.
- `npm run start`: Inicia o frontend em modo de produção (requer `npm run build` antes).
