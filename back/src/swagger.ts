import swaggerAutogen from 'swagger-autogen';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();
const doc = {
  info: {
    title: 'API do GlRA',
    description: 'Documentação da API',
    version: '1.0',
  },
  host: process.env.HOST,
  definitions: {
    Auth: {
      msg: 'Usuário autenticado',
    },
    AuthDTO: {
      email: 'email@example.com',
      password: 'SenhaMuitoForte',
    },
    SignUpDto: {
      name: 'Fulano de Tal',
      email: 'email@example.com',
      password: 'SenhaMuitoForte',
    },
    LoginDTO: {
      id: '98ec6545-23d1-4d9e-a565-0c7452b45a8b',
      name: 'Fulano de Tal',
      email: 'email@example.com',
    },
    FindingPublic:{
        id: '98ec6545-23d1-4d9e-a565-0c7452b45a8b',
        reporter:{
          id: "8cdebdfd-122c-4b03-af73-1009a621dfd4",
          name: "Fulano de Tal"
        },
        title: "Text",
        solution: "Text",
        description: "Text",
        assigned:{
          id: "8cdebdfd-122c-4b03-af73-1009a621dfd4",
          name: "Fulano de Tal"
        },
        status: "Info Needed",
        severity: "Low",
        category: "CWE-120"
    },
    CreateFindingDTO:{
        id: '98ec6545-23d1-4d9e-a565-0c7452b45a8b',
        title: "Text",
        solution: "Text",
        description: "Text",
        assignedId:"49389be7-c132-452c-a2d3-80c7a6fdf790",
        statusId: "6ed9435f-685b-4607-a6a3-c9a00f80448a",
        severityId: "3491ec2f-f2dc-4b7b-8cea-47155d2d6087",
        categoryId: "2a97ec94-d91c-49bc-95c5-42decebc0a88",
        projectId: "36a3ab3f-0e04-4cba-aa3d-ba35a3a9ab87"
    },
    MediaDTO: "Binary",
    Media:{
      id: "a8c2c506-9039-40e2-8071-15501d60e4c7",
      link: "https://link.to.file",
      createdAt: "DateTime"
    },
    FindingSeverity: {
        id: "67844d85-407c-4cea-996b-2b92618e6be3",
        name: "Low"
    },
    FindingType: {
        id: "416efad4-db77-4150-8fba-cd3c2759cca3",
        name: "CWE-120"
    },
    FindingStatus: {
        id: "6cfaa2a3-d2ca-434a-ba26-a2936d2c6732",
        name: "Info Needed"
    },
    Notification:{
        id: '98ec6545-23d1-4d9e-a565-0c7452b45a8b',
        content: "Text",
        receiverId: "8cdebdfd-122c-4b03-af73-1009a621dfd4",
        read: true
    },
    ProjectDTO:{
        title: "Text",
        description: "Text",
    },
    Project:{
      id: '98ec6545-23d1-4d9e-a565-0c7452b45a8b',
      title: "Text",
      description: "Text",
      creatorId: "8cdebdfd-122c-4b03-af73-1009a621dfd4",
      createdAt: "DateTime",
      updatedAt: "DateTime",
    },
    CreateUserDTO: {
        email: "email@example.com",
        name: "Fulano de Tal",
        password: "SenhaForte"
    },
    UpdateUserDTO: {
        email: "email@example.com",
        name: "Fulano de Tal",
        password: "Optional", 
        userTypeId: "Optional"
    },
    UserDTO: {
      id: "f0a39296-e785-4567-a2ae-1d7e52e04689",
      email: "email@example.com",
      name: "Fulano de Tal",
      createdAt: "DateTime",
      updatedAt: "DateTime",
    }

  },
};
const outputFile = './swagger-output.json';
const routes = [path.join(__dirname, 'router/index.ts')];
swaggerAutogen()(outputFile, routes, doc);