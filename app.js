const e = require('express');
e().set('view engine', 'ejs').use(e.json(), e.urlencoded({ extended: true }), e.static('public'), require('./router'))
  .listen(process.env.PORT || 3000, () => console.log('→ http://localhost:' + (process.env.PORT || 3000)));
