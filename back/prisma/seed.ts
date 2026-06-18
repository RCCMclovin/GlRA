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
      { id: FindingStatus.info_needed, name: 'Aceito como risco' },
      { id: FindingStatus.queued, name: 'Na fila' },
      { id: FindingStatus.cancelled, name: 'Cancelado' },
    ],
    skipDuplicates: true,
  });
  console.log('Status criados.');

  await prisma.findingType.createMany({
    data: [
      { id: FindingTypes.cwe120, name: 'CWE-120' },
      { id: FindingTypes.cwe276, name: 'CWE-276' },
      { id: FindingTypes.cwe426, name: 'CWE-426' },
      { id: FindingTypes.cwe779, name: 'CWE-779' },
      { id: FindingTypes.cwe1395, name: 'CWE-1395' },
      { id: '550e8400-e29b-41d4-a716-446655440001', name: 'CWE-89' },
      { id: '550e8400-e29b-41d4-a716-446655440002', name: 'CWE-352' },
      { id: '550e8400-e29b-41d4-a716-446655440003', name: 'CWE-532' },
      { id: '550e8400-e29b-41d4-a716-446655440004', name: 'CWE-79' },
      { id: '550e8400-e29b-41d4-a716-446655440005', name: 'CWE-287' },
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
    console.log('Usuário padrão criado (admin@gira.com / 123456).');
  } else {
    console.log('Usuário padrão já existe.');
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
