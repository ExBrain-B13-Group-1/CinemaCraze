// Fetch and populate Now Showing section
fetch('./nowshowing.json')
    .then(response => response.json())
    .then(data => {
        populateNowPlaying(data);
    })
    .catch(error => console.error('Error fetching data:', error));

    function populateNowPlaying(data) {
        let posterParent = document.getElementById("posters");
        for (let i = 0; i < data.nowshowingdata.length; i++) {
            const movie = data.nowshowingdata[i];
            const genreNames = movie.genres.map(genre => genre.name).join(' / ');
            const posterHTML = `
                <label for="s${i + 1}" id="poster${i + 1}" class="label">
                    <div class="poster">
                        <div class="image">
                            <img src="${movie.poster_path}" alt="${movie.title}" data-id="${movie.id}" />
                        </div>
                        <div class="info">
                            <p class="movie-name" data-id="${movie.id}">${movie.title}</p>
                            <div class="movie-genre">${genreNames}</div>
                            <div class="rating">
                                <div class="rating-flex">
                                    <ion-icon name="star" class="full-star"></ion-icon>
                                    <ion-icon name="star-half" class="half-star"></ion-icon>
                                    <span class="rating-number">${movie.rating}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </label>`;
            posterParent.insertAdjacentHTML('beforeend', posterHTML);
    
            // Add event listener to movie name and image
            const movieName = document.querySelector(`#poster${i + 1} .movie-name`);
            const movieImage = document.querySelector(`#poster${i + 1} .image img`);
    
            movieName.addEventListener('click', handleMovieClick);
            movieImage.addEventListener('click', handleMovieClick);
        }
    }

// Fetch and populate Trending Now section
fetch('./trendingnow.json')
    .then(response => response.json())
    .then(data => {
        populateTrendingNow(data);
    })
    .catch(error => console.error('Error fetching data:', error));

function populateTrendingNow(data) {
    const trendingNowData = data.trendingnowdata; // Accessing the trending now data from the JSON object
    const swiperContainer = document.querySelector('.mySwiper'); // Selecting the swiper container

    // Loop through the data and create swiper slides
    for (let i = 0; i < Math.ceil(trendingNowData.length / 5); i++) {
        const swiperSlide = document.createElement('swiper-slide'); // Create a swiper slide
        swiperSlide.setAttribute('id', `slide${i + 1}`); // Set id for swiper slide

        const trendingMoviesContainer = document.createElement('div'); // Create a container for trending movies
        trendingMoviesContainer.classList.add('trending-movies');

        // Append movie containers to the trending movies container
        for (let j = i * 5; j < Math.min((i + 1) * 5, trendingNowData.length); j++) {
            const movie = trendingNowData[j];
            const genreNames = movie.genres.map(genre => genre.name).join(' / ');
            const posterHTML = `
                <div class="movie-container" data-url="${movie.url}" data-id="${movie.id}">
                    <img src="${movie.poster_path}" alt="${movie.title}" />
                    <div class="all-info">
                        <div class="movie-info">
                            <p class="movie-name">${movie.title}</p>
                            <div class="movie-genre">${genreNames}</div>
                            <div class="rating">
                                <ion-icon name="star" class="full-star"></ion-icon>
                                <ion-icon name="star-half" class="half-star"></ion-icon>
                                <span class="rating-number">${movie.rating}</span>
                            </div>
                        </div>
                    </div>
                </div>`;
            trendingMoviesContainer.insertAdjacentHTML('beforeend', posterHTML);
        }

        swiperSlide.appendChild(trendingMoviesContainer); // Append trending movies container to swiper slide
        swiperContainer.appendChild(swiperSlide); // Append swiper slide to swiper container
    }

    // Add event listener to movie containers
    const movieContainers = document.querySelectorAll('.movie-container');
    movieContainers.forEach(container => {
        container.addEventListener('click', handleMovieClick);
    });
}

function handleMovieClick(event) {
    const movieId = event.currentTarget.dataset.id;
    sessionStorage.setItem('selectedMovieId', movieId);
    window.location.href = 'movie-info.html'; // Change 'otherpage.html' to the actual page you want to navigate to
}

