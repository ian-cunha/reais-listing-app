import React, { useRef } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';

function App(): React.JSX.Element {
  const siteUrl = "https://reaislisting.com.br/";
  const statusBarColor = '#F46001';

  const webViewRef = useRef<WebView>(null);

  const javascriptToInject = `
    setTimeout(() => {
      if (window.location.href.includes('app.reaisystems.com.br/')) {
        if (!document.getElementById('back-button')) {
          const button = document.createElement('button');
          button.id = 'back-button';
          button.innerHTML = 'Voltar';

          Object.assign(button.style, {
            position: 'absolute',
            top: '30px',
            left: '15px',
            zIndex: '9999',
            padding: '10px 18px',
            backgroundColor: '${statusBarColor}',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
          });

          button.addEventListener('click', () => {
            window.ReactNativeWebView.postMessage('goBack');
          });

          document.body.appendChild(button);
        }
      }
    });

    true;
  `;

  const handleMessage = (event: WebViewMessageEvent) => {
    if (event.nativeEvent.data === 'goBack') {
      if (webViewRef.current) {
        webViewRef.current.goBack();
      }
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: statusBarColor }]}>
      <StatusBar
        backgroundColor={statusBarColor}
        barStyle={'light-content'}
      />
      <WebView
        ref={webViewRef}
        source={{ uri: siteUrl }}
        style={styles.webview}
        onMessage={handleMessage}
        injectedJavaScript={javascriptToInject}
        allowsBackForwardNavigationGestures={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default App;