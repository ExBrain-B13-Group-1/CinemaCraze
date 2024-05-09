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

    let tvlistobj = {
        genres: [
        {
            id: 10759,
            name: "Action & Adventure",
        },
        {
            id: 16,
            name: "Animation",
        },
        {
            id: 35,
            name: "Komödie",
        },
        {
            id: 80,
            name: "Krimi",
        },
        {
            id: 99,
            name: "Dokumentarfilm",
        },
        {
            id: 18,
            name: "Drama",
        },
        {
            id: 10751,
            name: "Familie",
        },
        {
            id: 10762,
            name: "Kids",
        },
        {
            id: 9648,
            name: "Mystery",
        },
        {
            id: 10763,
            name: "News",
        },
        {
            id: 10764,
            name: "Reality",
        },
        {
            id: 10765,
            name: "Sci-Fi & Fantasy",
        },
        {
            id: 10766,
            name: "Soap",
        },
        {
            id: 10767,
            name: "Talk",
        },
        {
            id: 10768,
            name: "War & Politics",
        },
        {
            id: 37,
            name: "Western",
        },
        ],
    };
    let movielistobj = {
        genres: [
        {
            id: 28,
            name: "Action",
        },
        {
            id: 12,
            name: "Abenteuer",
        },
        {
            id: 16,
            name: "Animation",
        },
        {
            id: 35,
            name: "Komödie",
        },
        {
            id: 80,
            name: "Krimi",
        },
        {
            id: 99,
            name: "Dokumentarfilm",
        },
        {
            id: 18,
            name: "Drama",
        },
        {
            id: 10751,
            name: "Familie",
        },
        {
            id: 14,
            name: "Fantasy",
        },
        {
            id: 36,
            name: "Historie",
        },
        {
            id: 27,
            name: "Horror",
        },
        {
            id: 10402,
            name: "Musik",
        },
        {
            id: 9648,
            name: "Mystery",
        },
        {
            id: 10749,
            name: "Liebesfilm",
        },
        {
            id: 878,
            name: "Science Fiction",
        },
        {
            id: 10770,
            name: "TV-Film",
        },
        {
            id: 53,
            name: "Thriller",
        },
        {
            id: 10752,
            name: "Kriegsfilm",
        },
        {
            id: 37,
            name: "Western",
        },
        ],
    };

    $('#first-btn').click(firstPage);
    $('#previous-btn').click(prevPage);
    $('#next-btn').click(nextPage);

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

    //   console.log(tvlistobj);
    //   console.log(movielistobj);

    $(function(){
        getmoviedatas(POPULAR_URL)
    })

    function showAlert(title,message,icon){
        Swal.fire({
            height: 300,
            title: title,
            text: message,
            icon: icon
        });
    }

    window.onload = generateNowShowingRandom(nowShowingURL);

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
                return;
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
            let title = movie.title;
            let rating = parseFloat(movie.vote_average).toFixed(1);
            let overview = movie.overview;
            let truncatedOverview = overview.length > 50 ? overview.substring(0, 50) + `...<span class="seemore">See more</span>` : overview;
            // console.log(rating);
            // console.log(movie);
            
            $(".movie-container").append(`
                <div class="movie-card" ichangePaged="movie-card">
                    <button type="button" id="details-btn" class="details-btn">Details</button>
                    <img src="${src}" width="200px" class="poster-img" alt="${title}">
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


    function firstPage(datas) {
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
        // updatePageNumbers();
    }

    function nextPage(){
            if(page < totalPageCount)  {
                page++;
                let getinputval = $('#search').val().trim();
                if(getinputval){
                    urlChange(true,getinputval);
                }else{
                    urlChange(false,page);
                }
            $('#page-number').text(`Page ${page}`);
            if(page > 3) $('#first-btn').show();
            if(page > 1) $('#previous-btn').show();
            if(page == totalPageCount) $('#next-btn').hide();
        }
    }

    function prevPage() {
        if (page > 1) {
            page--;
            let getinputval = $('#search').val().trim();
            if(getinputval){
                urlChange(true,getinputval);
            }else{
                urlChange(false,page);
            }
            $('#page-number').text(`Page ${page}`);
            if(page == 1) $('#previous-btn').hide();
            if(page == 1) $('#first-btn').hide();
            if(page < totalPageCount) $('#next-btn').show();
        }
    }

    function urlChange(isChange,getinputval){
        if(isChange){
            getmoviedatas(`${SEARCH_URL}&query=${getinputval}&page=${page}`);
        }else{
            POPULAR_URL = `${BASE_URL}/movie/popular?page=${page}`;
            getmoviedatas(POPULAR_URL);
        }
        $('#page-number').text(`Page ${page}`);
    }   

    $('form').submit(function(e){
        let getinputval = $('#search').val();
        console.log(getinputval);
        if(getinputval){
            page = 1;
            getmoviedatas(`${SEARCH_URL}&query=${getinputval}&page=${page}`);
        }else{
            getmoviedatas(POPULAR_URL);
        }
        e.preventDefault(); 
    })


});
