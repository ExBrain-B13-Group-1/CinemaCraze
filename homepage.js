const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlODVmNGIzYTlhNWZlODcxZmQxMjg5NGFlMmEzMTVlNSIsInN1YiI6IjY2M2IzOGNiYTFiNzg1YjQwMjhlY2Y2ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.wblEHHeXdWuVJNysQ7_gMsOxKlSRL3lridI6MAJhtzU'
    }
};

// Fetch genre list and then populate "Now Playing" and "Trending Now" sections
fetch('https://api.themoviedb.org/3/genre/movie/list?language=en-US', options)
    .then(response => response.json())
    .then(genreData => {
        // Create a map of genre IDs to genre names
        const genreMap = new Map();
        genreData.genres.forEach(genre => {
            genreMap.set(genre.id, genre.name);
        });

        // Fetch "Now Playing" movies
        fetch('https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1', options)
            .then(response => response.json())
            .then(nowPlayingData => {
                // Populate the "Now Playing" section with data
                populateNowPlaying(nowPlayingData.results, genreMap);
            })
            .catch(error => console.error('Error fetching "Now Showing" data:', error));

        // Fetch popular movies
        fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', options)
            .then(response => response.json())
            .then(popularData => {
                // Populate the "Trending Now" section with data
                populateTrendingNow(popularData.results.slice(0, 15), genreMap);
            })
            .catch(error => console.error('Error fetching "Trending Now" data:', error));
    })
    .catch(error => console.error('Error fetching genre data:', error));

// Function to populate the "Now Playing" section
function populateNowPlaying(results, genreMap) {
    const posterParent = document.getElementById("posters");
    for (let i = 0; i < Math.min(results.length, 5); i++) {
        // Get movie data
        const movie = results[i];
        // Map genre IDs to genre names
        const genreNames = movie.genre_ids.map(genreId => genreMap.get(genreId));

        // Generate HTML for movie poster
        const posterHTML = `
            <label for="s${i + 1}" id="poster${i + 1}" class="label">
                <div class="poster">
                    <div class="image">
                        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" data-id="${movie.id}" />
                    </div>
                    <div class="info">
                        <p class="movie-name" data-id="${movie.id}">${movie.title}</p>
                        <div class="movie-genre">${genreNames.join(', ')}</div>
                        <div class="rating">
                            <div class="rating-flex">
                                <ion-icon name="star" class="full-star"></ion-icon>
                                <ion-icon name="star-half" class="half-star"></ion-icon>
                                <span class="rating-number">${roundRating(movie.vote_average)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </label>`;
        posterParent.insertAdjacentHTML('beforeend', posterHTML);

        // Add click event listeners to movie name and image
        const movieName = document.querySelector(`#poster${i + 1} .movie-name`);
        const movieImage = document.querySelector(`#poster${i + 1} .image img`);
        if (movieName && movieImage) {
            movieName.addEventListener('click', handleMovieClick);
            movieImage.addEventListener('click', handleMovieClick);
        } else {
            console.error('Movie name or image not found for index:', i);
        }
    }
}

// Function to populate the "Trending Now" section
function populateTrendingNow(results, genreMap) {
    const swiperContainer = document.querySelector('.mySwiper');

    const moviesPerSlide = 5;

    for (let i = 0; i < 3; i++) {
        const swiperSlide = document.createElement('swiper-slide');
        swiperSlide.classList.add('swiper-slide');

        const moviesContainer = document.createElement('div');
        moviesContainer.classList.add('movies-container');

        // Loop through movies and generate HTML
        for (let j = i * moviesPerSlide; j < Math.min((i + 1) * moviesPerSlide, results.length); j++) {
            const movie = results[j];
            const genreNames = movie.genre_ids.map(genreId => genreMap.get(genreId));

            // Generate HTML for movie poster
            const posterHTML = `
                <div class="movie-container" data-url="${movie.url}" data-id="${movie.id}">
                    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
                    <div class="all-info">
                        <div class="movie-info">
                            <p class="movie-name">${movie.title}</p>
                            <div class="movie-genre">${genreNames.join(', ')}</div>
                            <div class="all-info-rating">
                                <ion-icon name="star" class="all-info-full-star"></ion-icon>
                                <ion-icon name="star-half" class="all-info-half-star"></ion-icon>
                                <span class="all-info-rating-number">${roundRating(movie.vote_average)}</span>
                            </div>
                        </div>
                    </div>
                </div>`;
            moviesContainer.insertAdjacentHTML('beforeend', posterHTML);
        }

        swiperSlide.appendChild(moviesContainer);
        swiperContainer.appendChild(swiperSlide);
    }

    // Add click event listeners to movie containers
    const movieContainers = document.querySelectorAll('.movie-container');
    movieContainers.forEach(container => {
        container.addEventListener('click', handleMovieClick);
    });
}

// Function to handle movie click event
function handleMovieClick(event) {
    const movieId = event.currentTarget.dataset.id;
    sessionStorage.setItem('selectedMovieId', movieId);
    window.location.href = './movie-info/movie-info.html';
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

    menuIcon.on('click', function() {
        if (dropDown.css('display') === 'none') {
            dropDown.css('display', 'flex');
        } else {
            dropDown.hide();
        }
    });

    $(window).on('resize', function() {
        hideDropDown();
    });
});
