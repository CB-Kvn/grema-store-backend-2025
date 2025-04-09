// middlewares/sanitizeInput.ts
import { Request, Response, NextFunction } from 'express';
import sanitizeHtml from 'sanitize-html';

const sanitize = (
  value: any,
  path: string,
  logger: (info: string) => void
): any => {
  if (typeof value === 'string') {
    const sanitized = sanitizeHtml(value, {
      allowedTags: [],
      allowedAttributes: {},
      allowedIframeHostnames: [],
    });

    if (sanitized !== value) {
      logger(
        `[XSS DETECTED] Path: ${path} | Original: "${value}" | Sanitized: "${sanitized}"`
      );
    }

    return sanitized;
  } else if (Array.isArray(value)) {
    return value.map((v, i) => sanitize(v, `${path}[${i}]`, logger));
  } else if (typeof value === 'object' && value !== null) {
    const sanitizedObj: Record<string, any> = {};
    for (const key in value) {
      sanitizedObj[key] = sanitize(value[key], `${path}.${key}`, logger);
    }
    return sanitizedObj;
  }
  return value;
};

const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  const baseLogInfo = `[${new Date().toISOString()}] ${req.ip} ${req.method} ${req.originalUrl}`;

  const logger = (info: string) => {
    console.warn(`${baseLogInfo} - ${info}`);
    // También puedes guardar en archivo, base de datos, etc.
  };

  req.body = sanitize(req.body, 'body', logger);
  req.query = sanitize(req.query, 'query', logger);
  req.params = sanitize(req.params, 'params', logger);

  const userHeaders = Object.fromEntries(
    Object.entries(req.headers).filter(([key]) =>
      key.startsWith('x-') || key.startsWith('custom-')
    )
  );
  const sanitizedHeaders = sanitize(userHeaders, 'headers', logger);
  Object.assign(req.headers, sanitizedHeaders);

  const originalJson = res.json.bind(res);
  res.json = (data: any) => {
    const sanitizedData = sanitize(data, 'response', logger);
    return originalJson(sanitizedData);
  };

  next();
};

export default sanitizeInput;
