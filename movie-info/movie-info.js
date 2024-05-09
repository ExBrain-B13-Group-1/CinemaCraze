const passedId = sessionStorage.getItem('selectedMovieId');
console.log(passedId);
const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlODVmNGIzYTlhNWZlODcxZmQxMjg5NGFlMmEzMTVlNSIsInN1YiI6IjY2M2IzOGNiYTFiNzg1YjQwMjhlY2Y2ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.wblEHHeXdWuVJNysQ7_gMsOxKlSRL3lridI6MAJhtzU'
    }
  };
  
  fetch('https://api.themoviedb.org/3/movie/967847?language=en-US', options)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));
function populateInfo(){
    
}
`<div class="left-container">
<div class="poster-container">
    <div class="movie-poster">
        <img src="/assets/Inception.jpg" alt="" />
    </div>
    <div class="booking-info">
        <a href="/booking" class="btn-booking">Book Movie</a>
    </div>
</div>
</div>
<div class="movie-info">
<div class="inner-movie-info">
    <div class="movie-name">The Inception</div>
    <div class="movie-release-date">2024</div>
    <div class="movie-genre">Fantasy / Action</div>
    <div class="rating">
        <ion-icon name="star" class="full-star"></ion-icon><ion-icon name="star-half"
            class="half-star"></ion-icon> 8
    </div>
    <h1 class="synopsis">Synopsis</h1>
    <div class="plot-summary">
        The Spengler family returns to where it all started – the iconic New
        York City firehouse – to team up with the original Ghostbusters,
        who've developed a top-secret research lab to take busting ghosts to
        the next level. But when the discovery of an ancient artifact
        unleashes an evil force, Ghostbusters new and old must join forces
        to protect their home and save the world from a second Ice Age.
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
</div>`