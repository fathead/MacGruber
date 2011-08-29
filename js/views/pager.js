App.View.Pager = Backbone.View.extend({
  //el: $('#search .nav'),
  //tagName: 'div',
  className: 'pager',

  events: {
    "click a.previous": "previousPage",
    "click a.next": "nextPage"
  },

  initialize: function() {
    _.bindAll(this, "render", "previousPage", "nextPage");
    this.collection.bind('reset', this.render);
  },

  render: function() {
    var total = this.collection.RETS.COUNT;
    var offset = App.search_nav.get('Offset');
    var limit = App.search_nav.get('Limit');

    var range_start = (offset + 1);
    var range_end = offset + limit;

    var tmpl = ich.pager_tmpl({ 
      total: App.Util.commify(this.collection.RETS.COUNT),
      range_start: range_start,
      range_end: (range_end > total ? total : range_end),
      show_previous: (offset ? true : false),
      show_next: (offset + limit > total ? false : true)   
    });
    $('#search .nav-container').prepend($(this.el).html(tmpl));
    
    return this;
  },

  previousPage: function(e) {
    e.preventDefault();

    var offset = App.search_nav.get('Offset');
    var limit = App.search_nav.get('Limit');

    var new_offset = offset - limit;
    App.search_nav.set({ Offset: new_offset }); 
  },

  nextPage: function(e) {
    e.preventDefault();

    var offset = App.search_nav.get('Offset');
    var limit = App.search_nav.get('Limit');

    var new_offset = offset + limit;
    App.search_nav.set({ Offset: new_offset }); 
  }
});
