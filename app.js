const Koa = require('koa');
const config = require('config');
const Router = require('koa-router');
const favicon = require('koa-favicon');
const serve = require('koa-static');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const fetch = require('node-fetch');
const pick = require('lodash/pick');

const mongoose = require('./libs/mongoose');
const Record = require('./models/Record');
const templatesHandler = require('./handlers/templatesHandler');
const errorsHandler = require('./handlers/errorsHandler');

const app = new Koa();

app.use(favicon('public/favicon.ico'));
app.use(serve('public'));
app.use(logger());
app.use(templatesHandler);
app.use(errorsHandler);
app.use(bodyParser({ jsonLimit: '56kb' }));

const router = new Router();

router
  .get('/', async (ctx, next) => {
    const records = await Record.find({});
    const recordsPublic = records.map(record => record.toObject());
    
    ctx.body = ctx.render('index.pug', {
      recordsPublic
    });
  })
  .post('/save', async function(ctx) {
    const record = await Record.create(pick(ctx.request.body, Record.publicFields));
    ctx.body = record.toObject();
  })
  .del('/:recordId', async function(ctx) {
    const id = ctx.params.recordId;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      ctx.throw(404);
    }
    
    const record = await Record.findById(id);
    await record.remove();
    ctx.body = {message: 'ok'};
  });

app.use(router.routes());

module.exports = app;
