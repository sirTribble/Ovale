// Make sure we got a filename on the command line.
if (process.argv.length < 3) {
  console.log('Usage: node ' + process.argv[1] + ' FILENAME');
  process.exit(1);
}
// Read the file and print its contents.
var fs = require('fs')
  , filename = process.argv[2], output = process.argv[3];
fs.readFile(filename, 'utf8', function(err, data) {
  if (err) throw err;
  data = data.replace(/--\[\[/g, '/*');
  data = data.replace(/\]\]-*/g, '*/');
  data = data.replace(/--/g, '//');
  data = data.replace(/\blocal function\b/g, 'function');
  data = data.replace(/\band\b/g, '&&');
  data = data.replace(/\bor\b/g, '||');
  data = data.replace(/\blocal\b/g, 'var');
  data = data.replace(/:/g, '.');
  data = data.replace(/\belse\b/g, '} else {');
  data = data.replace(/\bnot\b\s*/g, '!');
  data = data.replace(/\belseif\b/g, '} else if');
  data = data.replace(/\bif\b(.*?)then/g, 'if ($1) {');
  data = data.replace(/~=/g, '!=');
  data = data.replace(/\bnil\b/g, 'null');
  data = data.replace(/=(\s*\{[^}]*?\})/g, (match, $1) => '=' + $1.replace(/=/g,':'));
  data = data.replace(/ \.\. /g, ' + ');
  data = data.replace(/\bwhile\b(.*?)\bdo\b/g, 'while ($1) {');
  data = data.replace(/\bfor\b\s+(\w+)\s*=\s*(.*?),(.*?)\s+do\s*$/gm, (match, $1, $2, $3) => `for (let ${$1} = ${$2} ; ${$1} <= ${$3}; ${$1}++) {`);
  data = data.replace(/^(\s+)for\b\s+(\w+),\s*(\w+)\s*in\s+ipairs\(([^)]*?)\)\s+do\s*$/gm, (match, $0, $1, $2, $3) => `${$0}for (let ${$1} = 1; ${$1} <= len(${$3}); ${$1}++) {${$0}    let ${$2} = ${$3}[${$1}];`);
  data = data.replace(/^(\s+)for\b\s+(\w+),\s*(\w+)\s*in\s+pairs\(([^)]*?)\)\s+do\s*$/gm, (match, $0, $1, $2, $3) => `${$0}for (let ${$1} in ${$3}) {${$0}    let ${$2} = ${$3}[${$1}];`);
  data = data.replace(/\bfor\b(.*?)\bdo\b/g, 'for ($1) {');
  data = data.replace(/\bfunction\b([^"]*?)$/gm, 'function$1 {');
  data = data.replace(/\bdo\b/g, '{');
  data = data.replace(/\bend\b/g, '}');
  data = data.replace(/\brepeat\b/g, 'do {');
  data = data.replace(/\buntil\b(.*)$/gm, '} while (!($1))');
  data = data.replace(/\bself\b/g, 'this');
  data = data.replace(/([\w.]+)\[#\1\s*\+\s*1\s*\]\s*=(.*);?$/gm, "tinsert($1, $2)")
  data = data.replace(/#([\w.]+)/g, 'len($1)');
  fs.writeFile(output, data, 'utf8');
});