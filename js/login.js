// #####################  part 0 -> auth ######################
// sessionStorage.removeItem('token');


// #####################  part 1 -> form validation  ######################

// email validation
let email = document.getElementById("email_unval");
let email_hint = document.getElementById("email_hint");
email.addEventListener("keyup", check_email);

function check_email() {
    let email_text = email.value;
    let regex_index = email_text.search("(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])");

    if (email_text.length === 0) {
        email_hint.innerHTML = "این فیلد اجباری است";
        email.id = "email_unval";
    } else if (email_text.length > 255) {
        email_hint.innerHTML = "طول ایمیل بیشتر از 255 می باشد";
        email.id = "email_unval";
    } else if (regex_index === -1) {
        email_hint.innerHTML = "فرمت ایمیل نامعتبر است";
        email.id = "email_unval";
    } else if (regex_index === 0) {   // possible error -> white space
        email_hint.innerHTML = "";
        email.id = "email_val";
    }
}

// password validation
let password = document.getElementById("password_unval");
let password_hint = document.getElementById("password_hint");
password.addEventListener("keyup", check_password);

function check_password() {
    let password_text = password.value;
    let numRegex = /.*[0-9].*/;
    let alphaRegex = /.*[a-z].*/;

    if (password_text.length === 0) {
        password_hint.innerHTML = "این فیلد اجباری است";
        password.id = "password_unval";
    } else if (password_text.length < 8) {
        password_hint.innerHTML = "طول پسورد کمتر از 8 می باشد";
        password.id = "password_unval";
    } else if (password_text.length > 255) {
        password_hint.innerHTML = "طول پسورد بیشتر از 255 می باشد";
        password.id = "password_unval";
    } else if (!(numRegex.test(password_text) && alphaRegex.test(password_text))) {
        password_hint.innerHTML = "پسورد باید شامل اعداد و حروف باشد";
        password.id = "password_unval";
    } else {
        password_hint.innerHTML = "";
        password.id = "password_val";
    }
}

// set visibility of error box
document.body.addEventListener("click", function () {
    let active_element_id = document.activeElement.id;
    if (active_element_id === "email_val" || active_element_id === "email_unval") {
        email_hint.style.display = "block";
    } else {
        email_hint.style.display = "none";
    }

    if (active_element_id === "password_val" || active_element_id === "password_unval") {
        password_hint.style.display = "block";
    } else {
        password_hint.style.display = "none";
    }
})

// #####################  part 2 -> modal creation  ######################

// email validation
function check_email_2() {
    let email_text = email.value;
    let regex_index = email_text.search("(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])");

    return !(email_text.length === 0 ||
        email_text.length > 255 ||
        regex_index === -1);
}

// password validation
function check_password_2() {
    let password_text = password.value;
    let numRegex = /.*[0-9].*/;
    let alphaRegex = /.*[a-z].*/;

    return !(password_text.length === 0 ||
        password_text.length < 8 ||
        password_text.length > 255 ||
        !(numRegex.test(password_text) && alphaRegex.test(password_text)));
}

// console.log("info1: ", sessionStorage.getItem('key'));  // null
// console.log("info2: ", sessionStorage.getItem('token'));

// modal creation
let modal = document.getElementById("myModal");
let btn = document.getElementById("submit_button");
let span = document.getElementsByClassName("close")[0];
let modal_text = document.getElementById("modal_text");

btn.onclick = function (event) {
    event.preventDefault();

    if (check_email_2() && check_password_2()) {
        let req_type = "user_login";
        let send_str = {"email": email.value, "password": password.value};
        let xhr = send_request(req_type, send_str);
        xhr.onload = function () {
            let raw_response_text = this.responseText;
            let response_text = raw_response_text.replaceAll("'", '"');
            let response_json = JSON.parse(response_text);
            if (response_json.email === "length" || response_json.email === "format"
                || response_json.password === "length" || response_json.password === "format") {
                modal_text.innerHTML = "ورودی نامناسب";

            } else if (response_json.email === "valid" && response_json.password === "valid") {
                // save token
                sessionStorage.setItem('token', response_json.token);
                // go to main page
                window.location = "http://localhost:8080/index.html";
                modal_text.innerHTML = "ورود با موفقیت";

            } else if (response_json.email === "valid") {
                modal_text.innerHTML = "رمز عبور نادرست";
            } else {
                modal_text.innerHTML = "نام کاربری ناموجود";
            }
        }
    } else {
        modal_text.innerHTML = "ورودی نامناسب";
    }
    modal.style.display = "block";
}

// set modal visibility
span.onclick = function () {
    modal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

// #####################  part 3 -> server comm ######################

// send req to server
function send_request(req_type, req_body) {
    const http_method = 'POST';
    const server_path = 'main.py';
    let xhr = new XMLHttpRequest();
    xhr.open(http_method, server_path, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader("req_type", req_type);
    xhr.send(JSON.stringify(req_body));
    return xhr;
}
