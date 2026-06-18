const severityClass: Record<string, string> = {
  'Crítica': 'badge danger',
  'Alta': 'badge high',
  'Média': 'badge medium',
  'Baixa': 'badge low',
  'Informativa': 'badge info',
};

const statusClass: Record<string, string> = {
  'Aberto': 'badge open',
  'Em análise': 'badge review',
  'Em correção': 'badge fixing',
  'Corrigido': 'badge done',
  'Aceito como risco': 'badge risk',
  'Falso positivo': 'badge false-positive',
  'Na fila': 'badge review',
  'Cancelado': 'badge false-positive',
};

export function SeverityBadge({ value }: { value: string }) {
  return <span className={severityClass[value] ?? 'badge'}>{value}</span>;
}

export function StatusBadge({ value }: { value: string }) {
  return <span className={statusClass[value] ?? 'badge'}>{value}</span>;
}
