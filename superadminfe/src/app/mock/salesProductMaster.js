import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const salesProductMaster = [...Array(200)].map((_, index) => ({
  id: faker.string.uuid(),
  productId: `PRT000${faker.number.int(10)}`,
  productName: `SCH00${faker.number.int(10)}`,
  productCategory: `SCH00${faker.number.int(10)}`,
  skuCode: `PO00${faker.number.int(10)}`,
  brand: sample(["Irfan", "Antonia", "Hacer", "Ugene"]),
  rating: `ORD000${faker.number.int(10)}`,
}));

export default salesProductMaster;
