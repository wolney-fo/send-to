export class RecentCloneError extends Error {
  constructor() {
    super("Correspondence sent recently.");
  }
}
