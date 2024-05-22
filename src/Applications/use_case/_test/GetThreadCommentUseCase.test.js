const CommentRepository = require("../../../Domains/comments/CommentRepository");
const GetThreadCommentsUseCase = require("../GetThreadCommentUseCase");

describe('getThreadCommentsUseCase', () => {
  it('should orchestrate the get comments action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const mockComments = [
      {
        id: 'comment-123',
        username: 'user1',
        date: new Date('2023-01-01T00:00:00Z'),
        content: 'This is a comment',
        is_delete: false,
      },
      {
        id: 'comment-124',
        username: 'user2',
        date: new Date('2023-01-02T00:00:00Z'),
        content: 'This is another comment',
        is_delete: true,
      },
    ];

    const expectedComments = [
      {
        id: 'comment-123',
        username: 'user1',
        date: '2023-01-01T00:00:00.000Z',
        content: 'This is a comment',
      },
      {
        id: 'comment-124',
        username: 'user2',
        date: '2023-01-02T00:00:00.000Z',
        content: '**komentar telah dihapus**',
      },
    ];

    // Create mock of CommentRepository
    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockComments));

    // Create use case instance
    const getThreadCommentsUseCase = new GetThreadCommentsUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    const comments = await getThreadCommentsUseCase.execute(threadId);

    // Assert
    expect(comments).toEqual(expectedComments);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(threadId);
  });
});
