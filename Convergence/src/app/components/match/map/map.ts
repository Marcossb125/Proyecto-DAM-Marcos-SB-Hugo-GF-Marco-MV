/* ═══════════════════════════════════════════════════════════════
   MAP COMPONENT — PixiJS Hex Grid Renderer
   ═══════════════════════════════════════════════════════════════ */

import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  inject,
  PLATFORM_ID,
  NgZone,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { MapActions } from '../store/match.actions';
import { selectMapRenderData, selectPhase, selectSelectedArmyId } from '../store/match.selectors';
import { Territory, Army, GamePhase } from '../store/match.state';

// Hex geometry constants
const HEX_RADIUS = 60;
const HEX_WIDTH = Math.sqrt(3) * HEX_RADIUS;
const HEX_HEIGHT = 2 * HEX_RADIUS;
const GRID_OFFSET_X = 160;
const GRID_OFFSET_Y = 120;

interface MapTerritoryData {
  id: string;
  label: string;
  ownerId: string | null;
  hasSupremeBase: boolean;
  buildingType: string | null;
  occupiedByArmyId: string | null;
  hexQ: number;
  hexR: number;
  adjacentIds: string[];
  army: Army | null;
  ownerColor: string | null;
  ownerName: string | null;
  isHighlighted: boolean;
  isSelected: boolean;
}

@Component({
  selector: 'app-map',
  standalone: true,
  template: `<div #mapContainer class="map-container"></div>`,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      position: relative;
    }

    .map-container {
      width: 100%;
      height: 100%;
      background: #0a0b0a;
      position: relative;
    }

    .map-container canvas {
      display: block;
    }
  `],
})
export class MapComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef<HTMLDivElement>;

  private readonly store = inject(Store);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ngZone = inject(NgZone);

  private app: any = null; // PixiJS Application
  private pixi: any = null; // PixiJS module reference
  private subscriptions: Subscription[] = [];
  private hexGraphics: Map<string, any> = new Map();
  private currentPhase: GamePhase = 'RECAUDACION';
  private selectedArmyId: string | null = null;

  async ngAfterViewInit(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    await this.initPixi();
    this.setupStoreSubscriptions();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
    if (this.app) {
      this.app.destroy(true);
    }
  }

  private async initPixi(): Promise<void> {
    // Dynamic import PixiJS to avoid SSR issues
    this.pixi = await import('pixi.js');

    const container = this.mapContainer.nativeElement;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    this.app = new this.pixi.Application();
    await this.app.init({
      width,
      height,
      backgroundColor: 0x0a0b0a,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });

    container.appendChild(this.app.canvas);

    // Handle resize
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0) {
          this.app.renderer.resize(w, h);
          this.drawGrid();
        }
      }
    });
    resizeObserver.observe(container);

    // Draw grid lines background
    this.drawGridBackground(width, height);
  }

  private drawGridBackground(width: number, height: number): void {
    if (!this.pixi || !this.app) return;

    const gridBg = new this.pixi.Graphics();
    const gridColor = 0x00ff41;
    const gridAlpha = 0.04;

    // Vertical lines
    for (let x = 0; x < width; x += 30) {
      gridBg.moveTo(x, 0);
      gridBg.lineTo(x, height);
    }
    // Horizontal lines
    for (let y = 0; y < height; y += 30) {
      gridBg.moveTo(0, y);
      gridBg.lineTo(width, y);
    }
    gridBg.stroke({ width: 0.5, color: gridColor, alpha: gridAlpha });

    this.app.stage.addChild(gridBg);
  }

  private setupStoreSubscriptions(): void {
    // Subscribe to phase changes
    const phaseSub = this.store.select(selectPhase).subscribe(phase => {
      this.currentPhase = phase;
    });
    this.subscriptions.push(phaseSub);

    // Subscribe to selected army
    const armySub = this.store.select(selectSelectedArmyId).subscribe(armyId => {
      this.selectedArmyId = armyId;
    });
    this.subscriptions.push(armySub);

    // Subscribe to map render data
    const mapSub = this.store.select(selectMapRenderData).subscribe(data => {
      this.ngZone.runOutsideAngular(() => {
        this.drawGrid(data);
      });
    });
    this.subscriptions.push(mapSub);
  }

  private drawGrid(data?: MapTerritoryData[]): void {
    if (!this.app || !this.pixi || !data) return;

    // Clear previous hex graphics
    this.hexGraphics.forEach(g => {
      if (g.parent) g.parent.removeChild(g);
      g.destroy();
    });
    this.hexGraphics.clear();

    // Calculate center offset based on canvas size
    const canvasW = this.app.renderer.width / (window.devicePixelRatio || 1);
    const canvasH = this.app.renderer.height / (window.devicePixelRatio || 1);

    // Find grid bounds
    const maxQ = Math.max(...data.map(t => t.hexQ));
    const maxR = Math.max(...data.map(t => t.hexR));
    const gridWidth = (maxQ + 1) * HEX_WIDTH + HEX_WIDTH * 0.5;
    const gridHeight = (maxR + 1) * HEX_HEIGHT * 0.75 + HEX_HEIGHT * 0.25;

    const offsetX = (canvasW - gridWidth) / 2 + HEX_WIDTH * 0.5;
    const offsetY = (canvasH - gridHeight) / 2 + HEX_RADIUS;

    data.forEach(territory => {
      this.drawHex(territory, offsetX, offsetY);
    });
  }

  private drawHex(territory: MapTerritoryData, offsetX: number, offsetY: number): void {
    const { hexQ, hexR } = territory;

    // Offset hex coordinates
    const x = offsetX + hexQ * HEX_WIDTH + (hexR % 2 === 1 ? HEX_WIDTH * 0.5 : 0);
    const y = offsetY + hexR * HEX_HEIGHT * 0.75;

    const container = new this.pixi.Container();
    container.x = x;
    container.y = y;
    container.eventMode = 'static';
    container.cursor = 'pointer';

    // ── Draw hex shape ──
    const hexShape = new this.pixi.Graphics();
    const points = this.getHexPoints(0, 0, HEX_RADIUS - 2);

    // Fill color based on owner
    let fillColor = 0x1a1e14;
    let fillAlpha = 0.6;

    if (territory.ownerColor) {
      fillColor = this.parseColor(territory.ownerColor);
      fillAlpha = 0.25;
    }

    // Draw filled hex
    hexShape.poly(points);
    hexShape.fill({ color: fillColor, alpha: fillAlpha });

    // Border
    let borderColor = 0x3a3d2e;
    let borderWidth = 1.5;
    let borderAlpha = 0.8;

    if (territory.isSelected) {
      borderColor = 0x00ff41;
      borderWidth = 3;
      borderAlpha = 1;
    } else if (territory.isHighlighted) {
      borderColor = 0x00ff41;
      borderWidth = 2.5;
      borderAlpha = 0.9;
    } else if (territory.ownerColor) {
      borderColor = this.parseColor(territory.ownerColor);
      borderWidth = 2;
      borderAlpha = 0.7;
    }

    hexShape.poly(points);
    hexShape.stroke({ width: borderWidth, color: borderColor, alpha: borderAlpha });

    container.addChild(hexShape);

    // ── Highlight glow effect ──
    if (territory.isHighlighted) {
      const glow = new this.pixi.Graphics();
      glow.poly(this.getHexPoints(0, 0, HEX_RADIUS + 3));
      glow.stroke({ width: 1.5, color: 0x00ff41, alpha: 0.3 });
      container.addChild(glow);
    }

    // ── Selected pulsing ring ──
    if (territory.isSelected) {
      const selRing = new this.pixi.Graphics();
      selRing.poly(this.getHexPoints(0, 0, HEX_RADIUS + 5));
      selRing.stroke({ width: 1, color: 0x00ff41, alpha: 0.5 });
      container.addChild(selRing);
    }

    // ── Supreme Base indicator ──
    if (territory.hasSupremeBase) {
      const baseIcon = new this.pixi.Graphics();
      // Draw a small star/diamond
      baseIcon.star(0, -HEX_RADIUS * 0.3, 5, 8, 4);
      baseIcon.fill({ color: 0xffd700, alpha: 0.9 });
      baseIcon.stroke({ width: 1, color: 0xffd700, alpha: 0.6 });
      container.addChild(baseIcon);

      // Glow ring for supreme base
      const baseGlow = new this.pixi.Graphics();
      baseGlow.circle(0, -HEX_RADIUS * 0.3, 12);
      baseGlow.stroke({ width: 1, color: 0xffd700, alpha: 0.3 });
      container.addChild(baseGlow);
    }

    // ── Building icon ──
    if (territory.buildingType) {
      const bldgBadge = new this.pixi.Graphics();
      bldgBadge.roundRect(-12, -8, 24, 16, 3);
      bldgBadge.fill({ color: 0x141614, alpha: 0.9 });
      bldgBadge.stroke({ width: 1, color: 0x4b5320, alpha: 0.8 });
      container.addChild(bldgBadge);

      const bldgText = new this.pixi.Text({
        text: this.getBuildingSymbol(territory.buildingType),
        style: {
          fontFamily: 'Press Start 2P, monospace',
          fontSize: 8,
          fill: 0x00ff41,
          align: 'center',
        },
      });
      bldgText.anchor.set(0.5);
      container.addChild(bldgText);
    }

    // ── Territory label ──
    const label = new this.pixi.Text({
      text: territory.label,
      style: {
        fontFamily: 'Inter, sans-serif',
        fontSize: 9,
        fill: 0xe0e0e0,
        align: 'center',
        fontWeight: '600',
      },
    });
    label.anchor.set(0.5);
    label.y = territory.hasSupremeBase ? HEX_RADIUS * 0.1 : -HEX_RADIUS * 0.15;
    container.addChild(label);

    // ── Army badge ──
    if (territory.army) {
      const armyY = HEX_RADIUS * 0.35;
      const badgeBg = new this.pixi.Graphics();
      badgeBg.roundRect(-18, armyY - 9, 36, 18, 3);
      const armyOwnerColor = territory.ownerColor ? this.parseColor(territory.ownerColor) : 0x00ff41;
      badgeBg.fill({ color: 0x0a0b0a, alpha: 0.9 });
      badgeBg.stroke({ width: 1.5, color: armyOwnerColor, alpha: 0.8 });
      container.addChild(badgeBg);

      const armyText = new this.pixi.Text({
        text: `⚔${territory.army.troopSize}`,
        style: {
          fontFamily: 'Press Start 2P, monospace',
          fontSize: 7,
          fill: armyOwnerColor,
          align: 'center',
        },
      });
      armyText.anchor.set(0.5);
      armyText.y = armyY;
      container.addChild(armyText);
    }

    // ── Click handler ──
    container.on('pointertap', () => {
      this.ngZone.run(() => {
        this.handleHexClick(territory);
      });
    });

    this.app.stage.addChild(container);
    this.hexGraphics.set(territory.id, container);
  }

  private handleHexClick(territory: MapTerritoryData): void {
    // If in MOVIMIENTO and we have a selected army, and this is a highlighted territory
    if (this.currentPhase === 'MOVIMIENTO' && this.selectedArmyId && territory.isHighlighted) {
      // Move army action — handled by the match component via selector
      this.store.dispatch(MapActions.selectTerritory({ territoryId: territory.id }));
      return;
    }

    // If this territory has our army, select it
    if (territory.army && this.currentPhase === 'MOVIMIENTO') {
      this.store.dispatch(MapActions.selectArmy({ armyId: territory.army.id }));
      return;
    }

    // Default: select territory
    this.store.dispatch(MapActions.selectTerritory({ territoryId: territory.id }));
  }

  private getHexPoints(cx: number, cy: number, radius: number): number[] {
    const points: number[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 180) * (60 * i - 30);
      points.push(cx + radius * Math.cos(angle));
      points.push(cy + radius * Math.sin(angle));
    }
    return points;
  }

  private parseColor(hex: string): number {
    return parseInt(hex.replace('#', ''), 16);
  }

  private getBuildingSymbol(type: string): string {
    const symbols: Record<string, string> = {
      CUARTEL: '🏛',
      FABRICA: '⚙',
      TORRE: '📡',
      MURO: '🛡',
    };
    return symbols[type] ?? '?';
  }
}
