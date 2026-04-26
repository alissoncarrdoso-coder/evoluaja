# EvoluaJá 🚀

**Seu hub completo de evolução pessoal** — produtividade, finanças, saúde, treinos, estudos e muito mais em um único app.

---

## 📱 Módulos

| Módulo | Funcionalidades |
|--------|----------------|
| **Dashboard** | Visão geral, streak, cards de resumo, botão IA |
| **Rotina** | Calendário semanal, lista cronológica com status |
| **Hábitos** | Checklist diário, streak, barra de progresso |
| **Finanças** | Saldo, transações, cartões, metas, gráficos |
| **Alimentação** | Macros, hidratação, log de refeições |
| **Treinos** | Fichas ABC, registro de carga, volume semanal |
| **Estudos** | Timer Pomodoro, matérias por prioridade |
| **Casa** | Tarefas domésticas, lista de compras |
| **Saúde** | Consultas médicas, medicamentos |
| **Progresso** | Radar de áreas da vida, conquistas |
| **Perfil** | Quiz de IA, configurações |

---

## 🛠️ Stack

- **Frontend:** React 18 + Vite + Tailwind CSS
- **Roteamento:** React Router v6
- **Gráficos:** Recharts
- **Ícones:** Lucide React
- **Backend (IA):** Node.js + Express + OpenAI GPT-4o
- **Banco de dados:** PostgreSQL / Supabase
- **Deploy:** Vercel (frontend) + Railway/Render (backend)

---

## 🚀 Como rodar localmente

### Frontend

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

### Backend (Gerador de Rotinas IA)

```bash
cd backend
npm install

# Configurar variáveis de ambiente
cp ../.env.example .env
# Edite .env com sua chave da OpenAI

# Rodar
npm run dev
```

---

## ☁️ Deploy no Vercel

### Frontend (automático)

1. Faça push do repositório para o GitHub
2. Acesse [vercel.com](https://vercel.com) e importe o repositório
3. O Vercel detecta automaticamente o Vite
4. Adicione as variáveis de ambiente (`.env.example` como referência)
5. Clique em **Deploy** ✅

### Backend (Railway ou Render)

1. Crie um novo projeto no [Railway](https://railway.app) ou [Render](https://render.com)
2. Aponte para a pasta `backend/`
3. Configure a variável `OPENAI_API_KEY`
4. Deploy automático pelo GitHub

---

## 🗄️ Banco de Dados (Supabase)

1. Crie um projeto no [supabase.com](https://supabase.com)
2. Vá em **SQL Editor**
3. Cole e execute o conteúdo de `schema.sql`
4. Copie a URL e a chave anônima para o `.env`

---

## 📂 Estrutura do Projeto

```
evoluaja/
├── public/
│   └── icon.svg
├── src/
│   ├── components/
│   │   └── layout/
│   │       └── Layout.jsx      # Menu lateral + bottom nav
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Rotina.jsx
│   │   ├── Habitos.jsx
│   │   ├── Financas.jsx
│   │   ├── Alimentacao.jsx
│   │   ├── Treinos.jsx
│   │   ├── Estudos.jsx
│   │   ├── Casa.jsx
│   │   ├── Saude.jsx
│   │   ├── Progresso.jsx
│   │   └── Perfil.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── backend/
│   ├── server.js               # API Node.js + OpenAI
│   └── package.json
├── schema.sql                  # Schema completo do banco
├── vercel.json                 # Config de deploy
├── .env.example
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## 🎨 Design System

- **Cor principal:** Roxo `#7c3aed` (brand-500)
- **Positivo/Sucesso:** Emerald `#10b981`
- **Alerta/Atraso:** Red `#ef4444`
- **Fonte:** Nunito (Google Fonts)
- **Border radius:** 1rem – 2rem (cards arredondados)
- **Sombras:** Suaves e coloridas

---

## 📝 Licença

MIT © EvoluaJá
