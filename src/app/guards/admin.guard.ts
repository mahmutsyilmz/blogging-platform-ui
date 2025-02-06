// admin.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import jwt_decode, { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub: string;
  userId: string;
  role: Array<{ authority: string }>;
  exp: number;
}

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const token = localStorage.getItem('token');
  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  try {
    const decoded: JwtPayload = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      router.navigate(['/login']);
      return false;
    }
    const isAdmin = decoded.role.some(r => r.authority === 'ROLE_ADMIN');
    if (!isAdmin) {
      // admin değilse posts ekranına yönlendiriyoruz
      router.navigate(['/posts']);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Token decode error:', error);
    router.navigate(['/login']);
    return false;
  }
};