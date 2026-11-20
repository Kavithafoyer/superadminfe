import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const activityStreamList = [...Array(200)].map((_, index) => ({
  id: faker.string.uuid(),
  contact: faker.person.fullName(),
  activity: "Call",
  timeFrom: "11.00 AM",
  timeTo: "1.00 PM",
  contactPerson: faker.person.fullName(),
  receiver: faker.person.fullName(),
  status: sample(["Completed", "InCompleted"]),
  nextDate: "24/03/2020",
}));

export default activityStreamList;
