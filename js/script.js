const global = {
	currentPagePath: window.location.pathname,
	eventsCurrentPage: 1,
	pageOffset: 0,
	resultsDisplayNumber: ``,
	eventResults: 8,
	homeEventResults: 6,
};
let acceptCookies;
let currentPage = global.currentPagePath;
// page offset for pagination
let pageOffset = global.pageOffset;
// Last page unloaded
let lastPageUnloaded;
let resultsDisplayNumber;
let currentDate = new Date();
const formattedCurrentDate = currentDate.toISOString().split("T")[0];
// convert current date to string
currentDateString = currentDate.toLocaleDateString("en-GB");
// number of results to display
let eventResults = global.eventResults;
let searchString;
let homeEventResults = global.homeEventResults;
// For Google maps
let eventName;
let eventLat;
let eventLng;

// username and password for demonstration purposes
const username = "myportfolio";
const password = "tjdd9wm89ssf";

const regions = [
	{
		name: "All Regions",
		id: "",
	},
	{
		name: "Virtual",
		id: 34045,
	},
	{
		name: "Northland",
		id: 1,
	},
	{
		name: "Auckland",
		id: 2,
	},
	{
		name: "The Coromandel",
		id: 41,
	},
	{
		name: "Hawke's Bay / Gisbourne",
		id: 6,
	},
	{
		name: "Waikato",
		id: 3,
	},
	{
		name: "Bay of Plenty",
		id: 4,
	},
	{
		name: "Manawatu / Whanganui",
		id: 9,
	},
	{
		name: "Wellington Region",
		id: 11,
	},
	{
		name: "Nelson / Tasman",
		id: 12,
	},
	{
		name: "Marlborough",
		id: 13,
	},
	{
		name: "West Coast",
		id: 14,
	},
	{
		name: "Canterbury",
		id: 15,
	},
	{
		name: "Otago",
		id: 17,
	},
	{
		name: "Southland",
		id: 18,
	},
];

const ticketPriceRange = [
	{
		name: "All Prices",
		id: 0,
	},
	{
		name: "Free",
		id: 1,
	},
	{
		name: "Under $20",
		id: 2,
	},
	{
		name: "$20 - $50",
		id: 3,
	},
	{
		name: "$50 or more",
		id: 4,
	},
];

// For locations drop down on
function eventSearchDropDowns() {
	// regions drop down
	const eventsRegionDropDown = document.getElementById("regionDropDown");
	regions.forEach((region) => {
		const regionOption = document.createElement("option");
		regionOption.setAttribute("value", region.id);
		regionOption.innerText = region.name;
		eventsRegionDropDown.appendChild(regionOption);
	});
	// price range drop down
	const ticketPriceDropDown = document.getElementById("ticketPriceDropDown");
	ticketPriceRange.forEach((price) => {
		const priceOption = document.createElement("option");
		priceOption.setAttribute("value", price.id);
		priceOption.innerText = price.name;
		ticketPriceDropDown.appendChild(priceOption);
	});
}
if (currentPage === "/Events.html" || currentPage.includes("/Events-results")) {
	document.getElementById("eventStartDate").min = formattedCurrentDate;
	document.getElementById("eventEndDate").min = formattedCurrentDate;
	eventSearchDropDowns();
}

// for getting location API needs to be converted to ajax
async function getAPIDataLocations() {
	const username = "myportfolio";
	const password = "tjdd9wm89ssf";
	$.ajax({
		url: "https://api.eventfinda.co.nz/v2/locations.json?autocomplete=Southland",
		dataType: "jsonp",
		type: "GET",
	});
}
// getAPIDataLocations();

//eventfinda locations
// https://api.eventfinda.co.nz/v2/locations.xml

lastPageUnloaded = localStorage.getItem("lastPageUnloaded");

// resets page memory if moving from search results back to events page
if (
	currentPage === "/Events.html" &&
	lastPageUnloaded.includes("/Events-results.html")
) {
	clearEventLocalStorage();
}

if (currentPage.includes("/event-details")) {
	const eventId = window.location.search.split("id=")[1];
	displayResults(eventId);
}
if (currentPage === "/Events.html" || currentPage === "/home.html") {
	displayResults();
}

// if (currentPage === "/Events.html") {
// 	displayResults();
// 	// displayResults(`rows=${eventResults}&offset=${pageOffset}`);
// }

if (
	currentPage.includes("/Events-results.html") ||
	currentPage === "/Events.html"
) {
	const eventSearchForm = document.getElementById("eventSearchForm");
	eventSearchForm.addEventListener("submit", eventSearchFunction);
}

let eventSearchStartDate;
let eventSearchEndDate;

function eventSearchFunction(e) {
	e.preventDefault();
	clearEventLocalStorage();
	const eventSearchInput = document.getElementById("searchEvents").value;
	const regionDropDown = document.getElementById("regionDropDown").value;
	const ticketPriceDropDown = document.getElementById(
		"ticketPriceDropDown"
	).value;
	let eventStartDate = document.getElementById("eventStartDate").value;
	let eventEndDate = document.getElementById("eventEndDate").value;

	let defaultEndDate = currentDate.setFullYear(currentDate.getFullYear() + 3);
	defaultEndDate = date = new Date(defaultEndDate);
	defaultEndDate = defaultEndDate.toISOString().split("T")[0];
	if (eventStartDate == 0) {
		eventStartDate = formattedCurrentDate;
	}
	if (eventEndDate == 0) {
		eventEndDate = defaultEndDate;
	}
	// check if end date is earlier than start date
	const eventStartDateCheck = new Date(eventStartDate);
	const eventEndDateCheck = new Date(eventEndDate);
	if (eventStartDateCheck > eventEndDateCheck) {
		eventEndDate = eventStartDate;
	}
	// window.location.href = `Events-results.html?search=${eventSearchInput}&region=${regionDropDown}&priceRange=${ticketPriceDropDown}`;
	window.location.href = `Events-results.html?search=${eventSearchInput}&startDate=${eventStartDate}&endDate=${eventEndDate}&region=${regionDropDown}&priceRange=${ticketPriceDropDown}`;
}

if (currentPage.includes("Events-results")) {
	const eventSearchQuery = window.location.search;

	searchString = eventSearchQuery.split("search=")[1];
	searchRegion = eventSearchQuery.split("region=")[1];
	// slice search query to get dates
	const startDateIndex = eventSearchQuery.indexOf("startDate=");
	const endDateIndex = eventSearchQuery.indexOf("endDate=");
	searchStartDate = eventSearchQuery.slice(
		startDateIndex + 10,
		startDateIndex + 20
	);
	// Set end date to start date if before start date
	searchEndDate = eventSearchQuery.slice(endDateIndex + 8, endDateIndex + 18);
	eventSearchStartDate = searchStartDate + " 12:00:00";
	eventSearchEndDate = searchEndDate + " 23:59:59";
	searchTicketPrices = window.location.search.split("priceRange=")[1];
	displayResults(
		searchString,
		searchRegion,
		searchTicketPrices,
		searchStartDate,
		searchEndDate
	);
}

// Had to use this AJAX call to get events as other methods blocked by CORS policy
async function displayResults(
	eventId,
	searchRegion,
	priceRange,
	startDate,
	endDate
) {
	showSpinner();
	const username = "myportfolio";
	const password = "tjdd9wm89ssf";
	// sets page to last page user was on
	console.log(startDate, " ", endDate);
	if (
		localStorage.getItem("pageOffset") &&
		localStorage.getItem("eventCurrentPage")
	) {
		global.pageOffset = localStorage.getItem("pageOffset");
		global.eventsCurrentPage = localStorage.getItem("eventCurrentPage");
	}

	let url;
	if (currentPage === "/Events.html") {
		// url = `https://api.eventfinda.co.nz/v2/events.json?rows=${eventResults}&offset=${pageOffset}`;
		url = `https://api.eventfinda.co.nz/v2/events.json?location=2&rows=${eventResults}&offset=${pageOffset}`;
	} else if (currentPage.includes("/event-details")) {
		url = `https://api.eventfinda.co.nz/v2/events.json?id=${eventId}`;
	} else if (currentPage === "/home.html") {
		url = `https://api.eventfinda.co.nz/v2/events.json?rows=${homeEventResults}`;
	} else if (currentPage.includes("/Events-results.html")) {
		switch (priceRange) {
			case "0":
				url = `https://api.eventfinda.co.nz/v2/events.json?autocomplete=${eventId}&rows=${eventResults}&offset=${pageOffset}&location=${searchRegion}&start_date=${startDate}&end_date=${endDate}`;
				break;
			case "1":
				url = `https://api.eventfinda.co.nz/v2/events.json?autocomplete=${eventId}&rows=${eventResults}&offset=${pageOffset}&location=${searchRegion}&free=1&start_date=${startDate}&end_date=${endDate}`;

				break;
			case "2":
				url = `https://api.eventfinda.co.nz/v2/events.json?autocomplete=${eventId}&rows=${eventResults}&offset=${pageOffset}&location=${searchRegion}&price_max=20&start_date=${startDate}&end_date=${endDate}`;

				break;
			case "3":
				url = `https://api.eventfinda.co.nz/v2/events.json?autocomplete=${eventId}&rows=${eventResults}&offset=${pageOffset}&location=${searchRegion}&price_min=20&price_max=50&start_date=${startDate}&end_date=${endDate}`;

				break;
			case "4":
				url = `https://api.eventfinda.co.nz/v2/events.json?autocomplete=${eventId}&rows=${eventResults}&offset=${pageOffset}&location=${searchRegion}&price_min=50&start_date=${startDate}&end_date=${endDate}`;
				break;
		}
	}
	$.ajax({
		url: url,
		dataType: "jsonp",
		type: "GET",
		success: function (xhr) {
			hideSpinner();
			const { events } = xhr;
			const eventNumber = events.length;
			eventResults = global.eventResults;
			homeEventResults = global.homeEventResults;
			if (currentPage.includes("event-details")) {
				const singlePageEventContainer = document.createElement("div");
				singlePageEventContainer.setAttribute("id", "eventContainer");
				singlePageEventContainer.classList.add("container");

				eventName = events[0].name;
				const eventLoc = events[0].address;
				eventLat = events[0].point.lat;
				eventLng = events[0].point.lng;
				const eventImg = events[0].images.images[0].original_url;
				const eventDesc = events[0].description;

				// const eventDateSummary = events[0].datetime_summary;

				// Event Start Time Display

				let eventStart;
				let eventEnd;

				const eventSessions = events[0].sessions.sessions;

				// return event sessions that are current
				const currentSessions = eventSessions.filter(
					(session) => new Date(session.datetime_start) >= currentDate
				);

				if (currentSessions.length === 0) {
					eventStart = new Date(events[0].datetime_start);
					eventEnd = new Date(events[0].datetime_end);
				} else {
					eventStart = new Date(currentSessions[0].datetime_start);
					eventEnd = new Date(currentSessions[0].datetime_end);
				}

				let eventStartDayOfWeek = eventStart.getDay();

				const days = [
					"Sunday",
					"Monday",
					"Tuesday",
					"Wednesday",
					"Thursday",
					"Friday",
					"Saturday",
				];

				eventStartDayOfWeek = days[eventStartDayOfWeek];
				const eventStartDay = eventStart.getDate();
				const eventStartMonth = eventStart.getMonth() + 1;

				const months = [
					"January",
					"February",
					"March",
					"April",
					"May",
					"June",
					"July",
					"August",
					"September",
					"October",
					"November",
					"December",
				];

				const eventStartMonthName = months[eventStartMonth - 1];
				const eventStartYear = eventStart.getFullYear();
				let eventStartHours = eventStart.getHours();
				let eventStartMinutes = eventStart.getMinutes();
				eventStartMinutes =
					eventStartMinutes === 0 ? "" : `:${eventStartMinutes}`;
				let eventStartAmPm = eventStartHours >= 12 ? "pm" : "am";
				eventStartHours = eventStartHours % 12;
				eventStartHours = eventStartHours ? eventStartHours : 12;
				const eventStartTime = `${eventStartHours}${eventStartMinutes}${eventStartAmPm}`;
				const eventStartDate = `${eventStartDay}${eventStartMonth}${eventStartYear}`;
				const eventStartDateFull = 0;

				// Event End Time Display

				let eventEndDayOfWeek = eventEnd.getDay();
				eventEndDayOfWeek = days[eventEndDayOfWeek];
				const eventEndDay = eventEnd.getDate();
				const eventEndMonth = eventEnd.getMonth() + 1;
				const eventEndMonthName = months[eventEndMonth - 1];
				const eventEndYear = eventEnd.getFullYear();

				let eventEndHours = eventEnd.getHours();
				let eventEndMinutes = eventEnd.getMinutes();
				eventEndMinutes = eventEndMinutes === 0 ? "" : `:${eventEndMinutes}`;
				let eventEndAmPm = eventEndHours >= 12 ? "pm" : "am";
				eventEndHours = eventEndHours % 12;
				eventEndHours = eventEndHours ? eventEndHours : 12;
				const eventEndTime = `${eventEndHours}${eventEndMinutes}${eventEndAmPm}`;

				const eventEndDate = `${eventEndDay}${eventEndMonth}${eventEndYear}`;

				const eventEndDateFull = 0;
				let eventDateDisplay;
				if (currentSessions.length > 1) {
					eventDateDisplay = `${eventStartDayOfWeek} ${eventStartDay} ${eventStartMonthName} ${eventStartYear} ${eventStartTime} - ${eventEndTime} &nbsp;&nbsp;<a>See more session times</a>`;
				} else {
					eventDateDisplay = `${eventStartDayOfWeek} ${eventStartDay} ${eventStartMonthName} ${eventStartYear} ${eventStartTime} - ${eventEndTime}`;
				}
				let websiteContainer;
				if (events[0].web_sites["@attributes"].count != 0) {
					websiteContainer = document.createElement("div");
					websiteContainer.setAttribute("id", "websiteContainer");
					websiteContainer.innerHTML = `
					<h4><strong>Website</strong></h4><div><i class="fa-solid fa-earth-americas"></i><a
						href="${events[0].web_sites.web_sites[0].url}"
						target="_blank">
					${events[0].web_sites.web_sites[0].name}</a
					></div>
					`;
				}

				// append single event to DOM
				console.log(events[0]);
				singlePageEventContainer.innerHTML = `
					<div>
						<h2>${eventName}</h2>
						<div>
						<hr />
						<div id="singlePageEventLocation"><div><i class="fa-solid fa-location-dot"></i><a href="#${eventName}Map"> ${eventLoc}</a></div></div>
						<div id="singlePageEventDate"><div><i class="fa-regular fa-calendar"></i> ${eventDateDisplay}</div></div>
					</div>
					<img
						alt="${eventName}"
						class="eventSingleImg"
						src="${eventImg}"
					/>
					<p class="singleEventDes">
						${eventDesc}<br />
						[Event description clamped by API]
					</p>
					<div id="sessionsContainer"><div><h4><strong>Sessions</strong></h4></div></div>
					<div id="restrictionsContainer"><h4><strong>Restrictions:</strong></h4><div><i class="fa-solid fa-users"></i><div> ${events[0].restrictions}</div></div></div>
					<span id="${eventName}Map"></span></div>
					<div id="ticketOuterContainer"><div><h4><strong>Tickets</strong></h4></div></div>			
					<div id="websiteOuterContainer"></div>	
					<hr />
					<div id="mapContainer"></div></div>
					<div id="googleMapLocationName"><div><i class="fa-solid fa-location-dot"></i> ${eventLoc}</div></div>
					<div id="map">
					</div>
			</div>
				`;

				document
					.getElementById("eventContainerOuter")
					.appendChild(singlePageEventContainer);

				// Ticket prices
				const ticketOuterContainer = document.getElementById(
					"ticketOuterContainer"
				);
				const ticketContainer = document.createElement("div");
				const { ticket_types } = events[0].ticket_types;

				let ticketPrice;
				if (events[0].is_free) {
					const ticket = document.createElement("div");
					ticket.innerText = "Free Admission";
					ticketContainer.appendChild(ticket);
				} else {
					ticket_types.forEach((type) => {
						const ticket = document.createElement("div");
						const ticketType = type.name;
						ticketPrice = `$${type.price} each`;
						ticket.innerHTML = `<i class="fa-solid fa-ticket"></i> ${ticketType}: ${ticketPrice}`;
						ticketContainer.appendChild(ticket);
					});
				}
				ticketOuterContainer.appendChild(ticketContainer);

				if (events[0].web_sites["@attributes"].count != 0) {
					document
						.getElementById("websiteOuterContainer")
						.appendChild(websiteContainer);
				}

				const fiveSessionsContainer = document.createElement("div");
				fiveSessionsContainer.setAttribute("id", "fiveSessionsContainer");

				const fiveSessionButton = document.createElement("button");
				fiveSessionButton.setAttribute("id", "fiveSessionsButton");
				fiveSessionButton.addEventListener("click", showMoreSessions);
				fiveSessionButton.innerText = "Show more sessions";
				// eventSessions = events[0].sessions.sessions;
				const fiveEventSessions = eventSessions.slice(0, 5);
				fiveEventSessions.forEach((session) => {
					const displaySessions = document.createElement("div");

					displaySessions.innerHTML = `
									${session.datetime_summary}
									`;
					const sessionContainer =
						fiveSessionsContainer.appendChild(displaySessions);
				});
				if (eventSessions.length > 5) {
					const allSessionsContainer = document.createElement("div");
					allSessionsContainer.setAttribute("id", "allSessionsContainer");
					allSessionsContainer.style.display = "none";

					const allSessionButton = document.createElement("button");
					allSessionButton.setAttribute("id", "allSessionButton");
					allSessionButton.addEventListener("click", showFewerSessions);
					allSessionButton.innerText = "Show fewer sessions";

					eventSessions.forEach((session) => {
						const displaySessions = document.createElement("div");

						displaySessions.innerHTML = `
										${session.datetime_summary}
										`;
						const sessionContainer = document;
						allSessionsContainer.appendChild(displaySessions);
					});
					allSessionsContainer.appendChild(allSessionButton);

					const sessionContainer = document
						.getElementById("sessionsContainer")
						.append(allSessionsContainer);
				}
				// append show more/ show fewer buttons
				if (eventSessions.length > 5) {
					fiveSessionsContainer.appendChild(fiveSessionButton);
				}

				// append 2 session containers to DOM
				const sessionContainer = document
					.getElementById("sessionsContainer")
					.append(fiveSessionsContainer);
			}
			// to counteract weird bug with API returning 1 less than its supposed to.
			if (currentPage === "/home.html") {
				let { events } = xhr;
				if (events.length != homeEventResults) {
					console.log("does not equal");
					homeEventResults++;
					displayResults();
				}

				const homeEventsContainerOuter = document.getElementById(
					"homeEventsContainerOuter"
				);
				homeEventsContainerOuter.innerHTML = "";
				const homeEventsContainerInner = document.createElement("div");
				homeEventsContainerInner.setAttribute("id", "homeEventsContainerInner");
				homeEventsContainerOuter.appendChild(homeEventsContainerInner);
				events.forEach((event) => {
					const eventUrl = event.web_sites.web_sites;
					// get event location
					let eventLocation = event.location.summary;
					// let eventLocationCity = eventLocation.split(",");
					// eventLocationCity = eventLocationCity[2].trim();
					const eventSessions = event.sessions.sessions;
					const eventImage = event.images.images[0].original_url;
					// return event sessions that are current
					const currentSessions = eventSessions.filter(
						(session) => new Date(session.datetime_start) >= currentDate
					);
					let eventStartTime;
					// if no current session times display original session time
					if (currentSessions.length === 0) {
						eventStartTime = new Date(event.datetime_start);
					} else {
						eventStartTime = new Date(currentSessions[0].datetime_start);
					}
					// get time in hours/ minutes of current event date.
					let eventStartHours = eventStartTime.getHours();
					let eventStartMinutes = eventStartTime.getMinutes();
					eventStartMinutes =
						eventStartMinutes === 0 ? "" : `:${eventStartMinutes}`;
					let amPm = eventStartHours >= 12 ? "pm" : "am";
					eventStartHours = eventStartHours % 12;
					eventStartHours = eventStartHours ? eventStartHours : 12;
					let eventDate;
					// convert to string/NZ date format
					eventDate = eventStartTime.toLocaleDateString("en-GB");
					// Display "Today" if today's date matches with event's date
					if (currentDateString === eventDate) {
						eventDate = "Today";
					}
					const eventsContainerHome = document.createElement("div");
					eventsContainerHome.classList.add("homeEvents");
					// eventsContainerHome.classList.add("col-xs-6");
					// eventsContainerHome.classList.add("col-md-4");
					eventsContainerHome.innerHTML = `
					<a href="event-details.html?id=${event.id}" title="${event.name}">
					<div id="innerHomeEvents">					
					<img
						alt="${event.name}"
						class="boxImage img-responsive"
						src="${eventImage}"
				/>
				<div class="infoBox">
					<h4 class="eventTitle">${event.name}</h4>
					<div class="eventDate"><strong>When:</strong> ${eventDate} ${eventStartHours}${eventStartMinutes}${amPm}</div>
					<div class="eventLocation">
						<strong>Location:</strong> ${eventLocation}
					</div>
					<div class="eventDescription">
					${event.description}
					</div>
				</div>
				</div>	
				</a>
					`;

					homeEventsContainerInner.appendChild(eventsContainerHome);
				});

				const homeSeemoreEventsButton = document.createElement("button");
				homeSeemoreEventsButton.setAttribute("id", "seeMore");
				homeSeemoreEventsButton.innerText = "MORE EVENTS";
				homeSeemoreEventsButton.addEventListener("click", function () {
					localStorage.removeItem("pageOffset");
					localStorage.removeItem("eventCurrentPage");
					localStorage.removeItem("resultsNumber");
					window.location.href = "Events.html";
				});
				homeEventsContainerOuter.appendChild(homeSeemoreEventsButton);
			}

			if (
				currentPage === "/Events.html" ||
				currentPage === "/Events-results.html"
			) {
				const totalEvents = xhr["@attributes"].count;
				document.querySelector("#Allevents").innerHTML = "";
				document.querySelector("#resultsDisplay").innerHTML = "";
				document.querySelector("#pagination").innerHTML = "";

				let eventTotalPages = Math.ceil(totalEvents / eventResults);
				let eventCurrentPage = global.eventsCurrentPage;
				let { events } = xhr;
				if (events.length != eventResults) {
					eventResults++;
					if (currentPage === "/Events-results.html") {
						displayResults(searchString);
					} else {
						displayResults();
					}
				}

				console.log(eventSearchStartDate);
				eventSearchStartDate = new Date(eventSearchStartDate);
				const eventDateUnchanged = eventSearchStartDate;
				console.log(eventDateUnchanged);
				// eventSearchStartDate = new Date(
				// 	eventSearchStartDate.setMinutes(eventSearchStartDate.getMinutes() - 1)
				// );
				console.log(eventSearchStartDate);
				eventSearchStartDate = new Date(
					eventSearchStartDate.setSeconds(eventSearchStartDate.getSeconds() - 1)
				);
				eventSearchStartDate = new Date(
					eventSearchStartDate.setDate(eventSearchStartDate.getDate() - 1)
				);

				eventSearchStartDate = new Date(eventSearchStartDate);
				console.log(eventSearchStartDate);
				eventSearchEndDate = new Date(eventSearchEndDate);
				console.log(eventSearchEndDate);
				// const eventSearchStartDateEnd = new Date(
				// 	eventSearchStartDate.setDate(eventSearchStartDate.getDate() + 1)
				// );
				events.forEach((event) => {
					const eventUrl = event.web_sites.web_sites;
					// get event location
					let eventLocation = event.location.summary;
					// let eventLocationCity = eventLocation.split(",");
					// eventLocationCity = eventLocationCity[2].trim();
					const eventSessions = event.sessions.sessions;
					console.log(eventSessions);
					const eventImage = event.images.images[0].original_url;
					// return event sessions that are current
					let currentSessions;
					let eventStartTime;
					let latestCurrentSession;
					let noSessions = false;
					if (currentPage === "/Events-results.html") {
						currentSessions = eventSessions.filter(
							(session) =>
								new Date(session.datetime_start) > eventSearchStartDate &&
								new Date(session.datetime_start) < eventSearchEndDate
						);
						console.log(eventSearchStartDate);
						console.log(currentSessions);
						if (currentSessions.length === 0) {
							console.log("no sessions");
							noSessions = true;
							currentSessions = eventSessions.filter(
								(session) =>
									new Date(session.datetime_start) < eventSearchEndDate
							);
							latestCurrentSession =
								currentSessions[currentSessions.length - 1].datetime_summary;
							console.log(latestCurrentSession);
						} else {
							latestCurrentSession = currentSessions[0].datetime_start;
							eventStartTime = new Date(latestCurrentSession);
							if (eventStartTime < eventDateUnchanged) {
								console.log(eventDateUnchanged);
								latestCurrentSession = currentSessions[0].datetime_summary;
								noSessions = true;
							} else {
								latestCurrentSession = currentSessions[0].datetime_start;
								eventStartTime = new Date(latestCurrentSession);
								console.log(eventStartTime);
							}
							console.log(eventStartTime);
							console.log(eventSearchStartDate);
						}
					}

					// Calculations for event page only
					if (currentPage === "/Events.html") {
						currentSessions = eventSessions.filter(
							(session) => new Date(session.datetime_start) >= currentDate
						);

						// if no current session times display original session time
						if (currentSessions.length === 0) {
							eventStartTime = new Date(event.datetime_start);
						} else {
							eventStartTime = new Date(currentSessions[0].datetime_start);
						}
					}
					let eventDate;
					let eventStartHours;
					let eventStartMinutes;
					let amPm;
					let eventTimeDisplay;

					if (!noSessions) {
						// get time in hours/ minutes of current event date.
						eventStartHours = eventStartTime.getHours();
						eventStartMinutes = eventStartTime.getMinutes();
						eventStartMinutes =
							eventStartMinutes === 0 ? "" : `:${eventStartMinutes}`;
						amPm = eventStartHours >= 12 ? "pm" : "am";
						eventStartHours = eventStartHours % 12;
						eventStartHours = eventStartHours ? eventStartHours : 12;
						eventDate;
						// convert to string/NZ date format
						eventDate = eventStartTime.toLocaleDateString("en-GB");
						// Display "Today" if today's date matches with event's date
						if (currentDateString === eventDate) {
							eventDate = "Today";
						}
						eventTimeDisplay = `${eventDate} ${eventStartHours}${eventStartMinutes}${amPm}`;
					} else {
						eventTimeDisplay = latestCurrentSession;
					}

					const eventsContainer = document.createElement("div");
					eventsContainer.classList.add("eventPagePanel");
					eventsContainer.innerHTML = `					
			
			<a id="eventPanelContainerLink" href="event-details.html?id=${event.id}">	
			<div class="eventPagePanelInner">
			
				<img
					alt="${event.name}"
					class="boxImage img-responsive"
					src="${eventImage}"
			/>
			<div class="eventPanel">
				<h4 class="eventTitle">${event.name}</h4>
				<div class="eventDate">
					<strong>When:</strong> ${eventTimeDisplay}
				</div>
				<div class="eventLocation">
					<strong>Location:</strong> ${eventLocation}
				</div>
				<div class="eventDescription">
				${event.description}
				</div>
			</div>
			</div>
			</a>
		`;
					const eventsContainerOuter = document
						.getElementById("Allevents")
						.append(eventsContainer);
				});

				const eventsContainerInner = document.getElementById("pagination");
				if (eventNumber == 0) {
					eventsContainerInner.innerHTML =
						"<div id='noResultsContainer'>Sorry, no results were found for your search</div>";
				} else {
					displayPagination();
				}

				function displayPagination() {
					const innerPagination = document.createElement("div");
					innerPagination.classList.add("pagination");

					innerPagination.innerHTML = `
						<button id="prev">&#8249; Prev</button>
						<button id="next">Next &#8250;</button>
						<div class="page-counter">Page ${eventCurrentPage} of ${eventTotalPages}</div>
						`;

					document.querySelector("#pagination").appendChild(innerPagination);
					// Disable prev button if on first page
					if (eventCurrentPage == 1) {
						document.querySelector("#prev").disabled = true;
					}
					// Disable next button if on last page
					if (eventCurrentPage == eventTotalPages) {
						document.querySelector("#next").disabled = true;
					}

					document
						.querySelector("#next")
						.addEventListener("click", async () => {
							eventCurrentPage++;
							pageOffset =
								eventCurrentPage > 1
									? (pageOffset = (eventCurrentPage - 1) * eventResults)
									: (pageOffset = 0);
							global.eventsCurrentPage = eventCurrentPage;
							global.pageOffset = pageOffset;

							localStorage.setItem("pageOffset", JSON.stringify(pageOffset));
							localStorage.setItem(
								"eventCurrentPage",
								JSON.stringify(eventCurrentPage)
							);
							localStorage.removeItem("resultsNumber");
							window.scrollTo(0, 0);
							if (currentPage === "/Events-results.html") {
								displayResults(
									searchString,
									searchRegion,
									searchTicketPrices,
									searchStartDate,
									searchEndDate
								);
							} else {
								displayResults();
							}
						});
					// Prev page
					document
						.querySelector("#prev")
						.addEventListener("click", async () => {
							eventCurrentPage--;
							pageOffset =
								eventCurrentPage > 1
									? (pageOffset = (eventCurrentPage - 1) * eventResults)
									: (pageOffset = 0);
							global.eventsCurrentPage = eventCurrentPage;
							global.pageOffset = pageOffset;
							localStorage.setItem("pageOffset", JSON.stringify(pageOffset));
							localStorage.setItem(
								"eventCurrentPage",
								JSON.stringify(eventCurrentPage)
							);
							localStorage.removeItem("resultsNumber");
							window.scrollTo(0, 0);
							if (currentPage === "/Events-results.html") {
								displayResults(
									searchString,
									searchRegion,
									searchTicketPrices,
									searchStartDate,
									searchEndDate
								);
							} else {
								displayResults();
							}
						});
				}
				const resultsNumberContainer =
					document.getElementById("resultsDisplay");
				const resultsNumber = document.createElement("div");

				// results display number for events
				let displayedEventsFirst;
				let displayedEventsLast;
				if (eventCurrentPage <= 1) {
					displayedEventsFirst = 1;
					displayedEventsLast = eventResults;
				} else {
					displayedEventsFirst = pageOffset + (eventCurrentPage - 1);
					displayedEventsLast = displayedEventsFirst + eventResults;
				}
				console.log(resultsNumber);

				if (localStorage.getItem("resultsNumber")) {
					resultsNumber.innerHTML = JSON.parse(
						localStorage.getItem("resultsNumber")
					);
					localStorage.removeItem("resultsNumber");
				} else {
					if (totalEvents == 0) {
						resultsNumber.innerHTML = "0 results";
					} else if (displayedEventsLast >= totalEvents) {
						resultsNumber.innerHTML = `${displayedEventsFirst} to ${totalEvents} of ${totalEvents} results`;
					} else {
						resultsNumber.innerHTML = `${displayedEventsFirst} to ${displayedEventsLast} of ${totalEvents} results`;
					}
					global.resultsNumber = resultsNumber.innerText;
				}

				resultsNumberContainer.prepend(resultsNumber);
				localStorage.setItem(
					"resultsNumber",
					JSON.stringify(resultsNumber.innerHTML)
				);
			}

			if (currentPage === "/Events-results.html") {
			}

			let map;
			if (currentPage.includes("/event-details")) {
				async function initMap() {
					// The location of Uluru
					const position = { lat: eventLat, lng: eventLng };
					// Request needed libraries.
					//@ts-ignore
					const { Map } = await google.maps.importLibrary("maps");
					const { AdvancedMarkerElement } = await google.maps.importLibrary(
						"marker"
					);

					// The map, centered at Uluru
					map = new Map(document.getElementById("map"), {
						zoom: 15,
						center: position,
						mapId: eventName,
					});

					// The marker, positioned at Uluru
					const marker = new AdvancedMarkerElement({
						map: map,
						position: position,
						title: eventName,
					});
				}

				initMap();
			}
			hideSpinner();
		},
		error: function (xhr, status, error) {
			// Error handler: called when the request fails (HTTP status code other than 2xx)
			console.error("Request failed:", status, error);
			// Optionally, handle different types of errors (e.g., network error, server error)
		},
	});
}

function showSpinner() {
	document.querySelector(".spinner").classList.add("show");
}

function hideSpinner() {
	document.querySelector(".spinner").classList.remove("show");
}

function showMoreSessions() {
	const fiveSessionsContainer = document.getElementById(
		"fiveSessionsContainer"
	);
	const allSessionsContainer = document.getElementById("allSessionsContainer");
	fiveSessionsContainer.style.display = "none";
	allSessionsContainer.style.display = "block";
}

function showFewerSessions() {
	const fiveSessionsContainer = document.getElementById(
		"fiveSessionsContainer"
	);
	const allSessionsContainer = document.getElementById("allSessionsContainer");
	allSessionsContainer.style.display = "none";
	fiveSessionsContainer.style.display = "block";
	singleEventDes = document.querySelector(".singleEventDes");
	const singleEventDesScroll = singleEventDes.getBoundingClientRect();
	const viewportHeight = document.documentElement.clientHeight;
	const scrollPosition = singleEventDesScroll.height * 2 + viewportHeight / 2;

	if (singleEventDes) {
		window.scrollTo({ top: scrollPosition, behaviour: "smooth" });
		console.log(singleEventDesScroll);
	}
}
// Pagination
function runCarousel() {
	const rightBtn = document.querySelector(".right");
	rightBtn.click();
}

if (currentPage === "/home.html") {
	setInterval(runCarousel, 6000);
}

const navContainer = document.getElementById("navigation-container");
const footerContainer = document.getElementById("footer-Container");

navContainer.innerHTML = `
<!-- navbar top start -->
<div class="navbar topNavbar navbar-inverse">
	<a id="logoLink" href="home.html">
		<div>
		<img alt="New Zealand logo" class="logo" src="Images/nzIcon.gif" />
		<span class="logoText">New Zealand Attractions</span>
		</div></a>
	<button
		class="navbar-toggle"
		data-target=".myHeader"
		data-toggle="collapse">
		<span class="icon-bar"></span><span class="icon-bar"></span>
		<span class="icon-bar"></span>
	</button>
</div>
<!-- navbar top end -->
<!-- navbar bottom start -->
<div
	class="navbar navbar-inverse lowerNavbar collapse navbar-collapse myHeader"
>
	<div>
		<ul
			class="nav navbar-nav navbar-left navigationLinks collapse navbar-collapse myHeader"
		>
			<li class="hoverActive">
				<a class="selectActive Home" href="home.html">Home</a>
			</li>
			<li class="hoverEffect dropdown">
				<a class="dropdown-toggle inactive selectActive Attractions"
					>Attractions <b class="caret customCaret"></b
				></a>
				<ul class="dropdown-menu">
					<li>	
						<a href="NorthIslandAttractions.html">North Island</a>
					</li>
					<li>
						<a href="SouthIslandAttractions.html">South Island</a>
					</li>
				</ul>
			</li>
			<li id="eventsTab" class="hoverEffect inactive">
				<a href="Events.html" class="selectActive Events">Events</a>
			</li>
			<li class="hoverEffect dropdown">
				<a class="dropdown-toggle inactive selectActive History"
					>History <b class="caret customCaret"></b
				></a>
				<ul class="dropdown-menu">
					<li>
						<a href="History.html">History of New Zealand</a>
					</li>
					<li>
						<a href="TreatyOfWaitangi.html">Treaty of Waitangi</a>
					</li>
				</ul>
			</li>
			<li class="hoverEffect inactive">
				<a class="mapLink selectActive Gallery" href="Gallery.html"
					>Gallery<img
						alt="mapicon"
						class="mapIcon"
						src="Images/Icons/photoframeWhite.png"
				/></a>
			</li>
			<li class="hoverActive">
				<a class="inactive selectActive Contact" href="ContactUs.html"
					>Contact</a
				>
			</li>
		</ul>
		<!-- social media icons -->
		<div class="nav navbar-right socialNav">
			<a href="#" title="Facebook">
				<img
					alt="Facebook Icon"
					class="socialIcon"
					src="Images/Icons/iconfinder_67_facebook_106163.png"/></a>
			<a href="#" title="Instagram">
				<img
					alt="Instagram Icon"
					class="socialIcon2"
					src="Images/Icons/iconfinder_instagram_401462.png"
			/></a>
			<a href="#" title="X">
				<img
					alt="X Icon"
					class="socialIcon"
					src="Images/Icons/iconfinder_Twitter_194909.png"
			/></a>
		</div>
	</div>
	<button id="scrollTopButton" title="Go to top"><div id="scrollTopContainer"><i class="fa-solid fa-arrow-up"></i></div></button>
</div>
<!-- end of bottom navbar -->`;

footerContainer.innerHTML = `
<!-- Footer beggin -->
		<footer class="container-fluid footer">
			<!-- top footer -->
			<div class="topFooter row">
				<div class="col-md-4 col-lg-4">
					<h4 class="footerHeading">Stay Connected</h4>
					<div class="footerBox">
						<a class="inactiveLink" href="#"
							><i class="fab fa-facebook"></i>
							<p class="padding-left">Facebook</p> </a
						><br /><a class="inactiveLink" href="#">
							<i class="fab fa-twitter-square"></i>
							<p class="padding-left">X</p> </a
						><br /><a class="inactiveLink" href="#">
							<i class="fab fa-instagram"></i>
							<p class="padding-left">Instagram</p> </a
						><br /><a class="inactiveLink" href="#">
							<i class="fab fa-youtube footerSocial"></i>
							<p class="padding-left">Youtube</p> </a
						><br />
					</div>
				</div>
				<div class="col-md-4 col-lg-4">
					<h4 class="footerHeading">Contact Us</h4>
					<div class="footerBox">
						<i class="fas fa-map-marker-alt"></i>
						<p class="padding-left">
							77 Rogers Street <br />Christchurch, 8014 <br />New Zealand
						</p>
						<br /><i class="fas fa-phone-square"></i>
						<p class="padding-left">+64 3 398 2651</p>
						<br />
						<a class="inactiveLink" href="ContactUs.html">
							<i class="far fa-envelope"></i>
							<p class="padding-left">Contact</p>
						</a>
					</div>
				</div>
				<div class="col-md-4 logoFooter">
					<a id="logoLink" href="home.html">
						<img
							alt="New Zealand logo"
							class="logo footerLogo"
							src="Images/nzIcon.gif"
						/>
						<span class="logoText footerLogoText"
							>New Zealand<br />Attractions</span
						><br />
					</a>
				</div>
			</div>
			<!-- bottom footer -->
			<!-- cookies pop up -->
			<div id="cookieContainer">
			<h4>We use cookies</h4>
			<p>Cookies help us deliver the best experience on our website. By using our website, you agree to the use of cookies</p>
			<button id="cookiesButton">Accept</button>
			</div>
			<div class="bottomFooter">
				<p id="footerBottom">&copy; copyright 2024 Revelation Studios</p>
			</div>
		</footer>
`;

function formLabel() {
	const formInput = document.querySelectorAll(".formInput");
	formInput.forEach((input) => {
		input.addEventListener("focus", function (e) {
			e.target.previousElementSibling.style.fontSize = "10px";
			e.target.previousElementSibling.style.top = "0";
		}),
			input.addEventListener("blur", function (e) {
				if (input.value.trim() !== "") {
					e.target.previousElementSibling.style.fontSize = "10px";
					e.target.previousElementSibling.style.top = "0";
				} else {
					e.target.previousElementSibling.style.fontSize = "14px";
					e.target.previousElementSibling.style.top = "20px";
				}
			});
	});
}
formLabel();

// Atractions page pulling from local JSON file. (I made this Json file as I was denied access to actual APIs related to the info I wanted.)
async function fetchAttractions() {
	const northIslandBannerDiv = document.getElementById("northIslandBanner");
	const southIslandBannerDiv = document.getElementById("southIslandBanner");
	const response = await fetch("../json/NewZealandAttractions.json");
	const attractions = await response.json();
	const { NorthIsland } = attractions;
	const { SouthIsland } = attractions;
	let Regions;
	// NorthIsland Banner
	if (currentPage === "/NorthIslandAttractions.html") {
		const northIslandBannerImg = document.createElement("img");
		northIslandBannerImg.setAttribute("alt", "White Cliffs");
		northIslandBannerImg.src = NorthIsland.RegionBanner;
		northIslandBannerImg.classList.add("headingBanner");
		northIslandBannerDiv.prepend(northIslandBannerImg);
		({ Regions } = NorthIsland);

		// console.log(region);
		// let regionAttractionsObject = Object.entries(NorthIsland)[0][1];
		// console.log(regionAttractionsObject);
		// regionAttractionsObject.forEach((region) => {
		// 	console.log(region.Auckland);
		// });
		// Object.keys(NorthIsland).forEach((key) => {});

		// console.log(value.Attractions);
	} else if (currentPage === "/SouthIslandAttractions.html") {
		// SouthIsland Banner
		const southIslandBannerImg = document.createElement("img");
		southIslandBannerImg.setAttribute("alt", "Lake and Mountains");
		southIslandBannerImg.src = SouthIsland.RegionBanner;
		southIslandBannerImg.classList.add("headingBanner");
		southIslandBannerDiv.prepend(southIslandBannerImg);
		({ Regions } = SouthIsland);
	}
	// let region;
	// Setting dynamic values for region section
	for (const region in Regions) {
		value = Regions[region];
		const regionContainer = document.createElement("div");
		regionContainer.innerHTML = `
		<div id="${value.RegionCode}" class="attractionBox">
		<div class="container">
			<div class="BannerBox">
				<img
					alt="${region}"
					class="regionBanner"
					src="${value.BannerImg}"
				/>
				<div class="bannerHeadingBox">
					<h3 class="bannerTitle">
					${region}
						<hr class="regionUnderline" />
					</h3>
				</div>
			</div>
			<div class="container"></div>
			<div class="row regionInfo">
				<div class="column col-lg-6">
					<h3>${region}</h3>
					<hr class="attractionTitleUnderline" />
					<p>
						<strong>Main Cities:</strong> ${value.MainCities}<br /><strong
							>Population:</strong
						>
						${value.Population}<br /><strong>Land Area:</strong> ${value.LandArea}<br />
						<strong>Coordinates: </strong>${value.Coordinates}
					</p>					
					<br />					
					<p>${value.Information}</p>
				</div>
				<div class="column col-lg-6">
					<img
						alt="${region} Region"
						src="${value.AreaMap}"
					/>
				</div>
			</div>
			<div id="attraction${region}"></div>
		</div>
		</div>
		</div>			
			`;
		// Appending region info to DOM.
		const regionOuterContainer = document.getElementById("attractionInfo");
		regionOuterContainer.appendChild(regionContainer);
		for (const key in Regions) {
			if (key === region) {
				const attractions = value.Attractions;
				// console.log(attractionsContainer);
				attractions.forEach((attraction) => {
					const attractionName = attraction.AttractionName[0];
					const attractionId = attraction.AttractionName[1];
					const attractionDesc = attraction.AttractionDescription;
					const attractionImg = attraction.AttractionImg;
					const attractionsContainer = document.createElement("div");
					attractionsContainer.innerHTML = `
					<div class="row attractionRow" id="${attractionId}Scroll">
					<div class="column col-lg-6">
						<img
							alt="${attractionName}"
							src="${attractionImg}"
						/>
					</div>
					<div class="column col-lg-6">
						<h4>${attractionName}</h4>
						<hr class="attractionTitleUnderline" />
						<p>
						${attractionDesc}
						</p>
					</div>
				</div>
					`;
					const regionAttractions = document.getElementById(
						`attraction${region}`
					);
					regionAttractions.appendChild(attractionsContainer);
				});
				// append attractions to region
			}
		}
	}
}
fetchAttractions();

// Scroll to top button

if (currentPage !== "/ContactUs.html") {
	window.addEventListener("scroll", function () {
		scrollFunction();
	});

	let scrollTopButton = document.getElementById("scrollTopButton");
	scrollTopButton.addEventListener("click", topFunction);

	function scrollFunction() {
		if (window.scrollY > 20) {
			scrollTopButton.style.display = "flex";
		} else {
			scrollTopButton.style.display = "none";
		}
	}
	function topFunction() {
		document.body.scrollTop = 0; // For Safari
		document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
	}
}

// Interactive map functions

function mapHoverEffects(code) {
	const areaCode = code;
	const mapLink = document.getElementById(`${areaCode}MAP`);
	mapLink.style.fill = "#80bc78";
}

function mapLeaveEffects(code) {
	const areaCode = code;
	const mapLink = document.getElementById(`${areaCode}MAP`);
	mapLink.style.fill = "#316b35";
}
function listHoverEffects(code) {
	const areaCode = code;
	const listItem = document.getElementById(`${areaCode}LIST`);
	const mapLink = document.getElementById(`${areaCode}MAP`);
	mapLink.style.fill = "#80bc78";
	listItem.style.backgroundColor = "rgb(255, 255, 255)";
	listItem.style.fontWeight = "bold";
}

function listLeaveEffects(code) {
	const areaCode = code;
	const listItem = document.getElementById(`${areaCode}LIST`);
	const mapLink = document.getElementById(`${areaCode}MAP`);
	mapLink.style.fill = "#316b35";
	listItem.style.backgroundColor = "";
	listItem.style.fontWeight = "Normal";
}
function interactiveMap(code, area) {
	const areaPath = document.getElementById(`NZN-${code}`);
	const areaText = document.getElementById(code);
	const areaInfo = document.getElementById(area);
	const mapPaths = document.querySelectorAll("path");
	const selectList = document.querySelectorAll(".nav-link");
	const attractionInfo = document.querySelectorAll(".attractionBox");
	for (let i = 0; i < attractionInfo.length; i++) {
		attractionInfo[i].style.display = "none";
	}
	for (let i = 0; i < mapPaths.length; i++) {
		mapPaths[i].classList.remove("MapActive");
	}
	for (let i = 0; i < selectList.length; i++) {
		selectList[i].classList.remove("selectActive");
	}
	areaPath.classList.add("MapActive");
	areaText.classList.add("selectActive");
	areaInfo.style.display = "block";
	areaInfo.scrollIntoView({ behavior: "smooth" });
}

// Highlight Active Navigation tabs
function addActiveTab() {
	if (currentPage === "/home.html") {
		const element = document.querySelector(".selectActive.Home");
		element.classList.add("active");
	} else if (currentPage.includes("Attractions")) {
		const element = document.querySelector(".selectActive.Attractions");
		element.classList.add("active");
	} else if (
		window.location.href.includes("Events") ||
		currentPage.includes("event-details")
	) {
		const element = document.querySelector(".selectActive.Events");
		element.classList.add("active");
	} else if (
		currentPage === "/History.html" ||
		currentPage === "/TreatyOfWaitangi.html"
	) {
		const element = document.querySelector(".selectActive.History");
		element.classList.add("active");
	} else if (currentPage === "/Gallery.html") {
		const element = document.querySelector(".selectActive.Gallery");
		element.classList.add("active");
	} else if (currentPage === "/ContactUs.html") {
		const element = document.querySelector(".selectActive.Contact");
		element.classList.add("active");
	}
}
addActiveTab();

let clickedAttraction = [];
let openWindow = "";

function showHomeEvent(attraction, regioncode, region, island) {
	clickedAttraction[0] = attraction;
	clickedAttraction[1] = regioncode;
	clickedAttraction[2] = region;
	localStorage.setItem("attraction", JSON.stringify(clickedAttraction));
	openWindow = window.open(`${island}IslandAttractions.html`, "_self");
}
if (
	(currentPage === "/NorthIslandAttractions.html" &&
		localStorage.getItem("attraction") != null) ||
	(currentPage === "/SouthIslandAttractions.html" &&
		localStorage.getItem("attraction") != null)
) {
	window.addEventListener("load", function () {
		clickedAttraction = JSON.parse(localStorage.getItem("attraction"));
		let scrollEl = document.getElementById(`${clickedAttraction[0]}Scroll`);
		interactiveMap(clickedAttraction[1], clickedAttraction[2]);
		scrollEl.scrollIntoView({ behavior: "smooth" });
		clickedAttraction.length = 0;
		localStorage.removeItem("attraction");
	});
}

const navigationContainer = document.getElementById("navigation-container");
const navigationContainerOffset = navigationContainer.offsetHeight;

document.body.style.paddingTop = `${navigationContainerOffset - 1}px`;

let prevScrollpos = window.scrollY;
window.onscroll = function () {
	let currentScrollPos = window.scrollY;
	if (prevScrollpos > currentScrollPos) {
		document.getElementById("navigation-container").style.top = "0";
	} else if (prevScrollpos > navigationContainerOffset) {
		document.getElementById("navigation-container").style.top = "-100%";
	}
	prevScrollpos = currentScrollPos;
};

function scrollToTop() {
	window.scrollTo({
		top: 0,
		behavior: "smooth",
	});
}

//events page

//dropdown show/hide events

function tabEvents(tab) {
	const northEvents = document.getElementById("NorthEvents");
	const southEvents = document.getElementById("SouthEvents");
	const nZTab = document.getElementById("NZtab");
	const northTab = document.getElementById("Northtab");
	const southTab = document.getElementById("Southtab");
	switch (tab) {
		case "NZ":
			nZTab.classList.add("activeTab");
			northTab.classList.remove("activeTab");
			southTab.classList.remove("activeTab");
			northEvents.style.display = "block";
			southEvents.style.display = "block";
			break;
		case "north":
			northTab.classList.add("activeTab");
			nZTab.classList.remove("activeTab");
			southTab.classList.remove("activeTab");
			northEvents.style.display = "block";
			southEvents.style.display = "none";
			break;
		case "south":
			southTab.classList.add("activeTab");
			nZTab.classList.remove("activeTab");
			northTab.classList.remove("activeTab");
			southEvents.style.display = "block";
			northEvents.style.display = "none";
			break;
	}
}

// const eventSearchBox = document.getElementById("searchEvents");
// if (eventSearchBox) {
// 	eventSearchBox.addEventListener("input", filterEvents);
// }
// function filterEvents(e) {
// 	const eventContainer = document.querySelectorAll(".eventPagePanel");
// 	const eventSearchTerm = e.target.value.trim().toLowerCase();
// 	eventContainer.forEach((event) => {
// 		event.style.display = "revert";
// 		if (!event.innerText.toLowerCase().includes(eventSearchTerm)) {
// 			event.style.display = "none";
// 		}
// 	});
// }

//attractions click events
// attractions text animations

function mouseOverEffects(el, highlightColour) {
	const Text = document.getElementById(`${el}Text`);
	const Box = document.getElementById(`${el}Box`);
	Text.style.opacity = 1;
	Text.style.transitionDuration = "1s";
	Box.style.transitionDuration = "0.2s";
	if (highlightColour === "white") {
		Box.style.boxShadow =
			"0 0 0 0 rgba(255, 255, 255, 0.2), 0 0px 10px 0 rgba(255, 255, 255, 1)";
	} else {
		Box.style.boxShadow =
			"0 0 0 0 rgba(0, 0, 0, 0.2), 0 0px 10px 0 rgba(0, 0, 0, 1)";
	}
}

function mouseOutEffects(el) {
	const Text = document.getElementById(`${el}Text`);
	const Box = document.getElementById(`${el}Box`);
	Text.style.opacity = 0;
	Box.style.boxShadow = "none";
}

// History page
$(document).ready(function () {
	$(".historyCover").click(function () {
		$(".historyCover").fadeOut(900);

		let timelineSwiper = new Swiper(".timeline .swiper-container", {
			direction: "vertical",
			loop: false,
			speed: 1600,
			pagination: ".swiper-pagination",
			paginationBulletRender: function (swiper, index, className) {
				var year = document
					.querySelectorAll(".swiper-slide")
					[index].getAttribute("data-year");
				return '<span class="' + className + '">' + year + "</span>";
			},
			paginationClickable: true,
			nextButton: ".swiper-button-next",
			prevButton: ".swiper-button-prev",
			breakpoints: {
				768: {
					direction: "horizontal",
				},
			},
		});
	});
});

// Treaty of Waitangi
function showTreatyInfo(treatyType) {
	const treatyAllBox = document.getElementById("treatyAllBox");
	const treatyAllBoxDivs = treatyAllBox.querySelectorAll(":scope > div");
	const showInfo = document.getElementById(`treaty${treatyType}`);
	for (let i = 0; i < treatyAllBoxDivs.length; i++) {
		treatyAllBoxDivs[i].style.display = "none";
		showInfo.style.display = "block";
		treatyAllBox.scrollIntoView({ behavior: "smooth" });
	}
}
const contactForm = document.getElementById("contactForm");
const contactFormBtn = document.getElementById("formSubmitButton");
const contactText = document.getElementById("contactText");
const contactThankyou = document.getElementById("contactThankyou");

function submitContactForm(e) {
	e.preventDefault();
	contactForm.style.display = "none";
	contactText.style.display = "none";
	contactThankyou.style.display = "block";
	const thankyouRect = contactThankyou.getBoundingClientRect();
	const viewportHeight = document.documentElement.clientHeight;
	const scrollPosition = thankyouRect.height + viewportHeight / 2;
	window.scrollTo({
		top: scrollPosition,
		behaviour: "smooth",
	});
}

// Event Listeners
if (currentPage === "/ContactUs.html") {
	contactForm.addEventListener("submit", submitContactForm);
}

// Gallery
// Videos

if (currentPage === "/Gallery.html") {
	const galleryVideoContainer = document.getElementById("videoContainer");

	const galleryVideosArr = [
		{
			caption: "Anzac Special: The Gallipoli Story",
			url: "https://www.youtube.com/embed/lpIp9DXJmS8",
		},
		{
			caption: "New Zealand: The Ultimate Travel Guide by TourRadar 5/5",
			url: "https://www.youtube.com/embed/_eMAXOp2PvA",
		},
		{
			caption: "The Treaty of Waitangi: An Introduction",
			url: "https://www.youtube.com/embed/qNyfSPm1jYU",
		},
		{
			caption: "The New Zealand Wars",
			url: "https://www.youtube.com/embed/1lZB16pELeM",
		},
		{
			caption: "Billy T James History of Nz.",
			url: "https://www.youtube.com/embed/KTFEZiKItLs",
		},
		{
			caption: "10 Best Places to Visit in New Zealand",
			url: "https://www.youtube.com/embed/EdKDIph5IaM",
		},
	];
	galleryVideosArr.forEach((video) => {
		console.log(video);
		const galleryInnerVideoContainer = document.createElement("div");
		galleryInnerVideoContainer.classList.add("col-sm-4");
		galleryInnerVideoContainer.innerHTML = `
<iframe
	allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
	allowfullscreen=""
	frameborder="0"
	src="${video.url}"
	>
</iframe>
<p>${video.caption}</p>
`;
		galleryVideoContainer.appendChild(galleryInnerVideoContainer);
	});
}
//Attractions and history lightbox functions
let slideIndex = 1;
function slides(n, type, section) {
	if (type === "plus") {
		showSlides((slideIndex += n));
	} else if (type === "current") {
		showSlides((slideIndex = n));
	}
	function showSlides(n) {
		let i;
		const slides = document.querySelectorAll(`.${section}Slides`);
		const dots = document.querySelector(`.${section}demo`);
		const captionText = document.getElementById(`${section}caption`);
		if (n > slides.length) {
			slideIndex = 1;
		}
		if (n < 1) {
			slideIndex = slides.length;
		}
		for (i = 0; i < slides.length; i++) {
			slides[i].style.display = "none";
		}
		for (i = 0; i < dots.length; i++) {
			dots[i].className = dots[i].classList.remove("activeSlide");
		}
		slides[slideIndex - 1].style.display = "block";
		dots[slideIndex - 1].classList.add("activeSlide");
		captionText.innerHTML = dots[slideIndex - 1].alt;
	}
}

// Opening closing lightbox modal on gallery page
function galleryModal(action, lightbox) {
	const attractionsModal = document.getElementById("attractionsModal");
	const historyModal = document.getElementById("historyModal");
	action === "open" && lightbox === "history"
		? (historyModal.style.display = "block")
		: (historyModal.style.display = "none");

	action === "open" && lightbox === "attractions"
		? (attractionsModal.style.display = "block")
		: (attractionsModal.style.display = "none");
}

// resets events page to 1 after clicking events tab.
const eventsTab = document
	.getElementById("eventsTab")
	.addEventListener("click", clearEventLocalStorage);

function clearEventLocalStorage() {
	localStorage.removeItem("pageOffset");
	localStorage.removeItem("eventCurrentPage");
	localStorage.removeItem("resultsNumber");
}

window.addEventListener("beforeunload", function () {
	lastPageUnloaded = window.location.href;
	localStorage.setItem("lastPageUnloaded", JSON.stringify(lastPageUnloaded));
});

window.addEventListener("DOMContentLoaded", function () {
	if (JSON.parse(localStorage.getItem("cookiesAccepted")) != true) {
		const cookiesContainer = (document.getElementById(
			"cookieContainer"
		).style.display = "flex");
	}
});

const cookiesBtn = document.getElementById("cookiesButton");
cookiesBtn.addEventListener("click", function () {
	acceptCookies = true;
	const cookiesContainer = (document.getElementById(
		"cookieContainer"
	).style.display = "none");
	localStorage.setItem("cookiesAccepted", JSON.stringify(acceptCookies));
});
