import { faker } from '@faker-js/faker';

// ----------------------------------------------------------------------

const productCataloque = [...Array(200)].map((_, index) => ({
  id: faker.string.uuid(),
  cataloqueId: `PRT000${faker.number.int(10)}`,
  cataloqueName: `SCH00${faker.number.int(10)}`,
  currency: "INR",
  effectiveDate: "20/03/2023",
  endDate: "5/5/2023",
  discount: "5%",
  leadType: "1 Mon",
}));

export default productCataloque;
