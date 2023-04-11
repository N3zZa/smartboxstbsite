const express = require("express");
const fetch = require("node-fetch");
var app = express();
const path = require("path");
var _ = require("lodash");
const fs = require("fs");

app.use(express.static(__dirname));

const APIANIMEVIDEO_TOKEN = "a88d97e1788ae00830c4665ab33b7f87";

const APIANIME_TOKEN = "tiZIrLKGr6cEDt2zQekNOTQyB3uVNscj";
let APIANIME_URL = `https://videocdn.tv/api/animes?api_token=${APIANIME_TOKEN}`;

const fetchDataAnime = fetch(APIANIME_URL).then((response) => {
  return response.json();
});

const showAnime = async () => {
  try {
    const commits = await fetchDataAnime;
    let items = commits.data.map(
      (element) =>
        `{
            id: '${element.kinopoisk_id}',
            url: 'https://rr2---sn-a5meknde.googlevideo.com/videoplayback?expire=1681074459&ei=u9QyZKvSMOaesfIPlIqImAg&ip=191.96.255.188&id=o-AFfGH15zt-Wmy0rGxkg9xFwzE0ga1XE0rAFyAPrK5Grm&itag=22&source=youtube&requiressl=yes&mh=aB&mm=31%2C29&mn=sn-a5meknde%2Csn-a5msen7z&ms=au%2Crdu&mv=m&mvi=2&pl=25&initcwndbps=475000&spc=99c5CSEYHJ2IvLwhloEb8a-QKbm_eml6fBcZ-icsvQ&vprv=1&mime=video%2Fmp4&ns=4_zGU9dFNsaetRX7-ESdiyUM&cnr=14&ratebypass=yes&dur=155.829&lmt=1655331954967271&mt=1681052269&fvip=2&fexp=24007246&c=WEB&txp=4532434&n=wpacCVbNzdecww&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cspc%2Cvprv%2Cmime%2Cns%2Ccnr%2Cratebypass%2Cdur%2Clmt&sig=AOq0QJ8wRgIhALreXDF1ZBxJamjisTaNp24RUV4r3gQMe5P8orQQeWseAiEA-0qFzngxAwhgfzYwilYTEez5UIud36n-l8W72HrPVEQ%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRgIhAJjNvEjsDgUdzSlaOmt5q4f_TePjp5x-XI85ZJwe2FlWAiEAgqXrC274-2qzeN5EDPtiqKfoqroKw5qNWv0qmHdbyOk%3D&title=JavaScript%20in%20100%20Seconds',
            type: 'vod',
            imgurl: 'https://kinopoiskapiunofficial.tech/images/posters/kp/${
              element.kinopoisk_id
            }.jpg',
            title: '${element.ru_title}',
            created: '${element.year.slice(0, 4)}',
            filmPageId: 'filmid${element.kinopoisk_id}',
          },
          `
    );
    return items;
  } catch (error) {
    console.error(error);
  }
};

async function sendAnime() {
  const movies = await showAnime();
  const movieItems = movies.join('');
  fs.writeFileSync(
    "./js/anime/animeVideos.js",
    `(function () {
    "use strict"

    window.App.videos = [
      ${movieItems}
    ] 
  })();
  `
  );
  fs.writeFileSync(
    "./js/anime/animeFilmPage.js",
    `(function () {
    "use strict"

    window.App.filmInfo = [
      ${movieItems}
    ] 
  })();
  `
  );
}
sendAnime();


async function getAnime() {
  try {
    // используем movies в шаблонной строке:
    fs.writeFileSync(
      "./js/scenes/animeVideosRender.js",
      `(function () {
  var _inited;
    _.templateSettings.interpolate = /\\{\\{([\\s\\S]+?)\\}\\}/g;
  var itemHtml = _.template('<div data-content="filmInfo" data-film="{{filmPageId}}" data-id="{{id}}" style="background: url({{imgurl}}); background-repeat:no-repeat;  background-size:cover;" class="movieitem navigation-item nav-item video-item" data-url="{{url}}" data-type="{{type}}"><h4>{{title}}</h4><p>{{created}}</p></div>');
  
    
  window.App.scenes.video = {
    init: function () {
      this.$el = $(".js-scene-video");

      this.renderItems(App.videos);

      _inited = true;
    },

    show: function () {
      if (!_inited) {
        this.init();
      }

      this.$el.show();
    },

    hide: function () {
      this.$el.hide();
    },

    // "https://a54t.bazonserver.site/manifest/22655/2160.mp4/index.m3u8?hash=bwIIa3zdRMQAyWs9noh5PQ&expires=1680659139&id=22655&name=2160.mp4"
    // handler for click event

    // showing items from videos.js
    renderItems: function (items) {
      var html = "";

      // console.log(items, itemHtml.toString())
      for (var i = 0, len = items.length; i < len; i++) {
        html += itemHtml(items[i]);
      }

      this.$el.empty().html(html);
    },
  };
})();

    `
    );
    fs.writeFileSync(
      "./js/scenes/animeFilmInfo.js",
      `(function () {
  var _inited;
    _.templateSettings.interpolate = /\\{\\{([\\s\\S]+?)\\}\\}/g;
  var filmPageHtml = _.template('<div id="{{filmPageId}}"  data-id="{{id}}" class="filmInfoPage"><div class="film-info_inner"><div class="film-main"><div class="film-info"><img src="{{imgurl}}" alt="posterimg"><div class="film-dscrtn"><div><p>Год:{{created}}</p></div><h2>{{title}}</h2></div></div></div><nav class="film-nav"><div class="film-nav_logo"><div class="UconCinema_logo"><img src="" alt="logoimg"><div class="logo_text"><h4>Ucon Cinema</h4><p>Домашний кинотеатр</p></div></div></div><ul class="film-voiceover menu-items" data-nav_type="vbox" data-nav_loop="true"><li data-content="video" class="back menu-item nav-item"><= Назад</li><li data-url="{{url}}" class="voiceover menu-item nav-item video-item">Озвучка 1</div></ul></nav></div></div>');
  
  window.App.scenes.filmInfo = {
    init: function () {
      this.$el = $(".js-scene-filmInfo");

      this.renderItems(App.filmInfo);
      _inited = true;
      $(".back").on("click", function (event) {
         var scene = event.currentTarget.getAttribute("data-content");
         $(".header").show();
         window.App.showContent(scene);
       });
       $(".voiceover").on("click", function (e) {
         var url = e.currentTarget.getAttribute("data-url");
      Player.play({
        url: url,
      });
       });
    },

    show: function () {
      if (!_inited) {
        this.init();
      }

      this.$el.show();
    },

    hide: function () {
      this.$el.hide();
    },

    // "https://a54t.bazonserver.site/manifest/22655/2160.mp4/index.m3u8?hash=bwIIa3zdRMQAyWs9noh5PQ&expires=1680659139&id=22655&name=2160.mp4"
    // handler for click event

    // showing items from videos.js
    renderItems: function (items) {
      var filmhtml = "";

      // console.log(items, itemHtml.toString())
      for (var i = 0, len = items.length; i < len; i++) {
        filmhtml += filmPageHtml(items[i]);
      }
      this.$el.empty().html(filmhtml);
    },
  };
})();

    `
    );
    const message = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>tv</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Nunito+Sans:wght@200&display=swap"
        rel="stylesheet">

        <script type="text/javascript" src="./src/libs/jquery-1.10.2.min.js"></script>
        <script type="text/javascript" src="./src/libs/lodash.compat.min.js"></script>
        <script type="text/javascript" src="./src/libs/event_emitter.js"></script>
        <script type="text/javascript" src="./js/lib/smartbox.js"></script>
        <script type="text/javascript" src="./js/app.js"></script>
        <script type="text/javascript" src="./js/anime/animeVideos.js"></script>
        <script type="text/javascript" src="./js/scenes/animeVideosRender.js"></script>
        <script type="text/javascript" src="./js/anime/animeFilmPage.js"></script>
        <script type="text/javascript" src="./js/scenes/animeFilmInfo.js"></script>
        <script type="text/javascript" src="./js/scenes/navigation.js"></script>
    <script type="text/javascript" src="./js/scenes/input.js"></script>

    
  
</head>

<style>

body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    height: 100vh;
}
.bg {
    width: 100%;
    height: 100%;
    position:absolute;
    z-index:-5;
    top:0;
    left:0;
    background: url('./images/bg.jpg');
     background-repeat:no-repeat;
   background-size:cover;
}
p,
h1, h2,
h3, h4, li {
    color: #fff;
    font-family: 'Inter', sans-serif;
}
.wrap {
    max-width: 1000px;
    margin: 0 auto;
    padding: 30px;
}

a {
    text-decoration: none;
}

h2,
h1 {
    font-weight: 400;
    margin: 10px 0;
}

.navbar {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-top: 30px;
    width: 100%;
}



.movieitem {
    width: 180px;
    height: 260px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    padding: 10px;
    cursor: pointer;
}
.movieitem h4 {
  display: none;
}
.movieitem p {
  display: none;
}


.movieitem:hover h4{
  display: block;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  text-shadow: 2px 0 2px #000, 
0 3px 3px #000, 
-1px 0 1px #000, 
0 -1px 1px #000;;
}
.movieitem:hover p{
  display: block;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  text-shadow: 2px 0 2px #000, 
0 3px 3px #000, 
-1px 0 1px #000, 
0 -1px 1px #000;;
}

.movieitem:hover {
    border-bottom: 5px solid yellow;
    margin-bottom: -1px;
    border-radius: 10px;
}

.film-title {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-around;
    flex-direction: column;
}

.film-title h2 {
    font-size: 12px;
}

.film-title p {
    color: yellow;
}

.movieitem p {
    margin: 0;
}

.movieitem img {
    height: 180px;
}

.header h2 {
    text-transform: uppercase;
    text-decoration: underline;
    text-decoration-color: yellow;
    font-size: 35px;
}

.focus p {
  display: block;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  text-shadow: 2px 0 2px #000, 
0 3px 3px #000, 
-1px 0 1px #000, 
0 -1px 1px #000;;
 }

 .focus h4{
  display: block;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  text-shadow: 2px 0 2px #000, 
0 3px 3px #000, 
-1px 0 1px #000, 
0 -1px 1px #000;;
 }

.focus {
    border-bottom: 5px solid yellow;
    margin-bottom: -5px;
    border-radius: 5px;
}
video {
    right:0;
    width:100%;
    z-index: 5;
}

.header img {
    cursor: pointer;
}
.header {
  display: flex;
    gap: 10px;
    align-items: center;
    justify-content: space-around;
    max-width: 1200px;
}


.header li {
    list-style-type: none;
    color: #fff;    
    font-size: 23px;
}


.log-string {
    position: absolute;
    left: 50%;
}
.log-object {
    position: absolute;
        left: 50%;
}

.film-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: none;
    }

    li {
        list-style-type: none;
    }
.film-info_inner {
    display: flex;
    padding: 40px;
}
.UconCinema_logo {
    display: flex;
    align-items: center;
    gap: 10px;
}

p {
    margin: 0;
}
.logo_text h4 {
    margin: 0;
    color: #fff;
}

.film-main {
    padding: 20px;
    display: flex;
    flex-direction: column;
    max-width: 75%;
}
.film-info {
    display: flex;
    gap: 20px;
}

.film-info img {
    width: 25%;
    margin-bottom: 10px;
}


.film-dscrtn {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    padding-bottom: 40px;
}

.actors {
    margin-bottom: 15px;
}

.film-dscrtn h2 {
    color: yellow;
}
.film-nav {
    display: flex;
    flex-direction: column;
    position: absolute;
    right: 0;
    top: 0;
    background: #553c64;
    width: 30%;
    height: 100%;
}
.film-nav_logo {
    background: #3b3041;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.back {
    font-size: 22px;
        padding: 20px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.151);
        margin-left: -40px;
}

.voiceover {
    font-size: 22px;
    padding: 20px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.151);
    margin-left: -40px;
    padding-left: 40px;
}

</style>
<body>
    <div class='bg'></div>
    <div id="app" class="wrap">
        <div class="header navigation-items">
                <a class="navigation-item nav-item" id='Films' href="/films">
                    <li>Фильмы</li>
                </a>
                <a class="navigation-item nav-item" id='Serials' href="/serials">
                    <li>Сериалы</li>
                </a>
                <a class="navigation-item nav-item" id='Cartoons' href="/cartoons">
                    <li>Мультфильмы</li>
                </a>
                <h2>Аниме</h2>
                <a class="navigation-item nav-item" id='Premieres' href="/premieres">
                    <li>Премьеры</li>
                </a>
                <a class="navigation-item nav-item" id='Compilations' href="/compilations">
                    <li>Подборки</li>
                </a>
        
    </div>
    <div id="movies" class="navbar navigation-items scene scene_video js-scene-video" data-nav_loop="true">
    </div>
    <div class="scene scene_filmInfo film-container js-scene-filmInfo"></div>
    </div>
    <script type='text/javascript'>
    var cartoons = document.getElementById('Cartoons')
    var serials = document.getElementById('Serials')
    var films = document.getElementById('Films')
    var premieres = document.getElementById('Premieres')
    var compilations = document.getElementById('Compilations')


    cartoons.addEventListener('click', function (event) {
            window.location='/cartoons'
    });

    serials.addEventListener('click', function (event) {
            window.location='/serials'
    });

    films.addEventListener('click', function (event) {
            window.location='/films'
    });

    premieres.addEventListener('click', function (event) {
            window.location='/premieres'
    });

    compilations.addEventListener('click', function (event) {
            window.location='/compilations'
    });

    
    window.document.onkeydown = key => {
        if (key.keyCode === 38) {
            var elem = document.querySelector('.focus');
            window.scrollTo(0, elem.offsetTop - 200);
        } else if (key.keyCode === 40) {
             var elem = document.querySelector('.focus');
             window.scrollTo(0, elem.offsetTop - 200);
        }
    }
    
    </script>
</body>
</html>`;

    app.get("/anime", (req, res) => {
      res.send(message); // Отправка ответа в виде HTML
    });
  } catch (error) {
    console.error(error);
  }
}

getAnime();

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port);
console.log(`Server is listening on port ${port}`);

// rm -rf xyz - удалить репозиторий с амазон
