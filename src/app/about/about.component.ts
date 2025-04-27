import { Component, OnInit, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements OnInit, AfterViewInit {
  // Flag to check if we're running in a browser
  isBrowser: boolean;
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
  
  ngOnInit(): void {
    // Any initialization that doesn't require DOM
  }
  
  ngAfterViewInit(): void {
    if (this.isBrowser) {
      // Initialize parallax effect for story section
      this.initParallaxEffect();
      
      // Make sure videos are properly loaded and playing
      this.initializeVideos();
    }
  }
  
  // Simple parallax effect for story videos
  private initParallaxEffect(): void {
    const storyVideo = document.querySelector('.story-video') as HTMLVideoElement;
    if (!storyVideo) return;
    
    window.addEventListener('scroll', () => {
      const scrollPosition = window.scrollY;
      if (storyVideo) {
        // Subtle parallax effect on the story video
        storyVideo.style.transform = `translateY(-${scrollPosition * 0.05}px) scale(1.01)`;
      }
    });
  }
  
  // Make sure all videos are properly loaded and playing
  private initializeVideos(): void {
    const videos = document.querySelectorAll('video') as NodeListOf<HTMLVideoElement>;
    
    if (!videos || videos.length === 0) {
      console.warn('No video elements found on the page');
      return;
    }
    
    console.log(`Found ${videos.length} videos to initialize`);
    
    videos.forEach((video, index) => {
      // Add preload attribute
      video.preload = 'auto';
      
      // Set playsinline attribute for iOS
      video.setAttribute('playsinline', '');
      
      // Log the video source for debugging
      const sources = video.querySelectorAll('source');
      if (sources.length) {
        console.log(`Video ${index} source: ${sources[0].src}`);
        console.log(`Video ${index} type: ${sources[0].type}`);
        
        sources[0].addEventListener('error', (e) => {
          console.error(`Error loading video source ${index}:`, e);
          console.error(`Failed URL: ${sources[0].src}`);
          this.handleVideoError(video, index);
        });
      } else {
        console.warn(`Video ${index} has no source elements`);
        this.handleVideoError(video, index);
      }
      
      // Ensure videos are loaded
      video.load();
      
      // Handle any loading errors
      video.addEventListener('error', (e) => {
        console.error(`Error loading video ${index}:`, e);
        // Get more details about the error
        console.error(`Error code: ${video.error?.code}`);
        console.error(`Error message: ${video.error?.message}`);
        this.handleVideoError(video, index);
      });
      
      // Debug event listener for when metadata is loaded
      video.addEventListener('loadedmetadata', () => {
        console.log(`Video ${index} metadata loaded successfully`);
        console.log(`Video ${index} duration: ${video.duration}s`);
        console.log(`Video ${index} dimensions: ${video.videoWidth}x${video.videoHeight}`);
      });
      
      // Try to play the video and handle any autoplay issues
      video.addEventListener('canplay', () => {
        console.log(`Video ${index} is ready to play`);
        
        // Try to play the video with error handling
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            console.log(`Video ${index} playing successfully`);
          }).catch(e => {
            console.error(`Error playing video ${index}:`, e);
            
            // Handle autoplay policy issues
            if (e.name === 'NotAllowedError') {
              console.warn(`Autoplay blocked for video ${index}, adding click-to-play`);
              // Create a play button for user interaction
              const parent = video.parentElement;
              if (parent) {
                const playButton = document.createElement('button');
                playButton.textContent = 'Play Video';
                playButton.className = 'video-play-button';
                playButton.style.position = 'absolute';
                playButton.style.zIndex = '10';
                playButton.style.top = '50%';
                playButton.style.left = '50%';
                playButton.style.transform = 'translate(-50%, -50%)';
                playButton.style.padding = '10px 20px';
                playButton.style.backgroundColor = '#ff4081';
                playButton.style.color = 'white';
                playButton.style.border = 'none';
                playButton.style.borderRadius = '4px';
                playButton.style.cursor = 'pointer';
                
                playButton.addEventListener('click', () => {
                  video.play().then(() => {
                    playButton.remove();
                  }).catch(err => {
                    console.error('Error playing video after click:', err);
                  });
                });
                
                parent.appendChild(playButton);
              }
            } else {
              this.handleVideoError(video, index);
            }
          });
        }
      });
    });
  }
  
  // Handle video errors with appropriate fallbacks
  private handleVideoError(video: HTMLVideoElement, index: number): void {
    // If video fails to load, add a fallback background color
    const parent = video.parentElement;
    if (!parent) return;
    
    // Add fallback styling
    parent.style.backgroundColor = 'var(--dark-color)';
    
    // Add a visual indicator for development purposes
    console.log(`Setting fallback for video ${index}`);
    
    // Add different fallback for different video positions
    if (video.classList.contains('hero-video')) {
      // Hero section fallback
      parent.style.backgroundImage = 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), url("/assets/image5.jpeg")';
      parent.style.backgroundSize = 'cover';
      parent.style.backgroundPosition = 'center';
    } else if (video.classList.contains('story-video')) {
      // Story section fallback
      parent.style.backgroundImage = 'url("/assets/about-img.jpeg")';
      parent.style.backgroundSize = 'cover';
      parent.style.backgroundPosition = 'center';
    } else if (video.classList.contains('gallery-video')) {
      // Gallery section fallback
      parent.style.backgroundImage = 'url("/assets/image1.jpeg")';
      parent.style.backgroundSize = 'cover';
      parent.style.backgroundPosition = 'center';
    }
    
    // Hide the video element to show the background
    video.style.display = 'none';
  }
}
