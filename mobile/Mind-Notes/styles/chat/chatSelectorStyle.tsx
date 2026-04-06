import { Colors } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const chatSelectorStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.black,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.principal,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  linkButtonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 13,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    backgroundColor: Colors.white,
    borderRadius: 8,
  },
  selectedItem: {
    backgroundColor: Colors.secondaryButton,
    borderLeftWidth: 4,
    borderLeftColor: Colors.principal,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  chatInfo: {
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
  },
  chatEmail: {
    fontSize: 12,
    color: Colors.principal,
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.principal,
    fontSize: 14,
    marginTop: 32,
  },
});
