const os = require('os')
const path = require('path')
const glob = require('glob')

/*多应用基础目录路径*/
const appBaseEntryPath = './src/module/';
/*自定要打包的子应用入口*/
const appEntryPaths = [];

function extractEntryList(){
  let globResult = glob.sync(appBaseEntryPath+'*/'),
    dirNames = [],
    dirNamesStr = '';

  globResult.forEach(function (val, index) {
    let dirName = val.split('/').reverse()[1];
    dirNamesStr+='\t'+dirName+',\n';
    // dirNames.push(dirName);
  });
  console.log(dirNamesStr);

}
// extractEntryList();

console.log(path.join(os.homedir(),'/buildLog/'));
