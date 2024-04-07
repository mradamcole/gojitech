//Is an element visible in the viewport? (The element must be visible)
//Credit to: Prontera Marco, https://marco-prontera.medium.com/now-you-see-me-is-in-viewport-javascript-efa19b20b063
function isVisibleInViewport(element) {
  const elementStyle = window.getComputedStyle(element);
  //Particular cases when the element is not visible at all
  if (
    elementStyle.height == '0px' ||
    elementStyle.display == 'none' ||
    elementStyle.opacity == '0' ||
    elementStyle.visibility == 'hidden' ||
    elementStyle.clipPath == 'circle(0px at 50% 50%)' ||
    elementStyle.transform == 'scale(0)' ||
    element.hasAttribute('hidden')
  ) {
    return false;
  }

  const rect = element.getBoundingClientRect();

  //Overlapping strict check
  const baseElementLeft = rect.left;
  const baseElementTop = rect.top;

  const elementFromStartingPoint = document.elementFromPoint(baseElementLeft, baseElementTop);

  if (elementFromStartingPoint != null && !element.isSameNode(elementFromStartingPoint)) {
    const elementZIndex = elementStyle.zIndex;
    const elementOverlappingZIndex = window.getComputedStyle(elementFromStartingPoint).zIndex;
    if (Number(elementZIndex) < Number(elementOverlappingZIndex)) {
      return false;
    }

    if (elementZIndex === '' && elementOverlappingZIndex === '') {
      /**
          If two positioned elements overlap without a z-index specified, the element 
      positioned last in the HTML code will be shown on top 
          **/
      if (element.compareDocumentPosition(elementFromStartingPoint) & Node.DOCUMENT_POSITION_FOLLOWING) {
        return false;
      }
    }
  }

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

//Get the id of the last visible element whose class matches <className>
//  The element must still be visible.
let getLastOfVisibleClassInViewport = (className) => {
  let els = document.getElementsByClassName(className);
  let vis = "";
  for (var i = 0; i < els.length; i++) {
    let curElVis = isVisibleInViewport(els[i]);
    if (curElVis) { vis = els[i].id; }
    // if (vis != "" && curElVis == false) break
  }
  return vis;
}

//Get the id of the most recent visible element whose class matches <className>
//  The element no longer needs to be visible. That is, it may have scrolled off the top
//  Assumes the classNames.elements are sorted in order from top to bottom
//  Useful to mark the active navItem
let getLowestOfVisibleClassInViewport = (className) => {
  let vpBottom = document.documentElement.scrollTop + visualViewport.height; //Bottom of viewport = offset of top of viewport + height of viewport
  let els = document.getElementsByClassName(className);
  let vis = ""; //the lowest visible <className> element that's visible
  for (var i = 0; i < els.length; i++) {
    let curEl = els[i].getBoundingClientRect().top + document.documentElement.scrollTop; //Top of the current element = offset of top of viewport + offset from viewport top to element top
    vis = (curEl < vpBottom) ? els[i].id : vis; //Is the current element top above the bottom of the viewport? If so, then set vis to the current element
    if (vis != "" && curEl >= vpBottom) break;
  }
  return vis;
}

//Update the active navItem in the navbar
//  className is the className of the anchors (at the top of each section). navSystemName is the id of the navBar
let updateNavActiveItemRunning = false; //throttle updates as scrolling and resizing will fire events very rapidly
let updateNavActiveItem = (className, navSystemName) => {
  if (!updateNavActiveItemRunning) {
    updateNavActiveItemRunning = true;
    setTimeout(() => {
      let lowestEl = getLowestOfVisibleClassInViewport(className);
      updateNavActiveItemRunning = false;
      //Update the active navItem
      let items = document.querySelectorAll(`#${navSystemName} .nav-link`);
      items.forEach((item) => {
        let pos = item.outerHTML.replace(/\"/g, "'").indexOf(`'#${lowestEl}'`); //Does the item contain the className "#<lowestEl>"
        if (pos >= 0) {
          item.classList.add("active");
        } else {
          item.classList.remove('active');
        }
      })
    }, 100)
  };
}

let ScrollToVertical = (topPx) => {
  document.documentElement.scrollTo({
    top: topPx,
    behavior: "smooth",
  });
}