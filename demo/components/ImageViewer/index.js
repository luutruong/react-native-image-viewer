var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import React from 'react';
import { Modal, Dimensions, VirtualizedList, Platform } from 'react-native';
import Image from './Image';
var SCREEN_WIDTH = Dimensions.get('window').width;
var ImageViewer = /** @class */ (function (_super) {
    __extends(ImageViewer, _super);
    function ImageViewer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            scrollEnabled: true,
            isZooming: false,
        };
        _this._scrollRef = React.createRef();
        _this._closeInternal = function () { return _this.props.onClose(); };
        _this._renderImage = function (info) {
            var _a, _b, _c;
            return (<Image source={info.item.source} title={info.item.title} onClose={_this._closeInternal} onZoomStateChange={_this._onZoomStateChange} imageIndex={info.index} imagesTotal={_this._getItemCount()} 
            // extendable props
            debug={_this.props.debug} initialWidth={(_a = _this.props.imageProps) === null || _a === void 0 ? void 0 : _a.initialWidth} initialHeight={(_b = _this.props.imageProps) === null || _b === void 0 ? void 0 : _b.initialHeight} renderFooter={(_c = _this.props.imageProps) === null || _c === void 0 ? void 0 : _c.renderFooter}/>);
        };
        _this._onZoomStateChange = function (isZooming) {
            _this._scrollRef.current.getScrollRef().setNativeProps({
                scrollEnabled: !isZooming,
            });
        };
        _this._getItemCount = function () { return _this.props.images.length; };
        _this._getItem = function (data, index) { return data[index]; };
        _this._getItemLayout = function (_data, index) { return ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index: index,
        }); };
        _this._keyExtractor = function (_item, index) { return "".concat(index); };
        return _this;
    }
    ImageViewer.prototype.render = function () {
        var platformProps = Platform.select({
            ios: {
                bounces: false,
                directionalLockEnabled: true,
            },
            android: {},
        });
        return (<Modal visible={this.props.visible} transparent animationType={this.props.animationType} onRequestClose={this._closeInternal}>
        <VirtualizedList horizontal showsHorizontalScrollIndicator={false} windowSize={2} data={this.props.images} renderItem={this._renderImage} keyExtractor={this._keyExtractor} getItemCount={this._getItemCount} getItem={this._getItem} getItemLayout={this._getItemLayout} scrollEnabled ref={this._scrollRef} removeClippedSubviews={true} maxToRenderPerBatch={2} initialNumToRender={2} updateCellsBatchingPeriod={100} pagingEnabled initialScrollIndex={this.props.initialIndex} listKey={'RNImageViewer'} {...platformProps}/>
      </Modal>);
    };
    ImageViewer.defaultProps = {
        animationType: 'none',
    };
    return ImageViewer;
}(React.Component));
export default ImageViewer;
