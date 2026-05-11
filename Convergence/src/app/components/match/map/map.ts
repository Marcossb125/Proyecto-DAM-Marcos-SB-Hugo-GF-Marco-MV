/* ═══════════════════════════════════════════════════════════════
   MAP COMPONENT — PixiJS Hex Grid Renderer with Viewport Camera
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

// Hex geometry constants — reduced for 41 hexes
const HEX_RADIUS = 42;
const HEX_WIDTH = Math.sqrt(3) * HEX_RADIUS;
const HEX_HEIGHT = 2 * HEX_RADIUS;

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
  isRefinery: boolean;
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
      touch-action: none;
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
  private viewport: any = null; // pixi-viewport Viewport
  private subscriptions: Subscription[] = [];
  private hexGraphics: Map<string, any> = new Map();
  private currentPhase: GamePhase = 'RECAUDACION';
  private selectedArmyId: string | null = null;
  private currentData: MapTerritoryData[] = [];
  private resizeObserver: ResizeObserver | null = null;
  private gridBgGraphics: any = null;
  private isFirstDraw = true;

  async ngAfterViewInit(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    await this.initPixi();
    this.setupStoreSubscriptions();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.app) {
      this.app.destroy(true);
    }
  }

  private async initPixi(): Promise<void> {
    // Dynamic import PixiJS and pixi-viewport to avoid SSR issues
    this.pixi = await import('pixi.js');
    const { Viewport } = await import('pixi-viewport');

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

    // Draw grid lines background (fixed, behind viewport)
    this.drawGridBackground(width, height);

    // Create viewport for camera controls
    this.viewport = new Viewport({
      screenWidth: width,
      screenHeight: height,
      worldWidth: 800,
      worldHeight: 800,
      events: this.app.renderer.events,
    });

    this.app.stage.addChild(this.viewport);

    // Configure viewport plugins
    this.viewport
      .drag({ mouseButtons: 'all' })  // Drag with any mouse button + touch
      .pinch()                          // Pinch zoom on mobile
      .wheel({ smooth: 5, percent: 0.08 })  // Mouse wheel zoom
      .clampZoom({ minScale: 0.25, maxScale: 2.5 });

    // Handle resize
    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0) {
          this.app.renderer.resize(w, h);
          this.viewport.resize(w, h);
          this.drawGridBackground(w, h);
        }
      }
    });
    this.resizeObserver.observe(container);
  }

  private drawGridBackground(width: number, height: number): void {
    if (!this.pixi || !this.app) return;

    // Remove old grid background if it exists
    if (this.gridBgGraphics) {
      if (this.gridBgGraphics.parent) {
        this.gridBgGraphics.parent.removeChild(this.gridBgGraphics);
      }
      this.gridBgGraphics.destroy();
    }

    this.gridBgGraphics = new this.pixi.Graphics();
    const gridColor = 0x00ff41;
    const gridAlpha = 0.04;

    // Vertical lines
    for (let x = 0; x < width; x += 30) {
      this.gridBgGraphics.moveTo(x, 0);
      this.gridBgGraphics.lineTo(x, height);
    }
    // Horizontal lines
    for (let y = 0; y < height; y += 30) {
      this.gridBgGraphics.moveTo(0, y);
      this.gridBgGraphics.lineTo(width, y);
    }
    this.gridBgGraphics.stroke({ width: 0.5, color: gridColor, alpha: gridAlpha });

    // Add at index 0 so it's behind the viewport
    this.app.stage.addChildAt(this.gridBgGraphics, 0);
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
      this.currentData = data;
      this.ngZone.runOutsideAngular(() => {
        this.drawGrid(data);
      });
    });
    this.subscriptions.push(mapSub);
  }

  private drawGrid(data?: MapTerritoryData[]): void {
    if (!this.app || !this.pixi || !this.viewport || !data || data.length === 0) return;

    // Clear previous hex graphics
    this.hexGraphics.forEach(g => {
      if (g.parent) g.parent.removeChild(g);
      g.destroy();
    });
    this.hexGraphics.clear();

    // Find grid bounds
    const allX = data.map(t => this.hexToPixelX(t.hexQ, t.hexR));
    const allY = data.map(t => this.hexToPixelY(t.hexR));
    const minX = Math.min(...allX);
    const maxX = Math.max(...allX);
    const minY = Math.min(...allY);
    const maxY = Math.max(...allY);

    const gridWidth = (maxX - minX) + HEX_WIDTH * 2;
    const gridHeight = (maxY - minY) + HEX_HEIGHT * 2;

    // Offset so hexes are drawn starting from a margin
    const offsetX = -minX + HEX_WIDTH;
    const offsetY = -minY + HEX_HEIGHT;

    // Draw all hexes into the viewport
    data.forEach(territory => {
      this.drawHex(territory, offsetX, offsetY);
    });

    // Update viewport world size
    this.viewport.worldWidth = gridWidth;
    this.viewport.worldHeight = gridHeight;

    // Update clamp to prevent panning too far
    // Remove previous clamp plugin if exists, then re-add
    if (this.viewport.plugins.get('clamp')) {
      this.viewport.plugins.remove('clamp');
    }
    this.viewport.clamp({
      left: -HEX_WIDTH,
      right: gridWidth + HEX_WIDTH,
      top: -HEX_HEIGHT,
      bottom: gridHeight + HEX_HEIGHT,
    });

    // On first draw, fit entire map in view and center
    if (this.isFirstDraw) {
      this.isFirstDraw = false;
      this.fitMapInView(gridWidth, gridHeight);
    }
  }

  /** Fit the entire map in the viewport and center it */
  private fitMapInView(gridWidth: number, gridHeight: number): void {
    if (!this.viewport) return;

    const screenW = this.viewport.screenWidth;
    const screenH = this.viewport.screenHeight;

    // Calculate scale to fit with 85% padding (leave room for HUD)
    const padding = 0.85;
    const scaleX = (screenW * padding) / gridWidth;
    const scaleY = (screenH * padding) / gridHeight;
    const scale = Math.min(scaleX, scaleY);

    this.viewport.setZoom(scale, true);
    this.viewport.moveCenter(gridWidth / 2, gridHeight / 2);
  }

  private hexToPixelX(q: number, r: number): number {
    return q * HEX_WIDTH + (r % 2 === 1 ? HEX_WIDTH * 0.5 : 0);
  }

  private hexToPixelY(r: number): number {
    return r * HEX_HEIGHT * 0.75;
  }

  private drawHex(territory: MapTerritoryData, offsetX: number, offsetY: number): void {
    const x = offsetX + this.hexToPixelX(territory.hexQ, territory.hexR);
    const y = offsetY + this.hexToPixelY(territory.hexR);

    const container = new this.pixi.Container();
    container.x = x;
    container.y = y;
    container.eventMode = 'static';
    container.cursor = 'pointer';

    // ── Draw hex shape ──
    const hexShape = new this.pixi.Graphics();
    const points = this.getHexPoints(0, 0, HEX_RADIUS - 2);

    // Fill color based on owner or refinery
    let fillColor = 0x1a1e14;
    let fillAlpha = 0.6;

    if (territory.isRefinery) {
      fillColor = 0x3d3000;
      fillAlpha = 0.5;
    } else if (territory.ownerColor) {
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
    } else if (territory.isRefinery) {
      borderColor = 0xffd700;
      borderWidth = 2;
      borderAlpha = 0.8;
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

    // ── Refinery indicator ──
    if (territory.isRefinery) {
      const refIcon = new this.pixi.Text({
        text: '⛽',
        style: { fontSize: 16, align: 'center' },
      });
      refIcon.anchor.set(0.5);
      refIcon.y = -HEX_RADIUS * 0.3;
      container.addChild(refIcon);

      // Golden glow ring
      const refGlow = new this.pixi.Graphics();
      refGlow.circle(0, -HEX_RADIUS * 0.3, 14);
      refGlow.stroke({ width: 1.5, color: 0xffd700, alpha: 0.4 });
      container.addChild(refGlow);
    }

    // ── Supreme Base indicator ──
    if (territory.hasSupremeBase && !territory.isRefinery) {
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
      bldgBadge.roundRect(-10, -6, 20, 12, 3);
      bldgBadge.fill({ color: 0x141614, alpha: 0.9 });
      bldgBadge.stroke({ width: 1, color: 0x4b5320, alpha: 0.8 });
      container.addChild(bldgBadge);

      const bldgText = new this.pixi.Text({
        text: this.getBuildingSymbol(territory.buildingType),
        style: {
          fontFamily: 'Inter, Arial, sans-serif',
          fontSize: 14,
          fill: 0x00ff41,
          align: 'center',
        },
      });
      bldgText.anchor.set(0.5);
      container.addChild(bldgText);
    }

    // ── Territory label ──
    const labelY = territory.hasSupremeBase || territory.isRefinery ? HEX_RADIUS * 0.4 : -HEX_RADIUS * 0.15;
    const label = new this.pixi.Text({
      text: territory.label,
      style: {
        fontFamily: 'Inter, sans-serif',
        fontSize: 10,
        fill: territory.isRefinery ? 0xffd700 : 0xe0e0e0,
        align: 'center',
        fontWeight: '600',
      },
    });
    label.anchor.set(0.5);
    label.y = labelY;
    container.addChild(label);

    // ── Army badge ──
    if (territory.army) {
      const armyY = HEX_RADIUS * 0.35;
      const badgeBg = new this.pixi.Graphics();
      badgeBg.roundRect(-15, armyY - 7, 30, 14, 3);
      const armyOwnerColor = territory.ownerColor ? this.parseColor(territory.ownerColor) : 0x00ff41;

      // Grey out if army already acted
      const actedAlpha = territory.army.hasActedThisTurn ? 0.4 : 0.9;

      badgeBg.fill({ color: 0x0a0b0a, alpha: actedAlpha });
      badgeBg.stroke({ width: 1.5, color: armyOwnerColor, alpha: territory.army.hasActedThisTurn ? 0.3 : 0.8 });
      container.addChild(badgeBg);

      const armyText = new this.pixi.Text({
        text: `⚔${territory.army.troopSize}`,
        style: {
          fontFamily: 'Inter, Arial, sans-serif',
          fontSize: 11,
          fill: armyOwnerColor,
          align: 'center',
          fontWeight: 'bold'
        },
      });
      armyText.anchor.set(0.5);
      armyText.y = armyY;
      armyText.alpha = territory.army.hasActedThisTurn ? 0.4 : 1;
      container.addChild(armyText);
    }

    // ── Click handler ──
    container.on('pointertap', () => {
      this.ngZone.run(() => {
        this.handleHexClick(territory);
      });
    });

    this.viewport.addChild(container);
    this.hexGraphics.set(territory.id, container);
  }

  private handleHexClick(territory: MapTerritoryData): void {
    // If in MOVIMIENTO and we have a selected army, and this is a highlighted territory
    if (this.currentPhase === 'MOVIMIENTO' && this.selectedArmyId && territory.isHighlighted) {
      // Move army action — handled by the match component via selector
      this.store.dispatch(MapActions.selectTerritory({ territoryId: territory.id }));
      return;
    }

    // If this territory has our army, select it (only if it hasn't acted this turn)
    if (territory.army && this.currentPhase === 'MOVIMIENTO' && !territory.army.hasActedThisTurn) {
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
