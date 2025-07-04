const BACKEND_URL = 'https://beerbackend.onrender.com/';
const modals = document.querySelectorAll('.modal');
modals.forEach(modal => modal.addEventListener('click', hideModal));
window.addEventListener('scroll', toggleFixedNavbar);
window.addEventListener('click', handleWindowClick);
document.querySelector('.menu-icon').onclick = toggleHamburgerMenu;
document
	.querySelector('.register-form')
	.addEventListener('submit', handleFormSubmit);
window.addEventListener('DOMContentLoaded', () => {
	initTagCloud();
});

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

	const isFastestChugChecked = false;
	const isBeerPongChecked = true;

	if (!name) return sendErrorMessage('Please input your name.');

	const split = name.split(' ');
	if (split.length <= 1 || !split[1])
		return sendErrorMessage('Please input last name as well.');

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
	const teammateSplit = pongTeammate.split(' ');
	if (teammateSplit.length <= 1 || !teammateSplit[1])
		return sendErrorMessage('Please input last names as well.');

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
	if (!data.success) return sendErrorMessage(data.msg);
	emailjs.init('vKptyeMUmQdx2JxrZ');

	document.querySelector('.btn-blwhite').textContent = 'Registered!';
	setTimeout(() => {
		document.querySelector('.btn-blwhite').textContent = 'Submit';
	}, 4000);
	sendSuccessMessage(data.msg);
	document.querySelector('.register-form').reset();

	if (data.name) {
		return emailjs.send('service_fqw8lii', 'template_b0j2yde', {
			name: data.name
		});
	}

	if (data.teamName) {
		return emailjs.send('service_fqw8lii', 'template_d44m8x9', {
			first_person: data.firstPerson,
			teammate: data.teammate,
			team: data.teamName
		});
	}
}

function initTagCloud() {
	TagCanvas.Start('canvas', 'tags-list', {
		outlineColour: '#fafafa00',
		depth: 0.7,
		maxSpeed: 0.03,
		imageMode: 'image',
		imageScale: 0.45,
		minBrightness: 0.5,
		noMouse: true,
		noSelect: true,
		zoom: 1,
		maxZoom: 1,
		minZoom: 1
	});
	TagCanvas.SetSpeed('canvas', [-0.15, 0.1]);
}

async function getRegisterInfo() {
	const response = await fetch(BACKEND_URL);

	const data = await response.json();

	if (!data) return;

	document.getElementById(
		'chugText'
	).textContent += `(${data.chugSpacesLeft} spaces left)`;
	document.getElementById(
		'pongText'
	).textContent += `(${data.pongSpacesLeft} spaces left)`;
}
