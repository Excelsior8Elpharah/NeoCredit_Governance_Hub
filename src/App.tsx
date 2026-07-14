import { useState, useEffect } from "react";
import { 
  Activity, 
  ShieldAlert, 
  Lock, 
  GitBranch, 
  CheckCircle, 
  TrendingUp, 
  RotateCcw, 
  FileText, 
  Download, 
  AlertTriangle, 
  Users, 
  Check, 
  Calendar, 
  Flame, 
  ChevronRight, 
  Info, 
  HelpCircle,
  Shield, 
  Award, 
  Compass, 
  Clock, 
  ArrowRight, 
  Search, 
  Briefcase,
  BookOpen,
  Sparkles,
  Lightbulb,
  Layers,
  RefreshCw,
  Sliders
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { 
  MetricState, 
  ChecklistItem, 
  Policy, 
  HistoricIncident, 
  AuditItem, 
  RoadmapTask 
} from "./types";

import {
  META_UPTIME,
  META_CHANGES,
  META_ENCRYPT,
  META_TRAINING,
  BASELINE_METRICS,
  INITIAL_CHECKLIST,
  COMMITTEES,
  POLICIES,
  HISTORIC_INCIDENTS,
  AUDIT_REQUIREMENTS,
  BSC_OBJECTIVES,
  ROADMAP_TASKS
} from "./data";

import UptimeChart from "./components/UptimeChart";
import AdvancedAnalytics from "./components/AdvancedAnalytics";
import ExecValueModule from "./components/ExecValueModule";
import MeetingMinutesModule from "./components/MeetingMinutesModule";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  Tooltip as RechartsTooltip
} from "recharts";

export default function App() {
  // --- States ---
  const [metrics, setMetrics] = useState<MetricState>({ ...BASELINE_METRICS });
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [checklist, setChecklist] = useState<ChecklistItem[]>(INITIAL_CHECKLIST);
  const [policies, setPolicies] = useState<Policy[]>(POLICIES);
  const [selectedPolicyId, setSelectedPolicyId] = useState<string>("pol-1");
  const [selectedCommitteeId, setSelectedCommitteeId] = useState<string>("comite-crise");
  const [auditReqs, setAuditReqs] = useState<AuditItem[]>(AUDIT_REQUIREMENTS);
  const [roadmap, setRoadmap] = useState<RoadmapTask[]>(ROADMAP_TASKS);
  const [historicalIncidents, setHistoricalIncidents] = useState<HistoricIncident[]>(HISTORIC_INCIDENTS);
  
  // CAB Change Approval Simulator states
  const [cabSimulationResult, setCabSimulationResult] = useState<string | null>(null);
  const [itamProgress, setItamProgress] = useState<number>(35);
  
  // ROSI Simulator states
  const [rosiInvest, setRosiInvest] = useState<number>(500000);
  const [rosiPerda, setRosiPerda] = useState<number>(3500000);
  const [showDetailedAudit, setShowDetailedAudit] = useState<boolean>(false);
  const [complianceSubTab, setComplianceSubTab] = useState<string>("regulatory");
  const [committeesSubTab, setCommitteesSubTab] = useState<"directory" | "atas">("directory");
  const [activeMaturityLevel, setActiveMaturityLevel] = useState<number>(4);
  const [asisTobeActiveDomain, setAsisTobeActiveDomain] = useState<string>("seguranca");
  
  // Incident Simulation Active Crisis State
  const [activeCrisis, setActiveCrisis] = useState<{
    id: string;
    title: string;
    description: string;
    severity: "Crítica" | "Alta" | "Média";
    currentStep: number;
    targetUptimeDrop: number;
    steps: { text: string; done: boolean }[];
  } | null>(null);

  const [notification, setNotification] = useState<{ message: string; type: "success" | "info" } | null>(null);

  // Trigger quick temporary notifications
  const triggerNotification = (message: string, type: "success" | "info" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Keep metrics in sync with crisis triggers (e.g. if a DDoS starts, drop uptime)
  useEffect(() => {
    if (activeCrisis) {
      if (activeCrisis.title.includes("DDoS")) {
        setMetrics(prev => ({ ...prev, uptime: 97.45 }));
      } else if (activeCrisis.title.includes("Vazamento")) {
        setMetrics(prev => ({ ...prev, encrypt: Math.max(15, prev.encrypt - 20) }));
      }
    }
  }, [activeCrisis?.id]);

  // Handle individual slider updates
  const handleMetricChange = (key: keyof MetricState, value: number) => {
    setMetrics(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Reset individual metric
  const resetMetric = (key: keyof MetricState) => {
    setMetrics(prev => ({
      ...prev,
      [key]: BASELINE_METRICS[key]
    }));
    triggerNotification(`Métrica ${getMetricName(key)} redefinida para baseline!`, "info");
  };

  // Reset all metrics
  const handleResetAllMetrics = () => {
    setMetrics({ ...BASELINE_METRICS });
    setChecklist(INITIAL_CHECKLIST);
    setRoadmap(ROADMAP_TASKS);
    setPolicies(POLICIES);
    setActiveCrisis(null);
    setCabSimulationResult(null);
    setItamProgress(35);
    setRosiInvest(500000);
    setRosiPerda(3500000);
    setShowDetailedAudit(false);
    triggerNotification("Todas as métricas, checklists de auditoria e cenários de governança voltaram para o baseline original.", "info");
  };

  // Help translate keys to Portuguese names
  const getMetricName = (key: keyof MetricState) => {
    switch (key) {
      case "uptime": return "Disponibilidade do APP";
      case "changes": return "Mudanças Aprovadas CAB";
      case "encrypt": return "Dados Criptografados";
      case "training": return "Colaboradores Treinados";
      default: return "";
    }
  };

  // Checkbox handlers
  const toggleChecklistItem = (id: string) => {
    setChecklist(prev => prev.map(item => {
      if (item.id === id) {
        const nextState = !item.checked;
        // If they click "Criptografia", also sync the slider to 100% or back
        if (id === "chk2") {
          handleMetricChange("encrypt", nextState ? 100 : 45);
        }
        return { ...item, checked: nextState };
      }
      return item;
    }));
  };

  const toggleRoadmapTask = (id: string) => {
    setRoadmap(prev => prev.map(task => {
      if (task.id === id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    }));
  };

  const toggleAuditReq = (id: string) => {
    setAuditReqs(prev => prev.map(req => {
      if (req.id === id) {
        return { ...req, checked: !req.checked };
      }
      return req;
    }));
  };

  // Average compliance scores calculated dynamically
  const lgpdComplianceChecked = checklist.filter(c => c.checked).length;
  const lgpdCompliancePercent = Math.round((lgpdComplianceChecked / checklist.length) * 100);

  // Framework compliance calculated weights
  const getFrameworkCompliance = (fw: string) => {
    const items = auditReqs.filter(r => r.framework === fw);
    if (items.length === 0) return 0;
    const checkedWithWeights = items.reduce((acc, curr) => acc + (curr.checked ? curr.weight : 0), 0);
    const totalWeights = items.reduce((acc, curr) => acc + curr.weight, 0);
    return Math.round((checkedWithWeights / totalWeights) * 100);
  };

  // Interactive Policy Update State
  const updatePolicyStatus = (id: string, newStatus: "Draft" | "Review" | "Approved") => {
    let complianceAward = 0;
    if (newStatus === "Approved") complianceAward = 100;
    else if (newStatus === "Review") complianceAward = 70;
    else complianceAward = 45;

    setPolicies(prev => prev.map(p => {
      if (p.id === id) {
        return { 
          ...p, 
          status: newStatus,
          complianceLevel: complianceAward
        };
      }
      return p;
    }));

    // If change management policy approved, improve CAB changes slider
    if (id === "pol-4" && newStatus === "Approved") {
      handleMetricChange("changes", 95);
    }

    triggerNotification(`Política de Governança atualizada para o status: ${newStatus}`, "success");
  };

  // Live Incident Crisis simulator management
  const triggerIncidentScenario = (type: "ddos" | "leak" | "phish") => {
    if (activeCrisis) {
      triggerNotification("Já existe um cenário de contingência em andamento! Resolva-o primeiro.", "info");
      return;
    }

    if (type === "ddos") {
      setActiveCrisis({
        id: "ddos-" + Date.now(),
        title: "Derrubada Massiva DDoS nas APIs do App",
        description: "Mais de 1.2M de requisições por segundo vindas de IPs estrangeiros na nossa API Pix. Cooperados enfrentam timeouts graves.",
        severity: "Crítica",
        currentStep: 0,
        targetUptimeDrop: 97.45,
        steps: [
          { text: "Acionar o Comitê de Crise e Engenharia SRE", done: false },
          { text: "Ativar contenção rápida Cloudflare de Web Access Firewall em Under Attack", done: false },
          { text: "Habilitar bloqueios geo-IP para rotas não-América Latina", done: false },
          { text: "Revisar logs remanescentes e restaurar normalidade operacional", done: false }
        ]
      });
      triggerNotification("CRITICAL: Alerta de instabilidade no PIX detectado! Comitê de crise convocado.", "info");
    } else if (type === "leak") {
      setActiveCrisis({
        id: "leak-" + Date.now(),
        title: "Chaves de API Descobertas em Repositório",
        description: "Um bot automatizado de auditoria interna acusa chave AWS/BACEN exposta em histórico antigo do GitLab.",
        severity: "Alta",
        currentStep: 0,
        targetUptimeDrop: 99.50,
        steps: [
          { text: "Revogar a chave API exposta imediatamente na console do provedor", done: false },
          { text: "Rotacionar chaves de criptografia e renovar o certificado corporativo", done: false },
          { text: "Auditar se houve qualquer requisição não-autorizada via chaves antigas nos logs do IAM", done: false },
          { text: "Registrar a evidência preventiva do caso para o relatório anual de conformidade", done: false }
        ]
      });
      triggerNotification("ALERTA: Chave sensível exposta! Iniciando protocolo de rotação de credenciais.", "info");
    } else {
      setActiveCrisis({
        id: "phish-" + Date.now(),
        title: "Campanha Spear-Phishing Fingindo Nova Diretoria",
        description: "Quatro colaboradores de back-office reportaram e-mail falso de fusão NeoCredit instando clique em anexo PDF executável.",
        severity: "Média",
        currentStep: 0,
        targetUptimeDrop: 99.50,
        steps: [
          { text: "Isolar as caixas postais dos usuários que interagiram com a ameaça", done: false },
          { text: "Disparar varredura completa de antivírus EDR corporativo nos notebooks", done: false },
          { text: "Disparar alerta preventivo global 'Não Clique' no canal oficial corporate", done: false },
          { text: "Marcar simulação de conscientização e forçar reset do treinamento de Phishing", done: false }
        ]
      });
      triggerNotification("ALERTA DE SEGURANÇA: Phishing no departamento de Crédito. Siga o guia ITIL.", "info");
    }
  };

  const advanceCrisisStep = () => {
    if (!activeCrisis) return;

    const nextStepIndex = activeCrisis.currentStep + 1;
    const updatedSteps = activeCrisis.steps.map((s, idx) => ({
      ...s,
      done: idx <= activeCrisis.currentStep ? true : s.done
    }));

    if (nextStepIndex >= activeCrisis.steps.length) {
      // Completed crisis! Write to history
      const duration = activeCrisis.severity === "Crítica" ? "12 minutos (SLA crítico)" : "40 minutos (SLA OK)";
      const isDdos = activeCrisis.title.includes("DDoS");
      const isLeak = activeCrisis.title.includes("Chaves");

      const resolvedIncident: HistoricIncident = {
        id: `inc-${Math.floor(Math.random() * 900) + 200}`,
        title: activeCrisis.title,
        date: new Date().toISOString().split('T')[0],
        severity: activeCrisis.severity,
        status: "Resolvido",
        resolutionSLA: duration,
        rca: `A crise foi contida inteiramente seguindo o roteiro do plano de governança. ${activeCrisis.description}`
      };

      setHistoricalIncidents(prev => [resolvedIncident, ...prev]);
      
      // Update Metrics as compensation for good governance!
      setMetrics(prev => {
        let newUptime = prev.uptime;
        let newEncrypt = prev.encrypt;
        let newTraining = prev.training;

        if (isDdos) newUptime = 99.98; // Recovered and hardened
        if (isLeak) newEncrypt = Math.min(100, prev.encrypt + 25);
        newTraining = Math.min(100, prev.training + 10); // Staff learned lessons!

        return {
          uptime: newUptime,
          changes: prev.changes,
          encrypt: newEncrypt,
          training: newTraining
        };
      });

      setActiveCrisis(null);
      triggerNotification("Parabéns! Crise contida em conformidade com as regras da ISO 27001 e ITIL 4. Métricas restauradas!", "success");
    } else {
      setActiveCrisis({
        ...activeCrisis,
        currentStep: nextStepIndex,
        steps: updatedSteps
      });
      triggerNotification(`Etapa ${nextStepIndex} do plano de contingência executada com sucesso.`, "success");
    }
  };

  // Export real interactive Balanced Scorecard report in CSV format matching baseline + live sliders!
  const handleExportCSV = () => {
    const dataRows = [
      ["Indicador;Valor atual;Meta;Status;Perspectiva"],
      [`Disponibilidade app;${metrics.uptime.toFixed(2)}%;${META_UPTIME}%;${metrics.uptime >= META_UPTIME ? "Forte Conformidade" : "Abaixo da Meta"};Perspectiva Cliente`],
      [`Mudanças aprovadas CAB;${metrics.changes}%;${META_CHANGES}%;${metrics.changes >= META_CHANGES ? "Conforme" : "Crítico"};Processos Internos`],
      [`Dados criptografados;${metrics.encrypt}%;${META_ENCRYPT}%;${metrics.encrypt >= META_ENCRYPT ? "Totalmente Protegido" : "Risco de Vazamento"};Perspectiva Financeira`],
      [`Treinamento de colaboradores;${metrics.training}%;${META_TRAINING}%;${metrics.training >= META_TRAINING ? "Imunidade Coletiva" : "Vulnerabilidade Operacional"};Aprendizagem e Crescimento`],
      [`Checklist de Governança de Dados;${lgpdCompliancePercent}%;100%;${lgpdCompliancePercent === 100 ? "Seguro" : "Manual"};Conformidade LGPD/BACEN`],
      [`Fator ROSI estimado;${(metrics.training * 0.4 + metrics.encrypt * 0.6) >= 80 ? '4.2x' : '2.1x'};>3.5x retorno;${(metrics.training * 0.4 + metrics.encrypt * 0.6) >= 80 ? 'Excelente' : 'Revisar'};Perspectiva Financeira`]
    ];

    const csvContent = dataRows.join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.href = url;
    link.setAttribute("download", `NeoCredit_BSC_Governança_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    triggerNotification("Relatório de Governança corporativa (CSV) compilado e baixado com sucesso!", "success");
  };

  // Helper calculation for global stats
  const selectedCommittee = COMMITTEES.find(c => c.id === selectedCommitteeId) || COMMITTEES[0];
  const selectedPolicy = policies.find(p => p.id === selectedPolicyId) || policies[0];

  const overallRoadmapTasks = roadmap.length;
  const completedRoadmapTasks = roadmap.filter(r => r.completed).length;
  const roadmapProgress = Math.round((completedRoadmapTasks / overallRoadmapTasks) * 100);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      {/* Toast Notification Banner */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-[9999] px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 border transition-all ${
              notification.type === "success" 
                ? "bg-emerald-600 text-white border-emerald-500" 
                : "bg-blue-900 text-white border-blue-700"
            }`}
          >
            <div className={`p-1 rounded-full ${notification.type === "success" ? "bg-emerald-500" : "bg-blue-800"}`}>
              {notification.type === "success" ? <Check className="w-4 h-4 text-white" /> : <Info className="w-4 h-4 text-white" />}
            </div>
            <span className="font-medium text-sm tracking-wide">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Banner Top-bar */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm mb-8">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-blue-50 text-blue-800 rounded-2xl border border-blue-100 flex items-center justify-center shadow-inner">
              <Activity className="w-8 h-8 animate-pulse text-blue-700" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-950 tracking-tight flex items-center gap-2">
                NeoCredit <span className="bg-gradient-to-r from-blue-700 to-indigo-800 bg-clip-text text-transparent font-medium">Governance Hub</span>
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm font-medium mt-0.5">
                Portal de Governança de TI, Conformidade Regulatória (LGPD & BACEN) & Gestão de Riscos
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-gradient-to-r from-slate-100 to-blue-50/50 px-4 py-2.5 rounded-full border border-blue-100/60 shadow-sm text-xs sm:text-sm font-semibold text-blue-900">
            <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>COBIT</span> • <span>ITIL 4</span> • <span>ISO 27001</span>
          </div>
        </header>

        {/* Navigation Mock (Fully Interactive Tabs) */}
        <nav className="flex flex-wrap gap-2 border-b border-slate-200 pb-4 mb-8" id="nav-mock">
          {[
            { id: "dashboard", label: "Dashboard", icon: Activity },
            { id: "committees", label: "Comitês Integrados", icon: Users },
            { id: "policies", label: "Políticas & Processos", icon: FileText },
            { id: "incidents", label: "Simular Incidentes", icon: Flame, badge: activeCrisis ? "!" : undefined },
            { id: "compliance", label: "Auditoria & Normas", icon: Shield },
            { id: "bsc", label: "Balanced Scorecard", icon: Compass },
            { id: "roadmap", label: "Plano 90 Dias", icon: Calendar, percent: roadmapProgress },
            { id: "asis_tobe", label: "Análise As-Is / To-Be", icon: GitBranch },
            { id: "analytics", label: "Análises Avançadas", icon: TrendingUp },
            { id: "exec_value", label: "Valor Executivo & ROI/ROSI", icon: Award, badge: "Aula 2" }
          ].map(tab => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  triggerNotification(`Navegou para a seção: ${tab.label}`, "info");
                }}
                className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs sm:text-sm font-semibold transition-all relative ${
                  isActive 
                    ? "bg-blue-800 text-white shadow-md shadow-blue-900/10" 
                    : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <IconComponent className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] animate-bounce font-bold">
                    {tab.badge}
                  </span>
                )}
                {tab.percent !== undefined && (
                  <span className={`ml-1 text-[11px] px-1.5 py-0.2 rounded-full ${isActive ? "bg-blue-700 text-blue-100" : "bg-slate-100 text-slate-500"}`}>
                    {tab.percent}%
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Global Active Crisis Warning */}
        {activeCrisis && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 border-l-4 border-rose-500 bg-rose-50 p-6 rounded-r-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm"
          >
            <div className="flex gap-4">
              <div className="bg-rose-100 p-3 rounded-full text-rose-700 shrink-0 self-start mt-0.5">
                <Flame className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-rose-600 text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full">
                    Ameaça Ativa
                  </span>
                  <span className="text-slate-600 text-xs font-semibold">SLA em Contagem Regressiva</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1.5">{activeCrisis.title}</h3>
                <p className="text-slate-500 text-sm mt-1">{activeCrisis.description}</p>
                
                {/* Active Steps Roadmap */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {activeCrisis.steps.map((step, idx) => {
                    const isPassed = idx < activeCrisis.currentStep;
                    const isCurrent = idx === activeCrisis.currentStep;
                    return (
                      <div 
                        key={idx} 
                        className={`p-3 rounded-xl border text-xs transition-colors flex gap-2 ${
                          isPassed 
                            ? "bg-slate-100 border-slate-200 text-slate-400 line-through" 
                            : isCurrent 
                              ? "bg-amber-50 border-amber-300 text-amber-900 font-medium scale-[1.01] shadow-sm animate-pulse" 
                              : "bg-white border-slate-200 text-slate-500"
                        }`}
                      >
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
                          isPassed ? "bg-slate-300 text-white" : isCurrent ? "bg-amber-600 text-white" : "bg-slate-100 text-slate-400"
                        }`}>
                          {idx + 1}
                        </span>
                        <span>{step.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="shrink-0 flex flex-col sm:flex-row md:flex-col lg:flex-row gap-2 w-full md:w-auto">
              <button 
                onClick={advanceCrisisStep}
                className="w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-xs bg-rose-600 text-white hover:bg-rose-700 transition shadow-lg shadow-rose-600/10 flex items-center justify-center gap-2"
              >
                <span>Avançar Plano ({activeCrisis.currentStep + 1}/{activeCrisis.steps.length})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => {
                  setActiveCrisis(null);
                  triggerNotification("Cenário de crise cancelado e arquivado para segurança.", "info");
                }}
                className="w-full sm:w-auto px-4 py-3 rounded-xl text-xs font-semibold border border-rose-200 bg-white text-rose-700 hover:bg-rose-50 transition"
              >
                Ignorar Ameaça
              </button>
            </div>
          </motion.div>
        )}

        {/* --- Main Contents Router --- */}
        <AnimatePresence mode="wait">
          {activeTab === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* KPIs Grid with Interactive Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="kpiGrid">
                
                {/* 1. Uptime */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition duration-200">
                  <div className="text-slate-400 text-xs font-bold uppercase tracking-wider flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Activity className="w-4 h-4 text-emerald-600" />
                      Disponibilidade App
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                      ITIL 4 KPI
                    </span>
                  </div>
                  <div className="mt-4 flex items-baseline gap-1" id="kpiUptime">
                    <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                      {metrics.uptime.toFixed(2)}
                    </span>
                    <span className="text-sm font-bold text-slate-500">%</span>
                  </div>

                  {/* Trend Indicator vs Meta */}
                  <div className="mt-2 text-xs font-medium" id="trendUptime">
                    {metrics.uptime >= META_UPTIME ? (
                      <span className="text-emerald-600 flex items-center gap-1">
                        🟢 {(metrics.uptime - META_UPTIME).toFixed(2)}% acima da meta ({META_UPTIME}%)
                      </span>
                    ) : (
                      <span className="text-rose-600 flex items-center gap-1">
                        🔻 {Math.abs(metrics.uptime - META_UPTIME).toFixed(2)}% abaixo da meta ({META_UPTIME}%)
                      </span>
                    )}
                  </div>

                  {/* Range Slider for Live Testing */}
                  <div className="mt-5 space-y-2">
                    <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                      <span>Refinar indicador:</span>
                      <span>{metrics.uptime.toFixed(2)}%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input 
                        type="range"
                        id="uptimeSlider"
                        min="98.50" 
                        max="100.00" 
                        step="0.05"
                        value={metrics.uptime}
                        onChange={(e) => handleMetricChange("uptime", parseFloat(e.target.value))}
                        className="flex-1 accent-blue-800"
                      />
                      <button 
                        onClick={() => resetMetric("uptime")}
                        className="text-[10px] px-2 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 rounded-lg hover:text-slate-900 transition shrink-0"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. Changes approved of CAB */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition duration-200">
                  <div className="text-slate-400 text-xs font-bold uppercase tracking-wider flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <GitBranch className="w-4 h-4 text-blue-600" />
                      Mudanças Aprovadas CAB
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                      COBIT Process
                    </span>
                  </div>
                  <div className="mt-4 flex items-baseline gap-1" id="kpiChanges">
                    <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                      {metrics.changes}
                    </span>
                    <span className="text-sm font-bold text-slate-500">%</span>
                  </div>

                  {/* Trend Indicator vs Meta */}
                  <div className="mt-2 text-xs font-medium" id="trendChanges">
                    {metrics.changes >= META_CHANGES ? (
                      <span className="text-emerald-600 flex items-center gap-1.5">
                        🟢 +{metrics.changes - META_CHANGES}% (meta atingida)
                      </span>
                    ) : (
                      <span className="text-amber-600 flex items-center gap-1.5">
                        🔻 {META_CHANGES - metrics.changes}% abaixo da meta ({META_CHANGES}%)
                      </span>
                    )}
                  </div>

                  {/* Range Slider */}
                  <div className="mt-5 space-y-2">
                    <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                      <span>Simular esteira:</span>
                      <span>{metrics.changes}%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input 
                        type="range"
                        id="changesSlider"
                        min="30" 
                        max="100" 
                        step="1"
                        value={metrics.changes}
                        onChange={(e) => handleMetricChange("changes", parseInt(e.target.value))}
                        className="flex-1 accent-blue-800"
                      />
                      <button 
                        onClick={() => resetMetric("changes")}
                        className="text-[10px] px-2 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 rounded-lg hover:text-slate-900 transition shrink-0"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. Encrypted Data */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition duration-200">
                  <div className="text-slate-400 text-xs font-bold uppercase tracking-wider flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Lock className="w-4 h-4 text-indigo-600" />
                      Dados Criptografados
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                      LGPD Art. 46
                    </span>
                  </div>
                  <div className="mt-4 flex items-baseline gap-1" id="kpiEncrypt">
                    <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                      {metrics.encrypt}
                    </span>
                    <span className="text-sm font-bold text-slate-500">%</span>
                  </div>

                  {/* Trend Indicator vs Meta */}
                  <div className="mt-2 text-xs font-medium" id="trendEncrypt">
                    {metrics.encrypt >= META_ENCRYPT ? (
                      <span className="text-emerald-600 flex items-center gap-1.5">
                        🟢 total compliance (100%)
                      </span>
                    ) : (
                      <span className="text-rose-600 flex items-center gap-1.5">
                        🔻 {META_ENCRYPT - metrics.encrypt}% vulnerável • risco alto
                      </span>
                    )}
                  </div>

                  {/* Range Slider */}
                  <div className="mt-5 space-y-2">
                    <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                      <span>Proteger base:</span>
                      <span>{metrics.encrypt}%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input 
                        type="range"
                        id="encryptSlider"
                        min="10" 
                        max="100" 
                        step="1"
                        value={metrics.encrypt}
                        onChange={(e) => handleMetricChange("encrypt", parseInt(e.target.value))}
                        className="flex-1 accent-blue-800"
                      />
                      <button 
                        onClick={() => resetMetric("encrypt")}
                        className="text-[10px] px-2 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 rounded-lg hover:text-slate-900 transition shrink-0"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>

                {/* 4. Trained Collaborators */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition duration-200">
                  <div className="text-slate-400 text-xs font-bold uppercase tracking-wider flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Award className="w-4 h-4 text-purple-600" />
                      Treinamento Humano
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                      ISO Human Sec
                    </span>
                  </div>
                  <div className="mt-4 flex items-baseline gap-1" id="kpiTraining">
                    <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                      {metrics.training}
                    </span>
                    <span className="text-sm font-bold text-slate-500">%</span>
                  </div>

                  {/* Trend Indicator vs Meta */}
                  <div className="mt-2 text-xs font-medium" id="trendTraining">
                    {metrics.training >= META_TRAINING ? (
                      <span className="text-emerald-600 flex items-center gap-1.5">
                        🟢 100% funcionários qualificados
                      </span>
                    ) : (
                      <span className="text-amber-600 flex items-center gap-1.5">
                        🔻 {META_TRAINING - metrics.training}% desprotegido (sem treino)
                      </span>
                    )}
                  </div>

                  {/* Range Slider */}
                  <div className="mt-5 space-y-2">
                    <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                      <span>Treinar equipes:</span>
                      <span>{metrics.training}%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input 
                        type="range"
                        id="trainingSlider"
                        min="0" 
                        max="100" 
                        step="1"
                        value={metrics.training}
                        onChange={(e) => handleMetricChange("training", parseInt(e.target.value))}
                        className="flex-1 accent-blue-800"
                      />
                      <button 
                        onClick={() => resetMetric("training")}
                        className="text-[10px] px-2 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 rounded-lg hover:text-slate-900 transition shrink-0"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Chart of Availability + Compliance Checklist Duo Pane */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Visualizer Chart */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md lg:col-span-7 duration-200">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-950 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-800" />
                        Histórico de Disponibilidade (Últimos 6 Meses)
                      </h3>
                      <p className="text-slate-400 text-xs mt-0.5">
                        Tendência progressiva simulada com base no Uptime atual
                      </p>
                    </div>
                    <span className="bg-blue-50 text-blue-800 text-[11px] px-2.5 py-1 rounded-full border border-blue-100 font-bold shrink-0 self-start sm:self-center">
                      Meta: &gt;= 99.95%
                    </span>
                  </div>
                  <div className="p-2 bg-slate-50/50 rounded-2xl border border-slate-100/60">
                    <UptimeChart currentUptime={metrics.uptime} />
                  </div>
                  <div className="mt-4 flex gap-2 items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span>* Simulação baseada na flutuação do Uptime slider em tempo real</span>
                    <span className="text-emerald-700">Conformidade Ativa</span>
                  </div>
                </div>

                {/* LGPD & BACEN Governance list */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md lg:col-span-5 duration-200 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-950 flex items-center gap-2">
                          <Lock className="w-5 h-5 text-indigo-700 animate-pulse" />
                          LGPD & Regulatórios BACEN
                        </h3>
                        <p className="text-slate-400 text-xs mt-0.5">
                          Prontidão de Evidências de Governança
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-extrabold text-indigo-900 inline-block">
                          {lgpdCompliancePercent}%
                        </span>
                        <span className="text-[10px] text-slate-400 block font-semibold uppercase">Pontuação</span>
                      </div>
                    </div>

                    {/* Progress Bar Container */}
                    <div className="w-full bg-slate-100 h-2 rounded-full mb-6 overflow-hidden">
                      <div 
                        className="bg-indigo-600 h-full rounded-full transition-all duration-300" 
                        style={{ width: `${lgpdCompliancePercent}%` }}
                      ></div>
                    </div>

                    {/* Interactive Checklist list */}
                    <div className="space-y-2.5 max-h-[290px] overflow-y-auto pr-1">
                      {checklist.map(item => (
                        <div 
                          key={item.id}
                          onClick={() => toggleChecklistItem(item.id)}
                          className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                            item.checked 
                              ? "bg-slate-50/90 border-blue-200 text-slate-800" 
                              : "bg-white hover:bg-slate-50 border-slate-200 text-slate-500"
                          }`}
                        >
                          <input 
                            type="checkbox"
                            checked={item.checked}
                            onChange={() => {}} // Handle on parent div click instead
                            className="mt-1 w-4 h-4 text-blue-800 border-slate-300 rounded focus:ring-blue-100 accent-blue-800 pointer-events-none"
                          />
                          <div className="text-xs leading-relaxed">
                            <p className={`font-semibold ${item.checked ? "text-slate-900" : "text-slate-600"}`}>
                              {item.label}
                            </p>
                            <span className="inline-block mt-1 text-[9px] bg-slate-100 text-slate-400 px-1.5 py-0.2 rounded-full font-bold tracking-widest uppercase">
                              {item.category}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 border-t border-slate-100 pt-3 flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 -mx-6 -mb-6 p-4 rounded-b-3xl">
                    <Info className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>Clique em qualquer item para atualizar as evidências da ANPD</span>
                  </div>
                </div>

              </div>
              
              {/* Controls Action Panel */}
              <div className="bg-slate-800 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row shadow-sm justify-between items-center gap-6">
                <div>
                  <h4 className="text-lg font-bold text-white flex items-center gap-2">
                    <Download className="w-5 h-5 text-blue-400" />
                    Exportar Relatório de Governança corporativa ISO / BACEN
                  </h4>
                  <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
                    Transfira instantaneamente todos os KPIs reais, pontuações de conformidade LGPD e de auditoria para o seu dashboard local em planilha CSV formatada.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
                  <button 
                    onClick={handleExportCSV}
                    id="exportBSC"
                    className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-blue-950/20 active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Exportar Relatório BSC (CSV)</span>
                  </button>
                  <button 
                    onClick={handleResetAllMetrics}
                    id="resetAllMetrics"
                    className="w-full sm:w-auto px-5 py-3.5 bg-slate-700 hover:bg-slate-900 text-slate-200 hover:text-white font-bold text-xs sm:text-sm rounded-xl transition-all border border-slate-600 whitespace-nowrap active:scale-95 flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Redefinir Para Baseline</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "committees" && (
            <motion.div
              key="committees"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Secondary Subtabs for Committees */}
              <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
                <button
                  onClick={() => setCommitteesSubTab("directory")}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition ${
                    committeesSubTab === "directory"
                      ? "bg-slate-900 text-white shadow-md"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Mapeamento de Comitês & RACI</span>
                </button>
                <button
                  onClick={() => setCommitteesSubTab("atas")}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition relative ${
                    committeesSubTab === "atas"
                      ? "bg-slate-900 text-white shadow-md"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Gerenciador de Atas (ATA) & Planos de Ação</span>
                  <span className="bg-emerald-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-black animate-pulse">
                    Novo
                  </span>
                </button>
              </div>

              {committeesSubTab === "directory" ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Committee menu list */}
              <div className="lg:col-span-4 space-y-4">
                <div className="p-1">
                  <h3 className="text-lg font-extrabold text-slate-950">Comitês Estratégicos</h3>
                  <p className="text-slate-400 text-xs mt-1">
                    Células de liderança de conformidade e de tomadas de decisão.
                  </p>
                </div>
                {COMMITTEES.map(c => {
                  const isSelected = selectedCommitteeId === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedCommitteeId(c.id)}
                      className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-150 ${
                        isSelected 
                          ? "bg-white border-blue-800 shadow-md scale-[1.01]" 
                          : "bg-slate-50 border-slate-200.80 text-slate-600 hover:bg-white hover:border-slate-300"
                      }`}
                    >
                      <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm sm:text-base">
                        <span className="p-1.5 rounded-lg bg-blue-50 text-blue-800">
                          {c.id === "comite-crise" && <ShieldAlert className="w-4 h-4" />}
                          {c.id === "comite-seguranca" && <Lock className="w-4 h-4" />}
                          {c.id === "comite-mudancas" && <GitBranch className="w-4 h-4" />}
                        </span>
                        {c.name}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                        {c.role}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Committee detailed profile panel */}
              <div className="lg:col-span-8">
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                  <div className="border-b border-slate-100 pb-5">
                    <span className="inline-block bg-blue-50 text-blue-800 text-[10px] sm:text-xs font-extrabold px-3 py-1 rounded-full border border-blue-100 uppercase tracking-wider mb-2.5">
                      Célula de Governança Ativa
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-950 flex items-center gap-2">
                      {selectedCommittee.name}
                    </h2>
                    <p className="text-slate-500 text-xs sm:text-sm mt-2 leading-relaxed">
                      {selectedCommittee.description}
                    </p>
                  </div>

                  {/* Operational detail grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs shadow-sm">
                      <span className="text-slate-400 block font-semibold uppercase">Periodicidade de Reuniões</span>
                      <strong className="text-slate-900 text-sm mt-1 inline-block">{selectedCommittee.meetingFrequency}</strong>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs shadow-sm text-right sm:text-left">
                      <span className="text-slate-400 block font-semibold uppercase">Próximo Encontro de Agenda</span>
                      <strong className="text-slate-900 text-sm mt-1 inline-block flex items-center gap-1.5 justify-end sm:justify-start">
                        <Clock className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                        {selectedCommittee.nextMeetingDate}
                      </strong>
                    </div>
                  </div>

                  {/* Members directory */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Membros Oficiais & Liderança</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {selectedCommittee.members.map((member, i) => (
                        <div key={i} className="p-3 bg-white border border-slate-100 rounded-2xl flex items-center gap-3 shadow-inner hover:bg-slate-50 transition">
                          <span className="text-2xl">{member.avatar}</span>
                          <div>
                            <p className="text-xs font-bold text-slate-900">{member.name}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{member.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* RACI Matrix Segment */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Matriz RACI do Comitê</h4>
                      <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-mono">R=Resp | A=Aprov | C=Cons | I=Inf</span>
                    </div>
                    <div className="overflow-x-auto rounded-2xl border border-slate-100 shadow-sm">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase font-semibold text-[10px]">
                            <th className="p-3 pl-4">Atividade / Processo</th>
                            <th className="p-3 text-center">R</th>
                            <th className="p-3 text-center">A</th>
                            <th className="p-3 text-center">C</th>
                            <th className="p-3 text-center">I</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {selectedCommittee.raci.map((raciItem, i) => (
                            <tr key={i} className="hover:bg-slate-50/50">
                              <td className="p-3 pl-4 font-semibold text-slate-800">{raciItem.activity}</td>
                              <td className="p-3 text-center text-blue-900 font-bold bg-blue-50/20">{raciItem.r}</td>
                              <td className="p-3 text-center text-emerald-900 font-bold bg-emerald-50/20">{raciItem.a}</td>
                              <td className="p-3 text-center text-slate-600 font-medium">{raciItem.c}</td>
                              <td className="p-3 text-center text-slate-400">{raciItem.i}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              </div>
            </div>
            ) : (
              <MeetingMinutesModule committees={COMMITTEES} triggerNotification={triggerNotification} />
            )}
          </motion.div>
        )}

          {activeTab === "policies" && (
            <motion.div
              key="policies"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Library Grid row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Document list sidebar */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="p-1 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-950">Biblioteca de Políticas</h3>
                      <p className="text-slate-400 text-xs mt-1">Normativas e diretrizes de conformidade TI.</p>
                    </div>
                    <span className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-100 font-bold">
                      {policies.length} Documentos
                    </span>
                  </div>

                  <div className="space-y-3">
                    {policies.map(p => {
                      const isSelected = selectedPolicyId === p.id;
                      return (
                        <div
                          key={p.id}
                          onClick={() => setSelectedPolicyId(p.id)}
                          className={`p-4 sm:p-5 rounded-3xl border cursor-pointer transition-all ${
                            isSelected
                              ? "bg-white border-blue-800 shadow-md"
                              : "bg-slate-50 hover:bg-white border-slate-200/80 text-slate-600"
                          }`}
                        >
                          <div className="flex justify-between items-start gap-2 mb-2">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                              {p.code}
                            </span>
                            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-extrabold tracking-wide ${
                              p.status === "Approved" 
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                                : p.status === "Review"
                                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                                  : "bg-slate-100 text-slate-500 border border-slate-200"
                            }`}>
                              {p.status === "Approved" ? "Aprovado" : p.status === "Review" ? "Em Revisão" : "Rascunho"}
                            </span>
                          </div>
                          <h4 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-1">{p.title}</h4>
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{p.description}</p>
                          
                          <div className="mt-4 flex justify-between items-center text-[10px] font-medium border-t border-slate-100/80 pt-3">
                            <span className="text-slate-400">Dono: <strong className="text-slate-600">{p.owner.split(" ")[0]}</strong></span>
                            <span className="text-slate-400">Eficácia: <strong className="text-slate-700">{p.complianceLevel}%</strong></span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Policy Inspector View */}
                <div className="lg:col-span-7">
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 relative overflow-hidden">
                    
                    {/* Decorative background paper watermark */}
                    <div className="absolute top-20 right-10 opacity-[0.015] pointer-events-none select-none text-[150px] font-bold">
                      PSI
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
                      <div>
                        <span className="text-xs font-mono font-bold text-blue-800 tracking-wider inline-block">
                          {selectedPolicy.code} • Revisado em {selectedPolicy.lastRevision}
                        </span>
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-950 mt-1">{selectedPolicy.title}</h2>
                        <p className="text-slate-400 text-xs mt-1">Autoridade e Custódia de Segurança</p>
                      </div>

                      {/* Quick approvals mechanism */}
                      <div className="flex gap-1.5 bg-slate-50 border border-slate-200 p-1 rounded-xl w-full sm:w-auto overflow-hidden">
                        {["Draft", "Review", "Approved"].map((statusOption) => {
                          const optLabel = statusOption === "Draft" ? "Rascunho" : statusOption === "Review" ? "Revisão" : "Aprovado";
                          const activeOption = selectedPolicy.status === statusOption;
                          return (
                            <button
                              key={statusOption}
                              onClick={() => updatePolicyStatus(selectedPolicy.id, statusOption as any)}
                              className={`flex-1 sm:flex-none text-[11px] px-3 py-1.5 rounded-lg font-bold transition-all ${
                                activeOption
                                  ? "bg-blue-800 text-white shadow-sm"
                                  : "text-slate-500 hover:text-slate-900 bg-transparent hover:bg-slate-200/50"
                              }`}
                            >
                              {optLabel}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Scope metadata block */}
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs space-y-1.5">
                      <p className="text-slate-500"><strong>Gestor Corporativo:</strong> {selectedPolicy.owner}</p>
                      <p className="text-slate-500"><strong>Nível de Conformidade Estimado:</strong> {selectedPolicy.complianceLevel}%</p>
                      <p className="text-slate-505 text-slate-500"><strong>Resumo Executivo:</strong> {selectedPolicy.description}</p>
                    </div>

                    {/* Policy clauses paper simulation */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-400" />
                        Cláusulas e Conteúdo Operacional
                      </h4>
                      
                      <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-6 font-serif text-sm leading-relaxed text-slate-700 max-h-[350px] overflow-y-auto space-y-4 shadow-inner">
                        {selectedPolicy.content.map((clause, idx) => (
                          <p key={idx} className="pb-3 border-b border-slate-100/40 last:border-0 pl-1.5">
                            {clause}
                          </p>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-5 flex items-center justify-between text-xs">
                      <span className="text-slate-400">Assinado digitalmente por <strong className="text-slate-600">{selectedPolicy.owner.split(" ")[0]}</strong></span>
                      <button 
                        onClick={() => triggerNotification(`Trancado para alteração de comitê. Convoque o conselho.`, "info")}
                        className="text-blue-800 hover:text-blue-900 font-bold flex items-center gap-1.5"
                      >
                        <span>Evidenciar junto à Auditoria</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                </div>
              </div>

              {/* High Fidelity RACI Table & Change Board approval simulator */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-950 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-800" />
                    Processos de Governança · Matriz RACI Geral de Mudanças (Change Management)
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm mt-1">
                    Garantia de controle, documentação retroativa e governança no ciclo de vida de liberação em produção. Papéis: <strong>R</strong> (Responsável), <strong>A</strong> (Aprovador), <strong>C</strong> (Consultado), <strong>I</strong> (Informado).
                  </p>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                  <table className="w-full text-left text-xs sm:text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold text-center">
                        <th className="p-4 text-left">Atividade Operacional</th>
                        <th className="p-4">Líder Técnico</th>
                        <th className="p-4">CAB (Conselho)</th>
                        <th className="p-4">CISO (Segurança)</th>
                        <th className="p-4">Gerente Negócio</th>
                        <th className="p-4">Desenvolvedor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-center">
                      {[
                        { act: "Registrar RFC (Solicitação de Mudança)", roles: ["R", "C", "I", "I", "C"] },
                        { act: "Avaliar impactos e riscos técnicos", roles: ["C", "R", "C", "C", "I"] },
                        { act: "Aprovar formalmente a implantação", roles: ["I", "A", "C", "A", "I"] },
                        { act: "Realizar testes e deploy em Homologação", roles: ["R", "I", "I", "I", "R"] },
                        { act: "Validar e assinar deploy em Produção", roles: ["R", "C", "I", "A", "C"] },
                        { act: "Atualizar catálogo e guias de rollback", roles: ["R", "I", "I", "I", "R"] }
                      ].map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition">
                          <td className="p-4 font-semibold text-slate-800 text-left">{row.act}</td>
                          {row.roles.map((sym, sidx) => {
                            let badgeStyle = "bg-slate-100 text-slate-500";
                            if (sym === "R") badgeStyle = "bg-blue-100 text-blue-800 font-bold border border-blue-250";
                            else if (sym === "A") badgeStyle = "bg-indigo-100 text-indigo-800 font-bold border border-indigo-250";
                            else if (sym === "C") badgeStyle = "bg-amber-100 text-amber-800 font-medium";
                            return (
                              <td key={sidx} className="p-4">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider inline-block ${badgeStyle}`}>
                                  {sym}
                                </span>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Simulated CAB approvals board wrapper */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-100 text-blue-800 rounded-xl">
                      <GitBranch className="w-5 h-5 text-blue-700 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">Painel de Decisões de Prontidão (CAB)</h4>
                      <p className="text-slate-400 text-[11px]">Faça uma chamada de simulação interativa baseada no seu plano de rollback</p>
                    </div>
                  </div>

                  <div className="p-4 bg-white border border-slate-205 border-slate-200/60 rounded-xl space-y-2 text-xs">
                    <p className="text-slate-500">📌 <strong>Mudança Submetida:</strong> RFC-2026-9042 — Migração & Correção de performance nas rotas críticas de banco de dados do cooperado do NeoCredit.</p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => {
                        setCabSimulationResult("approved");
                        handleMetricChange("changes", 95);
                        triggerNotification("Simulação concluída! CAB aprovou a mudança com rollback cadastrado.", "success");
                      }}
                      className="px-4 py-2.5 rounded-full text-xs font-bold border border-emerald-300 bg-white text-emerald-800 hover:bg-emerald-50 transition shadow-sm flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Simular aprovação pelo CAB</span>
                    </button>
                    <button
                      onClick={() => {
                        setCabSimulationResult("rejected");
                        triggerNotification("Simulação concluída! Mudança foi recusada devido a riscos expostos.", "info");
                      }}
                      className="px-4 py-2.5 rounded-full text-xs font-bold border border-rose-300 bg-white text-rose-800 hover:bg-rose-50 transition shadow-sm flex items-center gap-1.5"
                    >
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      <span>Simular rejeição (falta de rollback)</span>
                    </button>
                  </div>

                  <AnimatePresence mode="wait">
                    {cabSimulationResult && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`p-4 rounded-xl text-xs border ${
                          cabSimulationResult === "approved" 
                            ? "bg-emerald-50/50 border-emerald-250 text-emerald-900" 
                            : "bg-rose-50/50 border-rose-250 text-rose-900"
                        }`}
                      >
                        {cabSimulationResult === "approved" ? (
                          <p className="leading-relaxed">
                            <strong>✅ EXECUTÁVEL APROVADO:</strong> A mudança foi aprovada formalmente por unanimidade no CAB. O líder técnico tem chancela formal para executar o script no ambiente de homologação. O indicador de <strong>Mudanças aprovadas pelo CAB</strong> subiu para <strong>95%</strong>, alcançando a meta operacional estrita de governança!
                          </p>
                        ) : (
                          <p className="leading-relaxed">
                            <strong>❌ CHANCELA REJEITADA:</strong> A liberação de deploy operacional foi bloqueada. Auditoria interna assinalou que a ausência de um roteiro de rollback reversível viola a seção de integridade da política <strong>POL-CHG-04</strong>. O desenvolvedor deve reavaliar o impacto, catalogar o plano de contingência e republicar uma nova RFC.
                          </p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Supporting Secondary Policies BYOD & AUP */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* AUP Card */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-indigo-50 text-indigo-700 rounded-2xl">
                      <Shield className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-slate-950 text-base">Política de Uso Aceitável (AUP)</h3>
                  </div>

                  <ul className="space-y-3 text-xs text-slate-650 leading-relaxed">
                    <li className="flex gap-2">
                      <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span><strong>Complexidade de Credenciais:</strong> Requisito de senhas fortes com 12+ caracteres, contendo caracteres especiais e reciclagem obrigatória a cada 90 dias.</span>
                    </li>
                    <li className="flex gap-2">
                      <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span><strong>Zelo de Acesso:</strong> Impedimento estrito e irrefutável de compartilhamento de credenciais de redes privadas virtuais ou sistemas internos.</span>
                    </li>
                    <li className="flex gap-2">
                      <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span><strong>Bloqueio de Ociosidade:</strong> Suspensão ativa automática do terminal operacional corporativo por inatividade após 5 minutos.</span>
                    </li>
                    <li className="flex gap-2">
                      <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span><strong>Software Homologado:</strong> Apenas aplicativos chancelados formalmente pelo departamento de TI. Ações de Shadow IT são proibidas.</span>
                    </li>
                    <li className="flex gap-2">
                      <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span><span><strong>Monitoramento Ativo:</strong> Todo tráfego de rede corporativa e logs de acesso a dados bancários de cooperativas serão monitorados continuamente.</span></span>
                    </li>
                  </ul>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-400">
                    <span>POL-GVR-AUP</span>
                    <span className="text-rose-600">Advertência a Demissão por Justa Causa</span>
                  </div>
                </div>

                {/* BYOD Card */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-indigo-50 text-indigo-700 rounded-2xl">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-slate-950 text-base">Diretrizes de BYOD (Bring Your Own Device)</h3>
                  </div>

                  <ul className="space-y-3 text-xs text-slate-650 leading-relaxed">
                    <li className="flex gap-2">
                      <Check className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                      <span><strong>Silos de Acesso:</strong> Conexões externas limitadas ao e-mail institucional corporativo e canais institucionais de comunicação.</span>
                    </li>
                    <li className="flex gap-2">
                      <Check className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                      <span><strong>Criptografia Integral:</strong> Exigência de blindagem de disco, sistema operacional atualizado e reconhecimento biométrico habilitado.</span>
                    </li>
                    <li className="flex gap-2">
                      <Check className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                      <span><strong>Containerização MDM:</strong> Instalação sob supervisão de ferramenta MDM para segregar o silo acadêmico/pessoal do corporativo.</span>
                    </li>
                    <li className="flex gap-2">
                      <Check className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                      <span><strong>Alerta e Wipe de Emergência:</strong> Comunicação mandatória em menos de 30 minutos em caso de perda para acionamento de wipe remoto.</span>
                    </li>
                    <li className="flex gap-2">
                      <Check className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                      <span><span><strong>Adesão Normativa:</strong> Obrigação civil de assinar digitalmente termos preventivos de autoridade de controle eletrônico.</span></span>
                    </li>
                  </ul>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-400">
                    <span>POL-GVR-BYOD</span>
                    <span className="text-indigo-600">Assinatura Digital Mandatória</span>
                  </div>
                </div>

              </div>

              {/* Dynamic Interactive ITAM (Information Technology Asset Management) */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-950 flex items-center gap-1.5">
                      <Lock className="w-5 h-5 text-indigo-700" />
                      ITAM – Gestão de Ativos de TI (Baseado na ISO/IEC 19770)
                    </h3>
                    <p className="text-slate-400 text-xs mt-0.5">Controladoria ativa de servidores, softwares homologados, workstations e conformidade de licenças.</p>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-2 font-bold text-xs text-indigo-900">
                    <span>Fator ITAM Geral:</span>
                    <strong className="text-sm font-extrabold">{itamProgress}%</strong>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-650 leading-relaxed">
                  <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                    <strong className="text-slate-900 font-bold block uppercase tracking-wider text-[10px]">Inventário Mandatório de Ativos:</strong>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                        <span>Controle de instâncias cloud públicas (especificando provedor, custo consolidado diário e gestor)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                        <span>Mapeamento de laptops, endpoints de escritório e celulares homologados de colaboradores</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                        <span>Auditoria ativa de licenças de software e seats adquiridos para mitigação de shadow IT</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                        <span>Controle estrito de separação de ambientes de produção, homologação e staging</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                    <strong className="text-slate-900 font-bold block uppercase tracking-wider text-[10px]">Regras de Ciclo de Vida:</strong>
                    <p>
                      Todos os ativos cadastrados no NeoCredit transitam sistematicamente pelos estágios de: <strong>Aquisição</strong> → <strong>Homologação</strong> → <strong>Apoio Corretivo</strong> → <strong>Descarte Seguro</strong> com sanitização certificada.
                    </p>
                    <p>
                      O time conduz rotinas automatizadas de varreduras IP mensais nos subsegmentos de rede corporativa para neutralizar o uso de Shadow IT e ativos não cadastrados (ISO 19770).
                    </p>
                  </div>
                </div>

                {/* Range Slider control for ITAM progress simulation */}
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex-1 w-full space-y-1.5">
                    <div className="flex justify-between text-xs text-slate-700 font-semibold">
                      <span>Calibrar progresso de auditoria do inventário ITAM:</span>
                      <span>{itamProgress}% de Cobertura</span>
                    </div>
                    <input
                      type="range"
                      id="itamProgress"
                      min="0"
                      max="100"
                      value={itamProgress}
                      onChange={(e) => setItamProgress(parseInt(e.target.value))}
                      className="w-full accent-indigo-700 bg-slate-200 h-1.5 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <button 
                    onClick={() => {
                      setItamProgress(100);
                      triggerNotification("Automatização de Auditoria ITAM concluída com sucesso (100% Cobertura)!", "success");
                    }}
                    className="w-full sm:w-auto px-5 py-2 bg-indigo-650 bg-indigo-700 text-white text-xs font-bold rounded-xl hover:bg-indigo-800 transition shadow-md shrink-0 text-center"
                  >
                    Marcar Cobertura 100%
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "incidents" && (
            <motion.div
              key="incidents"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
                <h3 className="text-lg font-extrabold text-slate-950 flex items-center gap-2">
                  <Flame className="w-6 h-6 text-rose-600" />
                  Centro de Crise & Simulados de Incidente (ITIL 4)
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
                  Selecione um cenário típico de crise corporativa de crédito para simular em tempo real. Observe como as ações contidas no playbook mitigam o estrago e garantem que o sistema e os dados de cooperados permaneçam seguros.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
                  
                  {/* Scenario 1 */}
                  <div className="border border-slate-200 rounded-2xl p-5 hover:border-rose-400 hover:bg-rose-50/20 transition-all cursor-pointer flex flex-col justify-between"
                       onClick={() => triggerIncidentScenario("ddos")}>
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="bg-rose-100 text-rose-800 text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                          Crítica
                        </span>
                        <span className="text-slate-400 text-xs">SLA: 15min</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">Ataque DDoS Transacional (Pix)</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Inundação cibernética provoca timeouts graves no envio de pagamentos e Pix do NeoCredit.
                      </p>
                    </div>
                    <button className="mt-4 w-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2 rounded-xl transition">
                      Simular Sobrecarga Pix
                    </button>
                  </div>

                  {/* Scenario 2 */}
                  <div className="border border-slate-200 rounded-2xl p-5 hover:border-amber-400 hover:bg-amber-50/20 transition-all cursor-pointer flex flex-col justify-between"
                        onClick={() => triggerIncidentScenario("leak")}>
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                          Alta
                        </span>
                        <span className="text-slate-400 text-xs">SLA: 45min</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">Exposição de API Key AWS</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Vazamento automatizado detectado de credenciais de infra de staging em histórico git exposto.
                      </p>
                    </div>
                    <button className="mt-4 w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-2 rounded-xl transition">
                      Simular Chave Exposta
                    </button>
                  </div>

                  {/* Scenario 3 */}
                  <div className="border border-slate-200 rounded-2xl p-5 hover:border-blue-400 hover:bg-blue-50/20 transition-all cursor-pointer flex flex-col justify-between"
                        onClick={() => triggerIncidentScenario("phish")}>
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                          Média
                        </span>
                        <span className="text-slate-400 text-xs">SLA: 120min</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">Spear-Phishing em Tesouraria</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Colaboradores recebem iscas enganosas de fusões corporativas contendo arquivos maliciosos.
                      </p>
                    </div>
                    <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 rounded-xl transition">
                      Simular Spear-Phishing
                    </button>
                  </div>

                </div>
              </div>

              {/* Historic incident Logs */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
                <div className="flex justify-between items-center border-b border-slate-100 pb-5 mb-5">
                  <div>
                    <h3 className="text-lg font-bold text-slate-950 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-slate-700" />
                      Registros Históricos de Incidentes (Linha de Auditoria ANPD)
                    </h3>
                    <p className="text-slate-400 text-xs mt-0.5">Relatório contínuo de contingência operada e comprovada</p>
                  </div>
                  <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1 rounded-full border border-slate-200">
                    {historicalIncidents.length} Registros
                  </span>
                </div>

                <div className="divide-y divide-slate-100">
                  {historicalIncidents.map(inc => (
                    <div key={inc.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50/40 px-2 rounded-2xl transition">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-slate-400 font-mono font-bold">#{inc.id}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-xs text-slate-400 font-medium">{inc.date}</span>
                          <span className="text-slate-300">•</span>
                          <span className={`text-[10px] font-extrabold uppercase px-2 py-0.2 rounded-full ${
                            inc.severity === "Crítica" ? "bg-rose-50 text-rose-700 border border-rose-100" :
                            inc.severity === "Alta" ? "bg-amber-50 text-amber-700 border border-amber-100" : "bg-blue-50 text-blue-700 border border-blue-100"
                          }`}>
                            {inc.severity}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base mt-1">{inc.title}</h4>
                        <p className="text-slate-500 text-xs mt-1 italic leading-relaxed">RCA: {inc.rca}</p>
                      </div>
                      <div className="text-left sm:text-right shrink-0">
                        <span className="text-emerald-700 font-bold bg-emerald-50 text-xs px-2.5 py-1 rounded-full border border-emerald-100 inline-block">
                          {inc.status}
                        </span>
                        <p className="text-[10px] text-slate-400 font-semibold mt-1">Tempo de Resposta: {inc.resolutionSLA}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "compliance" && (
            <motion.div
              key="compliance"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Compliance Header block */}
              <div className="bg-white border border-slate-205 border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-blue-950 flex items-center gap-2">
                      <Shield className="w-6 h-6 text-indigo-700 animate-spin-slow" />
                      Conformidade Regulatória, Diretrizes de Privacidade & Análise ROSI
                    </h2>
                    <p className="text-slate-400 text-xs sm:text-sm max-w-4xl">
                      Harmonização sistêmica com os marcos regulatórios de privacidade (LGPD), normas de cibersegurança do Banco Central do Brasil (Resolução 4.893) e controles operacionais auditáveis ISO/IEC 27001.
                    </p>
                  </div>
                </div>
              </div>

              {/* Interactive Framework Portals (from Images 1, 2, 3, 4) */}
              <div className="bg-slate-50 border border-slate-200 p-2 sm:p-2.5 rounded-2xl flex flex-wrap gap-2 shadow-inner" id="compliance-subtabs">
                {[
                  { id: "regulatory", label: "Prontuário & Controles Regulatórios", icon: Shield },
                  { id: "iso38500", label: "ISO/IEC 38500 (6 Princípios)", icon: BookOpen },
                  { id: "maturity", label: "Jornada de Maturidade", icon: Layers },
                  { id: "gov_vs_mgmt", label: "Governança vs Gestão de TI", icon: Sliders }
                ].map((sub) => {
                  const SubIcon = sub.icon;
                  const isActive = complianceSubTab === sub.id;
                  return (
                    <button
                      key={sub.id}
                      id={`sub-tab-${sub.id}`}
                      onClick={() => {
                        setComplianceSubTab(sub.id);
                        triggerNotification(`Navegando para o referencial: ${sub.label}`, "info");
                      }}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isActive 
                          ? "bg-slate-900 border border-slate-800 text-white shadow-md scale-[1.01]" 
                          : "bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <SubIcon className={`w-4 h-4 ${isActive ? "text-indigo-400" : "text-slate-500"}`} />
                      <span>{sub.label}</span>
                      {sub.id === "maturity" && (
                        <span className="bg-emerald-500 text-white text-[9px] px-1.5 py-0.5 rounded-md font-mono font-bold shrink-0">Nível 4</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {complianceSubTab === "regulatory" && (
                <>
                  {/* Compliance visual summaries */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { name: "ISO/IEC 27001", color: "from-blue-700 to-blue-900", percent: getFrameworkCompliance("ISO 27001"), desc: "Controles de Segurança Cibernética" },
                  { name: "COBIT 2019", color: "from-amber-600 to-amber-800", percent: getFrameworkCompliance("COBIT 2019"), desc: "Governança Corporativa e Alinhamento" },
                  { name: "ITIL 4", color: "from-slate-700 to-slate-900", percent: getFrameworkCompliance("ITIL 4"), desc: "Operação e Gerenciamento de Serviços" },
                  { name: "LGPD", color: "from-indigo-700 to-indigo-900", percent: lgpdCompliancePercent, desc: "Privacidade de Dados de Titulares" }
                ].map((fwSum, i) => (
                  <div key={i} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Framework</span>
                    <h3 className="text-lg font-bold text-slate-950 mt-1">{fwSum.name}</h3>
                    
                    <div className="flex items-center gap-3 mt-4">
                      <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full bg-gradient-to-r ${fwSum.color}`} style={{ width: `${fwSum.percent}%` }}></div>
                      </div>
                      <span className="text-sm font-extrabold text-slate-900 shrink-0">{fwSum.percent}%</span>
                    </div>
                    <p className="text-slate-400 text-[10px] font-medium mt-2 leading-relaxed">{fwSum.desc}</p>
                  </div>
                ))}
              </div>

              {/* Two Column: LGPD and BACEN regulatory summary cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* LGPD Compliance card */}
                <div className="bg-white border border-slate-205 border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4 relative overflow-hidden">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 sm:p-2.5 bg-indigo-50 text-indigo-700 rounded-2xl">
                      <Lock className="w-5 h-5 text-indigo-700" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-950 text-base">Lei Geral de Proteção de Dados (LGPD)</h3>
                      <p className="text-slate-400 text-[10px]">Políticas ativas sob regência do Artigo 41 e Artigo 46</p>
                    </div>
                  </div>

                  <div className="space-y-3.5 text-xs text-slate-650 leading-relaxed pt-2">
                    <p>
                      <strong>Princípios de Privacidade:</strong> Alinhamento com Privacy by Design, Privacy by Default, transparência governamental de cookies e coleta de dados estritamente associados à finalidade de crédito cooperativo.
                    </p>
                    <p>
                      <strong>DPO Nomeado & Defesa:</strong> O Encarregado de Proteção de Dados (DPO) possui nomeação homologada em ata. O portal institucional fornece canal desimpedido para solicitações e revogações de consentimentos de titulares.
                    </p>
                    <p>
                      <strong>Gestão de Escopos Financeiros:</strong> Punições estritas capituladas pela ANPD podem atingir multas administrativas severas de até 2% do faturamento da cooperativa bancária (limitado a R$ 50M por evento de vazamento).
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-slate-400 font-semibold text-[10px] uppercase">Diagnóstico NeoCredit:</span>
                    {metrics.encrypt >= 100 ? (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-250 rounded-full px-3 py-1 font-bold text-[11px] flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Conformidade Estrita
                      </span>
                    ) : (
                      <span className="bg-rose-50 text-rose-700 border border-rose-250 rounded-full px-3 py-1 font-bold text-[11px] flex items-center gap-1 animate-pulse">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        🔴 Em Risco Iminente (Vulnerável)
                      </span>
                    )}
                  </div>
                </div>

                {/* BACEN Resolução 4.893 compliance card */}
                <div className="bg-white border border-slate-205 border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4 relative overflow-hidden">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 sm:p-2.5 bg-blue-50 text-blue-800 rounded-2xl">
                      <Award className="w-5 h-5 text-blue-700" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-950 text-base">BACEN – Resolução nº 4.893</h3>
                      <p className="text-slate-400 text-[10px]">Regulamentação de Segurança Cibernética nas Inst. Financeiras</p>
                    </div>
                  </div>

                  <div className="space-y-3.5 text-xs text-slate-650 leading-relaxed pt-2">
                    <p>
                      <strong>Política de Segurança Cibernética:</strong> Exige a redação formal e de livre circulação de diretrizes de segurança de redes, procedimentos de controle de alterações técnicas, e relatórios periódicos direcionados à mesa diretora.
                    </p>
                    <p>
                      <strong>Prevenção em Nuvem (Cloud Governance):</strong> Regulamenta parâmetros mínimos de auditoria de segurança das instâncias de banco de dados onde os cartões, chaves Pix e saldos transacionais estão armazenados.
                    </p>
                    <p>
                      <strong>Continuidade de Negócio:</strong> Cláusulas exigem simulados práticos anuais obrigatórios de restauração de serviços críticos pós Incidentes de TI, assegurando continuidade mesmo em cenários de catástrofe de rede.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-slate-400 font-semibold text-[10px] uppercase">Diagnóstico NeoCredit:</span>
                    {metrics.uptime >= 99.95 ? (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-250 rounded-full px-3 py-1 font-bold text-[11px] flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Parâmetros de SLA Atendidos
                      </span>
                    ) : (
                      <span className="bg-amber-50 text-amber-700 border border-amber-250 rounded-full px-3 py-1 font-bold text-[11px] flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        🟡 Parcialmente Atendido (SLA e Uptime)
                      </span>
                    )}
                  </div>
                </div>

              </div>

              {/* Two Column: ISO 27001 Controls table and ROSI calculator */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* ISO 27001 applied controls container */}
                <div className="bg-white border border-slate-205 border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-950 flex items-center gap-2">
                      <Lock className="w-5 h-5 text-indigo-700" />
                      ISO/IEC 27001:2022 – Controles Aplicados (SGSI)
                    </h3>
                    <p className="text-slate-400 text-xs mt-1">
                      Mapeamento em tempo real dos controles práticos implementados no NeoCredit vinculados às suas metas de governança.
                    </p>
                  </div>

                  <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                          <th className="p-3">Controle</th>
                          <th className="p-3">Descrição Requisitada</th>
                          <th className="p-3 text-center">Status Operacional</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        <tr>
                          <td className="p-3.5 font-mono font-bold text-blue-900">A.5.32</td>
                          <td className="p-3.5 text-slate-650">Gestão de Mudanças Organizacionais (CAB RACI)</td>
                          <td className="p-3.5 text-center">
                            {metrics.changes >= 95 ? (
                              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2.5 py-1 text-[10px] font-bold inline-block">
                                Aprovado (CAB Ativo)
                              </span>
                            ) : (
                              <span className="bg-rose-50 text-rose-700 border border-rose-200 rounded-full px-2.5 py-1 text-[10px] font-bold inline-block animate-pulse">
                                Implementando (RACI)
                              </span>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className="p-3.5 font-mono font-bold text-blue-900">A.8.24</td>
                          <td className="p-3.5 text-slate-650">Uso do Controle de Alteração de Configurações Técnicas</td>
                          <td className="p-3.5 text-center">
                            {policies.find(p => p.id === "pol-4")?.status === "Approved" ? (
                              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2.5 py-1 text-[10px] font-bold inline-block">
                                Homologado (POL-CHG)
                              </span>
                            ) : (
                              <span className="bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2.5 py-1 text-[10px] font-bold inline-block">
                                Parcialmente Homologado
                              </span>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className="p-3.5 font-mono font-bold text-blue-900">A.8.11</td>
                          <td className="p-3.5 text-slate-650">Proteção de Dados Sensíveis e Privados (Criptografia)</td>
                          <td className="p-3.5 text-center">
                            {metrics.encrypt >= 100 ? (
                              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2.5 py-1 text-[10px] font-bold inline-block">
                                100% Protegido (AES-256)
                              </span>
                            ) : (
                              <span className="bg-rose-50 text-rose-700 border border-rose-200 rounded-full px-2.5 py-1 text-[10px] font-bold inline-block">
                                Crítico ({metrics.encrypt}% Cripo)
                              </span>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className="p-3.5 font-mono font-bold text-blue-900">A.5.9</td>
                          <td className="p-3.5 text-slate-650">Inventariamento e Atribuição de Ativos (ITAM)</td>
                          <td className="p-3.5 text-center">
                            {itamProgress >= 90 ? (
                              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2.5 py-1 text-[10px] font-bold inline-block">
                                Concluído (100%)
                              </span>
                            ) : (
                              <span className="bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2.5 py-1 text-[10px] font-bold inline-block">
                                ITAM {itamProgress}% Cobertura
                              </span>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className="p-3.5 font-mono font-bold text-blue-900">A.6.8</td>
                          <td className="p-3.5 text-slate-650">Conscientização da Aprendizagem de Segurança</td>
                          <td className="p-3.5 text-center">
                            {metrics.training >= 90 ? (
                              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2.5 py-1 text-[10px] font-bold inline-block">
                                Excelente Treinamento
                              </span>
                            ) : (
                              <span className="bg-rose-50 text-rose-700 border border-rose-200 rounded-full px-2.5 py-1 text-[10px] font-bold inline-block">
                                Frágil ({metrics.training}% Treinado)
                              </span>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <p className="text-[11px] text-slate-400 italic font-semibold">
                    * Os status desta matriz e dos controles ISO variam dinamicamente baseados na calibragem de sliders operacionais e aprovações do CAB.
                  </p>
                </div>

                {/* ROSI Simulator container */}
                <div className="bg-white border border-slate-205 border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 relative overflow-hidden bg-gradient-to-br from-slate-50/50 to-white">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-950 flex items-center gap-1.5">
                      <TrendingUp className="w-5 h-5 text-blue-800" />
                      ROSI – Return on Security Investment (Finanças de TI)
                    </h3>
                    <p className="text-slate-400 text-xs mt-0.5">
                      Simule o retorno corporativo e econômico de investimentos de blindagem cibernética calibrando riscos versus multas da ANPD e indisponibilidades de Pix.
                    </p>
                  </div>

                  {/* ROSI interactive sliders */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-semibold text-slate-700">
                        <span>Investimento Anual em Governança & Controles (R$):</span>
                        <strong className="text-blue-900 font-extrabold">R$ {rosiInvest.toLocaleString("pt-BR")}</strong>
                      </div>
                      <input
                        type="range"
                        min="50000"
                        max="2000000"
                        step="50000"
                        value={rosiInvest}
                        onChange={(e) => setRosiInvest(parseInt(e.target.value))}
                        className="w-full accent-blue-800 bg-slate-200 h-1.5 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-semibold text-slate-700">
                        <span>Perda Potencial Anual Evitada (Multas, Sequestro, Downtime):</span>
                        <strong className="text-blue-900 font-extrabold">R$ {rosiPerda.toLocaleString("pt-BR")}</strong>
                      </div>
                      <input
                        type="range"
                        min="100000"
                        max="10000000"
                        step="100000"
                        value={rosiPerda}
                        onChange={(e) => setRosiPerda(parseInt(e.target.value))}
                        className="w-full accent-indigo-700 bg-slate-200 h-1.5 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* ROSI calculated Display */}
                  <div className="p-5 bg-white border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center space-y-1 shadow-inner relative">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Indicador Geral Estimado (Fator ROSI%):</span>
                    
                    {(() => {
                      const computedRosi = rosiInvest > 0 ? Math.round(((rosiPerda - rosiInvest) / rosiInvest) * 100) : 0;
                      const rosiColor = computedRosi >= 200 ? "text-emerald-700" : computedRosi >= 0 ? "text-blue-800" : "text-rose-600";
                      const rosiText = computedRosi >= 0 ? `ROSI = +${computedRosi}%` : `ROSI = ${computedRosi}%`;
                      return (
                        <div className="space-y-2">
                          <strong className={`text-2xl sm:text-4xl font-extrabold ${rosiColor} tracking-tight font-mono`}>
                            {rosiText}
                          </strong>
                          <p className="text-[11px] text-slate-400 max-w-sm mx-auto leading-relaxed font-serif italic">
                            O investimento de <strong className="text-slate-650 font-semibold">R$ {rosiInvest.toLocaleString("pt-BR")}</strong> evita uma paralisação catastrófica ou multas no NeoCredit, traduzindo um ganho financeiro preventivo líquido de <strong className="text-slate-650 font-semibold">R$ {(rosiPerda - rosiInvest).toLocaleString("pt-BR")}</strong>.
                          </p>
                        </div>
                      );
                    })()}
                  </div>

                  <div className="bg-indigo-50 border border-indigo-100/60 p-4 rounded-xl text-[11px] text-ellipsis text-indigo-900 leading-relaxed">
                    <i className="fas fa-info-circle mr-1"></i>
                    <strong>Fórmula do Retorno:</strong> <code className="font-mono bg-white/60 px-1 py-0.5 rounded">((Perda Evitada - Custo Controles) / Custo Controles) * 100</code>. Ter uma fórmula de ROI positiva facilita a aprovação dos limites regulatórios junto ao comitê de diretoria executiva do NeoCredit.
                  </div>
                </div>

              </div>

              {/* Regulatory Risk Heatmap block with absolute conformity slider */}
              <div className="bg-white border border-slate-205 border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-950 flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5 text-rose-600" />
                      Mapa de Calor de Riscos Regulatórios (Apetite a Riscos)
                    </h3>
                    <p className="text-slate-400 text-xs mt-0.5">
                      Controle estrito de gravidades atentas às exigências da ANPD e do BACEN. A conformidade total evita penalidades operacionais severas.
                    </p>
                  </div>

                  {(() => {
                    const averageConformProgress = Math.round((getFrameworkCompliance("ISO 27001") + getFrameworkCompliance("COBIT 2019") + getFrameworkCompliance("ITIL 4") + lgpdCompliancePercent) / 4);
                    return (
                      <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-2 font-bold text-xs text-indigo-950 shrink-0">
                        <span>Fórmula Geral de Conformidade:</span>
                        <strong className="text-sm font-extrabold text-indigo-900">{averageConformProgress}%</strong>
                      </div>
                    );
                  })()}
                </div>

                {/* Heatmap descriptions grids */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-relaxed">
                  <div className="p-4 bg-rose-50/50 border border-rose-100 rounded-2xl space-y-2">
                    <strong className="text-rose-800 font-extrabold block text-[10px] uppercase tracking-wider">🔴 RISCO ALTO (CRÍTICO):</strong>
                    <p className="text-slate-650">
                      <strong>Vazamento ou Tratamento Indevido de Dados Sensíveis:</strong> Multas retroativas baseadas no Artigo 42 da LGPD, implicando bloqueio parcial de bases de dados do NeoCredit.
                    </p>
                    <div className="text-[10px] font-bold text-rose-700">Covertura Criptografia Atual: {metrics.encrypt}% (Meta: 100%)</div>
                  </div>

                  <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-2xl space-y-2">
                    <strong className="text-amber-800 font-extrabold block text-[10px] uppercase tracking-wider">🟡 RISCO MÉDIO (MODERADO):</strong>
                    <p className="text-slate-650">
                      <strong>Falta de Roteiro de Rollback e Homologações:</strong> Reprovações frequentes de RFCs técnicas pelo CAB ou deploys ad-hoc sem documentação retrospectiva adequada.
                    </p>
                    <div className="text-[10px] font-bold text-amber-700">Mudanças Aprovadas CAB: {metrics.changes}% (Meta: 95%)</div>
                  </div>

                  <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl space-y-2">
                    <strong className="text-emerald-800 font-extrabold block text-[10px] uppercase tracking-wider">🟢 RISCO BAIXO (SATISFATÓRIO):</strong>
                    <p className="text-slate-650">
                      <strong>Comitês Técnicos Institucionalizados:</strong> Direção do CGTI e Comitê de Proteção de Dados (DPO) com fluxogramas RACI consolidados.
                    </p>
                    <div className="text-[10px] font-bold text-emerald-750 text-emerald-700">Requisitos ISO 27001 em Evidência: Ativos</div>
                  </div>
                </div>

                {/* Simulated dynamic progress bar representing conformidade total */}
                {(() => {
                  const averageConformProgress = Math.round((getFrameworkCompliance("ISO 27001") + getFrameworkCompliance("COBIT 2019") + getFrameworkCompliance("ITIL 4") + lgpdCompliancePercent) / 4);
                  return (
                    <div className="pt-2">
                      <div className="flex justify-between text-xs text-slate-700 font-bold mb-2">
                        <span>Progresso Integrado para Conformidade Total do NeoCredit:</span>
                        <span>{averageConformProgress}% de Cobertura de Evidências</span>
                      </div>
                      <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
                        <div 
                          className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-blue-700 via-indigo-600 to-emerald-500"
                          style={{ width: `${averageConformProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Radar Chart for Domain Maturity Level */}
              {(() => {
                const securityMaturity = Math.max(1, Math.min(5, parseFloat(((metrics.encrypt * 0.70 + metrics.training * 0.30) / 20).toFixed(1))));
                const processMaturity = Math.max(1, Math.min(5, parseFloat(((metrics.changes * 0.80 + getFrameworkCompliance("COBIT 2019") * 0.20) / 20).toFixed(1))));
                const peopleMaturity = Math.max(1, Math.min(5, parseFloat(((metrics.training * 0.85 + getFrameworkCompliance("ITIL 4") * 0.15) / 20).toFixed(1))));
                const dataMaturity = Math.max(1, Math.min(5, parseFloat(((lgpdCompliancePercent * 0.75 + metrics.encrypt * 0.25) / 20).toFixed(1))));
                const normalizedUptime = Math.max(0, Math.min(100, (metrics.uptime - 95) * 20));
                const techMaturity = Math.max(1, Math.min(5, parseFloat(((normalizedUptime * 0.7 + itamProgress * 0.3) / 20).toFixed(1))));

                const radarData = [
                  { subject: "Segurança", A: securityMaturity, fullMark: 5 },
                  { subject: "Processos", A: processMaturity, fullMark: 5 },
                  { subject: "Pessoas", A: peopleMaturity, fullMark: 5 },
                  { subject: "Dados", A: dataMaturity, fullMark: 5 },
                  { subject: "Tecnologia", A: techMaturity, fullMark: 5 }
                ];

                const getMaturityTier = (score: number) => {
                  if (score < 2.0) return { text: "Inicial (Ad-hoc)", color: "bg-rose-50 text-rose-700 border-rose-200", textColor: "text-rose-700" };
                  if (score < 3.0) return { text: "Gerenciado (Planejado)", color: "bg-amber-50 text-amber-700 border-amber-200", textColor: "text-amber-700" };
                  if (score < 4.0) return { text: "Definido (Padronizado)", color: "bg-blue-50 text-blue-700 border-blue-200", textColor: "text-blue-700" };
                  if (score < 4.6) return { text: "Gerenciado (Previsível)", color: "bg-emerald-50 text-emerald-700 border-emerald-250", textColor: "text-emerald-700" };
                  return { text: "Otimizado (Referência)", color: "bg-indigo-50 text-indigo-700 border-indigo-200 animate-pulse", textColor: "text-indigo-700" };
                };

                const domainsInfo = [
                  { name: "Segurança", val: securityMaturity, desc: "Criptografia de dados e conscientização cibernética", icon: Lock },
                  { name: "Processos", val: processMaturity, desc: "Roteiros de Rollback, CAB ativo e aprovação RACI", icon: GitBranch },
                  { name: "Pessoas", val: peopleMaturity, desc: "Fator humano treinado e resiliência a simulações", icon: Users },
                  { name: "Dados", val: dataMaturity, desc: "Governança de privacidade de dados sensíveis LGPD", icon: Shield },
                  { name: "Tecnologia", val: techMaturity, desc: "Uptime do Pix/portal e cobertura do inventário ITAM", icon: Activity }
                ];

                return (
                  <div className="bg-white border border-slate-205 border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-950 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-indigo-700" />
                        Radar de Maturidade por Domínio (COBIT / ISO / CMMI)
                      </h3>
                      <p className="text-slate-400 text-xs mt-0.5">
                        Visualização dinâmica da postura de governança da NeoCredit. Nível escalonado de 1.0 (mínimo) a 5.0 (classe mundial), recalculado ao alterar métricas e aprovações.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
                      {/* Radar Chart visualization */}
                      <div className="lg:col-span-2 h-72 xl:h-80 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                            <PolarGrid stroke="#cbd5e1" strokeWidth={0.5} />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#334155', fontSize: 11, fontWeight: '600' }} />
                            <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: '#64748b', fontSize: 10 }} />
                            <Radar name="NeoCredit" dataKey="A" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.25} />
                            <RechartsTooltip 
                              formatter={(value) => [`${value} / 5.0`, "Nível diário"]}
                              contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2edf7", borderRadius: "12px", fontSize: 11 }}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Domain details cards list */}
                      <div className="lg:col-span-3 space-y-3.5">
                        {domainsInfo.map((dom, idx) => {
                          const tier = getMaturityTier(dom.val);
                          const DomainIcon = dom.icon;
                          return (
                            <div key={idx} className="bg-slate-50 border border-slate-150 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                              <div className="flex items-start gap-4">
                                <span className="p-2 sm:p-2.5 bg-white border border-slate-200/60 rounded-xl text-slate-700 shrink-0">
                                  <DomainIcon className="w-4 h-4" />
                                </span>
                                <div className="space-y-0.5">
                                  <div className="flex items-baseline gap-2">
                                    <strong className="text-sm font-bold text-slate-900">{dom.name}</strong>
                                    <span className="text-[10px] text-slate-400 font-mono">({dom.val} / 5.0)</span>
                                  </div>
                                  <p className="text-slate-400 text-[10px] sm:text-xs font-semibold leading-relaxed">{dom.desc}</p>
                                </div>
                              </div>

                              <div className="flex flex-col sm:items-end gap-1.5 w-full sm:w-auto shrink-0">
                                {/* Small custom visual progress bar */}
                                <div className="hidden sm:block w-32 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${(dom.val / 5) * 100}%` }}></div>
                                </div>
                                <span className={`text-[10px] font-bold border rounded-full px-2.5 py-0.5 w-max ${tier.color}`}>
                                  Nível {dom.val}: {tier.text}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Accordion list box for Itemized compliance checklists */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-950 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-indigo-700" />
                      Auditoria de Evidências Detalhada Requisito por Requisito
                    </h3>
                    <p className="text-slate-400 text-xs mt-0.5">
                      Visualização tática dos requisitos do prontuário técnico regulatório. Marque os controles para recalcular os percentuais integrados live.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowDetailedAudit(!showDetailedAudit)}
                    className="px-5 py-2 rounded-full text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                  >
                    {showDetailedAudit ? "Ocultar Prontuário Completo" : "Exibir Prontuário Completo"}
                  </button>
                </div>

                <AnimatePresence>
                  {showDetailedAudit && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, mt: 0 }}
                      animate={{ opacity: 1, height: "auto", mt: 24 }}
                      exit={{ opacity: 0, height: 0, mt: 0 }}
                      className="overflow-hidden space-y-6 pt-6"
                    >
                      {["ISO 27001", "COBIT 2019", "ITIL 4", "LGPD"].map((fwGroup) => {
                        const groupItems = auditReqs.filter(r => r.framework === fwGroup);
                        const fwGroupPercent = getFrameworkCompliance(fwGroup);
                        return (
                          <div key={fwGroup} className="space-y-3 bg-slate-50/50 p-6 rounded-3xl border border-slate-100/80">
                            <div className="flex justify-between items-center">
                              <h4 className="font-extrabold text-slate-900 border-l-3 border-blue-800 pl-2.5 text-sm sm:text-base uppercase tracking-wider">
                                {fwGroup}
                              </h4>
                              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                                fwGroupPercent >= 80 ? "bg-emerald-100 text-emerald-800" :
                                fwGroupPercent >= 50 ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800"
                              }`}>
                                Conformidade: {fwGroupPercent}%
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-3">
                              {groupItems.map((req) => (
                                <div 
                                  key={req.id}
                                  onClick={() => toggleAuditReq(req.id)}
                                  className={`p-3.5 rounded-2xl border cursor-pointer flex items-start gap-3 transition-all ${
                                    req.checked 
                                      ? "bg-white border-blue-400 text-slate-800 shadow-sm" 
                                      : "bg-white/40 hover:bg-white border-slate-200 text-slate-400"
                                  }`}
                                >
                                  <div className={`p-1 rounded mt-0.5 shrink-0 ${req.checked ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-300"}`}>
                                    <Check className="w-3.5 h-3.5" />
                                  </div>
                                  <div>
                                    <span className="text-[9px] font-mono font-bold tracking-wider uppercase block text-slate-400 mb-1">
                                      {req.controlSection}
                                    </span>
                                    <p className={`text-xs font-medium leading-relaxed ${req.checked ? "text-slate-900" : "text-slate-500"}`}>
                                      {req.title}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              </>
              )}

              {complianceSubTab === "iso38500" && (
                <motion.div
                  key="iso38500"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  {/* ISO/IEC 38500 Header */}
                  <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-lg">
                    <div className="relative z-10 space-y-3">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-[10px] sm:text-xs font-bold text-blue-200 uppercase tracking-wider">
                        <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        Padrão Internacional de Governança Corporativa de TI
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-sans">ISO/IEC 38500 • NeoCredit Hub</h3>
                      <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
                        Diferente de frameworks processuais, o padrão ISO/IEC 38500 é inteiramente baseado em princípios finalistas. Ele orienta a alta administração do NeoCredit a <strong>avaliar</strong>, <strong>direcionar</strong> e <strong>monitorar</strong> de forma contínua e integrada o uso de infraestrutura, dados de crédito e comportamentos técnicos organizacionais.
                      </p>
                    </div>
                    <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/20 rounded-full filter blur-3xl translate-x-12 -translate-y-12"></div>
                  </div>

                  {/* 6 Principles Grid representing Image 1 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      {
                        num: 1,
                        name: "Responsabilidade",
                        desc: "Clareza irrepreensível sobre papéis, atribuições de autoridade e prestação de contas na oferta e demanda dos serviços do NeoCredit.",
                        icon: Users,
                        color: "border-blue-200 bg-blue-50 text-blue-800",
                        evidence: "Atas periódicas do Comitê CRI definindo formalmente as obrigações exclusivas de DPO, CISO, SRE e DevSecOps."
                      },
                      {
                        num: 2,
                        name: "Estratégia",
                        desc: "Alinhamento contínuo e indissociável entre a estratégia global de crédito cooperativo e a capacidade planejada de entregar TI de alta performance.",
                        icon: Compass,
                        color: "border-violet-200 bg-violet-50 text-violet-800",
                        evidence: "Plano Diretor de TI (PDTI) homologado trimestralmente na esteira de liberação rápida do time de negócios."
                      },
                      {
                        num: 3,
                        name: "Aquisição",
                        desc: "Investimentos em infraestrutura de nuvem e ferramentas baseados em análises financeiras rigorosas e preventivas de risco x retorno (ROSI % ).",
                        icon: Briefcase,
                        color: "border-emerald-200 bg-emerald-50 text-emerald-800",
                        evidence: "Estudos de Business Case, simulações de perdas potenciais de downtime e custos mensais detalhados sob auditoria."
                      },
                      {
                        num: 4,
                        name: "Desempenho",
                        desc: "Garantia técnica de que a plataforma do NeoCredit esteja adequada ao seu propósito institucional, com qualidade e alta disponibilidade.",
                        icon: TrendingUp,
                        color: "border-amber-200 bg-amber-50 text-amber-800",
                        evidence: `O SLA de Uptime do Pix / Portal (${metrics.uptime}%) e a esteira de deployment do CAB são rastreados dinamicamente.`
                      },
                      {
                        num: 5,
                        name: "Conformidade",
                        desc: "Aderência irrestrita a legislações nacionais (LGPD Art. 41 a 46) e normativos do Banco Central do Brasil (Res. BCB 4.893).",
                        icon: Shield,
                        color: "border-teal-200 bg-teal-50 text-teal-800",
                        evidence: `Comitê técnico avalia periodicamente o prontuário de conformidades que está atualmente em ${Math.round((getFrameworkCompliance("ISO 27001") + lgpdCompliancePercent) / 2)}% de cobertura.`
                      },
                      {
                        num: 6,
                        name: "Comportamento Humano",
                        desc: "Priorização absoluta do fator humano, considerando ergonomia, bem-estar, inclusão sociocultural e letramento cibernético.",
                        icon: Lightbulb,
                        color: "border-rose-200 bg-rose-50 text-rose-800",
                        evidence: `Campanhas semestrais obrigatórias de combate a Phishing com ${metrics.training}% dos colaboradores treinados e auditados.`
                      }
                    ].map((p) => {
                      const Icon = p.icon;
                      return (
                        <div key={p.num} className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className={`p-2.5 rounded-2xl border ${p.color} shrink-0`}>
                                <Icon className="w-5 h-5" />
                              </span>
                              <span className="text-xs font-mono font-bold text-slate-400">Princípio {p.num}</span>
                            </div>
                            <h4 className="text-base font-extrabold text-slate-900">{p.name}</h4>
                            <p className="text-slate-500 text-xs leading-relaxed font-semibold">{p.desc}</p>
                          </div>
                          
                          <div className="bg-slate-50/80 border border-slate-100 p-3 rounded-2xl space-y-1">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Evidência Ativa NeoCredit:</span>
                            <span className="text-[10px] text-slate-650 font-bold leading-relaxed block">{p.evidence}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Value for Management / Alta Administration from Image 1 */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                    <div>
                      <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                        <Sparkles className="w-4.5 h-4.5 text-indigo-700" />
                        Valor Prático para a Alta Administração do NeoCredit
                      </h4>
                      <p className="text-slate-400 text-xs mt-0.5">
                        Como a implantação da ISO/IEC 38500 traduz indicadores de engenharia técnica em linguagem corporativa e gerencial:
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      {[
                        { title: "Linguagem Executiva", content: "Traduz dados técnicos áridos de servidores e incidentes em métricas estratégicas compreensíveis pelo board corporativo.", icon: Briefcase },
                        { title: "Decisões Assertivas", content: "Fornece subsídios analíticos de auditoria de conformidade, apetite de risco e ROSI funcional para apoiar votos de comitês.", icon: HelpCircle },
                        { title: "Evidência de Auditoria", content: "Exige que o corpo operacional forneça evidências irrefutáveis pós incidentes com carimbo formal e lições aprendidas.", icon: FileText },
                        { title: "Redução de Riscos", content: "Diminui riscos civis, tributários e multas severas da ANPD e do BACEN estabelecendo controles e SLAs robustos de backup.", icon: ShieldAlert },
                        { title: "Alavanca de Valor", content: "Transforma a infraestrutura cibernética em uma fortaleza ética, inovadora, transparente e altamente resiliente ao mercado.", icon: TrendingUp }
                      ].map((item, idx) => {
                        const ItemIcon = item.icon || Info;
                        return (
                          <div key={idx} className="bg-slate-50 border border-slate-150 p-4 rounded-2xl space-y-2">
                            <div className="p-2 bg-white rounded-xl border border-slate-150 text-indigo-700 w-max">
                              <ItemIcon className="w-4.5 h-4.5 text-indigo-600" />
                            </div>
                            <strong className="text-xs font-bold text-slate-900 block">{item.title}</strong>
                            <p className="text-[10px] sm:text-xs text-slate-500 font-semibold leading-relaxed">{item.content}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {complianceSubTab === "maturity" && (
                <motion.div
                  key="maturity"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  {/* Maturity Header */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="space-y-0.5">
                        <h3 className="text-xl sm:text-2xl font-extrabold text-blue-950 flex items-center gap-2">
                          <Layers className="w-5 h-5 text-indigo-700 animate-pulse" />
                          Jornada de Maturidade em Governança de TI
                        </h3>
                        <p className="text-slate-400 text-xs sm:text-sm">
                          Progressão estruturada do Caótico ao Otimizado, conectando evidências operacionais a marcos estratégicos (CMMI).
                        </p>
                      </div>
                      <div className="bg-indigo-50 border border-indigo-150 rounded-full px-4 py-2 text-xs font-bold text-indigo-950 flex items-center gap-2 shrink-0">
                        <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                        Nível Estimado NeoCredit: <strong className="text-indigo-800 text-sm">Estágio 4 (Gerenciado)</strong>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Timeline Grid representing Image 2 */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {[
                      { l: 1, title: "Diagnóstico", sub: "Reativo", focus: "Onde estamos?", desc: "Entender o cenário atual, as dores de rede, riscos e mapear vazamentos.", deliverable: "Relatório de diagnóstico (As-Is)", bg: "border-rose-200 bg-rose-50/50 text-rose-800" },
                      { l: 2, title: "Definição", sub: "Básico", focus: "Onde queremos chegar?", desc: "Definir o estado desejado, comitês de governança e controles básicos.", deliverable: "Estado desejado (To-Be)", bg: "border-blue-200 bg-blue-50/50 text-blue-800" },
                      { l: 3, title: "Gap Analysis", sub: "Padronizado", focus: "Qual a diferença?", desc: "Identificar as lacunas técnicas e documentar políticas de segurança.", deliverable: "Plano de lacunas (Prioridades)", bg: "border-emerald-200 bg-emerald-50/50 text-emerald-800" },
                      { l: 4, title: "Plano de Ação", sub: "Gerenciado", focus: "Como vamos evoluir?", desc: "Priorizar iniciativas de TI com base em impacto financeiro e esforço humano.", deliverable: "Plano de ação (Quick wins + Projetos)", bg: "border-amber-200 bg-amber-50/50 text-amber-800" },
                      { l: 5, title: "Execução & Evolução", sub: "Otimizado", focus: "Como manter e melhorar?", desc: "Executar o plano, monitorar conformidade (Audit) e promover melhoria contínua.", deliverable: "Resultados e melhoria contínua", bg: "border-indigo-200 bg-indigo-50/50 text-indigo-800" }
                    ].map((step) => {
                      const isActive = activeMaturityLevel === step.l;
                      const isRealCurrent = step.l === 4;
                      return (
                        <div 
                          key={step.l}
                          onClick={() => {
                            setActiveMaturityLevel(step.l);
                            triggerNotification(`Visualizando detalhes do Nível ${step.l}: ${step.title}`, "info");
                          }}
                          className={`border rounded-3xl p-5 shadow-sm transition-all text-left cursor-pointer relative ${
                            isActive 
                              ? "bg-white border-slate-900 ring-2 ring-slate-950 scale-[1.02]" 
                              : "bg-white/40 hover:bg-white border-slate-200/85 hover:border-slate-350"
                          }`}
                        >
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-[9px] font-bold font-mono tracking-wider bg-slate-100 border border-slate-200 text-slate-500 rounded-full py-0.5 px-2">
                              Passo {step.l}
                            </span>
                            {isRealCurrent && (
                              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-sm animate-bounce">
                                NeoCredit
                              </span>
                            )}
                          </div>
                          
                          <strong className="text-sm font-bold text-slate-900 block">{step.title}</strong>
                          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mt-0.5">{step.sub}</span>
                          
                          <p className="text-slate-500 text-[11px] leading-relaxed mt-2.5 line-clamp-3 font-semibold">{step.desc}</p>
                          
                          <div className="border-t border-slate-100 mt-3 pt-3">
                            <span className="text-[9px] font-bold text-slate-400 block uppercase">Entregável Chave:</span>
                            <span className="text-[10px] text-slate-700 font-extrabold block mt-0.5 truncate">{step.deliverable}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Level Explorer pane representing bottom row list of Image 2 */}
                  {(() => {
                    const stepDetails = [
                      {
                        l: 1, 
                        title: "Estágio 1: DIAGNÓSTICO (Caótico / Reativo)", 
                        p: "A organização atua de forma reativa frente a desastres e falhas técnicas. Não há roteiros formais de rollback, os acessos não têm controle estruturado e as métricas inexistem ou estão desalinhadas ao negócio.", 
                        evidences: [
                          "Ausência de comitês representativos homologados.",
                          "Ações motivadas por crises súbitas (fogo tático).",
                          "Disponibilidade flutuante sem métricas de SLA transparentes."
                        ],
                        neoStatus: "Superado pelo NeoCredit em rodadas anteriores de auditoria selvagem."
                      },
                      {
                        l: 2, 
                        title: "Estágio 2: DEFINIÇÃO (Básico / Processos Iniciais)", 
                        p: "Os comitês táticos e operacionais começam a ser esboçados. A gerência entende a necessidade de se aproximar dos riscos de privacidade corporativos, porém grande parte das ações permanece dependente do esforço heróico das lideranças técnicas individuais.", 
                        evidences: [
                          "Criação das primeiras políticas e declarações da PSI.", 
                          "Definição conceitual de quem é o DPO da cooperativa.",
                          "Mapeamento primário de chaves Pix e bases sensíveis."
                        ],
                        neoStatus: "Superado. NeoCredit possui comitês integrados ativos (CSIP, CRI e CAB)."
                      },
                      {
                        l: 3, 
                        title: "Estágio 3: GAP ANALYSIS (Padronizado / Processos Definidos)", 
                        p: "Os processos estão formalmente definidos e integrados aos padrões do mercado corporativo (ITIL, COBIT e ISO). A conformidade regulatória se torna mais sistemática, delineando exatamente onde faltam evidências técnicas.", 
                        evidences: [
                          "Elaboração de matrizes RACI formais para auditoria.",
                          "Documentação de controles de redes e criptografia.",
                          "Diagnósticos periódicos em tempo de homologação."
                        ],
                        neoStatus: "Superado. NeoCredit formalizou políticas operacionais e controles ISO aplicados."
                      },
                      {
                        l: 4, 
                        title: "Estágio 4: PLANO DE AÇÃO (Gerenciado / Métricas e Controle) • STATUS NEOCREDIT", 
                        p: `Métricas de infraestrutura crítica, segurança cibernética e incidentes estão em constante acompanhamento. O retorno de investimento de segurança cibernética (ROSI) é calculado ativamente e as prioridades técnicas são validadas de forma orientada a dados pelo conselho regulador.`, 
                        evidences: [
                          `Uptime de APIs transacionais monitoradas ao vivo em ${metrics.uptime}%.`,
                          `Controle estrito de alterações técnicas de redes com ${metrics.changes}% de RFCs estruturadas.`,
                          "Calibração financeira de impacto potencial x investimento em blindagem cibernética."
                        ],
                        neoStatus: "Ativo. O NeoCredit lidera com destaque esta classe tática e foca no refino contínuo do fator humano."
                      },
                      {
                        l: 5, 
                        title: "Estágio 5: EXECUÇÃO & EVOLUÇÃO (Otimizado / Melhoria Contínua)", 
                        p: "Nível máximo de maturidade. A governança e as metodologias de mitigação de conformidade estão de fato incorporadas na cultura corporativa de ponta a ponta. A automação integral de inventários e anticorpos cibernéticos contra vazamentos espontâneos blindam o ecossistema com melhoria contínua.", 
                        evidences: [
                          "Processos de auditoria em nuvem inteiramente integrados e monitorados em tempo real.",
                          "Conscientização contínua e mitigação automatizada contra Phishing (fator humano auditado).",
                          "Medição constante de eficácia cibernética em parceria ativa com o board executivo."
                        ],
                        neoStatus: "Meta Reguladora. Para atingir o Nível 5 definitivo, o NeoCredit precisa calibrar o treinamento corporativo para 100% e finalizar o inventário ITAM."
                      }
                    ].find(d => d.l === activeMaturityLevel) || { title: "", p: "", evidences: [], neoStatus: "" };

                    return (
                      <div className="bg-slate-50 border border-slate-150 rounded-3xl p-6 sm:p-8 space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
                          <div>
                            <span className="text-[10px] font-bold font-mono text-indigo-700 block uppercase">Ficha técnica do nível selecionado:</span>
                            <h4 className="text-base sm:text-lg font-bold text-slate-900">{stepDetails.title}</h4>
                          </div>
                          <span className="text-xs font-bold text-slate-400 italic">Evidências Regulatórias</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs leading-relaxed">
                          <div className="md:col-span-2 space-y-3.5">
                            <strong className="text-slate-800 font-extrabold block">Descrição do Estágio Corporativo:</strong>
                            <p className="text-slate-650 font-medium leading-relaxed">{stepDetails.p}</p>
                            
                            <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-2xl">
                              <strong className="text-indigo-900 font-extrabold block mb-1">Status NeoCredit neste marco:</strong>
                              <p className="text-indigo-950 font-bold text-[11px] leading-relaxed">{stepDetails.neoStatus}</p>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <strong className="text-slate-800 font-extrabold block">Exigências & Evidências Fundamentais:</strong>
                            <ul className="space-y-2.5">
                              {stepDetails.evidences.map((ev, i) => (
                                <li key={i} className="flex gap-2.5 items-start">
                                  <span className="p-0.5 bg-emerald-100 text-emerald-700 border border-emerald-200 rounded mt-0.5 shrink-0">
                                    <Check className="w-3 h-3" />
                                  </span>
                                  <span className="text-slate-600 font-semibold text-[11px] leading-relaxed">{ev}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </motion.div>
              )}

              {complianceSubTab === "gov_vs_mgmt" && (
                <motion.div
                  key="gov_vs_mgmt"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  {/* Title block */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-blue-950 flex items-center gap-2">
                      <Sliders className="w-5 h-5 text-indigo-700" />
                      A Fronteira entre Governança & Gestão de TI (COBIT & ISO)
                    </h3>
                    <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-4xl">
                      Regência estrutural do NeoCredit. A <strong>Governança de TI</strong> direciona regras estratégicas, decide orçamentos e monitora resultados, enquanto a <strong>Gestão de TI</strong> planeja, constrói e opera soluções táticas no dia a dia.
                    </p>
                  </div>

                  {/* Side-by-Side Comparison matching Image 4 */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Governança Column */}
                    <div className="bg-white border-2 border-blue-900 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 relative overflow-hidden transition-all hover:shadow-md">
                      <div className="absolute top-0 right-0 bg-blue-900 text-white text-[10px] font-extrabold px-3 py-1 rounded-bl-xl uppercase tracking-widest leading-none">
                        Direciona e Monitora
                      </div>

                      <div className="space-y-2 pt-2">
                        <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">Atuação Estratégica Executiva</span>
                        <h4 className="text-lg sm:text-xl font-extrabold text-blue-950 flex items-center gap-2">
                          Governança de TI
                        </h4>
                        <p className="text-slate-400 text-xs sm:text-xs font-semibold">
                          Foco: Estabelecer rumos empresariais de longo prazo, dezenas de políticas e limites de risco.
                        </p>
                      </div>

                      <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl flex items-center justify-between gap-4">
                        <div className="space-y-0.5">
                          <span className="text-[10px] uppercase text-blue-800 font-bold block">Conselho e Comitês:</span>
                          <strong className="text-xs text-blue-950 font-extrabold">Quem Faz: Board Executivo, CSIP & CRI</strong>
                        </div>
                        <span className="p-2 bg-white rounded-xl text-blue-800 shrink-0">
                          <Users className="w-4.5 h-4.5 text-blue-800" />
                        </span>
                      </div>

                      <div className="space-y-4">
                        <strong className="text-xs font-extrabold text-slate-850 block border-b border-slate-100 pb-2">Atividades e Escopo de Ação:</strong>
                        
                        <div className="space-y-3.5">
                          {[
                            { title: "Define Roteiros e Prioridades", tech: "Alinha integralmente as metas e limites de liberação de crédito aos recursos de redes e nuvem instalados.", d: "Estratégica" },
                            { title: "Avalia Riscos e Oportunidades", tech: "Mapeia ameaças cibernéticas para evitar multas de até R$ 50M e mitiga impactos antes do Board corporativo.", d: "Controle" },
                            { title: "Aprova Políticas e Investimentos", tech: "Arbitra orçamentos ROSI, limites de segurança de autenticação de servidores e homologa diretrizes fundamentais.", d: "Normatividade" },
                            { title: "Monitora Desempenho e Resultados", tech: "Exige que gerentes e engenheiros forneçam evidências técnicas com prestação de contas do Uptime do Pix.", d: "Auditoria" }
                          ].map((act, i) => (
                            <div key={i} className="flex gap-3 items-start text-xs font-medium">
                              <span className="p-1 px-1.5 bg-blue-100 text-blue-900 font-extrabold border border-blue-250 rounded mt-0.5 shrink-0 leading-none">
                                {i+1}
                              </span>
                              <div>
                                <strong className="text-slate-900 block">{act.title}</strong>
                                <span className="text-slate-500 text-[11px] leading-relaxed block mt-0.5 font-semibold">{act.tech}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Gestão Column */}
                    <div className="bg-white border-2 border-emerald-750 border-emerald-600 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 relative overflow-hidden transition-all hover:shadow-md">
                      <div className="absolute top-0 right-0 bg-emerald-700 text-white text-[10px] font-extrabold px-3 py-1 rounded-bl-xl uppercase tracking-widest leading-none">
                        Planeja, Constrói e Opera
                      </div>

                      <div className="space-y-2 pt-2">
                        <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Atuação Tática Operacional</span>
                        <h4 className="text-lg sm:text-xl font-extrabold text-slate-950 flex items-center gap-2">
                          Gestão de TI
                        </h4>
                        <p className="text-slate-400 text-xs sm:text-xs">
                          Foco: Executar, apoiar e implementar o plano homologado pela diretoria corporativa do NeoCredit.
                        </p>
                      </div>

                      <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-2xl flex items-center justify-between gap-4">
                        <div className="space-y-0.5">
                          <span className="text-[10px] uppercase text-emerald-800 font-bold block">Liderança Operacional:</span>
                          <strong className="text-xs text-emerald-950 font-extrabold font-bold">Quem Faz: CIO, Gerentes de Software e DevSecOps</strong>
                        </div>
                        <span className="p-2 bg-white rounded-xl text-emerald-800 shrink-0">
                          <Briefcase className="w-4.5 h-4.5 text-emerald-800" />
                        </span>
                      </div>

                      <div className="space-y-4">
                        <strong className="text-xs font-extrabold text-slate-850 block border-b border-slate-100 pb-2">Atividades e Escopo de Ação:</strong>
                        
                        <div className="space-y-3.5">
                          {[
                            { title: "Planeja e Executa Sprints", tech: "Organiza as sprints técnicas de 90 dias estruturais, corrigindo lacunas e submetendo RFCs ao CAB.", d: "Tático" },
                            { title: "Opera e Mantém a Infraestrutura", tech: "Configura backups automatizados, georreplicação em nuvem e blindagem ativa de bases de gateways.", d: "Sustentação" },
                            { title: "Suporta Usuários e Chamados", tech: "Trata incidentes de segurança cibernética e restabelece conexões de cooperados com rapidez diagnóstica.", d: "Atendimento" },
                            { title: "Mete Eficiência Técnica (SLA)", tech: "Fornece monitoramento de Uptime diário e garante a entrega ágil de códigos de banco de dados homologados.", d: "Métricas" }
                          ].map((act, i) => (
                            <div key={i} className="flex gap-3 items-start text-xs font-medium">
                              <span className="p-1 px-1.5 bg-emerald-100 text-emerald-900 font-extrabold border border-emerald-250 rounded mt-0.5 shrink-0 leading-none">
                                {i+1}
                              </span>
                              <div>
                                <strong className="text-slate-900 block">{act.title}</strong>
                                <span className="text-slate-500 text-[11px] leading-relaxed block mt-0.5 font-semibold">{act.tech}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Relationship and Communication cycle representing bottom panel of Image 4 */}
                  <div className="bg-slate-50 border border-slate-150 rounded-3xl p-6 sm:p-8 space-y-6">
                    <div className="text-center space-y-1">
                      <strong className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest block">Feedback Loop Integrado</strong>
                      <h4 className="text-base sm:text-lg font-bold text-slate-900">Relacionamento & Fluxo de Alinhamento Contínuo (Governança ⇄ Gestão)</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-xs leading-relaxed text-center font-medium">
                      
                      <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm space-y-2 relative">
                        <div className="text-[10px] font-extrabold text-blue-800 bg-blue-50 border border-blue-100 rounded-full py-0.5 px-2.5 w-max mx-auto">
                          Governança
                        </div>
                        <strong className="text-slate-900 block text-xs mt-1">1. Orienta & Provê (Diretrizes)</strong>
                        <p className="text-slate-500 text-[11px] leading-relaxed font-semibold">
                          Define as metas de Uptime mínimas, estipula diretrizes de conformidade, desenha apetites a risco e libera verba em blindagem cibernética baseada no ROSI%.
                        </p>
                        <div className="hidden md:block absolute top-1/2 -right-5 -translate-y-1/2 z-20 bg-indigo-650 bg-indigo-600 text-white rounded-full p-1 border-2 border-white shadow-sm">
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-indigo-50 to-blue-50/50 border border-indigo-100 p-5 rounded-2xl shadow-inner space-y-2">
                        <div className="text-[10px] font-extrabold text-indigo-800 bg-white border border-indigo-150 rounded-full py-0.5 px-2.5 w-max mx-auto animate-pulse">
                          Alinhamento Contínuo
                        </div>
                        <strong className="text-slate-950 block text-xs mt-1">Conexão via Comitês & CAB</strong>
                        <p className="text-indigo-900 text-[11px] leading-relaxed font-semibold">
                          As RFCs técnicas de liberação segura de infraestrutura de crédito são avaliadas pelo CAB, conectando prioridades operacionais às restrições do conselho CSIP.
                        </p>
                      </div>

                      <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm space-y-2 relative">
                        <div className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-full py-0.5 px-2.5 w-max mx-auto">
                          Gestão
                        </div>
                        <strong className="text-slate-900 block text-xs mt-1">2. Reporta & Monitora (Evidência)</strong>
                        <p className="text-slate-500 text-[11px] leading-relaxed font-semibold">
                          Executa as sprints táticas de 90 dias, trata os incidentes restabelecendo as APIs e reporta ao Conselho as evidências vivas de conformidade e logs auditáveis.
                        </p>
                        <div className="hidden md:block absolute top-1/2 -left-5 -translate-y-1/2 z-20 bg-indigo-600 text-white rounded-full p-1 border-2 border-white shadow-sm">
                          <RotateCcw className="w-3.5 h-3.5" />
                        </div>
                      </div>

                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {activeTab === "bsc" && (
            <motion.div
              key="bsc"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* BSC Explanation */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
                <div className="flex justify-between items-start border-b border-slate-100 pb-5">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-950 flex items-center gap-2">
                      <Compass className="w-6 h-6 text-blue-800 animate-spin-slow" />
                      Balanced Scorecard do NeoCredit (BSC Corporativo)
                    </h3>
                    <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
                      Nosso Balanced Scorecard alinha o plano estratégico e os parâmetros executivos com o progresso dinâmico de TI. Os valores e sinais luminosos abaixo reagem automaticamente à calibragem de sliders no Dashboard Geral em tempo real.
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-slate-300" />
                </div>

                {/* BSC Matrix */}
                <div className="space-y-6 mt-6">
                  {["Financeira", "Cliente", "Interna", "Aprendizagem"].map((perspective) => {
                    const items = BSC_OBJECTIVES.filter(o => o.perspective.startsWith(perspective));
                    return (
                      <div key={perspective} className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                        
                        {/* Perspective Header */}
                        <div className="bg-slate-50 border-b border-slate-100 p-4 font-extrabold text-slate-800 uppercase text-xs tracking-wider flex justify-between">
                          <span>Perspectiva {perspective}</span>
                          <span className="text-slate-400 text-[10px] font-normal lowercase tracking-normal">Objetivos Estratégicos</span>
                        </div>

                        {/* Objectives rows */}
                        <div className="divide-y divide-slate-100 bg-white">
                          {items.map((obj) => {
                            const result = obj.currentFormula(metrics);
                            return (
                              <div key={obj.id} className="p-5 flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between hover:bg-slate-50/30 transition">
                                <div className="flex-1 space-y-1.5">
                                  <h4 className="font-bold text-slate-900 text-sm leading-snug">
                                    {obj.objective}
                                  </h4>
                                  <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
                                    <span>KPI: <strong className="text-slate-600 font-semibold">{obj.kpiName}</strong></span>
                                    <span>•</span>
                                    <span>Meta Comercial: <strong className="text-slate-600 font-semibold">{obj.meta}</strong></span>
                                  </div>
                                  <p className="text-xs text-slate-500 leading-relaxed pt-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100 shadow-inner">
                                    <strong className="text-slate-600 block text-[10px] uppercase font-bold tracking-wider mb-0.5">Iniciativa de TI Recomendada:</strong>
                                    {obj.initiative}
                                  </p>
                                </div>

                                <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between sm:justify-end gap-3 w-full lg:w-auto shrink-0 border-t lg:border-t-0 border-slate-100 pt-4 lg:pt-0">
                                  <div className="flex items-center gap-2">
                                    <span className={`w-3.5 h-3.5 rounded-full inline-block animate-ping absolute ${
                                      result.status === "success" ? "bg-emerald-500" :
                                      result.status === "warning" ? "bg-amber-500" : "bg-rose-500"
                                    }`}></span>
                                    <span className={`w-3.5 h-3.5 rounded-full inline-block relative ${
                                      result.status === "success" ? "bg-emerald-500" :
                                      result.status === "warning" ? "bg-amber-500" : "bg-rose-500"
                                    }`}></span>
                                    <span className={`text-xs font-bold ${
                                      result.status === "success" ? "text-emerald-700" :
                                      result.status === "warning" ? "text-amber-700" : "text-rose-700"
                                    }`}>
                                      {result.status === "success" ? "Verde (Meta Almejada)" :
                                       result.status === "warning" ? "Amarelo (Atenção)" : "Vermelho (Crítico)"}
                                    </span>
                                  </div>
                                  <div className="text-left lg:text-right mt-1">
                                    <span className="text-sm font-extrabold text-slate-900">
                                      {result.value}
                                    </span>
                                    <p className="text-[10px] text-slate-400 font-semibold block">Valor no Modelo Dinâmico</p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "roadmap" && (
            <motion.div
              key="roadmap"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Timeline intro */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-6 mb-6">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-950 flex items-center gap-2">
                      <Calendar className="w-6 h-6 text-indigo-700" />
                      Plano de Implementação de Governança de 90 Dias
                    </h3>
                    <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
                      Acompanhe o cronograma planejado e marque o status de conclusão das etapas de estruturação para simular com precisão a maturidade corporativa do NeoCredit.
                    </p>
                  </div>
                  <div className="text-right self-start sm:self-center shrink-0">
                    <span className="text-2xl font-extrabold text-indigo-800 block">
                      {roadmapProgress}%
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Maturação Geral</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="bg-slate-100 w-full h-3 rounded-full overflow-hidden shadow-inner mb-8">
                  <div 
                    className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${roadmapProgress}%` }}
                  ></div>
                </div>

                {/* Interactive Gantt Chart Section */}
                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 mb-8">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-0.5">
                      <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-indigo-700 animate-pulse" />
                        Cronograma Interativo de Gantt (Visualização de 12 Semanas)
                      </h4>
                      <p className="text-slate-500 text-xs sm:text-xs font-semibold">
                        Clique em qualquer barra do cronograma para alternar o status de conclusão da tarefa e ver as atualizações em tempo real.
                      </p>
                    </div>
                    {/* Gantt Legend */}
                    <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 bg-blue-600 rounded border border-blue-500"></span>
                        <span className="text-slate-500 text-[11px]">Mês 1 (Diagnóstico)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 bg-amber-500 rounded border border-amber-400"></span>
                        <span className="text-slate-500 text-[11px]">Mês 2 (Controles)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 bg-emerald-500 rounded border border-emerald-400"></span>
                        <span className="text-slate-500 text-[11px]">Mês 3 (Maturidade)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 bg-slate-100 rounded border border-dashed border-slate-300"></span>
                        <span className="text-slate-450 text-[11px]">Planejado / Fila</span>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200 p-4 bg-slate-50/50">
                    <div className="min-w-[840px] space-y-3">
                      {/* Timeline Header Week Labels */}
                      <div className="flex items-center text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider pb-3 border-b border-slate-200">
                        <div className="w-[300px] shrink-0 font-sans text-xs text-slate-600 pl-2">Iniciativa / Responsável</div>
                        <div className="flex-1 grid grid-cols-12 gap-2 text-center">
                          {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="py-1 bg-white border border-slate-150 rounded-lg shadow-sm text-slate-500">
                              Semana {i + 1}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Gantt Rows */}
                      {roadmap.map((task) => {
                        const GANTT_MAPPING: Record<string, { start: number; duration: number; color: string; border: string }> = {
                          "task-1-1": { start: 1, duration: 2, color: "bg-blue-600 hover:bg-blue-700 text-blue-100", border: "border-blue-500" },
                          "task-1-2": { start: 2, duration: 2, color: "bg-blue-600 hover:bg-blue-700 text-blue-100", border: "border-blue-500" },
                          "task-1-3": { start: 3, duration: 2, color: "bg-blue-600 hover:bg-blue-700 text-blue-100", border: "border-blue-500" },
                          "task-2-1": { start: 5, duration: 2, color: "bg-amber-500 hover:bg-amber-600 text-amber-50", border: "border-amber-400" },
                          "task-2-2": { start: 6, duration: 2, color: "bg-amber-500 hover:bg-amber-600 text-amber-50", border: "border-amber-400" },
                          "task-2-3": { start: 7, duration: 2, color: "bg-amber-500 hover:bg-amber-600 text-amber-50", border: "border-amber-400" },
                          "task-3-1": { start: 9, duration: 2, color: "bg-emerald-500 hover:bg-emerald-600 text-emerald-50", border: "border-emerald-400" },
                          "task-3-2": { start: 11, duration: 2, color: "bg-emerald-500 hover:bg-emerald-600 text-emerald-50", border: "border-emerald-400" },
                        };
                        const itemMap = GANTT_MAPPING[task.id] || { start: 1, duration: 2, color: "bg-slate-400", border: "border-slate-500" };
                        
                        return (
                          <div key={task.id} className="flex items-center text-xs font-semibold hover:bg-white/80 p-2 rounded-xl transition-all">
                            {/* Task Info Label on the Left */}
                            <div className="w-[300px] shrink-0 pr-4 flex items-center gap-2.5">
                              <button 
                                id={`btn-gantt-check-${task.id}`}
                                onClick={() => {
                                  toggleRoadmapTask(task.id);
                                  triggerNotification(`${task.completed ? "Pendente:" : "Concluído:"} ${task.title.substring(0, 30)}...`, "success");
                                }}
                                className={`p-1 rounded-lg border transition-all cursor-pointer ${
                                  task.completed 
                                    ? "bg-emerald-100 border-emerald-300 text-emerald-700" 
                                    : "bg-white border-slate-200 text-slate-300 hover:border-slate-300 hover:bg-slate-50"
                                }`}
                              >
                                <Check className="w-3 h-3" />
                              </button>
                              <div className="truncate flex-1">
                                <p 
                                  onClick={() => {
                                    toggleRoadmapTask(task.id);
                                    triggerNotification(`Tarefa: ${task.title}`, "info");
                                  }}
                                  className={`text-slate-800 text-[11px] leading-tight truncate cursor-pointer ${
                                    task.completed ? "line-through text-slate-400 font-normal" : "font-extrabold"
                                  }`}
                                  title={task.title}
                                >
                                  {task.title}
                                </p>
                                <span className="text-[9px] text-slate-450 font-mono font-bold block uppercase mt-0.5">
                                  Resp: {task.assignedRole} • {task.duration}
                                </span>
                              </div>
                            </div>

                            {/* Gantt Bar on the Right CSS Grid */}
                            <div className="flex-1 grid grid-cols-12 gap-2 h-8 relative">
                              {/* Backgrid columns background */}
                              {Array.from({ length: 12 }).map((_, i) => (
                                <div key={i} className="border-r border-slate-200/50 h-full last:border-r-0"></div>
                              ))}
                              
                              {/* Actual Task bar block spanned on the grid */}
                              <div
                                id={`gantt-bar-${task.id}`}
                                onClick={() => {
                                  toggleRoadmapTask(task.id);
                                  triggerNotification(`Atualizou tarefa: ${task.title.substring(0, 35)}...`, "success");
                                }}
                                style={{
                                  gridColumnStart: itemMap.start,
                                  gridColumnEnd: `span ${itemMap.duration}`,
                                }}
                                className={`absolute top-0.5 bottom-0.5 rounded-full px-3.5 flex items-center justify-between text-[9px] font-bold shadow-sm cursor-pointer transition-all hover:scale-[1.01] hover:shadow-md ${
                                  task.completed
                                    ? `${itemMap.color} ${itemMap.border} border text-white`
                                    : "bg-white text-slate-500 border border-slate-200 border-dashed hover:border-slate-300"
                                }`}
                                title={`${task.title} | Responsável: ${task.assignedRole} | Duração: ${task.duration} (${task.completed ? "Concluído" : "Não Iniciado"})`}
                              >
                                <span className="truncate pr-2">{task.completed ? "✓ " + task.duration : "⏳ " + task.duration}</span>
                                <span className="shrink-0 text-[8px] uppercase px-1.5 py-0.2 rounded-full font-mono bg-black/10">
                                  {task.completed ? "OK" : "FILA"}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-450 font-semibold italic text-center mt-2 block">
                    Dica: Você pode interagir com o cronograma clicando diretamente nas barras do Gantt ou nos checkboxes das tarefas! Sua simulação de maturidade mudará instantaneamente!
                  </p>
                </div>

                {/* Timeline steps columns */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Phase 1 */}
                  <div className="space-y-4">
                    <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4">
                      <span className="text-[10px] font-bold text-blue-800 uppercase tracking-widest block font-mono">
                        Mês 1 (Dias 1 a 30)
                      </span>
                      <h4 className="font-extrabold text-slate-900 mt-1 text-sm sm:text-base">Diagnóstico & PSI Inicial</h4>
                    </div>

                    <div className="space-y-3">
                      {roadmap.filter(t => t.phaseId === "phase1").map(task => (
                        <div 
                          key={task.id}
                          onClick={() => toggleRoadmapTask(task.id)}
                          className={`p-4 border rounded-2xl cursor-pointer transition-all ${
                            task.completed 
                              ? "bg-slate-50 border-blue-200 text-slate-500 text-xs" 
                              : "bg-white hover:bg-slate-50 border-slate-200 text-slate-800 text-xs"
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <div className={`p-0.5 rounded mt-0.5 shrink-0 ${task.completed ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-300"}`}>
                              <Check className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex-1">
                              <p className={`font-semibold text-xs leading-snug ${task.completed ? "line-through text-slate-450" : "text-slate-800"}`}>
                                {task.title}
                              </p>
                              <div className="flex justify-between items-center text-[9px] font-bold tracking-wider text-slate-400 mt-2">
                                <span>{task.duration}</span>
                                <span>Responsabilidade: {task.assignedRole}</span>
                              </div>
                              <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed bg-slate-55 p-2 rounded-lg border border-slate-100 bg-slate-100/40">
                                {task.details}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Phase 2 */}
                  <div className="space-y-4 col-span-1">
                    <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4">
                      <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest block font-mono">
                        Mês 2 (Dias 31 a 60)
                      </span>
                      <h4 className="font-extrabold text-slate-900 mt-1 text-sm sm:text-base">Controles Técnicos Ativos</h4>
                    </div>

                    <div className="space-y-3">
                      {roadmap.filter(t => t.phaseId === "phase2").map(task => (
                        <div 
                          key={task.id}
                          onClick={() => toggleRoadmapTask(task.id)}
                          className={`p-4 border rounded-2xl cursor-pointer transition-all ${
                            task.completed 
                              ? "bg-slate-50 border-amber-200 text-slate-500 text-xs" 
                              : "bg-white hover:bg-slate-50 border-slate-200 text-slate-800 text-xs"
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <div className={`p-0.5 rounded mt-0.5 shrink-0 ${task.completed ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-300"}`}>
                              <Check className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex-1">
                              <p className={`font-semibold text-xs leading-snug ${task.completed ? "line-through text-slate-450" : "text-slate-800"}`}>
                                {task.title}
                              </p>
                              <div className="flex justify-between items-center text-[9px] font-bold tracking-wider text-slate-400 mt-2">
                                <span>{task.duration}</span>
                                <span>Responsabilidade: {task.assignedRole}</span>
                              </div>
                              <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed bg-slate-55 p-2 rounded-lg border border-slate-100 bg-slate-100/40">
                                {task.details}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Phase 3 */}
                  <div className="space-y-4 col-span-1">
                    <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest block font-mono">
                        Mês 3 (Dias 61 a 90)
                      </span>
                      <h4 className="font-extrabold text-slate-900 mt-1 text-sm sm:text-base">Maturidade & Auditorias</h4>
                    </div>

                    <div className="space-y-3">
                      {roadmap.filter(t => t.phaseId === "phase3").map(task => (
                        <div 
                          key={task.id}
                          onClick={() => toggleRoadmapTask(task.id)}
                          className={`p-4 border rounded-2xl cursor-pointer transition-all ${
                            task.completed 
                              ? "bg-slate-50 border-emerald-200 text-slate-500 text-xs" 
                              : "bg-white hover:bg-slate-50 border-slate-200 text-slate-800 text-xs"
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <div className={`p-0.5 rounded mt-0.5 shrink-0 ${task.completed ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-300"}`}>
                              <Check className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex-1">
                              <p className={`font-semibold text-xs leading-snug ${task.completed ? "line-through text-slate-450" : "text-slate-800"}`}>
                                {task.title}
                              </p>
                              <div className="flex justify-between items-center text-[9px] font-bold tracking-wider text-slate-400 mt-2">
                                <span>{task.duration}</span>
                                <span>Responsabilidade: {task.assignedRole}</span>
                              </div>
                              <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed bg-slate-55 p-2 rounded-lg border border-slate-100 bg-slate-100/40">
                                {task.details}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "asis_tobe" && (
            <motion.div
              key="asis_tobe"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* As-Is vs To-Be Header */}
              <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-lg">
                <div className="relative z-10 space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-[10px] sm:text-xs font-bold text-indigo-400 uppercase tracking-wider">
                    <RefreshCw className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    Transição & Alvo de Governança NeoCredit
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-sans">Análise de Transição: As-Is / To-Be</h3>
                  <p className="text-slate-200 text-xs sm:text-sm max-w-4xl leading-relaxed">
                    Compare de forma iterativa e detalhada a evolução operacional do NeoCredit. Entenda o estado inicial do ecossistema (As-Is), identifique as lacunas de segurança/conformidade (Gaps) e visualize o estado futuro de conformidade e governança de alta performance (To-Be) que nossa plataforma já está alcançando.
                  </p>
                </div>
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full filter blur-3xl translate-x-12 -translate-y-12"></div>
              </div>

              {/* Visual Performance Metrics: Radar Chart Comparison */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Radar Chart Panel */}
                <div className="lg:col-span-1 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                  <div className="space-y-1">
                    <h4 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <TrendingUp className="w-4.5 h-4.5 text-indigo-700" />
                      Radar de Maturidade Governamental
                    </h4>
                    <p className="text-slate-400 text-[11px] font-semibold leading-relaxed">
                      Comparação quantitativa de desempenho (%) entre o estado anterior desestruturado e nosso alvo de governança certificada.
                    </p>
                  </div>

                  <div className="h-64 sm:h-72 mt-4 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="75%" data={[
                        { name: "Segurança de Dados", "Anterior": 30, "Futuro": 95 },
                        { name: "Esteira DevOps", "Anterior": 25, "Futuro": 90 },
                        { name: "Gestão Crises", "Anterior": 35, "Futuro": 95 },
                        { name: "COBIT / Governança", "Anterior": 20, "Futuro": 85 },
                        { name: "Fator Humano", "Anterior": 15, "Futuro": 90 },
                      ]}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="name" tick={{ fill: '#475569', fontSize: 9, fontWeight: 700 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8' }} />
                        <Radar name="Estado Anterior" dataKey="Anterior" stroke="#ef4444" fill="#ef4444" fillOpacity={0.15} />
                        <Radar name="Estado Futuro" dataKey="Futuro" stroke="#10b981" fill="#10b981" fillOpacity={0.25} />
                        <RechartsTooltip contentStyle={{ fontSize: 11, borderRadius: 12, border: '1px solid #e2e8f0' }} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="flex justify-center gap-4 text-[10px] font-bold border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 bg-rose-500 rounded-full"></span>
                      <span className="text-rose-600">As-Is (Incipiente)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>
                      <span className="text-emerald-600">To-Be (Gerenciado)</span>
                    </div>
                  </div>
                </div>

                {/* Transition Quick-Wins Checklist */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                  <div className="space-y-1">
                    <h4 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <CheckCircle className="w-4.5 h-4.5 text-indigo-700" />
                      Medidores Reais de Transição (Ação em Tempo Real)
                    </h4>
                    <p className="text-slate-400 text-[11px] font-semibold">
                      Veja o progresso geral e tome ações imediatas nos controles regulatórios e operacionais para migrar do estado reativo ao proativo.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                    {[
                      { 
                        title: "Criptografia de Repouso (Res BCB 4.893)", 
                        status: metrics.encrypt >= 80 ? "Implementado" : "Pendente", 
                        isDone: metrics.encrypt >= 80,
                        action: () => {
                          handleMetricChange("encrypt", metrics.encrypt >= 80 ? 20 : 95);
                          triggerNotification("Criptografia de dados transacionais comutada!", "success");
                        },
                        desc: "Garantia técnica de bases de dados criptografadas contra ataques internos e exfiltrações.",
                        badgeColor: metrics.encrypt >= 80 ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                      },
                      { 
                        title: "Engajamento Cibernético Geral", 
                        status: metrics.training >= 90 ? "Excelente" : "Suficiente", 
                        isDone: metrics.training >= 90,
                        action: () => {
                          handleMetricChange("training", metrics.training >= 90 ? 45 : 100);
                          triggerNotification("Simulação de treinamento massivo comutada!", "success");
                        },
                        desc: "Letramento digital de phishing e privacidade de dados para colaboradores técnicos.",
                        badgeColor: metrics.training >= 90 ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                      },
                      { 
                        title: "Aprovação de Mudanças via CAB", 
                        status: metrics.changes >= 85 ? "Sistemática" : "Manual/Parcial", 
                        isDone: metrics.changes >= 85,
                        action: () => {
                          handleMetricChange("changes", metrics.changes >= 85 ? 40 : 90);
                          triggerNotification("Mapeamento sistemático de aprovações técnicas comutado!", "success");
                        },
                        desc: "Revisão formal de pacotes operacionais para deploys em nuvem sem fricção ou quedas.",
                        badgeColor: metrics.changes >= 85 ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                      },
                      { 
                        title: "Uptime do Pix / Core Bancário", 
                        status: metrics.uptime >= 99.8 ? "SLA Otimizado" : "SLA Perigoso", 
                        isDone: metrics.uptime >= 99.8,
                        action: () => {
                          handleMetricChange("uptime", metrics.uptime >= 99.8 ? 98.7 : 99.98);
                          triggerNotification("Calibração de resiliência e failover ativo!", "success");
                        },
                        desc: "Manutenção da disponibilidade regulamentar de transações financeiras sob qualquer estresse.",
                        badgeColor: metrics.uptime >= 99.8 ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                      }
                    ].map((item, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-150 p-4 rounded-2xl flex flex-col justify-between hover:bg-slate-100/50 transition-all">
                        <div className="space-y-1">
                          <div className="flex justify-between items-start">
                            <strong className="text-[11px] font-bold text-slate-800 leading-snug">{item.title}</strong>
                            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${item.badgeColor}`}>
                              {item.status}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-450 font-semibold leading-relaxed truncate-2-lines">{item.desc}</p>
                        </div>
                        <button
                          onClick={item.action}
                          className={`mt-3 w-full py-1.5 px-3 rounded-xl text-[10px] font-bold border transition-all cursor-pointer text-center ${
                            item.isDone
                              ? "bg-white border-emerald-250 text-emerald-700 hover:bg-emerald-50"
                              : "bg-indigo-600 border-indigo-700 text-white hover:bg-indigo-700 shadow-sm"
                          }`}
                        >
                          {item.isDone ? "✓ Alterar para Baseline anterior" : "⚙️ Forçar Solução Metálica Targets"}
                        </button>
                      </div>
                    ))}
                  </div>

                  <p className="text-[10px] text-slate-400 italic font-semibold text-center border-t border-slate-100 pt-3">
                    As ações acima configuram instantaneamente os KPIs da cooperativa, simulando perfeitamente a mudança estrutural entre as duas realidades.
                  </p>
                </div>
              </div>

              {/* Pillars Navigation for Detailed Comparison */}
              <div className="space-y-4">
                <div className="text-center md:text-left space-y-1">
                  <h4 className="text-base font-extrabold text-slate-900 flex items-center justify-center md:justify-start gap-2">
                    <Layers className="w-5 h-5 text-indigo-700" />
                    Comparativo Detalhado por Pilares Estruturais
                  </h4>
                  <p className="text-slate-400 text-xs font-semibold">
                    Selecione um pilar abaixo para visualizar a análise detalhada "Antes" vs "Depois" e o plano de transição correspondente.
                  </p>
                </div>

                {/* Pill Switchers */}
                <div className="bg-slate-100 border border-slate-200/80 p-2 rounded-2xl flex flex-wrap gap-2 shadow-inner">
                  {[
                    { id: "seguranca", label: "🔒 Segurança & Criptografia", info: "LGPD & BACEN 4893" },
                    { id: "devops", label: "🚀 Esteira DevSecOps & CAB", info: "Gestão de Alterações" },
                    { id: "crise", label: "🔥 Prontidão de Incidentes", info: "Planos de Contingência" },
                    { id: "gob", label: "⚖️ Governança vs Gestão", info: "COBIT & ISO 38500" },
                    { id: "human", label: "👥 Fator Humano & Cultura", info: "Human Firewall" }
                  ].map((pill) => {
                    const isActive = asisTobeActiveDomain === pill.id;
                    return (
                      <button
                        key={pill.id}
                        id={`btn-asistobe-${pill.id}`}
                        onClick={() => {
                          setAsisTobeActiveDomain(pill.id);
                          triggerNotification(`Visualizando pilar de transição: ${pill.label}`, "info");
                        }}
                        className={`flex-1 flex flex-col items-center justify-center py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isActive
                            ? "bg-slate-900 border border-slate-850 text-white shadow-md scale-[1.01]"
                            : "bg-white border border-slate-200 hover:border-slate-350 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span>{pill.label}</span>
                        <span className={`text-[9px] font-mono mt-0.5 ${isActive ? "text-indigo-300" : "text-slate-400 font-bold"}`}>{pill.info}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Comparative Content Block */}
                {(() => {
                  const domainDetails = {
                    seguranca: {
                      title: "Segurança de Dados e Criptografia Regulamentar (Resolução BCB 4.893)",
                      asis: {
                        points: [
                          "Dados cadastrais de candidatos a crédito e históricos financeiros armazenados em texto claro no banco de homologação.",
                          "Políticas frouxas de concessão de privilégios temporários a contratados externos.",
                          "Backups manuais inconsistentes que dependem do script operacional individual de engenharia.",
                          "Inexistência de chaves gerenciadas em nuvem (KMS) ou ferramentas automatizadas de auditoria de logs de leitura."
                        ],
                        risk: "Alta vulnerabilidade a acessos internos não autorizados ou vazamento maciço de dados cadastrais.",
                        compliance: "Não conformidade imediata com o Artigo 46 da LGPD e as normas do BACEN.",
                        flag: "Critical"
                      },
                      tobe: {
                        points: [
                          "Criptografia compulsória de ponta a ponta (AES-256 no repouso e TLS 1.3 em trânsito) com chaves administradas via KMS gerenciado.",
                          "Controle rigoroso de privilégios cibernéticos através de privilégio menor com monitoramento SIEM em tempo real.",
                          "Bases de dados de transações georreplicadas continuamente com rotinas de testes de integridade totalmente automatizados.",
                          "Pistas de auditoria (audit trails) imutáveis que reportam automaticamente acessos suspeitos aos encarregados."
                        ],
                        status: "Aderência irrestrita regulatória, garantindo conformidade jurídica, integridade técnica e transparência.",
                        metric: "95% Security Index",
                        flag: "Certified"
                      },
                      bridge: "A adoção da PSI corporativa sistemática, em conjunto com o mapeamento e inventário LGPD, e a configuração de criptografia de bases transacionais no AWS/GCP KMS."
                    },
                    devops: {
                      title: "Esteira de Integração Segura e Aprovações de Mudanças (ITIL 4 / COBIT)",
                      asis: {
                        points: [
                          "Deploys rápidos diretos em ambientes produtivos executados diretamente por engenheiros em console administrativo.",
                          "Ausência completa de testes automatizados de segurança (SAST / DAST) integrados ao pipeline de desenvolvimento.",
                          "Processos de aprovação informais estruturados em mensagens de texto ou e-mails pontuais por gestores.",
                          "Controle de inventário de ativos (ITAM) obsoleto ou mantido em planilhas compartilhadas estáticas."
                        ],
                        risk: "Alta ocorrência de indisponibilidades em cascata no gateway Pix por códigos sem homologação sistemática.",
                        compliance: "Inexatidão técnica em processos de auditoria estrutural e falhas em due-diligenvce corporativa.",
                        flag: "High"
                      },
                      tobe: {
                        points: [
                          "Processo estrutural robusto onde cada alteração técnica em produção passa pelo crivo formal do comitê CAB.",
                          "Pontes automatizadas de DevOps with varreduras proativas de vulnerabilidades (SAST/DAST) bloqueando códigos reprovados.",
                          "Políticas rígidas onde mudanças de chaves Pix ou liberação de infraestrutura de crédito exigem assinatura criptográfica.",
                          "Inventário de software e hardware em tempo real (ITAM) mapeando automaticamente licenças e vulnerabilidades."
                        ],
                        status: "SLA extremamente estável, eliminação de quedas por erro humano, deploys sistematicamente certificados.",
                        metric: "90% Control Rate",
                        flag: "Compliant"
                      },
                      bridge: "Instauração oficial do comitê CAB e integração de ferramentas SAST/DAST diretamente na esteira automática de CI/CD, além do escaneamento ITAM em andamento."
                    },
                    crise: {
                      title: "Gestão Avançada de Incidentes e Resiliência contra Desastres (ITIL 4 / BCB)",
                      asis: {
                        points: [
                          "Lidado inteiramente de forma reativa com as ações fragmentadas através de conversas desalinhadas.",
                          "Inexistência de playbooks, roteiros pré-definidos de rollback rápido ou infraestruturas alternativas prontas.",
                          "Ausência completa de simulados estruturados de desastres ou relatórios pós-incidente com rastreabilidade de causa raiz (RCA).",
                          "Tempos médios de resolução (MTTR) de crises técnicas indeterminados e sem métricas."
                        ],
                        risk: "Multas incidentais milionárias da ANPD e descredenciamento técnico provisório pelo Banco Central do Brasil.",
                        compliance: "Violação ao dever preventivo e infrações severas ao princípio de segurança da informação.",
                        flag: "Critical"
                      },
                      tobe: {
                        points: [
                          "Comitê de Gestão de Riscos (CRI) e Resposta a Incidentes (CSIP) prontos em escala 24/7 com alarmes corporativos.",
                          "Centralização absoluta de alertas operacionais e logs de infraestrutura para diagnósticos de contenção ágil.",
                          "Realização periódica e compulsória de simulados realistas de crises cibernéticas com reestabelecimento funcional em alta velocidade.",
                          "Estrutura formal de RCA com documentação padronizada na plataforma de conhecimento interna para melhoria contínua."
                        ],
                        status: "Estrutura operacional resiliente a falhas e ataques coordenados, com rápida resposta legal e técnica.",
                        metric: "95% Resiliency",
                        flag: "Optimized"
                      },
                      bridge: "Ativação do simulador prático de controle de ransomwares e criação de playbooks operacionais mapeados para mitigação em canais eficientes do CSIP."
                    },
                    gob: {
                      title: "Alinhamento Estratégico Corporativo de TI: Governança versus Gestão (COBIT)",
                      asis: {
                        points: [
                          "Board e conselho executivo distantes da infraestrutura técnica de TI, vista apenas como elemento gerador de custos áridos.",
                          "Alocação financeira baseada unicamente no urgênciamento da crise diária, sem ponderar sobre riscos.",
                          "Ausência de KPIs de TI mapeados e traduzidos para a governança de metas institucionais (sem indicadores como ROSI).",
                          "Falta de prestação de contas clara (Accountability) gerando redundância e atritos."
                        ],
                        risk: "Decisões desestruturadas comprometendo o crescimento sustentável da cooperativa e desperdício financeiro.",
                        compliance: "Desconexão de metas do negócio às responsabilidades de conformidade governamental.",
                        flag: "Medium"
                      },
                      tobe: {
                        points: [
                          "Governança de TI focada em alinhar estratégias (comitês CRI, CSIP e Diretoria corporativa definindo regras do jogo).",
                          "Gestão de TI robusta operando tecnicamente o dia a dia sob limites formais e métricas corporativas transparentes.",
                          "Cálculo rotineiro de Retorno de Investimento Cibernético (ROSI) para validar e fundamentar novas verbas do conselho.",
                          "Alinhamento total garantindo o crescimento integrado nas esteiras de tomada de decisão de crédito do NeoCredit."
                        ],
                        status: "TI vista como vetor prioritário de transparência ética, segurança aos cooperados e alavanca negocial.",
                        metric: "85% Synergy",
                        flag: "Excellent"
                      },
                      bridge: "Mapeamento sistemático de atribuições via RACI no painel de comitês e auditorias em tempo real pelo painel de Balanced Scorecard (BSC)."
                    },
                    human: {
                      title: "Cultura Cibernética e Blindagem do Fator Humano (People Awareness)",
                      asis: {
                        points: [
                          "Níveis incipientes ou isolados de conscientização de segurança em equipes que não sejam de tecnologia direta.",
                          "Uso inadequado de logins corporativos em ambientes compartilhados e fraco policiamento de senhas.",
                          "Ausência de avaliações, testes preventivos ou campanhas obrigatórias periódicas de letramento digital.",
                          "Sucessivas falhas em auditorias internas de engenharia social focadas em falsas mensagens no correio eletrônico."
                        ],
                        risk: "Vazamento culposo inevitável por clonagem de logins ou credenciais de crédito obtidas por terceiros via phishing.",
                        compliance: "Inobservância contínua às regras básicas da ANPD de mitigação humana em segurança.",
                        flag: "High"
                      },
                      tobe: {
                        points: [
                          "Integração contínua de Segurança Humana (Human Firewall) com letramento exigido a 100% dos cooperados do hub.",
                          "Campanhas constantes de phishing simulado operado pelo RH para aferir o nível de prudência operacional da cooperativa.",
                          "Políticas rígidas e automatizadas de autenticação multifator (MFA) e rotação programada de credenciais administrativas.",
                          "Altos índices de adesão consolidando a segurança como responsabilidade ética de cada colaborador no NeoCredit."
                        ],
                        status: "Vulnerabilidade técnica mitigada na raiz comportamental através de reciclagem contínua e certificada.",
                        metric: "90% Engagement",
                        flag: "Secure"
                      },
                      bridge: "Estruturação periódica de workshops práticos coletivos de privacidade de dados comandados pelo DPO e RH."
                    }
                  }[asisTobeActiveDomain || "seguranca"];

                  return (
                    <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-8">
                      {/* Header block of detailed pillar comparison */}
                      <div>
                        <span className="text-[10px] font-bold font-mono text-indigo-700 uppercase tracking-widest block">Dashboard de Pilar Técnico</span>
                        <h4 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">{domainDetails.title}</h4>
                      </div>

                      {/* As-Is vs To-Be Columns side-by-side */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* AS-IS card */}
                        <div className="bg-white border text-xs leading-relaxed border-rose-150 rounded-2xl p-5 sm:p-6 space-y-4 hover:shadow-sm transition-all relative overflow-hidden">
                          <div className="absolute top-0 right-0 bg-rose-500 text-white text-[9px] font-extrabold px-3 py-1 rounded-bl-xl uppercase tracking-widest leading-none">
                            AS-IS (Anterior)
                          </div>
                          
                          <div className="space-y-1">
                            <span className="text-[9px] font-bold text-rose-500 uppercase block tracking-wider">Cenário Inicial Limítrofe</span>
                            <div className="flex items-center gap-2">
                              <h5 className="text-sm font-extrabold text-rose-950">Gaps e Vulnerabilidades críticas</h5>
                              <span className="bg-rose-100 text-rose-800 text-[8px] font-bold px-1.5 py-0.2 rounded font-mono uppercase shrink-0">
                                {domainDetails.asis.flag}
                              </span>
                            </div>
                          </div>

                          <ul className="space-y-2.5">
                            {domainDetails.asis.points.map((pt, index) => (
                              <li key={index} className="flex gap-2.5 items-start text-slate-600">
                                <span className="p-0.5 bg-rose-50 border border-rose-200 text-rose-600 rounded mt-0.5 shrink-0 font-bold leading-none">
                                  ✖
                                </span>
                                <span className="font-semibold text-slate-600">{pt}</span>
                              </li>
                            ))}
                          </ul>

                          <div className="bg-rose-50 border border-rose-100 p-3.5 rounded-xl text-[11px] leading-relaxed">
                            <strong className="text-rose-900 font-extrabold block mb-0.5">Risco Geral Associado:</strong>
                            <p className="text-rose-950 font-bold leading-relaxed">{domainDetails.asis.risk}</p>
                            <span className="text-[9px] text-rose-800 italic font-medium block mt-1">Regulatório: {domainDetails.asis.compliance}</span>
                          </div>
                        </div>

                        {/* TO-BE card */}
                        <div className="bg-white border text-xs leading-relaxed border-emerald-150 rounded-2xl p-5 sm:p-6 space-y-4 hover:shadow-sm transition-all relative overflow-hidden">
                          <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[9px] font-extrabold px-3 py-1 rounded-bl-xl uppercase tracking-widest leading-none">
                            TO-BE (Alvo)
                          </div>

                          <div className="space-y-1">
                            <span className="text-[9px] font-bold text-emerald-600 uppercase block tracking-wider">Cenário Desejado Otimizado</span>
                            <div className="flex items-center gap-2">
                              <h5 className="text-sm font-extrabold text-emerald-950">Excelência Técnica & Normas</h5>
                              <span className="bg-emerald-100 text-emerald-800 text-[8px] font-bold px-1.5 py-0.2 rounded font-mono uppercase shrink-0">
                                {domainDetails.tobe.flag}
                              </span>
                            </div>
                          </div>

                          <ul className="space-y-2.5">
                            {domainDetails.tobe.points.map((pt, index) => (
                              <li key={index} className="flex gap-2.5 items-start text-slate-600">
                                <span className="p-0.5 bg-emerald-50 border border-emerald-250 text-emerald-600 rounded mt-0.5 shrink-0 font-bold leading-none">
                                  ✔
                                </span>
                                <span className="font-semibold text-slate-600">{pt}</span>
                              </li>
                            ))}
                          </ul>

                          <div className="bg-emerald-50 border border-emerald-150 p-3.5 rounded-xl text-[11px] leading-relaxed">
                            <strong className="text-emerald-900 font-extrabold block mb-0.5">Métrica & Status Alvo:</strong>
                            <p className="text-emerald-950 font-bold leading-relaxed">{domainDetails.tobe.status}</p>
                            <span className="text-[9px] text-emerald-800 font-bold block mt-1 uppercase tracking-wide">Métrica Geral Target: {domainDetails.tobe.metric}</span>
                          </div>
                        </div>
                      </div>

                      {/* Bridge Block */}
                      <div className="bg-indigo-50/50 border border-indigo-100 p-5 rounded-2xl flex flex-col md:flex-row items-center gap-4 text-xs font-semibold">
                        <div className="p-3 bg-white rounded-2xl border border-indigo-150 text-indigo-700 shrink-0 shadow-sm">
                          <RefreshCw className="w-5 h-5 text-indigo-600 animate-spin-slow" />
                        </div>
                        <div>
                          <strong className="text-indigo-950 block text-xs font-bold uppercase tracking-wider">A Ponte de Transição do NeoCredit:</strong>
                          <p className="text-indigo-900 text-[11px] mt-0.5 leading-relaxed font-semibold">
                            {domainDetails.bridge} Esse salto reduz o retrabalho técnico, mitiga o risco legal e impulsiona a credibilidade fiduciária de nossa cooperativa para novos recordes históricos.
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

            </motion.div>
          )}

          {activeTab === "analytics" && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <AdvancedAnalytics 
                metrics={metrics}
                rosiInvest={rosiInvest}
                rosiPerda={rosiPerda}
                triggerNotification={triggerNotification}
                resetAllMetrics={handleResetAllMetrics}
              />
            </motion.div>
          )}

          {activeTab === "exec_value" && (
            <motion.div
              key="exec_value"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <ExecValueModule 
                metrics={metrics}
                rosiInvest={rosiInvest}
                rosiPerda={rosiPerda}
                triggerNotification={triggerNotification}
                setActiveTab={setActiveTab}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Footer */}
        <hr className="my-10 border-slate-200" />
        <footer className="text-center text-[11px] text-slate-400 space-y-2 pb-8">
          <p className="font-bold flex items-center justify-center gap-1.5 uppercase tracking-wide">
            <Shield className="w-3.5 h-3.5 text-blue-700" />
            Balanced Scorecard adaptado • NeoCredit Compliance & ISO 27001
          </p>
          <p className="max-w-2xl mx-auto leading-relaxed">
            Métricas simuladoras ativas para treinamento corporativo, simulação de incidentes de acordo com ITIL 4 e controle de evidências legais (ANPD / BACEN). Todos os direitos reservados.
          </p>
        </footer>

      </div>
    </div>
  );
}
