App.Model = {};

App.Model.ViewState = Backbone.Model.extend();

App.Model.System = Backbone.Model.extend({
  initialize: function() {
    this.fetch();
  },

  url: function() {
    return _.sprintf('%s/%s/GetMetadata', App.service_base_url, App.SystemID);
  }
});
App.Model.Listing = Backbone.Model.extend();

App.Model.SortOption = Backbone.Model.extend();
App.Model.User = Backbone.Model.extend();
App.Model.Preferences = Backbone.Model.extend();
App.Model.Search = Backbone.Model.extend({
  defaults: {},

  initialize: function() {
    _.bindAll(this, "reset");
  },

  reset: function() {
    this.clear({ silent: true });
    this.set( this.defaults, { silent: true });
  
    return this;
  }
});

App.Model.SearchNav = Backbone.Model.extend({
  defaults: {
    Offset: 0,
    Limit: 20
  },

  initialize: function() {
    _.bindAll(this, "reset");
  },

  reset: function() {
    this.clear({ silent: true });
    this.set( this.defaults, { silent: true });

    return this;
  }
});
App.Model.ListingViewed = Backbone.Model.extend();
App.Model.InfoRequest = Backbone.Model.extend();
App.Model.ShowingRequest = Backbone.Model.extend();

App.Model.Location = Backbone.Model.extend();
App.Model.PropertyType = Backbone.Model.extend();
App.Model.SearchModelOption = Backbone.Model.extend();
