const json = JSON.parse(localStorage.getItem("booking"));

const {
  cinema,
  movie,
  poster,
  showDate,
  showTime,
  foodItems,
  totalSeats,
  seats,
} = json;

const totalFoodPrice = foodItems.reduce(
  (acc, item) => acc + item.price * item.quantity,
  0
);

const totalSeatPrice = seats.reduce((acc, item) => acc + item.seatPrice, 0);
const totalPrice = totalFoodPrice + totalSeatPrice;
const tax = 10;
const addTaxPrice = parseInt((totalPrice * tax) / 100);
const totalPriceWithTax = totalPrice + addTaxPrice;
const seatsNumber = seats.map((item) => item.seatCode).join(" / ");
const foods = foodItems
  .map((item) => `${item.name} x${item.quantity}`)
  .join(" / ");

let userInfo = {};
let userData;
// Getters and Setter for User Information
(() => {
  $("#movieName").text(movie);
  $("#showDate").text(showDate);
  $("#showTime").text(showTime);
  $("#cinema").text(cinema);
  $("#totalSeats").text(totalSeats);
  $("#ticketPrice").text(`${totalSeatPrice} Ks`);
  $("#foodPrice").text(`${totalFoodPrice} Ks`);
  $("#tax").text(`${tax}%`);
  $("#totalPrice").text(`${totalPriceWithTax} Ks`);

  $("#moviePoser").append(
    `<img src=https://image.tmdb.org/t/p/w500${poster} width="100%" id="moviePoster" />`
  );

  userInfo.moviename = movie;
  userInfo.showDate = showDate;
  userInfo.showTime = showTime;
  userInfo.cinema = cinema;
  userInfo.totalSeats = totalSeats;
  userInfo.totalSeatPrice = totalSeatPrice;
  userInfo.totalFoodPrice = totalFoodPrice;
  userInfo.totalPrice = totalPriceWithTax;
  userInfo.seatsNumber = seatsNumber;
  userInfo.foods = foods;
  userInfo.stage = 0;
  userInfo.paymentVerified = false;

  userData = JSON.parse(localStorage.getItem("userData")) || userInfo;

  if (userData.stage === 1) {
    choossePayment();
  } else if (userData.stage === 2) {
    getUserFromLocalStorage();
  } else if (userData.stage === "success") {
    $("#line1").attr("line", "active");
    $("#circle2").css({
      "background-color": "var(--primary-color)",
    });
    $("#checkoutContainer").css({
      display: "none",
    });
    paymentSuccess();
  } else return;
})();

$("#paymentCloseBtn").click(() => {
  $("#paymentProvider").fadeOut(200, () => {
    $("#providersContainer").empty();
    $("#number").remove();
    $("#overLay").fadeOut(205);
  });
});

$("#mobilePay").click(() => {
  if ($("#mobilePay").attr("choose") === "true") return;
  const images = `
    <img
    src="assets/payment-provider/mobile/cbpay.png"
    alt="cbpay"
    width="12.6%"
    class='mobile'
    value='CB Pay'
    onClick='clickEvent(this)'
  />
  <img
    src="assets/payment-provider/mobile/kbzpay.png"
    alt="kpay"
    width="12.6%"
    class='mobile'
    value='KBZ Pay'
    onClick='clickEvent(this)'
  />
  <img
    src="assets/payment-provider/mobile/okpay.png"
    alt="okpay"
    width="12.6%"
    class='mobile'
    value='OK Pay'
    onClick='clickEvent(this)'
  />
  <img
    src="assets/payment-provider/mobile/ayapay.png"
    alt="ayapay"
    width="25%"
    class='mobile'
    value='AYA Pay'
    onClick='clickEvent(this)'
  />
  <img
    src="assets/payment-provider/mobile/mytelpay.png"
    alt="mytelpay"
    width="25%"
    class='mobile'
    value='Mytel Pay'
    onClick='clickEvent(this)'
  />
  <img
    src="assets/payment-provider/mobile/onepay.png"
    alt="onepay"
    width="25%"
    class='mobile'
    value='One Pay'
    onClick='clickEvent(this)'
  />
  <img
    src="assets/payment-provider/mobile/truemoney.png"
    alt="truepay"
    width="25%"
    class='mobile'
    value='TrueMoney'
    onClick='clickEvent(this)'
  />
  <img
    src="assets/payment-provider/mobile/wavepay.png"
    alt="wavepay"
    width="25%"
    class='mobile'
    value='Wave Pay'
    onClick='clickEvent(this)'
  />
    `;

  if ($("#providersContainer").html().length === 0)
    $("#providersContainer").append(images);

  $("#inputContainer").append(
    '<input type="number" name="phone_number" id="number" placeholder="Phone Number">'
  );

  $("#overLay").fadeIn(200, () => {
    $("#paymentProvider").fadeIn(205);
  });
});

$("#bankPay").click(() => {
  if ($("#bankPay").attr("choose") === "true") return;
  const images = `
    <img src="assets/payment-provider/bank/abank.png" alt="abank" width="25%" class="bank" value='A Bank' onClick='clickEvent(this)'/>
    <img src="assets/payment-provider/bank/kbz.png" alt="kbz" width="25%" class="bank" value='KBZ Bank' onClick='clickEvent(this)'/>
    <img src="assets/payment-provider/bank/mab.png" alt="mab" width="25%" class="bank" value='MAB Bank' onClick='clickEvent(this)'/>
    <img src="assets/payment-provider/bank/uab.png" alt="uab" width="25%" class="bank" value='UAB Bank' onClick='clickEvent(this)'/>
    <img src="assets/payment-provider/bank/cb.png" alt="cb" width="25%" class="bank" value='CB Bank' onClick='clickEvent(this)'/>
    `;

  if ($("#providersContainer").html().length === 0)
    $("#providersContainer").append(images);

  $("#inputContainer").append(
    '<input type="number" name="bank_acc_number" id="number" placeholder="Bank Acc Number">'
  );
  $("#overLay").fadeIn(200, () => {
    $("#paymentProvider").fadeIn(205);
  });
});

const clickEvent = (element) => {
  $("#providersContainer").children("img.active").removeClass("active");
  $(element).addClass("active");
  userInfo.payment = $(element).attr("value");
};

$("#inputBtn").click(() => {
  console.log(userInfo);
  userInfo.name = $("#name").val();
  userInfo[$("#number").attr("name")] = $("#number").val();
  if (
    userInfo.name &&
    userInfo.payment &&
    userInfo[$("#number").attr("name")]
  ) {
    choossePayment();
    userInfo.stage = 1;

    localStorage.setItem("userData", JSON.stringify(userInfo));
  } else {
    $("#alertContainer").append("<h1>Please fill all fields!</h1>");
    $("#alertContainer").fadeIn(200, () => {
      setTimeout(() => {
        $("#alertContainer").fadeOut(200);
        $("#alertContainer").empty();
      }, 2000);
    });
    return;
  }

  $("#paymentProvider").fadeOut(200, () => {
    $("#providersContainer").empty();
    $("#number").remove();
    $("#overLay").fadeOut(205);
  });
});

function choossePayment() {
  console.log(userData);
  if (userData.bank_acc_number) {
    $("#bankPay").attr("click", true);
  } else {
    $("#mobilePay").attr("click", true);
  }

  $("#bankPay").attr("choose", true);
  $("#mobilePay").attr("choose", true);
  // localStorage.setItem('userData',JSON.stringify(userInfo))
}

$("#xmark").click(() => {
  console.log(userData);
  if (userData.bank_acc_number) {
    $("#bankPay").attr("click", false);
    userData.bank_acc_number = false;
  }

  $("#bankPay").attr("choose", false);
  $("#mobilePay").attr("choose", false);
  localStorage.removeItem("userData");
});

$("#xmark1").click(() => {
  if (userData.phone_number) {
    $("#mobilePay").attr("click", false);
    userData.phone_number = false;
  }

  $("#bankPay").attr("choose", false);
  $("#mobilePay").attr("choose", false);
  localStorage.removeItem("userData");
});

$("#paynowBtn").click(() => {
  console.log(userData);
  if (userData.name && userData.payment) {
    getUserFromLocalStorage();
    userInfo.stage = 2;
    localStorage.setItem("userData", JSON.stringify(userInfo));
  } else {
    $("#alertContainer").append("<h1>Please choose payment!</h1>");
    $("#alertContainer").fadeIn(200, () => {
      setTimeout(() => {
        $("#alertContainer").fadeOut(200);
        $("#alertContainer").empty();
      }, 2000);
    });
    return;
  }
});

function getUserFromLocalStorage() {
  userInfo = JSON.parse(localStorage.getItem("userData")) || {};
  let {
    name,
    moviename,
    bank_acc_number,
    cinema,
    payment,
    showDate,
    showTime,
    totalPrice,
    totalSeats,
    seatsNumber,
    foods,
    phone_number,
  } = userInfo;
  const userTicket = `
  <div class="ticket_info">
  <span>
    <p>movie name</p>
    <p>${moviename}</p>
  </span>

  <span>
    <p>name</p>
    <p>${name}</p>
  </span>

  <span>
    <p>Acc Number</p>
    <p>${bank_acc_number || phone_number}</p>
  </span>

  <span>
    <p>seat</p>
    <p>${totalSeats}</p>
  </span>

  <span>
    <p>seat number</p>
    <p>${seatsNumber}</p>
  </span>

  <span>
    <p>food</p>
    <p>${foods}</p>
  </span>

  <span>
    <p>Date/Time</p>
    <p>${showDate} / ${showTime}</p>
  </span>

  <span>
  <p>cinema</p>
  <p>${cinema}</p>
</span>

  <span>
    <p>payment</p>
    <p>${payment}</p>
  </span>

  <span>
    <p>Total Price</p>
    <p>${totalPrice} Ks</p>
  </span>
 </div>
  `;

  $("#ticketDetail").append(userTicket);
  $("#checkoutContainer").fadeOut(200, () => {
    $("#payoutContainer").fadeIn(205, () => {
      $("#line1").attr("line", "active");
      $("#circle2").css({
        "background-color": "var(--primary-color)",
      });
    });
  });
}

$("#orderBtn").click(() => {
  userInfo.paymentVerified = true;
  userInfo.stage = "success";
  paymentSuccess();
  localStorage.setItem("userData", JSON.stringify(userInfo));
});

function paymentSuccess() {
  $("#payoutContainer").fadeOut(200, () => {
    $("#paymentSuccess").fadeIn(205, () => {
      $("#line2").attr("line", "active");
      $("#circle3").css({
        "background-color": "var(--primary-color)",
      });
      $("#succeessIconContainer").attr("success", "active");
    });
  });
}

$("#ticketDownload").click(() => {
  jsonToPdf();
  localStorage.removeItem("userData");
});

function jsonToPdf() {
  const { jsPDF } = window.jspdf;
  const userTicket = JSON.parse(localStorage.getItem("userData"));
  const number = userTicket.bank_acc_number || userTicket.phone_number;
  let doc = new jsPDF();
  doc.text(`Name: ${userTicket.name}`, 105, 15, null, null, "center");
  doc.text(`Number: ${number}`, 105, 25, null, null, "center");
  doc.text(
    `Movie Name: ${userTicket.moviename}`,
    105,
    35,
    null,
    null,
    "center"
  );
  doc.text(`Seat: ${userTicket.seatsNumber}`, 105, 45, null, null, "center");
  doc.text(`Food: ${userTicket.foods}`, 105, 55, null, null, "center");
  doc.text(`Show Date: ${userTicket.showDate}`, 105, 65, null, null, "center");
  doc.text(`Show Time: ${userTicket.showTime}`, 105, 75, null, null, "center");
  doc.text(`Cinema: ${userTicket.cinema}`, 105, 85, null, null, "center");
  doc.text(`Payment: ${userTicket.payment}`, 105, 95, null, null, "center");
  doc.text(`Price: ${userTicket.totalPrice}`, 105, 105, null, null, "center");
  doc.save("ticket.pdf");
}

//! Nav and Footer

$("#brandLogo").click(() => (window.location.href = "./../index.html"));

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
    window.location.href = "./../index.html";
  });
});
