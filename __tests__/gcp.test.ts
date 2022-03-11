import {
  afterEach,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';
import { createLoggerWithWaitableMock } from './helpers.js';

describe('GCP', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date('2009-02-13T23:31:30.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('Cloud Run', async () => {
    const [logger, callback] = await createLoggerWithWaitableMock({
      logFormat: 'gcp',
    });

    logger.warn(new Error('hello'));
    await expect(callback.waitUntilCalled()).resolves.toMatchSnapshot();
  });

  test('Cloud Run Error Object', async () => {
    const [logger, callback] = await createLoggerWithWaitableMock({
      logFormat: 'gcp',
    });

    logger.error(new Error('Ded 1'));

    await expect(callback.waitUntilCalled()).resolves.toMatchSnapshot();
  });

  test('Cloud Run Fatal with Error Object', async () => {
    const [logger, callback] = await createLoggerWithWaitableMock({
      logFormat: 'gcp',
    });

    logger.fatal(new Error(`Ded 2`));

    await expect(callback.waitUntilCalled()).resolves.toMatchSnapshot();
  });
});
