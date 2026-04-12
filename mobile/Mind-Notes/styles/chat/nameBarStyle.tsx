import { Colors } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const nameBarStyle = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondaryButton,
    paddingVertical: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 12,
  },
  backButton: {
    padding: 8,
    marginRight: 4,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
  },
  status: {
    fontSize: 12,
    color: Colors.principal,
    marginTop: 2,
  },
});
