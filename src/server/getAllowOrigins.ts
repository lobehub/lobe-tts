const ALLOW_ORIGINS = process.env?.ALLOW_ORIGINS?.split(',') || undefined;

export const getAllowOrigins = (req: Request) => {
  let origin = '*';

  if (ALLOW_ORIGINS) {
    const reqOrigin = req.headers.get('origin');
    if (reqOrigin && ALLOW_ORIGINS.includes(reqOrigin)) {
      origin = reqOrigin;
    } else {
      return;
    }
  }
  return origin;
};
