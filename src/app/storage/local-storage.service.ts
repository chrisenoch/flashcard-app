import { Injectable } from '@angular/core';
import { LocalStorageId } from '../models/types/localStorageId';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}

  store(id: LocalStorageId, infoToStore: any) {
    localStorage.setItem(id, JSON.stringify(infoToStore));
  }

  fetch(id: LocalStorageId) {
    const itemExists = localStorage.getItem(id);
    if (itemExists) {
      return JSON.parse(itemExists);
    } else {
      return null;
    }
  }

  remove(id: LocalStorageId) {
    localStorage.removeItem(id);
  }
}
