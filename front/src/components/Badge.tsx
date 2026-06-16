import type { FindingStatus, Severity } from '../types';

const severityClass: Record<Severity, string> = {
  Crítica: 'badge danger',
  Alta: 'badge high',
  Média: 'badge medium',
  Baixa: 'badge low',
  Informativa: 'badge info'
};

const statusClass: Record<FindingStatus, string> = {
  Aberto: 'badge open',
  'Em análise': 'badge review',
  'Em correção': 'badge fixing',
  Corrigido: 'badge done',
  'Aceito como risco': 'badge risk',
  'Falso positivo': 'badge false-positive'
};

export function SeverityBadge({ value }: { value: Severity }) {
  return <span className={severityClass[value]}>{value}</span>;
}

export function StatusBadge({ value }: { value: FindingStatus }) {
  return <span className={statusClass[value]}>{value}</span>;
}
