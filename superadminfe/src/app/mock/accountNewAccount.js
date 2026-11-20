import { faker } from '@faker-js/faker';

// ----------------------------------------------------------------------

const accountNewContacts = [...Array(200)].map((_, index) => ({
  id: faker.string.uuid(),
  company: faker.company.name(),
  email: faker.internet.email(),
  AccountName: faker.person.fullName(),
  phone: faker.phone.number(),
  contactPerson: faker.person.fullName(),
  owner: faker.person.lastName(),
}));

export default accountNewContacts;
