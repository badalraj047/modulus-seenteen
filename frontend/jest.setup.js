// Jest runs in Node, not on a real device/emulator, so native modules that
// rely on the native binary (gesture-handler, async-storage) need mocks here.
// These are the standard, library-documented Jest mocks for each package.
require('react-native-gesture-handler/jestSetup');

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
