import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MovieModel } from '../../models/movie.model';
import { MovieService } from '../../services/movie.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [NgIf, NgFor, MatCardModule, MatButtonModule, RouterLink, FormsModule],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.css'
})
export class MoviesComponent implements OnInit, OnDestroy {
  
  movies: MovieModel[] | null = null;
  filteredMovies: MovieModel[] | null = null;
  allMovies: MovieModel[] = [];
  genres: any[] = [];
  directors: any[] = [];
  actors: any[] = [];
  runtimes: number[] = [];
  
  isLoading: boolean = false;
  
  // Track if ratings have been generated
  private ratingsGenerated = false;
  // Destroy subject for unsubscribing from observables
  private destroy$ = new Subject<void>();
  // Subject for search input debouncing
  private searchTerms = new Subject<string>();

  selectedGenre: number | null = null;
  selectedDirector: number | null = null;
  selectedActor: number | null = null;
  selectedRuntime: number | null = null;
  searchQuery: string = '';
  minRating: number | null = null;
  
  constructor() {}
  
  ngOnInit() {
    // Setup debounced search
    this.searchTerms.pipe(
      takeUntil(this.destroy$),
      debounceTime(300) // Wait for 300ms after the last input
    ).subscribe(() => {
      this.searchMovies();
    });
    
    this.loadFilters();
    this.loadMovies();
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  // Method to handle search input changes
  onSearchChange() {
    this.searchTerms.next(this.searchQuery);
  }

  async loadFilters() {
    if (this.genres.length > 0) {
      // If filters are already loaded, don't reload
      return;
    }
    
    try {
      const [genresResponse, directorsResponse, actorsResponse, runtimesResponse] = await Promise.all([
        MovieService.getGenres(),
        MovieService.getDirectors(),
        MovieService.getActors(),
        MovieService.getRuntimes()
      ]);
      
      this.genres = genresResponse.data || [];
      this.directors = directorsResponse.data || [];
      this.actors = actorsResponse.data || [];
      this.runtimes = runtimesResponse.data || [];
    } catch (error) {
      console.error('Error loading filters:', error);
    }
  }

  async loadMovies() {
    try {
      if (this.isLoading) return;
      
      this.isLoading = true;
      const response = await MovieService.getMovies(0, 20); // Increase page size to reduce pagination needs
      
      if (response.data) {
        this.allMovies = response.data;
        
        // Add random ratings only once
        if (!this.ratingsGenerated) {
          this.allMovies.forEach(movie => {
            movie.rating = Math.round((Math.random() * 4 + 1) * 10) / 10;
          });
          this.ratingsGenerated = true;
        }
        
        this.movies = this.allMovies;
      }
    } catch (error) {
      console.error('Error loading movies:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async searchMovies() {
    // If all filters are empty, show all movies
    if (!this.selectedGenre && 
        !this.selectedDirector && 
        !this.selectedActor && 
        !this.selectedRuntime && 
        !this.searchQuery && 
        !this.minRating) {
      this.movies = this.allMovies;
      return;
    }
    
    try {
      this.isLoading = true;
      
      // Prefer client-side filtering when possible to reduce API calls
      if (this.allMovies.length > 0 && 
          (!this.selectedGenre && !this.selectedDirector && !this.selectedActor && !this.selectedRuntime)) {
        
        // Filter locally instead of making API call
        this.filteredMovies = [...this.allMovies];
        
        // Apply search filter locally if query is short
        if (this.searchQuery && this.searchQuery.length < 3) {
          const query = this.searchQuery.toLowerCase();
          this.filteredMovies = this.filteredMovies.filter(movie => 
            movie.title.toLowerCase().includes(query) || 
            movie.originalTitle.toLowerCase().includes(query) ||
            movie.shortDescription.toLowerCase().includes(query)
          );
        }
        
        // Apply rating filter locally
        if (this.minRating) {
          this.filteredMovies = this.filteredMovies.filter(movie => movie.rating >= this.minRating!);
        }
        
        this.movies = this.filteredMovies;
        this.isLoading = false;
        return;
      }
      
      // For more complex searches, use the API
      if (this.selectedGenre || this.selectedDirector || this.selectedActor || this.selectedRuntime || 
          (this.searchQuery && this.searchQuery.length >= 3)) {
        
        const filters: any = {};
        if (this.selectedGenre) filters.genre = this.selectedGenre;
        if (this.selectedDirector) filters.director = this.selectedDirector;
        if (this.selectedActor) filters.actor = this.selectedActor;
        if (this.selectedRuntime) filters.runtime = this.selectedRuntime;
        if (this.searchQuery && this.searchQuery.length >= 3) filters.search = this.searchQuery;
        
        const response = await MovieService.searchMovies(filters);
        this.filteredMovies = response.data || [];
        
        // Connect ratings from existing movies rather than regenerating
        if (this.filteredMovies && this.filteredMovies.length > 0) {
          this.filteredMovies.forEach(movie => {
            const existingMovie = this.allMovies.find(m => m.movieId === movie.movieId);
            if (existingMovie && existingMovie.rating) {
              movie.rating = existingMovie.rating;
            } else if (!movie.rating) {
              movie.rating = Math.round((Math.random() * 4 + 1) * 10) / 10;
            }
          });
        }
      } else {
        // If only rating filter is applied, filter locally
        this.filteredMovies = [...this.allMovies];
      }
      
      // Apply rating filter locally
      if (this.minRating && this.filteredMovies) {
        this.filteredMovies = this.filteredMovies.filter(movie => movie.rating >= this.minRating!);
      }
      
      this.movies = this.filteredMovies;
    } catch (error) {
      console.error('Error searching movies:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async resetSearch() {
    this.selectedActor = null;
    this.selectedGenre = null;
    this.selectedDirector = null;
    this.selectedRuntime = null;
    this.searchQuery = '';
    this.minRating = null;
    
    if (this.allMovies.length > 0) {
      this.movies = this.allMovies;
    } else {
      await this.loadMovies();
    }
  }
}
