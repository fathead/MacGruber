App.Util = {};

App.Util.sync = function(method, model, options) {
  options.timeout = 10000;
  options.dataType = 'jsonp';

  return Backbone.sync(method, model, options);
};

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
      var url = _.sprintf('%s/%s/GetObject?ID=%s&w=%d&h=%d&q=%d'
        , App.service_base_url
        , App.SystemID
        , id + ':' + index
        , 140
        , 105
        , 80
      );

      var params = {};
      params[gadgets.io.RequestParameters.REFRESH_INTERVAL] = (86400 * 7);
      return gadgets.io.getProxyUrl(url, params);
    };
  };
};

App.Util.Listing.lookup = function(listing, Table, Lookups) {
  return function() {
    return function(SystemName) {
      var column = Table[SystemName];
      var val = listing.get(SystemName);
      var lookup = Lookups[ column.LookupName ];
      var type = _.detect(lookup.LookupType, function(t) {
        return t.Value == val ? true : false;
      });

      return type.LongValue;
    };
  };
};

Date.fromISO= (function(){
    var diso= Date.parse('2011-04-26T13:16:50Z');
    if(diso=== 1303823810000) return function(s){
        return new Date(Date.parse(s));
    }
    else return function(s){
        if (!s) return NaN;

        var day, tz, 
        rx= /^(\d{4}\-\d\d\-\d\d([tT][\d:\.]*)?)([zZ]|([+\-])(\d\d):(\d\d))?$/, 
        p= rx.exec(s) || [];
        if(p[1]){
            day= _.map(p[1].split(/\D/), function(itm){
                return parseInt(itm, 10) || 0;
            });
            day[1]-= 1;
            day= new Date(Date.UTC.apply(Date, day));
            if(!day.getDate()) return NaN;
            if(p[5]){
                tz= parseInt(p[5], 10)*60;
                if(p[6]) tz += parseInt(p[6], 10);
                if(p[4]== "+") tz*= -1;
                if(tz) day.setUTCMinutes(day.getUTCMinutes()+ tz);
            }
            return day;
        }
        return NaN;
    }
})()

App.Util.Listing.days_on_market = function(listing) {
  var m_in_day = 1000 * 86400;

  return function() {
    return function(SystemName) {
      var val = listing.get(SystemName);
      if (!val) return 'Unknown';

      var d = (new Date().getTime()) - Date.fromISO(val).getTime();
      //console.log('Date: %s, DOM: %s', val, Math.floor(d / m_in_day));

      return Math.floor(d / m_in_day);
    };
  };
};
