$(document).ready(function() {
  $('#password, #password2').on('keyup', function() {
    var password = $('#password').val();
    var password2 = $('#password2').val();
    var regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    if (password == password2 && regex.test(password)) {
      $('#submit-btn').prop('disabled', false);
    } else {
      $('#submit-btn').prop('disabled', true);
    }
  });
  loadHome();
  loadCategories();
  loadArea();
  loadIngredients();
  selectSection();
});

function commonEventListners(arr) {
  $(".myimg").click((e) => {
    let src = Array.of(e.currentTarget.children)[0][0].src;
    for (let i = 0; i < arr.length; i++) {
      const element = arr[i];
      if (element.strMealThumb == src) {
        console.log(element);
        $(`#details .row`)[0].innerHTML = `
        
        <div class="col-3 text-white">
        <img src="${src}" class="rounded-4 w-100">
      <h1>${element.strMeal}</h1>
      </div>
      <div class="col-9 text-white">
      <h2>Instructions</h2>
      <p>${element.strInstructions}</p>
      <h2>Area: <span>${element.strArea}</span></h2>
      <h2>Category: <span>${element.strCategory}</span></h2>
      <h3>Recipes:</h3>
      <div class="recipes">
        
      </div>
      <h3>Tags:</h3>
      <div class="tags mb-3">
        
      </div>
      <a href='${element.strSource}'><button class="btn btn-success">Source</button></a>
      <a href='${element.strYoutube}'><button class="btn btn-outline-danger">YouTube</button></a>
    </div>`;
        for (let i = 1; i <= 20; i++) {
          let measure = "strMeasure" + i;
          let ingredient = "strIngredient" + i;
          if (element[ingredient] != "") {
            $(".recipes")[0].innerHTML += `
            <div class="btn btn-primary m-1">${element[measure]} ${element[ingredient]}</div>
        `;
          }
        }

        const arr = element.strTags ? element.strTags.split(",") : [];
        for (let i = 0; i < arr.length; i++) {
          const el = arr[i];
          $(".tags")[0].innerHTML += `
            <span class="btn btn-danger m-1">${el}</span>
            `;
        }
      }
    }
    $(".d-block").addClass("d-none").removeClass("d-block");
    $(`#details`).removeClass("d-none").addClass("d-block");
  });
}

async function loadHome() {
  $(".fa-align-justify").click(() => {
    $(".side").toggleClass("side-closed", "side-opened");
    $(".side ul").animate({ top: 0 }, 500);
  });
  let req = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?s="
  );
  let arr;
  let resp;
  if (req.ok && req.status != 400) {
    resp = await req.json();
    arr = resp.meals;
    for (let i = 0; i < arr.length; i++) {
      const element = arr[i];
      document.querySelector(".meals").innerHTML += `
      <div class="col-3 gy-3">
      <div class="myimg position-relative overflow-hidden rounded-4">
        <img src="${element.strMealThumb}" class="rounded-4 w-100">
        <div class="position-absolute layer d-flex align-items-center">${element.strMeal}</div>
      </div>
    </div>`;
    }
  }
  commonEventListners(arr);
}

async function searchByName(mealName) {
  let req = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`
  );
  let arr;
  let resp;
  if (req.ok && req.status != 400) {
    resp = await req.json();
    arr = resp.meals;
    $(".meals")[0].innerHTML = "";
    for (let i = 0; i < arr.length; i++) {
      const element = arr[i];
      document.querySelector(".meals").innerHTML += `
      <div class="col-3 gy-3">
      <div class="myimg position-relative overflow-hidden rounded-4">
        <img src="${element.strMealThumb}" class="rounded-4 w-100">
        <div class="position-absolute layer d-flex align-items-center">${element.strMeal}</div>
      </div>
    </div>`;
    }
  }
  commonEventListners(arr);
  selectSection();
}

async function searchByFLetter(mealletter) {
  let req = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${mealletter}`
  );
  let arr;
  let resp;
  if (req.ok && req.status != 400) {
    resp = await req.json();
    arr = resp.meals;
    $("#search .meals")[0].innerHTML = "";
    for (let i = 0; i < arr.length; i++) {
      const element = arr[i];
      $("#search .meals")[0].innerHTML += `
      <div class="col-3 gy-3">
        <div class="myimg position-relative overflow-hidden rounded-4">
          <img src="${element.strMealThumb}" class="rounded-4 w-100">
          <div class="position-absolute layer d-flex align-items-center">${element.strMeal}</div>
        </div>
      </div>`;
    }
  }
  commonEventListners(arr);
}

function selectSection() {
  $(".side ul li").click((e) => {
    let targetSection = e.currentTarget.innerHTML.toLowerCase();
    $(".d-block").addClass("d-none").removeClass("d-block");
    $(`#${targetSection}`).addClass("d-block").removeClass("d-none");
    console.log("zizo");
  });
}

async function loadCategories() {
  let req = await fetch(
    "https://www.themealdb.com/api/json/v1/1/categories.php"
  );
  let arr;
  let resp;
  if (req.ok && req.status != 400) {
    resp = await req.json();
    arr = resp.categories;
    for (let i = 0; i < arr.length; i++) {
      const element = arr[i];
      document.querySelector(".categories").innerHTML += `
      <div class="col-3 gy-3">
      <div class="myimg position-relative overflow-hidden rounded-4">
        <img src="${element.strCategoryThumb}" class="rounded-4 w-100">
        <div class="position-absolute layer text-center">
          <h4>${element.strCategory}</h4>
          <p>${element.strCategoryDescription}<p>
        </div>
      </div>
    </div>`;
    }
    $(".myimg").click((e) => {
      let src = Array.of(e.currentTarget.children)[0][0].src;
      for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        if (element.strCategoryThumb == src) {
          filterCategory(element.strCategory);
        }
      }
    });
  }
}

async function filterCategory(categoryName) {
  let req = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`
  );
  let arr;
  let resp;
  if (req.ok && req.status != 400) {
    resp = await req.json();
    arr = resp.meals;
    $("#details .row")[0].innerHTML = "";
    for (let i = 0; i < arr.length; i++) {
      const element = arr[i];
      document.querySelector("#details .row").innerHTML += `
      <div class="col-3 gy-3">
      <div class="myimg position-relative overflow-hidden rounded-4">
        <img src="${element.strMealThumb}" class="rounded-4 w-100">
        <div class="position-absolute layer d-flex align-items-center">${element.strMeal}</div>
      </div>
    </div>`;
    }
  }
  $("#details .myimg").click((e) => {
    let meal = Array.of(e.currentTarget.children)[0][1].innerHTML;
    searchByName(meal);
  });
}

async function loadArea() {
  let req = await fetch(
    "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
  );
  let arr;
  let resp;
  if (req.ok && req.status != 400) {
    resp = await req.json();
    arr = resp.meals;
    for (let i = 0; i < arr.length; i++) {
      const element = arr[i];
      $("#area .row")[0].innerHTML += `
      <div class="col-3 gy-3 gx-5">
        <div class="text-white text-center">
          <i class="fa fa-flag"></i>
          <h2>${element.strArea}</h2>
        </div>
      </div>`;
    }
    $("#area .text-white").click((e) => {
      let area = Array.of(e.currentTarget.children)[0][1].innerHTML;
      filterArea(area);
    });
  }
}

async function filterArea(areaName) {
  let req = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${areaName}`
  );
  let arr;
  let resp;
  if (req.ok && req.status != 400) {
    resp = await req.json();
    arr = resp.meals;
    $("#details .row")[0].innerHTML = "";
    for (let i = 0; i < arr.length; i++) {
      const element = arr[i];
      document.querySelector("#details .row").innerHTML += `
      <div class="col-3 gy-3">
      <div class="myimg position-relative overflow-hidden rounded-4">
        <img src="${element.strMealThumb}" class="rounded-4 w-100">
        <div class="position-absolute layer d-flex align-items-center">${element.strMeal}</div>
      </div>
    </div>`;
    }
  }
  $(".d-block").addClass("d-none").removeClass("d-block");
  $("#details").removeClass("d-none").addClass("d-block");
  $("#details .myimg").click((e) => {
    let meal = Array.of(e.currentTarget.children)[0][1].innerHTML;
    searchByName(meal);
  });
}

async function loadIngredients() {
  let req = await fetch(
    "https://www.themealdb.com/api/json/v1/1/list.php?i=list"
  );
  let arr;
  let resp;
  if (req.ok && req.status != 400) {
    resp = await req.json();
    arr = resp.meals;
    for (let i = 0; i < arr.length; i++) {
      let element = arr[i];
      let words = element.strDescription;
      if (words) {
        words = words.split(" ");

        if (words.length > 15) {
          words = words.slice(0, 15);
        }

        let newString = words.join(" ");

        $("#ingredients .row")[0].innerHTML += `
      <div class="col-3 gx-5">
        <div class="text-white text-center">
        <i class="fa fa-bowl-food"></i>
          <h4>${element.strIngredient}</h4>
          <p>${newString}</p>
        </div>
      </div>`;
      }
    }
    $("#ingredients .text-white").click((e) => {
      let ingredient = Array.of(e.currentTarget.children)[0][1].innerHTML;
      filterIngredients(ingredient);
    });
  }
}

async function filterIngredients(ingredientName) {
  let req = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredientName}`
  );
  let arr;
  let resp;
  if (req.ok && req.status != 400) {
    resp = await req.json();
    arr = resp.meals;
    $("#details .row")[0].innerHTML = "";
    for (let i = 0; i < arr.length; i++) {
      const element = arr[i];
      document.querySelector("#details .row").innerHTML += `
      <div class="col-3 gy-3">
      <div class="myimg position-relative overflow-hidden rounded-4">
        <img src="${element.strMealThumb}" class="rounded-4 w-100">
        <div class="position-absolute layer d-flex align-items-center">${element.strMeal}</div>
      </div>
    </div>`;
    }
  }
  $(".d-block").addClass("d-none").removeClass("d-block");
  $("#details").removeClass("d-none").addClass("d-block");
  $("#details .myimg").click((e) => {
    let meal = Array.of(e.currentTarget.children)[0][1].innerHTML;
    searchByName(meal);
  });
}
