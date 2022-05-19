let editBtn = document.getElementById('editBtn');
editBtn.addEventListener("click", editProfile);

let updatePassBtn = document.getElementById('updatePassBtn');
updatePassBtn.addEventListener("click", updatePass);

function editProfile() {
  var myModal = new bootstrap.Modal(document.getElementById('profileEditModal'));
  myModal.show();
  let error = document.querySelectorAll(".errorMsg");
  for (let i = 0; i < error.length; i++)
  {
    error[i].innerHTML = "";
  }
}

function updatePass() {
  var myModal = new bootstrap.Modal(document.getElementById('updatePass'));
  myModal.show();
  let error = document.querySelectorAll(".errorMsg");
  for (let i = 0; i < error.length; i++)
  {
    error[i].innerHTML = "";
  }
}