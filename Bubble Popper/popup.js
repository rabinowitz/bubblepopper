/*
document.addEventListener('DOMContentLoaded', function() {
  var titleButton = document.getElementById('titleButton');
  titleButton.addEventListener('click', function() {

    chrome.tabs.getSelected(null, function(tab) {
      document.getElementById('pageTitle').innerHTML = tab.title;
    });
  }, false);
}, false);
*/

$(document).ready(function() {

	var frame = document.createElement('iframe');

	frame.setAttribute('width', '100%');
	frame.setAttribute('height', '100%');
	frame.setAttribute('frameborder', '0');
	frame.setAttribute('id', 'rtmframe');

		$('body').height(300).width(200);
    frame.setAttribute('text', 'ihihi');
		//frame.setAttribute('src', 'http://m.bing.com');
	document.body.appendChild(frame);
});
