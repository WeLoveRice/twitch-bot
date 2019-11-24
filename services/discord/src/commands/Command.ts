export interface Command {
  isValid(): Promise<boolean>;
  execute(): Promise<boolean>;
}
