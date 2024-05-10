const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlODVmNGIzYTlhNWZlODcxZmQxMjg5NGFlMmEzMTVlNSIsInN1YiI6IjY2M2IzOGNiYTFiNzg1YjQwMjhlY2Y2ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.wblEHHeXdWuVJNysQ7_gMsOxKlSRL3lridI6MAJhtzU'
    }
  };

fetch('https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1', options)
    .then(response => response.json())
    .then(data => {
        populateNowPlaying(data.results);
    })
    .catch(error => console.error('Error fetching "Now Showing" data:', error));

function populateNowPlaying(results) {
    const posterParent = document.getElementById("posters");

    // Loop through the first 5 movies in the results array
    for (let i = 0; i < Math.min(results.length, 5); i++) {
        const movie = results[i];
        const posterHTML = `
            <label for="s${i + 1}" id="poster${i + 1}" class="label">
                <div class="poster">
                    <div class="image">
                        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" data-id="${movie.id}" />
                    </div>
                    <div class="info">
                        <p class="movie-name" data-id="${movie.id}">${movie.title}</p>
                        <div class="movie-genre">Fantasy</div>
                        <div class="rating">
                            <div class="rating-flex">
                                <ion-icon name="star" class="full-star"></ion-icon>
                                <ion-icon name="star-half" class="half-star"></ion-icon>
                                <span class="rating-number">${movie.vote_average}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </label>`;
        posterParent.insertAdjacentHTML('beforeend', posterHTML);

        // Add event listener to movie name and image
        const movieName = document.querySelector(`#poster${i + 1} .movie-name`);
        const movieImage = document.querySelector(`#poster${i + 1} .image img`);

        // Check if movieName and movieImage are found before adding event listeners
        if (movieName && movieImage) {
            movieName.addEventListener('click', handleMovieClick);
            movieImage.addEventListener('click', handleMovieClick);
        } else {
            console.error('Movie name or image not found for index:', i);
        }
    }
}

fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', options)
  .then(response => response.json())
  .then(data => {
    populateTrendingNow(data.results.slice(0, 15)); // Take only the first 15 movies
  })
  .catch(err => console.error(err));

function populateTrendingNow(results) {
    const swiperContainer = document.querySelector('.mySwiper'); // Selecting the swiper container

    // Calculate the number of movies per slide
    const moviesPerSlide = 5;

    console.log('Total number of movies:', results.length);

    // Loop through the three swiper slides
    for (let i = 0; i < 3; i++) {
        console.log('Creating swiper slide', i + 1);

        const swiperSlide = document.createElement('swiper-slide');
        swiperSlide.classList.add('swiper-slide');

        // Create a container for movies within the swiper slide
        const moviesContainer = document.createElement('div');
        moviesContainer.classList.add('movies-container');

        // Loop through the movies for this slide
        for (let j = i * moviesPerSlide; j < Math.min((i + 1) * moviesPerSlide, results.length); j++) {
            const movie = results[j];
            console.log('Adding movie', movie.title, 'to slide', i + 1);

            const posterHTML = `
                <div class="movie-container" data-url="${movie.url}" data-id="${movie.id}">
                    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
                    <div class="all-info">
                        <div class="movie-info">
                            <p class="movie-name">${movie.title}</p>
                            <div class="movie-genre">Fantasy</div>
                            <div class="rating">
                                <ion-icon name="star" class="full-star"></ion-icon>
                                <ion-icon name="star-half" class="half-star"></ion-icon>
                                <span class="rating-number">${movie.vote_average}</span>
                            </div>
                        </div>
                    </div>
                </div>`;
            moviesContainer.insertAdjacentHTML('beforeend', posterHTML);
        }

        // Append the movies container to the swiper slide
        swiperSlide.appendChild(moviesContainer);

        // Append the swiper slide to the swiper container
        swiperContainer.appendChild(swiperSlide);
    }

    // Initialize Swiper here if needed

    // Add event listener to movie containers
    const movieContainers = document.querySelectorAll('.movie-container');
    movieContainers.forEach(container => {
        container.addEventListener('click', handleMovieClick);
    });
}


function handleMovieClick(event) {
    const movieId = event.currentTarget.dataset.id;
    sessionStorage.setItem('selectedMovieId', movieId);
    window.location.href = './movie-info/movie-info.html'; // Change 'otherpage.html' to the actual page you want to navigate to
}
