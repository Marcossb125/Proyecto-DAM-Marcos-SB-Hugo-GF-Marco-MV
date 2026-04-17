import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface CharacterBonus {
  name: string;
  value: string;
  icon: string;
  description: string;
  expanded?: boolean;
}

interface Character {
  id: number;
  name: string;
  rank: string;
  codename: string;
  description: string;
  avatar: string;
  bonuses: CharacterBonus[];
  specialty: string;
  selected: boolean;
}

@Component({
  selector: 'app-personajes',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './personajes.html',
  styleUrl: './personajes.css',
})
export class Personajes {
  characters = signal<Character[]>([
    {
      id: 1,
      name: 'VIKTOR DRAKOV',
      rank: 'CORONEL',
      codename: 'IRON WOLF',
      description: 'Veterano de mil batallas. Su presencia en el campo inspira a las tropas y refuerza las líneas defensivas con disciplina de acero.',
      avatar: '🐺',
      bonuses: [
        { name: 'Defensa', value: '+25%', icon: '🛡️', description: 'Reduce el daño recibido por tus unidades en combate directo.' },
        { name: 'Moral Tropa', value: '+15%', icon: '⭐', description: 'Aumenta la efectividad de tus tropas cuando están en inferioridad numérica.' },
        { name: 'Resistencia', value: '+20%', icon: '💪', description: 'Tus unidades aguantan más turnos antes de ser eliminadas.' },
      ],
      specialty: 'DEFENSA ESTRATÉGICA',
      selected: false,
    },
    {
      id: 2,
      name: 'ELENA VOSTOK',
      rank: 'COMANDANTE',
      codename: 'SHADOW HAWK',
      description: 'Maestra en operaciones encubiertas y ataques relámpago. Sus emboscadas son letales y sus movimientos imposibles de rastrear.',
      avatar: '🦅',
      bonuses: [
        { name: 'Ataque Furtivo', value: '+30%', icon: '🗡️', description: 'Incrementa el daño del primer ataque cuando no has sido detectado.' },
        { name: 'Velocidad', value: '+20%', icon: '⚡', description: 'Permite mover tus unidades más casillas por turno en el campo.' },
        { name: 'Evasión', value: '+15%', icon: '💨', description: 'Probabilidad de esquivar ataques enemigos por completo.' },
      ],
      specialty: 'OPERACIONES ENCUBIERTAS',
      selected: false,
    },
    {
      id: 3,
      name: 'MARCUS STEELE',
      rank: 'GENERAL',
      codename: 'THUNDER FIST',
      description: 'Experto en artillería pesada y asalto directo. Sus bombardeos devastadores arrasan posiciones enemigas sin piedad.',
      avatar: '💀',
      bonuses: [
        { name: 'Daño Artillería', value: '+35%', icon: '💣', description: 'Aumenta el daño de todos los ataques de área y bombardeos.' },
        { name: 'Alcance', value: '+20%', icon: '🎯', description: 'Extiende la distancia máxima de disparo de tus unidades de largo alcance.' },
        { name: 'Destrucción', value: '+25%', icon: '🔥', description: 'Incrementa el daño a edificios y fortificaciones enemigas.' },
      ],
      specialty: 'ARTILLERÍA PESADA',
      selected: false,
    },
    {
      id: 4,
      name: 'ARIA NOMURA',
      rank: 'CAPITANA',
      codename: 'VIPER QUEEN',
      description: 'Estratega brillante especializada en guerra tecnológica. Hackea sistemas enemigos y despliega drones de combate autónomos.',
      avatar: '🐍',
      bonuses: [
        { name: 'Tecnología', value: '+30%', icon: '🔬', description: 'Mejora la velocidad de investigación y desbloqueo de mejoras.' },
        { name: 'Intel Enemigo', value: '+25%', icon: '📡', description: 'Revela posiciones y movimientos del enemigo en el mapa táctico.' },
        { name: 'Drones', value: '+20%', icon: '🤖', description: 'Despliega drones autónomos que patrullan y atacan objetivos cercanos.' },
      ],
      specialty: 'GUERRA TECNOLÓGICA',
      selected: false,
    },
  ]);

  selectedCharacter = signal<Character | null>(null);

  constructor(private router: Router) {}

  selectCharacter(character: Character): void {
    const updated = this.characters().map((c) => ({
      ...c,
      selected: c.id === character.id,
    }));
    this.characters.set(updated);
    this.selectedCharacter.set(character);
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  logout(): void {
    this.router.navigate(['/login']);
    console.log('Cerrando sesión táctica...');
  }
}
