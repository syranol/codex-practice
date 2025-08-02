const fs = require('fs');
const path = require('path');

test('index.html matches snapshot', () => {
  const html = fs.readFileSync(path.join(__dirname, '../public/index.html'), 'utf8');
  expect(html).toMatchSnapshot();
});
