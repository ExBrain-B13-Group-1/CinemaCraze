document.addEventListener('DOMContentLoaded', function() {
    // Retrieve the selected movie ID from sessionStorage
    const passedId = sessionStorage.getItem('selectedMovieId');

    // Options for the fetch requests
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlODVmNGIzYTlhNWZlODcxZmQxMjg5NGFlMmEzMTVlNSIsInN1YiI6IjY2M2IzOGNiYTFiNzg1YjQwMjhlY2Y2ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.wblEHHeXdWuVJNysQ7_gMsOxKlSRL3lridI6MAJhtzU'
        }
    };

    // Fetch movie details and credits simultaneously
    Promise.all([
        fetch(`https://api.themoviedb.org/3/movie/${passedId}?language=en-US`, options),
        fetch(`https://api.themoviedb.org/3/movie/${passedId}/credits?language=en-US`, options)
    ])
    .then(responses => Promise.all(responses.map(response => response.json())))
    .then(data => {
        const movieDetails = data[0];
        const creditsData = data[1];
        
        // Set the dynamic background image
        setDynamicBackground(movieDetails.backdrop_path);
        
        // Fetch "now playing" movies
        fetch('https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1', options)
            .then(response => response.json())
            .then(nowPlayingData => {
                // Slice the results array to include only the first 5 movies
                const firstFiveMovies = nowPlayingData.results.slice(0, 5);
                // Check if the selected movie is among the first 5 now playing movies
                const isNowPlaying = firstFiveMovies.some(movie => movie.id == passedId);
                // Generate HTML for movie information based on whether it's now playing or not
                const movieInfoHTML = generateMovieInfoHTML(movieDetails, isNowPlaying, creditsData);
                // Insert the movie information HTML into the main container
                const mainContainer = document.querySelector('.main-container');
                mainContainer.innerHTML = movieInfoHTML;
            })
            .catch(error => console.error(error));
    })
    .catch(err => console.error(err));

    // Function to set dynamic background image
    function setDynamicBackground(backdropPath) {
        if (backdropPath) {
            document.body.style.backgroundImage = `url('https://image.tmdb.org/t/p/original${backdropPath}')`;
        }
    }

    // Function to generate movie information HTML
    function generateMovieInfoHTML(data, isNowPlaying, creditsData) {
        // Destructure movie data
        const { title, poster_path, overview, genres, vote_average, release_date } = data;
        // Generate genre string
        const genreString = genres.map(genre => genre.name).join(' / ');
        // Generate HTML for cast members
        const castHTML = creditsData && creditsData.cast ? creditsData.cast.slice(0, 2).map(castMember => `
            <div class="cast-info-container">
                <div class="cast-img"><img src="https://image.tmdb.org/t/p/w500${castMember.profile_path}" alt="${castMember.name}"></div>
                <p class="cast-text">${castMember.name}<span class="cast-mid-text">as</span><span class="cast-as">${castMember.character}</span></p>
            </div>
        `).join('') : '';
        // Generate HTML for director
        const directorHTML = creditsData && creditsData.crew && creditsData.crew.find(crewMember => crewMember.job === 'Director')
            ? `
                <div class="director-info-container">
                    <div class="director-img"><img src="https://image.tmdb.org/t/p/w500${creditsData.crew.find(crewMember => crewMember.job === 'Director').profile_path}" alt="${creditsData.crew.find(crewMember => crewMember.job === 'Director').name}"></div>
                    <p class="director-text">${creditsData.crew.find(crewMember => crewMember.job === 'Director').name}</p>
                </div>
            `
            : '';
        // Generate HTML for booking button based on whether the movie is now playing
        const bookingButtonHTML = isNowPlaying ? `<a href="/Booking/booking.html" class="btn-booking">Book Movie</a>` : '';
        // Construct the movie information HTML
        const movieInfoHTML = `
            <div class="left-container">
                <div class="poster-container">
                    <div class="movie-poster">
                        <img src="https://image.tmdb.org/t/p/w500${poster_path}" alt="${title}" />
                    </div>
                    <div class="booking-info">
                        ${bookingButtonHTML}
                    </div>
                </div>
            </div>
            <div class="movie-info">
                <div class="inner-movie-info">
                    <div class="movie-name">${title}</div>
                    <div class="movie-release-date">${release_date}</div>
                    <div class="movie-genre">${genreString}</div>
                    <div class="rating">
                        <ion-icon name="star" class="full-star"></ion-icon><ion-icon name="star-half"
                            class="half-star"></ion-icon> ${roundRating(vote_average)}
                    </div>
                    <h1 class="synopsis">Synopsis</h1>
                    <div class="plot-summary">
                        ${overview}
                    </div>
                    <div class="director">
                        <span class="name">Director</span>
                        ${directorHTML}
                    </div>
                    <div class="cast">
                        <span class="name">Cast</span>
                        <div class="cast-info">
                            ${castHTML}
                        </div>
                    </div>
                </div>
            </div>
        `;
        return movieInfoHTML;
    }

    // Function to round movie rating
    function roundRating(rating) {
        return Math.round(rating);
    }
});

// jQuery: Toggle dropdown menu
$(document).ready(function() {
    // Selectors for menu icon and dropdown
    var menuIcon = $('.menu-icon');
    var dropDown = $('#drop-down');
    // Function to hide dropdown
    function hideDropDown() {
        dropDown.hide();
    }

    // Toggle dropdown menu on click
    menuIcon.on('click', function() {
        if (dropDown.css('display') === 'none') {
            dropDown.css('display', 'flex');
        } else {
            dropDown.hide();
        }
    });

    // Hide dropdown on window resize
    $(window).on('resize', function() {
        hideDropDown();
    });
});