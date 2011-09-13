App.View.PropertyTypeRow = Backbone.View.extend({
  tagName: "li",
  className: "count",

  events: {
    "click": "selected"
  },
  
  initialize: function() {
    _.bindAll(this, "render", "selected", "toggle", "displayCount");

    this.model.bind('change:selected', this.toggle);
    this.model.bind("change:listing_count", this.displayCount);
  },

  render: function() {
    var self = this;
    this.model.set( { 
      _titleize: function() {
        return function(column) {
          return App.Util.titleize(self.model.get(column).toLowerCase());
        };
      }
    });

    var tmpl = ich.property_type_tmpl(this.model.toJSON());
    $(this.el).html(tmpl);
    return this;
  },
  
  selected: function() {
    var model = this.model;

    model.set({ selected: true });
    model.collection.each(function(type) {
      if (model.cid !== type.cid) type.set({ selected: false });
    });
  },

  toggle: function() {
    if (this.model.get('selected')) {
      $(this.el).addClass('on');
      App.search_nav.reset();
      App.search.reset().set({ Class: this.model });
    } else {
      $(this.el).removeClass('on');
    }
  },

  displayCount: function() {
    this.$('span').text(this.model.get('listing_count'));

    if( this.model.get('selected') ) {
      $('#type dt span').text(this.model.get('listing_count'));
    }
  }
});

App.View.PropertyTypeList = Backbone.View.extend({
  el: $('#type'),

  events: {
    "click dt": "toggleMenu"
  },

  initialize: function() {
    _.bindAll(this, "render", "select", "toggleMenu", "hideMenu");
    
    this.collection.bind('reset', this.render);
    this.collection.bind('change:selected', this.select);
    App.view_state.bind('change:click', this.hideMenu);
  },

  select: function(type) {
    if (!type.get('selected')) return;

    var tmpl = ich.property_type_tmpl(type.toJSON());
    this.$('dt').html(tmpl);

    this.$('ul').hide();
  },

  render: function() {
    var self = this;

    this.collection.each(function(type, index) {
      var row = new App.View.PropertyTypeRow({ model: type });
      self.$('ul').append(row.render().el);
      if (index === 0) row.selected();
    });
  },

  toggleMenu: function(e) {
    e.preventDefault();
    this.$('ul').toggle();
  },

  hideMenu: function(model, e) {
    if ( $(e.target).is('#type dt') ) return;
    if ( $(e.target).is('#type dt a') ) return;
    if ( $(e.target).is('#type dt span') ) return;

    this.$('ul').hide();
  }
});
