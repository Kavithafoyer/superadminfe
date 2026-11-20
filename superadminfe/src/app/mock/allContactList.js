import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const allContacts = [...Array(200)].map((_, index) => ({
  id: faker.string.uuid(),
  contactName: faker.person.fullName(),
  message: sample([
    "Call me again",
    "No Activity",
    "Get an appointment",
    "Send your Product Catalogue",
    "Visit our Office",
    "Meet us on our office",
    "Not interested",
  ]),
  phone: faker.phone.number(),
  todayCall: sample([true, false]),
  bgcolor: sample(["blue", "green", "yellow", "red"]),
}));

export default allContacts;
