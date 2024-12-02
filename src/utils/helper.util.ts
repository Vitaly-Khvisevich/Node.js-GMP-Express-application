import { Response } from 'express';

export function createEmptyError(res:Response, status:number, message: string) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ data: null, error: { message } }));
}

export function createEmptyAnswer(res: Response, cart: {Code: number; answerData: object}) {
  res.setHeader('Content-Type', 'application/json');
  res.status(cart.Code).json(cart.answerData);
}

export function createBodyOfResponse(
  errorNumber:number,
  message: string | null,
  data: object | null = null,
) {
  const fullAnswer = { Code: errorNumber, answerData: {} };
  const answer = message ? { data, error: { message } } : { data, error: message };
  fullAnswer.answerData = answer;
  return fullAnswer;
}

export function getDurationInMilliseconds(start: [number, number]) {
  const [seconds, nanoseconds] = process.hrtime(start);
  return (seconds * 1000 + nanoseconds / 1e6).toFixed(0); // convert to milliseconds and round
}
