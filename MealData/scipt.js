const BASE_URL = "https://www.themealdb.com/api/json/v1/1/";
const container = document.getElementById("mealContainer");

// ---------- FETCH FULL MEAL ----------
async function fetchFullMeal(id) {
  const res = await fetch(`${BASE_URL}lookup.php?i=${id}`);
  const data = await res.json();
  return data.meals[0];
}

// ---------- INGREDIENT COUNT ----------
function countIngredients(meal) {
  let count = 0;
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`] && meal[`strIngredient${i}`].trim()) {
      count++;
    }
  }
  return count;
}

// ---------- FETCH NORMAL ----------
async function fetchMeals(endpoint) {
  container.innerHTML = "<h2>Loading...</h2>";

  const res = await fetch(BASE_URL + endpoint);
  const data = await res.json();

  if (!data.meals) {
    container.innerHTML = "<h2>No meals found</h2>";
    return;
  }

  displayMeals(data.meals);
}

// ---------- FETCH FILTER ----------
async function fetchFilteredMeals(endpoint) {
  container.innerHTML = "<h2>Loading...</h2>";

  const res = await fetch(BASE_URL + endpoint);
  const data = await res.json();

  if (!data.meals) {
    container.innerHTML = "<h2>No meals found</h2>";
    return;
  }

  const fullMeals = await Promise.all(
    data.meals.map(m => fetchFullMeal(m.idMeal))
  );

  displayMeals(fullMeals);
}

// ---------- DISPLAY ----------
function displayMeals(meals) {
  meals.sort((a, b) => countIngredients(a) - countIngredients(b));

  container.innerHTML = meals.map(meal => `
    <div class="meal-card">
      <img src="${meal.strMealThumb}">
      <div class="meal-info">
        <span class="badge">${countIngredients(meal)} Ingredients</span>
        <h3 onclick='openModal(${JSON.stringify(meal)})'>${meal.strMeal}</h3>
        <p>Category: ${meal.strCategory || "N/A"}</p>
        <p>Area: ${meal.strArea || "N/A"}</p>
      </div>
    </div>
  `).join("");
}

// ---------- FILTER ----------
function applyFilter() {
  const type = document.getElementById("filterType").value;
  const value = document.getElementById("filterValue").value.trim();

  if (type === "random") {
    fetchMeals("random.php");
    return;
  }

  if (!value) {
    alert("Enter value");
    return;
  }

  if (type === "letter") fetchMeals(`search.php?f=${value}`);
  if (type === "ingredient") fetchFilteredMeals(`filter.php?i=${value}`);
  if (type === "category") fetchFilteredMeals(`filter.php?c=${value}`);
  if (type === "area") fetchFilteredMeals(`filter.php?a=${value}`);
}

// ---------- MODAL ----------
function openModal(meal) {
  document.getElementById("mealModal").classList.remove("hidden");
  document.getElementById("modalTitle").innerText = meal.strMeal;

  const list = document.getElementById("ingredientList");
  list.innerHTML = "";

  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ing && ing.trim()) {
      const li = document.createElement("li");
      li.innerText = `${ing} - ${measure || ""}`;
      list.appendChild(li);
    }
  }

  document.getElementById("instructions").innerText =
    meal.strInstructions || "No instructions available";
}

function closeModal() {
  document.getElementById("mealModal").classList.add("hidden");
}

// ---------- INITIAL ----------
fetchMeals("random.php");
