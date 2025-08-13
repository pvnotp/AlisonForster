import {
  Component, OnDestroy, AfterViewInit, ChangeDetectorRef, ViewEncapsulation,
  Input, Renderer2, ElementRef, NgZone
} from '@angular/core';
import { FallingBlock } from './falling-block.class';
import { BlockData, ResponsiveDimensions, LandedBlockInfo } from './falling-block.interfaces';

@Component({
  selector: 'app-falling-blocks',
  template: '',
  styleUrl: './falling-blocks.component.scss',
  standalone: true,
  encapsulation: ViewEncapsulation.None
})
export class FallingBlocksComponent implements OnDestroy, AfterViewInit {
  @Input({ required: true }) blockData!: BlockData[]; 

  private ro?: ResizeObserver;
  private resizeRaf?: number;

  private blocks: FallingBlock[] = [];
  private landedBlocks: LandedBlockInfo[] = [];
  private animationId: number | null = null;
  private currentBlockIndex = 0;
  private blockReleaseTimer = 0;
  private readonly blockReleaseInterval = 10;

  public isAnimating = false;
  public dimensions: ResponsiveDimensions = {
    containerWidth: 500,
    containerHeight: 600,
    blockHeight: 54,
    fontSize: 54,
    padding: 15,
    margin: 10
  };

  private readonly BASE_WIDTH = 500;
  private readonly RUNWAY = 400;

  constructor(
    private cdr: ChangeDetectorRef,
    private r2: Renderer2,
    private host: ElementRef<HTMLElement>,
    private zone: NgZone
  ) { }

  ngAfterViewInit(): void {
    const hostEl = this.host.nativeElement;
    const parent = hostEl.parentElement ?? hostEl;

    // Initial compute
    const rect = parent.getBoundingClientRect();
    this.applyDimensionsFrom(rect.width, rect.height);
    this.cdr.detectChanges();
    this.start();

    // Observe parent for size changes
    this.zone.runOutsideAngular(() => {
      this.ro = new ResizeObserver(entries => {
        const { width, height } = entries[0].contentRect;
        if (this.resizeRaf) cancelAnimationFrame(this.resizeRaf);
        this.resizeRaf = requestAnimationFrame(() => {
          this.zone.run(() => {
            this.onParentResize(width, height);
          });
        });
      });
      this.ro.observe(parent);
    });
  }

  ngOnDestroy(): void {
    if (this.ro) this.ro.disconnect();
    if (this.resizeRaf) cancelAnimationFrame(this.resizeRaf);
    this.cleanup();
  }

  /** Parent size changed */
  private onParentResize(parentWidth: number, parentHeight: number) {
    this.reset();
    this.applyDimensionsFrom(parentWidth, parentHeight);
    this.cdr.detectChanges();
    this.start();
  }

  /** Compute + apply dimensions based on parent size */
  private applyDimensionsFrom(parentWidth: number, parentHeight: number): void {
    const containerWidth = Math.min(parentWidth, parentHeight);
    const containerHeight = parentHeight;

    const scale = containerWidth / this.BASE_WIDTH;

    this.dimensions = {
      containerWidth,
      containerHeight,
      blockHeight: 54 * scale,
      fontSize: 54 * scale,
      padding: 15 * scale,
      margin: 10 * scale
    };

    const el = this.host.nativeElement;

    // CSS custom properties
    this.r2.setStyle(el, '--container-width', `${containerWidth}px`);
    this.r2.setStyle(el, '--container-height', `${containerHeight}px`);
    this.r2.setStyle(el, '--block-height', `${this.dimensions.blockHeight}px`);
    this.r2.setStyle(el, '--font-size', `${this.dimensions.fontSize}px`);
    this.r2.setStyle(el, '--padding', `${this.dimensions.padding}px`);
    this.r2.setStyle(el, '--margin', `${this.dimensions.margin}px`);

    // Actual layout size
    this.r2.setStyle(el, 'width', `${containerWidth}px`);
    this.r2.setStyle(el, 'height', `${containerHeight + this.RUNWAY}px`);
    this.r2.setStyle(el, 'transform', `translateY(-${this.RUNWAY}px)`);
  }

  // ==== animation lifecycle ====

  start(): void {
    if (this.animationId) return;
    this.isAnimating = true;
    this.animate();
  }

  reset(): void {
    this.cleanup();

    // Remove all block elements appended to host
    const allElements = this.host.nativeElement.querySelectorAll('.block');
    allElements.forEach(el => el.remove());

    this.blocks = [];
    this.landedBlocks = [];
    this.currentBlockIndex = 0;
    this.blockReleaseTimer = 0;
    this.isAnimating = false;
  }

  private cleanup(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  private animate(): void {
    // Release new blocks at intervals
    if (this.currentBlockIndex < this.blockData.length) {
      if (this.blockReleaseTimer % this.blockReleaseInterval === 0) {
        const block = new FallingBlock(
          this.host.nativeElement,
          this.currentBlockIndex,
          this.landedBlocks,
          this.blockData,
          this.dimensions
        );
        this.blocks.push(block);
        this.currentBlockIndex++;
      }
      this.blockReleaseTimer++;
    }

    // Update all blocks
    let allLanded = true;
    this.blocks.forEach(block => {
      block.update();
      if (!block.isLanded) allLanded = false;
    });

    if (!allLanded || this.currentBlockIndex < 5) {
      this.animationId = requestAnimationFrame(() => this.animate());
    } else {
      this.animationId = null;
      this.isAnimating = false;
    }
  }
}
