'use strict';

angular.module('pesto.version', [
  'pesto.version.interpolate-filter',
  'pesto.version.version-directive'
])

.value('version', '0.2');
