import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const contacts = [...Array(200)].map((_, index) => ({
  id: faker.string.uuid(),
  contactName: faker.person.fullName(),
  company: faker.company.name(),
  phone: faker.phone.number(),
  email: faker.internet.email(),
  status: sample(["active", "inactive"]),
  country: sample([
    "India",
    "Singapore",
    "Malaysia",
    "Ukrain",
    "Japan",
    "Uk",
    "Canada",
  ]),
  city: sample([
    "Chennai",
    "Mumbai",
    "Delhi",
    "Gujarat",
    "Kolkata",
    "Rajasthan",
    "Hydrabad",
  ]),
}));

export default contacts;
