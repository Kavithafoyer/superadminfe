import { faker } from '@faker-js/faker';

// ----------------------------------------------------------------------

const salesProductInward = [...Array(200)].map((_, index) => ({
  id: faker.string.uuid(),
  giNo: `PRT000${faker.number.int(10)}`,
  giDate: "21/02/2023",
  inwardSource: "Manufacture",
  supplierId: `SCP00${faker.number.int(10)}`,
  receivedBy: "Prakash",
}));

export default salesProductInward;
