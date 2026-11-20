import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const ticketSummaryList = [...Array(200)].map((_, index) => ({
  id: faker.string.uuid(),
  avatar: faker.image.avatar(),
  ticketName: "Proin ac augue lacus",
  lastChatted: sample(["10 min", "1 hr", "2 hr", "3 hr"]),
  name: sample(["Angel Reid", "Desiree Mclaughlin", "Damon palmer", "Ugene"]),
  priority: sample(["High", "Medium", "Low", "Critical", "Trivial"]),
}));

export default ticketSummaryList;