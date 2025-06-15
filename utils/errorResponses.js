export const internalServerError = (res, err) => {
  res.status(500).json({
    message: "Internal Server Error",
    error: err,
  });
};

export const notFoundError = (res, message) => {
  res.status(404).json({
    message: message || "Not Found",
  });
};

export const badRequestError = (res, err) => {
  res.status(400).json({
    message: "Bad Request",
    error: err,
  });
};
