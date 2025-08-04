// script.js
// This script powers the category pages by fetching data from a Google Sheet
// via the opensheet API and rendering it into cards. Whenever the Google Sheet
// is updated, refreshing the page will pull the latest rankings.

/**
 * Parse query parameters from the current URL.
 * @returns {Object} Key-value map of query parameters
 */
function getQueryParams() {
  const params = {};
  const query = window.location.search.substring(1);
  const pairs = query.split("&");
  for (const pair of pairs) {
    const [key, value] = pair.split("=");
    if (key) params[decodeURIComponent(key)] = decodeURIComponent(value || "");
  }
  return params;
}

/**
 * Convert a numeric rating into star icons.
 * Supports half-star ratings.
 * @param {number} rating - numeric rating out of 5
 * @returns {HTMLElement} span element containing star icons
 */
function renderStars(rating) {
  const span = document.createElement("span");
  span.classList.add("stars");
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  for (let i = 0; i < fullStars; i++) {
    const star = document.createElement("i");
    star.className = "fa-solid fa-star";
    span.appendChild(star);
  }
  if (halfStar) {
    const half = document.createElement("i");
    // Font Awesome 6 uses fa-star-half-stroke for half stars
    half.className = "fa-solid fa-star-half-stroke";
    span.appendChild(half);
  }
  for (let i = 0; i < emptyStars; i++) {
    const empty = document.createElement("i");
    empty.className = "fa-regular fa-star";
    span.appendChild(empty);
  }
  return span;
}

/**
 * Fetch data for a given sheet from the opensheet API.
 * @param {string} sheetId - Google Sheet ID
 * @param {string} sheetName - Name of the tab to fetch
 * @returns {Promise<Array<Object>>} Array of row objects
 */
async function fetchSheetData(sheetId, sheetName) {
  const url = `https://opensheet.elk.sh/${sheetId}/${encodeURIComponent(
    sheetName
  )}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch ${url}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    return [];
  }
}

/**
 * Clean up keys in a row object: trim whitespace and normalise names.
 * @param {Object} row
 * @returns {Object}
 */
function normaliseRow(row) {
  const clean = {};
  Object.keys(row).forEach((key) => {
    const cleanKey = key.trim();
    clean[cleanKey] = row[key].trim();
  });
  return clean;
}

/**
 * Populate the page with cards based on fetched data.
 * @param {Array<Object>} rows - Data rows
 * @param {string} type - Category type (movie, drama, music)
 */
function populateList(rows, type) {
  const list = document.getElementById("list");
  list.innerHTML = "";
  // Sort rows by numeric rank if available
  rows.sort((a, b) => {
    const rA = parseInt(a.Rank) || 0;
    const rB = parseInt(b.Rank) || 0;
    return rA - rB;
  });
  rows.forEach((row) => {
    const card = document.createElement("div");
    card.classList.add("card");
    // Determine image source: if there is an Image URL column, use it; else placeholder
    let imageSrc = row.ImageUrl || row.Poster || "placeholder.png";
    if (!imageSrc) imageSrc = "placeholder.png";
    const img = document.createElement("img");
    img.src = imageSrc;
    img.alt = row.Title || row.Song || "Poster";
    card.appendChild(img);
    const content = document.createElement("div");
    content.classList.add("card-content");
    const title = document.createElement("h3");
    // Title or Song depending on type
    const titleText = row.Title || row.Song || row.Name || "Untitled";
    title.textContent = `${row.Rank || ""}. ${titleText}`;
    content.appendChild(title);
    // Metadata: production company / station / group / year
    const meta = document.createElement("div");
    meta.classList.add("metadata");
    if (type === "music") {
      const group = row.Group || row.Artist || row.Band || "";
      const year = row.Year || row.Release || "";
      meta.textContent = [group, year].filter(Boolean).join(" • ");
    } else {
      const company = row["Production"] || row["Production Company"] || row["Broadcast Station"] || "";
      const year = row.Year || row.Release || "";
      meta.textContent = [company, year].filter(Boolean).join(" • ");
    }
    if (meta.textContent) content.appendChild(meta);
    // Rating
    if (row.Rating) {
      const ratingContainer = document.createElement("div");
      ratingContainer.classList.add("rating");
      const ratingValue = parseFloat(row.Rating);
      ratingContainer.appendChild(renderStars(ratingValue));
      content.appendChild(ratingContainer);
    }
    card.appendChild(content);
    list.appendChild(card);
  });
}

/**
 * Main entrypoint for category pages
 */
async function init() {
  const params = getQueryParams();
  const sheetName = params.sheet || "";
  const type = params.type || "";
  // Set page title
  const pageTitle = document.getElementById("page-title");
  const mapping = {
    "KR Movie": "Korean Movies",
    "KR Drama": "Korean Dramas",
    "KR Music": "Korean Music",
    "EN Movie": "English Movies",
    "EN Drama": "English Dramas",
    "EN Music": "English Music",
  };
  if (pageTitle) {
    pageTitle.textContent = mapping[sheetName] || "Top Chart";
  }
  if (!sheetName) return;
  const sheetId = "1bUhsAN58vjTtDpRmbciDszWbgANzjuFDOyO48hH-Jwg";
  const rows = await fetchSheetData(sheetId, sheetName);
  const cleaned = rows.map(normaliseRow);
  populateList(cleaned, type);
}

// Initialise when DOM is ready
document.addEventListener("DOMContentLoaded", init);