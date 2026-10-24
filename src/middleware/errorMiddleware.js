export function notFound(req, res, _next) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err, _req, res, _next) {
  if (err.name === "CastError" || err.name === "BSONError") return res.status(400).json({ message: "Invalid resource ID or value" });
  if (err.name === "ValidationError") return res.status(400).json({ message: err.message });
  if (err.code === 11000) return res.status(409).json({ message: "A record for this key already exists" });
  if (err instanceof SyntaxError && "body" in err) return res.status(400).json({ message: "Invalid JSON body" });
  console.error(err);
  res.status(err.status || 500).json({ message: err.status ? err.message : "Internal server error" });
}
