const LikeUseCase = require('../../../../Applications/use_case/LikeUseCase');

class LikesHandler {
  constructor(container) {
    this._container = container;

    this.putLikeHandler = this.putLikeHandler.bind(this);
  }

  async putLikeHandler(request, h) {
    const { id } = request.auth.credentials;

    const likeUseCase = this._container.getInstance(LikeUseCase.name);

    const status = await likeUseCase.execute(request.params, id);

    const response = h.response(status);

    response.code(200);

    return response;
  }
}

module.exports = LikesHandler;
