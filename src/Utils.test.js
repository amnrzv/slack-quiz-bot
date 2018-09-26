const { shuffle } = require('./Utils');

describe('Shuffle test', () => {
    it('takes in an array and returns a shuffled version of it.', () => {
        expect(shuffle([1,2,3,4])).not.toEqual([1,2,3,4])
    })
});