const passedId = sessionStorage.getItem('selectedMovieId');
console.log(passedId);
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlODVmNGIzYTlhNWZlODcxZmQxMjg5NGFlMmEzMTVlNSIsInN1YiI6IjY2M2IzOGNiYTFiNzg1YjQwMjhlY2Y2ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.wblEHHeXdWuVJNysQ7_gMsOxKlSRL3lridI6MAJhtzU'
    }
};

fetch(`https://api.themoviedb.org/3/movie/${passedId}?language=en-US`, options)
    .then(response => response.json())
    .then(data => {
        populateInfo(data); // Call populateInfo inside this then block
    })
    .catch(err => console.error(err));

function populateInfo(data) {
    // Select the main container
    const mainContainer = document.querySelector('.main-container');

    // Extract necessary data from the fetched data
    const { title, poster_path, overview, genres, vote_average } = data; // Change rating to vote_average

    // Generate genre strings
    const genreString = genres.map(genre => genre.name).join(' / ');

    // HTML snippet to append
    const movieInfoHTML = `
    <div class="left-container">
        <div class="poster-container">
            <div class="movie-poster">
                <img src="https://image.tmdb.org/t/p/w500${poster_path}" alt="${title}" /> <!-- Change src to use TMDB image URL -->
            </div>
            <div class="booking-info">
                <a href="/booking" class="btn-booking">Book Movie</a>
            </div>
        </div>
    </div>
    <div class="movie-info">
        <div class="inner-movie-info">
            <div class="movie-name">${title}</div>
            <div class="movie-release-date">2024</div>
            <div class="movie-genre">${genreString}</div>
            <div class="rating">
                <ion-icon name="star" class="full-star"></ion-icon><ion-icon name="star-half"
                    class="half-star"></ion-icon> ${vote_average} <!-- Change rating to vote_average -->
            </div>
            <h1 class="synopsis">Synopsis</h1>
            <div class="plot-summary">
                ${overview}
            </div>
            <div class="director">
                <span class="name">Director</span>
                <div class="director-info">
                    <div class="director-img"><img src="/assets/nolan.jpg" alt=""></div>
                    <p class="director-text">Christopher Nolan</p>
                </div>
            </div>
            <div class="cast">
                <span class="name">Cast</span>
                <div class="cast-info">
                    <div class="cast-img"><img src="/assets/leonardo.jpg" alt=""></div>
                    <p class="cast-text">Leonardo Decapario</p>
                </div>
            </div>
        </div>
    </div>
    `;

    // Append the HTML to the main container
    mainContainer.innerHTML = movieInfoHTML;
}
