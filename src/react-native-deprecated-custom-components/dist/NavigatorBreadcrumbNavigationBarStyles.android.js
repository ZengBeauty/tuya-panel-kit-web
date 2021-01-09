const NavigatorNavigationBarStylesAndroid = require('./NavigatorNavigationBarStylesAndroid');
const buildStyleInterpolator = require('./buildStyleInterpolator');
const merge = require('./merge');

const NAV_BAR_HEIGHT = NavigatorNavigationBarStylesAndroid.General.NavBarHeight;
const SPACING = 8;
const ICON_WIDTH = 40;
const SEPARATOR_WIDTH = 9;
const CRUMB_WIDTH = ICON_WIDTH + SEPARATOR_WIDTH;
const NAV_ELEMENT_HEIGHT = NAV_BAR_HEIGHT;
const OPACITY_RATIO = 100;
const ICON_INACTIVE_OPACITY = 0.6;
const MAX_BREADCRUMBS = 10;
const CRUMB_BASE = {
  position: 'absolute',
  flexDirection: 'row',
  top: 0,
  width: CRUMB_WIDTH,
  height: NAV_ELEMENT_HEIGHT,
  backgroundColor: 'transparent',
};
const ICON_BASE = { width: ICON_WIDTH, height: NAV_ELEMENT_HEIGHT };
const SEPARATOR_BASE = { width: SEPARATOR_WIDTH, height: NAV_ELEMENT_HEIGHT };
const TITLE_BASE = {
  position: 'absolute',
  top: 0,
  height: NAV_ELEMENT_HEIGHT,
  backgroundColor: 'transparent',
  alignItems: 'flex-start',
};
const FIRST_TITLE_BASE = merge(TITLE_BASE, { left: 0, right: 0 });
const RIGHT_BUTTON_BASE = {
  position: 'absolute',
  top: 0,
  right: 0,
  overflow: 'hidden',
  opacity: 1,
  height: NAV_ELEMENT_HEIGHT,
  backgroundColor: 'transparent',
};
const LEFT = [];
const CENTER = [];
const RIGHT = [];
for (let i = 0; i < MAX_BREADCRUMBS; i++) {
  const crumbLeft = CRUMB_WIDTH * i + SPACING;
  LEFT[i] = {
    Crumb: merge(CRUMB_BASE, { left: crumbLeft }),
    Icon: merge(ICON_BASE, { opacity: ICON_INACTIVE_OPACITY }),
    Separator: merge(SEPARATOR_BASE, { opacity: 1 }),
    Title: merge(TITLE_BASE, { left: crumbLeft, opacity: 0 }),
    RightItem: merge(RIGHT_BUTTON_BASE, { opacity: 0 }),
  };
  CENTER[i] = {
    Crumb: merge(CRUMB_BASE, { left: crumbLeft }),
    Icon: merge(ICON_BASE, { opacity: 1 }),
    Separator: merge(SEPARATOR_BASE, { opacity: 0 }),
    Title: merge(TITLE_BASE, { left: crumbLeft + ICON_WIDTH, opacity: 1 }),
    RightItem: merge(RIGHT_BUTTON_BASE, { opacity: 1 }),
  };
  const crumbRight = crumbLeft + 50;
  RIGHT[i] = {
    Crumb: merge(CRUMB_BASE, { left: crumbRight }),
    Icon: merge(ICON_BASE, { opacity: 0 }),
    Separator: merge(SEPARATOR_BASE, { opacity: 0 }),
    Title: merge(TITLE_BASE, { left: crumbRight + ICON_WIDTH, opacity: 0 }),
    RightItem: merge(RIGHT_BUTTON_BASE, { opacity: 0 }),
  };
}
CENTER[0] = {
  Crumb: merge(CRUMB_BASE, { left: SPACING + CRUMB_WIDTH }),
  Icon: merge(ICON_BASE, { opacity: 0 }),
  Separator: merge(SEPARATOR_BASE, { opacity: 0 }),
  Title: merge(FIRST_TITLE_BASE, { opacity: 1 }),
  RightItem: CENTER[0].RightItem,
};
LEFT[0].Title = merge(FIRST_TITLE_BASE, { opacity: 0 });
RIGHT[0].Title = merge(FIRST_TITLE_BASE, { opacity: 0 });
const buildIndexSceneInterpolator = function buildIndexSceneInterpolator(startStyles, endStyles) {
  return {
    Crumb: buildStyleInterpolator({
      left: {
        type: 'linear',
        from: startStyles.Crumb.left,
        to: endStyles.Crumb.left,
        min: 0,
        max: 1,
        extrapolate: true,
      },
    }),
    Icon: buildStyleInterpolator({
      opacity: {
        type: 'linear',
        from: startStyles.Icon.opacity,
        to: endStyles.Icon.opacity,
        min: 0,
        max: 1,
      },
    }),
    Separator: buildStyleInterpolator({
      opacity: {
        type: 'linear',
        from: startStyles.Separator.opacity,
        to: endStyles.Separator.opacity,
        min: 0,
        max: 1,
      },
    }),
    Title: buildStyleInterpolator({
      opacity: {
        type: 'linear',
        from: startStyles.Title.opacity,
        to: endStyles.Title.opacity,
        min: 0,
        max: 1,
      },
      left: {
        type: 'linear',
        from: startStyles.Title.left,
        to: endStyles.Title.left,
        min: 0,
        max: 1,
        extrapolate: true,
      },
    }),
    RightItem: buildStyleInterpolator({
      opacity: {
        type: 'linear',
        from: startStyles.RightItem.opacity,
        to: endStyles.RightItem.opacity,
        min: 0,
        max: 1,
        round: OPACITY_RATIO,
      },
    }),
  };
};
const Interpolators = CENTER.map(function(_, ii) {
  return {
    RightToCenter: buildIndexSceneInterpolator(RIGHT[ii], CENTER[ii]),
    CenterToLeft: buildIndexSceneInterpolator(CENTER[ii], LEFT[ii]),
    RightToLeft: buildIndexSceneInterpolator(RIGHT[ii], LEFT[ii]),
  };
});
module.exports = {
  Interpolators,
  Left: LEFT,
  Center: CENTER,
  Right: RIGHT,
  IconWidth: ICON_WIDTH,
  IconHeight: NAV_BAR_HEIGHT,
  SeparatorWidth: SEPARATOR_WIDTH,
  SeparatorHeight: NAV_BAR_HEIGHT,
};
