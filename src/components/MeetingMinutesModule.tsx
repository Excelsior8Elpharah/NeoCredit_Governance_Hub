import React, { useState } from "react";
import { 
  Users, 
  FileText, 
  Calendar, 
  Plus, 
  Trash2, 
  AlertCircle, 
  Save, 
  Filter, 
  Clock, 
  ClipboardList, 
  Check, 
  Sparkles,
  UserCheck,
  ChevronDown,
  BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { MeetingMinute, ActionPlanItem, Committee } from "../types";

interface MeetingMinutesModuleProps {
  committees: Committee[];
  triggerNotification: (msg: string, type?: "success" | "info") => void;
}

// Pre-seeded Meeting Minutes (ATAs) for the NeoCredit Committees
const INITIAL_MEETING_MINUTES: MeetingMinute[] = [
  {
    id: "ata-001",
    committeeId: "comite-crise",
    committeeName: "Comitê de Gestão de Riscos e Incidentes (CRI)",
    title: "Alinhamento de Contingência - Resolução BACEN 4.893",
    date: "2026-06-10",
    attendees: ["Dr. Alencar Ramos (DPO)", "Marina Salles (Compliance)", "Henrique Castilho (CISO)"],
    minutesText: "Reunião extraordinária para validar o nível de prontidão em relação à criptografia de dados transacionais e auditoria de vazamento de chaves AWS. Foi constatado que a criptografia em repouso precisa subir para o padrão AES-256 de forma urgente para mitigar multas da ANPD e exigências da Resolução 4.893 do BACEN.",
    actionPlan: [
      {
        id: "act-101",
        description: "Migração das tabelas de saldos e chaves Pix para criptografia AES-256 ativa.",
        responsible: "Henrique Castilho",
        deadline: "2026-06-25",
        status: "Em Andamento"
      },
      {
        id: "act-102",
        description: "Revisão dos logs do AWS CloudTrail e rotação de credenciais expostas.",
        responsible: "Juliana Mendes",
        deadline: "2026-06-15",
        status: "Concluído"
      }
    ]
  },
  {
    id: "ata-002",
    committeeId: "comite-seguranca",
    committeeName: "Comitê de Segurança da Informação e Privacidade (CSIP)",
    title: "Revisão Periódica da PSI e Letramento de Phishing",
    date: "2026-06-05",
    attendees: ["Henrique Castilho (CISO)", "Juliana Mendes (DevSecOps)", "Gabriel Souza (IAM)"],
    minutesText: "Discussão sobre a eficácia da campanha semestral obrigatória de simulação de Phishing. O nível de treinamento atual das equipes está em 15% (muito abaixo da meta de 100%). É necessário implantar um portal de autoaprendizado interativo e trilhas automatizadas no Slack para engajamento rápido dos colaboradores.",
    actionPlan: [
      {
        id: "act-201",
        description: "Implantação de pílulas de segurança via canais internos (Slack/Teams) com rastreamento de cliques.",
        responsible: "Gabriel Souza",
        deadline: "2026-06-30",
        status: "Pendente"
      },
      {
        id: "act-202",
        description: "Elaboração de relatório executivo de vulnerabilidades humanas para apresentação ao board.",
        responsible: "Henrique Castilho",
        deadline: "2026-06-20",
        status: "Concluído"
      }
    ]
  },
  {
    id: "ata-003",
    committeeId: "comite-mudancas",
    committeeName: "Comitê Consultivo de Mudanças (CAB)",
    title: "Validação de Releases e Protocolo de Rollback",
    date: "2026-06-12",
    attendees: ["Juliana Mendes (CAB)", "Thiago Prado (SRE)", "Marina Salles (Compliance)"],
    minutesText: "Aprovação de mudanças urgentes na esteira CI/CD para deploy seguro de microsserviços. Foi analisada a RFC-2026-9042 sobre performance de banco de dados. O comitê homologou o script sob a condição de inclusão formal do roteiro de rollback automatizado de 1 clique, evitando quedas do PIX.",
    actionPlan: [
      {
        id: "act-301",
        description: "Configuração do script de rollback automático de banco de dados no ambiente de staging.",
        responsible: "Thiago Prado",
        deadline: "2026-06-14",
        status: "Concluído"
      }
    ]
  }
];

export default function MeetingMinutesModule({
  committees,
  triggerNotification
}: MeetingMinutesModuleProps) {
  const [meetingMinutes, setMeetingMinutes] = useState<MeetingMinute[]>(() => {
    const saved = localStorage.getItem("neocredit_meeting_minutes");
    return saved ? JSON.parse(saved) : INITIAL_MEETING_MINUTES;
  });

  // State for new ATA form
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCommitteeId, setSelectedCommitteeId] = useState(committees[0]?.id || "comite-crise");
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState(new Date().toISOString().split("T")[0]);
  const [newAttendees, setNewAttendees] = useState("");
  const [newMinutesText, setNewMinutesText] = useState("");
  const [currentActions, setCurrentActions] = useState<{ description: string; responsible: string; deadline: string }[]>([
    { description: "", responsible: "", deadline: "" }
  ]);

  // Filters state
  const [filterCommitteeId, setFilterCommitteeId] = useState<string>("all");
  const [selectedAtaId, setSelectedAtaId] = useState<string | null>("ata-001");

  // Save changes to LocalStorage
  const saveMinutesToStorage = (updatedList: MeetingMinute[]) => {
    setMeetingMinutes(updatedList);
    localStorage.setItem("neocredit_meeting_minutes", JSON.stringify(updatedList));
  };

  // Handler to add action item to current temporary list
  const addActionField = () => {
    setCurrentActions(prev => [...prev, { description: "", responsible: "", deadline: "" }]);
  };

  // Handler to remove action item from temporary list
  const removeActionField = (index: number) => {
    if (currentActions.length === 1) {
      triggerNotification("Toda reunião deve sair com pelo menos uma ação no plano de ação!", "info");
      return;
    }
    setCurrentActions(prev => prev.filter((_, i) => i !== index));
  };

  // Handle temporary action value changes
  const handleActionChange = (index: number, field: "description" | "responsible" | "deadline", value: string) => {
    setCurrentActions(prev => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  // Handle submitting the new ATA
  const handleCreateAta = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTitle.trim()) {
      triggerNotification("Por favor, preencha o título da ATA.", "info");
      return;
    }
    if (!newMinutesText.trim()) {
      triggerNotification("Por favor, preencha a descrição/ata da reunião.", "info");
      return;
    }

    // MANDATORY ACTION PLAN CHECK: Every meeting MUST have an action plan!
    // Check if there is at least one non-empty action item
    const validActions = currentActions.filter(act => act.description.trim() !== "");
    if (validActions.length === 0) {
      triggerNotification("Erro de Conformidade: Toda reunião deve sair obrigatoriamente com um plano de ação!", "info");
      return;
    }

    // Validate that all actions have description, responsible, and deadline
    for (let i = 0; i < validActions.length; i++) {
      const act = validActions[i];
      if (!act.responsible.trim() || !act.deadline) {
        triggerNotification(`Por favor, preencha o responsável e prazo para a ação: "${act.description.substring(0, 20)}..."`, "info");
        return;
      }
    }

    const committeeObj = committees.find(c => c.id === selectedCommitteeId);
    const committeeName = committeeObj ? committeeObj.name : "Comitê Geral";

    // Build the new Meeting Minute
    const newAta: MeetingMinute = {
      id: `ata-${Date.now().toString().slice(-4)}`,
      committeeId: selectedCommitteeId,
      committeeName,
      title: newTitle,
      date: newDate,
      attendees: newAttendees.split(",").map(s => s.trim()).filter(s => s.length > 0),
      minutesText: newMinutesText,
      actionPlan: validActions.map((act, index) => ({
        id: `act-${Date.now().toString().slice(-4)}-${index}`,
        description: act.description,
        responsible: act.responsible,
        deadline: act.deadline,
        status: "Pendente"
      }))
    };

    const updated = [newAta, ...meetingMinutes];
    saveMinutesToStorage(updated);
    setSelectedAtaId(newAta.id);
    
    // Reset form states
    setNewTitle("");
    setNewAttendees("");
    setNewMinutesText("");
    setCurrentActions([{ description: "", responsible: "", deadline: "" }]);
    setShowCreateForm(false);

    triggerNotification("ATA e Plano de Ação cadastrados com sucesso!", "success");
  };

  // Handle toggling action plan status from overall dashboard
  const handleToggleActionStatus = (ataId: string, actionId: string) => {
    const updated = meetingMinutes.map(ata => {
      if (ata.id === ataId) {
        const updatedPlan = ata.actionPlan.map(act => {
          if (act.id === actionId) {
            const nextStatusMap: Record<string, "Pendente" | "Em Andamento" | "Concluído"> = {
              "Pendente": "Em Andamento",
              "Em Andamento": "Concluído",
              "Concluído": "Pendente"
            };
            const nextStatus = nextStatusMap[act.status] || "Pendente";
            triggerNotification(`Ação alterada para status: ${nextStatus}`, "success");
            return { ...act, status: nextStatus };
          }
          return act;
        });
        return { ...ata, actionPlan: updatedPlan };
      }
      return ata;
    });
    saveMinutesToStorage(updated);
  };

  // Delete a meeting minute
  const handleDeleteAta = (id: string) => {
    if (confirm("Deseja realmente excluir esta ata?")) {
      const updated = meetingMinutes.filter(m => m.id !== id);
      saveMinutesToStorage(updated);
      if (selectedAtaId === id) {
        setSelectedAtaId(updated[0]?.id || null);
      }
      triggerNotification("Ata removida com sucesso.", "info");
    }
  };

  const filteredMinutes = filterCommitteeId === "all" 
    ? meetingMinutes 
    : meetingMinutes.filter(m => m.committeeId === filterCommitteeId);

  const selectedAta = meetingMinutes.find(m => m.id === selectedAtaId);

  // Statistics
  const totalAtas = meetingMinutes.length;
  const allActions = meetingMinutes.flatMap(m => m.actionPlan.map(act => ({ ...act, ataTitle: m.title, ataId: m.id })));
  const completedActionsCount = allActions.filter(a => a.status === "Concluído").length;
  const totalActionsCount = allActions.length;
  const progressPercent = totalActionsCount > 0 ? Math.round((completedActionsCount / totalActionsCount) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Banner / Compliance Directive Info */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-bold uppercase tracking-widest">
            <ClipboardList className="w-4 h-4 text-emerald-400" />
            DIRETRIZ DE GOVERNANÇA: REGISTRO DE ATAS (ATA)
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight">
            Gerenciamento de Atas & Planos de Ação Obrigatórios
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Em conformidade com a <strong>ISO 27001</strong> e a <strong>Resolução 4.893 do BACEN</strong>, todas as reuniões dos comitês estratégicos e técnicos do NeoCredit devem ser formalizadas através de uma <strong>ATA oficial</strong>, gerando obrigatoriamente um <strong>Plano de Ação estruturado</strong> com responsáveis e prazos claros para mitigação de riscos.
          </p>
          <div className="flex flex-wrap gap-4 pt-2 text-xs text-indigo-200 font-semibold">
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400" /> Responsabilidade Definida</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400" /> Prazos Auditáveis</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400" /> Rastreamento de Status de Ações</span>
          </div>
        </div>
      </div>

      {/* Overview Stat Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex items-center gap-4">
          <span className="p-3 bg-blue-50 text-blue-800 rounded-2xl border border-blue-100">
            <FileText className="w-6 h-6" />
          </span>
          <div>
            <span className="text-[10px] text-slate-400 block font-bold uppercase">Atas Registradas</span>
            <strong className="text-2xl font-black text-slate-900">{totalAtas}</strong>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex items-center gap-4">
          <span className="p-3 bg-indigo-50 text-indigo-800 rounded-2xl border border-indigo-100">
            <ClipboardList className="w-6 h-6" />
          </span>
          <div>
            <span className="text-[10px] text-slate-400 block font-bold uppercase">Total de Ações</span>
            <strong className="text-2xl font-black text-slate-900">{totalActionsCount}</strong>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex items-center gap-4">
          <span className="p-3 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-100">
            <Check className="w-6 h-6" />
          </span>
          <div className="flex-1">
            <span className="text-[10px] text-slate-400 block font-bold uppercase">Conclusão dos Planos</span>
            <div className="flex items-baseline gap-2">
              <strong className="text-2xl font-black text-slate-900">{progressPercent}%</strong>
              <span className="text-[10px] text-slate-400 font-semibold">({completedActionsCount}/{totalActionsCount})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Meeting Minutes List & Create Trigger */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex justify-between items-center px-1">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">Histórico de Reuniões</h3>
              <p className="text-xs text-slate-400">Atas e registros de conselho</p>
            </div>
            
            <button
              onClick={() => {
                setShowCreateForm(!showCreateForm);
                if (!showCreateForm) {
                  // Prepopulate default state
                  setCurrentActions([{ description: "", responsible: "", deadline: "" }]);
                }
              }}
              className="flex items-center gap-1.5 bg-blue-800 hover:bg-blue-700 text-white text-xs font-bold py-2 px-3.5 rounded-xl shadow-md transition"
            >
              <Plus className="w-4 h-4" />
              <span>{showCreateForm ? "Cancelar" : "Nova ATA"}</span>
            </button>
          </div>

          {/* Search/Filter Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-3 flex items-center gap-3 shadow-sm">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={filterCommitteeId}
              onChange={(e) => setFilterCommitteeId(e.target.value)}
              className="bg-transparent border-0 text-xs font-semibold text-slate-700 focus:ring-0 w-full cursor-pointer focus:outline-none"
            >
              <option value="all">🔍 Todos os Comitês</option>
              {committees.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* ATA List Cards */}
          <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
            {filteredMinutes.length === 0 ? (
              <div className="bg-slate-50 border border-slate-150 rounded-2xl p-6 text-center text-slate-400 text-xs">
                Nenhum registro de ata encontrado para este comitê.
              </div>
            ) : (
              filteredMinutes.map(m => {
                const isSelected = selectedAtaId === m.id;
                const completedActions = m.actionPlan.filter(a => a.status === "Concluído").length;
                const totalActions = m.actionPlan.length;
                return (
                  <div
                    key={m.id}
                    onClick={() => {
                      setSelectedAtaId(m.id);
                      setShowCreateForm(false);
                    }}
                    className={`p-4 sm:p-5 rounded-2xl border-2 text-left cursor-pointer transition-all ${
                      isSelected
                        ? "bg-white border-blue-800 shadow-md scale-[1.01]"
                        : "bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <span className="text-[9px] font-mono font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider">
                        {m.id}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {m.date}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-slate-900 text-sm line-clamp-1">
                      {m.title}
                    </h4>
                    <p className="text-xs text-slate-400 font-medium mt-1">
                      {m.committeeName}
                    </p>

                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-100 text-[10px] font-bold">
                      <span className="text-slate-400 font-medium">Participantes: {m.attendees.length}</span>
                      <span className={`px-2 py-0.5 rounded-full ${
                        completedActions === totalActions 
                          ? "bg-emerald-100 text-emerald-800" 
                          : "bg-amber-100 text-amber-800"
                      }`}>
                        Ações: {completedActions}/{totalActions} ({totalActions > 0 ? Math.round((completedActions/totalActions)*100) : 0}%)
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Detailed View or Create Form */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {showCreateForm ? (
              // FORM TO CREATE NEW MEETING MINUTE
              <motion.div
                key="create-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
              >
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
                    Lavrar Nova ATA de Reunião
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Insira as discussões oficiais e o plano de ação obrigatório.
                  </p>
                </div>

                <form onSubmit={handleCreateAta} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black uppercase text-slate-500">Selecione o Comitê</label>
                      <select
                        value={selectedCommitteeId}
                        onChange={(e) => setSelectedCommitteeId(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:ring-1 focus:ring-blue-800 focus:outline-none"
                      >
                        {committees.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black uppercase text-slate-500">Data do Encontro</label>
                      <input
                        type="date"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:ring-1 focus:ring-blue-800 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase text-slate-500">Título / Pauta da Reunião</label>
                    <input
                      type="text"
                      placeholder="Ex: Revisão de Backup em Nuvem e Controles ISO 27001"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:ring-1 focus:ring-blue-800 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase text-slate-500">Participantes Presentes (Separados por vírgula)</label>
                    <input
                      type="text"
                      placeholder="Ex: Juliana Mendes, Thiago Prado, Henrique Castilho"
                      value={newAttendees}
                      onChange={(e) => setNewAttendees(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:ring-1 focus:ring-blue-800 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase text-slate-500">Ata de Discussão (O que foi debatido)</label>
                    <textarea
                      placeholder="Descreva de forma executiva sem jargões as decisões, diagnósticos de riscos ou aprovações técnicas operadas."
                      value={newMinutesText}
                      onChange={(e) => setNewMinutesText(e.target.value)}
                      rows={4}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-800 focus:ring-1 focus:ring-blue-800 focus:outline-none leading-relaxed"
                      required
                    />
                  </div>

                  {/* MANDATORY ACTION PLAN INTERACTIVE FORM FIELDS */}
                  <div className="space-y-4 border-t border-slate-100 pt-5">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-black uppercase text-indigo-700 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4 text-emerald-500" />
                        Plano de Ação Obrigatório (Regra de Governança)
                      </span>
                      <button
                        type="button"
                        onClick={addActionField}
                        className="flex items-center gap-1 text-[10px] font-black text-blue-800 bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded-lg px-2.5 py-1.5 transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Adicionar Ação</span>
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-400 italic leading-snug">
                      Toda reunião deve sair com um plano de ação contendo o responsável pelo controle regulatório e o prazo final.
                    </p>

                    <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                      {currentActions.map((act, index) => (
                        <div key={index} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl relative space-y-3">
                          <button
                            type="button"
                            onClick={() => removeActionField(index)}
                            className="absolute top-2 right-2 text-slate-400 hover:text-rose-600 transition"
                            title="Remover Ação"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase text-slate-400">Ação / Tarefa {index + 1}</label>
                            <input
                              type="text"
                              placeholder="Ex: Ativar backups frios criptografados na AWS"
                              value={act.description}
                              onChange={(e) => handleActionChange(index, "description", e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 focus:ring-1 focus:ring-blue-800 focus:outline-none"
                              required
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[9px] font-black uppercase text-slate-400">Responsável</label>
                              <input
                                type="text"
                                placeholder="Nome do Dono"
                                value={act.responsible}
                                onChange={(e) => handleActionChange(index, "responsible", e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800"
                                required
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-black uppercase text-slate-400">Prazo Final</label>
                              <input
                                type="date"
                                value={act.deadline}
                                onChange={(e) => handleActionChange(index, "deadline", e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="px-5 py-2.5 text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 text-xs font-bold bg-blue-800 hover:bg-blue-700 text-white rounded-xl shadow shadow-blue-900/20 transition flex items-center gap-1.5"
                    >
                      <Save className="w-4 h-4" />
                      <span>Salvar ATA e Plano de Ação</span>
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : selectedAta ? (
              // DETAILED INSPECTOR VIEW FOR SELECTED MEETING MINUTE
              <motion.div
                key="ata-inspector"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
              >
                {/* Header info */}
                <div className="flex justify-between items-start border-b border-slate-100 pb-5">
                  <div>
                    <span className="text-xs font-mono font-bold text-blue-800 bg-blue-50/50 px-2.5 py-1 rounded-full border border-blue-100 inline-block mb-2">
                      Código: {selectedAta.id} • {selectedAta.date}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-950">{selectedAta.title}</h2>
                    <p className="text-xs text-slate-400 mt-1 font-semibold">{selectedAta.committeeName}</p>
                  </div>

                  <button
                    onClick={() => handleDeleteAta(selectedAta.id)}
                    className="p-2 text-slate-300 hover:text-rose-600 transition hover:bg-rose-50 rounded-xl"
                    title="Excluir Ata"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </div>

                {/* Attendees list */}
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3">
                  <span className="p-2 bg-white rounded-xl text-slate-500 shrink-0 shadow-inner">
                    <Users className="w-4.5 h-4.5" />
                  </span>
                  <div>
                    <span className="text-[9px] text-slate-400 block font-bold uppercase">Membros Presentes na Sessão</span>
                    <p className="text-xs font-bold text-slate-700 mt-0.5">
                      {selectedAta.attendees.length > 0 ? selectedAta.attendees.join(", ") : "Nenhum participante informado."}
                    </p>
                  </div>
                </div>

                {/* Minutes body paper simulation */}
                <div className="space-y-2">
                  <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-slate-400" />
                    Discussões Oficiais Homologadas
                  </h4>
                  <div className="bg-slate-50/60 border border-slate-150 rounded-2xl p-6 font-serif text-slate-700 text-sm sm:text-base leading-relaxed max-h-[220px] overflow-y-auto shadow-inner whitespace-pre-line">
                    {selectedAta.minutesText}
                  </div>
                </div>

                {/* THE RESULTING ACTION PLAN FOR EVERY REUNION */}
                <div className="space-y-4 border-t border-slate-100 pt-5">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                        <ClipboardList className="w-4.5 h-4.5 text-blue-800" />
                        Plano de Ação Resultante (Obrigatório)
                      </h4>
                      <p className="text-[11px] text-slate-400">Toda reunião exige ações mapeadas. Clique na caixinha para alternar o status.</p>
                    </div>
                    <span className="bg-amber-100 text-amber-800 text-[9px] font-mono px-2 py-0.5 rounded-full font-black uppercase border border-amber-200 shadow-sm shrink-0 self-start sm:self-center">
                      Normativa de Compliance Ativa
                    </span>
                  </div>

                  {/* Action items checklist table / cards */}
                  <div className="space-y-3">
                    {selectedAta.actionPlan.map((act) => {
                      const isDone = act.status === "Concluído";
                      const isInProgress = act.status === "Em Andamento";
                      return (
                        <div
                          key={act.id}
                          onClick={() => handleToggleActionStatus(selectedAta.id, act.id)}
                          className={`p-4 border rounded-2xl cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:shadow-sm ${
                            isDone 
                              ? "bg-emerald-50/40 border-emerald-200 text-slate-500" 
                              : isInProgress
                                ? "bg-amber-50/40 border-amber-200 text-slate-800"
                                : "bg-white border-slate-200 text-slate-800"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-1 rounded-lg mt-0.5 shrink-0 transition ${
                              isDone 
                                ? "bg-emerald-100 text-emerald-700" 
                                : isInProgress
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-slate-100 text-slate-300"
                            }`}>
                              <Check className="w-4 h-4" />
                            </div>
                            <div>
                              <p className={`text-xs font-semibold leading-relaxed ${isDone ? "line-through text-slate-400" : "text-slate-800"}`}>
                                {act.description}
                              </p>
                              
                              {/* Meta Details */}
                              <div className="flex flex-wrap items-center gap-2 mt-2 text-[10px] text-slate-450 font-bold">
                                <span className="flex items-center gap-1">
                                  <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                                  Responsável: <strong className="text-slate-600 font-extrabold">{act.responsible}</strong>
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                                  Prazo: <strong className="text-slate-600 font-extrabold">{act.deadline}</strong>
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="shrink-0 self-start sm:self-center">
                            <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-md border tracking-wider block text-center ${
                              isDone 
                                ? "bg-emerald-100 text-emerald-800 border-emerald-250" 
                                : isInProgress
                                  ? "bg-amber-100 text-amber-800 border-amber-200"
                                  : "bg-slate-100 text-slate-600 border-slate-200"
                            }`}>
                              {act.status}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-3xl p-10 shadow-sm text-center text-slate-400 flex flex-col justify-center items-center h-full min-h-[350px]">
                <FileText className="w-12 h-12 text-slate-300 mb-3" />
                <h4 className="font-bold text-slate-700">Selecione uma Ata</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  Escolha uma ata na barra lateral para examinar os detalhes, discussões e os planos de ação associados.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
