import './styles.css';
import ZingTouch from 'zingtouch';

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
    let event = inputs[0].current.originalEvent;
    if (event instanceof PointerEvent) {
      return [event.clientX, event.clientY];
    } else if (event instanceof MouseEvent) {
      return [event.clientX, event.clientY];
    } else if (event instanceof TouchEvent) {
      let touches = event.changedTouches;
      let touch = touches[0];
      return [touch.clientX, touch.clientY];
    } else {
      return null;
    }
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
    } else if (document.caretPositionFromPoint) {
      range = document.caretPositionFromPoint(x, y);
      textNode = range.offsetNode;
      offset = range.offset;
    }
    return [textNode, offset];
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
    let [node, offset] = this.getCaretInfo(inputs);
    this.selectRange.setStart(node, offset);
    this.clearContext();
  }

  move(inputs) {
    let [node, offset] = this.getCaretInfo(inputs);
    this.selectRange.setEnd(node, offset);
    this.clearPreviousRect();
    this.previouseRect = this.selectRange.getBoundingClientRect();
    this.fillSelectRangeRects();
  }

  end(inputs) {
    let [node, offset] = this.getCaretInfo(inputs);
    this.selectRange.setEnd(node, offset);
    console.log('string', this.selectRange.toString());
    this.fillSelectRangeRects();
  }
}

let app = document.getElementById('app');
let bglayer = document.createElement('canvas');
bglayer.id = 'bglayer';
bglayer.width = window.innerWidth;
bglayer.height = window.innerHeight;
document.body.appendChild(bglayer);
let touchRegion = new ZingTouch.Region(app);
touchRegion.unbind(document.body);
touchRegion.bind(document.body, new SelectGesture(bglayer), (event) => {
  console.log('event', event);
});

// let selectRange = document.createRange();

// function getTouchPosition(event) {
//   if (event instanceof PointerEvent) {
//     return [event.clientX, event.clientY];
//   } else if (event instanceof MouseEvent) {
//     return [event.clientX, event.clientY];
//   } else if (event instanceof TouchEvent) {
//     let touches = event.changedTouches;
//     let touch = touches[0];
//     return [touch.clientX, touch.clientY];
//   } else {
//     return null;
//   }
// }

// function getCaretInfo(x, y) {
//   let range;
//   let textNode;
//   let offset;
//   if (document.caretRangeFromPoint) {
//     range = document.caretRangeFromPoint(x, y);
//     textNode = range.startContainer;
//     offset = range.startOffset;
//   } else if (document.caretPositionFromPoint) {
//     range = document.caretPositionFromPoint(x, y);
//     textNode = range.offsetNode;
//     offset = range.offset;
//   }
//   return [textNode, offset];
// }

// function fillRect(rect, ctx) {
//   ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
// }

// function clearRect(rect, ctx) {
//   ctx.clearRect(rect.x, rect.y, rect.width, rect.height);
// }

// function fillRangeRects(range, ctx) {
//   let rects = range.getClientRects();
//   for (let rect of rects) {
//     fillRect(rect, ctx);
//   }
// }

// let gestureProcessing = false;
// let previouseRect = null;

// document.body.onmousedown = (event) => {
//   console.log('touch start');
//   gestureProcessing = true;
//   let [x, y] = getTouchPosition(event);
//   let [node, offset] = getCaretInfo(x, y);
//   selectRange.setStart(node, offset);
//   let ctx = bglayer.getContext('2d');
//   ctx.clearRect(0, 0, bglayer.width, bglayer.height);
//   ctx.fillStyle = 'green';
// };

// document.body.onmousemove = (event) => {
//   if (!gestureProcessing) return;
//   let ctx = bglayer.getContext('2d');
//   if (previouseRect) {
//     clearRect(previouseRect, ctx);
//   }
//   let [x, y] = getTouchPosition(event);
//   let [node, offset] = getCaretInfo(x, y);
//   selectRange.setEnd(node, offset);
//   previouseRect = selectRange.getBoundingClientRect();
//   fillRangeRects(selectRange, ctx);
// };

// document.body.onmouseup = (event) => {
//   if (!gestureProcessing) return;
//   gestureProcessing = false;
//   console.log('touch end');
//   let [x, y] = getTouchPosition(event);
//   let [node, offset] = getCaretInfo(x, y);
//   selectRange.setEnd(node, offset);
//   console.log('string', selectRange.toString());
//   fillRangeRects(selectRange, bglayer.getContext('2d'));
// };
