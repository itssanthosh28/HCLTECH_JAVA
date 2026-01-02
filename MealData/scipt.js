// ================= CONFIG =================
const BASE_URL = "https://www.themealdb.com/api/json/v1/1/";
const container = document.getElementById("mealContainer");

// ================= HELPERS =================

// Fetch full meal details by ID (needed for filter APIs)
async function fetchFullMeal(id) {
  const res = await fetch(`${BASE_URL}lookup.php?i=${id}`);
  const data = await res.json();
  return data.meals ? data.meals[0] : null;
}

// Count ingredients safely
function countIngredients(meal) {
  let count = 0;
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    if (ing && ing.trim() !== "") count++;
  }
  return count;
}

// ================= CORE FETCH =================

// For search.php, search by letter, random.php (FULL data already)
async function fetchMeals(endpoint) {
  container.innerHTML = "<h2>Loading meals...</h2>";

  try {
    const res = await fetch(BASE_URL + endpoint);
    const data = await res.json();

    if (!data.meals) {
      container.innerHTML = "<h2>No meals found</h2>";
      return;
    }

    displayMeals(data.meals);
  } catch (err) {
    container.innerHTML = "<h2>Error loading meals</h2>";
  }
}

// For filter.php APIs (PARTIAL data → must lookup)
async function fetchFilteredMeals(endpoint) {
  container.innerHTML = "<h2>Loading meals...</h2>";

  try {
    const res = await fetch(BASE_URL + endpoint);
    const data = await res.json();

    if (!data.meals) {
      container.innerHTML = "<h2>No meals found</h2>";
      return;
    }

    // Fetch full data for each meal
    const fullMeals = (
      await Promise.all(
        data.meals.map(meal => fetchFullMeal(meal.idMeal))
      )
    ).filter(Boolean);

    displayMeals(fullMeals);

  } catch (error) {
    container.innerHTML = "<h2>Error loading meals</h2>";
  }
}

// ================= UI RENDER =================

function displayMeals(meals) {
  meals.sort((a, b) => countIngredients(a) - countIngredients(b));

  container.innerHTML = meals.map(meal => `
    <div class="meal-card">
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <div class="meal-info">
        <span class="badge">${countIngredients(meal)} Ingredients</span>
        <h3>${meal.strMeal}</h3>
        <p><b>Category:</b> ${meal.strCategory || "N/A"}</p>
        <p><b>Area:</b> ${meal.strArea || "N/A"}</p>
      </div>
    </div>
  `).join("");
}

// ================= CONTROLS =================

function applyFilter() {
  const type = document.getElementById("filterType").value;
  const value = document.getElementById("filterValue").value.trim();

  if (!value && type !== "random") {
    alert("Please enter a value");
    return;
  }

  switch (type) {
    case "letter":
      fetchMeals(`search.php?f=${value}`);
      break;

    case "ingredient":
      fetchFilteredMeals(`filter.php?i=${value}`);
      break;

    case "category":
      fetchFilteredMeals(`filter.php?c=${value}`);
      break;

    case "area":
      fetchFilteredMeals(`filter.php?a=${value}`);
      break;

    default:
      loadRandom();
  }
}

function loadRandom() {
  fetchMeals("random.php");
}

// ================= INITIAL LOAD =================
loadRandom();
