document.addEventListener('DOMContentLoaded', () => {
  const donutIcon = document.querySelector('.donut-icon');
  const popup = document.querySelector('.popup');
  const walletAddress = document.querySelector('.wallet-address');
  let hasShownAutoPopup = false;

  // Show automatic popup after 5 seconds
  setTimeout(() => {
    if (!hasShownAutoPopup) {
      // Add wiggle animation to donut
      donutIcon.classList.add('wiggle');
      
      // Remove wiggle class after animation completes
      setTimeout(() => {
        donutIcon.classList.remove('wiggle');
      }, 1000); 

      // Show heart emoji
      popup.textContent = '💜';
      popup.classList.add('show');
      hasShownAutoPopup = true;

      // Hide popup after 3 seconds
      setTimeout(() => {
        popup.classList.remove('show');
        // Reset popup content after hiding
        setTimeout(() => {
          popup.innerHTML = `
            <div>Отблагодарить автора можно донатом на кошелек Near:</div>
            <div class="wallet-address">donat.tg</div>
            <div>Благодарю</div>
          `;
        }, 300); 
      }, 3000);
    }
  }, 5000);

  // Toggle popup when clicking donut icon
  donutIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!hasShownAutoPopup) {
      return; // Don't show popup if auto popup hasn't shown yet
    }
    popup.classList.toggle('show');
  });

  // Close popup when clicking outside
  document.addEventListener('click', (e) => {
    if (!popup.contains(e.target) && !donutIcon.contains(e.target)) {
      popup.classList.remove('show');
    }
  });

  // Copy wallet address on click
  walletAddress?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(walletAddress.textContent);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  });
});
