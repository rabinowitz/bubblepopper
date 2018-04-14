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
document.addEventListener('DOMContentLoaded', function() {
  var frame = document.getElementById('mainFrame');

  var politicalBias = 0.12; // Political bias ranges from [-1.5, +1.5] where -1.5 is very liberal, 0.0 is neutral, and +1.5 is very conservative.

  // Get the title of the article from the title of the tab
  chrome.tabs.getSelected(null, function(tab) {
    var articleTitle = tab.title;

    // Read in the data copied from https://topbottomcenter.com/stats/ about AI-determined biases of news sources
    var new File("/source_bias_data.csv");
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(event){
      var csv = event.target.result;
      var newsSources = $.csv.toObjects(csv);
      console.log(newsSources);
    }
  });
  frame.src = "";//"https://m.bing.com/"
}, false);