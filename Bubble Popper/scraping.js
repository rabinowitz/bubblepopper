var request = require('request'), cheerio = require ('cheerio');
// request ('https://www.washingtonpost.com/politics/trump-lawyer-negotiated-16-million-settlement-for-gop-donor-with-playboy-model/2018/04/13/2f051f90-3f3e-11e8-974f-aacd97698cef_story.html', function(err,resp,body){
//   if(!err && resp.statusCode ==200){
//     var item = cheerio.load(body);
//     var wapoText = item('p.story-body-text story-content').each(function());
//     console.log(wapoText);
//   }
// });

request('https://news.ycombinator.com', function (error, response, html) {
  if (!error && response.statusCode == 200) {
    console.log(html);
  }
});
