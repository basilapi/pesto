'use strict';

describe('pesto.version module', function() {
  beforeEach(module('pesto.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
