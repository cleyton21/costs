# Costs - Gerenciador de Projetos

Sistema de gerenciamento de projetos e custos desenvolvido em React.

## 🚀 Funcionalidades

- Criação e gerenciamento de projetos
- Adição de serviços aos projetos
- Controle de orçamento
- Categorização de projetos
- Interface responsiva e moderna

## 💻 Tecnologias

- React
- JSON Server (API REST)
- React Router
- React Icons

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn

## 🔧 Instalação e Execução Manual

1. Clone o repositório:
```bash
git clone https://github.com/cleyton21/costs.git
cd costs
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o backend (JSON Server):
```bash
npm run backend
```

4. Em outro terminal, inicie o frontend:
```bash
npm start
```

O projeto estará disponível em:
- Frontend: http://localhost:3000
- API: http://localhost:5000

## 🐳 Execução com Docker

### Pré-requisitos para Docker
- Docker instalado na máquina

### Usando o Dockerfile

1. Construa a imagem:
```bash
docker build -t costs .
```

2. Execute o container:
```bash
docker run -p 3000:80 -p 5000:5000 costs
```

O projeto estará disponível em:
- Frontend: http://localhost:3000
- API: http://localhost:5000

### Comandos Docker Úteis

- Parar todos os containers:
```bash
docker stop $(docker ps -aq)
```

- Remover todos os containers:
```bash
docker rm $(docker ps -aq)
```

- Remover a imagem:
```bash
docker rmi costs
```

- Ver logs do container:
```bash
docker logs [ID_DO_CONTAINER]
```

## 📁 Estrutura do Projeto

- `src/`: Código fonte do frontend
- `src/components/`: Componentes React
- `db.json`: Banco de dados do JSON Server
- `public/`: Arquivos públicos
- `Dockerfile`: Configuração para build com Docker
- `nginx.conf`: Configuração do servidor nginx (usado com Docker)

## ⚙️ Variáveis de Ambiente

O projeto usa as seguintes variáveis de ambiente:
- `REACT_APP_API_URL`: URL da API (padrão: http://localhost:5000)

## 📝 Configurações Adicionais

### Deploy Manual em Produção

1. Gere o build de produção:
```bash
npm run build
```

2. Configure um servidor web (nginx, Apache) para servir a pasta `build`

3. Configure o JSON Server para produção:
```bash
npm install -g json-server
json-server --watch db.json --port 5000 --host 0.0.0.0
```

### Usando PM2 (opcional)

Para manter o servidor rodando em produção:

```bash
npm install -g pm2
pm2 start "json-server --watch db.json --port 5000 --host 0.0.0.0" --name "costs-api"
```

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📧 Contato

Cleyton - [GitHub](https://github.com/cleyton21)
