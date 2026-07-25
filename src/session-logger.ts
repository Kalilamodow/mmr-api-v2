type LogType = "info" | "warn" | "error";

type Log = {
  time: number;
  from: string;
  text: string;
  type: LogType;
};

class Logger {
  private logs: Log[];

  constructor() {
    this.logs = [];
    this.log("Global", "Starting up...");
  }

  public log(service: string, text: string, type?: LogType) {
    this.logs.push({
      from: service,
      text,
      time: Date.now(),
      type: type || "info",
    });
  }

  public getLogs() {
    return this.logs;
  }
}

const logger = new Logger();
export default logger;
