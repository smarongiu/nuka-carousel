import React from 'react';

export const addAccessibility = (children, slidesToShow, currentSlide) => {
  let needsTabIndex;
  if (slidesToShow > 1) {
    return React.Children.map(children, (child, index) => {
      // create a range from first visible slide to last visible slide
      const firstVisibleSlide = index >= currentSlide;
      const lastVisibleSlide = index < slidesToShow + currentSlide;
      needsTabIndex = firstVisibleSlide && lastVisibleSlide;
      // if the index of the slide is in range add ariaProps to the slide
      const ariaProps = needsTabIndex
        ? { 'aria-hidden': 'false', tabIndex: 0 }
        : { 'aria-hidden': 'true' };
      return React.cloneElement(child, {
        ...child.props,
        ...ariaProps
      });
    });
  } else {
    // when slidesToshow is 1
    return React.Children.map(children, (child, index) => {
      needsTabIndex = index !== currentSlide;
      const ariaProps = needsTabIndex
        ? { 'aria-hidden': 'true' }
        : { 'aria-hidden': 'false', tabIndex: 0 };
      return React.cloneElement(child, {
        ...child.props,
        ...ariaProps
      });
    });
  }
};

export const getValidChildren = children => {
  // .toArray automatically removes invalid React children
  return React.Children.toArray(children);
};

const findMaxHeightSlide = slides => {
  let maxHeight = 0;
  for (let i = 0; i < slides.length; i++) {
    if (slides[i].offsetHeight > maxHeight) {
      maxHeight = slides[i].offsetHeight;
    }
  }
  return maxHeight;
};

const getCurrentSlideHeight = (state, { wrapAround }, childNodes) => {
  const { slidesToShow, currentSlide } = state;

  console.log('currentSlide', currentSlide);
  if (slidesToShow > 1 && !wrapAround) {
    let maxHeight = 0;
    let i;
    for (i = currentSlide; i < currentSlide + slidesToShow; i++) {
      if (childNodes[i].offsetHeight > maxHeight) {
        maxHeight = childNodes[i].offsetHeight;
      }
    }
    return maxHeight;
  } else if (slidesToShow > 1 && wrapAround) {
    //handle wraparound
    let maxHeight = 0;
    let i;
    for (i = currentSlide; i < currentSlide + slidesToShow; i++) {
      if (childNodes[i].offsetHeight > maxHeight) {
        maxHeight = childNodes[i].offsetHeight;
      }
    }
    return maxHeight;
  }
  return childNodes[currentSlide].offsetHeight;
};

export const getSlideHeight = (props, state, childNodes = []) => {
  const { heightMode, vertical, initialSlideHeight, wrapAround } = props;
  const { slidesToShow } = state;
  const firstSlide = childNodes[0];

  if (firstSlide && heightMode === 'first') {
    return vertical
      ? firstSlide.offsetHeight * slidesToShow
      : firstSlide.offsetHeight;
  }
  if (heightMode === 'max') {
    return findMaxHeightSlide(childNodes);
  }
  if (heightMode === 'current') {
    getCurrentSlideHeight(state, wrapAround, childNodes);
  }
  return initialSlideHeight || 100;
};
