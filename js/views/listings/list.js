App.View.ListingRow = Backbone.View.extend({
  tagName: "div",
  className: "listing-row",
  events: {
    "click .photo": "open",
    "click .address": "open",
    "click .price": "open"
  },
  
  initialize: function() {
    _.bindAll(this, "render");
  },

  render: function() {
    var tmpl = ich.listing_row(this.model.toJSON());
    $(this.el).html(tmpl);
    return this;
  },

  open: function() {
    console.log('open');
  }
});

App.View.ListingList = Backbone.View.extend({
  el: $('#results .list'),

  initialize: function() {
    _.bindAll(this, "render", "searchStateChanged", "searchNavStateChanged");

    this.collection.bind('reset', this.render);
    App.search.bind('change', this.searchStateChanged);
    App.search_nav.bind('change', this.searchNavStateChanged);
  },
  
  searchStateChanged: function() {
    $('#search').hide();
    $('#search-loading').show();

    this.refreshSearch();
  },

  searchNavStateChanged: function() {
    $('#results').hide();
    $('#results-loading').show();
    
    this.refreshSearch();
  },

  refreshSearch: function() {
    this.collection.fetch({ data: {
      limit: App.search_nav.get('Limit'),
      offset: App.search_nav.get('Offset'),
      SearchType: 'Property',
      Class: App.search.get('Class').get('ClassName'),
      nocache: (new Date().getTime())
    } });
  },

  render: function() {
    var self = this;

    $(self.el).empty();
    $('#search-loading').hide();
    $('#results-loading').hide();
    $('#search').show();
    $('#results').show();

    var System = self.options.system.get('System');
    var Resource = System.Resource.Property;
    var pkey = Resource.KeyField;

    self.collection.each(function(listing, index) {
      listing.set({ 
        position: (index + 1),
        _photo_count: App.Util.Listing.photo_count(listing),
        _photo_url: App.Util.Listing.photo_url(listing, pkey),
        _commify: App.Util.Listing.commify(listing),
        _titleize: App.Util.Listing.titleize(listing)
      });
      var row = new App.View.ListingRow({ model: listing});
      $(self.el).append(row.render().el); 
    });

    gadgets.window.adjustHeight();
  }
});
