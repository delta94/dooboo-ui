import { EmitterSubscription, FlatList, Keyboard, ListRenderItem, TextInput, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';

import styled from 'styled-components/native';

const StyledKeyboardAvoidingView = styled.KeyboardAvoidingView`
  flex: 1;
  justify-content: center;
  align-self: stretch;
  flex-direction: column;
  align-items: center;
`;

const StyledViewChat = styled.View`
  width: 100%;
  border-top-width: 0.5px;
  min-height: 52px;
  max-height: 52px;
  padding-right: 8px;
  padding-left: 8px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex: 1;
`;

const StyledInputChat = styled.TextInput`
  width: 80%;
  font-size: 14px;
  margin-right: 20px;
  padding-left: 48px;
  color: black;
`;

const StyledTouchMenu = styled.TouchableOpacity`
  position: absolute;
  left: 10px;
  height: 100%;
  min-width: 20px;
  justify-content: center;
`;

const StyledViewBottom = styled.View`
  position: absolute;
  bottom: 0px;
  width: 100%;
`;

const StyledViewMenu = styled.View<{ height: number }>`
  flex-direction: row;
  flex-wrap: wrap;
  height: ${({ height }): number => height}px;
`;

interface Props {
  inputTestID?: string;
  touchTestID?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chats?: any;
  borderColor?: string;
  backgroundColor?: string;
  fontColor?: string;
  keyboardOffset?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderItem: ListRenderItem<any>;
  optionView?: React.ReactElement;
  emptyItem?: React.ReactElement;
  renderViewMenu?: () => React.ReactElement;
  message?: string;
  onChangeMessage?: (text: string) => void;
  placeholder?: string;
  placeholderTextColor?: string;
  renderSendButton?: () => React.ReactElement;
}

function Shared(props: Props): React.ReactElement {
  let keyboardShowListener: EmitterSubscription;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const input1 = useRef<TextInput>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const input2 = useRef<TextInput>();

  const {
    inputTestID,
    touchTestID,
    chats,
    borderColor,
    backgroundColor,
    fontColor,
    keyboardOffset,
    renderItem,
    emptyItem,
    renderViewMenu,
    optionView,
    message,
    onChangeMessage,
    placeholder,
    placeholderTextColor,
    renderSendButton,
  } = props;

  const [keyboardHeight, setKeyboardHeight] = useState<number>(258);
  const [showMenu, setShowMenu] = useState<boolean>(false);

  useEffect(() => {
    if (showMenu) {
      Keyboard.dismiss();
    } else {
      if (input1 && input1.current) {
        input1.current.focus();
      }
    }
  }, [showMenu]);

  useEffect(() => {
    keyboardShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    return (): void => {
      if (keyboardShowListener) {
        keyboardShowListener.remove();
      }
    };
  });

  return (
    <>
      <StyledKeyboardAvoidingView
        keyboardVerticalOffset={keyboardOffset}
        behavior={'padding'}
      >
        <FlatList
          style={{ alignSelf: 'stretch' }}
          // prettier-ignore
          contentContainerStyle={
            chats.length === 0
              ? {
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }
              : null
          }
          keyExtractor={(item, index): string => index.toString()}
          data={chats}
          renderItem={renderItem}
          ListEmptyComponent={emptyItem}
        />
        {!showMenu ? (
          <StyledViewChat
            style={{
              borderColor: borderColor,
              backgroundColor: backgroundColor,
            }}
          >
            <StyledInputChat
              testID={inputTestID}
              style={{
                color: fontColor,
                backgroundColor: backgroundColor,
              }}
              // @ts-ignore
              ref={input1}
              onFocus={(): void => setShowMenu(false)}
              multiline={true}
              placeholder={placeholder}
              placeholderTextColor={placeholderTextColor}
              value={message}
              defaultValue={message}
              onChangeText={onChangeMessage}
            />
            <StyledTouchMenu
              testID={touchTestID}
              onPress={(): void => setShowMenu(true)}
            >
              {optionView}
            </StyledTouchMenu>
            <View
              style={{
                flex: 1,
                marginVertical: 8,
              }}
            >
              {renderSendButton ? renderSendButton() : null}
            </View>
          </StyledViewChat>
        ) : null}
      </StyledKeyboardAvoidingView>
      {showMenu ? (
        <StyledViewBottom>
          <StyledViewChat
            style={{
              borderColor: borderColor,
              backgroundColor: backgroundColor,
            }}
          >
            <StyledInputChat
              testID={inputTestID}
              // @ts-ignore
              ref={input2}
              onFocus={(): void => setShowMenu(false)}
              style={{
                color: fontColor,
                backgroundColor: backgroundColor,
              }}
              multiline={true}
              placeholder={placeholder}
              placeholderTextColor={placeholderTextColor}
              value={message}
              defaultValue={message}
            />
            <StyledTouchMenu
              testID={touchTestID}
              onPress={(): void => setShowMenu(false)}
            >
              {optionView}
            </StyledTouchMenu>
            <View
              style={{
                flex: 1,
                marginVertical: 8,
              }}
            >
              {renderSendButton ? renderSendButton() : null}
            </View>
          </StyledViewChat>
          <StyledViewMenu
            testID="viewMenu"
            height={keyboardHeight}
            style={{
              backgroundColor: backgroundColor,
            }}
          >
            {renderViewMenu ? renderViewMenu() : null}
          </StyledViewMenu>
        </StyledViewBottom>
      ) : null}
    </>
  );
}

/* eslint-disable */
Shared.defaultProps = {
  chats: [],
  keyboardOffset: 0,
  optionView: <View />,
  emptyItem: <View />,
  renderItem: (): React.ReactElement => <View />,
  renderViewMenu: (): React.ReactElement => <View />,
  message: '',
  onChangeMessage: () => {},
  placeholder: '',
  renderSendButton: (): React.ReactElement => <View />,
};
/* eslint-enable */

export default Shared;
