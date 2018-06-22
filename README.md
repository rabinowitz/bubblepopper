# Bubble Popper
In the divisive political world of the modern era, each of us is confined to our own "filter bubble," a virtual landscape in which we only interact with viewpoints similar to our own. Algorithms guide our news feeds and our consuption of media, skewed heavily towards our political preferences. We have stopped interacting with viewpoints that clash with ours. This is where Bubble Popper aims to fill a need. Bubble Popper is a Google Chrome extension that allows a user to find an opposing viewpoint to a news article that they are reading. This opposing article is conveniently displayed within the frame of the browser, allowing the user to understand the way different political leanings manifest in various media sources. Using a Text Analysis API (Aylien), relevant keywords are extracted from an article the user is reading. These keywords as well as the current source are then used to find an opposing article about the same topic on a politically opposing news site. Bubble Popper is a way to break out of your filter bubble!

## Installation
Note: This is still a work in progress, so install it just to try it out.

1. Click the green "Clone or download" button above, and then click "Download ZIP".
2. Extract the ZIP that you just downloaded.
3. In Chrome, open the Extensions page (Settings > More tools > Extensions).
4. Enable "Developer mode" at the top right.
5. Click on "Load Unpacked" that just appeared. 
6. Find the folder you just unzipped, select the "Bubble Popper" folder within it, and click "OK".

You're done! Bubble Popper should be visible at the top right of Chrome. Go pop your filter bubble!

## How It Works

### Read an article
A user reads an article from a popular news site, which has a particular political leaning: Very liberal (-1), moderately liberal (-.5), center (0), moderately conservative (+.5), very conservative (+1)
![Alt text](https://github.com/5happy1/bubblepopper/blob/master/Bubble%20Popper/screenshots/bubblepopper1.png)

### Bubble Popper processes
![Alt text](https://github.com/5happy1/bubblepopper/blob/master/Bubble%20Popper/screenshots/bubblepopper2.png)

### An opposing source is loaded
The source displayed by BubblePopper is a numerical opposite of the source that is read by the user initially
![Alt text](https://github.com/5happy1/bubblepopper/blob/master/Bubble%20Popper/screenshots/bubblepopper3.png)

### Read opposing viewpoint based on Concept Extraction
The user can read the opposing viewpoint within the frame of the initial article
![Alt text](https://github.com/5happy1/bubblepopper/blob/master/Bubble%20Popper/screenshots/bubblepopper4.png)

### Only politically relevant sources are written into BubblePopper
![Alt text](https://github.com/5happy1/bubblepopper/blob/master/Bubble%20Popper/screenshots/bubblepopper5.png)

### Some sources don't display within frame
The user can still read the article in another tab
![Alt text](https://github.com/5happy1/bubblepopper/blob/master/Bubble%20Popper/screenshots/bubblepopper6.png)

## Read our methodology!
<a href="https://github.com/5happy1/bubblepopper/blob/master/Bubble%20Popper/screenshots/Bubble%20Popper.pdf">Bubble Popper Methodology</a>

## Built With
* [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
* [jQuery](http://jquery.com)
* [AYLIEN Text Analysis API](https://aylien.com)
* [Microsoft Cognitive Services API](https://azure.microsoft.com/en-us/services/cognitive-services)

## Authors
* Samuel Rabinowitz - [5happy1](https://github.com/5happy1)
* Swathi Ramprasad - [sr334](https://github.com/sr334)
