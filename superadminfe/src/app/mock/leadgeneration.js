import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

export const leadGenerationList = [...Array(200)].map((_, index) => ({
  id: faker.string.uuid(),
  listId: `L000${sample(["12", "25"])}`,
  leadListName: sample(["Caddy code", "Phantom tech","Tamilselvan .co","JP and sons","Foyer"]),
  nos: sample(["350", "250", "547", "246", "450"]),
  geography: sample(["Bangalore", "Hydrabad"]),
  industry: "IT Industry",
}));

export const unqualifiedLeads = [...Array(200)].map((_, index) => ({
  id: faker.string.uuid(),
  leadId: `L000${sample(["12", "25"])}`,
  enqDate: "04/05/2022",
  phone: faker.phone.number(),
  email: faker.internet.email(),
  leadName: sample(["Karbon software", "Alexa software"]),
  location: sample(["Chennai", "Hydrabad"]),
  qualify: sample([true, false]),
}));

export const unqualifiedLeadsEnquiry = [...Array(200)].map((_, index) => ({
  id: faker.string.uuid(),
  leadId: `L000${sample(["12", "25"])}`,
  enqDate: "04/05/2022",
  phone: faker.phone.number(),
  email: faker.internet.email(),
  leadName: sample(["Karbon software", "Alexa software"]),
  location: sample(["Chennai", "Hydrabad","Bangalore"]),
  qualify: sample([true, false]),
  enquiry: sample([
    "Please let me know the cost of implementation of your application",
    "I would like to know the cost of implementation of your application",
  ]),
}));
