const apiType = document.getElementById("apiType");
const queryInput = document.getElementById("queryInput");
const searchBtn = document.getElementById("searchBtn");
const countriesContainer = document.getElementById("countries");

const BASE_URL = "https://restcountries.com/v3.1/";

const placeholders = {
  name: "Enter country name (India)",
  alpha: "Enter country code (IN, US)",
  currency: "Enter currency (INR, USD)",
  demonym: "Enter demonym (Indian)",
  lang: "Enter language (English)",
  capital: "Enter capital (Delhi)"
};

apiType.addEventListener("change", () => {
  queryInput.placeholder = placeholders[apiType.value];
});

searchBtn.addEventListener("click", fetchCountries);

function fetchCountries() {
  const type = apiType.value;
  const query = queryInput.value.trim();

  if (!query) {
    alert("Please enter a value");
    return;
  }

  const url = `${BASE_URL}${type}/${query}`;
  countriesContainer.innerHTML = "";

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error("No country found");
      return res.json();
    })
    .then(data => renderCountries(data))
    .catch(err => {
      countriesContainer.innerHTML =
        `<div class="error">${err.message}</div>`;
    });
}

function renderCountries(countries) {
  countries.forEach(country => {
    const card = document.createElement("div");
    card.className = "country-card";

    card.innerHTML = `
      <div class="flag-wrapper">
        <img src="${country.flags.svg}" alt="Flag of ${country.name.common}">
      </div>
      <div class="info">
        <h3>${country.name.common}</h3>
        <p><strong>Capital:</strong> ${country.capital?.[0] || "N/A"}</p>
        <p><strong>Region:</strong> ${country.region}</p>
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
      </div>
    `;

    card.addEventListener("click", () => openModal(country));

    countriesContainer.appendChild(card);
  });
}

const modal = document.getElementById("countryModal");
const modalBody = document.getElementById("modalBody");
const closeModal = document.getElementById("closeModal");

function openModal(country) {
  modalBody.innerHTML = `
    <img src="${country.flags.svg}">
    <h2>${country.name.common}</h2>

    <p><strong>Official Name:</strong> ${country.name.official}</p>
    <p><strong>Capital:</strong> ${country.capital?.[0] || "N/A"}</p>
    <p><strong>Region:</strong> ${country.region}</p>
    <p><strong>Subregion:</strong> ${country.subregion || "N/A"}</p>
    <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
    <p><strong>Area:</strong> ${country.area.toLocaleString()} km²</p>

    <p><strong>Languages:</strong>
      ${country.languages ? Object.values(country.languages).join(", ") : "N/A"}
    </p>

    <p><strong>Currencies:</strong>
      ${country.currencies
        ? Object.values(country.currencies)
            .map(c => `${c.name} (${c.symbol})`)
            .join(", ")
        : "N/A"}
    </p>

    <p><strong>Timezones:</strong> ${country.timezones.join(", ")}</p>

    <p><strong>Driving Side:</strong> ${country.car?.side || "N/A"}</p>

    <p><strong>Border Countries:</strong>
      ${country.borders ? country.borders.join(", ") : "None"}
    </p>
  `;

  modal.classList.remove("hidden");
}

closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
});

modal.addEventListener("click", e => {
  if (e.target === modal) modal.classList.add("hidden");
});

