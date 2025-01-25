export const lightTheme = {
  background: '#ffffff',
  text: '#000000',
  buttonBackground: '#007AFF',
  buttonText: '#ffffff',
  rowBackground: '#f8f8f8',
  rowBackgroundSelected: '#007AFF',
  rowText: '#000000',
  rowTextSelected: '#ffffff',
  modalBackground: '#ffffff',
  modalOverlay: 'rgba(0, 0, 0, 0.5)',
  danger: '#ff4444',
  border: '#e1e1e1',
};

export const darkTheme = {
  background: '#1c1c1e',
  text: '#ffffff',
  buttonBackground: '#0A84FF',
  buttonText: '#ffffff',
  rowBackground: '#2c2c2e',
  rowBackgroundSelected: '#0A84FF',
  rowText: '#ffffff',
  rowTextSelected: '#ffffff',
  modalBackground: '#2c2c2e',
  modalOverlay: 'rgba(0, 0, 0, 0.7)',
  danger: '#ff453a',
  border: '#3a3a3c',
};

export type Theme = typeof lightTheme;