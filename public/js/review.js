let addReviewBtn = document.getElementById('addReview');
addReviewBtn.addEventListener("click", addReview);

function addReview() {
  var myModal = new bootstrap.Modal(document.getElementById('reviewModal'));
  myModal.show();
  let error = document.querySelector("#errorMsg");
  error.innerHTML = "";
}