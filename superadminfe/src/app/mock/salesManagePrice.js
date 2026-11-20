import { faker } from '@faker-js/faker';

// ----------------------------------------------------------------------

const salesManagePrice = [...Array(200)].map((_, index) => ({
  id: faker.string.uuid(),
  priceBookId: `PRT000${faker.number.int(10)}`,
  priceBookName: `SCH00${faker.number.int(10)}`,
  pricingRule: "Markups",
  startDate: "20/03/2023",
  endDate: "5/5/2023",
}));

export default salesManagePrice;