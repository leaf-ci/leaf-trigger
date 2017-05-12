/**
 * ScriptsController class
 */
class ScriptsController {
  /**
   * [constructor description]
   * @param  {[type]} db       [description]
   * @param  {[type]} rabbitmq [description]
   * @param  {[type]} jwt      [description]
   * @return {[type]}          [description]
   */
  constructor(db, ch, jwt) {
    this.db = db;
    this.ch = ch;
    this.jwt = jwt;
  }
  /**
   * [authenticate description]
   * @param  {[type]}   request  [description]
   * @param  {[type]}   response [description]
   * @param  {Function} next     [description]
   * @return {[type]}            [description]
   */
  async authenticate(request, response, next) {
    const token = request.params.token;
    try {
      let {userId, tokenId} = this.jwt.verify(token, 'SECRET');
      if (tokenId) {
        await this.db.one(`
          SELECT id FROM tokens WHERE id=${tokenId}
        `, {tokenId});
      }
      request.userId = userId;
      next();
    } catch(e) {
      console.log(e);
      resonse.status(403).json('UNAUTHORIZED!');
    }
  }
  /**
   * [trigger description]
   * @param  {[type]} request  [description]
   * @param  {[type]} response [description]
   * @return {[type]}          [description]
   */
  async trigger(request, response) {
    const flow = {
      userId: request.userId,
      scriptId: request.params.scriptId,
    };
    try {
      const ch = await this.ch;
      const ok = await ch.assertQueue('flows')
      const msg = new Buffer(JSON.stringify(flow));
      await ch.sendToQueue('flows', msg);
      await channel.waitForConfirms();
      await this.db.one(`
        INSERT INTO flows(userId, scriptId)
        VALUES(\${userId}, \${scriptId})
      `, flow);
      response.status(200).json('SUCCESS!');
    } catch(e) {
      console.log(e);
      response.status(500).json('SERVER FAULT!');
    }
  }
}

module.exports = ScriptsController;
