/**
 * Types and Interfaces for NeoCredit Governance Hub
 */

export interface MetricState {
  uptime: number; // 98.5 to 100
  changes: number; // 30 to 100
  encrypt: number; // 10 to 100
  training: number; // 0 to 100
}

export interface KpiConfig {
  id: keyof MetricState;
  title: string;
  icon: string;
  target: number;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
  category: "LGPD" | "BACEN" | "COMPLIANCE";
}

export interface Committee {
  id: string;
  name: string;
  icon: string;
  role: string;
  description: string;
  meetingFrequency: string;
  nextMeetingDate: string;
  members: {
    name: string;
    role: string;
    avatar: string;
  }[];
  raci: {
    activity: string;
    r: string; // Responsible
    a: string; // Accountable
    c: string; // Consulted
    i: string; // Informed
  }[];
}

export interface Policy {
  id: string;
  code: string;
  title: string;
  description: string;
  owner: string;
  lastRevision: string;
  status: "Draft" | "Review" | "Approved";
  complianceLevel: number; // 0 to 100
  content: string[]; // Clauses
}

export interface IncidentSim {
  id: string;
  title: string;
  description: string;
  severity: "Baixa" | "Média" | "Alta" | "Crítica";
  status: "detectado" | "contido" | "investigando" | "mitigado" | "resolvido";
  startedAt: string;
  slaMinutes: number;
  currentStep: number;
  steps: {
    title: string;
    description: string;
    done: boolean;
  }[];
}

export interface HistoricIncident {
  id: string;
  title: string;
  date: string;
  severity: "Baixa" | "Média" | "Alta" | "Crítica";
  status: "Resolvido" | "Mitigado";
  resolutionSLA: string;
  rca: string; // Root Cause Analysis
}

export interface AuditItem {
  id: string;
  framework: "ISO 27001" | "COBIT 2019" | "ITIL 4" | "LGPD";
  controlSection: string;
  title: string;
  checked: boolean;
  weight: number;
}

export interface BscObjective {
  id: string;
  perspective: "Financeira" | "Cliente" | "Interna" | "Aprendizagem";
  objective: string;
  kpiName: string;
  meta: string;
  currentFormula: (metrics: MetricState) => { value: string; status: "success" | "warning" | "danger" };
  initiative: string;
}

export interface RoadmapTask {
  id: string;
  phaseId: "phase1" | "phase2" | "phase3";
  title: string;
  duration: string;
  assignedRole: string;
  completed: boolean;
  details: string;
}

export interface ActionPlanItem {
  id: string;
  description: string;
  responsible: string;
  deadline: string;
  status: "Pendente" | "Em Andamento" | "Concluído";
}

export interface MeetingMinute {
  id: string;
  committeeId: string;
  committeeName: string;
  title: string;
  date: string;
  attendees: string[];
  minutesText: string;
  actionPlan: ActionPlanItem[];
}
