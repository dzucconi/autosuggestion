import states from '../../app/javascripts/lib/states';

describe('states', () => {
  it('builds a list of every typed state', () => {
    states('foo bar')
      .should.eql(['f', 'fo', 'foo', 'foo ', 'foo b', 'foo ba', 'foo bar']);
  });
});
