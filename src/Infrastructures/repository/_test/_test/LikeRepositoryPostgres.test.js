const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');
const LikeRepository = require('../../../Domains/likes/LikeRepository');

describe('LikeRepositoryPostgres', () => {
  it('should be instance of LikeRepository domain', () => {
    const likeRepositoryPostgres = new LikeRepositoryPostgres({}, {});

    expect(likeRepositoryPostgres).toBeInstanceOf(LikeRepository);
  });

  describe('behavior test', () => {
    afterEach(async () => {
      await LikesTableTestHelper.cleanTable();
      await CommentsTableTestHelper.cleanTable();
      await ThreadsTableTestHelper.cleanTable();
      await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await pool.end();
    });

    describe('addLike function', () => {
      it('should add like and return success response correctly', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({});
        await ThreadsTableTestHelper.addThread({});
        await CommentsTableTestHelper.addComment({});

        const fakeIdGenerator = () => '123';
        const likeRepositoryPostgres = new LikeRepositoryPostgres(
          pool,
          fakeIdGenerator,
        );

        // Action
        const addedLike = await likeRepositoryPostgres.addLike(
          'thread-123',
          'comment-123',
          'user-123',
        );

        // Assert
        const like = await LikesTableTestHelper.findLikeById('like-123');

        expect(addedLike).toStrictEqual({ status: 'success' });
        expect(like).toBeDefined();
      });
    });

    describe('removeLike function', () => {
      it('should remove like and return success response correctly', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({});
        await ThreadsTableTestHelper.addThread({});
        await CommentsTableTestHelper.addComment({});
        await LikesTableTestHelper.addLike({});

        const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

        // Action
        const removedLike = await likeRepositoryPostgres.removeLike('like-123');

        // Assert
        expect(removedLike).toStrictEqual({ status: 'success' });
      });
    });

    describe('getLike function', () => {
      it('should return array contains correctly', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({});
        await ThreadsTableTestHelper.addThread({});
        await CommentsTableTestHelper.addComment({});
        await LikesTableTestHelper.addLike({});

        const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

        // Action
        const like = await likeRepositoryPostgres.getLike(
          'thread-123',
          'comment-123',
          'user-123',
        );

        // Assert
        expect(like).toHaveLength(1);
      });
    });

    describe('getLikesByThreadId function', () => {
      it('should return likes correctly', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({});
        await ThreadsTableTestHelper.addThread({});
        await CommentsTableTestHelper.addComment({});
        await LikesTableTestHelper.addLike({});
        await LikesTableTestHelper.addLike({ id: 'like-234' });
        await LikesTableTestHelper.addLike({ id: 'like-345' });

        const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

        // Action
        const likes = await likeRepositoryPostgres.getLikesByThreadId(
          'thread-123',
        );

        // Assert
        expect(likes).toHaveLength(3);
      });
    });
  });
});
