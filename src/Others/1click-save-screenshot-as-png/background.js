// const backend='http://localhost:80'
if(!localStorage.created){
	window.open('https://www.openscreenshot.com')
}
localStorage.created=(new Date()).valueOf()


const backend='https://www.openscreenshot.com'

chrome.browserAction.onClicked.addListener(screenshot)

function screenshot(){
	chrome.tabs.captureVisibleTab(data=>{
	var binary = atob(data.split(',')[1]);
	var array = [];
	for(var i = 0; i < binary.length; i++) {
		array.push(binary.charCodeAt(i));
	}
	x= new Blob([new Uint8Array(array)], {type: 'image/jpeg'})
	url=URL.createObjectURL(x)

	var filename;
	// filename=screenshot.title || screenshot.url;
	// filename=filename.replace(/[%&\(\)\\\/\:\*\?\"\<\>\|\/\]]/g,' ');
	// filename+='-' + (new Date).getHours().toString().twoDigits() + (new Date).getMinutes().toString().twoDigits() + (new Date).getSeconds().toString().twoDigits()
	// filename+=localStorage['pngjpg']=='png' ? '.png' : '.jpg';
	var filename='abc'

	var evt = document.createEvent("MouseEvents");evt.initMouseEvent("click", true, true, window,0, 0, 0, 0, 0, false, true, false, false, 0, null);
	a=$('<a></a>').appendTo(document.body);
	a.attr({'href':url,'download':filename})[0].dispatchEvent(evt)
	})
}

function random(){
	a='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_1234567890'
	s=''
	for(var i=0;i<20;i++){
	s+= a[parseInt(Math.random()*a.length)]
	}
	return s
}