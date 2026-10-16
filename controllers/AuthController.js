const asyncHandler = require('../utils/asyncHandler');

/** Nhận request, gọi AuthService, trả response. */
class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  register = asyncHandler(async (req, res) => {
    const result = await this.authService.register(req.body);
    res.status(201).json(result);
  });

  login = asyncHandler(async (req, res) => {
    const result = await this.authService.login(req.body);
    res.json(result);
  });
}

module.exports = AuthController;
