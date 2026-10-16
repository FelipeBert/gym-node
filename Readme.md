# Gym Node API (API Solid)

Uma API robusta construída com **Node.js, TypeScript, Fastify e Prisma** para gestão de academias, check-ins e autenticação de usuários. 

Este projeto foi desenhado com um foco rigoroso em **DevOps, Infraestrutura como Código (IaC) e Integração/Entrega Contínua (CI/CD)**, adotando as melhores práticas de mercado para segurança, performance e escalabilidade em ambientes conteinerizados.

---

## Tecnologias e Ferramentas

*   **Aplicação:** Node.js, TypeScript, Fastify, Prisma ORM, Vitest (Testes).
*   **Banco de Dados:** PostgreSQL.
*   **Infraestrutura:** Docker, Docker Compose.
*   **CI/CD & Segurança:** GitHub Actions, Docker Buildx, Aqua Trivy (Vulnerability Scanner), Docker Hub.

---

## Arquitetura de Infraestrutura e DevOps

A infraestrutura deste projeto foi modelada para garantir transições suaves entre o ambiente de desenvolvimento local e a produção, garantindo determinismo e segurança.

### Conteinerização (Dockerfile)
O processo de build da imagem Docker utiliza uma abordagem **Multi-stage Build**, garantindo que a imagem final contenha estritamente o necessário para execução:
1.  **Cache Otimizado:** Separação da cópia do `package.json` da cópia do código fonte.
2.  **Instalação de Dependências:** Uso de `npm i` para baixar e instalar os pacotes necessários para o projeto.
3.  **Build Dinâmico:** O cliente do Prisma (`npx prisma generate`) e a compilação do TypeScript (`tsup`) ocorrem no estágio de build. Apenas a pasta compilada (`build/`) e o diretório `node_modules` são transferidos para o segundo estágio.
4.  **Segurança (Non-Root User):** A imagem final aplica o princípio de menor privilégio, rodando o processo do Node através do usuário nativo `node` em vez do usuário `root`, mitigando vulnerabilidades de escalonamento de privilégios.
5.  **Graceful Shutdown:** Utiliza execução direta de binário (`CMD ["node", "build/server.cjs"]`) para que o Node receba corretamente os sinais do sistema (`SIGTERM`), finalizando conexões ativas com segurança antes do desligamento.

### Orquestração Local (Docker Compose)
Para simular o ambiente completo com apenas um comando, o `docker-compose.yml` orquestra a API e o banco de dados com configurações voltadas para resiliência:
*   **Persistência de Dados:** Uso de `volumes` (`pg_data`) no container do PostgreSQL para garantir que os dados de teste sobrevivam a recriações dos contêineres.
*   **Inicialização Segura:** O comando de *entrypoint* do Compose executa automaticamente as migrations do Prisma (`npx prisma migrate deploy`) no banco de dados instanciado antes de liberar o tráfego HTTP para o Node.
*   **Host Binding:** A API está configurada nativamente para escutar na interface `0.0.0.0`, permitindo o roteamento de rede perfeito entre o host da máquina local e a rede interna isolada do Docker.

### CI/CD Pipeline (GitHub Actions)
O fluxo de automação (`.github/workflows/main.yml`) implementa as seguintes regras de engenharia:
1.  **Fail-Fast com Aqua Trivy:** Antes de qualquer processamento pesado, o código fonte (`fs`) é escaneado em busca de vulnerabilidades e dependências defasadas. Se ameaças de nível `HIGH` ou `CRITICAL` forem encontradas, o pipeline quebra imediatamente.
2.  **Build Inteligente (Docker Buildx):** Utiliza drivers avançados de cache nativos do GitHub Actions (`type=gha`), reduzindo o tempo de build em *commits* subsequentes ao reutilizar camadas do Docker previamente computadas.
3.  **Estratégia de Tags e Push:** 
    *   No evento de **Pull Request**, a imagem é apenas testada e construída (Dry-run) para garantir a integridade do código.
    *   No evento de **Push para a `main`**, a imagem é enviada (Push) para o Docker Hub com uma dupla estratégia de versão: a tag `latest` para acessibilidade rápida e a tag do **Commit SHA** (ex: `118f591`) para rastreabilidade, auditoria e facilidade de *rollback* em produção.

---

## Como rodar o projeto localmente

### Pré-requisitos
*   [Docker](https://docs.docker.com/get-docker/) e [Docker Compose](https://docs.docker.com/compose/install/) instalados.

### 1. Clonar e configurar
Clone este repositório e crie o seu arquivo de ambiente baseando-se no exemplo:
```bash
git clone https://github.com/SeuUsuario/gym-node.git
cd gym-node
cp .env.example .env
```

*Edite o `.env` caso precise alterar portas locais ou os segredos do JWT.*

### 2. Subir a infraestrutura
Inicie todos os serviços com o Docker Compose. O comando abaixo irá construir a imagem da API, baixar o PostgreSQL, aplicar as tabelas no banco e expor a aplicação:
```bash
docker compose up -d --build
```

### 3. Verificar o status
Acompanhe os logs da aplicação para confirmar o arranque do servidor:
```bash
docker compose logs -f api-solid
```

A API estará disponível para receber requisições em `http://localhost:80`.

---

## Limpeza e Manutenção

Para parar os contêineres:
```bash
docker compose stop
```

Para destruir a infraestrutura (remover contêineres e redes temporárias, **mantendo os dados do banco**):
```bash
docker compose down
```

Para destruir tudo, **incluindo o volume com os dados do banco**:
```bash
docker compose down -v
```
