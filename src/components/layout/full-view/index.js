/* eslint-disable prettier/prettier */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View, Image, Dimensions, StyleSheet, ViewPropTypes } from 'react-native';
import { Rect } from 'react-native-svg';
import TYSdk from '../../../TYNativeApi';
import Strings from '../../../i18n/strings';
import TopBar from '../topbar';
import OfflineView from '../offline-view';
import { CoreUtils } from '../../../utils';

const TYMobile = TYSdk.mobile;
const TYNative = TYSdk.native;

let LinearGradient = View;
let RadialGradient = View;

if (TYMobile.verSupported('2.5')) {
  LinearGradient = require('../../gradient/linear-gradient').default;
  RadialGradient = require('../../gradient/radial-gradient').default;
}

const Window = Dimensions.get('window');
const Screen = Dimensions.get('screen');

export default class FullView extends Component {
  static propTypes = {
    title: PropTypes.string,
    style: ViewPropTypes.style,
    topbarStyle: ViewPropTypes.style,
    hideTopbar: PropTypes.bool,
    showMenu: PropTypes.bool,
    // backgroundStyle: PropTypes.oneOfType([ViewPropTypes.style, Image.propTypes.style]),
    background: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    onBack: PropTypes.func,
    devInfo: PropTypes.object.isRequired,
  };

  static defaultProps = {
    title: '',
    style: null,
    topbarStyle: null,
    hideTopbar: false,
    showMenu: true,
    background: null,
    onBack: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      // background: props.background,
    };
  }

  onBack = tab => {
    if (!this.props.onBack || !this.props.onBack()) {
      if (tab === 'right') {
        TYNative.showDeviceMenu();
      } else {
        TYNative.back();
      }
    }
  };

  get topBarMoreIconName() {
    const { devInfo = {} } = this.props;
    return (
      (devInfo &&
        devInfo.panelConfig &&
        devInfo.panelConfig.fun &&
        devInfo.panelConfig.fun.topBarMoreIconName) ||
      'pen'
    );
  }

  renderBackground() {
    const { backgroundStyle, background } = this.props;
    // const { background } = this.state;

    if (typeof background === 'number') {
      return (
        <Image
          fadeDuration={0}
          ref={ref => {
            this.refBackground = ref;
          }}
          style={[styles.background, backgroundStyle]}
          source={background}
        />
      );
    }

    if (typeof background === 'object') {
      const { uri, stops, ...others } = background;

      // 添加网络图片背景的支持
      if (uri) {
        return (
          <Image
            fadeDuration={0}
            ref={ref => {
              this.refBackground = ref;
            }}
            style={[styles.background, backgroundStyle]}
            source={{ uri }}
            {...others}
          />
        );
      }

      if (CoreUtils.isArray(stops)) {
        return (
          <RadialGradient
            ref={ref => {
              this.refBackground = ref;
            }}
            style={[styles.gradientStyle, backgroundStyle]}
            {...others}
            stops={stops}
          />
        );
      }

      const { x1, y1, x2, y2, ...ostops } = background;
      return (
        <LinearGradient
          ref={ref => {
            this.refBackground = ref;
          }}
          style={[styles.gradientStyle, backgroundStyle]}
          stops={ostops}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
        >
          <Rect x="0" y="0" height={Screen.height} width={Screen.width} />
        </LinearGradient>
      );
    }

    return null;
  }

  renderOfflineView() {
    const { appOnline, deviceOnline, showOfflineView } = this.props;
    const show = !appOnline || !deviceOnline;
    const tipText = !appOnline
      ? Strings.getLang('appoffline')
      : !deviceOnline
        ? Strings.getLang('offline')
        : '';

    if (!show) {
      return null;
    }

    if (showOfflineView === undefined) {
      return null;
    }

    if (showOfflineView === false) {
      return null;
    }

    return (
      <OfflineView style={styles.offlineStyle} textStyle={styles.offlineText} text={tipText} />
    );
  }

  renderTopBar() {
    const {
      title,
      topbarStyle,
      hideTopbar,
      renderTopBar,
      topbarTextStyle,
      devInfo = {},
    } = this.props;
    const { isShare } = this.state;

    if (!hideTopbar) {
      if (renderTopBar) {
        return renderTopBar();
      }
      const uiPhase = devInfo.uiPhase || 'release';
      const { color = '#fff' } = StyleSheet.flatten(topbarTextStyle) || {};
      const isShowMore = !(isShare || !this.props.showMenu);
      const actions = [
        {
          name: this.topBarMoreIconName,
          onPress: () => this.onBack('right'),
        },
        uiPhase !== 'release' && {
          style: {
            backgroundColor: '#57DD43',
            borderWidth: 1,
          },
          contentStyle: { fontSize: 12 },
          color: '#000',
          source: 'Preview',
          disabled: true,
        },
      ].filter(v => !!v);
      return (
        <TopBar
          style={topbarStyle}
          title={title}
          titleStyle={topbarTextStyle}
          color={color}
          actions={isShowMore ? actions : null}
          onBack={() => this.onBack('left')}
        />
      );
    }

    return null;
  }

  renderStatusBar() {
    const { renderStatusBar } = this.props;

    if (renderStatusBar) {
      return renderStatusBar();
    }

    return null;
  }

  render() {
    const { style, background } = this.props;
    return (
      <View
        ref={ref => {
          this.refRootView = ref;
        }}
        style={[styles.container, style]}
      >
        {this.renderStatusBar()}
        {!!background && this.renderBackground()}
        {this.renderTopBar()}
        {this.props.children}
        {this.renderOfflineView()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  background: {
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    resizeMode: 'stretch',
    width: Screen.width,
    height: Screen.height,
  },

  offlineStyle: {
    width: Screen.width,
    height: Screen.height - TopBar.height,
    position: 'absolute',
    top: TopBar.height,
  },

  offlineText: {
    paddingBottom: TopBar.height * 2,
  },

  gradientStyle: {
    width: Screen.width,
    height: Screen.height,
  },
});
