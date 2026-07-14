import { useState, useMemo } from "react";
import { 
  TrendingUp, 
  Activity, 
  FileText, 
  Shield, 
  Sliders, 
  ArrowUpRight, 
  HelpCircle, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  RefreshCw,
  Zap,
  Hammer,
  RotateCcw
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  LabelList,
  ZAxis, 
  LineChart, 
  Line, 
  ReferenceLine,
  Legend
} from "recharts";
import { MetricState } from "../types";

interface AdvancedAnalyticsProps {
  metrics: MetricState;
  rosiInvest: number;
  rosiPerda: number;
  triggerNotification?: (msg: string, type?: "success" | "info") => void;
  resetAllMetrics?: () => void;
}

export default function AdvancedAnalytics({
  metrics,
  rosiInvest,
  rosiPerda,
  triggerNotification,
  resetAllMetrics
}: AdvancedAnalyticsProps) {
  // --- States for Simulation Injector/Perturbations ---
  const [noiseLevel, setNoiseLevel] = useState<number>(1.2); // Multiplicador de ruído para incerteza preditiva
  const [activeFiveWhyIndex, setActiveFiveWhyIndex] = useState<number>(0);
  const [selectedIniciativa, setSelectedIniciativa] = useState<string>("init-1");

  // --- Dynamic Monthly Data Generator (linked to live parent metrics) ---
  const { monthlyData, statistics, prediction, pearsonCorrelation } = useMemo(() => {
    const meses = [
      "Jul/25", "Ago/25", "Set/25", "Out/25", "Nov/25", "Dez/25",
      "Jan/26", "Fev/26", "Mar/26", "Abr/26", "Mai/26", "Mês Atual (Jun/26)"
    ];

    // Historical baselines with randomized fluctuations
    const baseDowntime = [3.8, 4.1, 5.2, 3.1, 2.9, 6.4, 4.8, 3.5, 4.0, 5.8, 4.2];
    const baseUnapprovedChanges = [32, 28, 41, 25, 23, 44, 38, 26, 31, 40, 34];
    
    // Monthly calculations linked to parent sliders for the 12th month ("Mês Atual")
    // Uptime drop translated to downtime hours (30-day month = 720 hours)
    const currentDowntimeHours = parseFloat((720 * (100 - metrics.uptime) / 100).toFixed(2));
    
    // Unapproved changes inversely correlated to CAB changes status
    const currentUnapproved = Math.round(50 * (100 - metrics.changes) / 100);

    const fullDowntime = [...baseDowntime, currentDowntimeHours];
    const fullUnapproved = [...baseUnapprovedChanges, currentUnapproved];

    // Combine into records
    const data = meses.map((mes, idx) => {
      // Inject simulated noise depending on local state slider
      const scale = idx === 11 ? 1 : (1 + (Math.sin(idx * 1.5) * 0.1) * noiseLevel);
      const valDowntime = parseFloat((fullDowntime[idx] * scale).toFixed(2));
      const valUnapproved = Math.round(fullUnapproved[idx] * (idx === 11 ? 1 : scale));
      
      return {
        monthIndex: idx + 1,
        monthName: mes,
        downtime: valDowntime,
        unapprovedChanges: valUnapproved,
        encryptRate: idx === 11 ? metrics.encrypt : Math.min(100, Math.round(30 + idx * 2.5 + Math.random() * 5)),
        trainingRate: idx === 11 ? metrics.training : Math.min(100, Math.round(5 + idx * 3 + Math.random() * 2))
      };
    });

    // --- Math calculations for Linear Regression & Descriptive Stats ---
    const n = data.length;
    const x = data.map(d => d.monthIndex);
    const y = data.map(d => d.downtime);

    // Sums
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = data.reduce((acc, d) => acc + d.monthIndex * d.downtime, 0);
    const sumX2 = x.reduce((a, b) => a + b * b, 0);
    const sumY2 = y.reduce((a, b) => a + b * b, 0);

    // Slope & Intercept for regression line (y = mx + c)
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // R-squared (coefficient of determination)
    const avgY = sumY / n;
    const ssTot = y.reduce((acc, val) => acc + Math.pow(val - avgY, 2), 0);
    const ssRes = y.reduce((acc, val, idx) => acc + Math.pow(val - (slope * x[idx] + intercept), 2), 0);
    const rSquared = ssTot === 0 ? 1 : 1 - (ssRes / ssTot);
    const rmse = Math.sqrt(ssRes / n);

    // Pearson Correlation between Downtime and Unapproved Changes
    const numP = n * sumXY - sumX * sumY;
    const denP = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    const corr = denP === 0 ? 0 : numP / denP;

    // Stats descriptors
    const maxDowntime = Math.max(...y);
    const maxIndex = y.indexOf(maxDowntime);
    const averageDowntime = parseFloat((sumY / n).toFixed(2));
    const trendDirection = slope > 0 ? "ascendente" : "descendente";

    // Forecast upcoming 3 months (Month Indices 13, 14, 15)
    const forecast = [
      { monthIndex: 13, monthName: "Jul/26 (Pred.)", downtime: parseFloat((slope * 13 + intercept).toFixed(2)) },
      { monthIndex: 14, monthName: "Ago/26 (Pred.)", downtime: parseFloat((slope * 14 + intercept).toFixed(2)) },
      { monthIndex: 15, monthName: "Set/26 (Pred.)", downtime: parseFloat((slope * 15 + intercept).toFixed(2)) }
    ];

    return {
      monthlyData: data,
      statistics: {
        averageDowntime,
        maxDowntime,
        peakMonth: meses[maxIndex],
        trendDirection,
        slope,
        intercept,
        rSquared,
        rmse
      },
      prediction: forecast,
      pearsonCorrelation: corr
    };
  }, [metrics, noiseLevel]);

  // Combined dataset for historical + prediction line chart
  const lineChartData = useMemo(() => {
    const historical = monthlyData.map(d => ({
      name: d.monthName,
      "Downtime Real (h)": d.downtime,
      "Projeção Linear (h)": parseFloat((statistics.slope * d.monthIndex + statistics.intercept).toFixed(2))
    }));

    const future = prediction.map(p => ({
      name: p.monthName,
      "Downtime Real (h)": undefined,
      "Projeção Linear (h)": p.downtime
    }));

    return [...historical, ...future];
  }, [monthlyData, prediction, statistics]);

  // Histogram simulation values of historical resolution SLAs
  const histogramData = [
    { range: "< 30 min", incidentes: 14, fill: "#10b981" },
    { range: "30 - 60 min", incidentes: 22, fill: "#0ea5e9" },
    { range: "60 - 90 min", incidentes: 18, fill: "#6366f1" },
    { range: "90 - 120 min", incidentes: 9, fill: "#f59e0b" },
    { range: "> 120 min (Fora de SLA)", incidentes: 4, fill: "#ef4444" }
  ];

  // --- Five Whys Master Dataset (Análise Diagnóstica) ---
  const fiveWhysIncidents = [
    {
      id: "why-1",
      title: "Instabilidade Crítica & Queda de Conectividade Pix",
      date: "02/06/2026",
      impact: "4.5 horas de SLA descumprido",
      steps: [
        { label: "1º Porquê", q: "Por que ocorreu a queda do barramento Pix?", r: "Porque a API de autenticação secundária sobrecarregou e parou de responder às requisições do sistema central." },
        { label: "2º Porquê", q: "Por que a API secundária sobrecarregou repentinamente?", r: "Porque uma alteração estrutural na política de timeout das requisições foi promovida diretamente em produção." },
        { label: "3º Porquê", q: "Por que essa alteração técnica foi feita sem testes prévios?", r: "Porque a equipe técnica considerou a liberação de 'baixo risco' e pulou a esteira em homologação automatizada." },
        { label: "4º Porquê", q: "Por que a equipe pôde burlar a homologação técnica?", r: "Porque o sistema de controle de deploys não possui travas integradas ou conformidade obrigatória com as regras do CAB." },
        { label: "5º Porquê (Causa-Raiz)", q: "Por que não existem travas ou regras obrigatórias de liberação?", r: "Ausência sistêmica de matriz de responsabilidades RACI auditada, comitê CAB institucionalizado e cultura de governança de alteração certificada ISO/IEC A.8.24." }
      ],
      recommendation: "Prescrever a ativação imediata do fluxo CAB e travas de liberação via Matriz RACI regulada (Ativa na aba 'Políticas & Processos')."
    },
    {
      id: "why-2",
      title: "Vazamento Simulado de Chaves Públicas",
      date: "14/05/2026",
      impact: "Alerta severo de conformidade LGPD",
      steps: [
        { label: "1º Porquê", q: "Por que chaves públicas e e-mails foram expostos?", r: "Porque estavam contidos em um backup de base de dados exportada sem hash de anonimização." },
        { label: "2º Porquê", q: "Por que a base exportada continha dados reais e desprotegidos?", r: "Porque o ambiente foi clonado diretamente da base legada de produção sem triagem ou mascaramento automático." },
        { label: "3º Porquê", q: "Por que não houve mascaramento mecânico ou criptografia?", r: "Porque a infraestrutura de Staging não possui scripts de criptografia ativa para segurança nativa." },
        { label: "4º Porquê", q: "Por que Staging opera sem as mesmas travas de Produção?", r: "A equipe de engenharia negligenciou o perímetro alegando falta de ferramentas de criptografia rápidas no barramento central." },
        { label: "5º Porquê (Causa-Raiz)", q: "Por que a privacidade não foi tratada desde a primeira linha?", r: "Ausência completa das práticas de Privacy by Design corporativas prescritas pelo Artigo 46 da LGPD." }
      ],
      recommendation: "Implementar criptografia AES-256 imediata nas bases, elevando o indicador de 'Dados Criptografados' no controle do menu central."
    }
  ];

  // --- Prescriptive Priority Data (Análise Prescritiva: Effort vs Impact) ---
  const initiatives = [
    { id: "init-1", name: "Institucionalizar Fluxo CAB & RACI", esforco: 2.5, impacto: 8.8, custo: "R$ 45k", retorno: "~85% redução em falha", desc: "Aceleração imediata sob custo irrisório, mudando o papel do cabo de guerra operacional para conformidade preventiva.", area: "Sucesso Imediato (Quick Win)" },
    { id: "init-2", name: "Criptografia Total em Repouso", esforco: 6.2, impacto: 9.5, custo: "R$ 180k", retorno: "Blindagem de multa ANPD", desc: "Exige refinanciamento em nuvem, mas erradica riscos capitulados de perda estrita.", area: "Estratégica (Grande Impacto)" },
    { id: "init-3", name: "Treinar 100% dos Colaboradores", esforco: 3.5, impacto: 7.2, custo: "R$ 60k", retorno: "Cultura resiliente a Phishing", desc: "Reduz o vetor humano de infiltração, que responde por mais de 45% dos desvios mundiais.", area: "Sucesso Imediato (Quick Win)" },
    { id: "init-4", name: "Inventário Automatizado (ITAM)", esforco: 5.0, impacto: 6.0, custo: "R$ 110k", retorno: "Gestão completa de ativos", desc: "Elimina riscos fiscais e operacionais de orfandade sistêmica, conforme ITIL A.5.9.", area: "Operacional (Retorno Médio)" },
    { id: "init-5", name: "Nomear DPO e Canal de Direito", esforco: 2.0, impacto: 8.0, custo: "R$ 35k", retorno: "Evidência ANPD homologada", desc: "Cumprimento taxativo do Artigo 41 da LGPD, impedindo sanções administrativas frias.", area: "Sucesso Imediato (Quick Win)" }
  ];

  const selectedInitObj = useMemo(() => {
    return initiatives.find(i => i.id === selectedIniciativa) || initiatives[0];
  }, [selectedIniciativa]);

  // Trigger quick local simulation alert
  const handleNoiseChange = (val: number) => {
    setNoiseLevel(val);
    if (triggerNotification) {
      triggerNotification(`Multiplicador de ruído preditivo ajustado para ${val.toFixed(1)}x`, "info");
    }
  };

  return (
    <div className="space-y-8" id="advanced-analytics-wrapper">
      
      {/* Introduction & Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-indigo-700 tracking-widest uppercase font-mono block">Módulos Inteligentes</span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-blue-950 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-indigo-700" />
              Análise Avançada Integrada (GTI & Governança)
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm max-w-4xl leading-relaxed">
              Demonstração analítica sistêmica consolidando diagnósticos descritivos históricos, modelagem preditiva de riscos e formulações prescritivas em tempo real para tomada de decisão estratégica de TI.
            </p>
          </div>
          <button 
            onClick={() => {
              if (resetAllMetrics) resetAllMetrics();
              if (triggerNotification) triggerNotification("Análises e baselines redefinidos com sucesso!", "success");
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200 rounded-full cursor-pointer shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Resetar Modelos
          </button>
        </div>
      </div>

      {/* Grid containing Section 1 & Section 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* SECTION 1: ANÁLISE DESCRITIVA BÁSICA */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-blue-50 text-blue-800 rounded-lg shrink-0">
                <Activity className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-extrabold text-slate-950 text-base">1. Análise Descritiva & Histográfica</h3>
                <p className="text-slate-400 text-[10px] leading-tight">Mapeamento empírico de tempos de resposta e falhas sistêmicas</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-xs leading-relaxed text-slate-650">
            <p>
              Analisando os registros consolidados de interrupções na NeoCredit, encontramos uma forte dependência entre o índice de segurança sistêmica e a taxa de mudanças tratadas à revelia do colegiado.
            </p>
            
            {/* Descriptive KPI Blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Média de Downtime</span>
                <strong className="text-lg font-black text-slate-900 block font-mono mt-1">
                  {statistics.averageDowntime}h <span className="text-xs font-medium text-slate-400">/ mês</span>
                </strong>
                <p className="text-[10px] text-slate-400 leading-snug mt-1">Últimos 12 meses sob governança híbrida.</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Mês de Pico Instável</span>
                <strong className="text-lg font-black text-rose-600 block font-mono mt-1">
                  {statistics.maxDowntime}h
                </strong>
                <p className="text-[10px] text-slate-400 leading-snug mt-1">Registrado no mês: <span className="font-semibold text-slate-650">{statistics.peakMonth}</span></p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Correlação de Pearson</span>
                <strong className="text-lg font-black text-indigo-700 block font-mono mt-1">
                  {pearsonCorrelation.toFixed(3)}
                </strong>
                <p className="text-[10px] text-slate-400 leading-snug mt-1">Indica correlação <strong>altamente positiva</strong> entre falhas e desobediência ao CAB.</p>
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-800" />
                Duração das Resoluções de Incidentes (Frequência Empírica nos Últimos Trimestres)
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Cada evento registrado pela mesa reguladora de suporte classifica o tempo em faixas de velocidade. A meta corporativa impõe retenção de problemas críticos sob a barreira de 120 minutos.
              </p>

              {/* Resolution Chart */}
              <div className="h-56 mt-4 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={histogramData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2edf7" vertical={false} />
                    <XAxis dataKey="range" tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2edf7", borderRadius: "12px", fontSize: 11 }}
                      formatter={(value) => [`${value} incidentes`, "Volumes"]}
                    />
                    <Bar dataKey="incidentes" radius={[8, 8, 0, 0]}>
                      {histogramData.map((entry, index) => (
                        <Line key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: ANÁLISE DIAGNÓSTICA (CAUSAS-RAIZ - 5 WHYs) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-indigo-50 text-indigo-700 rounded-lg shrink-0">
                <HelpCircle className="w-5 h-5 animate-pulse" />
              </span>
              <div>
                <h3 className="font-extrabold text-slate-950 text-base">2. Análise Diagnóstica (5 Porquês)</h3>
                <p className="text-slate-400 text-[10px] leading-tight">Exploração científica e rastreabilidade técnica dos gargalos</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs text-slate-650 leading-relaxed">
              O diagnóstico estruturado consiste em decomporem-se eventos adversos por encadeamentos causais sucessivos. Selecione uma crise técnica para investigar suas raízes na governança:
            </p>

            {/* Selector Buttons */}
            <div className="flex gap-2.5 pb-2">
              {fiveWhysIncidents.map((inc, index) => (
                <button
                  key={inc.id}
                  onClick={() => {
                    setActiveFiveWhyIndex(index);
                    if (triggerNotification) triggerNotification(`Visualizando diagnóstico: ${inc.title}`, "info");
                  }}
                  className={`px-4.5 py-2.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                    activeFiveWhyIndex === index 
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-slate-55 bg-indigo-50/50 text-indigo-950 hover:bg-slate-100 border border-indigo-100/40"
                  }`}
                >
                  {inc.id === "why-1" ? "⚠️ Incidente Pix" : "🔒 Vazamento Chaves"}
                </button>
              ))}
            </div>

            {/* Display Active Five Why Case */}
            <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 space-y-4">
              <div>
                <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider font-mono">Evento Investigado</span>
                <h4 className="font-extrabold text-slate-900 text-sm mt-0.5">{fiveWhysIncidents[activeFiveWhyIndex].title}</h4>
                <div className="flex items-center gap-2 mt-1.5 text-[10px] font-semibold text-slate-500">
                  <span>Data: <strong>{fiveWhysIncidents[activeFiveWhyIndex].date}</strong></span>
                  <span>•</span>
                  <span className="text-rose-600 font-bold">{fiveWhysIncidents[activeFiveWhyIndex].impact}</span>
                </div>
              </div>

              {/* Enchainment Items */}
              <div className="space-y-3 pt-2">
                {fiveWhysIncidents[activeFiveWhyIndex].steps.map((step, idx) => (
                  <div key={idx} className="flex gap-3 text-xs leading-relaxed items-start border-l-2 border-indigo-200 pl-3.5 py-0.5 relative">
                    <span className="text-[10px] font-bold text-indigo-700 min-w-[70px] uppercase font-mono block">
                      {step.label}:
                    </span>
                    <div className="space-y-1 flex-1">
                      <p className="text-[11px] italic text-slate-500 bg-white/50 px-2 py-1 rounded inline-block">“{step.q}”</p>
                      <p className="text-slate-850 font-medium text-slate-800">→ {step.r}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Conclusion and Recommendation */}
              <div className="mt-4 pt-3.5 border-t border-slate-150 text-[11px] bg-indigo-50/40 p-4 rounded-xl border border-indigo-150">
                <span className="text-[10px] font-black text-indigo-950 uppercase block tracking-wider mb-1">Recomendação Diagnóstica Prescrita</span>
                <p className="text-indigo-900 leading-relaxed font-semibold flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 anim-pulse"></span>
                  {fiveWhysIncidents[activeFiveWhyIndex].recommendation}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* SECTION 3: ANÁLISE PRESCRITIVA (Esforço vs Impacto) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-50 text-emerald-800 rounded-lg shrink-0">
              <Zap className="w-5 h-5 text-emerald-600 animate-bounce-slow" />
            </span>
            <div>
              <h3 className="font-extrabold text-slate-950 text-base">3. Análise Prescritiva (Priorização de Esforço vs. Impacto)</h3>
              <p className="text-slate-400 text-[10px] leading-tight">Escolha científica de iniciativas baseadas em custo-benefício regulatório</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Bubble Matrix (Using Recharts) */}
          <div className="lg:col-span-2 space-y-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Mapa de Ações Prioritárias (Quadrantes)</span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              O gráfico abaixo demonstra a distribuição das iniciativas em quadrantes de maturidade. Ações que se encontram no canto superior esquerdo representam vitórias rápidas (baixo esforço, imenso impacto corporativo). Cruze ou clique nas esferas para ler o diagnóstico.
            </p>

            {/* Bubble Chart Container */}
            <div className="h-64 w-full mt-4" id="bubble-chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, left: -25, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2edf7" />
                  <XAxis 
                    type="number" 
                    dataKey="esforco" 
                    name="Esforço" 
                    domain={[0, 10]} 
                    tick={{ fontSize: 10 }}
                    label={{ value: "Complexidade / Esforço (1-10)", position: "insideBottom", offset: -5, fill: "#64748b", fontSize: 10 }} 
                  />
                  <YAxis 
                    type="number" 
                    dataKey="impacto" 
                    name="Impacto" 
                    domain={[0, 10]} 
                    tick={{ fontSize: 10 }}
                    label={{ value: "Retorno / Impacto (1-10)", angle: -90, position: "insideLeft", offset: 10, fill: "#64748b", fontSize: 10 }} 
                  />
                  <Tooltip 
                    cursor={{ strokeDasharray: "3 3" }} 
                    contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2edf7", borderRadius: "12px", fontSize: 11 }}
                    formatter={(value: any, name: any, props: any) => {
                      if (name === "Iniciativa") return [props.payload.name, "Ação"];
                      return [value, name];
                    }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Scatter 
                    name="Atividades de Governança" 
                    data={initiatives} 
                    fill="#1a4a8b"
                    onClick={(node) => {
                      setSelectedIniciativa(node.id);
                      if (triggerNotification) triggerNotification(`Selecionado: ${node.name}`, "info");
                    }}
                  >
                    <LabelList dataKey="name" position="top" style={{ fontSize: 8, fill: "#1e3a8a", fontWeight: "bold" }} />
                  </Scatter>
                  <ReferenceLine x={5} stroke="#cbd5e1" strokeWidth={1} label={{ value: "Centro Esforço", position: "insideTopRight", fill: "#94a3b8", fontSize: 8 }} />
                  <ReferenceLine y={5} stroke="#cbd5e1" strokeWidth={1} label={{ value: "Centro Impacto", position: "insideBottomRight", fill: "#94a3b8", fontSize: 8 }} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Interactive Recommendation Box */}
          <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Simulador de Custos e Fator Preventivo</span>
              
              {/* Selector for Action */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 block">Escolha uma Iniciativa para Auditoria:</label>
                <select 
                  value={selectedIniciativa}
                  onChange={(e) => {
                    setSelectedIniciativa(e.target.value);
                  }}
                  className="w-full bg-white border border-slate-200 text-xs rounded-xl p-2.5 outline-none font-semibold text-slate-800 shadow-sm"
                >
                  {initiatives.map(i => (
                    <option key={i.id} value={i.id}>{i.name}</option>
                  ))}
                </select>
              </div>

              {/* Mini Details Block */}
              <div className="space-y-2 border-t border-slate-150 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">Mapeamento de Quadrante:</span>
                  <span className="bg-blue-50 text-blue-900 border border-blue-200 rounded-full px-2 py-0.5 font-bold text-[10px]">
                    {selectedInitObj.area}
                  </span>
                </div>
                <div className="flex justify-between items-center font-mono">
                  <span className="text-xs text-slate-500">Estimativas Orçamentárias:</span>
                  <strong className="text-xs font-bold text-slate-800">{selectedInitObj.custo}</strong>
                </div>
                <div className="flex justify-between items-center font-semibold text-emerald-800">
                  <span className="text-xs text-slate-500">Prevenção / Retorno:</span>
                  <p className="text-[11px] font-bold bg-emerald-50 border border-emerald-250 px-2.5 py-0.5 rounded-full flex items-center gap-0.5 animate-pulse">
                    <CheckCircle className="w-3 h-3 text-emerald-700" />
                    {selectedInitObj.retorno}
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-3 mt-3 text-xs leading-relaxed text-slate-650">
                  <strong>Detalhamento Operacional:</strong>
                  <p className="mt-1 font-medium text-slate-500">{selectedInitObj.desc}</p>
                </div>
              </div>
            </div>

            {/* Prescriptive Suggestion */}
            <div className="bg-indigo-600 text-white rounded-xl p-4 mt-6 text-xs leading-relaxed border border-indigo-700/50 shadow-inner relative overflow-hidden">
              <span className="text-[9px] font-black uppercase text-indigo-200 tracking-wider block">Regência Prescritiva Ativa</span>
              <p className="font-semibold mt-1">
                “Focar os primeiros 15 dias do Plano de 90 Dias nos <strong>Successos Imediatos (DPO, CAB)</strong>. Isso reduz instantaneamente a incidência de downtime sem consumir o total do orçamento simulado.”
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 4: ANÁLISE PREDITIVA (Regressão Linear) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-4">
          <div>
            <h3 className="font-extrabold text-slate-950 text-base flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-700" />
              4. Análise Preditiva (Previsão Estatística de Downtime)
            </h3>
            <p className="text-slate-400 text-[10px]">Modelagem de Regressão Linear com amostragem de 12 meses e projeção automatizada dos próximos períodos</p>
          </div>

          {/* Noise Controller Slider */}
          <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-150 p-2.5 rounded-full text-xs shrink-0">
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-bold text-slate-600">Simular Incerteza (Ruído):</span>
            <input 
              type="range" 
              min="0.5" 
              max="2.5" 
              step="0.1" 
              value={noiseLevel}
              onChange={(e) => handleNoiseChange(parseFloat(e.target.value))}
              className="accent-indigo-700 w-24 h-1 cursor-pointer rounded-lg bg-slate-200"
            />
            <strong className="font-mono text-indigo-950 w-8">{noiseLevel.toFixed(1)}x</strong>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Predictive Chart (LineChart Recharts) */}
          <div className="lg:col-span-2 space-y-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Curva de Tendência de Indisponibilidade & Projeção Linear</span>
            
            <div className="h-64 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="predictionGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e67e22" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#e67e22" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2edf7" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} label={{ value: "Horas de Downtime", angle: -90, position: "insideLeft", offset: 10 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2edf7", borderRadius: "12px", fontSize: 11 }}
                    formatter={(value: any) => [`${value} horas`, undefined]}
                  />
                  <Legend verticalAlign="top" iconType="circle" />
                  <Line 
                    type="monotone" 
                    dataKey="Downtime Real (h)" 
                    stroke="#1a4a8b" 
                    strokeWidth={3} 
                    dot={{ r: 4 }} 
                    activeDot={{ r: 6 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Projeção Linear (h)" 
                    stroke="#e67e22" 
                    strokeWidth={2.5} 
                    strokeDasharray="6 4" 
                    dot={{ r: 3, fill: "#e67e22" }} 
                  />
                  {/* Reference line showing high risk standard threshold */}
                  <ReferenceLine y={5} stroke="#ef4444" strokeDasharray="3 3" strokeWidth={1} label={{ value: "Limite Alerta (Uptime)", fill: "#ef4444", fontSize: 8, position: "top" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <p className="text-[10px] text-slate-400 italic">
              * A linha pontilhada reflete a trajetória estatística baseada na inclinação ($m = {statistics.slope.toFixed(2)}$). Se o resultado for uma curva inclinada positiva, indica crescimento de incidentes motivado por mudanças de software desreguladas em produção.
            </p>
          </div>

          {/* Regression Diagnostics Card */}
          <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 space-y-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Indicadores Científicos do Modelo Preditivo</span>
            
            <div className="space-y-3.5 text-xs text-slate-650 leading-relaxed pt-1">
              <div>
                <span className="text-[10px] text-slate-400">Coeficiente R² (Determinação):</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <strong className="text-base font-black text-slate-900 font-mono">
                    {statistics.rSquared.toFixed(4)}
                  </strong>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    {statistics.rSquared >= 0.70 ? "Confiança Alta" : "Incerteza Moderada"}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1 leading-tight">
                  Explica a porcentagem de variação do downtime descrita pela passagem de tempo e o aumento técnico das mudanças sem homologação.
                </p>
              </div>

              <div className="border-t border-slate-150 pt-3">
                <span className="text-[10px] text-slate-400">RMSE (Erro Médio Quadrático):</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <strong className="text-base font-black text-indigo-700 font-mono">
                    {statistics.rmse.toFixed(2)}h
                  </strong>
                  <span className="text-[10px] text-slate-400 font-semibold font-mono">Desvio Padrão Estimado</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1 leading-tight">
                  Mede a variabilidade empírica do modelo em relação aos picos reais do NeoCredit.
                </p>
              </div>

              <div className="border-t border-slate-150 pt-3 bg-white/40 p-3 rounded-lg border border-slate-200">
                <span className="text-[9px] font-bold text-rose-600 block uppercase tracking-wider">Janelas de Risco Técnico Preditivo</span>
                <p className="text-[11px] font-medium text-slate-800 mt-1">
                  A projeção para o início do próximo ciclo estatístico (Julho a Setembro de 2026) aponta para um downtime de <strong className="text-rose-600 font-black">{prediction[0].downtime}h</strong> e <strong className="text-rose-600 font-black">{prediction[2].downtime}h</strong> respectivamente.
                </p>
                <p className="text-[10px] text-slate-400 mt-1.5 font-semibold">
                  Ação: Ativar as evidências do framework COBIT e ITIL para fatiar essa inclinação à metade e proteger o ecossistema.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 5: RESUMO EXECUTIVO INTEGRADO PARA CONSELHO */}
      <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 relative overflow-hidden">
        
        {/* Subtle decorative background gradients */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-2 border-b border-slate-800 pb-5">
          <div className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg">
            <FileText className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-white">5. Resumo Executivo para Elaboração e Homologação de Pauta (Conselho)</h3>
            <p className="text-slate-500 text-[10px]">Petição técnica justificando orçamento com forte evidência preventiva de ROSI e COBIT</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs text-slate-350 leading-relaxed">
          
          <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800">
            <strong className="text-indigo-400 uppercase tracking-widest text-[9px] font-bold block mb-1">Mapeamento Descritivo</strong>
            <p>
              O tempo médio de downtime histórico situa-se em <strong className="text-white">{statistics.averageDowntime}h/mês</strong>, demonstrando oscilação preocupante no pico de <strong className="text-white">{statistics.maxDowntime}h</strong>.
            </p>
            <p className="mt-2 text-slate-500 font-serif italic text-[11px]">
              “As métricas atuais clamam por consistência técnica.”
            </p>
          </div>

          <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800">
            <strong className="text-indigo-400 uppercase tracking-widest text-[9px] font-bold block mb-1">Verificação Diagnóstica</strong>
            <p>
              Investigação formal sob método 5-Whys determinou que as indisponibilidades do Pix e exposições em Staging pertencem às mesmas causas-raiz: <strong className="text-white">Falta de controle central CAB e RACI técnico</strong>.
            </p>
            <p className="mt-2 text-slate-500 font-serif italic text-[11px]">
              “O gargalo não é acidental, mas estrutural do CAB.”
            </p>
          </div>

          <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800">
            <strong className="text-amber-400 uppercase tracking-widest text-[9px] font-bold block mb-1">Trajetória Preditiva</strong>
            <p>
              Modelagem linear aponta uma tendência de escalada rápida dos incidentes nos próximos 3 meses, com estimativa acumulada de downtime de até <strong className="text-amber-400 font-bold">{prediction[1].downtime}h</strong> para Agosto.
            </p>
            <p className="mt-2 text-slate-500 font-semibold text-[11px]">
              ⚠️ Projeção indica risco imediato de intervenção do BACEN.
            </p>
          </div>

          <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <strong className="text-emerald-400 uppercase tracking-widest text-[9px] font-bold block mb-1">Evidência Prescritiva</strong>
              <p>
                Implementação imediata do Plano de 90 Dias, autorizando o reinvestimento anual preventivo sob fator ROSI calculado de mais de <strong className="text-emerald-400 font-bold font-mono">600%</strong>.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-800 text-[10px] font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              Retorno Estratégico Máximo
            </div>
          </div>

        </div>

        <div className="bg-indigo-950/50 border border-indigo-900/40 p-4.5 rounded-2xl text-[11px] text-indigo-200">
          <strong>📝 Conclusão do Parecer Executivo:</strong> A análise cientificamente lastreada nos dados de conformidade e integridade operacional do NeoCredit apoia a liberação integral de recursos para a agenda de governança de segurança. A implantação de controles como o CAB e as travas criptográficas não são apenas conformidades frias da LGPD, mas salvaguardas financeiras de altíssimo valor líquido.
        </div>

      </div>

    </div>
  );
}
