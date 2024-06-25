export class ExpiredCorrespondenceError extends Error {
  constructor() {
    super("Correspondence expired.");
  }
}
