/**
 * Some useful function for shorten Ti interface.
 */
(function(context) {
     context.info = context.info || function(message) { Ti.API.info(message); };
     context.debug = context.debug || function(message) { Ti.API.debug(message); };
     context.error = context.error || function(message) { Ti.API.error(message); };
     context.warn = context.warn || function(message) { Ti.API.warn(message); };
     context.log = context.log || function(message) { Ti.API.log(message); };
     context.currentWindow = context.currentWindow || function() { return Ti.UI.currentWindow; };
     context.currentTab = context.currentTab || function() { return Ti.UI.currentTab; };
     context.win = context.win || context.currentWindow;
     context.tab = context.tab || context.currentTab;
     context.extend = context.extend || function (Child, Parent) {
         var F = function(){};
         F.prototype = Parent.prototype;
         Child.prototype = new F();
         Child.prototype.constructor = Child;
         Child.uber = Parent.prototype;
     };
     context.isValidDate = function (d) {
         if ( Object.prototype.toString.call(d) !== "[object Date]" ) {
             return false;
         }
         return !isNaN(d.getTime());
     };
     context.dbExec = context.dbexcute || function (sql) {
         info('Model sql: ' + sql);
         if (context.db) {
             context.db.close();
         }
         context.db = Ti.Database.install(DB_PATH, DB_NAME);
         return context.db.execute(sql);
     };
     var parsePath = function (path) {
         var ms = /^(?:\/)?([\w\-_.]+)(?:\/)?([\w\-_.]*)$/.exec(path);
         if (ms && ms.length > 2) {
             var dirName = ms[1], fileName = ms[2];
             if (fileName == '') {
                 fileName = dirName;
                 dirName = '';
             }
             return {dir: dirName, file: fileName};
         }
         return null;
     };
     context.saveFile = context.saveFile || function (path, buffer) {
         info('saveFile path:'.concat(path));
         var pathInfo = parsePath(path);
         if (pathInfo) {
             var dir = Titanium.Filesystem.getFile(
                 Ti.Filesystem.applicationDataDirectory, pathInfo.dir);
             if (!dir.exists()) {
                 dir.createDirectory();
             }
             var file = Ti.Filesystem.getFile(dir.nativePath, pathInfo.file);
             file.write(buffer);
             return file;
         }
         return null;
     };
     context.getFile = context.getFile || function (path) {
         info('getFile path:'.concat(path));
         var pathInfo = parsePath(path);
         if (pathInfo) {
             var dir = Ti.Filesystem.getFile(
                 Ti.Filesystem.applicationDataDirectory, pathInfo.dir);
             if (dir.exists()) {
                 return Ti.Filesystem.getFile(dir.nativePath, pathInfo.file);
             }
         }
         return null;
     };
 })(this);
