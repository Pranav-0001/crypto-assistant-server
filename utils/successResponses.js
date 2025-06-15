export const response200 = (res, message, data) => {
  res.status(200).json({
    message: message || "Success",
    data: data,
  });
};

export const response201 = (res, message, data) => {
  res.status(201).json({
    message: message || "Created",
    data: data,
  });
};
