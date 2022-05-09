const modals = document.querySelectorAll('.modal');
modals.forEach(modal => modal.addEventListener('click', hideModal));
window.addEventListener('scroll', toggleFixedNavbar);
window.addEventListener('click', handleWindowClick);
document.querySelector('.menu-icon').onclick = toggleHamburgerMenu;

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
