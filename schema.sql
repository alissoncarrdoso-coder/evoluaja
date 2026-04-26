-- EvoluaJá - Schema SQL completo (PostgreSQL / Supabase)
-- Execute este arquivo no seu banco de dados para criar todas as tabelas

-- ============================================================
-- EXTENSÕES
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- USUÁRIOS (integra com auth.users do Supabase)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome          TEXT,
  email         TEXT UNIQUE,
  avatar_url    TEXT,
  objetivo      TEXT,  -- hipertrofia, emagrecimento, etc.
  nivel_atividade TEXT,
  tipo_treino   TEXT,
  criado_em     TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- HÁBITOS & ROTINA
-- ============================================================
CREATE TABLE IF NOT EXISTS habitos (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  nome          TEXT NOT NULL,
  emoji         TEXT,
  ativo         BOOLEAN DEFAULT TRUE,
  criado_em     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS habito_registros (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  habito_id     UUID NOT NULL REFERENCES habitos(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  data          DATE NOT NULL DEFAULT CURRENT_DATE,
  concluido     BOOLEAN DEFAULT FALSE,
  UNIQUE(habito_id, data)
);

CREATE TABLE IF NOT EXISTS tarefas (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  titulo        TEXT NOT NULL,
  categoria     TEXT,  -- Trabalho, Estudos, Treino, etc.
  data          DATE,
  horario_inicio TIME,
  horario_fim   TIME,
  status        TEXT DEFAULT 'pendente', -- pendente, concluida, atrasada
  repetir       TEXT, -- diario, semanal, mensal, null
  criado_em     TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- FINANÇAS
-- ============================================================
CREATE TABLE IF NOT EXISTS categorias_financeiras (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  nome          TEXT NOT NULL,
  tipo          TEXT NOT NULL, -- receita | despesa
  cor           TEXT,
  icone         TEXT
);

CREATE TABLE IF NOT EXISTS transacoes (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  categoria_id  UUID REFERENCES categorias_financeiras(id),
  descricao     TEXT NOT NULL,
  valor         NUMERIC(12,2) NOT NULL,
  tipo          TEXT NOT NULL, -- receita | despesa
  data          DATE NOT NULL DEFAULT CURRENT_DATE,
  recorrente    BOOLEAN DEFAULT FALSE,
  frequencia    TEXT, -- mensal, semanal
  criado_em     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cartoes_credito (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  nome          TEXT NOT NULL,
  limite        NUMERIC(12,2) NOT NULL,
  dia_fechamento INT,
  dia_vencimento INT
);

CREATE TABLE IF NOT EXISTS faturas (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cartao_id     UUID NOT NULL REFERENCES cartoes_credito(id) ON DELETE CASCADE,
  mes_referencia DATE NOT NULL,
  valor_total   NUMERIC(12,2) DEFAULT 0,
  paga          BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS metas_financeiras (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  nome          TEXT NOT NULL,
  valor_meta    NUMERIC(12,2) NOT NULL,
  valor_atual   NUMERIC(12,2) DEFAULT 0,
  prazo         DATE,
  cor           TEXT
);

-- ============================================================
-- ALIMENTAÇÃO
-- ============================================================
CREATE TABLE IF NOT EXISTS alimentos (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID REFERENCES profiles(id) ON DELETE CASCADE, -- null = global
  nome          TEXT NOT NULL,
  calorias_100g NUMERIC(8,2) NOT NULL,
  proteinas_100g NUMERIC(8,2) DEFAULT 0,
  carboidratos_100g NUMERIC(8,2) DEFAULT 0,
  gorduras_100g NUMERIC(8,2) DEFAULT 0,
  fibras_100g   NUMERIC(8,2) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS metas_nutricionais (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  calorias      INT NOT NULL,
  proteinas_g   INT NOT NULL,
  carboidratos_g INT NOT NULL,
  gorduras_g    INT NOT NULL,
  agua_ml       INT DEFAULT 2000
);

CREATE TABLE IF NOT EXISTS refeicoes (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  nome          TEXT NOT NULL, -- Café da Manhã, Almoço, etc.
  data          DATE NOT NULL DEFAULT CURRENT_DATE,
  hora          TIME
);

CREATE TABLE IF NOT EXISTS refeicao_itens (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  refeicao_id   UUID NOT NULL REFERENCES refeicoes(id) ON DELETE CASCADE,
  alimento_id   UUID NOT NULL REFERENCES alimentos(id),
  quantidade_g  NUMERIC(8,2) NOT NULL,
  calorias      NUMERIC(8,2) GENERATED ALWAYS AS (0) STORED -- calculado na aplicação
);

CREATE TABLE IF NOT EXISTS agua_registros (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  data          DATE NOT NULL DEFAULT CURRENT_DATE,
  quantidade_ml INT NOT NULL,
  hora          TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TREINOS
-- ============================================================
CREATE TABLE IF NOT EXISTS exercicios (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome          TEXT NOT NULL UNIQUE,
  grupo_muscular TEXT, -- Peito, Costas, Pernas, etc.
  tipo          TEXT  -- composto, isolado
);

CREATE TABLE IF NOT EXISTS fichas_treino (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  nome          TEXT NOT NULL, -- Treino A, Treino B
  dia_semana    TEXT, -- Segunda, Terça, etc.
  ativo         BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS ficha_exercicios (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ficha_id      UUID NOT NULL REFERENCES fichas_treino(id) ON DELETE CASCADE,
  exercicio_id  UUID NOT NULL REFERENCES exercicios(id),
  series        INT NOT NULL,
  repeticoes    TEXT NOT NULL, -- '8-12', '10', etc.
  carga_inicial NUMERIC(6,2) DEFAULT 0,
  ordem         INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS sessoes_treino (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  ficha_id      UUID REFERENCES fichas_treino(id),
  data          DATE NOT NULL DEFAULT CURRENT_DATE,
  concluida     BOOLEAN DEFAULT FALSE,
  volume_total_kg NUMERIC(10,2) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS series_registradas (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sessao_id     UUID NOT NULL REFERENCES sessoes_treino(id) ON DELETE CASCADE,
  exercicio_id  UUID NOT NULL REFERENCES exercicios(id),
  serie_num     INT NOT NULL,
  peso_kg       NUMERIC(6,2) NOT NULL,
  repeticoes    INT NOT NULL,
  concluida     BOOLEAN DEFAULT FALSE,
  criado_em     TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ESTUDOS
-- ============================================================
CREATE TABLE IF NOT EXISTS materias (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  nome          TEXT NOT NULL,
  prioridade    TEXT DEFAULT 'Media', -- Alta, Media, Baixa
  progresso_pct INT DEFAULT 0,
  cor           TEXT
);

CREATE TABLE IF NOT EXISTS sessoes_estudo (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  materia_id    UUID REFERENCES materias(id),
  inicio        TIMESTAMPTZ NOT NULL,
  fim           TIMESTAMPTZ,
  duracao_min   INT GENERATED ALWAYS AS (
    EXTRACT(EPOCH FROM (fim - inicio))::INT / 60
  ) STORED,
  tipo          TEXT DEFAULT 'pomodoro' -- pomodoro, livre
);

-- ============================================================
-- CASA & COMPRAS
-- ============================================================
CREATE TABLE IF NOT EXISTS tarefas_casa (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  nome          TEXT NOT NULL,
  frequencia    TEXT NOT NULL, -- diaria, semanal, mensal
  ativo         BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS tarefas_casa_registros (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tarefa_id     UUID NOT NULL REFERENCES tarefas_casa(id) ON DELETE CASCADE,
  data          DATE NOT NULL DEFAULT CURRENT_DATE,
  concluida     BOOLEAN DEFAULT FALSE,
  UNIQUE(tarefa_id, data)
);

CREATE TABLE IF NOT EXISTS lista_compras (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  nome          TEXT NOT NULL,
  categoria     TEXT, -- Supermercado, Farmácia, etc.
  quantidade    TEXT,
  comprado      BOOLEAN DEFAULT FALSE,
  criado_em     TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SAÚDE & COMPROMISSOS
-- ============================================================
CREATE TABLE IF NOT EXISTS consultas_medicas (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  medico        TEXT NOT NULL,
  especialidade TEXT,
  data_hora     TIMESTAMPTZ NOT NULL,
  local         TEXT,
  observacoes   TEXT,
  status        TEXT DEFAULT 'agendada' -- agendada, concluida, cancelada
);

CREATE TABLE IF NOT EXISTS medicamentos (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  nome          TEXT NOT NULL,
  dose          TEXT,
  horarios      TEXT[], -- array de horários ex: {'08:00', '20:00'}
  estoque       INT DEFAULT 0,
  ativo         BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS medicamento_registros (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  medicamento_id UUID NOT NULL REFERENCES medicamentos(id) ON DELETE CASCADE,
  data_hora     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  tomado        BOOLEAN DEFAULT FALSE
);

-- ============================================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_habito_registros_user_data ON habito_registros(user_id, data);
CREATE INDEX IF NOT EXISTS idx_tarefas_user_data ON tarefas(user_id, data);
CREATE INDEX IF NOT EXISTS idx_transacoes_user_data ON transacoes(user_id, data);
CREATE INDEX IF NOT EXISTS idx_refeicoes_user_data ON refeicoes(user_id, data);
CREATE INDEX IF NOT EXISTS idx_sessoes_treino_user_data ON sessoes_treino(user_id, data);
CREATE INDEX IF NOT EXISTS idx_sessoes_estudo_user ON sessoes_estudo(user_id);
CREATE INDEX IF NOT EXISTS idx_agua_user_data ON agua_registros(user_id, data);

-- ============================================================
-- ROW LEVEL SECURITY (Supabase)
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE habitos ENABLE ROW LEVEL SECURITY;
ALTER TABLE tarefas ENABLE ROW LEVEL SECURITY;
ALTER TABLE transacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE refeicoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE fichas_treino ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessoes_treino ENABLE ROW LEVEL SECURITY;
ALTER TABLE materias ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultas_medicas ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE lista_compras ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (cada usuário vê apenas seus dados)
CREATE POLICY "Usuário vê próprio perfil" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Usuário vê próprios hábitos" ON habitos FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Usuário vê próprias tarefas" ON tarefas FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Usuário vê próprias transações" ON transacoes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Usuário vê próprias refeições" ON refeicoes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Usuário vê próprias fichas" ON fichas_treino FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Usuário vê próprias sessões" ON sessoes_treino FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Usuário vê próprias matérias" ON materias FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Usuário vê próprias consultas" ON consultas_medicas FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Usuário vê próprios medicamentos" ON medicamentos FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Usuário vê própria lista" ON lista_compras FOR ALL USING (auth.uid() = user_id);
