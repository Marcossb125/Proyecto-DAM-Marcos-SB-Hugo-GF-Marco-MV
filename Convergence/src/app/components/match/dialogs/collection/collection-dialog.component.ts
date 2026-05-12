/* ═══════════════════════════════════════════════════════════════
   COLLECTION DIALOG — Auto-Collection Phase Popup
   ═══════════════════════════════════════════════════════════════ */

import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

export interface CollectionDialogData {
  playerName: string;
  playerColor: string;
  creditBonus: number;
  manpowerBonus: number;
  refineryBonus: number;
  totalCredits: number;
  totalManpower: number;
}

@Component({
  selector: 'app-collection-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule],
  templateUrl: './collection-dialog.component.html',
  styleUrls: ['./collection-dialog.component.css']
})
export class CollectionDialog implements OnInit, OnDestroy {
  readonly data: CollectionDialogData = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<CollectionDialog>);
  private autoCloseTimer: any;

  ngOnInit(): void {
    // Auto-close after 3 seconds
    this.autoCloseTimer = setTimeout(() => {
      this.onClose();
    }, 3000);
  }

  ngOnDestroy(): void {
    if (this.autoCloseTimer) {
      clearTimeout(this.autoCloseTimer);
    }
  }

  onClose(): void {
    if (this.autoCloseTimer) {
      clearTimeout(this.autoCloseTimer);
    }
    this.dialogRef.close();
  }
}
