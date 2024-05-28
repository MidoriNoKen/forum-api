class LikeUseCase {
  constructor({ likeRepository, threadRepository, commentRepository }) {
    this._likeRepository = likeRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCaseParam, userIdFromAccessToken) {
    const { threadId, commentId } = useCaseParam;

    await this._threadRepository.verifyExistingThread(threadId);
    await this._commentRepository.verifyExistingComment(commentId);

    const like = await this._likeRepository.getLike(
      threadId,
      commentId,
      userIdFromAccessToken,
    );

    if (like.length) return this._likeRepository.removeLike(like[0].id);

    return this._likeRepository.addLike(
      threadId,
      commentId,
      userIdFromAccessToken,
    );
  }
}

module.exports = LikeUseCase;