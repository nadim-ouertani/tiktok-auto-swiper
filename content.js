// content.js
// This script runs when TikTok is loaded
console.log('TikTok Auto Swiper: Content script loaded');
// Check if we're on TikTok mobile interface
const isTikTokMobile = () => {
return window.location.hostname.includes('tiktok.com') &&
 (window.innerWidth < 768 ||
navigator.userAgent.includes('Mobile') ||
document.documentElement.classList.contains('mobile') ||
document.querySelector('[data-e2e="recommend-list-item-container"]') !== null);
};
// Helper function to detect TikTok's UI layout
const detectTikTokLayout = () => {
const layouts = {
hasRecommendContainer: !!document.querySelector('[data-e2e="recommend-list-item-container"]'),
hasFeedItem: !!document.querySelector('[data-e2e="feed-item"]'),
hasDivItemContainer: !!document.querySelector('div[class*="DivItemContainer"]'),
hasTikTokContainer: !!document.querySelector('div.tiktok-x6f6za-DivContainer')
 };
console.log('TikTok layout detection:', layouts);
return layouts;
};
// Run initial detection
setTimeout(() => {
const isMobile = isTikTokMobile();
console.log('TikTok Mobile interface detected:', isMobile);
if (isMobile) {
detectTikTokLayout();
 } else {
console.log('Please switch to TikTok mobile view for best results');
 }
}, 2000);
// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
if (request.action === 'getStatus') {
sendResponse({
isActive: window.tikTokSwiperInterval != null,
isMobile: isTikTokMobile(),
layout: detectTikTokLayout()
 });
 }
});
// Clean up on page unload
window.addEventListener('beforeunload', function() {
if (window.tikTokSwiperInterval) {
clearInterval(window.tikTokSwiperInterval);
 }
if (window.tikTokSwiperCounterInterval) {
clearInterval(window.tikTokSwiperCounterInterval);
 }
});