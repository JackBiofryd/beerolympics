const BACKEND_URL = 'https://beerolympicss.herokuapp.com/';

const modals = document.querySelectorAll('.modal');
modals.forEach(modal => modal.addEventListener('click', hideModal));
window.addEventListener('scroll', toggleFixedNavbar);
window.addEventListener('click', handleWindowClick);
document.querySelector('.menu-icon').onclick = toggleHamburgerMenu;
document
	.querySelector('.register-form')
	.addEventListener('submit', handleFormSubmit);

function hideModal(e) {
	if (e.target.classList.contains('modal')) {
		e.target.classList.remove('show-modal');
		document.querySelector('body').classList.remove('frozen');
	}
}

function toggleFixedNavbar() {
	const scrollTop =
		window.pageYOffset ||
		(document.documentElement || document.body.parentNode || document.body)
			.scrollTop;

	const navbarEl = document.querySelector('.navbar-wrapper');

	if (scrollTop === 0) {
		return navbarEl.classList.remove('scrolled-nav');
	}

	return navbarEl.classList.add('scrolled-nav');
}

function handleWindowClick(e) {
	if (e.target.classList.contains('menu-icon')) return;

	document.querySelector('.hamburger-menu-links').classList.add('hidden');
}

function toggleHamburgerMenu() {
	document.querySelector('.hamburger-menu-links').classList.toggle('hidden');
}

function showModal(modalId) {
	const modalEl = document.getElementById(modalId);

	if (!modalEl) return;

	modalEl.classList.add('show-modal');
	document.querySelector('body').classList.add('frozen');
}

function toggleBeerPongRegister() {
	const checkbox = document.getElementById('pongSelect');
	const bpRegister = document.querySelector('.beer-pong-register');

	bpRegister.style.display = checkbox.checked ? 'block' : 'none';
}

function handleFormSubmit(e) {
	// TODO
	e.preventDefault();

	const formData = getFormData();
	if (!formData) return;

	document.querySelector('.btn-blwhite').textContent = 'Loading...';
	postData(BACKEND_URL, formData);
}

function getFormData() {
	const name = document.getElementById('name').value;

	const isFastestChugChecked = document.getElementById('chugSelect').checked;
	const isBeerPongChecked = document.getElementById('pongSelect').checked;

	if (!name) return sendErrorMessage('Please input your name.');

	if (!isBeerPongChecked && !isFastestChugChecked)
		return sendErrorMessage('Please select a game.');

	if (!isBeerPongChecked)
		return {
			name,
			chug: true,
			pong: false
		};

	const pongTeammate = document.getElementById('teammate').value;
	const pongTeam = document.getElementById('team').value;

	if (!pongTeammate)
		return sendErrorMessage("Please input your teammate's name.");
	if (!pongTeam) return sendErrorMessage("Please input your team's name.");

	return {
		name,
		chug: false,
		pong: true,
		teammate: pongTeammate,
		team: pongTeam
	};
}

function sendErrorMessage(message) {
	const small = document.querySelector('small');
	small.textContent = message;
	small.style.color = '#ff0000';
	return false;
}
function sendSuccessMessage(message) {
	const small = document.querySelector('small');
	small.textContent = message;
	small.style.color = '#86DC3D';
}

async function postData(url, data) {
	const response = await fetch(url, {
		method: 'POST',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	});

	const responseJSON = await response.json();
	handleResponseJSON(responseJSON);
}

function handleResponseJSON(data) {
	document.querySelector('.btn-blwhite').textContent = 'Submit';
	if (!data.success) return sendErrorMessage(data.msg);

	sendSuccessMessage(data.msg);
	document.querySelector('.register-form').reset();
}
