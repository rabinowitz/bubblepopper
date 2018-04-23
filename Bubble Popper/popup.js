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

var aylienConceptExtractionEndpoint = "https://api.aylien.com/api/v1/concepts";
var aylienApplicationKeyHeader = "X-AYLIEN-TextAPI-Application-Key";
var aylienApplicationIdHeader = "X-AYLIEN-TextAPI-Application-ID";
var aylienApplicationKey = "60fdcf5c8e987f18b2392384831a5ec4"; // Swathi's key
var aylienApplicationId = "35b179ce"; // Swathi's ID
var datArr = [[],[]];

var finalUrl = "";


document.addEventListener('DOMContentLoaded', function() {
    var frame = document.getElementById('mainFrame');

    // Political bias of articles ranges from [-1.5, +1.5] where -1.5 is very liberal, 0.0 is neutral, and +1.5 is very conservative.
    // Political bias of articles ranges from [-1.0, +1.0] where -1.0 is very liberal, 0.0 is neutral, and +1.0 is very conservative.
    var politicalBias = 0.12; // THIS IS FOR A SOURCE, NOT ARTICLE

    // Get the title of the article from the title of the tab
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        var tabTitle = tabs[0].title;
        var tabUrl = tabs[0].url;
      console.log(tabTitle);
        var trimmedTabUrl = trimUrl(tabUrl);

        // Read in the data copied from https://topbottomcenter.com/stats/ about AI-determined biases of news sources
        var rankingDataURL = "https://raw.githubusercontent.com/5happy1/bubblepopper/master/Bubble%20Popper/data/source_bias_data.csv";
        httpGetAsync(rankingDataURL, function(callback) {
           var csv = callback;
            var newsSources = $.csv.toObjects(csv);
            console.log(newsSources);

            // Find current website in supported news sources
            console.log(trimmedTabUrl);
            var knownSource = newsSources.find(function(source) {console.log(source.URL); return trimUrl(source.URL) === trimmedTabUrl});
            if (typeof knownSource == "undefined") {
                // If source is not in list, display a message saying so and then exit
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

            //var opposingSource = opposingSources[Math.floor(Math.random() * opposingSources.length)];
            //console.log(opposingSource);

            console.log(tabUrl);

            // Extract concepts for use in the Bing search using Aylien's concept extraction API
            aylien_concept_extraction(tabUrl, function(callback) {
                console.log(callback);
                var parsedJSON = JSON.parse(callback);
                var parsedConcepts = parsedJSON.concepts;
                console.log(parsedJSON);
                var arr;
                for(var i in parsedConcepts){
                  var newStr = i.replace(/_/g, " ");
                  var und = newStr.replace("http://dbpedia.org/resource/", "");
                  console.log(und);
                  var inside = parsedConcepts[i];
                  for(var t in inside){
                    if(t == 'support'){
                      var num = inside[t];
                     console.log(num);
                     if(und != null){
                       if(! knownSource.Source.toLowerCase().includes(und.toLowerCase())){
                         console.log(und);
                         console.log(knownSource.Source);
                       if(tabTitle.includes(und)){
                         console.log(und);
                         datArr.push([und,5]);
                       }
                       else{datArr.push([und,num]);
}
}
                   }
                 }

                  }
                }
                console.log(datArr);
                console.log(datArr.sort(compareSecondColumn));
                //.surfaceForms[0];
                // Select the top three concepts based on lowest support values


                searchBingUntilArticleFound(opposingSources);
            });
        });
    });
}, false);

// Recursively loop through opposing sources until an article is found on Bing
function searchBingUntilArticleFound(opposingSourcesIn) {
    var frame = document.getElementById('mainFrame');

    console.log(opposingSourcesIn);

    // Randomize array
    var opposingSources = shuffle(opposingSourcesIn);

    console.log(opposingSources);

    if (opposingSources.length == 0) {
        // Base case: Couldn't find an opposing article
        document.getElementById("title").innerHTML = "Whoops, this is embarassing. We couldn't find a comparable article. For now, please try another article.";
    }

    var opposingSource = opposingSources.pop();
    console.log(opposingSource);

    // Search Bing for the top three concepts and the opposing source and select first article from the oppsing source
    var query = datArr[0][0] + " " + datArr[1][0] + /*" " + datArr[2][0] +*/ " site:" + trimUrl(opposingSource.URL);// + opposingSource.Source;
    console.log(query);

    bing_web_search(query, function(callback) {
        console.log(callback);

        var parsedJSON = JSON.parse(callback);
        console.log(parsedJSON);

        if (typeof parsedJSON.webPages != "undefined") {
            var searchResults = parsedJSON.webPages.value;

            for (var i = 0; i < searchResults.length; i++) {
                finalUrl = searchResults[i].url;
                if (trimUrl(finalUrl) === trimUrl(opposingSource.URL)) {

                    document.getElementById("title").innerHTML = "Here's an article from another viewpoint:"
                        + " &nbsp;&nbsp;&nbsp;&nbsp; <a target=\"_blank\" href=\"" + finalUrl + "\">Read it in full here</a>";
                    try {
                        frame.src = finalUrl;
                        console.log("Displaying article with URL: " + frame.src);
                        frame.onload = function(){
                            var that = $(this)[0];
                            try{
                                that.contentDocument;
                            }
                            catch(err){
                                console.log("frame error");
                                frameError();
                            }
                        }
                    }
                    catch (err) {
                        frameError();
                    }
                    return;
                }
            }
        }

        console.log("no comparable article found, recursing onto next source in opposingSources list...");
        searchBingUntilArticleFound(opposingSources);
    });
}

/*function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false); // false for synchronous request
    xmlHttp.send(null);
    return xmlHttp.responseText;
}*/

function compareSecondColumn(a, b) {
    if (a[1] === b[1]) {
        return 0;
    }
    else {
        return (a[1] < b[1]) ? -1 : 1;
    }
}

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
    xmlHttp.open("GET", url, true);
    xmlHttp.setRequestHeader('Ocp-Apim-Subscription-Key', microsoftSubscriptionKey);
    xmlHttp.send(null);
}

function aylien_concept_extraction(url, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            callback(xmlHttp.responseText);
        }
    }
    console.log(aylienConceptExtractionEndpoint + "?url=" + url);
    xmlHttp.open("GET", aylienConceptExtractionEndpoint + "?url=" + url, true);
    xmlHttp.setRequestHeader(aylienApplicationKeyHeader, aylienApplicationKey);
    xmlHttp.setRequestHeader(aylienApplicationIdHeader, aylienApplicationId);
    xmlHttp.send(null);
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function frameLoaded() {

}

function frameError() {
    document.getElementById("mainDiv").innerHTML = 
        '<p class="message">Unfortunately, Chrome security settings prevent us from showing you the article in this popup.'
        + ' <a target="_blank" href="' + finalUrl + '">Please click here to read it.</a>';
}