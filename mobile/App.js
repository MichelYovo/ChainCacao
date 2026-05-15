import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Search, Shield, LayoutDashboard, User } from 'lucide-react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.logoText}>ChainCacao Mobile</Text>
          <Text style={styles.subtitle}>Protocole de Traçabilité Togo</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>1,250 kg</Text>
            <Text style={styles.statLabel}>Ma Production</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>98%</Text>
            <Text style={styles.statLabel}>Score EUDR</Text>
          </View>
        </View>

        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem}>
            <LayoutDashboard size={24} color="#2d5a27" />
            <Text style={styles.menuText}>Tableau de Bord</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Search size={24} color="#2d5a27" />
            <Text style={styles.menuText}>Tracer un Lot</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Shield size={24} color="#2d5a27" />
            <Text style={styles.menuText}>Mes Certificats</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <User size={24} color="#2d5a27" />
            <Text style={styles.menuText}>Mon Profil</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Enregistrer une Récolte</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  scroll: {
    padding: 20,
  },
  header: {
    marginTop: 40,
    marginBottom: 30,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2d5a27',
  },
  subtitle: {
    fontSize: 16,
    color: '#8D6E63',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 20,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d5a27',
  },
  statLabel: {
    fontSize: 12,
    color: '#8D6E63',
    marginTop: 4,
    textTransform: 'uppercase',
  },
  menu: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 10,
    marginBottom: 30,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuText: {
    marginLeft: 15,
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  actionButton: {
    backgroundColor: '#2d5a27',
    padding: 18,
    borderRadius: 20,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
