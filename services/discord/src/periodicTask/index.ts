export interface PeriodicTask {
  readonly interval: number;

  // Returns true when the peridodic task should end
  execute(): Promise<boolean>;
}
