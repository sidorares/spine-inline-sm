var fs = require('fs');
var path = require('path');

function makeSmInline(name) {
  var src = fs.readFileSync(name, 'utf8');
  var smRx = /\/\/@ sourceMappingURL=(.*)/;
  var match = src.match(smRx);
  if(match) {
    try {
      var map = JSON.parse(fs.readFileSync(match[1], 'utf8'));
      map.sourcesContent = [];
      map.sources.forEach(function(name, idx) {
        map.sourcesContent[idx] = fs.readFileSync(path.join(map.sourceRoot, name), 'utf8');
      });
      var prefix = '//@ sourceMappingURL=data:application/json;base64,';
      var comment = prefix + Buffer(JSON.stringify(map)).toString('base64') + '\n';
      fs.writeFileSync(name + '.bak', src);
      fs.writeFileSync(name, src.replace(smRx, comment));
    } catch(e) {
    }
  }
}

process.argv.slice(2).forEach(makeSmInline);
