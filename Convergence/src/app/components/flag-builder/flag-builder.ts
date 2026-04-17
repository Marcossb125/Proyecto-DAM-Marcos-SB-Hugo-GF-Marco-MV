import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NationFlag, NationData } from '../nation-flag/nation-flag';

@Component({
  selector: 'app-flag-builder',
  standalone: true,
  imports: [FormsModule, NationFlag],
  templateUrl: './flag-builder.html',
  styleUrl: './flag-builder.css',
})
export class FlagBuilder {
  @Input() initialData: NationData | null = null;
  @Output() saveFlag = new EventEmitter<NationData>();
  @Output() cancel = new EventEmitter<void>();

  draftData: NationData = {
    nombre: 'Nueva Facción',
    layout: 'horizontal-3',
    colors: ['#2e7d32', '#ffffff', '#1b5e20']
  };

  layouts = [
    { value: 'horizontal-3', label: '3 Franjas Horizontales', colors: 3 },
    { value: 'horizontal-2', label: '2 Franjas Horizontales', colors: 2 },
    { value: 'vertical-3', label: '3 Franjas Verticales', colors: 3 },
    { value: 'vertical-2', label: '2 Franjas Verticales', colors: 2 },
    { value: 'diagonal', label: 'Diagonal 2 Colores', colors: 2 }
  ];

  ngOnInit() {
    if (this.initialData && this.initialData.layout) {
      this.draftData = JSON.parse(JSON.stringify(this.initialData));
    }
  }

  get neededColors(): number[] {
    const layoutConfig = this.layouts.find(l => l.value === this.draftData.layout);
    const count = layoutConfig ? layoutConfig.colors : 3;
    
    // Ensure draftData has exactly 'count' colors
    while(this.draftData.colors.length < count) {
       this.draftData.colors.push('#ffffff');
    }
    // Return an array [0, 1, ...] for iteration
    return Array(count).fill(0).map((x,i)=>i);
  }

  onSave() {
    // Truncate colors array to exactly the needed count
    const count = this.neededColors.length;
    this.draftData.colors = this.draftData.colors.slice(0, count);
    
    console.log('Bandera guardada (JSON):', JSON.stringify(this.draftData));
    this.saveFlag.emit(this.draftData);
  }

  onCancel() {
    this.cancel.emit();
  }
}
