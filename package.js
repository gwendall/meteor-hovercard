Package.describe({
  name: "gwendall:hovercard",
  summary: "Reactive popover based on Bootstrap 3",
  version: "0.1.0"
});

Package.on_use(function (api, where) {

  api.use([
    "jquery",
    "templating",
    "gwendall:body-events"
  ], "client");

	api.add_files([
    "lib.html",
    "lib.css",
		"lib.js",
	], "client");

  api.export("HoverCard", "client");

});
