import { PrismaClient } from '../src/generated/prisma/client';
import { genSalt, hash } from 'bcryptjs';
import { FindingSeverity } from '../src/resources/findingSeverity/findingSeverity.consts';
import { FindingStatus } from '../src/resources/findingStatus/findingStatus.consts';
import { FindingTypes } from '../src/resources/findingTypes/fidingTypes.consts';

const prisma = new PrismaClient();

async function main() {
  await prisma.findingSeverity.createMany({
    data: [
      { id: FindingSeverity.critical, name: 'Crítica' },
      { id: FindingSeverity.high, name: 'Alta' },
      { id: FindingSeverity.medium, name: 'Média' },
      { id: FindingSeverity.low, name: 'Baixa' },
      { id: FindingSeverity.information, name: 'Informativa' },
    ],
    skipDuplicates: true,
  });
  console.log('Severidades criadas.');

  await prisma.findingStatus.createMany({
    data: [
      { id: FindingStatus.open, name: 'Aberto' },
      { id: FindingStatus.under_review, name: 'Em análise' },
      { id: FindingStatus.in_progress, name: 'Em correção' },
      { id: FindingStatus.completed, name: 'Corrigido' },
      { id: FindingStatus.false_positive, name: 'Falso positivo' },
      { id: FindingStatus.info_needed, name: 'Necessita Informações' },
      { id: FindingStatus.queued, name: 'Na fila' },
      { id: FindingStatus.cancelled, name: 'Cancelado' },
    ],
    skipDuplicates: true,
  });
  console.log('Status criados.');

  await prisma.findingType.createMany({
    data: [
      { id: FindingTypes.cwe120, name: 'CWE-120 — Buffer Overflow' },
      { id: FindingTypes.cwe276, name: 'CWE-276 — Permissões padrão incorretas' },
      { id: FindingTypes.cwe426, name: 'CWE-426 — Caminho de busca não confiável' },
      { id: FindingTypes.cwe779, name: 'CWE-779 — Log com dados excessivos' },
      { id: FindingTypes.cwe1395, name: 'CWE-1395 — Dependência de componente vulnerável' },
      { id: '550e8400-e29b-41d4-a716-446655440001', name: 'CWE-89 — Injeção SQL' },
      { id: '550e8400-e29b-41d4-a716-446655440002', name: 'CWE-352 — Cross-Site Request Forgery (CSRF)' },
      { id: '550e8400-e29b-41d4-a716-446655440003', name: 'CWE-532 — Log com informação sensível' },
      { id: '550e8400-e29b-41d4-a716-446655440004', name: 'CWE-79 — Cross-Site Scripting (XSS)' },
      { id: '550e8400-e29b-41d4-a716-446655440005', name: 'CWE-287 — Autenticação imprópria' },
      { id: '550e8400-e29b-41d4-a716-446655440006', name: 'CWE-22 — Path Traversal' },
      { id: '550e8400-e29b-41d4-a716-446655440007', name: 'CWE-78 — Injeção de comando no SO' },
      { id: '550e8400-e29b-41d4-a716-446655440008', name: 'CWE-94 — Injeção de código' },
      { id: '550e8400-e29b-41d4-a716-446655440009', name: 'CWE-200 — Exposição de informação sensível' },
      { id: '550e8400-e29b-41d4-a716-44665544000a', name: 'CWE-250 — Execução com privilégios desnecessários' },
      { id: '550e8400-e29b-41d4-a716-44665544000b', name: 'CWE-284 — Controle de acesso impróprio' },
      { id: '550e8400-e29b-41d4-a716-44665544000c', name: 'CWE-306 — Ausência de autenticação em função crítica' },
      { id: '550e8400-e29b-41d4-a716-44665544000d', name: 'CWE-311 — Ausência de criptografia em dados sensíveis' },
      { id: '550e8400-e29b-41d4-a716-44665544000e', name: 'CWE-327 — Uso de algoritmo criptográfico quebrado' },
      { id: '550e8400-e29b-41d4-a716-44665544000f', name: 'CWE-434 — Upload de arquivo sem restrição' },
      { id: '550e8400-e29b-41d4-a716-446655440010', name: 'CWE-502 — Desserialização de dados não confiáveis' },
      { id: '550e8400-e29b-41d4-a716-446655440011', name: 'CWE-601 — Redirecionamento aberto (Open Redirect)' },
      { id: '550e8400-e29b-41d4-a716-446655440012', name: 'CWE-611 — Injeção de entidade externa XML (XXE)' },
      { id: '550e8400-e29b-41d4-a716-446655440013', name: 'CWE-798 — Credenciais hardcoded' },
      { id: '550e8400-e29b-41d4-a716-446655440014', name: 'CWE-862 — Ausência de autorização' },
      { id: '550e8400-e29b-41d4-a716-446655440015', name: 'CWE-863 — Autorização incorreta' },
      { id: '550e8400-e29b-41d4-a716-446655440016', name: 'CWE-918 — Server-Side Request Forgery (SSRF)' },
      { id: '550e8400-e29b-41d4-a716-446655440017', name: 'CWE-943 — Manipulação imprópria de consulta NoSQL' },
      { id: '550e8400-e29b-41d4-a716-446655440018', name: 'CWE-1021 — Renderização imprópria de UI (Clickjacking)' },
      { id: '550e8400-e29b-41d4-a716-446655440019', name: 'CWE-1236 — Injeção de fórmula em CSV/planilha' },
    ],
    skipDuplicates: true,
  });
  console.log('Categorias CWE criadas.');

  const salt = await genSalt();
  const password = await hash('123456', salt);

  const existingUser = await prisma.user.findUnique({ where: { email: 'admin@gira.com' } });
  if (!existingUser) {
    await prisma.user.create({
      data: {
        id: '00000000-0000-0000-0000-000000000001',
        email: 'admin@gira.com',
        name: 'Administrador',
        password,
      },
    });
    //console.log('Usuário padrão criado (admin@gira.com / 123456).');
  } else {
    console.log('Usuário padrão já existe.');
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  });
