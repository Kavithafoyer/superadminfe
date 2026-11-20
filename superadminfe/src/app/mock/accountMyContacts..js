import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const accountMyContacts = [...Array(200)].map((_, index) => ({
  id: faker.string.uuid(),
  company: faker.company.name(),
  AccountName: faker.person.fullName(),
  AccountId: `ACC000${sample[(1, 19, 8, 9, 2, 3, 4, 5, 6, 7)]}`,
  phone: faker.phone.number(),
  date: "03/03/2023",
  address: "industrial estate,Perungudi,Chennai",
  industry: sample(["IT", "Finance", "Travel Tourism", "Marketing", "Sales"]),
}));

export default accountMyContacts;
