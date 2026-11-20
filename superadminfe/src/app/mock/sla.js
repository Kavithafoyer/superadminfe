import { faker } from '@faker-js/faker';

// ----------------------------------------------------------------------

const slaList = [...Array(200)].map((_, index) => ({
  id: faker.string.uuid(),
  slaName: `SLA ${faker.number.int(10)}`,
  customerName: "Foyer",
  escalationLevel: `${faker.number.int(10)}`,
  fromDate: `24/04/2023`,
  endDate: `24/04/2023`,
  target: "Urgent",
}));

export default slaList;
