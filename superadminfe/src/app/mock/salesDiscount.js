import { faker } from '@faker-js/faker';

// ----------------------------------------------------------------------

const salesDiscount = [...Array(200)].map((_, index) => ({
  id: faker.string.uuid(),
  discountId: `PRT000${faker.number.int(10)}`,
  discountName: `SCH00${faker.number.int(10)}`,
  discountBase: "Flat",
  startDate: "20/03/2023",
  endDate: "5/5/2023",
  discountPercentage: "5%",
}));

export default salesDiscount;
