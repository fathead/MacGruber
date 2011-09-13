App.View.SortOption = Backbone.View.extend({
  tagName: "li",
  
  events: {
    "click": "selected"
  },

  initialize: function() {
    _.bindAll(this, "render", "selected", "toggle");
    
    this.model.bind("change:selected", this.toggle);
  },  

  render: function() {
    var tmpl = ich.sort_option_tmpl(this.model.toJSON());
    $(this.el).html(tmpl);
    return this;
  },

  selected: function() {
    var model = this.model;

    model.set({ selected: true });
    model.collection.each(function(option) {
      if (model.cid !== option.cid) option.set({ selected: false });
    });
  },

  toggle: function() {
    if (this.model.get('selected')) {
      $(this.el).addClass('on');

      App.search_nav.set({ SortBy: this.model, Offset: 0 });
    } else {
      $(this.el).removeClass('on');
    }
  }
});

App.View.SortByList = Backbone.View.extend({
  el: $('.sortby-container'),

  events: {
    "click dt": "toggleMenu"
  },

  initialize: function() {
    _.bindAll(this, "render", "refresh", "select", "toggleMenu", "hideMenu");
    
    this.collection.bind('reset', this.render);
    this.collection.bind('change:selected', this.select);
    App.search.bind('change:Class', this.refresh);
    App.view_state.bind('change:click', this.hideMenu);
  },

  refresh: function() {
    this.collection.fetch( App.search.get('Class').get('ClassName') );
  },

  select: function(option) {
    if (!option.get('selected')) return;

    var tmpl = ich.sort_option_tmpl(option.toJSON());
    this.$('dt').html(tmpl);

    this.$('ul').hide();
  },

  render: function() {
    var self = this;
    self.$('ul').empty();

    self.collection.each(function(option, index) {
      var row = new App.View.SortOption({ model: option });
      self.$('ul').append(row.render().el);

      if (index === 0) self.setDefault(row);
    });
  },
  
  setDefault: function(row) {
      App.search_nav.set({ SortBy: row.model }, { silent: true });
      $(row.el).addClass('on');
      row.model.set({ selected: true }, { silent: true });
      this.select(row.model);
  },

  toggleMenu: function(e) {
    e.preventDefault();
    this.$('ul').toggle();
  },

  hideMenu: function(model, e) {
    if ( $(e.target).is('.sortby-container dt') ) return;
    if ( $(e.target).is('.sortby-container dt a') ) return;
    this.$('ul').hide();
  }
});
