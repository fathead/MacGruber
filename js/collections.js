App.Collection = {};

App.Collection.Listings = Backbone.Collection.extend({
  model: App.Model.Listing,
  url: function() {
    return _.sprintf('%s/%s/Search', App.service_base_url, App.SystemID);
  },
  initialize: function() {
    _.bindAll(this, "parse");
  },
  parse: function(res) {
    
    this.RETS = {
      ReplyCode: res.ReplyCode,
      ReplyText: res.ReplyText,
      COUNT: res.COUNT
    };
    
    if (res.DATA) {
      var models = [];
      _.each(res.DATA, function(row) {
        var model = {};
        _.each(row, function(col, index) {
          model[ res.COLUMNS[index] ] = col;
        });
        models.push(model);
      });
      return models;
    }

    return [];
  },

  sync: App.Util.sync
});

App.Collection.UserSearches = Backbone.Collection.extend({
  model: App.Model.Search
});

App.Collection.UserListingsViewed = Backbone.Collection.extend({
  model: App.Model.ListingViewed
});

App.Collection.UserInfoRequests = Backbone.Collection.extend({
  model: App.Model.InfoRequest
});

App.Collection.UserShowingRequests = Backbone.Collection.extend({
  model: App.Model.ShowingRequest
});

App.Collection.PropertyTypes = Backbone.Collection.extend({
  model: App.Model.PropertyType,

  initialize: function() {
    _.bindAll(this, "fetch", "deSelectAll");
    App.system.bind('change', this.fetch);
  },

  deSelectAll: function() {
    this.each(function(model) { model.set({ selected: false }); });
  },

  fetch: function() {
    var self = this;

    var System = App.system.get('System');
    var Resource = System.Resource;
    var Classes = Resource.Property.Class
  
    var models = []; 
    _.each(Classes, function(c, index) {
      var type = new App.Model.PropertyType({
        Description: c.Description,
        ClassName: c.ClassName,
        ResourceID: Resource.Property.ResourceID,
        selected: false
      });

      var listings = new App.Collection.Listings();
      listings.fetch({ data: {
        SearchType: 'Property',
        Class: c.ClassName,
        Count: 2,
      }});
   
      listings.bind("reset", function() {
        type.set({ listing_count: listings.RETS.COUNT });
      });
       
      models.push(type);
    });

    self.reset(models);
  }
});

App.Collection.SortOptions = Backbone.Collection.extend({
  model: App.Model.SortOption,

  initialize: function() {
    _.bindAll(this, "fetch");
  },

  fetch: function(ClassName) {
    this.reset(App.SortOptions[ClassName]);
  }
});

App.Collection.SearchModeOptions = Backbone.Collection.extend({
  model: App.Model.SearchModeOption,

  initialize: function() {
    _.bindAll(this, "fetch");
  },
  
  fetch: function() {
    this.reset([
      { Display: 'List', Value: 'list', selected: true, position: 'left' },
      { Display: 'Photo', Value: 'photo', selected: false, position: 'middle' },
      { Display: 'Map', Value: 'map', selected: false, position: 'right' }
    ]);
  }
});
