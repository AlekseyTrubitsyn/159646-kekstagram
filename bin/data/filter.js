'use strict';

module.exports = function(list, filterID) {
  switch (filterID) {
    case 'filter-popular':
      return list.sort(function(a, b) {
        return b.likes - a.likes;
      });

    case 'filter-new':
      var timeLimit = Date.now() - 3 * 86400000;
      var filteredList = list.filter(function(a) {
        return a.created >= timeLimit;
      });
      return filteredList.sort(function(a, b) {
        return b.created - a.created;
      });

    case 'filter-discussed':
      return list.sort(function(a, b) {
        return b.comments - a.comments;
      });
  }
};
