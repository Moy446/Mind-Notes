import { Colors } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const linkedDocumentsStyle = StyleSheet.create({
  container: {
    backgroundColor: Colors.principal,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 8,
    minHeight: 180,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backButton: {
    padding: 4,
  },
  tabs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    flex: 1,
  },
  activeTab: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  inactiveTab: {
    color: Colors.secondaryButton,
    fontSize: 13,
    fontWeight: '600',
  },
  lineDown: {
    marginTop: 6,
    marginBottom: 8,
    height: 3,
    width: 165,
    backgroundColor: Colors.secondaryButton,
  },
  lineDown2: {
    marginTop: 6,
    marginBottom: 8,
    height: 3,
    width: 120,
    backgroundColor: Colors.secondaryButton,
    marginLeft: 180,
  },
  filesContainer: {
    minHeight: 88,
  },
  group: {
    minWidth: 220,
    maxWidth: 260,
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.secondaryButton,
  },
  groupTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.black,
    marginBottom: 6,
  },
  fileItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondaryButton,
  },
  fileName: {
    fontSize: 13,
    color: Colors.white,
    fontWeight: '500',
  },
  fileType: {
    fontSize: 11,
    color: Colors.secondaryButton,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  emptyText: {
    fontSize: 12,
    color: Colors.white,
  },
  paginatorContainer: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paginatorButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  paginatorButtonText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  paginatorText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  paginatorPlaceholder: {
    width: 62,
  },
});
