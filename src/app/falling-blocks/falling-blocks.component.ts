
import { Component, OnDestroy, ViewChild, ElementRef, AfterViewInit, HostListener, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { FallingBlock } from './falling-block.class';
import { BlockData, ResponsiveDimensions, LandedBlockInfo } from './falling-block.interfaces';


@Component({
  selector: 'app-falling-blocks',
  templateUrl: './falling-blocks.component.html',
  styleUrl: './falling-blocks.component.css',
  encapsulation: ViewEncapsulation.None
})

export class FallingBlocksComponent implements OnDestroy, AfterViewInit {
  @ViewChild('container', { static: true }) containerRef!: ElementRef<HTMLDivElement>;

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

  private readonly blockData: BlockData[] = [
    { text: 'DEVELOPER', width: 0.8, linkText: 'PROJECTS', link: '/projects' },
    { text: 'STACK', width: 0.5, linkText: 'LINKEDIN', link: 'https://www.linkedin.com/in/alison-forster-a45681172' },
    { text: 'FULL', width: 0.4, linkText: 'EMAIL', link: '/email' },
    { text: 'FORSTER', width: 0.7, linkText: 'RESUME', link: '/resume' },
    { text: 'ALISON', width: 0.6, linkText: 'ABOUT', link: '/about' }
  ];

  constructor(private cdr: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    this.calculateDimensions();
    this.cdr.detectChanges();
    this.start();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    console.log("resize");
    this.reset();
    this.calculateDimensions();

    this.cdr.detectChanges();
    this.start();
  }

  private calculateDimensions(): void {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Container takes up most of the viewport but leaves some margin
    const containerWidth = Math.min(viewportWidth * 0.9, viewportHeight * 0.8);
    const containerHeight = viewportHeight * 0.8;

    // Scale everything based on container size
    const scale = containerWidth / 500; // 500 was our original container width

    this.dimensions = {
      containerWidth: containerWidth,
      containerHeight: containerHeight,
      blockHeight: 54 * scale,
      fontSize: 54 * scale,
      padding: 15 * scale,
      margin: 10 * scale
    };

    const container = this.containerRef.nativeElement;
    container.style.width = this.dimensions.containerWidth + 'px';
    container.style.height = (this.dimensions.containerHeight + 300) + 'px';
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  start(): void {
    if (this.animationId) return;

    console.log('Starting animation...');
    this.isAnimating = true;
    this.animate();
  }

  reset(): void {
    this.cleanup();

    // Remove all block elements
    const allElements = this.containerRef.nativeElement.querySelectorAll('.block');
    allElements.forEach(element => {
      element.remove();
    });

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
        console.log(`Creating block ${this.currentBlockIndex}`);
        const block = new FallingBlock(
          this.containerRef.nativeElement,
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

    // Continue animation if not all blocks are landed or we haven't released all blocks
    if (!allLanded || this.currentBlockIndex < 5) {
      this.animationId = requestAnimationFrame(() => this.animate());
    } else {
      this.animationId = null;
      this.isAnimating = false;
      console.log('Animation complete');
    }
  }
}


