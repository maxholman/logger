import type { Jsonify, JsonObject, JsonPrimitive } from 'type-fest';
import { LogData, LogDescriptor, PlainTransformer } from '../logger.js';
import { safeStringify, withNullProto } from '../utils.js';

// const levelToStringMap = new Map<Level, string>([
//   [Level.Trace, 'trace'],
//   [Level.Debug, 'debug'],
//   [Level.Info, 'info'],
//   [Level.Warn, 'warn'],
//   [Level.Error, 'error'],
//   [Level.Fatal, 'fatal'],
// ]);

interface LogFormat {
  level: number;
  time: string;
  msg?: JsonPrimitive;
  ctx?: LogData;
}

export type JsonLogFormat = JsonObject & Jsonify<LogFormat>;

export const jsonTransformer: PlainTransformer = (
  log: LogDescriptor,
): string => {
  const { level, time, ctx, data, msg } = log;

  const jsonLog: LogFormat = withNullProto({
    level,
    time: time.toISOString(),
    msg,
    ...data,
    ctx,
  });

  return `${safeStringify(jsonLog)}\n`;
};
