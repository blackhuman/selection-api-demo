import './styles.css';
import ZingTouch from 'zingtouch';
import { Recogito } from '@recogito/recogito-js';
import '@recogito/recogito-js/dist/recogito.min.css';

class SelectGesture extends ZingTouch.Gesture {
  constructor(bglayer) {
    super();
    this.bglayer = bglayer;
    this.ctx = bglayer.getContext('2d');
    this.ctx.fillStyle = 'green';
    this.selectRange = document.createRange();
    this.previouseRect = null;
  }

  firstTouchEvent(inputs) {
    return inputs[0].current.originalEvent;
  }

  firstTouchPosition(inputs) {
    let event = inputs[0].current;
    return [event.clientX, event.clientY];
  }

  getCaretInfo(inputs) {
    let [x, y] = this.firstTouchPosition(inputs);
    let range;
    let textNode;
    let offset;
    if (document.caretRangeFromPoint) {
      range = document.caretRangeFromPoint(x, y);
      textNode = range.startContainer;
      offset = range.startOffset;
      return range ? [textNode, offset] : null;
    } else if (document.caretPositionFromPoint) {
      range = document.caretPositionFromPoint(x, y);
      textNode = range.offsetNode;
      offset = range.offset;
      return range ? [textNode, offset] : null;
    }
  }

  fillRect(rect) {
    this.ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
  }

  clearRect(rect) {
    this.ctx.clearRect(rect.x, rect.y, rect.width, rect.height);
  }

  clearContext() {
    this.ctx.clearRect(0, 0, this.bglayer.width, this.bglayer.height);
  }

  clearPreviousRect() {
    if (this.previouseRect) {
      this.clearRect(this.previouseRect);
    }
  }

  fillSelectRangeRects() {
    let rects = this.selectRange.getClientRects();
    for (let rect of rects) {
      this.fillRect(rect);
    }
  }

  start(inputs) {
    let caretInfo = this.getCaretInfo(inputs);
    console.log('caretInfo', caretInfo);
    if(caretInfo == null) return;
    let [node, offset] = caretInfo
    this.selectRange.setStart(node, offset);
    this.clearContext();
    return null;
  }

  move(inputs) {
    let caretInfo = this.getCaretInfo(inputs);
    if(caretInfo == null) return;
    let [node, offset] = caretInfo
    this.selectRange.setEnd(node, offset);
    this.clearPreviousRect();
    this.previouseRect = this.selectRange.getBoundingClientRect();
    this.fillSelectRangeRects();
    return null;
  }

  end(inputs) {
    let caretInfo = this.getCaretInfo(inputs);
    if(caretInfo == null) return;
    let [node, offset] = caretInfo
    this.selectRange.setEnd(node, offset);
    console.log('string', this.selectRange.toString());
    this.clearContext();
    window
      .getSelection()
      .setBaseAndExtent(
        this.selectRange.startContainer,
        this.selectRange.startOffset,
        this.selectRange.endContainer,
        this.selectRange.endOffset
      );
    return null;
  }
}

let app = document.body;
let bglayer = document.createElement('canvas');
bglayer.id = 'bglayer';
bglayer.width = window.innerWidth;
bglayer.height = window.innerHeight;
document.body.appendChild(bglayer);
let touchRegion = new ZingTouch.Region(app, false, false);
touchRegion.unbind(document.body);
touchRegion.bind(document.body, new SelectGesture(bglayer), (event) => {
  console.log('event', event);
});
const r = new Recogito({ content: app });

r.on('selectAnnotation', a => {
  console.log('selected', a);
});

r.on('createAnnotation', a => {
  console.log('created', a);
});

r.on('updateAnnotation', (annotation, previous) => {
  console.log('updated', previous, 'with', annotation);
});

r.on('deleteAnnotation', a => {
  console.log('delete', a);
});
