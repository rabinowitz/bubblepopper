document.addEventListener('DOMContentLoaded', function() {
  var titleButton = document.getElementById('titleButton');
  titleButton.addEventListener('click', function() {

    chrome.tabs.getSelected(null, function(tab) {
      document.getElementById('pageTitle').innerHTML = tab.title;
    });
  }, false);
}, false);