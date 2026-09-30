const r = require('express').Router(), m = require('multer'), fs = require('fs'), path = require('path');
const up = m({ storage: m.diskStorage({ destination: 'public/uploads', filename: (q, f, c) => c(null, Date.now() + path.extname(f.originalname)) }) });
const db = n => ({ get: () => JSON.parse(fs.readFileSync(`data/${n}.json`)), set: d => fs.writeFileSync(`data/${n}.json`, JSON.stringify(d, null, 2)) });
const P = db('products'), O = db('orders');

r.get('/', (q, s) => s.render('index', { products: P.get() }));
r.get('/api/products', (q, s) => s.json(P.get()));
r.post('/api/products', up.single('photo'), (q, s) => {
  const p = { id: Date.now(), ...q.body, price: +q.body.price, photo: q.file?.filename || '' };
  P.set([...P.get(), p]); s.json(p);
});
r.put('/api/products/:id', up.single('photo'), (q, s) => {
  const a = P.get(), i = a.findIndex(p => p.id == q.params.id);
  if (i < 0) return s.sendStatus(404);
  a[i] = { ...a[i], ...q.body, price: +q.body.price, ...(q.file && { photo: q.file.filename }) };
  P.set(a); s.json(a[i]);
});
r.delete('/api/products/:id', (q, s) => { P.set(P.get().filter(p => p.id != q.params.id)); s.sendStatus(204); });
r.get('/api/orders', (q, s) => s.json(O.get()));
r.post('/api/orders', (q, s) => { O.set([...O.get(), { id: Date.now(), date: new Date(), ...q.body }]); s.json({ ok: 1 }); });
module.exports = r;
