App.View.SearchResultsItem = Backbone.View.extend({
  tagName: "div",
  events: {
    "click .photo": "open",
    "click .address": "open",
    "click .price": "open"
  },
  
  initialize: function() {
    _.bindAll(this, "render");
  },

  render: function() {
    var tmpl = ich[this.options.template](this.model.toJSON());
    $(this.el).html(tmpl);
    return this;
  },

  open: function() {
    //console.log('open');
  }
});

App.View.SearchResults = Backbone.View.extend({
  el: $('#results .list'),

  initialize: function() {
    _.bindAll(this, "render", "searchStateChanged", "searchNavStateChanged");

    this.collection.bind('reset', this.render);
    App.search.bind('change', this.searchStateChanged);
    App.search_nav.bind('change', this.searchNavStateChanged);
    App.user_prefs.bind('change:search_mode', this.render);
  },
  
  searchStateChanged: function() {
    $('#search').hide();
    $('.nav-container-bottom').hide();
    $('#search-loading').show();

    this.refreshSearch();
  },

  searchNavStateChanged: function() {
    $('#results').hide();
    $('.nav-container-bottom').hide();
    $('#results-loading').show();
    
    this.refreshSearch();
  },

  refreshSearch: function() {

    this.collection.fetch({ data: {
      limit: App.search_nav.get('Limit'),
      offset: App.search_nav.get('Offset'),
      SearchType: 'Property',
      Class: App.search.get('Class').get('ClassName'),
      SortBy: App.search_nav.get('SortBy').get('Value'),
      nocache: (new Date().getTime())
    } });
  },

  render: function() {
    var self = this;

    var display_modes = {
      list: {
        el: $('#search .list'),
        item_className: 'listing-row',
        item_template: 'results_list'
      },
      photo: {
        el: $('#search .mode_photos'),
        item_className: 'listing-row',
        item_template: 'results_photo'
      },
      map: {
        el: $('#search .map'),
        item_className: 'listing-info-window',
        item_template: 'results_map'
      }
    };
    _.each(display_modes, function(m) { m.el.empty(); });

    var mode = display_modes[ App.user_prefs.get('search_mode') ];
    self.el = mode.el;

    $('#search-loading').hide();
    $('#results-loading').hide();
    $('.nav-container-bottom').show();
    $('#search').show();
    $('#results').show();

    var System = self.options.system.get('System');
    var Resource = System.Resource.Property;
    var rClass = Resource.Class[ App.search.get('Class').get('ClassName') ];
    var Table = rClass.Table;
    var pkey = Resource.KeyField;

    self.collection.each(function(listing, index) {
      listing.set({ 
        position: (index + 1),
        _photo_count: App.Util.Listing.photo_count(listing),
        _photo_url: App.Util.Listing.photo_url(listing, pkey),
        _commify: App.Util.Listing.commify(listing),
        _titleize: App.Util.Listing.titleize(listing),
        _lookup: App.Util.Listing.lookup(listing, Table, Resource.Lookup),
        _days_on_market: App.Util.Listing.days_on_market(listing)
      });
      var row = new App.View.SearchResultsItem({ 
        model: listing, 
        className: mode.item_className,
        template: mode.item_template 
      });
      console.log(row.render().el);
      $(self.el).append(row.render().el); 
    });

    gadgets.window.adjustHeight();
  }
});
