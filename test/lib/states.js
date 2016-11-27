import states from '../../app/javascripts/lib/states';

describe('states', () => {
  it('builds a word by word sequence of every typed state', () => {
    states('foo bar')
      .should.eql(['f', 'fo', 'foo', ' ', 'b', 'ba', 'bar']);
  });
});
