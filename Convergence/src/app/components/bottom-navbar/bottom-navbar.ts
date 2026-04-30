import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

interface NavItem {
  label: string;
  route: string;
  icon: string; // SVG path identifier
}

@Component({
  selector: 'app-bottom-navbar',
  templateUrl: './bottom-navbar.html',
  styleUrl: './bottom-navbar.css',
})
export class BottomNavbar {
  @Input() activePage: string = '';

  navItems: NavItem[] = [
    { label: 'Inicio', route: '/inicio', icon: 'home' },
    { label: 'Partidas', route: '/lobby', icon: 'play' },
    { label: 'Personajes', route: '/personajes', icon: 'user' },
    { label: 'Ranking', route: '/ranking', icon: 'list' },
    { label: 'Chat', route: '/chat', icon: 'chat' },
  ];

  constructor(private router: Router) {}

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  isActive(route: string): boolean {
    return this.activePage === route;
  }
}
