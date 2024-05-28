const LikeRepository = require('../../Domains/likes/LikeRepository');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addLike(threadId, commentId, userId) {
    const id = `like-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3, $4)',
      values: [id, threadId, commentId, userId],
    };

    await this._pool.query(query);

    return { status: 'success' };
  }

  async removeLike(id) {
    const query = {
      text: 'DELETE FROM likes WHERE id = $1',
      values: [id],
    };

    await this._pool.query(query);

    return { status: 'success' };
  }

  async getLike(threadId, commentId, userId) {
    const query = {
      text: 'SELECT id FROM likes WHERE thread_id = $1 AND comment_id = $2 AND user_id = $3',
      values: [threadId, commentId, userId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async getLikesByThreadId(threadId) {
    const query = {
      text: 'SELECT * FROM likes WHERE thread_id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = LikeRepositoryPostgres;