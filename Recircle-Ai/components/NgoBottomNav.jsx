import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useRouter, usePathname } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const BussinessBottomNav = () => {
  const router = useRouter();
  const pathname = usePathname(); // Get the current route

  const navItems = [
    { route: '/Screens/ngo/Home', icon: 'home', label: 'Home' },
    { route: '/Screens/ngo/Request', icon: 'clipboard-check', label: 'Request' },
    { route: '/Screens/ngo/ViewDonationsForNGO', icon: 'hand-coin', label: '', isCenter: true },
    { route: '/shared/CommunityScreen', icon: 'account-group', label: 'Communites' },
    { route: '/Screens/ngo/Profiles', icon: 'account', label: 'Profile' },
  ];

  const handlePress = (route) => {
    router.push(route);
  };

  return (
    <View style={styles.navbar}>
      {navItems.map((item) => {
        const isActive = pathname === item.route;
        console.log('Current Pathname:', pathname);
        return (
          <TouchableOpacity
            key={item.route}
            onPress={() => handlePress(item.route)}
            activeOpacity={0.8}
            style={[styles.navItem, item.isCenter && styles.centerWrapper]}
          >
            {item.isCenter ? (
              <LinearGradient
                colors={['#31DABD', '#26C8E4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.centerButton}
              >
                <IconButton
                  icon={item.icon}
                  size={30}
                  iconColor={'#ffffff'}
                  style={{ margin: 0 }}
                />
              </LinearGradient>
            ) : (
              <View style={styles.iconContainer}>
                <IconButton
                  icon={item.icon}
                  size={isActive ? 26 : 24}
                  iconColor={isActive ? '#31DABD' : '#888'}
                  style={{ margin: 0 }}
                />
                {isActive && <View style={styles.activeIndicator} />}
              </View>
            )}

            {!item.isCenter && item.label ? (
              <Text
                style={[
                  styles.navLabel,
                  isActive && styles.activeNavLabel,
                ]}
              >
                {item.label}
              </Text>
            ) : null}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 80,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    fontSize: 11,
    marginTop: -4,
    color: '#888',
    fontWeight: '500',
  },
  activeNavLabel: {
    color: '#31DABD',
    fontWeight: '600',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -15,
    height: 4,
    width: 20,
    borderRadius: 2,
    backgroundColor: '#31DABD',
  },
  centerWrapper: {
    position: 'relative',
    top: -25,
  },
  centerButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#31DABD',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
});

export default BussinessBottomNav;
