import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  public formatDate(iso : string){
    return new Date(iso).toLocaleString('sr-RS')
  }

  /**
   * Returns the current day number (1-31)
   */
  public getCurrentDay(): number {
    return new Date().getDate();
  }

  /**
   * Returns tomorrow's day number (1-31)
   */
  public getTomorrowDay(): number {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.getDate();
  }

  /**
   * Returns the day after tomorrow's day number (1-31)
   */
  public getDayAfterTomorrow(): number {
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    return dayAfterTomorrow.getDate();
  }

  /**
   * Gets a formatted date string based on the selectedDate value
   * @param selectedDate 'danas' | 'sutra' | 'prekosutra'
   * @returns Formatted date string
   */
  public getFormattedDateFromSelection(selectedDate: string): string {
    let date = new Date();
    
    if (selectedDate === 'sutra') {
      date.setDate(date.getDate() + 1);
    } else if (selectedDate === 'prekosutra') {
      date.setDate(date.getDate() + 2);
    }
    
    return date.toLocaleDateString('sr-RS');
  }

}
