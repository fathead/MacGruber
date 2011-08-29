App.View = {};

App.View.Main = Backbone.View.extend({
  el: $('#main'),

  events: {
    "click": "click"
  },

  initialize: function() {
    _.bindAll(this, "click");
  },

  click: function(e) {
    this.model.set({ click: e });
  }
});

App.View.SearchModeItem = Backbone.View.extend({
  tagName: "li",

  events: {
    "click": "select"
  },

  initialize: function() {
    _.bindAll(this, "select", "render");
  },

  select: function() {
    App.user_prefs.set({ search_mode: this.model.get('Value') });
  },

  render: function() {
    var tmpl = ich.sort_option_tmpl(this.model.toJSON());
    $(this.el).html(tmpl);
    $(this.el).addClass(this.model.get('position'));
    if (this.model.get('selected')) $(this.el).addClass('active');
    return this;
  }
});

App.View.SearchModeList = Backbone.View.extend({
  tagName: "ul",
  className: "search-mode",
  
  initialize: function() {
    _.bindAll(this, "render");
    this.collection.bind("reset", this.render);
  },

  render: function() {
    var self = this;

    self.collection.each(function(option) {
      var item = new App.View.SearchModeItem({ model: option });
      $(self.el).append(item.render().el);
    });

    $('#search .nav-container').prepend(this.el);
  }
});
