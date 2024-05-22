class GetThreadCommentsUseCase {
    constructor({ commentRepository }) {
      this._commentRepository = commentRepository;
    }
  
    async execute(threadId) {
      const comments = await this._commentRepository.getCommentsByThreadId(threadId);
      return comments.map((comment) => ({
        id: comment.id,
        username: comment.username,
        date: comment.date.toISOString(),
        content: comment.is_delete ? '**komentar telah dihapus**' : comment.content,
      }));
    }
  }
  
  module.exports = GetThreadCommentsUseCase;
  