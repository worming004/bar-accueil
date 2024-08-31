import "fake-indexeddb/auto";

import { getBufferByEnv, Buffer } from "./buffer";
import { buildElectronique, Command } from "./command";

function buildDummyCommand(): Command {
  return buildElectronique([{
    count: 2,
    name: "orange",
    displayColor: "orange",
    shape: "round",
    value: 2
  }], 4);
}

describe('buffer reducer', () => {
  let buffer: Buffer
  beforeEach(() => {
    buffer = getBufferByEnv();
  });
  afterEach(() => {
    buffer.destroy_onlyfortest();
  });

  it('should handle initial state', () => {
    expect(buffer).not.toBeNull();
  });

  it('should add command', async () => {
    buffer.addCommand(buildDummyCommand());
    var commands = await buffer.getCommands();
    expect(commands.length).toBe(1);
    expect(commands[0].amount).toBe(buildDummyCommand().amount);
  });
});

export { }
