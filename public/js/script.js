let signupBtn = document.getElementById('signupBtn');
signupBtn.addEventListener("click", displaySignUp);

let loginBtn = document.getElementById('loginBtn');
loginBtn.addEventListener("click", displayLogIn);

function displaySignUp() {
  var myModal = new bootstrap.Modal(document.getElementById('signupModal'));
  myModal.show();

  document.querySelector("#signUpInfo").innerHTML = 
    `<form id="signup" method="POST" action="/signup">
      Username: <input name="username" type="text"> <br>
      First Name: <input name="firstName" type="text"> <br>
      Last Name: <input name="lastName" type="text"> <br>
      Password: <input name="password" type="password"> <br>
      Re-enter Password: <input name="rePassword" type="password">
    </form>`;

}
function displayLogIn() {
  var myModal = new bootstrap.Modal(document.getElementById('loginModal'));
  myModal.show();

  document.querySelector("#logInInfo").innerHTML = 
    `<form id="login" method="POST" action="/login">
      Username: <input name="username" type="text"> <br>
      Password: <input name="password" type="password">
    </form>`;
}