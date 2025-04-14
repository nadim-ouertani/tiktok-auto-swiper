// popup.js
document.addEventListener('DOMContentLoaded', function() {
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const viewCountInput = document.getElementById('viewCount');
    const delayTimeInput = document.getElementById('delayTime');
    const statusDiv = document.getElementById('status');
    
    // Check if swiping is already active
    chrome.storage.local.get(['isActive'], function(result) {
      if (result.isActive) {
        startBtn.disabled = true;
        stopBtn.disabled = false;
        statusDiv.textContent = 'Swiping in progress...';
      }
    });
    
    // Start button click handler
    startBtn.addEventListener('click', function() {
      const viewCount = parseInt(viewCountInput.value);
      const delayTime = parseInt(delayTimeInput.value);
      
      if (isNaN(viewCount) || viewCount < 1) {
        statusDiv.textContent = 'Please enter a valid number of views';
        return;
      }
      
    //   if (isNaN(delayTime) || delayTime < 1) {
    //     statusDiv.textContent = 'Please enter a valid delay time';
    //     return;
    //   }
      
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        // First, check if we're on TikTok mobile interface
        chrome.tabs.sendMessage(tabs[0].id, {action: 'getStatus'}, function(response) {
          if (chrome.runtime.lastError) {
            // Content script might not be loaded yet
            statusDiv.textContent = 'Please make sure you are on TikTok';
            return;
          }
          
          if (response && !response.isMobile) {
            statusDiv.textContent = 'Please use TikTok mobile view for best results';
            // We'll still try to run, but warn the user
          }
          
          // Execute the script
          chrome.scripting.executeScript({
            target: {tabId: tabs[0].id},
            function: startSwiping,
            args: [viewCount, delayTime]
          });
          
          chrome.storage.local.set({isActive: true}, function() {
            startBtn.disabled = true;
            stopBtn.disabled = false;
            statusDiv.textContent = 'Swiping in progress...';
          });
        });
      });
    });
    
    // Stop button click handler
    stopBtn.addEventListener('click', function() {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.scripting.executeScript({
          target: {tabId: tabs[0].id},
          function: stopSwiping
        });
        
        chrome.storage.local.set({isActive: false}, function() {
          startBtn.disabled = false;
          stopBtn.disabled = true;
          statusDiv.textContent = 'Swiping stopped';
        });
      });
    });
    
    // Function to be injected into the page to start swiping
    function startSwiping(viewCount, delayTime) {
      if (window.tikTokSwiperInterval) {
        clearInterval(window.tikTokSwiperInterval);
      }
      
      // Identify the TikTok main container
      const findTikTokContainer = () => {
        // Try to find the main feed container with videos
        const possibleContainers = [
          document.querySelector('[data-e2e="feed-item"]')?.parentElement,
          document.querySelector('[data-e2e="recommend-list-item-container"]')?.parentElement,
          document.querySelector('div[class*="DivItemContainer"]')?.parentElement,
          document.querySelector('div.tiktok-x6f6za-DivContainer')
        ];
        
        for (const container of possibleContainers) {
          if (container) return container;
        }
        
        // Default fallback
        return document.body;
      };
      
      const tikTokContainer = findTikTokContainer();
      console.log('TikTok Container found:', tikTokContainer);
      
      // Store the target video position and element
      const targetVideoElement = document.querySelector('[data-e2e="feed-item"]:not([style*="display: none"])') || 
                                document.querySelector('[data-e2e="recommend-list-item-container"]') || 
                                document.querySelector('div[class*="DivItemContainer"]');
      
      console.log('Target video element:', targetVideoElement);
      
      let currentCount = 0;
      let isSwipingUp = true;
      
      // Function to find the best swipe target
      const findSwipeTarget = () => {
        // Try different selectors that might represent the swipeable area
        const selectors = [
          '[data-e2e="feed-item"]:not([style*="display: none"])',
          '[data-e2e="recommend-list-item-container"]',
          'div[class*="DivItemContainer"]',
          '.tiktok-x6f6za-DivContainer',
          '.swiper-slide',
          '.video-feed-item',
          // Add more potential selectors based on TikTok's structure
          '.video-card',
          '[class*="feed-item"]',
          '[class*="video-container"]'
        ];
        
        for (const selector of selectors) {
          const element = document.querySelector(selector);
          if (element) {
            console.log(`Found swipe target with selector: ${selector}`, element);
            return element;
          }
        }
        
        console.log('Falling back to document body for swipe target');
        return document.body;
      };
      
      // Try multiple approaches to simulate a swipe
      const simulateSwipe = (direction) => {
        const swipeTarget = findSwipeTarget();
        console.log(`Simulating ${direction} swipe on:`, swipeTarget);
        
        // Method 1: Use keyboard navigation
        if (direction === 'up') {
          // Next video (down/ArrowDown key might work on some versions)
          document.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'ArrowDown',
            code: 'ArrowDown',
            keyCode: 40,
            which: 40,
            bubbles: true
          }));
        } else {
          // Previous video (up/ArrowUp key)
          document.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'ArrowUp',
            code: 'ArrowUp',
            keyCode: 38,
            which: 38,
            bubbles: true
          }));
        }
        
        // Method 2: Programmatic scrolling
        if (direction === 'up') {
          // Scroll down (next video)
          window.scrollBy({
            top: window.innerHeight,
            behavior: 'smooth'
          });
          
          // Also try scrollIntoView on next item if present
          const nextItem = swipeTarget.nextElementSibling;
          if (nextItem) {
            nextItem.scrollIntoView({ behavior: 'smooth' });
          }
        } else {
          // Scroll up (previous video)
          window.scrollBy({
            top: -window.innerHeight,
            behavior: 'smooth'
          });
          
          // Also try scrollIntoView on previous item if present
          const prevItem = swipeTarget.previousElementSibling;
          if (prevItem) {
            prevItem.scrollIntoView({ behavior: 'smooth' });
          }
        }
        
        // Method 3: Click on navigation elements if present
        if (direction === 'up') {
          // Try to find and click "next" buttons
          const nextButtons = [
            document.querySelector('[data-e2e="arrow-right"]'),
            document.querySelector('.arrow-right'),
            document.querySelector('[class*="ArrowRight"]'),
            document.querySelector('[aria-label="Next"]'),
            document.querySelector('[aria-label="Next video"]')
          ];
          
          for (const btn of nextButtons) {
            if (btn) {
              console.log('Clicking next button:', btn);
              btn.click();
              break;
            }
          }
        } else {
          // Try to find and click "previous" buttons
          const prevButtons = [
            document.querySelector('[data-e2e="arrow-left"]'),
            document.querySelector('.arrow-left'),
            document.querySelector('[class*="ArrowLeft"]'),
            document.querySelector('[aria-label="Previous"]'),
            document.querySelector('[aria-label="Previous video"]')
          ];
          
          for (const btn of prevButtons) {
            if (btn) {
              console.log('Clicking previous button:', btn);
              btn.click();
              break;
            }
          }
        }
        
        // Method 4: Dispatch touch events (as a last resort)
        try {
          const rect = swipeTarget.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          
          let startY, endY;
          
          if (direction === 'up') {
            startY = rect.bottom - 50;
            endY = rect.top + 50;
          } else {
            startY = rect.top + 50;
            endY = rect.bottom - 50;
          }
          
          // Create touch points
          const touchObj = new Touch({
            identifier: Date.now(),
            target: swipeTarget,
            clientX: centerX,
            clientY: startY,
            pageX: centerX,
            pageY: startY,
            radiusX: 2.5,
            radiusY: 2.5,
            rotationAngle: 10,
            force: 0.5,
          });
          
          const touchEndObj = new Touch({
            identifier: Date.now(),
            target: swipeTarget,
            clientX: centerX,
            clientY: endY,
            pageX: centerX,
            pageY: endY,
            radiusX: 2.5,
            radiusY: 2.5,
            rotationAngle: 10,
            force: 0.5,
          });
          
          // Dispatch events
          swipeTarget.dispatchEvent(new TouchEvent('touchstart', {
            cancelable: true,
            bubbles: true,
            touches: [touchObj],
            targetTouches: [touchObj],
            changedTouches: [touchObj],
            view: window
          }));
          
          setTimeout(() => {
            swipeTarget.dispatchEvent(new TouchEvent('touchmove', {
              cancelable: true,
              bubbles: true,
              touches: [touchEndObj],
              targetTouches: [touchEndObj],
              changedTouches: [touchEndObj],
              view: window
            }));
            
            setTimeout(() => {
              swipeTarget.dispatchEvent(new TouchEvent('touchend', {
                cancelable: true,
                bubbles: true,
                touches: [],
                targetTouches: [],
                changedTouches: [touchEndObj],
                view: window
              }));
            }, 50);
          }, 50);
        } catch (e) {
          console.error('Error simulating touch events:', e);
        }
      };
      
      window.tikTokSwiperInterval = setInterval(() => {
        if (currentCount >= viewCount) {
          clearInterval(window.tikTokSwiperInterval);
          window.tikTokSwiperInterval = null;
          console.log('TikTok Auto Swiper: Completed');
          return;
        }
        
        if (isSwipingUp) {
          // Swipe up to next video
          console.log('Swiping UP to next video');
          simulateSwipe('up');
          isSwipingUp = false;
        } else {
          // Swipe down to return to target video
          console.log('Swiping DOWN to target video');
          simulateSwipe('down');
          isSwipingUp = true;
          currentCount++;
          console.log(`TikTok Auto Swiper: ${currentCount}/${viewCount} views`);
        }
      }, delayTime * 1000);
      
      // Create and show visual feedback
      const counterElement = document.createElement('div');
      counterElement.id = 'tikTokSwiperCounter';
      counterElement.style.position = 'fixed';
      counterElement.style.bottom = '20px';
      counterElement.style.right = '20px';
      counterElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      counterElement.style.color = 'white';
      counterElement.style.padding = '10px';
      counterElement.style.borderRadius = '5px';
      counterElement.style.zIndex = '9999';
      counterElement.style.fontFamily = 'Arial, sans-serif';
      document.body.appendChild(counterElement);
      
      function updateCounter() {
        if (document.getElementById('tikTokSwiperCounter')) {
          document.getElementById('tikTokSwiperCounter').textContent = 
            `Auto Swiping: ${currentCount}/${viewCount} views`;
        }
      }
      
      window.tikTokSwiperCounterInterval = setInterval(updateCounter, 500);
      updateCounter();
    }
    
    // Function to be injected into the page to stop swiping
    function stopSwiping() {
      if (window.tikTokSwiperInterval) {
        clearInterval(window.tikTokSwiperInterval);
        window.tikTokSwiperInterval = null;
      }
      
      if (window.tikTokSwiperCounterInterval) {
        clearInterval(window.tikTokSwiperCounterInterval);
        window.tikTokSwiperCounterInterval = null;
      }
      
      const counterElement = document.getElementById('tikTokSwiperCounter');
      if (counterElement) {
        counterElement.remove();
      }
      
      console.log('TikTok Auto Swiper: Stopped');
    }
  });