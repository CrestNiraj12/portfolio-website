module.exports = (req, path, token) => {
  const port = process.env.PORT || 3000;
  console.log(port);
  console.log(port === 80);
  console.log(path);
  return (
    req.protocol +
    "://" +
    (process.env.NODE_ENV === "production" ? req.get("host") : "localhost") +
    (port === 80 || port === 443 ? "" : `:${port}`) +
    path +
    token
  );
};
