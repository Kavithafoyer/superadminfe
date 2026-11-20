import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const territoryList = [...Array(200)].map((_, index) => ({
  id: faker.string.uuid(),
  territoryId: `TER00${faker.number.int(10)}`,
  territoryName: sample([
    "North India",
    "South India",
    "Central Office",
    "Zonal Office",
    "Abroad Office",
    "Bay of Bengal",
    "Asia",
  ]),
  headOfTerritory: sample([
    "Tamil Selvan",
    "Gokulraj",
    "Prakash",
    "Ponkumar",
    "Ravi Kumar",
    "Karthick",
    "Vishwanathan",
  ]),
  parentOrChild: sample(["Parent", "Child"]),
}));

export default territoryList;