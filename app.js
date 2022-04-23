function showModal(modalId) {
	const modalEl = document.getElementById(modalId);

	if (!modalEl) return;

	modalEl.classList.add('show-modal');
	document.querySelector('body').classList.add('frozen');
}

document.querySelector('.modal').onclick = e => hideModal(e);

function hideModal(e) {
	if (e.target.classList.contains('modal')) {
		e.target.classList.remove('show-modal');
		document.querySelector('body').classList.remove('frozen');
	}
}

window.addEventListener('scroll', e => toggleFixedNavbar(e));

function toggleFixedNavbar(e) {
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
