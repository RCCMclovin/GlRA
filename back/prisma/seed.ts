import { PrismaClient } from '../src/generated/prisma/client';
import { genSalt, hash } from 'bcryptjs';
import { FindingSeverity} from '../src/resources/findingSeverity/findingSeverity.consts';
import { FindingStatus } from '../src/resources/findingStatus/findingStatus.consts';
import { FindingTypes } from '../src/resources/findingTypes/fidingTypes.consts'

const prisma = new PrismaClient();

async function main() {
  const salt = await genSalt();
  const password = await hash('admin', salt);
  await prisma.user.create({
    data: {
      id: '98ec6545-23d1-4d9e-a565-0c7452b45a8b',
      email: 'admin@example.com',
      name: 'Admin',
      password: password,
    },
  });
  await prisma.findingSeverity.createMany({data:[
    {
      id: FindingSeverity.critical,
      name: 'Critical'
    },
    {
      id: FindingSeverity.high,
      name: 'High'
    },
    {
      id: FindingSeverity.medium,
      name: 'Medium'
    },
    {
      id: FindingSeverity.low,
      name: 'Low'
    },
    {
      id: FindingSeverity.information,
      name: 'Information'
    },
  ]});
  await prisma.findingStatus.createMany({data:[
    {
      id: FindingStatus.cancelled,
      name: 'Cancelled'
    },
    {
      id: FindingStatus.open,
      name: 'Open'
    },
    {
      id: FindingStatus.queued,
      name: 'Queued'
    },
    {
      id: FindingStatus.in_progress,
      name: 'In Progress'
    },
    {
      id: FindingStatus.info_needed,
      name: 'Info Needed'
    },
    {
      id: FindingStatus.false_positive,
      name: 'False Positive'
    },
    {
      id: FindingStatus.under_review,
      name: 'Under Review'
    },
    {
      id: FindingStatus.completed,
      name: 'Completed'
    },
  ]});
  await prisma.findingType.createMany({data:[
    {
      id: FindingTypes.cwe120,
      name: 'Buffer Copy without Checking Size of Input (CWE-120)'
    },
    {
      id: FindingTypes.cwe276,
      name: 'Incorrect Default Permissions (CWE-276)'
    },
    {
      id: FindingTypes.cwe426,
      name: 'Untrusted Search Path (CWE-426)'
    },
    {
      id: FindingTypes.cwe779,
      name: 'Logging of Excessive Data (CWE-779)'
    },
    {
      id: FindingTypes.cwe1395,
      name: 'Dependency on Vulnerable Third-Party Component (CWE-1395)'
    },
  ]})
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
  });