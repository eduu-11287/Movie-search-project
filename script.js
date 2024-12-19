const apiKey = 'cf5d0a76';  //its required for fetching movies data
const movieList = document.getElementById('movie-list');//declaration and assaining variables/where search results will be displayed
const searchBox = document.getElementById('search-box');//searchBox: The input field for entering a movie title.
const searchBtn = document.getElementById('search-btn');//searchBtn: The button used to trigger a search.
const favoritesList = document.getElementById('favorites-list');//favoritesList: The container for displaying favorite movies.
const favoriteSearchBox = document.getElementById('favorite-search-box');//favoriteSearchBox: The search field for filtering favorites.
const favoriteSearchBtn = document.getElementById('favorite-search-btn');//favoriteSearchBtn: The button to trigger a search within favorites.
const genreFilter = document.getElementById('genre-filter');//genreFilter: A dropdown select element to filter movies by genre.
const notificationContainer = document.getElementById('notification-container');  // Container for notifications

// Load favorites from localStorage
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];//This line retrieves the list of favorite movies from localStorage. 
// If no favorites are saved (i.e., it’s the first time using the app), it defaults to an empty array ([]).

function showNotification(message) {
    const notification = document.createElement('div');// Creates a new <div> element that will be used to display the notification.
    notification.className = 'notification';//Sets the className of the d
    notification.innerHTML = message;//Inserts the provided message inside the div as its content.
    notificationContainer.appendChild(notification);//Appends the notification div to notificationContainer, 
    // which is a previously selected DOM element where notifications will be displayed.
    //append means to add an item to the end of an array


    // Automatically remove the notification after 3 seconds
    setTimeout(() => {
        notification.remove();//After 5 seconds this line remoes the notification from the DOM
    }, 5000);
}
                        //filtering function
function renderFavorites(filteredFavorites = favorites) {//defination of the fuction and it takes filterFavorite as argument and favorite as default if no argument are provided
    favoritesList.innerHTML = '';//Clears the content of favoritesList  before re-reading the updated list.
    filteredFavorites.forEach((movie, index) => {//Loops through each movie in the filteredFavorites array using forEach. 
    // The movie is assigned to the variable movie, and its index is assigned to index.

        const li = document.createElement('li');//Creates a new <li> element, which will represent a single movie in the favorites list.


        // Sets the inner HTML of the <li> to display:
        //The movie title inside a <span> tag, where the ID is dynamic based on the movie index.

        li.innerHTML = `
            <span id="movie-title-${index}">${movie.Title}</span>
            <input type="text" id="edit-title-${index}" value="${movie.Title}" style="display: none;" />
            
            <!-- Wrap buttons in a container -->
            <div class="movie-buttons-container">
                <button onclick="editMovie(${index})">Edit</button>
                <button onclick="saveEdit(${index})" style="display: none;" id="save-btn-${index}">Save</button>
                <button onclick="removeFromFavorites(${index})">Remove</button>
            </div>
        `;
        favoritesList.appendChild(li);//Appends the newly created <li> to the favoritesList element.
    });
}
                    //editing function
function editMovie(index) {  //Defines the function editMovie(index), which is called when the user clicks the "Edit" button. It takes the movie's index as an argument.
    document.getElementById(`movie-title-${index}`).style.display = 'none';//The title text (inside the <span> element) is hidden by setting its display property to none.

    document.getElementById(`edit-title-${index}`).style.display = 'inline';//The editable input field  is made visible by setting its display property to inline.

    document.getElementById(`save-btn-${index}`).style.display = 'inline';//The "Save" button is made visible by setting its display property to inline.

}

                        //saving function
function saveEdit(index) {//Defines the saveEdit function that is called when the user clicks the "Save" button.

    const editedTitle = document.getElementById(`edit-title-${index}`).value;//Retrieves the value entered by the user in the input field  for the movie at the specified index.

    if (editedTitle) {//Checks if the editedTitle is not empty.

        favorites[index].Title = editedTitle;//Updates the title of the movie in the favorites array at the specified index.

        localStorage.setItem('favorites', JSON.stringify(favorites));//Saves the updated favorites array to localStorage so the changes persist even after refreshing the page.
                                                                    // instead of having a db.json we use local storage
        renderFavorites(); // Re-render the favorites list with the updated title
        showNotification("Saved");//Shows a notification to inform the user that the title has been saved.

    }
}
                //Rendering movie function
function renderMovies(movies) { //Defines the function renderMovies(movies), which takes an array of movie objects (movies) and displays them in the UI.

    movieList.innerHTML = ''; //Clears the movie list before rendering new results
    movies.forEach(movie => { //Loops through each movie in the 'movies' array.......its an arrow function
        const movieCard = document.createElement('div'); //Creates a new div element (movieCard) to represent the individual movie
        movieCard.className = 'movie-card';// Sets the class of the movieCard element to 'movie-card' for styling.
        
        const img = movie.Poster !== 'N/A' ? `<img src="${movie.Poster}" alt="${movie.Title}">` : '';//Checks if the movie has a poster available. If so, it displays the poster image using an <img> tag. 
        // If the poster is not available ('N/A'), the img variable remains empty.

        /*Defines the inner HTML of the movieCard, displaying:
            The poster image (if available).
            The movie title and year.
            A button to add the movie to favorites, which calls the addToFavorites() function when clicked.*/
                    movieCard.innerHTML = `
            ${img}
            <h3>${movie.Title}</h3>
            <p>${movie.Year}</p>
            <button onclick="addToFavorites('${movie.imdbID}')">Add to Favorites</button>
        `;
        movieList.appendChild(movieCard);//Appends the movieCard to the movieList element to display it in the UI.
    });
}

                //function for searching the movies
function searchMovies(query, genre) {//Defines the searchMovies(query, genre) function,
//  which handles searching for movies based on a query and optional genre.
    if (query === '') return;//If the query is empty, the function immediately exits (returns) without performing any search.
    showNotification("Searching for movies...");//Displays a notification that the search is in progress.
    let url = `https://www.omdbapi.com/?s=${query}&apikey=${apiKey}`; //Builds the URL for the OMDb API using the provided query and API key.
    if (genre) {
        url += `&genre=${genre}`;
    }

    fetch(url)//Sends a request to the OMDb API using fetch().
        .then(response => response.json()) //Converts the API response to JSON format.
        .then(data => {
            if (data.Response === 'True') { //If the response is true (data.Response === 'True'), it calls renderMovies() to display the movie results.

                renderMovies(data.Search);
                showNotification("Movies found");
            } else {
                movieList.innerHTML = `<p>No movies found.</p>`;//If no movies are found, 
                // it displays a "No movies found" message and shows a corresponding notification.
                showNotification("No movies found");
            }
        })
        .catch(error => console.error('Error fetching data:', error));//Catches any errors during the fetch request and logs them to the console.

}


                    // function for adding movies to favorite list
function addToFavorites(imdbID) {//Defines the function addToFavorites(imdbID), 
// which adds a movie to the user's favorites list. It takes the IMDb ID (imdbID) of the movie to be added.

    fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`) //Sends a request to the OMDb API to get detailed information about the movie using its imdbID.

        .then(response => response.json())//Converts the response into JSON format.

        .then(movie => { //arrow function
            //The function checks if the movie is already in the favorites list by using Array.prototype.some(). 
            // If the movie is not already in the favorites list, it proceeds to the next steps.
           
            if (!favorites.some(fav => fav.imdbID === imdbID)) {//  // !favorites.some is a methode that checks if one element passese a test provided by a call back function  and returns true if it passes and false if otherwise
                favorites.push(movie); //Adds the movie to the favorites array.
                localStorage.setItem('favorites', JSON.stringify(favorites));//Saves the updated favorites array to localStorage using localStorage.setItem()

                renderFavorites();//Calls renderFavorites() to re-render the updated list of favorites.

                showNotification("Movie added to favorites");//shows notification
            }
        })
        .catch(error => console.error('Error adding to favorites:', error));//If there is an error while adding the movie, it is caught and logged to the console.

}

                //Delleting function
function removeFromFavorites(index) {//Defines the removeFromFavorites(index) function, which removes a movie from the favorites list based on its index in the favorites array.

    const confirmDelete = confirm("Are you sure you want to delete this movie?");//Uses confirm() to display a confirmation dialog asking the user if they are sure they want to delete the movie. The result is stored in the confirmDelete variable.
    if (confirmDelete) {
        favorites.splice(index, 1);//If the user confirms the deletion, the following actions are performed:
        //splice modify an array by removing, replacing, or adding elements to it. It changes the original array and returns an array containing the removed elements .

        localStorage.setItem('favorites', JSON.stringify(favorites));//The updated favorites array is saved to localStorage to persist the changes.

        renderFavorites();//Calls renderFavorites() to update the UI and remove the deleted movie.

        showNotification("Record deleted");//shows notification
    } else {
        showNotification("Record not deleted");//shows notification "ecord not deleted" if user cancles the deletion
    }
}

function filterFavorites(query) { //Defines the filterFavorites(query) function, which filters the favorites list based on the provided search query.

    const filteredFavorites = favorites.filter(movie => 
        movie.Title.toLowerCase().includes(query.toLowerCase())//Uses the filter() method to create a new array (filteredFavorites) that contains only the movies whose titles include the search query  and its case-insensitive.

    );
    renderFavorites(filteredFavorites);//Calls renderFavorites(filteredFavorites) to re-render the filtered list of favorites.

    showNotification("No movies found"); // Displays a notification saying "No movies found".
}

// Event listeners
searchBtn.addEventListener('click', () => { //Adds an event listener to the searchBtn (search button). When the button is clicked, the following actions occur:

    const query = searchBox.value.trim();//Retrieves the value from the searchBox input field, removes extra spaces using trim(), and stores it in query.

    const selectedGenre = genreFilter.value;
    searchMovies(query, selectedGenre);//Calls the searchMovies() function with the query and selectedGenre to start searching for movies.

});

searchBox.addEventListener('keypress', (e) => { //Adds an event listener to the searchBox. 
// This listener listens for the keypress event.ie enter ker when pressed

    if (e.key === 'Enter') {//Checks if the key pressed is the "Enter" key (e.key === 'Enter').

        const query = searchBox.value.trim();//If the Enter key is pressed, it retrieves the query from the search box (removing extra spaces).

        const selectedGenre = genreFilter.value;//Retrieves the selected genre from the genre filter.

        searchMovies(query, selectedGenre);//Calls searchMovies(query, selectedGenre) to perform the search when the Enter key is pressed.

    }
});

favoriteSearchBtn.addEventListener('click', () => {//Adds an event listener to the favoriteSearchBtn

    const query = favoriteSearchBox.value.trim();//Retrieves the value from the favoriteSearchBox input field, removes extra spaces using trim(), and stores it in query.

    filterFavorites(query);  // Filter favorites by name when button is clicked
});

// Initial render of favorites
renderFavorites();//Initially renders the favorites list by calling renderFavorites() when the page loads. This ensures that any previously saved favorites are displayed

