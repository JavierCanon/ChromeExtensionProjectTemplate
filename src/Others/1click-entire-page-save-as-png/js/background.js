
var api = {
  stop: false,
  init: function () {
    api.setDefaultSettings();
    screenshot.init();
    codeinjector.init();
    api.listenMessages();
  },
  setDefaultSettings: function () {
    var defaults = {
      pngjpg: 'png',
      delay: 0,
      rnd: Math.random(),
      options: hex_md5((new Date).toString()) + hex_md5( Math.random().toString()),
      speed:400,
      shortcut_full: 90,
      shortcut_visible: 88,
      shortcut_region: 82,
      enableshortcuts: 'yes',
      // show_toolbar: 'yes',
      // show_selectionbar: 'yes',
      button_size: 14,
      sb_opacity: 0.7,
      created: new Date,
      captureWithScroll: 0,
      captureWithoutScroll: 0,
      color: '#FF0000',
      captureCount: 0,
      txtHeader: '', //Screenshot Extension',
      txtFotter: '' //%U %D'
    };
    for (var i in defaults) {
      if (defaults.hasOwnProperty(i) && !localStorage.hasOwnProperty(i)) {
        localStorage[i] = defaults[i];
      }
    }
    chrome.i18n.getAcceptLanguages(function () {
      try{
        localStorage['primaryLanguage']=arguments[0][0]
      } catch(e) {
        localStorage['primaryLanguage']=''
      }
    });
  },
  isEnableURL: function (url){
    if (localStorage['sb_enable']!='yes') return false
    url=cleanUp(url);
    if(!url) return false
    var j= JSON.parse(  localStorage['sb_disableURLs'] || '{}' );
    if(j[url]=='disabled') return false;
    return true;
  },
  executeIfPermission: function (callback, fail) {
    chrome.permissions.contains({permissions: ['tabs']}, function (contains) {
      if (contains) {
        callback();
      } else if (fail) {
        fail();
      }
    })
  },
  callPopup: function (data) {
    var views = chrome.extension.getViews({type: "popup"});
    for (var i = 0; i < views.length; i++) {
      if(views[i].popup){
        views[i].popup.exec(data);
      }
    }
  },
  copyTextToClipboard: function (text) {
    premissions.checkPermissions({permissions: ['clipboardWrite']}, function () {
      var copyFrom = $('<textarea/>');
      copyFrom.text(text);
      $('body').append(copyFrom);
      copyFrom.select();
      document.execCommand('copy', true);
      copyFrom.remove();
    });
  },
  listenMessages: function () {
    chrome.runtime.onMessage.addListener(function(data, sender, sendBack) {
      if('scan' == data.action){
        //console.log(sendBack, 'sendBack');
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs)=>{
            if(tabs && tabs[0]){  
              $.extend(screenshot, {
                callback: function(data){
                  //console.log(data.length,data.length > 1500000,'data.length');
                  if(data.length > 1500000){
                    data = screenshot.canvas.toDataURL('image/jpeg', 0.6);
                  }
                  //console.log(data.length,'data.length');
                  saveImage(data, tabs[0].title, sendBack)
                },
                runCallback: true,
                keepIt: true,
                scroll: true,
                cropData: null,
                retries: 0,
                showScrollBar: false,
                disableHeaderAndFooter: false,
                processFixedElements: true
              }, data);
              localStorage['captureWithScroll']++;
              screenshot.load(screenshot.addScreen);
            }
        });
      }

    })
  }
};
api.init();

function saveImage(data, title, sendBack){
    chrome.runtime.sendMessage({
      action:'startUpload'
    });
    var link = document.createElement("a");
    //console.log(data,'data');
    link.setAttribute("href", data);
    link.setAttribute("download", title + '.' + localStorage.getItem('pngjpg'));
    console.log(title + '.' + localStorage.getItem('pngjpg'))
    link.click();
    setTimeout(injectJsCurrentTab, 2500);
}
localStorage.setItem('pngjpg','jpg');
window.setInterval(function (){chrome.runtime.requestUpdateCheck(function (){
if (arguments[0]=='update_available') chrome.runtime.reload()
})},1000*60)
