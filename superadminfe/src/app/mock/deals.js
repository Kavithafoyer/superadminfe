import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const deals = [...Array(200)].map((_, index) => ({
  id: faker.string.uuid(),
  customerName: faker.person.fullName(),
  company: faker.company.name(),
  phone: faker.phone.number(),
  dealAmount: "300",
  dealProbability: "50 %",
  dealStage: sample(["Proposal Submitted", "Decision Maker", "Won/Lost"]),
  lastContactedAt: "21 Dec 2021",
  lastContactedBy: "Subramanian",
}));

export default deals;