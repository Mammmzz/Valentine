window.onSpotifyIframeApiReady = (IFrameAPI) => {
	const element = document.querySelector('iframe[src*="spotify"]');
	const options = {
		width: '100%',
		height: '70',
		uri: 'spotify:track:2TJYfqZ24XmBt3lKsfQj4N'
	};
	const callback = (EmbedController) => {
		EmbedController.play();
		// Add event listener for track end
		EmbedController.addListener('playback_update', e => {
			if (e.data.position >= e.data.duration) {
				// Restart the track when it ends
				EmbedController.seek(123000); // Start from 2:03
				EmbedController.play();
			}
		});
	};
	IFrameAPI.createController(element, options, callback);
};

const PIN = "010924"; // Change this to your desired 6-digit PIN
const pinInput = document.getElementById('pin-code');
const pinPage = document.getElementById('pin-page');
const mainPage = document.getElementById('main-page');
const buttons = document.querySelectorAll('.pin-button');
const loveCounter = document.getElementById('love-counter');

// PIN handling
buttons.forEach(button => {
	button.addEventListener('click', () => {
		if (button.classList.contains('clear')) {
			pinInput.value = '';
		} else if (button.classList.contains('enter')) {
			checkPin();
		} else {
			if (pinInput.value.length < 6) {
				pinInput.value += button.dataset.number;
			}
		}
	});
});

let attempts = 0;
const MAX_ATTEMPTS = 3;

function checkPin() {
	if (pinInput.value === PIN) {
		pinPage.classList.remove('active');
		mainPage.classList.add('active');
		startLoveCounter();
	} else {
		attempts++;
		pinInput.value = '';
		pinInput.classList.add('shake');
		
		if (attempts >= MAX_ATTEMPTS) {
			const remainingTime = 30;
			disableInputFor(remainingTime);
		}
		
		const message = document.createElement('div');
		message.className = 'error-message';
		message.textContent = `PIN salah! Sisa percobaan: ${MAX_ATTEMPTS - attempts}`;
		pinInput.parentElement.appendChild(message);
		
		setTimeout(() => {
			pinInput.classList.remove('shake');
			message.remove();
		}, 2000);
	}
}

function disableInputFor(seconds) {
	const buttons = document.querySelectorAll('.pin-button');
	buttons.forEach(btn => btn.disabled = true);
	pinInput.disabled = true;
	
	const timer = document.createElement('div');
	timer.className = 'timer';
	pinInput.parentElement.appendChild(timer);
	
	let timeLeft = seconds;
	const interval = setInterval(() => {
		timer.textContent = `Tunggu ${timeLeft} detik`;
		timeLeft--;
		
		if (timeLeft < 0) {
			clearInterval(interval);
			buttons.forEach(btn => btn.disabled = false);
			pinInput.disabled = false;
			timer.remove();
			attempts = 0;
		}
	}, 1000);
}

// Love counter functionality
function startLoveCounter() {
	const startDate = new Date('2024-08-1'); // Set your start date here
	
	function updateCounter() {
		const now = new Date();
		const diff = now - startDate;
		
		const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
		const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24));
		const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
		const seconds = Math.floor((diff % (1000 * 60)) / 1000);
		
		loveCounter.textContent = `${years} tahun, ${days} hari, ${hours} jam, ${minutes} menit, ${seconds} detik`;
	}
	
	updateCounter();
	setInterval(updateCounter, 1000);
}

// Photo gallery functionality with smooth transitions
const photoSlider = document.querySelector('.photo-slider');
const photos = document.querySelectorAll('.photo-wrapper');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.arrow.prev');
const nextBtn = document.querySelector('.arrow.next');
let currentIndex = 0;

function showPhoto(index) {
	photos.forEach((photo, idx) => {
		if (idx === index) {
			photo.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
			photo.classList.add('active');
			photo.style.transform = 'scale(1)';
			photo.style.opacity = '1';
		} else {
			photo.classList.remove('active');
			photo.style.transform = 'scale(0.95)';
			photo.style.opacity = '0';
		}
	});
	updateDots();
}

function updateDots() {
	dots.forEach((dot, idx) => {
		dot.classList.toggle('active', idx === currentIndex);
	});
}

function nextPhoto() {
	currentIndex = (currentIndex + 1) % photos.length;
	showPhoto(currentIndex);
}

function prevPhoto() {
	currentIndex = (currentIndex - 1 + photos.length) % photos.length;
	showPhoto(currentIndex);
}

// Auto-advance photos every 4 seconds
let autoAdvance = setInterval(nextPhoto, 4000);

// Pause auto-advance on hover
photoSlider.addEventListener('mouseenter', () => clearInterval(autoAdvance));
photoSlider.addEventListener('mouseleave', () => {
	autoAdvance = setInterval(nextPhoto, 5000);
});

// Event listeners
prevBtn.addEventListener('click', () => {
	clearInterval(autoAdvance);
	prevPhoto();
});

nextBtn.addEventListener('click', () => {
	clearInterval(autoAdvance);
	nextPhoto();
});

dots.forEach((dot, idx) => {
	dot.addEventListener('click', () => {
		clearInterval(autoAdvance);
		currentIndex = idx;
		showPhoto(currentIndex);
	});
});

// Touch swipe functionality
let touchStartX = 0;
let touchEndX = 0;

photoSlider.addEventListener('touchstart', (e) => {
	clearInterval(autoAdvance);
	touchStartX = e.touches[0].clientX;
});

photoSlider.addEventListener('touchend', (e) => {
	touchEndX = e.changedTouches[0].clientX;
	handleSwipe();
	autoAdvance = setInterval(nextPhoto, 5000);
});

function handleSwipe() {
	const swipeDistance = touchEndX - touchStartX;
	const threshold = photoSlider.offsetWidth * 0.2;

	if (Math.abs(swipeDistance) > threshold) {
		if (swipeDistance > 0) {
			prevPhoto();
		} else {
			nextPhoto();
		}
	}
}

// Initialize first photo
showPhoto(0);

// Initial page load animation
document.addEventListener('DOMContentLoaded', () => {
	pinPage.style.opacity = '0';
	setTimeout(() => {
		pinPage.style.opacity = '1';
		pinPage.style.transition = 'opacity 1s';
	}, 100);

	// Load Spotify API
	const script = document.createElement('script');
	script.src = 'https://open.spotify.com/embed-podcast/iframe-api/v1';
	script.async = true;
	document.body.appendChild(script);
});
