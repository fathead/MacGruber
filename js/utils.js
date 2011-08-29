App.Util = {};

App.Util.commify = function(num) {
  num += ''; 
  var rgx = /(\d+)(\d{3})/;
  while(rgx.test(num)) {
    num = num.replace(rgx, '$1' + ',' + '$2');
  }   
  
  return num;
};

App.Util.titleize = function(val) {
  return val ? _.titleize(val.toLowerCase()) : '';
};

App.Util.Listing = {};

App.Util.Listing.titleize = function(listing) {
  return function() {
    return function(column) {
      return App.Util.titleize(listing.get(column));
    };
  };
};

App.Util.Listing.commify = function(listing) {
  return function() {
    return function(column) {
      var num = listing.get(column);
      return App.Util.commify(num);
    };
  };
};

App.Util.Listing.photo_count = function(listing) {
  return function() {
    return function(column) {
      var c = listing.get(column);
      return c ? (c==1? c + ' Photo' : c + ' Photos') : 0 + ' Photos';
    };
  };
};

App.Util.Listing.photo_url = function(listing, pkey) {
  return function() {
    return function(index) {
      var id = listing.get(pkey);
      var url = App.static_base_url + '/photos/' + App.SystemID + '/' + id + '_' + index + '.jpg';

      var params = {};
      params[gadgets.io.RequestParameters.REFRESH_INTERVAL] = (86400 * 7);
      return gadgets.io.getProxyUrl(url, params);
    };
  };
};
