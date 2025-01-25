import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  list: {
    paddingBottom: 120,
  },
    row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#f9f9f9',
    marginBottom: 5,
    borderRadius: 5,
  },
  sectionSpacing: {
    height: 20,
},
checkboxRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginVertical: 10,
},
divider: {
  height: 1,
  backgroundColor: "#ccc",
  marginVertical: 20,
  width: "100%",
},
checkboxLabel: {
  marginLeft: 10,
  fontSize: 16,
},
keepAfterWipeText: {
  fontSize: 12,
  color: 'green',
  marginTop: 5,
},
confirmButton: {
  backgroundColor: 'green',
  padding: 10,
  borderRadius: 5,
  alignItems: 'center',
  marginTop: 10,
},

confirmButtonText: {
  color: 'white',
  fontSize: 16,
  fontWeight: 'bold',
},
  removeButton: {
  backgroundColor: 'red',
  padding: 10,
  borderRadius: 5,
  alignItems: 'center',
  marginTop: 10,
},
removeButtonText: {
  color: 'white',
  fontSize: 16,
  fontWeight: 'bold',
},
  rowText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  rowSubText: {
    fontSize: 14,
    color: 'gray',
  },
  button: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 320,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginRight: 5,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#28a745',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  passwordTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  noContactsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noContactsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'gray',
    marginBottom: 10,
  },
  noContactsSubText: {
    fontSize: 14,
    color: 'gray',
  },
});

export default styles;
