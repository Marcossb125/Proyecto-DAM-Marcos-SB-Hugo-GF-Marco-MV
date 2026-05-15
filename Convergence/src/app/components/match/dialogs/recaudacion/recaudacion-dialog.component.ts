import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface RecaudacionDialogData {
  round: number;
  myIncome: {
    creditsGained: number;
    manpowerGained: number;
    totalCredits: number;
    totalManpower: number;
    territories: number;
    refineries: number;
    fabricas: number;
    cuarteles: number;
  } | null;
}

@Component({
  selector: 'app-recaudacion-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule, MatButtonModule],
  templateUrl: './recaudacion-dialog.html',
  styleUrls: ['./recaudacion-dialog.css']
})
export class RecaudacionDialogComponent {
  readonly data: RecaudacionDialogData = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<RecaudacionDialogComponent>);

  onClose(): void {
    this.dialogRef.close();
  }
}
