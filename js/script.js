$(document).ready(function() {
  App.view_state = new App.Model.ViewState();
  App.user_prefs = new App.Model.Preferences({ search_mode: 'list' });
  App.main_view = new App.View.Main( { model: App.view_state } );

  App.system = new App.Model.System();
  App.search = new App.Model.Search();
  App.search_nav = new App.Model.SearchNav();
  App.property_types = new App.Collection.PropertyTypes();
  App.sortby_options = new App.Collection.SortOptions();
  App.listings = new App.Collection.Listings();
  App.property_type_list = new App.View.PropertyTypeList({ collection: App.property_types });

  App.sortby_list = new App.View.SortByList({ collection: App.sortby_options });

  var pager_top = new App.View.Pager({ collection: App.listings, parent_el: $('#search .nav-container-top') });
  var pager_bottom = new App.View.Pager({ collection: App.listings, parent_el: $('#search .nav-container-bottom') });
  
  App.sort_options = new App.Collection.SortOptions();
  App.search_modes = new App.Collection.SearchModeOptions();
  App.search_mode_view = new App.View.SearchModeList({ collection: App.search_modes });
  App.search_modes.fetch();

  var listings_list = new App.View.SearchResults({ collection: App.listings, system: App.system });
});
