const pug = require('pug');
const path = require('path');
const config = require('config');

module.exports = async (ctx, next) => {
  ctx.render = function(templatePath, locals) {
    return pug.renderFile(
      path.join(config.get('templatesRoot'), templatePath),
      locals
    );
  };

  await next();
};
