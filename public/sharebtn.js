window.addEventListener('DOMContentLoaded', () => {
  const shareUrl = (url) => window.open(url, '_blank', 'noopener,noreferrer');
  const current = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(document.title);
  document.querySelectorAll('.share-btn').forEach((button) => {
    const href = button.classList.contains('twitter')
      ? `https://twitter.com/intent/tweet?text=${title}&url=${current}`
      : button.classList.contains('facebook')
        ? `https://www.facebook.com/sharer/sharer.php?u=${current}`
        : `https://social-plugins.line.me/lineit/share?url=${current}`;
    button.setAttribute('href', href);
    button.setAttribute('target', '_blank');
    button.setAttribute('rel', 'noopener noreferrer');
    button.addEventListener('click', (event) => {
      event.preventDefault();
      shareUrl(href);
    });
  });
});
