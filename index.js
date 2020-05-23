import React, { useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

function Picker({
  // Required
  data = [{ label: "None", value: "" }],
  label,
  labelField = "label",
  placeholder = "Press to select",
  title = "Picker",
  value,
  valueField = "value",
  // Toggle
  canTouchOutside = true,
  caretPng,
  caretSvg: Svg,
  disabled,
  error = false,
  withLine,
  // Custom style
  height = 50,
  modalElevation = 10,
  modalRadius = 10,
  overlayOpacity = 0.0,
  pickerElevation = 2,
  pickerRadius = 5,
  spacing = 0,
  width = "auto",
  // Prop override
  listProps,
  listItemProps,
  modalProps,
  pickerProps,
  // Style override
  style,
  caretStyle,
  itemTextStyle,
  labelStyle,
  lineStyle,
  listContentStyle,
  listSeparatorStyle,
  listStyle,
  listTitleStyle,
  modalStyle,
  overlayStyle,
  textStyle,
  // Callback function
  onChange,
  onClose,
  ...rest
}) {
  // ========== States ========== //
  const [touched, setTouched] = useState(false);
  const [visible, setVisible] = useState(false);

  // ========== Style Override ========== //
  const containerStyleOverride = StyleSheet.flatten([
    styles.container,
    {
      height,
      width,
      borderRadius: pickerRadius,
      elevation: pickerElevation,
      marginBottom: spacing,
    },
    style,
  ]);
  const caretStyleOverride = StyleSheet.flatten([
    styles.caret,
    { transform: visible ? [{ rotate: "180deg" }] : [] },
    caretStyle,
  ]);
  const itemTextStyleOverride = StyleSheet.flatten([
    styles.itemText,
    itemTextStyle,
  ]);
  const labelStyleOverride = StyleSheet.flatten([styles.label, labelStyle]);
  const lineStyleOverride = StyleSheet.flatten([
    styles.line,
    { backgroundColor: error ? "red" : "rgba(0, 0, 0, 0.2" },
    lineStyle,
  ]);
  const listContentStyleOverride = StyleSheet.flatten([
    styles.list,
    listContentStyle,
  ]);
  const listSeparatorStyleOverride = StyleSheet.flatten([
    styles.listSeparator,
    listSeparatorStyle,
  ]);
  const listTitleStyleOverride = StyleSheet.flatten([
    styles.listTitle,
    {
      borderBottomColor: withLine ? "black" : "rgba(0, 0, 0, 0.2)",
      borderBottomWidth: withLine ? 5 : 1,
    },
    listTitleStyle,
  ]);
  const modalStyleOverride = StyleSheet.flatten([
    styles.modal,
    {
      borderTopLeftRadius: modalRadius,
      elevation: modalElevation,
      borderTopRightRadius: modalRadius,
    },
    modalStyle,
  ]);
  const overlayStyleOverride = StyleSheet.flatten([
    styles.overlay,
    {
      backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`,
    },
    overlayStyle,
  ]);
  const textStyleOverride = StyleSheet.flatten([
    styles.text,
    { color: touched ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0.4)" },
    textStyle,
  ]);

  let selected;
  if (data.length > 0) {
    const v = data.find((i) => i[valueField] === value);
    if (v) {
      selected = v[labelField];
    }
  }

  // ========== Handlers ========== //
  const _handleClose = () => {
    setVisible(false);
    onClose && onClose();
  };

  const _handleItemPress = (item, index) => {
    if (!item?.[valueField]) {
      setTouched(false);
    }
    setVisible(false);
    !disabled && onChange && onChange(item, index);
  };

  // ========== Renderers ========== //
  const _renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => _handleItemPress(item, index)}
        {...listItemProps}
      >
        <Text numberOfLines={1} style={itemTextStyleOverride}>
          {`${item?.[labelField] ?? index}`}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <TouchableOpacity
      style={containerStyleOverride}
      onPress={(e) => {
        !touched && setTouched(true);
        !visible && setVisible(true);
      }}
      {...pickerProps}
    >
      <>
        {touched && label ? (
          <Text style={labelStyleOverride}>{label}</Text>
        ) : null}
        <Text numberOfLines={1} style={textStyleOverride}>
          {selected || placeholder}
        </Text>
        {Svg ? (
          <Svg style={caretStyleOverride} />
        ) : (
          <Image
            source={caretPng ? caretPng : require("./assets/caret.png")}
            style={caretStyleOverride}
          />
        )}
        {withLine && <View style={lineStyleOverride} />}
        <Modal
          animationType="fade"
          hardwareAccelerated
          presentationStyle="overFullScreen"
          transparent
          visible={visible && data?.length > 0}
          onRequestClose={_handleClose}
          {...modalProps}
        >
          <View style={overlayStyleOverride}>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.overlayTouchable}
              onPress={() => canTouchOutside && _handleClose()}
            />
            <View style={modalStyleOverride}>
              <Text style={listTitleStyleOverride}>{title}</Text>
              <FlatList
                data={data}
                keyExtractor={(item, index) =>
                  `${item?.[valueField || "id"] ?? index}`
                }
                contentContainerStyle={listContentStyleOverride}
                style={listStyle}
                renderItem={_renderItem}
                ItemSeparatorComponent={() => (
                  <View style={listSeparatorStyleOverride} />
                )}
                {...listProps}
              />
            </View>
          </View>
        </Modal>
      </>
    </TouchableOpacity>
  );
}

// ========== Styling ========== //
const styles = StyleSheet.create({
  caret: {
    position: "absolute",
    marginVertical: "auto",
    right: 10,
  },
  container: {
    alignSelf: "stretch",
    justifyContent: "center",
    backgroundColor: "white",
  },
  itemText: {
    color: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 10,
    paddingVertical: 15,
    textAlign: "center",
  },
  label: {
    paddingHorizontal: 10,
    fontSize: 14,
    color: "black",
    marginVertical: 3,
  },
  line: {
    height: 5,
    width: "100%",
    position: "absolute",
    bottom: 0,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 59,
  },
  listSeparator: {
    height: 0.5,
    alignSelf: "stretch",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  listTitle: {
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "stretch",
    textAlign: "center",
    color: "rgba(0, 0, 0, 0.8)",
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  modal: {
    backgroundColor: "white",
  },
  overlay: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  overlayTouchable: {
    flex: 1,
  },
  text: {
    fontFamily: "sans-serif",
    fontSize: 14,
    paddingHorizontal: 15,
    marginRight: 28,
    textAlignVertical: "center",
  },
});

export { Picker };
export default Picker;
