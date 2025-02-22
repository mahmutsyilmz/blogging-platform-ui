import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  
  if (token) {
    // Token mevcutsa erişime izin ver
    return true;
  } else {
    // Token yoksa login sayfasına yönlendir
    router.navigate(['/login']);
    return false;
  }
};
