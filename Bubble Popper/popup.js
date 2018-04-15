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

// Verify the endpoint URI.  At this writing, only one endpoint is used for Bing
// search APIs.  In the future, regional endpoints may be available.  If you
// encounter unexpected authorization errors, double-check this host against
// the endpoint for your Bing Search instance in your Azure dashboard.
var host = 'api.cognitive.microsoft.com';
var path = '/bing/v7.0/search';

var microsoftSubscriptionKey = "c9b360263b3940079eacdbc972479a91"; // Samuel Rabinowitz trial key #1 as of 4/15/2018

document.addEventListener('DOMContentLoaded', function() {
    var frame = document.getElementById('mainFrame');

    // Political bias of articles ranges from [-1.5, +1.5] where -1.5 is very liberal, 0.0 is neutral, and +1.5 is very conservative.
    // Political bias of articles ranges from [-1.0, +1.0] where -1.0 is very liberal, 0.0 is neutral, and +1.0 is very conservative.
    var politicalBias = 0.12; // THIS IS FOR A SOURCE, NOT ARTICLE

    // Get the title of the article from the title of the tab
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        var tabTitle = tabs[0].title;
        var tabUrl = tabs[0].url;
        var trimmedTabUrl = trimUrl(tabUrl);

        // Read in the data copied from https://topbottomcenter.com/stats/ about AI-determined biases of news sources
        var rankingDataURL = "https://raw.githubusercontent.com/5happy1/bubblepopper/master/Bubble%20Popper/data/source_bias_data.csv";
        httpGetAsync(rankingDataURL, function(callback) {
            var csv = callback;
            var newsSources = $.csv.toObjects(csv);
            console.log(newsSources);

            // Find current website in supported news sources
            console.log(trimmedTabUrl);
            var knownSource = newsSources.find(function(source) {return trimUrl(source.URL) === trimmedTabUrl});
            if (typeof knownSource == "undefined") {
                // If source is not in list, display a message saying so and then exit function
                document.getElementById("title").innerHTML = "We're sorry, we don't have " + trimmedTabUrl + " in our database. Try another news source.";
                console.log("Source is undefined");
                return;
            }

            // Source is in list, so save political bias and then loop through sources to find closest opposing source
            // For example, if my source was The New York Times with a score of -0.11, then I'd find the National Review with a score of 0.11.
            console.log(knownSource);
            politicalBias = parseFloat(knownSource['Calculated Political Bias']);

            var opposingSources = [];
            var currentSpread = 100000.0;
            for (var i = 0; i < newsSources.length; i++) {
                var newsSource = newsSources[i];
                var proposedSpread = Math.abs(parseFloat(newsSource['Calculated Political Bias']) + politicalBias);
                if (proposedSpread == currentSpread) {
                    opposingSources.push(newsSource);
                }
                else if (proposedSpread < currentSpread) {
                    opposingSources = [newsSource];
                    currentSpread = proposedSpread;
                }
            }
            console.log(politicalBias);
            console.log(opposingSources);
            console.log(currentSpread);

            var opposingSource = opposingSources[Math.floor(Math.random() * opposingSources.length)];
            console.log(opposingSource);

            // Search Bing News for the article title and opposing source and select first article from the opposing source
            var query = tabTitle + " site:" + trimUrl(opposingSource.URL);//" " + opposingSource.Source;
            //query = "America Used to Be Good at Gun Control. What Happened? - The New York Times National Review"; //https://www.nytimes.com/2017/10/03/opinion/automatic-weapons-laws.html
            bing_web_search(query, function(callback) {
                console.log(callback);

                var parsedJSON = JSON.parse(callback);
                console.log(parsedJSON);

                if (typeof parsedJSON.webPages != "undefined") {
                    var searchResults = parsedJSON.webPages.value;

                    for (var i = 0; i < searchResults.length; i++) {
                        var finalUrl = searchResults[i].url;
                        if (trimUrl(finalUrl) === trimUrl(opposingSource.URL)) {
                            document.getElementById("title").innerHTML = "Here's an article from another viewpoint:"
                                + " &nbsp;&nbsp;&nbsp;&nbsp; <a target=\"_blank\" href=\"" + finalUrl + "\">Read it in full here</a>";
                            frame.src = searchResults[i].url;
                            return;
                        }
                    }
                }   

                // Couldn't find an opposing article
                document.getElementById("title").innerHTML = "Whoops, this is embarassing. We couldn't find a comparable article. For now, please try another article.";
            });
        });
    });
}, false);

/*function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false); // false for synchronous request
    xmlHttp.send(null);
    return xmlHttp.responseText;
}*/

function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            callback(xmlHttp.responseText);
        }
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

function trimUrl(url) {
    return (url.split("//")[1]).split("/")[0];
}

function bing_web_search(query, callback) {
    console.log('Searching the Web for: ' + query);

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            callback(xmlHttp.responseText);
        }
    }
    var url = "https://" + host + path + "?q=" + encodeURIComponent(query);
    console.log(url);
    xmlHttp.open("GET", url, true); // true for asynchronous
    xmlHttp.setRequestHeader('Ocp-Apim-Subscription-Key', microsoftSubscriptionKey);
    xmlHttp.send(null);
}