module.exports = (req, path, token) => {
  const port = process.env.PORT || 3000;
  console.log(req.get("host"));
  return (
    req.protocol +
    "://" +
    (process.env.NODE_ENV === "production"
      ? req.get("host").split(":")[0]
      : "localhost") +
    (port === 80 || port === 443 ? "" : `:${port}`) +
    path +
    token
  );
};
