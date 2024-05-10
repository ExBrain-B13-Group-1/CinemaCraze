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
        fetch(`https://api.themoviedb.org/3/movie/${passedId}/credits?language=en-US`, options)
            .then(response => response.json())
            .then(creditsData => {
                data.credits = creditsData;
                populateInfo(data);
            })
            .catch(err => console.error(err));
    })
    .catch(err => console.error(err));

    function populateInfo(data) {
        const mainContainer = document.querySelector('.main-container');
        const { title, poster_path, overview, genres, vote_average, backdrop_path, credits } = data;
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
                <div class="movie-release-date">2024</div>
                <div class="movie-genre">${genreString}</div>
                <div class="rating">
                    <ion-icon name="star" class="full-star"></ion-icon><ion-icon name="star-half"
                        class="half-star"></ion-icon> ${vote_average}
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
    
        mainContainer.innerHTML = movieInfoHTML;
        if (backdrop_path) {
            document.body.style.backgroundImage = `url('https://image.tmdb.org/t/p/original${backdrop_path}')`;
        } 
    }
    