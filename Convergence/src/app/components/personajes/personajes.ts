import { Component, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TopActions } from '../top-actions/top-actions';
import { BottomNavbar } from '../bottom-navbar/bottom-navbar';
import { Banner } from '../banner/banner';
import { AuthService } from '../../servicios/auth.service';
import { UserService } from '../../servicios/user.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

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
  standalone: true,
  imports: [MatButtonModule, MatIconModule, BottomNavbar, Banner, TopActions, MatSnackBarModule, CommonModule],
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
      bonuses: [{ name: 'Ataque Furtivo', value: '+1 casilla', icon: '🗡️', description: 'Aumenta el alcance de las tropas al desplazarse.' },

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
      bonuses: [{ name: 'Defensa', value: '+10', icon: '🛡️', description: 'Aumenta la defensa de los territorios del jugador.' },

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
        { name: 'Daño Artillería', value: '+10', icon: '💣', description: 'Aumenta el daño inflingido al atacar.' },
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
        { name: 'Economia', value: '+5%', icon: '🔬', description: 'Aumenta la ganancia de recursos.' }
      ],
      specialty: 'GUERRA TECNOLÓGICA',
      selected: false,
    },
  ]);

  selectedCharacter = signal<Character | null>(null);
  confirmed = signal<boolean>(false);
  confirmedCharacterId = signal<number | null>(null);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    if (this.route.snapshot.queryParamMap.get('needLobbySetup') === 'general') {
      this.snackBar.open(
        'Para entrar al lobby debes elegir y confirmar un general.',
        'Entendido',
        { duration: 6000 }
      );
      void this.router.navigate(['/personajes'], { replaceUrl: true, queryParams: {} });
    }

    const nickname = this.authService.obtenerNombreUsuario();
    if (nickname) {
      this.userService.obtenerGeneral(nickname).subscribe({
        next: (res) => {
          if (res && res.generalId) {
            const char = this.characters().find(c => c.id === res.generalId);
            if (char) {
              this.selectCharacter(char);
              this.confirmedCharacterId.set(char.id);
              this.confirmed.set(true);
            }
          }
        },
        error: (err) => console.error('Error al cargar general:', err)
      });
    }
  }

  selectCharacter(character: Character): void {
    const updated = this.characters().map((c) => ({
      ...c,
      selected: c.id === character.id,
    }));
    this.characters.set(updated);
    this.selectedCharacter.set(character);
    this.confirmed.set(false);
  }

  confirmarSeleccion(): void {
    const char = this.selectedCharacter();
    const nickname = this.authService.obtenerNombreUsuario();

    if (!char || !nickname) return;

    this.userService.guardarGeneral(nickname, char.id).subscribe({
      next: () => {
        this.confirmed.set(true);
        this.confirmedCharacterId.set(char.id);
      },
      error: (err) => {
        console.error('Error al guardar general:', err);
        this.snackBar.open('Error al confirmar el operativo', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
