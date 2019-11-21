export interface PeriodicTask {
  readonly interval: number;
  execute(): Promise<boolean>;
}
