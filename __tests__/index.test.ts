import { describe, test, expect } from '@jest/globals';
import { testLogger, testVanillaLogger } from './helpers.js';

describe('Basic', () => {
  test('Object', async () => {
    const [logger, logPromise] = testLogger();
    logger.warn({ omg: true });
    await expect(logPromise).resolves.toMatchSnapshot();
  });

  test('Error Object', async () => {
    const [logger, logPromise] = testVanillaLogger();
    logger.error(Object.assign(new Error('hallo'), { debug: 'wooyeah' }));
    await expect(logPromise).resolves.toMatchSnapshot();
  });

  test('Error Object serialized on non-error level', async () => {
    const [logger, logPromise] = testVanillaLogger();
    logger.info(new Error('hallo'));
    await expect(logPromise).resolves.toMatchSnapshot();
  });

  // test('Object with undefined props', async () => {
  //   const [logger, logPromise] = testLogger();
  //   logger.warn({ omg: undefined });
  //   await expect(logPromise).resolves.toMatchSnapshot();
  // });

  test('String, Object', async () => {
    const [logger, logPromise] = testLogger();
    logger.warn('hello', { omg: true });
    await expect(logPromise).resolves.toMatchSnapshot();
  });

  test('String Format, Object', async () => {
    const [logger, logPromise] = testLogger();
    logger.warn('hello %o', { omg: true });
    await expect(logPromise).resolves.toMatchSnapshot();
  });

  test('Object, String Format, String', async () => {
    const [logger, logPromise] = testLogger();
    logger.warn({ omg: true }, 'hello %s', 'world');
    await expect(logPromise).resolves.toMatchSnapshot();
  });

  test('Object, String Format, String', async () => {
    const [logger, logPromise] = testLogger();
    logger.warn({ omg: true }, 'hello %s:%s %d', 'world', 'and', 123);
    await expect(logPromise).resolves.toMatchSnapshot();
  });

  test('Object + String = Format', async () => {
    const [logger, logPromise] = testLogger();
    logger.warn({ omg: true }, 'hello');
    await expect(logPromise).resolves.toMatchSnapshot();
  });

  test('Trace Caller Auto (development)', async () => {
    process.env.NODE_ENV = 'development';
    const [logger, logPromise] = testLogger();
    logger.warn('hello');
    await expect(logPromise).resolves.toHaveProperty('caller');
  });

  test('Trace Caller Auto (production)', async () => {
    process.env.NODE_ENV = 'production';
    const [logger, logPromise] = testLogger();
    logger.warn('hello');
    await expect(logPromise).resolves.not.toHaveProperty('caller');
  });

  test('Trace Caller Force (production)', async () => {
    process.env.NODE_ENV = 'production';
    const [logger, logPromise] = testLogger({
      traceCaller: true,
    });
    logger.warn('hello');
    await expect(logPromise).resolves.toMatchSnapshot();
  });

  test('Trace Caller Force (development)', async () => {
    process.env.NODE_ENV = 'development';
    const [logger, logPromise] = testLogger({
      traceCaller: false,
    });
    logger.warn('hello');
    await expect(logPromise).resolves.not.toHaveProperty('caller');
  });

  test('Mixins basic + accum', async () => {
    const [logger, logPromise] = testLogger({
      mixins: [
        () => ({
          logger: {
            go: 'log',
          },
        }),
        () => ({
          luger: {
            go: 'bang',
          },
        }),
        (accum) => ({
          accum,
        }),
      ],
    });
    logger.warn('hello');
    await expect(logPromise).resolves.toMatchSnapshot();
  });

  test('Mixins property overwrite', async () => {
    const [logger, logPromise] = testLogger({
      mixins: [
        () => ({
          logger: {
            go: 'log',
          },
        }),
        () => ({
          logger: {
            go: 'brrr',
          },
        }),
      ],
    });
    logger.warn('hello');
    await expect(logPromise).resolves.toMatchSnapshot();
  });
});
