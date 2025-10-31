export const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    console.log("body", req.body);
    if (!result.success) {
      const seenFields = new Set();
      const errors = result.error.issues
        .filter((e) => {
          const field = e.path[0];
          if (seenFields.has(field)) return false;
          seenFields.add(field);
          return true;
        })
        .map((e) => ({
          field: e.path[0],
          message: e.message,
        }));

      return res.status(400).json({
        success: false,
        errors,
      });
    }

    next();
  };
};
