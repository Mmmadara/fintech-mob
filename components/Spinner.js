import {ActivityIndicator, StyleSheet, View} from 'react-native';

const Spinner = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color="#002C67" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Spinner;