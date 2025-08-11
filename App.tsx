import React, { useRef } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Alert, Linking, } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';

function App(): React.JSX.Element {
  const siteUrl = 'https://reaislisting.com.br/';
  const statusBarColor = '#F46001';
  const webViewRef = useRef<WebView>(null);

  // --- Funções Auxiliares ---
  const isWhatsAppUrl = (url: string) =>
    url.startsWith('whatsapp://') ||
    url.startsWith('https://wa.me/') ||
    url.startsWith('https://api.whatsapp.com/');

  const isKnownExternalUrl = (url: string) => {
    const externalLinks = [
      'https://www.facebook.com/',
      'https://twitter.com/',
      'https://x.com/',
      'https://instagram.com/',
      'https://app.reaisystems.com.br/imovel/imprimir',
      'https://app.reaisystems.com.br/empresa/perfil',
      'https://www.google.com/'
    ];
    return externalLinks.some(link => url.startsWith(link)) || url.endsWith('.pdf');
  };

  const openWhatsApp = (url: string) => {
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          return Linking.openURL(url);
        }
        const textMatch = url.match(/text=([^&]+)/);
        const text = textMatch ? decodeURIComponent(textMatch[1]) : '';
        const fallbackUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
        return Linking.openURL(fallbackUrl);
      })
      .catch(() => {
        Alert.alert(
          'Erro',
          'Não foi possível abrir o WhatsApp. Verifique se o aplicativo está instalado.'
        );
      });
  };

  const openExternalLink = (url: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('Não foi possível abrir', 'Ocorreu um erro ao tentar abrir o link externo.');
    });
  };

  // --- Lógica da WebView ---
  const handleShouldStartLoadWithRequest = (request: { url: string }) => {
    const { url } = request;

    // Se for link do WhatsApp
    if (isWhatsAppUrl(url)) {
      openWhatsApp(url);
      return false;
    }

    // Se for outros links externos
    if (isKnownExternalUrl(url)) {
      openExternalLink(url);
      return false;
    }

    // Permite toda a navegação interna
    return true;
  };

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
            window.ReactNativeWebView?.postMessage('goBack');
          });

          document.body.appendChild(button);
        }
      }
    });

    true;
  `;

  const handleMessage = (event: WebViewMessageEvent) => {
    if (event.nativeEvent.data === 'goBack') {
      webViewRef.current?.goBack();
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: statusBarColor }]}
    >
      <StatusBar backgroundColor={statusBarColor} barStyle={'light-content'} />
      <WebView
        ref={webViewRef}
        source={{ uri: siteUrl }}
        style={styles.webview}
        onMessage={handleMessage}
        injectedJavaScript={javascriptToInject}
        allowsBackForwardNavigationGestures
        originWhitelist={['*']}
        onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
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