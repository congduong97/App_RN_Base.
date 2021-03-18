const Price = [
  {id: 1, name: '< 500 nghìn', priceFrom: 0, priceTo: 500000},
  {id: 2, name: '500 - 1 triệu', priceFrom: 500000, priceTo: 1000000},
  {id: 3, name: '1 - 3 triệu', priceFrom: 1000000, priceTo: 3000000},
  {id: 4, name: '3 - 5 triệu', priceFrom: 3000000, priceTo: 5000000},
  {id: 5, name: '5 - 10 triệu', priceFrom: 5000000, priceTo: 1.0e7},
  {id: 6, name: '10 - 20 triệu', priceFrom: 1.0e7, priceTo: 2.0e7},
  {id: 7, name: '20 - 50 triệu', priceFrom: 2.0e7, priceTo: 5.0e7},
  {id: 8, name: '50 - 100 triệu', priceFrom: 5.0e7, priceTo: 1.0e8},
  {id: 9, name: '> 100 triệu', priceFrom: 1.0e8, priceTo: 1.0e9},
];

const Fates = [
  {id: 1, key: 'Kim', name: 'Kim', backgroundColor: '#FFCB31'},
  {id: 2, key: 'Moc', name: 'Mộc', backgroundColor: '#63D543'},
  {id: 3, key: 'Thuy', name: 'Thủy', backgroundColor: '#00AFF9'},
  {id: 4, key: 'Hoa', name: 'Hỏa', backgroundColor: '#D20B15'},
  {id: 5, key: 'Tho', name: 'Thổ', backgroundColor: '#3D1C1A'},
];

export {Fates};
export default Price;
