import { 
  ChecklistItem, 
  Committee, 
  Policy, 
  HistoricIncident, 
  AuditItem, 
  BscObjective, 
  RoadmapTask,
  MetricState
} from "./types";

// Base parameters for metric targets
export const META_UPTIME = 99.95;
export const META_CHANGES = 95;
export const META_ENCRYPT = 100;
export const META_TRAINING = 100;

export const BASELINE_METRICS: MetricState = {
  uptime: 99.50,
  changes: 62,
  encrypt: 45,
  training: 15
};

// Initial LGPD & BACEN checklist items
export const INITIAL_CHECKLIST: ChecklistItem[] = [
  { id: "chk1", label: "🔐 Dados sensíveis mapeados e inventariados", checked: true, category: "LGPD" },
  { id: "chk2", label: "🧩 Criptografia AES-256 em repouso e trânsito", checked: false, category: "LGPD" },
  { id: "chk3", label: "📋 Política de retenção e eliminação segura aprovada", checked: true, category: "LGPD" },
  { id: "chk4", label: "👤 DPO (Encarregado) nomeado formalmente & canal de titulares ativo", checked: false, category: "LGPD" },
  { id: "chk5", label: "⚠️ Processo de notificação de incidentes à ANPD em 48h estruturado", checked: false, category: "LGPD" },
  { id: "chk6", label: "🏦 Conformidade sistêmica com a Resolução BACEN nº 4.893 (Cibersegurança)", checked: false, category: "BACEN" },
  { id: "chk7", label: "📑 Auditoria anual de segurança e confidencialidade de fornecedores (SaaS)", checked: true, category: "COMPLIANCE" },
  { id: "chk8", label: "🛡️ Plano de Gerenciamento de Vulnerabilidades com varreduras mensais", checked: false, category: "COMPLIANCE" }
];

// Rich description of NeoCredit governance committees
export const COMMITTEES: Committee[] = [
  {
    id: "comite-crise",
    name: "Comitê de Gestão de Riscos e Incidentes (CRI)",
    icon: "ShieldAlert",
    role: "Resposta rápida a crises cibernéticas, mitigação de riscos de vazamento e aprovação de resiliência.",
    description: "Instaurado para supervisionar a integridade tecnológica do NeoCredit frente a ciberataques, vazamento de dados e interrupções sistêmicas severas em conformidade com o BACEN.",
    meetingFrequency: "Mensal (ou extraordinário em menos de 2h pós incidentes gravidade Crítica)",
    nextMeetingDate: "2026-06-18 às 14:00",
    members: [
      { name: "Dr. Alencar Ramos", role: "Encarregado de Proteção de Dados (DPO)", avatar: "🧑‍💼" },
      { name: "Marina Salles", role: "Diretora de Compliance e Auditoria", avatar: "👩‍💼" },
      { name: "Henrique Castilho", role: "Diretor de Operações de Segurança (CISO)", avatar: "🧑‍💻" }
    ],
    raci: [
      { activity: "Declaração de crise em vazamento de dados", r: "CISO", a: "DPO", c: "Diretora Compliance", i: "CEO / Board" },
      { activity: "Relatórios de auditoria regulatória à ANPD/BACEN", r: "Compliance", a: "DPO", c: "Investidores/Jurídico", i: "Público Geral" },
      { activity: "Mitigação e contenção técnica de ataques (SRE)", r: "CISO", a: "Diretor Tecnologia", c: "Engenharia de Infra", i: "Comitê CRI" }
    ]
  },
  {
    id: "comite-seguranca",
    name: "Comitê de Segurança da Informação e Privacidade (CSIP)",
    icon: "Lock",
    role: "Definição de diretrizes da PSI, controle de privacidade de dados e auditoria contínua de frameworks.",
    description: "Define a estratégia de guarda de chaves de criptografia corporativa, gerencia acessos privilegiados e aprova as políticas com base na ISO 27001.",
    meetingFrequency: "Bimestral",
    nextMeetingDate: "2026-07-02 às 10:30",
    members: [
      { name: "Henrique Castilho", role: "CISO", avatar: "🧑‍💻" },
      { name: "Juliana Mendes", role: "Líder de DevSecOps", avatar: "👩‍💻" },
      { name: "Gabriel Souza", role: "Arquiteto de Identidade de Acessos (IAM)", avatar: "🧑‍🔬" }
    ],
    raci: [
      { activity: "Atualização Anual da Política de Segurança da Informação", r: "CISO", a: "Comitê CSIP", c: "DPO", i: "Todos os Funcionários" },
      { activity: "Aprovação de acessos com privilégio elevado (PAM)", r: "Arquiteto IAM", a: "CISO", c: "Gerente Operacional", i: "Auditoria" },
      { activity: "Análise de impacto e revisão periódica do PCN", r: "DevSecOps", a: "CISO", c: "Comitê CRI", i: "CEO" }
    ]
  },
  {
    id: "comite-mudancas",
    name: "Comitê Consultivo de Mudanças (CAB - Change Advisory Board)",
    icon: "GitBranch",
    role: "Aprovação de releases em produção, mitigação de impactos na esteira DevSecOps.",
    description: "Opera sob o framework ITIL 4 para mitigar indisponibilidades causadas por deploy inseguro ou configurações de nuvem sem revisão.",
    meetingFrequency: "Semanal (Todas as terças-feiras às 09:00)",
    nextMeetingDate: "2026-06-16 às 09:00",
    members: [
      { name: "Juliana Mendes", role: "Coordenadora do CAB & DevSecOps", avatar: "👩‍💻" },
      { name: "Thiago Prado", role: "Principal SRE Engineer", avatar: "🧑‍🔧" },
      { name: "Marina Salles", role: "Riscos Corporativos e Compliance", avatar: "👩&zwj;💼" }
    ],
    raci: [
      { activity: "Releases de código com alteração de banco de dados", r: "Tech Lead Dev", a: "CAB", c: "SRE / CISO", i: "Suporte Técnico" },
      { activity: "Deploys emergenciais (Hotfix sem parada)", r: "SRE", a: "Líder CAB", c: "Engenharia de Software", i: "Comitê CSIP" },
      { activity: "Revisão pós-implantação (PIR) de falha na liberação", r: "SRE & Devs", a: "CAB", c: "Compliance", i: "Diretoria" }
    ]
  }
];

// Core corporate policies
export const POLICIES: Policy[] = [
  {
    id: "pol-1",
    code: "POL-SEC-01",
    title: "Política de Segurança da Informação (PSI)",
    description: "Estabelece diretrizes fundamentais para a proteção de ativos informacionais, controle de senhas, classificação de dados e mitigação de vulnerabilidades corporativas.",
    owner: "Henrique Castilho (CISO)",
    lastRevision: "2026-04-12",
    status: "Approved",
    complianceLevel: 98,
    content: [
      "1. Escopo de Proteção: Todas as informações e segredos comerciais do NeoCredit e de seus cooperados de crédito devem ser confidenciais.",
      "2. Controle de Senhas: Obrigatoriedade de autenticação multifator (MFA) em 100% das plataformas, com rotação trimestral de credenciais privilegiadas.",
      "3. Classificação de Dados: As informações são segmentadas em Públicas, Internas, Confidenciais e Restritas. Dados sensíveis de cooperados são inerentemente Restritos.",
      "4. Medidas Sancionatórias: Infrações a esta política estarão sujeitas a processos disciplinares formais e encaminhamento jurídico conforme a LGPD."
    ]
  },
  {
    id: "pol-2",
    code: "POL-BCP-02",
    title: "Plano de Continuidade de Negócios e Contingência de TI",
    description: "Protocolos de alta disponibilidade, disaster recovery e planos de ação frente a interrupções nos servidores ou indisponibilidades de parceiros bancários de liquidação.",
    owner: "Thiago Prado (Lead SRE)",
    lastRevision: "2026-05-30",
    status: "Approved",
    complianceLevel: 85,
    content: [
      "1. Objetivos de Recuperação: O valor fixado de RTO (Recovery Time Objective) para a plataforma transacional do NeoCredit é de no máximo 2 horas. RPO (Recovery Point Objective) é de 15 minutos.",
      "2. Replicação de Nuvem: Bancos de dados georeplicados ativamente com failover automatizado para cenários catastróficos.",
      "3. Simulado de Crise: Realização obrigatória de um teste de restore total e simulação de blackout de infraestrutura a cada seis meses.",
      "4. Comunicação Emergencial: Em situações de indisponibilidade sistêmica, canais alternativos de suporte para cooperados devem ser acionados imediatamente."
    ]
  },
  {
    id: "pol-3",
    code: "POL-IAM-03",
    title: "Norma de Controle de Acesso Baseado em Perfis (RBAC)",
    description: "Controle estrito de privilégios de usuários. Garante que colaboradores acessem apenas os silos de dados cruciais para sua função produtiva.",
    owner: "Gabriel Souza (Sistemas IAM)",
    lastRevision: "2026-06-01",
    status: "Review",
    complianceLevel: 70,
    content: [
      "1. Princípio do Menor Privilégio: Acessos extras só serão liberados mediante requisição devidamente justificada, por tempo determinado, e homologação do CISO.",
      "2. Revogação Automática: Colaboradores desligados ou em férias têm seus privilégios revogados em até 1 hora no Active Directory.",
      "3. Auditorias Frequentes: Revisões mensais adicionais sobre todas as contas de serviço de infraestrutura e chaves API ativas."
    ]
  },
  {
    id: "pol-4",
    code: "POL-CHG-04",
    title: "Procedimento Operacional de Gestão de Mudanças",
    description: "Normatização da submissão, avaliação técnica e implantação segura de modificações em ambiente de produção em sintonia com ITIL 4.",
    owner: "Juliana Mendes (CAB Chair)",
    lastRevision: "2026-05-15",
    status: "Draft",
    complianceLevel: 45,
    content: [
      "1. Classificação das Mudanças: Separadas em Padrão (baixo risco, auto-aprovadas), Normais (requerem parecer técnico e aprovação formal do CAB) e Emergenciais (aprovadas pelo ECAB).",
      "2. Plano de Rollback: Toda mudança Normal ou Emergencial deve, sem exceção, vir acompanhada de roteiro explícito de retorno à versão estável anterior em caso de mau funcionamento.",
      "3. Janelas de Liberação: Restrições em períodos de alto volume de liquidação de crédito (dias 05, 10 e 30 de cada mês)."
    ]
  }
];

// Historical database of past incidents for audit trail simulation
export const HISTORIC_INCIDENTS: HistoricIncident[] = [
  {
    id: "inc-109",
    title: "Instabilidade em Gateway Bancário (SLA mitigado)",
    date: "2026-05-24",
    severity: "Alta",
    status: "Resolvido",
    resolutionSLA: "85 minutos (Meta: < 120m)",
    rca: "Timeout sistêmico no parceiro externo de repasse. Failover secundário de rotas foi acionado com atraso."
  },
  {
    id: "inc-108",
    title: "Vazamento simulado em ambiente de Homologação (Staging)",
    date: "2026-05-02",
    severity: "Alta",
    status: "Resolvido",
    resolutionSLA: "45 minutos (Meta: < 125m)",
    rca: "Dados sintéticos mascarados vazaram após alteração em base pública de testes. Corrigido com isolamento IP."
  },
  {
    id: "inc-107",
    title: "Mitigação de ataque DDoS nas APIs Públicas",
    date: "2026-04-18",
    severity: "Crítica",
    status: "Mitigado",
    resolutionSLA: "12 minutos (SLA crítico: < 15m)",
    rca: "Inundação de requisições maliciosas via rede botnet de IoT. Camada Cloudflare de Web Application Firewall automatizada conteve 99.8% do tráfego."
  },
  {
    id: "inc-101",
    title: "Alerta de Phishing Direcionado (Spear-phishing)",
    date: "2026-03-10",
    severity: "Média",
    status: "Resolvido",
    resolutionSLA: "240 minutos (Meta: < 360m)",
    rca: "E-mail de falsificação de diretoria enviado a funcionários de tesouraria. Caixa de e-mail isolada de forma célere pela equipe de segurança."
  }
];

// Regulatory compliance requirements for interactive auditories
export const AUDIT_REQUIREMENTS: AuditItem[] = [
  // ISO 27001
  { id: "aud-iso-1", framework: "ISO 27001", controlSection: "A.5 Plan de Segurança", title: "Aprovação anual formal de Políticas de Segurança da Informação pela Diretoria", checked: true, weight: 15 },
  { id: "aud-iso-2", framework: "ISO 27001", controlSection: "A.9 Controle de Acesso", title: "Autenticação por múltiplos fatores obrigatório em todas as conexões VPN/Cloud", checked: true, weight: 20 },
  { id: "aud-iso-3", framework: "ISO 27001", controlSection: "A.12 Segurança das Operações", title: "Instalação de IPS/IDS e logs agregados de servidores replicados em SIEM central", checked: false, weight: 25 },
  { id: "aud-iso-4", framework: "ISO 27001", controlSection: "A.14 Aquisição e Desenvolvimento", title: "Testes automatizados de segurança (SAST/DAST) integrados ao pipeline de deploy", checked: false, weight: 20 },
  { id: "aud-iso-5", framework: "ISO 27001", controlSection: "A.17 Gestão de Crise de TI", title: "Simulado semestral formal de desastres e relatório público de lições aprendidas", checked: false, weight: 20 },

  // COBIT 2019
  { id: "aud-cob-1", framework: "COBIT 2019", controlSection: "APO01 Gestão Estrutura de TI", title: "Comitês de Governança alinhados com o conselho corporativo estabelecidos", checked: true, weight: 25 },
  { id: "aud-cob-2", framework: "COBIT 2019", controlSection: "APO12 Gerenciamento de Riscos", title: "Matriz unificada de Riscos de TI, impacto financeiro e apetite definidos", checked: false, weight: 30 },
  { id: "aud-cob-3", framework: "COBIT 2019", controlSection: "BAI06 Gerenciamento de Mudanças", title: "Procedimento estruturado do CAB com aprovação baseada em risco regulatório devidamente formalizada", checked: false, weight: 25 },
  { id: "aud-cob-4", framework: "COBIT 2019", controlSection: "MEA02 Sistema de Controle Interno", title: "Auditoria independente de chaves criptográficas no core transacional bancário", checked: false, weight: 20 },

  // ITIL 4
  { id: "aud-itil-1", framework: "ITIL 4", controlSection: "Habilitação de Mudança", title: "Adoção de esteira ágil para mudanças padrões automatizadas", checked: true, weight: 30 },
  { id: "aud-itil-2", framework: "ITIL 4", controlSection: "Gestão de Incidentes de TI", title: "Fila automática de severidade baseada no impacto financeiro de cooperativas", checked: true, weight: 30 },
  { id: "aud-itil-3", framework: "ITIL 4", controlSection: "Gerenciamento de Ativos", title: "Inventário dinâmico de hardwares corporativos, licenças SaaS e domínios web", checked: false, weight: 20 },
  { id: "aud-itil-4", framework: "ITIL 4", controlSection: "Gestão Contínua Serviço", title: "SLA parametrizado de atendimento em catálogo de serviços e MTTR revisado", checked: false, weight: 20 },

  // LGPD
  { id: "aud-lgpd-1", framework: "LGPD", controlSection: "Art. 37 Operações de Tratamento", title: "Mapas de ciclo de vida de dados sensíveis detalhando armazenamento corporativo", checked: true, weight: 20 },
  { id: "aud-lgpd-2", framework: "LGPD", controlSection: "Art. 38 Relatório de Impacto (RIPD)", title: "RIPD em episódios de novos produtos financeiros homologado pelo DPO", checked: false, weight: 25 },
  { id: "aud-lgpd-3", framework: "LGPD", controlSection: "Art. 41 Nomeação de Encarregado", title: "Canal do site público aceitando notificações de exclusão/revisão de cooperados", checked: false, weight: 20 },
  { id: "aud-lgpd-4", framework: "LGPD", controlSection: "Art. 46 Padrões de Segurança", title: "Anonimização ativa de dados de crédito em laboratórios analíticos e de teste", checked: true, weight: 20 },
  { id: "aud-lgpd-5", framework: "LGPD", controlSection: "Art. 48 Incidentes de Segurança", title: "Manual rápido de resposta focado na ANPD com formulários de comunicação pré-preenchidos", checked: false, weight: 15 }
];

// Balanced Scorecard alinhado dinamicamente com nossas métricas
export const BSC_OBJECTIVES: BscObjective[] = [
  {
    id: "bsc-fin-1",
    perspective: "Financeira",
    objective: "Reduzir custos regulatórios e multas fiscais (ANPD / BACEN)",
    kpiName: "Exposição financeira por fragilidades de criptografia / LGPD",
    meta: "R$ 0 em multas e sanções por ano",
    currentFormula: (metrics) => {
      if (metrics.encrypt === 100) return { value: "R$ 0 (Compliance Total)", status: "success" };
      if (metrics.encrypt >= 80) return { value: "R$ 150.000 (Risco Moderado)", status: "warning" };
      return { value: "R$ 1.250.000 (Risco Alto de Penalidade)", status: "danger" };
    },
    initiative: "Implementar rotina de criptografia compulsória AES-256 nas tabelas transacionais do NeoCredit."
  },
  {
    id: "bsc-fin-2",
    perspective: "Financeira",
    objective: "Otimizar o Retorno sobre Investimento em Segurança (ROSI)",
    kpiName: "Taxa de mitigação preventiva de perdas sistêmicas (ROSI)",
    meta: "Fator ROSI superior a 3.5x",
    currentFormula: (metrics) => {
      const score = (metrics.training * 0.4 + metrics.encrypt * 0.6);
      if (score >= 80) return { value: "4.2x (Excelente retorno preventivo)", status: "success" };
      if (score >= 50) return { value: "2.1x (Retorno básico de contenção)", status: "warning" };
      return { value: "0.4x (Perdas superam o investimento em segurança)", status: "danger" };
    },
    initiative: "Plano estruturado de conscientização cibernética e auditorias de defesa periódicas."
  },
  {
    id: "bsc-cli-1",
    perspective: "Cliente",
    objective: "Manter excelente nível de confiabilidade e uptime para os cooperados",
    kpiName: "Uptime mensal de serviços críticos (Pix, Boletos, APP)",
    meta: "SLA de Disponibilidade >= 99.95%",
    currentFormula: (metrics) => {
      if (metrics.uptime >= 99.95) return { value: `${metrics.uptime.toFixed(2)}% (SLA Cumprido)`, status: "success" };
      if (metrics.uptime >= 99.0) return { value: `${metrics.uptime.toFixed(2)}% (SLA Violado / Alerta)`, status: "warning" };
      return { value: `${metrics.uptime.toFixed(2)}% (SLA Crítico / Indisponibilidade Severa)`, status: "danger" };
    },
    initiative: "Adoção de redundâncias de rede redundante multi-região e failover automatizado."
  },
  {
    id: "bsc-pro-1",
    perspective: "Interna",
    objective: "Minimizar bugs e indisponibilidades introduzidos por novos deploys",
    kpiName: "Porcentagem de mudanças aprovadas formalmente e revisadas pelo CAB",
    meta: "100% de mudanças com revisão do CAB",
    currentFormula: (metrics) => {
      if (metrics.changes >= 95) return { value: `${metrics.changes}% de mudanças em conformidade ITIL`, status: "success" };
      if (metrics.changes >= 60) return { value: `${metrics.changes}% (Processo Parcial - Riscos de Incumprimento)`, status: "warning" };
      return { value: `${metrics.changes}% (Processo Crítico - Deploys Ad-Hoc ilegais)`, status: "danger" };
    },
    initiative: "Bloqueio automatizado em esteira CI/CD para commits não acompanhados de ticket aprovado no CAB."
  },
  {
    id: "bsc-apr-1",
    perspective: "Aprendizagem",
    objective: "Educar o quadro de colaboradores para evitar vetores de Engenharia Social",
    kpiName: "Membros do NeoCredit treinados contra phishing e vazamentos",
    meta: "100% dos colaboradores com certificação anual",
    currentFormula: (metrics) => {
      if (metrics.training >= 100) return { value: "100% treinado (Imunidade Coletiva)", status: "success" };
      if (metrics.training >= 50) return { value: `${metrics.training}% treinado (Segurança Intermediária)`, status: "warning" };
      return { value: `${metrics.training}% treinado (Vulnerabilidade Humana Extrema)`, status: "danger" };
    },
    initiative: "Campanhas gamificadas de conscientização cibernética e simulados de phishing trimestrais."
  }
];

// Execution Roadmap (90-day plan)
export const ROADMAP_TASKS: RoadmapTask[] = [
  // Phase 1
  { 
    id: "task-1-1", 
    phaseId: "phase1", 
    title: "Mapeamento completo do fluxo de dados sensíveis de cooperados (LGPD)", 
    duration: "Semana 1-2", 
    assignedRole: "DPO", 
    completed: true,
    details: "Inventariar todas as tabelas, bancos legados, logs temporários e integrações de terceiros contendo CPF, chaves rústicas e dados financeiros."
  },
  { 
    id: "task-1-2", 
    phaseId: "phase1", 
    title: "Aprovação formal e publicação da Diretoria para a nova PSI do NeoCredit", 
    duration: "Semana 2-3", 
    assignedRole: "CISO", 
    completed: true,
    details: "Desenvolver as normativas de uso de senhas corporativas, política de mesas limpas, privilégios IAM e as penalidades para vazamento doloso."
  },
  { 
    id: "task-1-3", 
    phaseId: "phase1", 
    title: "Instaurar o comitê oficial CAB para aprovação sistemática de deploys", 
    duration: "Semana 3-4", 
    assignedRole: "Líder SRE", 
    completed: false,
    details: "Configurar ferramentas de rastreamento de mudanças e habilitar reunião semanal com pauta fixa técnica para aprovação de pacotes de código."
  },

  // Phase 2
  { 
    id: "task-2-1", 
    phaseId: "phase2", 
    title: "Aplicação compulsória de criptografia AES-256 no repouso", 
    duration: "Semana 5-6", 
    assignedRole: "Equipe Sec", 
    completed: false,
    details: "Ativar chaves gerenciadas de nuvem (KMS) nas tabelas transacionais críticas do NeoCredit e bases de arquivos estáticos."
  },
  { 
    id: "task-2-2", 
    phaseId: "phase2", 
    title: "Workshop de Privacidade de Dados para 100% dos Líderes do NeoCredit", 
    duration: "Semana 6-7", 
    assignedRole: "DPO & RH", 
    completed: false,
    details: "Encontro imersivo sobre multas repressivas, direitos do titular da LGPD e as normas básicas de reporte diante de qualquer anomalia."
  },
  { 
    id: "task-2-3", 
    phaseId: "phase2", 
    title: "Integração SAST/DAST automática no pipeline GitLab/GitHub DevOps", 
    duration: "Semana 7-8", 
    assignedRole: "DevSecOps", 
    completed: false,
    details: "Configurar ferramentas modernas para varredura de pendências e vulnerabilidades críticas em novos pull-requests, bloqueando vulnerabilidade OWASP Top 10."
  },

  // Phase 3
  { 
    id: "task-3-1", 
    phaseId: "phase3", 
    title: "Simulado Geral e Prático de Crise de Segurança (Ransomware)", 
    duration: "Semana 9-10", 
    assignedRole: "Comitê CRI", 
    completed: false,
    details: "Conduzir um simulado sem aviso prévio para restaurar backups integrados de bancos e monitorar a velocidade de contenção e o SLA da comissão."
  },
  { 
    id: "task-3-2", 
    phaseId: "phase3", 
    title: "Auditoria externa simulada e preparatório para certificação ISO 27001", 
    duration: "Semana 11-12", 
    assignedRole: "CISO & Auditor", 
    completed: false,
    details: "Avaliar o andamento de todos os itens do painel SGSI e gerar os relatórios formais para avaliação prévia na junta fiscalizadora."
  }
];
