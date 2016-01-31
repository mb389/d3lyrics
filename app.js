var echojs = require('echojs');
var express = require('express');
var app = express();
var music = require('musicmatch')({usertoken:'014c6eff84790b6561117bb2cba33918'});
var lyricBank = require('./lyricBank');
var bodyParser = require('body-parser');
var fs=require("fs");
var router=require('./routes');

app.use('/', express.static(__dirname));
// app.use('/', makesRouter);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(process.env.PORT || 3000);

var artistArr =["kendrick lamar","kanye west", "snoop dogg", "eminem", "nas"];

var countArr=[];

//for (var j=0;j<artistArr.length;j++) {
var j=0;
return music.trackSearch({q: artistArr[j], f_has_lyrics: true, page_size: 100 })
    .then(function(data) {
        return data.message.body.track_list.map(function(index) {
                return index.track.track_id;
        });
    })
    .then(function(array){
        return Promise.all(array.map(function(element) {
            return music.trackLyrics({ track_id: element });
        }));
    })
    .then(function(lyrics){
        return lyrics.map(function(element) {
            return element.message.body.lyrics.lyrics_body;
        });
    })
    .then(function(result) {
        lyricBank.data.push({artist: artistArr[j], lyrics: result});
        return lyricBank.data;
    })
    .then(function(artist){
      var songStrLen="";
      for (var prop in artist[j].lyrics)
         songStrLen += artist[j].lyrics[prop];
      songStrLen=countWords(songStrLen);
      countArr.push({artist: artist[j].artist, wordLength: songStrLen});
      return countArr;
   })
   .then(function(final){
      //console.log(final)
      return final;
   })
    .catch(function(err) {
        console.error(err);
    });
//}



function countWords(s){
    s = s.replace(/(^\s*)|(\s*$)/gi,"");//exclude  start and end white-space
    s = s.replace(/[ ]{2,}/gi," ");//2 or more space to 1
    s = s.replace(/\n /,"\n"); // exclude newline with a start spacing
    var wordArray = s.split(' ');
  var wordAvg = 0;
  for (var i = 0; i < wordArray.length; i++){
    wordAvg += wordArray[i].length;
  }
  var avgLen = wordAvg / wordArray.length;
  return avgLen;
}
