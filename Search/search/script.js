$(document).ready(function () {

    const API_KEY = "f3c6be9ce5bfc3ec51433b6f2b241a51";
    const BASE_URL = "https://api.themoviedb.org/3";
    const IMG_URL = "https://image.tmdb.org/t/p/w500";
    const SEARCH_URL = `${BASE_URL}/search/movie?api_key=${API_KEY}`;
    console.log(SEARCH_URL); 

    let randomNum = Math.floor((Math.random() * 10) + 1);
    let totalPageCount;
    let page = 1;
    let POPULAR_URL = `${BASE_URL}/movie/popular?page=${page}`;
    let nowShowingURL = `${BASE_URL}/movie/popular?page=${randomNum}`;
    let dynURL = "";
    
    let genresCategoryObj = {
        "genres": [
          {
            "id": 28,
            "name": "Action"
          },
          {
            "id": 12,
            "name": "Adventure"
          },
          {
            "id": 16,
            "name": "Animation"
          },
          {
            "id": 35,
            "name": "Comedy"
          },
          {
            "id": 80,
            "name": "Crime"
          },
          {
            "id": 99,
            "name": "Documentary"
          },
          {
            "id": 18,
            "name": "Drama"
          },
          {
            "id": 10751,
            "name": "Family"
          },
          {
            "id": 14,
            "name": "Fantasy"
          },
          {
            "id": 36,
            "name": "History"
          },
          {
            "id": 27,
            "name": "Horror"
          },
          {
            "id": 10402,
            "name": "Music"
          },
          {
            "id": 9648,
            "name": "Mystery"
          },
          {
            "id": 10749,
            "name": "Romance"
          },
          {
            "id": 878,
            "name": "Science Fiction"
          },
          {
            "id": 10770,
            "name": "TV Movie"
          },
          {
            "id": 53,
            "name": "Thriller"
          },
          {
            "id": 10752,
            "name": "War"
          },
          {
            "id": 37,
            "name": "Western"
          }
        ]
    }

    $('#first-btn').click(firstPage);
    $('#previous-btn').click(prevPage);
    $('#next-btn').click(nextPage);
    $('#last-btn').click(lastPage);

    $(function(){
        getmoviedatas(POPULAR_URL);
        generateNowShowingRandom(nowShowingURL);
        createGenres();
    });

    if(page == 1){
        $('#first-btn').hide();
        $('#previous-btn').hide();
    }

    $(window).scroll(function(){
        if(window.scrollY > 0){
            $('.navbar').css("background-color","var(--primary-color")
            $('.navbar').addClass("sticky");
        }else{
            $('.navbar').css("background-color","var(--secondary-color");
            $('.navbar').removeClass("sticky");
        }
    });

    $('#trending').hover(
        function() {
            $(this).find('.down-icon').hide();
            $(this).find('.up-icon').css({
                "display":"inline-block",
            });
        },
        function(){
            $(this).find('.down-icon').show();
            $(this).find('.up-icon').css({
                "display":"none",
            });
        }
    );  
    
    $('.category').hover(
        function(){
            $(this).parent().parent().find('.down-icon').hide();
            $(this).parent().parent().find('.up-icon').css({
                "display":"inline-block",
            });
        },
        function(){
            $(this).parent().parent().find('.down-icon').show();
            $(this).parent().parent().find('.up-icon').css({
                "display":"none",
            });
        }
    ); 

    $(document).on('click','#toggle-icon',function(){
        // console.log('hay');
        $('#sidebar').fadeIn();
    });

    $(document).on('click','#close-icon',function(){
        // console.log('hay');
        $('#sidebar').fadeOut() ;
    });

    function createGenres(){
        for (const key in genresCategoryObj.genres) {
            let category = genresCategoryObj.genres[key].name;
            let genresId = genresCategoryObj.genres[key].id;
            console.log(genresId,category);
            $('#genres-container').append(`
                <div class="g-type" id="${genresId}">${category}</div>
            `);
        }
    }

    // $(document).on('mouseleave','.dropdown-content',
    //     function(){
            
    //     }
    // );

    // stopped temp
    let ul = document.querySelector('#list-group');
    let prev = document.querySelector('#previous-btn');
    let next = document.querySelector('#next-btn');
    let currentpage = 5;
    let totalpage = 10;
    let activepage = "";

    // createPage(currentpage);

    function createPage(currentpage){
        ul.innerHTML = "";
        for (let i = currentpage - 2; i <= currentpage + 2; i++) {
            activepage = (currentpage == i) ? "current-page" : "";
            ul.innerHTML +=  `<li class="list-group-item"><a href="#" class="list-item ${activepage}">${i}</a></li>`;          
        }
    }
    // stopped temp

    $(document).on('click','#now-showing',function(){
        // bro thiha thwin page
        // window.location.href = ""
    });

    $(document).on('click', '#close-btn', function(){
        $('#display').css('display','none');
        $('#details-show').remove();
        $(".pagination-container").show();
        $('.movie-container').show();
    });

    $('#search').focus(function(){
        $('.g-type').removeClass('choosed');
    });

    $('#search').blur(function(){
        let getinputval = $('#search').val();
        if(!getinputval){
            earlyBirdSetupBeforeFetch();
            getmoviedatas(POPULAR_URL);
            $('#type').text("Popular Movies");
        }
    });

    $(document).on('click','.category',function(){
        earlyBirdSetupBeforeFetch();
        let type = $(this).text().toLowerCase();
        // console.log(type);
        // console.log($(this).text());
        $('.g-type').removeClass('choosed');
        showTrendingByCategory(type);

    });

    $(document).on('click','.g-type',function(e){
        earlyBirdSetupBeforeFetch();
        // console.log($(e.target));
        $('.g-type').removeClass('choosed');
        $(e.target).addClass('choosed');
        let genresId = $(e.target).attr('id');
        // let category = $(e.target).text().replace(/\s/g, '').toLowerCase();
        let category = $(e.target).text();
        console.log(genresId);
        console.log(category);
        showMoviesByGenres(genresId,category);
    });

    function showMoviesByGenres(id,category){
        const discoverUrl = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${id}`;
        dynURL = discoverUrl;
        console.log(discoverUrl);   
        getmoviedatas(discoverUrl);
        $('#type').html(`<span id="trending-text">Genres</span> - ${category}`).css('text-transform','capitalize'); 
    }

    function showTrendingByCategory(type){
        const trendingUrl = `${BASE_URL}/trending/${type}/day?api_key=${API_KEY}`;
        dynURL = trendingUrl;
        getmoviedatas(trendingUrl);
        $('#type').html(`<span id="trending-text">Trending</span> - ${type}`).css('text-transform','capitalize');   
    } 

    function showAlert(title,message,icon){
        Swal.fire({
            height: 300,
            title: title,
            text: message,
            icon: icon
        });
    }

    async function generateNowShowingRandom(url){
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmM2M2YmU5Y2U1YmZjM2VjNTE0MzNiNmYyYjI0MWE1MSIsInN1YiI6IjY2MzcwNGRjNjY1NjVhMDEyNjE1YTIxYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Qf9HXmBf-TGu3qcpp9PfejKUx57XMdHDDcRJEOnLilo'
            }
        };
        
        await fetch(url, options)
            .then(response => response.json())
            .then(response => {
                console.warn(response.results);
                giveDataToLocalStorage(response.results);
            })
            .catch(err => {
                if(err.message == "Failed to fetch"){
                    $('.movie-container').empty();
                    showAlert("No internet connection...","Please connect internet and try again!","error");
                }
            });
    }

    async function getmoviedatas(url) {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmM2M2YmU5Y2U1YmZjM2VjNTE0MzNiNmYyYjI0MWE1MSIsInN1YiI6IjY2MzcwNGRjNjY1NjVhMDEyNjE1YTIxYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Qf9HXmBf-TGu3qcpp9PfejKUx57XMdHDDcRJEOnLilo'
            }
        };
        
        await fetch(url, options)
            .then(response => response.json())
            .then(response => {
                console.log(response);
                showMovieCards(response.results);
                totalPageCount = response.total_pages;
                console.log(totalPageCount);
            })
            .catch(err => {
                if(err.message == "Failed to fetch"){
                    $('.movie-container').empty();
                    showAlert("No internet connection...","Please connect internet and try again!","error");
                }
            });
    }

    function giveDataToLocalStorage(datas){
        console.error(datas);
        let dataObj = {};
        let randomKey = [];
        for(let x = 0; x < 10; x++){
            let randomNumber = Math.floor(Math.random() * 20);
            randomKey.push(randomNumber);
        }
        console.log(randomKey);
        for (let idx of randomKey) {
            // console.warn(idx);
            console.log(datas[idx].id);
            dataObj[datas[idx].id] = datas[idx];
        }
        console.log(dataObj);
        localStorage.setItem("MovieDatas",JSON.stringify(dataObj)); 
    }

    function showMovieCards(datas) {
        console.log(datas);
        $('#page-number').text(`Page ${page}`);
        $(".movie-container").empty(); // Clear existing movie cards
        datas.forEach((movie) => {
            let src = IMG_URL + movie.poster_path;
            let title = (movie.title) ? movie.title : movie.original_name;
            let movieId = movie.id;
            let mediaType = movie.media_type;
            let rating = parseFloat(movie.vote_average).toFixed(1);
            let overview = movie.overview;
            let truncatedOverview = overview.length > 50 ? overview.substring(0, 50) + `...<span class="seemore">See more</span>` : overview;
            // console.log(rating);
            // console.log(movie);
            
            $(".movie-container").append(`
                <div class="movie-card" ichangePaged="movie-card">
                    <button type="button" id="details-btn" class="details-btn">Details</button>
                    <img src="${src}" width="200px" class="poster-img" alt="${title}" data-movieid="${movieId}" data-mediatype="${mediaType}">
                    <div class="info">
                    <h3>${title}</h3>
                    <span class="rating">${rating}</span>
                    </div>
                    <div class="overview">
                    <h3>Overview</h3>
                        ${truncatedOverview}
                    </div>
                </div>
            `);
        });
    }


    function firstPage(){
        page = 1;
        let getinputval = $('#search').val().trim();
        if(getinputval){
            urlChange(true,getinputval);
        }else{
            urlChange(false,page);
        }
        $('#page-number').text(`Page ${page}`);
        $('#first-btn').hide();
        $('#previous-btn').hide();
        $('#next-btn').show();
        $('#last-btn').show();
        // updatePageNumbers();
    }

    function nextPage(){
            if(page < totalPageCount)  {
                page++;
                let getinputval = $('#search').val().trim();
                if(getinputval){
                    urlChange(true,getinputval);
                }else{
                    urlChange(false,page,dynURL);
                }
            $('#page-number').text(`Page ${page}`);
            if(page > 3) $('#first-btn').show();
            if(page > 1) $('#previous-btn').show();
            if(page == totalPageCount) {
                $('#next-btn').hide();
                $('#last-btn').hide();
            };
        }
    }

    function lastPage(){
        if(page < totalPageCount)  {
            page = (totalPageCount > 500) ? "500" : totalPageCount;
            let getinputval = $('#search').val().trim();
            if(getinputval){
                urlChange(true,getinputval);
            }else{
                urlChange(false,page,dynURL);
            }
        $('#page-number').text(`Page ${page}`);
        if(page > 3) $('#first-btn').show();
        if(page > 1) $('#previous-btn').show();
        if(page == totalPageCount){
            $('#next-btn').hide();
            $('#last-btn').hide();
        };
    }
}

    function prevPage() {
        if (page > 1) {
            page--;
            let getinputval = $('#search').val().trim();
            if(getinputval){
                urlChange(true,getinputval);
            }else{
                urlChange(false,page,dynURL);
            }
            $('#page-number').text(`Page ${page}`);
            if(page == 1) $('#previous-btn').hide();
            if(page == 1) $('#first-btn').hide();
            if(page < totalPageCount) {
                $('#next-btn').show();
                $('#last-btn').show();
            };
        }
    }

    function urlChange(isChange,getinputval,URL){
        if(isChange){
            getmoviedatas(`${SEARCH_URL}&query=${getinputval}&page=${page}`);
        }else{
            if(dynURL){
                console.log("Dynamic URL is = "+dynURL);
                getmoviedatas(`${dynURL}&page=${page}`);
            }else{
                POPULAR_URL = `${BASE_URL}/movie/popular?page=${page}`;
                getmoviedatas(POPULAR_URL);
            }
        }
        $('#page-number').text(`Page ${page}`);
    }   

    $('form').submit(function(e){
        earlyBirdSetupBeforeFetch();
        let getinputval = $('#search').val();
        console.error(getinputval);
        console.error(getinputval.length);
        page = 1;
        if(getinputval){
            $('#type').text(getinputval).css("text-transform","capitalize");
            getmoviedatas(`${SEARCH_URL}&query=${getinputval}&page=${page}`);
        }else{
            getmoviedatas(POPULAR_URL);
            console.log(POPULAR_URL);
            $('#type').text("Popular Movies");
        }
        e.preventDefault(); 
    })

    $(document).on('click', '.movie-card' , function(e) {
        // console.log(e.target);
        let movieId = $(e.target).closest('.movie-card').find('.poster-img').data('movieid');
        let mediaType = $(e.target).closest('.movie-card').find('.poster-img').data('mediatype');
        console.log(movieId);
        console.log(mediaType);
        showDetails(movieId,mediaType);
    });

    async function showDetails(movieId,mediaType){
        let page = 1;
        console.log(movieId);
        let SEARCH_URL_WITH_ID;
        SEARCH_URL_WITH_ID = (mediaType != "undefined") ? SEARCH_URL_WITH_ID = `${BASE_URL}/${mediaType}/${movieId}?api_key=${API_KEY}` : SEARCH_URL_WITH_ID = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`;

        console.log(SEARCH_URL_WITH_ID);
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json', 
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmM2M2YmU5Y2U1YmZjM2VjNTE0MzNiNmYyYjI0MWE1MSIsInN1YiI6IjY2MzcwNGRjNjY1NjVhMDEyNjE1YTIxYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Qf9HXmBf-TGu3qcpp9PfejKUx57XMdHDDcRJEOnLilo'
            }
        };
        await fetch(SEARCH_URL_WITH_ID, options)
            .then(response => response.json())
            .then(response => {
                // console.log(response);  
                showMovieDetails(response);
            })
            .catch(err => {
                console.log(err.message);
                if(err.message == "Failed to fetch"){
                    $('.movie-container').empty();
                    showAlert("No internet connection...","Please connect internet and try again!","error");
                }
            });
    }

    function showMovieDetails(datas){
        console.error(datas);
        let defaultBackdropPath = "https://img.freepik.com/free-photo/movie-background-collage_23-2149876028.jpg";
        let poster_path = datas.poster_path;
        let title = datas.title;
        let releasedate = datas.release_date;
        let rating = parseFloat(datas.vote_average).toFixed(1);
        let overview = datas.overview;
        let backdrop_path = IMG_URL + datas.backdrop_path;
        if(!(datas.backdrop_path)) backdrop_path = defaultBackdropPath;
        let genres = "";
        // console.log(datas.genres.length);
        if(datas.genres.length > 0){
            (datas.genres).forEach((data, index) => {
                genres += data.name; 
    
                if (index < datas.genres.length - 1) {
                    genres += " / ";
                }
            });
        }
        console.log(genres);
        $('#display').css('display','block');
        $(".pagination-container").hide();
        $('.movie-container').hide();
        $('#display').append(`
            <div class="details-show" id="details-show"
                style="
                    background: url(${backdrop_path});
                    background-repeat: no-repeat;
                    background-size: cover;
                    background-position: center;
                "
            >  
                <div class="card">
                    <div class="img-box">
                        <img src="${IMG_URL}${poster_path}" alt="${title}"> 
                        <ion-icon name="close-circle-outline" class="close-btn" id="close-btn"></ion-icon>
                    </div>
                    <div>
                        <h1>Title : <span id="movie-title">${title}</span></h1>
                        <p>Genres : <span id="movie-genres">${genres}</span></p>
                        <p>Released Date : <span id="movie-releasedate">${releasedate}</span></p>
                        <br/>
                        <p>Rating : <span id="movie-rating">${rating}</span></p>
                        <p>Overview : <span id="movie-overview">${overview}</span></p>
                    </div>
                </div>
            </div>
        `);
    }

    function earlyBirdSetupBeforeFetch(){
        page = 1;
        $('#first-btn').hide();
        $('#previous-btn').hide();
        $('#next-btn').show();
        $('#last-btn').show();
    }





});




