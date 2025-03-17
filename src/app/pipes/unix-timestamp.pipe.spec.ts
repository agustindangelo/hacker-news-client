import { UnixTimestampPipe } from './unix-timestamp.pipe';

describe('UnixTimestampPipe', () => {
  let pipe: UnixTimestampPipe;

  beforeEach(() => {
    pipe = new UnixTimestampPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform a valid Unix timestamp to a formatted date and time string', () => {
    const timestamp = 1633046400;
    const transformed = pipe.transform(timestamp);
    expect(transformed).toMatch(/^\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}$/);
  });
});
