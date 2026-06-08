# Documentação Técnica do Projeto

## 1. Tecnologias Utilizadas
**Frontend**


  - HTML5: Utilizado para estruturar as páginas web do sistema.
  - CSS: Utilizado para estilizar as páginas e melhorar a experiência do usuário.
  - JavaScript: Utilizado para implementar a lógica de interação nas páginas.
 
**Backend**


  - Node.js: Escolhido por sua eficiência em aplicações web e capacidade de lidar com múltiplas requisições simultâneas.
  - Express.js: Framework utilizado para simplificar o desenvolvimento de APIs e gerenciamento de rotas.
 
**Banco de Dados**


  - SQL: Utilizado para gerenciar e manipular dados estruturados no sistema.

## 2. Estrutura do Sistema
**Padrão Arquitetural**: O sistema adota o padrão **MVC (Model-View-Controller)**, separando a lógica de apresentação, controle e acesso a dados.



**Estrutura de Pastas**:


├── frontend
│   ├── index.html
│   ├── login.html
│   ├── dashboard.html
│   ├── admin-dashboard.html
│   ├── css
│   │   ├── style.css
│   │   └── dashboard.css
│   └── js
│       ├── script.js
│       ├── dashboard.js
│       └── api-mock.js
├── backend
│   ├── package.json
│   ├── app.js
│   ├── server.js
│   ├── db.js
│   ├── routes
│   │   ├── corredores.js
│   │   ├── gerador.js
│   │   ├── users.js
│   │   └── voltas.js
│   └── sql
│       └── DDL.sql
├── .gitignore
└── README.md


  - **frontend**: Contém todos os arquivos relacionados à interface do usuário.
    - **css**: Armazena os arquivos de estilo do sistema.
    - **js**: Contém os scripts JavaScript para a lógica da aplicação.
  - **backend**: Contém todos os arquivos do servidor e lógica de negócios.
    - **routes**: Armazena os arquivos de rotas da API.
    - **sql**: Contém scripts SQL para a criação e manipulação do banco de dados.
  - **.gitignore**: Lista de arquivos e pastas que devem ser ignorados pelo controle de versão.
  - **README.md**: Documentação do projeto.

**Fluxo de Dados**:


  1. O usuário faz uma requisição através da interface (frontend).
  2. A requisição é capturada pelo JavaScript e enviada para o servidor (backend).
  3. O servidor processa a requisição utilizando as rotas definidas.
  4. O servidor interage com o banco de dados conforme necessário.
  5. O banco de dados retorna os dados solicitados ao servidor.
  6. O servidor envia a resposta de volta ao frontend.
  7. O frontend atualiza a interface do usuário com os dados recebidos.

## 3. Funcionalidades Implementadas
**Módulo de Autenticação**


  - Permite que usuários se registrem e façam login no sistema.
  - Valida credenciais e gerencia sessões de usuário.

**Módulo de Dashboard**


  - Exibe informações relevantes para o usuário após o login.
  - Permite a visualização e interação com dados em tempo real.

**Módulo de Administração**


  - Permite que administradores gerenciem usuários e dados do sistema.
  - Inclui funcionalidades para adicionar, editar e remover registros.

  ## 4. Participação de cada integrante.
Divisão de Escopo e Atribuições da Equipe

**Sarah** — Especialista em UI/UX, Identidade Visual e Arquitetura de Navegação
Responsabilidades Técnicas: Liderança criativa no desenvolvimento e consolidação da identidade de marca do projeto. Responsável pela concepção do naming, curadoria e tratamento de ativos visuais (imagens, ilustrações e ícones), além da definição estratégica da paleta de cores baseada em psicologia das cores e acessibilidade.
Atuação no Desenvolvimento: Responsável pelo mapeamento, estruturação e implementação inicial da lógica de rotas do sistema, garantindo a integridade dos fluxos de navegação e a perfeita sinergia entre a jornada do usuário e a interface projetada.

**Erick** — Engenheiro de Software Backend e Co-Arquiteto de Dados
Responsabilidades Técnicas: Focado no desenvolvimento da lógica de negócios do lado do servidor (server-side logic). Atua no desenho e na construção de APIs robustas, seguras e escaláveis que servirão de fundação para o sistema.
Atuação em Dados: Responsável pela modelagem do banco de dados, definição de esquemas, criação de relacionamentos entre entidades e garantia de que os dados transacionais sejam processados com o mínimo de latência e máxima consistência.

**Hugo** — Especialista em Infraestrutura de Dados e Engenheiro Backend
Responsabilidades Técnicas: Atuação estratégica no provisionamento, gerenciamento e otimização do banco de dados da aplicação. Focado em garantir a integridade estrutural, segurança da informação e alta disponibilidade dos dados do sistema.
Atuação no Desenvolvimento: Trabalha em estreita colaboração no ecossistema backend, codificando regras de negócio complexas, otimizando consultas (queries) para performance e estruturando microsserviços ou rotinas de servidor que sustentem as demandas da aplicação.

**Arthur** — Engenheiro de Software Frontend (Client-Side Engineer)
Responsabilidades Técnicas: Responsável por traduzir toda a visão estética e funcional do projeto em código limpo, semântico e performático. Atua no desenvolvimento da interface do usuário (client-side), criando componentes reutilizáveis e modulares.
Atuação em Integração: Garante a total responsividade da aplicação (compatibilidade com dispositivos móveis, tablets e desktops), gerencia o estado global do ecossistema front-end e realiza o consumo eficiente das APIs desenvolvidas pela equipe de back-end, conectando a interface aos dados em tempo real. 
