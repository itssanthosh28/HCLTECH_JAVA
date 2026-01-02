const BASE_URL = "https://www.themealdb.com/api/json/v1/1/";
const container = document.getElementById("mealContainer");

// ---------- INGREDIENT COUNT ----------
function countIngredients(meal) {
  let count = 0;
  for (let i = 1; i <= 20; i++) {
    const ing = meal["strIngredient" + i];
    if (ing && ing.trim() !== "") count++;
  }
  return count;
}

// ---------- DISPLAY ----------
function displayMeals(meals) {
  if (!meals) {
    container.innerHTML = "<h2>No meals found</h2>";
    return;
  }

  meals.sort((a, b) => countIngredients(a) - countIngredients(b));

  container.innerHTML = meals.map(meal => `
    <div class="meal-card">
      <img src="${meal.strMealThumb}" />
      <div class="meal-info">
        <span class="badge">${countIngredients(meal)} Ingredients</span>
        <h3>${meal.strMeal}</h3>
        <p><b>Category:</b> ${meal.strCategory || "N/A"}</p>
        <p><b>Area:</b> ${meal.strArea || "N/A"}</p>
      </div>
    </div>
  `).join("");
}

// ---------- API CALL ----------
async function fetchMeals(endpoint) {
  try {
    const res = await fetch(BASE_URL + endpoint);
    const data = await res.json();
    displayMeals(data.meals);
  } catch (e) {
    container.innerHTML = "<h2>API Error / Premium API</h2>";
  }
}

// ---------- FEATURES ----------
function searchByName() {
  const value = document.getElementById("searchInput").value;
  fetchMeals(`search.php?s=${value}`);
}

function loadRandom() {
  fetchMeals("random.php");
}

function applyFilter() {
  const type = document.getElementById("filterType").value;
  const value = document.getElementById("filterValue").value;

  switch (type) {
    case "letter":
      fetchMeals(`search.php?f=${value}`);
      break;
    case "ingredient":
      fetchMeals(`filter.php?i=${value}`);
      break;
    case "category":
      fetchMeals(`filter.php?c=${value}`);
      break;
    case "area":
      fetchMeals(`filter.php?a=${value}`);
      break;
    default:
      loadRandom();
  }
}

// ---------- INITIAL LOAD ----------
loadRandom();
