module.exports = function errorHandler(err, req, res, _next) {
    console.error(err);
    const code = Number(err.status || err.code) >= 400 ? Number(err.status || err.code) : 500;
    res.status(code).json({
      success: false,
      code,
      error: err.message || 'Internal Server Error',
    });
  };
  