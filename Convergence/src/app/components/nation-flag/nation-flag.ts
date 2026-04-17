import { Component, Input } from '@angular/core';

export interface NationData {
  nombre: string;
  layout: string;
  colors: string[];
}

@Component({
  selector: 'app-nation-flag',
  imports: [],
  templateUrl: './nation-flag.html',
  styleUrl: './nation-flag.css',
})
export class NationFlag {
  @Input() width = '60px';
  @Input() height = '40px';
  
  private _flagData: NationData = { nombre: '', layout: 'horizontal-3', colors: ['#ff0000', '#ffffff', '#0000ff'] };
  
  @Input()
  set flagData(value: NationData | null | undefined) {
    if (value) {
      this._flagData = value;
    }
  }
  get flagData(): NationData {
    return this._flagData;
  }

  get flagBackground(): string {
    const layout = this.flagData.layout;
    const colors = this.flagData.colors;

    if (!colors || colors.length === 0) return '#333';

    switch (layout) {
      case 'horizontal-3':
        return `linear-gradient(to bottom, ${colors[0]} 33.33%, ${colors[1] || colors[0]} 33.33%, ${colors[1] || colors[0]} 66.66%, ${colors[2] || colors[0]} 66.66%)`;
      case 'horizontal-2':
        return `linear-gradient(to bottom, ${colors[0]} 50%, ${colors[1] || colors[0]} 50%)`;
      case 'vertical-3':
        return `linear-gradient(to right, ${colors[0]} 33.33%, ${colors[1] || colors[0]} 33.33%, ${colors[1] || colors[0]} 66.66%, ${colors[2] || colors[0]} 66.66%)`;
      case 'vertical-2':
        return `linear-gradient(to right, ${colors[0]} 50%, ${colors[1] || colors[0]} 50%)`;
      case 'diagonal':
        return `linear-gradient(135deg, ${colors[0]} 50%, ${colors[1] || colors[0]} 50%)`;
      default:
        return colors[0];
    }
  }
}
