// #####################  part 0 -> auth ######################
let auth_token = sessionStorage.getItem('token');

if (auth_token != null) {
    console.log("auth found !");
} else {
    console.log("auth not found !");
}

// #####################  part 1 -> slide show ######################

function showSlides() {
    let i;
    const slides = document.getElementsByClassName("mySlides");
    const background = document.getElementById("page_content_top");
    let color_list = ["orange", "blue", "red"];
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) {
        slideIndex = 1
    }
    slides[slideIndex - 1].style.display = "block";
    background.style.backgroundColor = color_list[slideIndex - 1];
    setTimeout(showSlides, 5000);
}

let slideIndex = 0;
showSlides();

// #####################  part 2 -> paging ######################

let max_product_per_page = 21;
let max_page_number = 10;
let product_per_page = 15;
let current_page_number = 1;

let selected_merch_id = "";
let num_pages = -1;
let products = [];


function load_products() {
    // products
    let product_pane = document.getElementById("products_section");
    let product_divs = product_pane.childNodes;

    for (let i = 0; i < max_product_per_page; i++) {
        let current_product_div = product_divs[i * 2 + 1];
        current_product_div.style.display = "none";
    }

    for (let i = 0; i < products.length; i++) {
        let current_product_div = product_divs[i * 2 + 1];
        let children = current_product_div.childNodes;
        children[1].src = products[i][0];
        children[3].innerHTML = products[i][1];
        children[5].innerHTML = products[i][2];

        children[9].childNodes[1].onclick = function (event) {
            event.preventDefault();
            if (auth_token == null) {
                open_modal_2("ابتدا باید وارد شوید");
            } else {
                selected_merch_id = products[i][4];
                open_modal(products[i][1], products[i][3]);
            }
        }

        children[9].childNodes[3].innerHTML = products[i][3];
        children[9].childNodes[3].innerHTML += " تومان";
        current_product_div.style.display = "block";
    }

    // page number
    let paging_pane = document.getElementById("paging_section");
    let paging_divs = paging_pane.childNodes;

    for (let i = 1; i < max_page_number + 1; i++) {
        let current_paging_div = paging_divs[i * 2 + 1];
        current_paging_div.style.display = "none";
    }

    for (let i = 1; i < num_pages + 1 && i < max_page_number + 1; i++) {
        let current_paging_input = paging_divs[i * 2 + 1];
        if (i === current_page_number) {
            current_paging_input.style.backgroundColor = "red";
        } else {
            current_paging_input.style.backgroundColor = "blue";
        }
        current_paging_input.style.display = "block";
    }

}

function add_paging_button_listener() {
    document.getElementById("previous").addEventListener("click", function () {
        current_page_number -= 1;
        req_body.current_page_number = current_page_number;
        set_products();
    });
    document.getElementById("page_num_1").addEventListener("click", function () {
        current_page_number = 1;
        req_body.current_page_number = current_page_number;
        set_products();
    });
    document.getElementById("page_num_2").addEventListener("click", function () {
        current_page_number = 2;
        req_body.current_page_number = current_page_number;
        set_products();
    });
    document.getElementById("page_num_3").addEventListener("click", function () {
        current_page_number = 3;
        req_body.current_page_number = current_page_number;
        set_products();
    });
    document.getElementById("page_num_4").addEventListener("click", function () {
        current_page_number = 4;
        req_body.current_page_number = current_page_number;
        set_products();
    });
    document.getElementById("page_num_5").addEventListener("click", function () {
        current_page_number = 5;
        req_body.current_page_number = current_page_number;
        set_products();
    });
    document.getElementById("page_num_6").addEventListener("click", function () {
        current_page_number = 6;
        req_body.current_page_number = current_page_number;
        set_products();
    });
    document.getElementById("page_num_7").addEventListener("click", function () {
        current_page_number = 7;
        req_body.current_page_number = current_page_number;
        set_products();
    });
    document.getElementById("page_num_8").addEventListener("click", function () {
        current_page_number = 8;
        req_body.current_page_number = current_page_number;
        set_products();
    });
    document.getElementById("page_num_9").addEventListener("click", function () {
        current_page_number = 9;
        req_body.current_page_number = current_page_number;
        set_products();
    });
    document.getElementById("page_num_10").addEventListener("click", function () {
        current_page_number = 10;
        req_body.current_page_number = current_page_number;
        set_products();
    });
    document.getElementById("next").addEventListener("click", function () {
        current_page_number += 1;
        req_body.current_page_number = current_page_number;
        set_products();
    });
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
    xhr.setRequestHeader("Authorization", auth_token);
    xhr.send(JSON.stringify(req_body));
    return xhr;
}

// #####################  part 4 -> page startup ######################
let category_info;
get_dynamic_info();

function get_dynamic_info() {
    let req_type = "get_category_info";
    let req_body = {};
    let xhr = send_request(req_type, req_body);

    xhr.onload = function () {
        let raw_response_text = this.responseText;
        let response_text = raw_response_text.replaceAll("'", '"');
        category_info = JSON.parse(response_text);
        // console.log(all_info);
        set_dynamic_info();
    }
}


function set_dynamic_info() {
    // set categories
    category_info.category.forEach(insert_category);

    // set merchandises
    set_products();

    // set user name on button and button links
    if (auth_token != null) {
        set_user_admin_button();
    } else {
        let unauth_button = document.getElementById("unauth_button");
        let user_auth_button = document.getElementById("user_auth_button");
        let admin_auth_button = document.getElementById("admin_auth_button");
        unauth_button.style.display = "block";
        user_auth_button.style.display = "none";
        admin_auth_button.style.display = "none";
    }
}

function set_user_admin_button() {
    let req_type = "get_user_admin";
    let req_body = {};
    let xhr = send_request(req_type, req_body);

    xhr.onload = function () {
        let raw_response_text = this.responseText;
        let response_text = raw_response_text.replaceAll("'", '"');
        let json_response = JSON.parse(response_text);
        // console.log(json_response.user_name);
        // set user button
        if (json_response.user_type === "admin") {
            let unauth_button = document.getElementById("unauth_button");
            let user_auth_button = document.getElementById("user_auth_button");
            let admin_auth_button = document.getElementById("admin_auth_button");
            unauth_button.style.display = "none";
            user_auth_button.style.display = "none";
            admin_auth_button.style.display = "block";

            let admin_signout_link = document.getElementById("admin_signout_link");
            admin_signout_link.onclick = function () {
                sessionStorage.removeItem('token');
            }
            set_user_name("admin");
        }
        if (json_response.user_type === "user") {
            let unauth_button = document.getElementById("unauth_button");
            let user_auth_button = document.getElementById("user_auth_button");
            let admin_auth_button = document.getElementById("admin_auth_button");
            unauth_button.style.display = "none";
            user_auth_button.style.display = "block";
            admin_auth_button.style.display = "none";

            let user_signout_link = document.getElementById("user_signout_link");
            user_signout_link.onclick = function () {
                sessionStorage.removeItem('token');
            }
            set_user_name("user");
        }
    }
}

function set_user_name(user_type) {
    let req_type = "get_user_name";
    let req_body = {};
    let xhr = send_request(req_type, req_body);

    xhr.onload = function () {
        let raw_response_text = this.responseText;
        let response_text = raw_response_text.replaceAll("'", '"');
        let json_response = JSON.parse(response_text);
        // console.log(json_response.user_name);

        if (user_type === "admin") {
            let admin_name_button = document.getElementById("admin_name_button");
            admin_name_button.innerHTML = json_response.user_name;
        }

        if (user_type === "user") {
            let user_name_button = document.getElementById("user_name_button");
            user_name_button.innerHTML = json_response.user_name;
        }
    }
}

add_paging_button_listener();


// #####################  part 5 -> dom manipulation ######################
function insert_category(category, index) {
    if (category.name !== "دسته بندی نشده") {
        let lab_id = "lab" + index.toString();
        let class_id = "classification" + index.toString();

        let lab = document.getElementById(lab_id);
        lab.innerHTML = category.name;
        lab.style.display = "inline";

        let classification = document.getElementById(class_id);
        classification.value = category.name;

        classification.onclick = function () {
            current_page_number = 1;
            req_body.current_page_number = current_page_number;
            if (classification.checked === true) {
                req_body.category.push(category.name);
            } else {
                let cat_index = req_body.category.indexOf(category.name);
                req_body.category.splice(cat_index, 1);
            }
            req_body.name = "";
            set_products();
        }
        classification.style.display = "inline";
    }
}

// #####################  part 6 -> modal ######################
// buy modal
let modal_buy = document.getElementById("buy_modal");
let span_buy = document.getElementById("buy_span");

let product_name = document.getElementById("product_name");
let buy_number_box = document.getElementById("buy_number_box");
let final_price = document.getElementById("final_price");
let buy_button = document.getElementById("buy_button");

function open_modal(name, price) {
    product_name.innerHTML = name;
    buy_number_box.value = 1;
    final_price.innerHTML = "قیمت نهایی: ";
    final_price.innerHTML += price + " تومان ";

    buy_number_box.addEventListener('input', function () {
        let price_val = parseInt(price) * parseInt(buy_number_box.value);
        final_price.innerHTML = "قیمت نهایی: ";
        final_price.innerHTML += price_val.toString() + ".000 " + " تومان ";
    });

    buy_button.onclick = function (event) {
        event.preventDefault();
        buy_product();
    }

    modal_buy.style.display = "block";
}

// buy status modal
let modal_status = document.getElementById("buy_status");
let buy_message = document.getElementById("buy_message");

function open_modal_2(message) {
    buy_message.innerHTML = message;
    modal_status.style.display = "block";
}

// set modal visibility
span_buy.onclick = function () {
    modal_buy.style.display = "none";
}

window.onclick = function (event) {
    if (event.target === modal_buy) {
        modal_buy.style.display = "none";
    }
    if (event.target === modal_status) {
        modal_status.style.display = "none";
    }
}

// #####################  part 7 -> other events ######################

// buy product
function buy_product() {
    modal_buy.style.display = "none";
    let req_type = "buy";
    let req_body = {
        "merch_id": selected_merch_id,
        "buy_num": buy_number_box.value,
    };
    let xhr = send_request(req_type, req_body);

    xhr.onload = function () {
        let raw_response_text = this.responseText;
        let response_text = raw_response_text.replaceAll("'", '"');
        let response_json = JSON.parse(response_text);
        // console.log(response_json);

        if (response_json.status === "valid") {
            open_modal_2("خرید با موفقیت");
        } else {
            if (response_json.error === "available") {
                open_modal_2("تعداد موجود کالای انتخاب شده ناکافیست");
            } else if (response_json.error === "balance") {
                open_modal_2("موجودی ناکافی");
            }
        }
    }
}

let req_body = {
    "product_per_page": product_per_page,
    "current_page_number": current_page_number,
    "sort_by": "sell",
    "sort_dir": "descending",
    "category": [],
    "name": ""
};

// get appropriate products from server
function set_products() {
    let req_type = "get_merchandise_info";
    let xhr = send_request(req_type, req_body);

    xhr.onload = function () {
        products = [];
        let raw_response_text = this.responseText;
        let response_text = raw_response_text.replaceAll("'", '"');
        let response_json = JSON.parse(response_text);
        // console.log(response_json);

        num_pages = parseInt(response_json.num_pages);
        response_json.merchandise.forEach(insert_merch);

        load_products();
    }
}

function insert_merch(merch) {
    let buy_value = parseInt(merch.price) / 1000;
    let merch_price = buy_value + ".000";
    let merch_info = ["img/clock.png", merch.name, merch.category, merch_price, merch.id];
    products.push(merch_info);
}


// #####################  part 8 -> get user search inputs ######################
// options
let last_selected_option_id = "sold_high";

let sold_high_button = document.getElementById("sold_high");
sold_high_button.onclick = function (event) {
    event.preventDefault();
    document.getElementById(last_selected_option_id).classList.remove("option_selected");
    sold_high_button.classList.add('option_selected');
    last_selected_option_id = "sold_high";

    current_page_number = 1;
    req_body.current_page_number = current_page_number;
    req_body.sort_by = "sell";
    req_body.sort_dir = "descending";
    req_body.name = "";
    set_products();
}

let price_high_button = document.getElementById("price_high");
price_high_button.onclick = function (event) {
    event.preventDefault();
    document.getElementById(last_selected_option_id).classList.remove("option_selected");
    price_high_button.classList.add('option_selected');
    last_selected_option_id = "price_high";

    current_page_number = 1;
    req_body.current_page_number = current_page_number;
    req_body.sort_by = "price";
    req_body.sort_dir = "descending";
    req_body.name = "";
    set_products();
}

let price_low_button = document.getElementById("price_low");
price_low_button.onclick = function (event) {
    event.preventDefault();
    document.getElementById(last_selected_option_id).classList.remove("option_selected");
    price_low_button.classList.add('option_selected');
    last_selected_option_id = "price_low";

    current_page_number = 1;
    req_body.current_page_number = current_page_number;
    req_body.sort_by = "price";
    req_body.sort_dir = "ascending";
    req_body.name = "";
    set_products();
}

let newest_button = document.getElementById("newest");
newest_button.onclick = function (event) {
    event.preventDefault();
    document.getElementById(last_selected_option_id).classList.remove("option_selected");
    newest_button.classList.add('option_selected');
    last_selected_option_id = "newest";

    current_page_number = 1;
    req_body.current_page_number = current_page_number;
    req_body.sort_by = "creation";
    req_body.sort_dir = "descending";
    req_body.name = "";
    set_products();
}

// top search box
let search_box = document.getElementById("search_box");
let search_submit = document.getElementById("search_submit");

search_box.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        search_by_name();
    }
});

search_submit.onclick = function () {
    search_by_name();
};

function search_by_name() {
    req_body.name = search_box.value;
    set_products();
    search_box.value = "";
}
