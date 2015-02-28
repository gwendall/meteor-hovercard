Package.describe({
  name: "gwendall:hovercard",
  summary: "Simple, reactive hovercards",
  version: "0.1.2"
});

Package.on_use(function (api, where) {

  api.use([
    "jquery@1.11.3",
    "tracker@1.0.5",
    "templating@1.0.11",
    "gwendall:body-events@0.1.3"
  ], "client");

  api.add_files([
    "lib.html",
    "lib.css",
    "lib.js",
  ], "client");

  api.export("HoverCard", "client");

});
