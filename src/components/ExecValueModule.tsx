import React, { useState } from "react";
import { 
  Award, 
  Briefcase, 
  TrendingUp, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  HelpCircle, 
  Users, 
  FileText, 
  Sparkles, 
  Lightbulb, 
  Compass, 
  BookOpen, 
  Layers, 
  ArrowRight, 
  Lock,
  Activity,
  Check,
  XCircle,
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { MetricState } from "../types";

interface ExecValueModuleProps {
  metrics: MetricState;
  rosiInvest: number;
  rosiPerda: number;
  triggerNotification: (msg: string, type?: "success" | "info") => void;
  setActiveTab: (tabId: string) => void;
}

export default function ExecValueModule({
  metrics,
  rosiInvest,
  rosiPerda,
  triggerNotification,
  setActiveTab
}: ExecValueModuleProps) {
  const [activeSubTab, setActiveSubTab] = useState<"brm" | "roi_rosi" | "board_report" | "cases_culture">("brm");
  const [selectedCase, setSelectedCase] = useState<"sucesso" | "fracasso">("sucesso");
  const [stakeholderFilter, setStakeholderFilter] = useState<string>("all");

  // Semáforo calculations based on actual live metrics
  const uptimeStatus = metrics.uptime >= 99.8 ? "verde" : metrics.uptime >= 98.0 ? "amarelo" : "vermelho";
  const encryptStatus = metrics.encrypt >= 85 ? "verde" : metrics.encrypt >= 50 ? "amarelo" : "vermelho";
  const trainingStatus = metrics.training >= 80 ? "verde" : metrics.training >= 50 ? "amarelo" : "vermelho";
  const cabStatus = metrics.changes >= 90 ? "verde" : metrics.changes >= 70 ? "amarelo" : "vermelho";

  const computedRosiPercent = rosiInvest > 0 ? Math.round(((rosiPerda - rosiInvest) / rosiInvest) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Top Banner / Concept Intro */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-bold uppercase tracking-widest">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            Unidade 2 · Aula 2 & Lições de Governança
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Indicadores de Desempenho e Valor Estratégico da TI
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Superando o histórico abismo comunicacional corporativo: transformando a TI de um <strong className="text-rose-300 font-semibold">centro de custos oneroso</strong> para um <strong className="text-emerald-300 font-semibold">parceiro estratégico viabilizador de receitas</strong> através do Balanced Scorecard (BSC), matemática de justificativas (ROI/ROSI), relatórios executivos sem jargões e Business Relationship Management (BRM).
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => setActiveTab("bsc")}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-xs font-semibold backdrop-blur transition border border-white/10"
            >
              <Compass className="w-4 h-4 text-blue-300" />
              Ver BSC Adaptado da TI
            </button>
            <button
              onClick={() => setActiveSubTab("board_report")}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-blue-900/30 transition"
            >
              <FileText className="w-4 h-4" />
              Relatório Semáforo C-Level
            </button>
          </div>
        </div>
      </div>

      {/* Sub-navigation tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {([
          { id: "brm", label: "BRM & Tradutor Bilíngue", icon: Briefcase },
          { id: "roi_rosi", label: "ROI vs. ROSI (Matemática)", icon: TrendingUp },
          { id: "board_report", label: "Relatórios C-Level (Semáforo)", icon: FileText },
          { id: "cases_culture", label: "Cases & Cultura Devoradora", icon: Layers }
        ] as { id: string; label: string; icon: any; badge?: string }[]).map(st => {
          const IconComp = st.icon;
          const isActive = activeSubTab === st.id;
          return (
            <button
              key={st.id}
              onClick={() => setActiveSubTab(st.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition ${
                isActive
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <IconComp className={`w-4 h-4 ${isActive ? "text-blue-400" : "text-slate-400"}`} />
              {st.label}
              {st.badge && (
                <span className="bg-amber-500 text-slate-950 text-[10px] px-1.5 py-0.5 rounded-full font-black ml-1">
                  {st.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* --- SUBTAB 1: BRM & TRADUTOR BILÍNGUE --- */}
      {activeSubTab === "brm" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-6">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2.5">
                  <Briefcase className="w-6 h-6 text-blue-800" />
                  Business Relationship Management (BRM) · O Tradutor Bilíngue
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
                  O gestor de relacionamento de negócios atua como o elo proativo que domina tanto a <strong className="text-slate-800">linguagem comercial do negócio</strong> quanto as <strong className="text-slate-800">complexidades da engenharia de software</strong>, antecipando demandas antes que virem gargalos.
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-100 px-4 py-2 rounded-xl text-blue-900 text-xs font-bold shrink-0">
                Alinhamento Estratégico: Ativo
              </div>
            </div>

            {/* Abismo Comunicacional Matrix */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                Matriz de Tradução Instantânea (Como comprovar valor executivo no NeoCredit):
              </h4>
              <div className="grid grid-cols-1 gap-4">
                {[
                  {
                    tech: `Disponibilidade de ${metrics.uptime}% em servidores e microsserviços Kubernetes`,
                    business: `Garantia de processamento ininterrupto de R$ 14,2 milhões/dia em transações de crédito e PIX sem queda no checkout.`,
                    impact: "Proteção direta de Receita",
                    status: metrics.uptime >= 99.5 ? "excelente" : "risco"
                  },
                  {
                    tech: `Latência média de banco de dados na casa de 12ms (P99)`,
                    business: `Aumento de 18% na taxa de conversão do funil de onboarding de clientes, reduzindo abandono de tela e elevando o NPS.`,
                    impact: "Orientação ao Cliente",
                    status: "excelente"
                  },
                  {
                    tech: `${metrics.encrypt}% da base de dados com criptografia AES-256 e políticas de DLP`,
                    business: `Mitigação de multas regulatórias da LGPD (até R$ 50M) e salvaguarda absoluta da reputação institucional perante o BACEN.`,
                    impact: "Mitigação Financeira de Sinistros",
                    status: metrics.encrypt >= 80 ? "excelente" : "risco"
                  },
                  {
                    tech: `${metrics.changes}% de mudanças em produção aprovadas via rito de CAB / CI-CD`,
                    business: `Eliminação de rollbacks emergenciais de madrugada e zero downtime comercial durante lançamentos de novas funcionalidades.`,
                    impact: "Excelência Operacional",
                    status: metrics.changes >= 85 ? "excelente" : "risco"
                  }
                ].map((row, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-blue-300 transition grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                    <div className="lg:col-span-5 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Métrica Operacional reportada pela TI</span>
                      <p className="font-mono text-xs sm:text-sm font-semibold text-slate-800 bg-white p-3 rounded-xl border border-slate-200">
                        {row.tech}
                      </p>
                    </div>

                    <div className="lg:col-span-1 flex justify-center hidden lg:flex">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-black">
                        →
                      </div>
                    </div>

                    <div className="lg:col-span-6 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 block">Tradução BRM para a Diretoria (Valor Estratégico)</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase ${
                          row.status === "excelente" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                        }`}>
                          {row.impact}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-blue-900/5 to-indigo-900/5 p-3 rounded-xl border border-blue-200/60 leading-relaxed">
                        "{row.business}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* BRM Proactive advice */}
            <div className="bg-indigo-950 text-indigo-100 rounded-2xl p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="space-y-1 max-w-2xl">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Papel Proativo do Líder BRM no NeoCredit
                </h4>
                <p className="text-xs text-indigo-200 leading-relaxed">
                  O gestor senta-se periodicamente com Vendas, Marketing e Riscos para entender dores antes que virem pedidos urgentes, gerenciando expectativas para <strong className="text-white underline">evitar o excesso de promessas tecnológicas</strong>.
                </p>
              </div>
              <button
                onClick={() => {
                  triggerNotification("Sessão de BRM simulada agendada com as diretorias comerciais!", "success");
                }}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-black shrink-0 shadow-lg transition"
              >
                Simular Alinhamento BRM
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* --- SUBTAB 2: ROI vs ROSI --- */}
      {activeSubTab === "roi_rosi" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-5">
              <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <TrendingUp className="w-6 h-6 text-blue-800" />
                Justificativas Matemáticas: ROI vs. ROSI
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Para aprovar projetos de alto custo (ex: migração massiva cloud-native de datacenters on-premise), o conselho exige cálculos exatos. Um Business Case maduro quantifica ganhos diretos e mitigação de sinistros.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ROI Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-extrabold text-blue-800 uppercase px-2 py-1 bg-blue-100 rounded-md">
                      Cálculo de Eficiência Direta
                    </span>
                    <h4 className="text-lg font-black text-slate-900 mt-2">ROI (Retorno sobre Investimento)</h4>
                  </div>
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Aplicável quando o projeto gera receita direta ou economia operacional palpável. Exemplo: Novo sistema de automação de marketing ou migração cloud que reduz custos de infraestrutura física.
                </p>
                <div className="bg-white p-4 rounded-xl border border-slate-200 font-mono text-xs text-slate-800">
                  <span className="text-slate-400 text-[10px] block">Fórmula Matemática do ROI:</span>
                  ROI = ((Ganhos Financeiros Diretos - Custo do Projeto) / Custo do Projeto) × 100
                </div>
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs font-semibold">
                  Exemplo NeoCredit: Migração Cloud gerando +R$ 1.2M em eficiência operacional por ano.
                </div>
              </div>

              {/* ROSI Card */}
              <div className="bg-gradient-to-br from-blue-950 to-slate-900 text-white rounded-2xl p-6 space-y-4 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <span className="text-[10px] font-extrabold text-amber-300 uppercase px-2 py-1 bg-amber-400/20 rounded-md border border-amber-400/30">
                      Cálculo de Sinistro Evitado
                    </span>
                    <h4 className="text-lg font-black text-white mt-2">ROSI (Return on Security Investment)</h4>
                  </div>
                  <Shield className="w-6 h-6 text-amber-400" />
                </div>
                <p className="text-xs text-slate-300 leading-relaxed relative z-10">
                  Diferente de máquinas fabris, investimentos em segurança (como IDS avançado ou DLP) não produzem peças por hora. O retorno é medido pela <strong className="text-amber-300">mitigação financeira de catástrofes</strong> (resgates de ransomware e multas LGPD).
                </p>
                <div className="bg-black/40 p-4 rounded-xl border border-white/10 font-mono text-xs text-blue-200 relative z-10">
                  <span className="text-slate-400 text-[10px] block">Fórmula Matemática do ROSI:</span>
                  ROSI = ((Mitigação de Perda Estimada - Investimento) / Investimento) × 100
                </div>

                {/* Live ROSI Synchronized display */}
                <div className="p-4 bg-white/10 border border-white/15 rounded-xl space-y-2 relative z-10 backdrop-blur">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">Investimento Anual Calibrado:</span>
                    <strong className="text-amber-300">R$ {rosiInvest.toLocaleString("pt-BR")}</strong>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">Sinistro Evitado (LGPD/BACEN):</span>
                    <strong className="text-emerald-300">R$ {rosiPerda.toLocaleString("pt-BR")}</strong>
                  </div>
                  <div className="pt-2 border-t border-white/10 flex justify-between items-center">
                    <span className="text-xs font-bold text-white uppercase">Fator ROSI Calculado:</span>
                    <span className={`text-sm font-black px-2.5 py-0.5 rounded-lg ${
                      computedRosiPercent >= 100 ? "bg-emerald-500 text-slate-950" : "bg-blue-500 text-white"
                    }`}>
                      +{computedRosiPercent}% de Retorno Preventivo
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-100 p-4 rounded-2xl text-center text-xs text-slate-600 font-medium">
              💡 <strong className="text-slate-900">Dica de Conselho:</strong> Você pode ajustar livremente os valores de investimento em segurança na aba <strong className="underline cursor-pointer text-blue-800" onClick={() => setActiveTab("analytics")}>Análises Avançadas</strong> e observar o impacto financeiro aqui em tempo real.
            </div>
          </div>
        </motion.div>
      )}

      {/* --- SUBTAB 3: RELATORIOS C-LEVEL (SEMÁFORO) --- */}
      {activeSubTab === "board_report" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2.5">
                  <FileText className="w-6 h-6 text-blue-800" />
                  Relatórios para Alta Gestão (Conselho & Diretoria)
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Regra de Ouro: <strong className="text-slate-900">Ausência total de jargões técnicos</strong>. O conselho não precisa saber qual protocolo de roteamento ou versão do DB está rodando. Apresentado em modelo <strong className="text-slate-900">Semáforo (Verde, Amarelo, Vermelho)</strong>.
                </p>
              </div>
              <button
                onClick={() => {
                  triggerNotification("Relatório Executivo PDF gerado e enviado ao Conselho de Administração!", "success");
                }}
                className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold shrink-0 shadow flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Exportar Relatório Semáforo C-Level
              </button>
            </div>

            {/* Dashboard Executivo Semáforo */}
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-wrap gap-4 justify-between items-center text-xs font-bold text-slate-700">
                <span>Painel Executivo Consolidador (KPIs & KRIs do NeoCredit)</span>
                <div className="flex gap-3">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> Verde (Saudável)</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500 inline-block" /> Amarelo (Atenção)</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-rose-500 inline-block" /> Vermelho (Crítico)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Pilar 1: Saúde do Portfólio de Projetos */}
                <div className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-white shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-extrabold text-slate-800">1. Saúde do Portfólio</span>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                      cabStatus === "verde" ? "bg-emerald-100 text-emerald-800" :
                      cabStatus === "amarelo" ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800"
                    }`}>
                      {cabStatus}
                    </span>
                  </div>
                  <div className="space-y-3 text-xs text-slate-600 divide-y divide-slate-100">
                    <div className="pt-2 flex justify-between">
                      <span>Migração Cloud-Native:</span>
                      <strong className="text-emerald-700">No Prazo (Verde)</strong>
                    </div>
                    <div className="pt-2 flex justify-between">
                      <span>Esteira CI/CD Aprovada CAB:</span>
                      <strong className={cabStatus === "verde" ? "text-emerald-700" : "text-amber-700"}>
                        {metrics.changes}% Conformidade
                      </strong>
                    </div>
                    <div className="pt-2 flex justify-between">
                      <span>Disponibilidade Core PIX:</span>
                      <strong className={uptimeStatus === "verde" ? "text-emerald-700" : "text-rose-700"}>
                        {metrics.uptime}% SLA
                      </strong>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 italic pt-1">
                    Tradução: Todos os grandes projetos estruturantes de arquitetura suportam o plano comercial sem atrasos impeditivos.
                  </p>
                </div>

                {/* Pilar 2: Níveis de Risco de Compliance */}
                <div className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-white shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-extrabold text-slate-800">2. Riscos de Compliance</span>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                      encryptStatus === "verde" && trainingStatus === "verde" ? "bg-emerald-100 text-emerald-800" :
                      encryptStatus === "vermelho" || trainingStatus === "vermelho" ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800"
                    }`}>
                      {encryptStatus === "verde" && trainingStatus === "verde" ? "verde" : encryptStatus === "vermelho" ? "vermelho" : "amarelo"}
                    </span>
                  </div>
                  <div className="space-y-3 text-xs text-slate-600 divide-y divide-slate-100">
                    <div className="pt-2 flex justify-between">
                      <span>Aderência à LGPD (Dados):</span>
                      <strong className={encryptStatus === "verde" ? "text-emerald-700" : "text-rose-700"}>
                        {metrics.encrypt}% Criptografados
                      </strong>
                    </div>
                    <div className="pt-2 flex justify-between">
                      <span>Conscientização Anti-Phishing:</span>
                      <strong className={trainingStatus === "verde" ? "text-emerald-700" : "text-amber-700"}>
                        {metrics.training}% Treinados
                      </strong>
                    </div>
                    <div className="pt-2 flex justify-between">
                      <span>Resolução BACEN 4.893:</span>
                      <strong className="text-emerald-700">Auditado (Verde)</strong>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 italic pt-1">
                    Tradução: Controles ativos de mitigação legal evitam exposição reputacional e multas regulatórias severas.
                  </p>
                </div>

                {/* Pilar 3: Orçamentos Aprovados */}
                <div className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-white shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-extrabold text-slate-800">3. Orçamento e Finanças</span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                      verde
                    </span>
                  </div>
                  <div className="space-y-3 text-xs text-slate-600 divide-y divide-slate-100">
                    <div className="pt-2 flex justify-between">
                      <span>Execução CAPEX Cloud:</span>
                      <strong className="text-emerald-700">94% do Planejado</strong>
                    </div>
                    <div className="pt-2 flex justify-between">
                      <span>Economia OPEX Licenças:</span>
                      <strong className="text-blue-700">+R$ 480k Evitados</strong>
                    </div>
                    <div className="pt-2 flex justify-between">
                      <span>Fator ROSI em Controles:</span>
                      <strong className="text-emerald-700">+{computedRosiPercent}% Liquidez</strong>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 italic pt-1">
                    Tradução: Gestão austera de ativos tecnológicos (ITAM) e previsibilidade financeira absoluta.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-blue-900 text-white rounded-2xl text-xs leading-relaxed flex items-center gap-3">
                <Lightbulb className="w-5 h-5 text-amber-400 shrink-0" />
                <span>
                  <strong>Transparência Executiva:</strong> A clareza destes relatórios, mesmo na eventual comunicação executiva de falhas ou atrasos, é o pilar fundamental para construir a credibilidade institucional de longo prazo da TI junto ao board.
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* --- SUBTAB 4: CASES & CULTURA --- */}
      {activeSubTab === "cases_culture" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-5">
              <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <Layers className="w-6 h-6 text-blue-800" />
                Estudos de Caso, Stakeholders & Desafios Culturais
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                A famosa máxima corporativa de que <strong className="text-slate-900">"a cultura devora a estratégia no café da manhã"</strong> é perfeitamente aplicável à governança de TI. A burocracia só funciona quando protege os times.
              </p>
            </div>

            {/* Cases switcher */}
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedCase("sucesso")}
                className={`flex-1 p-4 rounded-2xl border text-left transition ${
                  selectedCase === "sucesso"
                    ? "bg-emerald-50 border-emerald-500 shadow-sm"
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-emerald-800 px-2 py-0.5 bg-emerald-200/60 rounded">Fintech Digital</span>
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm mt-2">Caso de Sucesso: Transformação Cloud</h4>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">TI tratada como negócio viabilizador e comitês ágeis focados na experiência do cliente final.</p>
              </button>

              <button
                onClick={() => setSelectedCase("fracasso")}
                className={`flex-1 p-4 rounded-2xl border text-left transition ${
                  selectedCase === "fracasso"
                    ? "bg-rose-50 border-rose-500 shadow-sm"
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-rose-800 px-2 py-0.5 bg-rose-200/60 rounded">Colapso Governamental</span>
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm mt-2">Caso de Fracasso: ERP Milionário</h4>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">Excedeu orçamento em centenas de milhões por ausência de patrocínio executivo e gestão de riscos.</p>
              </button>
            </div>

            {/* Case Details Card */}
            <AnimatePresence mode="wait">
              {selectedCase === "sucesso" ? (
                <motion.div key="suc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 bg-emerald-50/50 border border-emerald-200 rounded-2xl space-y-4">
                  <h4 className="font-black text-emerald-950 text-base flex items-center gap-2">
                    🚀 Lições de Quem Venceu: Fintechs & Transformação Digital Madura
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    Nesses cenários, a tecnologia não foi enxergada como um departamento isolado nos fundos da empresa, mas como <strong className="text-emerald-900">o próprio coração comercial do negócio</strong>. Os comitês de governança atuaram não como bloqueadores burocráticos de inovação, mas como <strong className="underline">viabilizadores ágeis de investimentos</strong>.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 font-semibold text-xs">
                    <div className="bg-white p-3 rounded-xl border border-emerald-100 shadow-sm text-emerald-900">
                      ✅ Patrocínio C-Level Ativo e engajado
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-emerald-100 shadow-sm text-emerald-900">
                      ✅ Quick Wins (Começar pequeno e escalar)
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-emerald-100 shadow-sm text-emerald-900">
                      ✅ Governança invisível e automatizada
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="fra" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 bg-rose-50/50 border border-rose-200 rounded-2xl space-y-4">
                  <h4 className="font-black text-rose-950 text-base flex items-center gap-2">
                    💥 Lições de Quem Faliu: O Desastre do ERP Governamental
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    Projetos monumentais que tentam implementar COBIT, ITIL e ISO 27001 simultaneamente e em toda a sua complexidade de uma só vez (Big Bang). Falham não por erros exclusivos na sintaxe do código ou no hardware, mas por <strong className="text-rose-900">ausência sistêmica de controle de riscos e gestão de mudanças não auditável</strong>.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 font-semibold text-xs">
                    <div className="bg-white p-3 rounded-xl border border-rose-100 shadow-sm text-rose-900">
                      ❌ Burocracia policialesca percebida pelos devs
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-rose-100 shadow-skew text-rose-900">
                      ❌ Detratores ignorados na mesa de desenho
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-rose-100 shadow-sm text-rose-900">
                      ❌ Falta de patrocinador executivo comercial
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stakeholder mapping section */}
            <div className="space-y-4 border-t border-slate-100 pt-6">
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-700" />
                Mapeamento de Stakeholders · Promotores vs. Detratores
              </h4>
              <p className="text-xs text-slate-500">
                O engajamento não significa impor cartilhas de compliance de cima para baixo; significa trazer os líderes para a mesa. Quando um CFO entende que a política restrita de acesso evita multas da LGPD, ele passa a patrocinar a norma.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                  <span className="text-xs font-black text-emerald-800 uppercase flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" /> Promotores (Aliados Estratégicos)
                  </span>
                  <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                    <li><strong>CFO (Diretor Financeiro):</strong> Patrocina políticas de DLP ao ver cálculo ROSI mitigando perdas operacionais.</li>
                    <li><strong>DPO (Data Protection Officer):</strong> Aliado nato na cobrança de evidências de conformidade contínua.</li>
                    <li><strong>Líder BRM:</strong> Traduz entregas técnicas em vantagens competitivas de mercado.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
                  <span className="text-xs font-black text-amber-800 uppercase flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" /> Detratores (Resistência Cultural)
                  </span>
                  <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                    <li><strong>Devs Sêniores acostumados a Workarounds:</strong> Reclamam de matrizes RACI e comitês CAB. <em>Solução: Provar que o CAB protege o dev contra culpa por falhas de madrugada.</em></li>
                    <li><strong>Head de Vendas Imediatista:</strong> Teme que regras de segurança atrasem o onboarding de clientes.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Sintonia do Saber / Artigo CIOCast Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-6">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white space-y-2 shadow">
                <span className="text-[10px] font-black uppercase text-amber-300 tracking-widest block">🎧 CIOCast Recomendado · Ep #27</span>
                <h5 className="font-extrabold text-sm text-white">Governança de T.I e Risco na Era da IA</h5>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Discussão executiva sobre como transformar conceitos teóricos de governança em decisões corporativas práticas sem estrangular a agilidade e a inovação digital.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-900 to-slate-900 text-white space-y-2 shadow">
                <span className="text-[10px] font-black uppercase text-blue-300 tracking-widest block">📖 Artigo Científico · Ladeira Garbaccio & Lubieska (2024)</span>
                <h5 className="font-extrabold text-sm text-white">Governança e Boas Práticas na LGPD</h5>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Demonstra que a verdadeira conformidade vai além de avisos de cookies no site: reside na <strong className="text-emerald-300">Accountability contínua</strong> e capacidade de provar diligência e prevenção legal.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
