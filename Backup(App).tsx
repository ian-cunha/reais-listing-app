import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

function App(): React.JSX.Element {
  const siteUrl = "https://reaislisting.com.br/";
  const statusBarColor = '#F46001';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: statusBarColor }]}>
      <StatusBar
        backgroundColor={statusBarColor}
        barStyle={'light-content'}
      />
      <WebView
        source={{ uri: siteUrl }}
        style={styles.webview}
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