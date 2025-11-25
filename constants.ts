import { Booking, BookingStatus, Client, Service, Transaction, TransactionType, TattooRequest, RequestStatus } from './types';

// Helper to create dates relative to now
const now = new Date();
const addHours = (d: Date, h: number) => new Date(d.getTime() + h * 60 * 60 * 1000);
const addDays = (d: Date, days: number) => {
  const newDate = new Date(d);
  newDate.setDate(d.getDate() + days);
  return newDate;
};

export const MOCK_SERVICES: Service[] = [
  { id: '1', name: 'Flash Tattoo (Pequena)', duration: 60, price: 150 },
  { id: '2', name: 'Design Personalizado (Médio)', duration: 180, price: 450 },
  { id: '3', name: 'Sessão Fechamento (Manga)', duration: 240, price: 800 },
  { id: '4', name: 'Retoque', duration: 30, price: 50 },
];

export const MOCK_CLIENTS: Client[] = [
  {
    id: 'c1',
    name: 'Alice Cooper',
    email: 'alice@example.com',
    phone: '(11) 99999-1234',
    notes: 'Gosta do estilo tradicional. Alérgica a látex.',
    photoUrls: ['https://picsum.photos/200/200?random=1', 'https://picsum.photos/200/200?random=2'],
    totalSessions: 3,
    lastVisit: addDays(now, -30),
  },
  {
    id: 'c2',
    name: 'Bob Marley',
    email: 'bob@example.com',
    phone: '(11) 98888-5678',
    notes: 'Trabalhando nas costas inteira. Estilo geométrico.',
    photoUrls: ['https://picsum.photos/200/200?random=3'],
    totalSessions: 1,
    lastVisit: addDays(now, -60),
  },
  {
    id: 'c3',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    phone: '(11) 97777-4321',
    notes: 'Primeira vez. Nervoso.',
    photoUrls: [],
    totalSessions: 0,
  },
  {
    id: 'c4',
    name: 'Diana Prince',
    email: 'diana@themyscira.com',
    phone: '(11) 91111-2222',
    notes: 'Cobertura no pulso esquerdo.',
    photoUrls: ['https://picsum.photos/200/200?random=4'],
    totalSessions: 5,
    lastVisit: addDays(now, -10),
  }
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    clientId: 'c1',
    clientName: 'Alice Cooper',
    serviceId: '1',
    serviceName: 'Flash Tattoo (Pequena)',
    startAt: addHours(now, 2),
    endAt: addHours(now, 3),
    status: BookingStatus.CONFIRMED,
    price: 150,
    isPaid: true,
  },
  {
    id: 'b2',
    clientId: 'c2',
    clientName: 'Bob Marley',
    serviceId: '3',
    serviceName: 'Sessão Fechamento (Manga)',
    startAt: addDays(now, 1),
    endAt: addDays(addHours(now, 1), 4), // Next day, +4 hours duration
    status: BookingStatus.PENDING,
    price: 800,
    isPaid: false,
  },
  {
    id: 'b3',
    clientId: 'c4',
    clientName: 'Diana Prince',
    serviceId: '2',
    serviceName: 'Design Personalizado (Médio)',
    startAt: addDays(now, -1), // Yesterday
    endAt: addDays(addHours(now, -1), 3),
    status: BookingStatus.COMPLETED,
    price: 450,
    isPaid: true,
  },
];

export const MOCK_REQUESTS: TattooRequest[] = [
  {
    id: 'r1',
    clientName: 'João da Silva',
    clientEmail: 'joao.silva@email.com',
    clientPhone: '(11) 91234-5678',
    description: 'Gostaria de fazer um leão realista no antebraço, com olhos azuis.',
    bodyPart: 'Antebraço Direito',
    size: '15cm x 10cm',
    style: 'Realismo Preto e Cinza',
    budget: 'R$ 800 - R$ 1000',
    photoUrls: ['https://picsum.photos/300/300?random=10'],
    availableDays: ['Segunda à tarde', 'Quarta o dia todo'],
    createdAt: addDays(now, -1),
    status: RequestStatus.PENDING,
  },
  {
    id: 'r2',
    clientName: 'Maria Oliveira',
    clientEmail: 'maria.oli@email.com',
    clientPhone: '(21) 99876-5432',
    description: 'Rosas delicadas fineline.',
    bodyPart: 'Ombro',
    size: 'Pequena',
    style: 'Fineline',
    budget: 'A combinar',
    photoUrls: ['https://picsum.photos/300/300?random=11'],
    availableDays: ['Finais de semana'],
    createdAt: addDays(now, -2),
    status: RequestStatus.NEGOTIATING,
    adminNotes: 'Pedi foto do local, aguardando resposta.',
  }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', type: TransactionType.INCOME, amount: 150, description: 'Alice Cooper - Flash', category: 'Serviço', date: addDays(now, 0), bookingId: 'b1' },
  { id: 't2', type: TransactionType.EXPENSE, amount: 50, description: 'Suprimentos de Tinta', category: 'Materiais', date: addDays(now, -1) },
  { id: 't3', type: TransactionType.INCOME, amount: 450, description: 'Diana Prince - Personalizado', category: 'Serviço', date: addDays(now, -1), bookingId: 'b3' },
  { id: 't4', type: TransactionType.EXPENSE, amount: 1200, description: 'Aluguel do Estúdio', category: 'Aluguel', date: addDays(now, -5) },
  { id: 't5', type: TransactionType.INCOME, amount: 200, description: 'Sinal - Bob', category: 'Serviço', date: addDays(now, -2) },
];