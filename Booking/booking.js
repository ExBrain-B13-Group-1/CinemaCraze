let selectedSeats = [];
let selectedFoodItems = [];
let selectedDate;
let selectedTime;
let movieName;
let posterImage;
let isPaid = false;

const passedId = sessionStorage.getItem("selectedMovieId");
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlODVmNGIzYTlhNWZlODcxZmQxMjg5NGFlMmEzMTVlNSIsInN1YiI6IjY2M2IzOGNiYTFiNzg1YjQwMjhlY2Y2ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.wblEHHeXdWuVJNysQ7_gMsOxKlSRL3lridI6MAJhtzU",
  },
};
async function fetchMovieData(passedId) {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${passedId}?language=en-US`,
      options
    );
    const data = await response.json();
    movieName = data.original_title;
    document.getElementById("movieName").innerHTML = `Movie Name: ${movieName}`;
    posterImage = data.poster_path;
    document.querySelector(".poster-container").style.display = "flex";
  } catch (error) {
    console.error(error);
  }
}
fetchMovieData(passedId);

// Function to create booking json
function createBookingJSON() {
  let totalSeats = selectedSeats.length;
  let showTime = convertToAmPm(selectedTime);
  let countdownTime = document.getElementById("countdown-timer").innerText;
  let bookingData = {
    cinema: "Cinema Craze",
    movie: movieName,
    poster: posterImage,
    showDate: selectedDate,
    showTime: showTime,
    selectedTime: selectedTime,
    seats: selectedSeats,
    foodItems: selectedFoodItems,
    totalSeats: totalSeats,
    countdownTimer: countdownTime,
    isPaid: isPaid,
  };
  localStorage.setItem("booking", JSON.stringify(bookingData));
  return bookingData;
}

// Function to enable or disable tabs based on the current step
function updateTabs(step) {
  $(".tab").addClass("disabled");
  switch (step) {
    case 0:
      $("#tab-book-dateTime").removeClass("disabled");
      break;
    case 1:
      $("#tab-book-dateTime").removeClass("disabled");
      $("#tab-select-seats").removeClass("disabled");
      break;
    case 2:
      $("#tab-book-dateTime").removeClass("disabled");
      $("#tab-select-seats").removeClass("disabled");
      $("#tab-get-food").removeClass("disabled");
      break;
    case 3:
      $("#tab-book-dateTime").removeClass("disabled");
      $("#tab-select-seats").removeClass("disabled");
      $("#tab-get-food").removeClass("disabled");
      $("#tab-confirm").removeClass("disabled");
      break;
    case 4:
      $("#tab-booking-successful").removeClass("disabled");
      break;
  }
}

// Event listener for tab
$(".tab").click(function () {
  if (!$(this).hasClass("disabled")) {
    let tabId = $(this).attr("id").replace("tab-", "");
    showTab(tabId);
  }
});

// Function to show a specific tab
function showTab(tabId) {
  $(".tab-content").hide();
  $("#" + tabId).show();
  $(".tab").removeClass("active");
  $("#tab-" + tabId).addClass("active");
}

$(document).ready(function () {
  $(window).scroll(function () {
    if (window.scrollY > 0) {
      $(".navbar").css("background-color", "var(--primary-color");
      $(".navbar").addClass("sticky");
    } else {
      $(".navbar").css("background-color", "var(--secondary-color");
      $(".navbar").removeClass("sticky");
    }
  });

  $("#trending").hover(
    function () {
      $(this).find(".down-icon").hide();
      $(this).find(".up-icon").css({
        display: "inline-block",
      });
    },
    function () {
      $(this).find(".down-icon").show();
      $(this).find(".up-icon").css({
        display: "none",
      });
    }
  );

  $(".category").hover(
    function () {
      $(this).parent().parent().find(".down-icon").hide();
      $(this).parent().parent().find(".up-icon").css({
        display: "inline-block",
      });
    },
    function () {
      $(this).parent().parent().find(".down-icon").show();
      $(this).parent().parent().find(".up-icon").css({
        display: "none",
      });
    }
  );

  $(document).on("click", "#toggle-icon", function () {
    $("#sidebar").fadeIn();
  });

  $(document).on("click", "#close-icon", function () {
    $("#sidebar").fadeOut();
  });

  $(document).on("click", "#now-showing", function () {
    // bro thiha thwin page
    window.location.href = "../index.html";
  });
  let getFood = () => {
    fetch("food.json")
      .then((res) => res.json())
      .then((data) => {
        data.forEach((food) => {
          const foodCardHTML = `
            <div class="food-card">
            <div class="food-image">
            <img src="${food.image}" alt="${food.name}">
            </div>
              <div class="food-details">
                <h2 class="food-name">${food.name}</h2>
                <p class="food-desc">${food.description}</p>
                <div>
                  <p class="food-price">${food.price + " Ks"}</p>
                  <div class="quantity">
                    <button class="quantity-btn minus">-</button>
                    <input type="text" class="quantity-input" value="${
                      food.quantity
                    }">
                    <button class="quantity-btn plus">+</button>
                  </div>
              </div>
              </div>
            </div>
          `;
          $(".foods").append(foodCardHTML);
        });

        // Event listener for quantity input
        $(".quantity-input").on("input", function () {
          let value = $(this).val();
          let parsedValue = parseInt(value);
          if (!isNaN(parsedValue) && parsedValue >= 0) {
            if (parsedValue > 10) {
              $(this).val(10); // Set input value to 10 if it's greater than 10
            } else {
              $(this).val(parsedValue); // Set input value to the parsed integer
            }
          } else {
            $(this).val(0); // Set input value to 0 if it's not a valid number
          }
        });

        // Event listener for minus button
        $(".minus").on("click", function () {
          let inputField = $(this).closest(".quantity").find(".quantity-input");
          let value = parseInt(inputField.val());
          if (value > 0) {
            inputField.val(value - 1);
          }
        });

        // Event listener for plus button
        $(".plus").on("click", function () {
          let inputField = $(this).closest(".quantity").find(".quantity-input");
          let value = parseInt(inputField.val());
          if (value < 10) {
            inputField.val(value + 1);
          }
        });
      })
      .catch((error) => console.log(error));
  };
  getFood();
  showTab("book-dateTime");

  // Define seat prices
  let prices = {
    A: 4500,
    B: 5500,
    C: 7500,
    D: 7500,
    E: 9500,
    F: 9500,
    G: 9500,
    H: 9500,
    L: 20500,
  };
  dayDateHandler();
  showTimeHandler();
  $(".seats-selected").hide();
  $(".container").removeClass("mainbody");

  // Event listener for back button
  $("#book-back").click(function () {
    window.location.href = "../movie-info/movie-info.html";
  });

  // Show/hide delete icon on hover by using mouse event
  $(document)
    .on(
      "mouseenter",
      ".selected-seats table tbody tr, .selected-food table tbody tr",
      function () {
        if ($(this).find(".delete-icon").length > 0) {
          $(this).find(".delete-icon").show();
        }
      }
    )
    .on(
      "mouseleave",
      ".selected-seats table tbody tr, .selected-food table tbody tr",
      function () {
        if ($(this).find(".delete-icon").length > 0) {
          $(this).find(".delete-icon").hide();
        }
      }
    );

  // Handling delete icon of seat
  $(document).on("click", ".delete-icon-seat", function () {
    let seatCode = $(this).closest("tr").find("td:nth-child(2)").text();
    selectedSeats = selectedSeats.filter((seat) => seat.seatCode !== seatCode);
    $(this).closest("tr").remove();
    updateSelectedSeatsTable("selected-seats");
    updateSelectedSeatsTable("seats-selected");
    $("#" + seatCode).removeClass("active");
    if (selectedSeats.length === 0) {
      $(".next-select-food-btn").addClass("disabled-button");
      showTab("book-dateTime");
    }
    $(".seats-selected").hide();
    $(".container").removeClass("mainbody");
  });

  // Handling delete icon of food
  $(document).on("click", ".delete-icon-food", function () {
    let itemName = $(this).closest("tr").find("td:nth-child(2)").text();
    let selectedItem = selectedFoodItems.find((item) => item.name === itemName);
    if (selectedItem) {
      let quantityInput = $(".quantity-input").filter(function () {
        return (
          $(this).closest(".food-card").find(".food-name").text() === itemName
        );
      });
      quantityInput.val(0);
    }
    $(this).closest("tr").remove();
    selectedFoodItems = selectedFoodItems.filter(
      (item) => item.name !== itemName
    );
    checkSelectFoodTable();
    updateItemNumbers();
  });

  // Seat got clicked
  $(document).on("click", ".seat", function () {
    handleSeatClick(this);
    updateTabs(2);
    if (selectedSeats.length == 0) {
      updateTabs(1);
    }
  });

  // Function to handle each seat that user clicked
  function handleSeatClick(seat) {
    let seatId = $(seat).attr("id");
    let seatPrice = prices[seatId[0]];
    if ($(seat).hasClass("booked")) {
      return;
    }
    $(seat).toggleClass("active");

    let index = selectedSeats.findIndex((s) => s.seatCode === seatId);
    if (index !== -1) {
      selectedSeats.splice(index, 1);
    } else {
      if (selectedSeats.length < 10) {
        selectedSeats.push({ seatCode: seatId, seatPrice: seatPrice });
      } else {
        let latestSelectedSeat = selectedSeats.pop();
        $("#" + latestSelectedSeat.seatCode).removeClass("active");
        selectedSeats.push({ seatCode: seatId, seatPrice: seatPrice });
      }
    }

    if (selectedSeats.length >= 10) {
      $(".alert-seats").show();
    } else {
      $(".alert-seats").hide();
    }
    updateSelectedSeatsTable("seats-selected");
    if (selectedSeats.length > 0) {
      $(".next-select-food-btn").removeClass("disabled-button");
    } else {
      $(".next-select-food-btn").addClass("disabled-button");
    }
  }

  // Event listener for Book Now button
  $("#book-btn").click(function () {
    showAlert();
  });

  // Event listener for Booking History button
  $("#book-history-btn").click(function () {
    // localStorage.setItem("bookings", JSON.stringify(bookings));
    showBookingHistoryModal();
  });

  // Function to display the booking history in a modal
  function showBookingHistoryModal() {
    const bookings = JSON.parse(localStorage.getItem("bookings"));
    console.log(bookings);
    $("#booking-list").empty();
    if (bookings && bookings.length > 0) {
      bookings.forEach(function (booking, index) {
        const bookingItemHTML = `
              <div class="booking-item">
                  <p>${index + 1}.</span> Movie: <span>${
          booking.movie
        }</span></p>
                  <p>Show Date: <span>${booking.showDate}</span></p>
                  <p>Show Time: <span>${booking.showTime}</span></p>
                  <p>Booked Seats Code: <span>${booking.seats
                    .map((seat) => seat.seatCode)
                    .join(", ")}</span></p>
                  <p>Booking Status: <span>${
                    booking.isPaid ? "Successful" : "Failed"
                  }</span></p>
              </div>
          `;
        $("#booking-list").append(bookingItemHTML);
      });
    } else {
      const noHistoryHTML = `<p class="no-history-message">No booking history was found.</p>`;
      $("#booking-list").append(noHistoryHTML);
    }
    $(".alert-book-history").show();
    $("#overlay").show();
  }

  // Event listener for the OK button in no-booking section
  $("#ok-btn").click(function () {
    $(".alert-book-history").hide();
    $("#overlay").hide();
  });

  // Add click event handler to the payment link
  $("#payment-link").click(function () {
    $(this).css({ "pointer-events": "none", opacity: "0.5" });
  });

  // Event listener for Book Continue button
  $(".continue-btn, #selected-verify-button").click(function () {
    slideUpAndRemoveClass();
    hideAlert();
    checkSelectFoodTable();
    if (selectedTimeClicked !== null) {
      // If show time has been clicked, use selected time for today
      selectedTime = selectedTimeClicked;
    } else {
      // If no time has been clicked, set selected time to the nearest available time for today
      selectedTime = getNearestTime(new Date(), times);
    }
    showFinishBooking(
      movieName,
      selectedDate,
      selectedTime,
      selectedSeats.length,
      isPaid
    );
    $(".seats-selected").slideUp();
    showTab("confirm");
    updateSelectedSeatsTable("selected-seats");
  });

  // Event listener for Cancel button in alert box
  $(".cancel-btn").click(function () {
    hideAlert();
  });

  // Function to update back  two selected seats table, in seat tab and confirm tab
  function updateSelectedSeatsTable(selected) {
    let table = $(`.${selected} table`);
    table.find("tbody").empty();
    totalPrice = 0;
    let category;
    selectedSeats.forEach(function (seat, index) {
      if (seat.seatCode[0] === "A" || seat.seatCode[0] === "B") {
        category = "Front Row";
      } else if (seat.seatCode[0] === "C" || seat.seatCode[0] === "D") {
        category = "Middle Row";
      } else {
        category = "Back Row";
      }
      let price = seat.seatPrice;
      let rowHTML = `
            <tr>
                <td>${index + 1}</td>
                <td>${seat.seatCode}</td>
                <td>${category}</td>
                <td>${price} Ks</td>
            `;
      if (selected == "selected-seats" || selected == "selected-food") {
        rowHTML += `
                <td class="delete-icon-cell">
                    <div class="delete-icon delete-icon-seat">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                    </div>
                </td>
            `;
      } else {
        rowHTML += "<td></td>";
      }
      rowHTML += "</tr>";
      table.find("tbody").append(rowHTML);
    });
    if ($(window).width() <= 1200) {
      $(".seats-selected").hide();
    } else {
      if (selected === "seats-selected") {
        if (selectedSeats.length > 0) {
          $(".seats-selected").slideDown();
          $(".container").addClass("mainbody");
        } else {
          $(".seats-selected").slideUp();
          $(".container").removeClass("mainbody");
        }
      }
    }
  }

  // Function to show the finish booking section
  function showFinishBooking(
    movieName,
    selectedDate,
    selectedTime,
    totalSeats,
    isPaid
  ) {
    $(".finish-book").show();
  }

  // Function to show the alert box
  function showAlert() {
    $(".alert-box").show();
    $("#overlay").show();
  }

  // Function to hide the alert box
  function hideAlert() {
    $(".alert-box").hide();
    $(".alert-seats").hide();
    $("#overlay").hide();
  }

  // Define an array to hold all bookings
  let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

  // Event listener for 3 Select Seats button in corresponding tab
  $("#select-seats-button, #select-seats-back-button, #tab-select-seats").click(
    function () {
      if (selectedSeats.length > 0) {
        $(".seats-selected").slideDown();
        $(".container").addClass("mainbody");
      }
      if ($(window).width() <= 1200) {
        $(".seats-selected").hide();
      }
      $(".seat").removeClass("booked");
      matchBooking();
      showTab("select-seats");
    }
  );

  // Event listener for going seats button and tabs again
  $("#select-seats-button, #tab-select-seats").click(function () {
    $(".seat").removeClass("active booked");
    matchBooking();
    showTab("select-seats");
    selectedSeats.forEach(function (seat) {
      $("#" + seat.seatCode).addClass("active");
    });
  });

  // Function to check match booking for selected day and show time
  function matchBooking() {
    let isBooked = false;
    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    bookings.forEach((booking) => {
      if (
        booking.movie === movieName &&
        booking.showDate === selectedDate &&
        booking.selectedTime === selectedTime
      ) {
        let bookedSeats = booking.seats;
        bookedSeats.forEach((seat) => {
          $("#" + seat.seatCode).addClass("active booked");
        });
        isBooked = true;
      }
    });
    // for selected seat is active, but change date time which is already booked that seat
    selectedSeats = selectedSeats.filter((seat) => {
      if ($("#" + seat.seatCode).hasClass("active booked")) {
        return false;
      }
      updateSelectedSeatsTable("seats-selected");
      return true;
    });
    return isBooked;
  }

  // Event Listener for book date-time tab
  $("#tab-book-dateTime").click(function () {
    slideUpAndRemoveClass();
  });

  // Event listener for 3 Select Food button in corresponding tab
  $("#select-food-button, .next-select-food-btn, #tab-get-food").click(
    function () {
      if ($(this).hasClass("disabled-button")) {
        return;
      }
      $(".seats-selected").slideUp();
      $(".container").removeClass("mainbody");
      updateTabs(3);
      showTab("get-food");
    }
  );

  // Event listener for Verify button
  $("#selected-verify-button, #tab-confirm, #confirm-btn").click(function () {
    slideUpAndRemoveClass();
    updateSelectedSeatsTable("selected-seats");
    let selectedFoodItems = getSelectedFoodItems();
    checkSelectFoodTable();
    updateSelectedFoodTable(selectedFoodItems);
    showTab("confirm");
  });

  // Event listener for Confirmation button
  $("#confirm-btn").click(function () {
    $(".quantity-input").val(0);
    let bookingJSON = createBookingJSON();
    bookings.push(bookingJSON);
    localStorage.setItem("bookings", JSON.stringify(bookings));
    updateTabs(4);
    $("#footer").hide();
    showTab("booking-successful");
    startCountdownTimer();
    markSelectedSeatsAsBooked();
    clearAll();
  });

  // Event listener for Cancel All Booking button
  $("#cancel-all-btn").click(function () {
    showTab("book-dateTime");
    selectedSeats.forEach(function (seat) {
      $("#" + seat.seatCode).removeClass("active");
    });
    updateTabs(1);
    clearAll();
  });

  // Function to restart selected seats, food items, update back total price and table
  function clearAll() {
    selectedSeats = [];
    selectedFoodItems = [];
    updateSelectedSeatsTable("selected-seats");
    updateSelectedFoodTable(selectedFoodItems);
  }

  // Function to show/hide food table
  function checkSelectFoodTable() {
    if (selectedFoodItems.length === 0) {
      $(".selected-food-table").hide();
      $(".no-food").show();
    } else {
      $(".selected-food-table").show();
      $(".no-food").hide();
    }
  }

  // Function to get the selected food items
  function getSelectedFoodItems() {
    selectedFoodItems = [];
    $(".food-card").each(function (index, card) {
      let foodName = $(card).find(".food-name").text();
      let foodPriceText = $(card).find(".food-price").text();
      let foodPrice = parseFloat(foodPriceText.replace(" Ks", ""));
      let foodQuantity = parseInt($(card).find(".quantity-input").val());
      if (foodQuantity > 0 && !isNaN(foodPrice)) {
        selectedFoodItems.push({
          name: foodName,
          price: foodPrice,
          quantity: foodQuantity,
        });
      }
    });
    return selectedFoodItems;
  }

  // Function to update item numbers of selected food table
  function updateItemNumbers() {
    $(".selected-food table tbody tr").each(function (index, row) {
      $(row)
        .find("td:first-child")
        .text(index + 1);
    });
  }

  // Function to update the selected food table in the confirmation tab
  function updateSelectedFoodTable(selectedFoodItems) {
    let tableBody = $(".selected-food table tbody");
    tableBody.empty();
    selectedFoodItems.forEach(function (item, index) {
      let row = `
        <tr>
            <td>${index + 1}</td>
            <td>${item.name}</td>
            <td>${item.quantity + " x " + item.price}</td>
            <td>${item.price * item.quantity + " Ks"}</td>
            <td class="delete-icon-cell">
                <div class="delete-icon delete-icon-food">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                </div>
            </td>
        </tr>
        `;
      tableBody.append(row);
    });
    updateItemNumbers();
    selectedFoodItems = getSelectedFoodItems();
  }

  // Function to mark selected seats as booked
  function markSelectedSeatsAsBooked() {
    selectedSeats.forEach(function (seat) {
      $("#" + seat.seatCode)
        .addClass("booked")
        .off("click");
    });
    const lastBooking = bookings[bookings.length - 1];
    console.log("reach");
    if (!lastBooking.isPaid) {
      lastBooking.seats.forEach(function (seat) {
        $(`#${seat.seatCode}`).removeClass("active booked");
      });
      console.log("is not paid");
    } else {
      console.log("is paid");
    }
  }

  // Event Listener for Back date time Btn
  $("#back-to-dateTime").click(function () {
    slideUpAndRemoveClass();
    showTab("book-dateTime");
  });

  $("#back-to-seat").click(function () {
    if (selectedSeats.length > 0) {
      $(".seats-selected").slideDown();
      $(".container").addClass("mainbody");
    }
    showTab("select-seats");
  });

  // Function to refactor
  function slideUpAndRemoveClass() {
    $(".seats-selected").slideUp();
    $(".container").removeClass("mainbody");
  }

  // CountDown Section
  let countdownInterval;
  // Function to start countdown timer
  function startCountdownTimer() {
    // Set the initial countdown time to 30 minutes
    let countdownTime = 1800; // change time in seconds
    updateCountdownDisplay(countdownTime);
    countdownInterval = setInterval(function () {
      countdownTime--;
      updateCountdownDisplay(countdownTime);

      if (countdownTime <= 0) {
        clearInterval(countdownInterval);
        updateTabs(1);
        $("#footer").show();
        console.log("work");
        $("#tab-book-dateTime").addClass("active");
        $("#payment-link").css({ "pointer-events": "", opacity: "" });
        document.querySelector(".finish-book").style.display = "none";
        const booking = JSON.parse(localStorage.getItem("booking"));
        const bookingUserData = JSON.parse(localStorage.getItem("userData"));
        isPaid = bookingUserData.paymentVerified;
        console.log("expired " + isPaid);
        booking.isPaid = isPaid; // main
        isPaid = booking.isPaid;
        localStorage.setItem("booking", JSON.stringify(booking));
        localStorage.setItem("bookings", JSON.stringify(bookings));
        if (isPaid) {
          let lastIndex = bookings.length - 1;
          bookings[lastIndex].isPaid = true;
          console.log(bookings[lastIndex].isPaid);
        } else {
          markSelectedSeatsAsBooked();
        }
        localStorage.setItem("booking", JSON.stringify(booking));
        localStorage.setItem("bookings", JSON.stringify(bookings));
        document.querySelector(".tab-content").style.display = "block";
        console.log("Countdown timer expired!");
      }
    }, 1000);
  }

  // Function to update countdown display
  function updateCountdownDisplay(countdownTime) {
    let minutes = Math.floor(countdownTime / 60);
    let seconds = countdownTime % 60;
    let countdownText = `${minutes} mins : ${
      seconds < 10 ? "0" : ""
    }${seconds} secs left`;
    document.getElementById("countdown-timer").innerText = countdownText;
  }
});

// Pure JS Code
let today = new Date();
let times = ["11:30", "14:30", "17:30", "19:00"];
let days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];

// Handling Date and Day for booking
function dayDateHandler() {
  // Default selected date be today
  selectedDate = today.toDateString();
  let dates = [];
  for (let i = 0; i < 4; i++) {
    let date = new Date();
    date.setDate(today.getDate() + i);
    dates.push(date);
  }
  let datesHTML = "";
  for (let i = 0; i < dates.length; i++) {
    let dayName = days[dates[i].getDay()];
    let dateString = dates[i].getDate();
    let isSelected = dates[i].toDateString() === selectedDate;
    let activeClass = isSelected ? "active" : "";
    datesHTML += `
    <div class="select-date ${activeClass}" data-date="${dates[
      i
    ].toDateString()}">
      <h3 id="day">${dayName}</h3>
      <h4 id="date">${dateString}</h4>
    </div>
  `;
  }
  document.getElementById("dates").innerHTML = datesHTML;

  let dayElements = document.querySelectorAll(".select-date");
  dayElements.forEach(function (dayElement) {
    dayElement.addEventListener("click", function () {
      dayElements.forEach(function (dayEl) {
        dayEl.classList.remove("active");
      });
      this.classList.add("active");
      selectedDate = this.dataset.date;
      if (selectedDate !== today.toDateString()) {
        updateTabs(1);
      }
      updateTimesHTML(this);
    });
  });
  return selectedDate;
}

// Handling Times HTML and selected Date
function updateTimesHTML(selectedDate) {
  let nearestTime;
  let today = new Date();
  let isTodaySelected =
    selectedDate === today.toDateString()
      ? true
      : selectedDate.dataset.date === today.toDateString();

  if (isTodaySelected) {
    nearestTime = getNearestTime(today, times);
  } else {
    document.querySelectorAll(".select-time").forEach((time) => {
      time.classList.remove("disabled");
    });
    // Make default 11:30 for other days
    nearestTime = "11:30";
  }

  let timesHTML = "";
  times.forEach(function (time) {
    let isActive = time === nearestTime ? "active" : "";
    let isDisabled =
      isTodaySelected && isPastTime(today, time) ? "disabled" : "";
    timesHTML += `
        <div class="select-time ${isActive} ${isDisabled}" data-time="${time}">
          <h3 id="book-time">${time}</h3>
        </div>
      `;
  });

  document.querySelector(".select-time-container").innerHTML = timesHTML;

  let disabledCount = handleDisabledTimes();
  if (disabledCount === 4) {
    timesHTML = "";
    timesHTML += `<div class="no-show-time">No More Show Time For Today</div>`;
    updateTabs(0);
    document.querySelector("#select-seats-button").style.visibility = "hidden";
  } else {
    updateTabs(1);
    document.querySelector("#select-seats-button").style.visibility = "visible";
  }
  document.querySelector(".select-time-container").innerHTML = timesHTML;
  showTimeHandler();
}

// Default for today
updateTimesHTML(dayDateHandler());

// Function to handle the display of show times
function handleDisabledTimes() {
  let allTimesDisabled = 0;
  $(".select-time").each(function () {
    if ($(this).hasClass("disabled")) {
      allTimesDisabled++;
    }
  });
  return allTimesDisabled;
}

// Handling Show Time for booking
function showTimeHandler() {
  attachTimeListeners();
  selectedTime = getNearestTime(today, times);
  return selectedTime;
}

// Variable for handling today show time
let selectedTimeClicked = null;

// Function to add event listeners to each time
function attachTimeListeners() {
  let timeElements = document.querySelectorAll(".select-time");
  timeElements.forEach(function (timeElement) {
    timeElement.addEventListener("click", function () {
      timeElements.forEach(function (timeEl) {
        timeEl.classList.remove("active");
      });
      this.classList.add("active");
      selectedTime = this.dataset.time;
      selectedTimeClicked = selectedTime;
      console.log("Selected Time:", selectedTime);
    });
  });
}

// Function to check if today time is past
function isPastTime(date, time) {
  let [hour, minute] = time.split(":");
  let selectedTime = new Date(date);
  selectedTime.setHours(hour);
  selectedTime.setMinutes(minute);
  return selectedTime < new Date();
}

// Function to calculate nearest time for today
function getNearestTime(today, times) {
  let currentHour = today.getHours();
  let currentMinute = today.getMinutes();
  let currentTotalMinutes = currentHour * 60 + currentMinute;
  let nearestTimeIndex = 0;
  let minDifference = Infinity;

  for (let i = 0; i < times.length; i++) {
    let [hour, minute] = times[i].split(":");
    let totalMinutes = parseInt(hour) * 60 + parseInt(minute);
    let difference = totalMinutes - currentTotalMinutes;

    // If difference is negative, time is in the past
    if (difference >= 0 && difference < minDifference) {
      minDifference = difference;
      nearestTimeIndex = i;
    }
  }
  return times[nearestTimeIndex];
}

// Function to convert time to AM/PM format
function convertToAmPm(time) {
  let [hours, minutes] = time.split(":");
  let ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
}
