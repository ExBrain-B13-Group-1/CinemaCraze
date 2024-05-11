// Get the selected movie ID from sessionStorage
const passedId = sessionStorage.getItem('selectedMovieId');

// Options for the API request
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlODVmNGIzYTlhNWZlODcxZmQxMjg5NGFlMmEzMTVlNSIsInN1YiI6IjY2M2IzOGNiYTFiNzg1YjQwMjhlY2Y2ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.wblEHHeXdWuVJNysQ7_gMsOxKlSRL3lridI6MAJhtzU'
    }
};

// Fetch movie details using the passed ID
fetch(`https://api.themoviedb.org/3/movie/${passedId}?language=en-US`, options)
    .then(response => response.json())
    .then(data => {
        // Fetch credits data for the movie
        fetch(`https://api.themoviedb.org/3/movie/${passedId}/credits?language=en-US`, options)
            .then(response => response.json())
            .then(creditsData => {
                // Add credits data to movie data
                data.credits = creditsData;
                // Populate movie information on the page
                populateInfo(data);
            })
            .catch(err => console.error(err));
    })
    .catch(err => console.error(err));

// Function to populate movie information on the page
function populateInfo(data) {
    const mainContainer = document.querySelector('.main-container');
    const { title, poster_path, overview, genres, vote_average, backdrop_path, credits, release_date } = data;
    const genreString = genres.map(genre => genre.name).join(' / ');
    const castHTML = credits.cast.slice(0, 2).map(castMember => `
        <div class="cast-info-container">
            <div class="cast-img"><img src="https://image.tmdb.org/t/p/w500${castMember.profile_path}" alt="${castMember.name}"></div>
            <p class="cast-text">${castMember.name}<span class="cast-mid-text">as</span><span class="cast-as">${castMember.character}</span></p>
        </div>
    `).join('');
    const directorHTML = credits.crew.find(crewMember => crewMember.job === 'Director')
    ? `
        <div class="director-info">
            <div class="director-img"><img src="https://image.tmdb.org/t/p/w500${credits.crew.find(crewMember => crewMember.job === 'Director').profile_path}" alt="${credits.crew.find(crewMember => crewMember.job === 'Director').name}"></div>
            <p class="director-text">${credits.crew.find(crewMember => crewMember.job === 'Director').name}</p>
        </div>
    `:'';
    const movieInfoHTML = `
    <div class="left-container">
        <div class="poster-container">
            <div class="movie-poster">
                <img src="https://image.tmdb.org/t/p/w500${poster_path}" alt="${title}" />
            </div>
            <div class="booking-info">
                <a href="/Booking/booking.html" class="btn-booking">Book Movie</a>
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

    // Insert movie information HTML into the main container
    mainContainer.innerHTML = movieInfoHTML;

    // Set background image of body if backdrop path is available
    if (backdrop_path) {
        document.body.style.backgroundImage = `url('https://image.tmdb.org/t/p/original${backdrop_path}')`;
    } 
}

// Function to round movie rating
function roundRating(rating) {
    return Math.round(rating);
}

// jQuery: Toggle dropdown menu
$(document).ready(function() {
    var menuIcon = $('.menu-icon');
    var dropDown = $('#drop-down');
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
