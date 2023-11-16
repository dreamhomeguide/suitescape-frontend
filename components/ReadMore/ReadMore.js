import React, { memo, useState } from "react";
import { Platform, Text } from "react-native";

const ReadMore = ({
  numberOfLines = 1,
  children,
  readMoreText = "Read More",
  readLessText = "Show Less",
  textStyle,
  linkStyle,
  ...props
}) => {
  const [readMore, setReadMore] = useState(false);
  const [text, setText] = useState({
    length: 0,
    isTruncatedText: false,
  });

  const isiOS = Platform.OS === "ios";
  const isAndroid = Platform.OS === "android";

  function handleReadMoreText(textLayoutLines) {
    let textLength = 0;
    if (textLayoutLines.length > numberOfLines) {
      for (let line = 0; line < numberOfLines; line++) {
        textLength += textLayoutLines[line].text.length;
      }
      setText({ length: textLength, isTruncatedText: true });
      return;
    }
    setText({ length: children.length, isTruncatedText: false });
  }

  return (
    <>
      {/**
       iOS always requires one element without a line number
       to determine the number of lines.
       */}
      {isiOS && (
        <Text
          style={{ height: 0 }}
          onTextLayout={({ nativeEvent: { lines } }) => {
            if (text.length > 0) {
              return;
            }
            if (isiOS) {
              handleReadMoreText(lines);
            }
          }}
        >
          {children}
        </Text>
      )}
      <Text
        selectable
        style={textStyle}
        numberOfLines={text.length === 0 ? numberOfLines : 0}
        onTextLayout={({ nativeEvent: { lines } }) => {
          if (text.length > 0) {
            return;
          }
          if (isAndroid) {
            handleReadMoreText(lines);
          }
        }}
        {...props}
      >
        {text.isTruncatedText && !readMore && text.length !== 0
          ? `${children.slice(0, text.length - 15).trim()}...`
          : children}
        {text.isTruncatedText && (
          <Text style={linkStyle} onPress={() => setReadMore(!readMore)}>
            {" "}
            {readMore ? readLessText : readMoreText}
          </Text>
        )}
      </Text>
    </>
  );
};

export default memo(ReadMore);
